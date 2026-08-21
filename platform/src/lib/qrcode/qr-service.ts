import QRCode from 'qr.js/lib/QRCode';
import ErrorCorrectLevel from 'qr.js/lib/ErrorCorrectLevel';

/**
 * qr-service：第三方 QR Engine 的轻量适配层
 *
 * 职责：
 * 1. 接收原始 payload（不做 trim / encode / 协议修正）
 * 2. 调用 QR Engine 生成统一的 SVG 字符串
 * 3. 提供 SVG / PNG 导出能力
 * 4. 将第三方异常归一化为标准业务错误
 *
 * 数据流：raw payload -> QR Engine -> { svgString } -> Preview / SVG / PNG（同源）
 *
 * v1.0 保持最小抽象，不引入 Config / Renderer / Strategy 体系。
 */

// ===== v1.0 固定参数（不暴露给 UI）=====
const QR_ECC_LEVEL = ErrorCorrectLevel.M; // Error Correction Level: M
const QR_FG_COLOR = '#000000'; // 前景
const QR_BG_COLOR = '#ffffff'; // 背景
const QUIET_ZONE = 4; // 静默区（模块数）
const PNG_SIZE = 1024; // PNG 强制尺寸
const SVG_FILENAME = 'ichenghub-qrcode.svg';
const PNG_FILENAME = 'ichenghub-qrcode.png';

export type QrMode = 'text' | 'url';

// ===== 业务错误码（不泄漏第三方库原始异常）=====
export type QrErrorCode = 'CONTENT_TOO_LONG';

export class QrError extends Error {
  readonly code: QrErrorCode;
  constructor(code: QrErrorCode) {
    super(code);
    this.name = 'QrError';
    this.code = code;
    // 避免把内部 stack / message 透出
    Object.setPrototypeOf(this, QrError.prototype);
  }
}

export interface QrResult {
  // 生成成功后锁定的 SVG 字符串；Preview / SVG / PNG 全部消费这一份
  readonly svgString: string;
}

/**
 * 将字符串按 UTF-8 编码为「二进制字符串」。
 * 与 react-qr-code 的处理方式一致，保证中文 / Emoji 正确编码进 QR Byte 模式。
 * qr.js 的 8BitByte.write 使用 charCodeAt，因此必须先转成每字符 < 256 的二进制串。
 */
function encodeToUtf8BinaryString(input: string): string {
  const bytes = Array.from(new TextEncoder().encode(input));
  let out = '';
  for (let i = 0; i < bytes.length; i++) {
    out += String.fromCharCode(bytes[i] & 0xff);
  }
  return out;
}

/**
 * 核心生成函数：接收原始 payload，返回 SVG 字符串。
 *
 * 注意：
 * - payload 始终使用原始 draft，禁止 trim / encodeURIComponent / 协议补全。
 * - 生成失败时抛出 QrError（CONTENT_TOO_LONG），调用方据此保留旧结果。
 */
export function generateQr(payload: string): QrResult {
  // QR Version: Auto（typeNumber = -1）；ECC：M
  const qr = new QRCode(-1, QR_ECC_LEVEL);
  // UTF-8 二进制串，Mode = Byte
  const binary = encodeToUtf8BinaryString(payload);
  qr.addData(binary, 'Byte');

  try {
    qr.make();
  } catch {
    // qr.js 容量不足时抛 "code length overflow"，统一归一化
    throw new QrError('CONTENT_TOO_LONG');
  }

  const modules = qr.modules;
  const moduleCount = qr.moduleCount;
  const total = moduleCount + QUIET_ZONE * 2; // 含静默区总尺寸

  // 只绘制暗模块路径；背景由全幅 rect 覆盖（含 4 模块静默区白底）
  let fgD = '';
  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (modules[r][c]) {
        fgD += `M${c + QUIET_ZONE} ${r + QUIET_ZONE}l1 0 0 1 -1 0Z`;
      }
    }
  }

  const svgString =
    `<svg xmlns="http://www.w3.org/2000/svg" ` +
    `width="${PNG_SIZE}" height="${PNG_SIZE}" ` +
    `viewBox="0 0 ${total} ${total}" ` +
    `shape-rendering="crispEdges">` +
    `<rect x="0" y="0" width="${total}" height="${total}" fill="${QR_BG_COLOR}"/>` +
    `<path d="${fgD}" fill="${QR_FG_COLOR}"/>` +
    `</svg>`;

  return { svgString };
}

// ===== 下载工具 =====
function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // 异步释放，确保下载已触发
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** 导出 SVG。文件名固定，不参与 payload。 */
export function downloadSvg(svgString: string): void {
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  triggerDownload(blob, SVG_FILENAME);
}

/**
 * 导出 PNG。
 *
 * 基于同一份 svgString（QR 数据本身）栅格化为 1024×1024 高清光栅输出，
 * 而非对低分辨率截图做 CSS 放大。
 * SVG 为矢量，drawImage 在 1024×1024 上 1:1 绘制，模块边缘保持锐利。
 */
export async function downloadPng(svgString: string): Promise<void> {
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  try {
    const img = new Image();
    img.decoding = 'async';

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new QrError('CONTENT_TOO_LONG'));
      img.src = svgUrl;
    });

    const canvas = document.createElement('canvas');
    canvas.width = PNG_SIZE;
    canvas.height = PNG_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new QrError('CONTENT_TOO_LONG');
    }
    // 关闭平滑，保持 QR 模块边缘锐利
    ctx.imageSmoothingEnabled = false;
    // 白底保险（静默区已在 SVG 内，这里双重确保不透明）
    ctx.fillStyle = QR_BG_COLOR;
    ctx.fillRect(0, 0, PNG_SIZE, PNG_SIZE);
    ctx.drawImage(img, 0, 0, PNG_SIZE, PNG_SIZE);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/png')
    );
    if (!blob) {
      throw new QrError('CONTENT_TOO_LONG');
    }
    triggerDownload(blob, PNG_FILENAME);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}

export { SVG_FILENAME, PNG_FILENAME, PNG_SIZE };
