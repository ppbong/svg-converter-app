// 定义 Electron API 接口
export interface ElectronApi {
  convertSvg: (svgFilePath: string, convertFormat: string, convertSize: string | string[]) => Promise<string>
}

declare global {
  interface Window {
    electronApi: ElectronApi
  }
}