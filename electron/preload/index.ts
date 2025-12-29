import { contextBridge, ipcRenderer } from 'electron'
import type { ElectronApi, ConvertFormat } from '../types/global'

const electronApi: ElectronApi = {
  getAppConfig: () => ipcRenderer.invoke('app-config'),
  selectSvgFile: (svgFileName: string, svgFileContent: string) => ipcRenderer.invoke('svg-select', svgFileName, svgFileContent),
  resetSvgFile: (svgFileName: string) => ipcRenderer.invoke('svg-reset', svgFileName),
  convertSvg: (svgFileName: string, convertFormat: ConvertFormat, convertSize: number | number[]) => ipcRenderer.invoke('svg-convert', svgFileName, convertFormat, convertSize),
}

contextBridge.exposeInMainWorld('electronApi', electronApi)
