'use strict'

import {app, protocol, globalShortcut, BrowserWindow, ipcMain, WebContents} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import {autoUpdater} from 'electron-updater'

const isDevelopment = process.env.NODE_ENV !== 'production'
let win: BrowserWindow | null
let webContents: WebContents
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}])

const feedUrl = 'http://127.0.0.1/' // 更新包位置

function createWindow() {
  // 创建浏览器窗口
  win = new BrowserWindow({
    width: 800, height: 600, webPreferences: {
      nodeIntegration: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // 如果处于开发模式，则加载dev服务器的url
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) {
      BrowserWindow.addDevToolsExtension('./DevTool')
    }
  } else {
    createProtocol('app')
    // 在未开发时加载index.html
    win.loadURL('app://./index.html')
  }

  webContents = win.webContents

  win.on('closed', () => {
    win = null
  })
}

// 主进程监听渲染进程传来的信息
ipcMain.on('update', (e, arg) => {
  console.log('update')
  checkForUpdates()
})
let checkForUpdates = () => {
  // 配置安装包远端服务器
  autoUpdater.setFeedURL(feedUrl)

  // 下面是自动更新的整个生命周期所发生的事件
  autoUpdater.on('error', (message) => {
    sendUpdateMessage('error', message)
  })
  autoUpdater.on('checking-for-update', (message) => {
    sendUpdateMessage('checking-for-update', message)
  })
  autoUpdater.on('update-available', (message) => {
    sendUpdateMessage('update-available', message)
  })
  autoUpdater.on('update-not-available', (message) => {
    sendUpdateMessage('update-not-available', message)
  })

  // 更新下载进度事件
  autoUpdater.on('download-progress', (progressObj) => {
    sendUpdateMessage('downloadProgress', progressObj)
  })
  // 更新下载完成事件
  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) => {
    sendUpdateMessage('isUpdateNow')
    ipcMain.on('updateNow', (e, arg) => {
      autoUpdater.quitAndInstall()
    })
  })

  //执行自动更新检查
  autoUpdater.checkForUpdates()
}

// 主进程主动发送消息给渲染进程函数
function sendUpdateMessage(message: string, data: any = '') {
  console.log({message, data})
  webContents.send('message', {message, data})
}


// 关闭所有窗口后退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

app.on('ready', async () => {
  createWindow()
  //CTRL+E打开调制工具
  globalShortcut.register('CommandOrControl+E', () => {
    win.webContents.openDevTools()
  })
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
