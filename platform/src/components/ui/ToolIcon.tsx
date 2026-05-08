'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ToolIconProps {
  url: string;
  title: string;
  iconUrl?: string;
}

const COLOR_PALETTES = [
  { bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { bg: 'bg-blue-50', text: 'text-blue-600' },
  { bg: 'bg-green-50', text: 'text-green-600' },
  { bg: 'bg-pink-50', text: 'text-pink-600' },
  { bg: 'bg-orange-50', text: 'text-orange-600' },
  { bg: 'bg-red-50', text: 'text-red-600' },
  { bg: 'bg-teal-50', text: 'text-teal-600' },
  { bg: 'bg-violet-50', text: 'text-violet-600' },
];

function getColorPalette(title: string): typeof COLOR_PALETTES[0] {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLOR_PALETTES[Math.abs(hash) % COLOR_PALETTES.length];
}

const getDomain = (urlString: string): string => {
  try {
    const url = new URL(urlString);
    return url.hostname.replace('www.', '');
  } catch {
    return urlString;
  }
};

export function ToolIcon({ url, title, iconUrl }: ToolIconProps) {
  const [currentProviderIndex, setCurrentProviderIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const palette = getColorPalette(title);
  const initial = title.charAt(0).toUpperCase();
  const domain = getDomain(url || 'example.com');

  // 验证 iconUrl 是否为有效的 http/https URL，并将 HTTP 转换为 HTTPS
  const normalizedIconUrl = iconUrl?.startsWith('http://') ? iconUrl.replace('http://', 'https://') : iconUrl;
  const isValidIconUrl = normalizedIconUrl && (normalizedIconUrl.startsWith('http://') || normalizedIconUrl.startsWith('https://'));

  // 构建图标 URL 列表
  const faviconProviders = [
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    `https://favicon.yandex.net/favicon/${domain}`,
    `https://api.faviconkit.com/${domain}/128`,
  ];

  // 如果提供了有效的 iconUrl，优先使用；否则使用 favicon 服务
  const iconUrls = isValidIconUrl ? [normalizedIconUrl!, ...faviconProviders] : faviconProviders;
  const finalIconUrl = iconUrls[currentProviderIndex];

  const handleImageError = () => {
    if (currentProviderIndex < iconUrls.length - 1) {
      // 尝试下一个图标服务
      setCurrentProviderIndex(prev => prev + 1);
    } else {
      // 所有服务都失败，显示字母
      setImageError(true);
      setImageLoaded(false);
    }
  };

  const handleImageLoad = () => {
    // 图片加载成功
    setImageLoaded(true);
    setImageError(false);
  };

  return (
    <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
      {/* 背景容器 - 图片加载前显示字母背景 */}
      <div className={`absolute inset-0 ${!imageLoaded ? palette.bg : 'bg-gray-100'}`} />

      {/* 初始字母占位 - 图片加载前或加载失败时显示 */}
      {(!imageLoaded || imageError) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`font-bold text-xl ${palette.text}`}>
            {initial}
          </span>
        </div>
      )}

      {/* 图片 - 使用 Next.js Image 组件 */}
      <Image
        src={finalIconUrl}
        alt={title}
        fill
        sizes="48px"
        className={`object-cover transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        unoptimized={true}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />

      {/* hover 效果层 */}
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
    </div>
  );
}
