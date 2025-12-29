/**
 * 定义转换格式类型
 */
declare type ConvertFormat = 'PNG' | 'ICO' | 'ICNS'

/**
 * 应用配置接口
 * @property {ConvertFormat[]} convertFormats - 支持的转换格式
 * @property {number[]} pngSizeOptions - PNG 格式的尺寸选项
 * @property {number} pngDefaultSize - PNG 格式的默认尺寸
 * @property {number[]} icoSizeOptions - ICO 格式的尺寸选项
 * @property {number[]} icoDefaultSizes - ICO 格式的默认尺寸
 * @property {number[]} icnsSizeOptions - ICNS 格式的尺寸选项
 * @property {number[]} icnsDefaultSizes - ICNS 格式的默认尺寸
 */
declare interface AppConfig {
  convertFormats: ConvertFormat[],
  pngSizeOptions: number[],
  pngDefaultSize: number,
  icoSizeOptions: number[],
  icoDefaultSizes: number[],
  icnsSizeOptions: number[],
  icnsDefaultSizes: number[],
}

/**
 * IPC 响应接口
 * @property {boolean} success - 请求是否成功
 * @property {string} message - 响应消息
 * @property {AppConfig} appConfig - 应用配置（如果成功）
 * @property {string} filePath - 转换源文件路径（如果成功）
 * @property {string} resultPreview - 转换结果预览（如果成功）
 * @property {string} resultFilePath - 转换结果文件路径（如果成功）
 */
declare interface IpcResponse {
  success: boolean
  message: string
  appConfig?: AppConfig
  filePath?: string
  resultPreview?: string
  resultFilePath?: string
}

/**
 * Electron API 接口
 */
declare interface ElectronApi {
  // 获取应用配置
  getAppConfig: () => Promise<IpcResponse>
  // 选择 SVG 文件
  selectSvgFile: (svgFileName: string, svgFileContent: string) => Promise<IpcResponse>
  // 重置 SVG 文件
  resetSvgFile: (svgFileName: string) => Promise<IpcResponse>
  // 转换 SVG 文件
  convertSvg: (svgFileName: string, convertFormat: ConvertFormat, convertSize: number | number[]) => Promise<IpcResponse>
}

export type {
    ConvertFormat,
    AppConfig,
    IpcResponse,
    ElectronApi,
}