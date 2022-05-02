const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const { LoggerWriter, ZoomAPI, LinkEncoderAPI } = require('./api');

var logger = new LoggerWriter();
var linkencoder = new LinkEncoderAPI();
var zoom = new ZoomAPI();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

async function loggerWriterHandler(logger, message) {
  const res = await logger.sendMessage(message);
  return res;
}

async function linkEncoderHandler(linkencoder, caption, host, port) {
  const res = await linkencoder.sendMessage(caption, host, port);
  return res;
}

async function zoomAPIHandler(zoom, caption, meetingLink) {
  const res = await zoom.sendMessage(caption, meetingLink);
  return res;
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      enableRemoteModule: true
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  ipcMain.handle('log-message', async (event, message) => {
    return await loggerWriterHandler(logger, message);
  });
  
  ipcMain.handle('linkencoder', async (event, caption, host, port) => {
    return await linkEncoderHandler(linkencoder, caption, host, port);
  });

  ipcMain.handle('zoom-caption', async (event, caption, meetingLink) => {
    return await zoomAPIHandler(zoom, caption, meetingLink);
  });

  createWindow();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
