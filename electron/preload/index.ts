import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronApi', {
  convertSvg: (svgFilePath: string, convertFormat: string, convertSize: string | string[]) => ipcRenderer.invoke('svg-convert', svgFilePath, convertFormat, convertSize),
})