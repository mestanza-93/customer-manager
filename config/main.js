const electron = require('electron')
const url = require('url')
const path = require('path')

const db = require('./db')
global.database = db
console.log(db.connect().customer);

const { app, BrowserWindow, ipcMain } = electron

// Mantén una referencia global del objeto window, si no lo haces, la ventana 
// se cerrará automáticamente cuando el objeto JavaScript sea eliminado por el recolector de basura.
let mainWindow

function createWindow () {
  // Crea la ventana del navegador.
  mainWindow = new BrowserWindow({
    width: 1800,
    height: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // y carga el index.html de la aplicación.
  mainWindow.loadURL(url.format({
    pathname: path.join( __dirname, '..', 'src', 'views', 'index.html' ),
    protocol: 'file:',
    slashes: true
  }))

  // Abre las herramientas de desarrollo (DevTools).
  mainWindow.webContents.openDevTools()

  // Emitido cuando la ventana es cerrada.
  mainWindow.on('closed', () => {
    // Elimina la referencia al objeto window, normalmente  guardarías las ventanas
    // en un vector si tu aplicación soporta múltiples ventanas, este es el momento
    // en el que deberías borrar el elemento correspondiente.
    mainWindow = null
  })
}

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador.
// Algunas APIs pueden usarse sólo después de que este evento ocurra.
app.on('ready', createWindow)

// Sal cuando todas las ventanas hayan sido cerradas.
app.on('window-all-closed', () => {
  // En macOS es común para las aplicaciones y sus barras de menú
  // que estén activas hasta que el usuario salga explicitamente con Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // En macOS es común volver a crear una ventana en la aplicación cuando el
  // icono del dock es clicado y no hay otras ventanas abiertas.
  if (mainWindow === null) {
    createWindow()
  }
})