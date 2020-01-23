const electron = require('electron')
const url = require('url')
const path = require('path')
require ('hazardous')

const db = require('./db')
global.database = db

const { app, BrowserWindow, Menu } = electron

let mainWindow

// Remove Menu
Menu.setApplicationMenu(null)

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadURL(url.format({
    pathname: path.join( process.cwd(), '..', 'src', 'views', 'index.html' ),
    protocol: 'file:',
    slashes: true
  }))

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})