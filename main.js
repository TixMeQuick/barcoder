const electron = require('electron')
const nativeImage = electron.nativeImage
const clipboard = electron.clipboard
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const bwipjs = require('bwip-js')
const {ipcMain} = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }


})


ipcMain.on('barcode-input', (event, arg) => {
  encodeBarcodeInput(event, arg.replace(/\r\n|\r/g, '\n'));
});

ipcMain.on('clipboard-copy', (event, arg) => {
  clipboard.writeImage(nativeImage.createFromDataURL(arg));
});

function encodeBarcodeInput(event, data) {
  bwipjs.toBuffer({
      bcid:           'azteccode',      // Barcode type
      text:           data,   // Text to encode
      // scale:          3,              // 1x
      // height:         10,             // Bar height, in millimeters
      includetext:    true,           // Show human-readable text
      // textxalign:     'center',       // Always good to set this
      // textfont:       'Inconsolata',  // Use your custom font
      // textsize:       13              // Font size, in points
  }, function (err, png) {
      if (err) {
          console.log(err);
      } else {
          // `png` is a Buffer
          // png.length           : PNG file length
          // png.readUInt32BE(16) : PNG image width
          // png.1eadUInt32BE(20) : PNG image height
        event.sender.send('barcode-complete', png.toString('base64'));
      }
  });
}
