import { app, BrowserWindow, ipcMain } from 'electron'
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import SVGConverter from '@ppbong/svg-converter'
import type { AppConfig, ConvertFormat } from '../types/global'

// 是否为开发环境
const isDev = process.env.NODE_ENV === 'development'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const appConfig : AppConfig = {
  convertFormats: ['PNG', 'ICO', 'ICNS'],
  pngSizeOptions: [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024],
  pngDefaultSize: 16,
  icoSizeOptions: [16, 24, 32, 48, 64, 96, 128, 256],
  icoDefaultSizes: [16, 24, 32, 48, 64],
  icnsSizeOptions: [16, 32, 64, 128, 256, 512],
  icnsDefaultSizes: [16, 32, 64, 128, 256, 512],
}

// 数据目录
const dataDir = isDev ? path.join(__dirname, '..', 'data') : path.join(process.resourcesPath, '..','data')
// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// 主窗口
let mainWindow: BrowserWindow | null = null

// 创建主窗口
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 760,
    minWidth: 1200,
    minHeight: 760,
    maxWidth: 1200,
    maxHeight: 760,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '..', 'preload', 'index.mjs'),
    },
  })

  // 加载渲染进程 HTML 文件
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    // 打开开发工具
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'))
  }
}

// 禁用硬件加速
app.disableHardwareAcceleration()

// 当 Electron 完成初始化并准备创建浏览器窗口时调用
app.whenReady().then(() => {
  // 处理应用配置请求
  ipcMain.handle('app-config', async (_event) => {
    return { success: true, message: '应用配置获取成功', appConfig }
  })

  // 处理文件选择请求
  ipcMain.handle('svg-select', async (_event, svgFileName: string, svgFileContent: string) => {
    if (!svgFileName || !svgFileContent || !svgFileName.endsWith('.svg')) {
      return { success: false, message: '请选择要转换的 SVG 文件', filePath: '' }
    }

    const svgFilePath = path.join(dataDir, svgFileName)
    fs.writeFileSync(svgFilePath, svgFileContent)

    return { success: true, message: 'SVG 文件选择成功', filePath: svgFilePath }
  })

  // 处理文件重置请求
  ipcMain.handle('svg-reset', async (_event, svgFileName: string) => {
    const resetFilePath = path.join(dataDir, svgFileName)

    if (!fs.existsSync(resetFilePath)) {
      return { success: false, message: '文件不存在', filePath: '' }
    }

    fs.unlinkSync(resetFilePath)

    return { success: true, message: '文件重置成功', filePath: '' }
  })

  // 处理文件转换请求
  ipcMain.handle('svg-convert', async (_event, svgFileName: string, convertFormat: ConvertFormat, convertSize: number | number[]) => {
    const svgFilePath = path.join(dataDir, svgFileName)

    if (!fs.existsSync(svgFilePath)) {
      return { success: false, message: '请选择要转换的文件', filePath: '', resultFilePath: '' }
    }

    if (!appConfig.convertFormats.includes(convertFormat)) {
      return { success: false, message: '请选择要转换的格式', filePath: '', resultFilePath: '' }
    }

    const svgConverter = new SVGConverter()

    // 固定转换大小为 128px 的预览文件
    const previewFilePath = path.join(dataDir, svgFileName.replace('.svg', '-preview.png'))

    // 转换预览文件
    await svgConverter.toPng(svgFilePath, previewFilePath, { width: 128, height: 128 })

    const resultFilePath = path.join(dataDir, svgFileName.replace('.svg', '.' + convertFormat.toLowerCase()))
    if (fs.existsSync(resultFilePath)) {
      fs.unlinkSync(resultFilePath)
    }   

    if (convertFormat === 'PNG' && typeof convertSize === 'number') {
      if (!appConfig.pngSizeOptions.includes(convertSize)) {
        return { success: false, message: '请输入正确的转换大小', filePath: svgFilePath, resultFilePath: '' }
      }
      // 转换 PNG 格式
      await svgConverter.toPng(svgFilePath, resultFilePath, { width: convertSize, height: convertSize })
    } else if (convertFormat === 'ICO' && Array.isArray(convertSize)) {
      if (!convertSize.every((size) => appConfig.icoSizeOptions.includes(size))) {
        return { success: false, message: '请输入正确的转换大小', filePath: svgFilePath, resultFilePath: '' }
      }
      // 转换 ICO 格式
      await svgConverter.toIco(svgFilePath, resultFilePath, { sizes: convertSize })
    } else if (convertFormat === 'ICNS' && Array.isArray(convertSize)) {
      if (!convertSize.every((size) => appConfig.icnsSizeOptions.includes(size))) {
        return { success: false, message: '请输入正确的转换大小', filePath: svgFilePath, resultFilePath: '' }
      }
      // 转换 ICNS 格式
      await svgConverter.toIcns(svgFilePath, resultFilePath, { sizes: convertSize })
    } else {
        return { success: false, message: '请输入正确的转换参数', filePath: svgFilePath, resultFilePath: '' }
    }

    const resultPreview = fs.readFileSync(previewFilePath, 'base64')
    const resultPreviewUrl = `data:image/png;base64,${resultPreview}`

    return { success: true, message: '转换完成', filePath: svgFilePath, resultFilePath: resultFilePath, resultPreview: resultPreviewUrl }
  })

  createWindow()
})

// 当所有窗口都关闭时退出应用程序（仅在 macOS 上）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 当应用程序被激活时创建窗口（仅在 macOS 上）
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
