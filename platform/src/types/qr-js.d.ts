// qr.js（react-qr-code 的底层引擎）的类型声明
// 该库无官方类型，这里按实际运行时 API 进行最小化声明
declare module 'qr.js/lib/QRCode' {
  export default class QRCode {
    constructor(typeNumber: number, errorCorrectLevel: number);
    addData(data: string, mode?: string): void;
    make(): void;
    modules: boolean[][];
    moduleCount: number;
    typeNumber: number;
  }
}

declare module 'qr.js/lib/ErrorCorrectLevel' {
  const ErrorCorrectLevel: {
    L: number;
    M: number;
    Q: number;
    H: number;
  };
  export default ErrorCorrectLevel;
}
