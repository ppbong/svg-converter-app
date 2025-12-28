import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import url from 'node:url'
import SVGConverter from '@ppbong/svg-converter'

// 是否为开发环境
const isDev = process.env.NODE_ENV === 'development'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 主窗口
let mainWindow: BrowserWindow | null = null

// 创建主窗口
const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, '../preload/index.mjs'),
    },
  })

  // 加载渲染进程 HTML 文件
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    // 打开开发工具
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }
}

// 禁用硬件加速
app.disableHardwareAcceleration()

// 当 Electron 完成初始化并准备创建浏览器窗口时调用
app.whenReady().then(() => {
  // 处理 IPC 事件
  ipcMain.handle('svg-convert', async (_event, svgFilePath: string, convertFormat: string, convertSize: string | string[]) => {
    // 转换后的文件将保存在与 SVG 文件相同的目录中
    const outputDir = path.dirname(svgFilePath)
    // 转换后的文件名将与 SVG 文件相同，只是扩展名不同
    const outputFileName = path.basename(svgFilePath, path.extname(svgFilePath)) + '.' + convertFormat.toLowerCase()
    const outputFilePath = path.join(outputDir, outputFileName)

    const convertOptions = {} as any

    if (convertFormat === 'PNG' && typeof convertSize === 'string') {
      const pngSize = parseInt(convertSize)
      if (isNaN(pngSize)) {
        return '请输入正确的转换大小'
      }
      
      convertOptions.width = pngSize
      convertOptions.height = pngSize
    } else {
      const sizes = convertSize instanceof Array ? convertSize.map((size) => parseInt(size)) : [ parseInt(convertSize) ]
      if (sizes.some((size) => isNaN(size))) {
        return '请输入正确的转换大小'
      }

      convertOptions.size = sizes
    }

    const svgConverter = new SVGConverter()
    
    if (convertFormat === 'PNG') {
      await svgConverter.toPng(svgFilePath, outputFilePath, convertOptions)
    } else if (convertFormat === 'ICO') {
      await svgConverter.toIco(svgFilePath, outputFilePath, convertOptions)
    } else if (convertFormat === 'ICNS') {
      await svgConverter.toIcns(svgFilePath, outputFilePath, convertOptions)
    } else {
        return '不支持的转换格式'
    }

    return '转换完成'
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