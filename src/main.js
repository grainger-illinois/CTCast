/* eslint no-unused-vars: 0 */
const { app, BrowserWindow, ipcMain, session } = require('electron');
const path = require('path');

const commandReplacer = require('./components/commandReplacer');

const { LoggerWriter, ZoomAPI, LinkEncoderAPI, ShortcutMap } = require('./api');
const { extractDocxImageAltText, extractPptxImageAltText } = require('./util/extractAltTextHelpers');

var logger = new LoggerWriter();
var linkencoder = new LinkEncoderAPI();
var zoom = new ZoomAPI();
var shortcutMap = new ShortcutMap();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

async function loggerWriterHandler(logger, message) {
  const res = await logger.sendMessage(message);
  return res;
}

async function linkEncoderConnectionHandler(linkencoder, host, port) {
  const res = await linkencoder.connectAndDisconnect(host, port);
  return res;
}

async function linkEncoderConnectionChecker(linkencoder) {
  const res = await linkencoder.checkConnection();
  return res;
}

async function linkEncoderHandler(linkencoder, caption, host, port) {
  var message = commandReplacer(caption, shortcutMap.shortcuts, '@')
  const res = await linkencoder.sendMessage(message, host, port);
  return res;
}

async function shortcutHandler(shortcut) {
  const res = await shortcutMap.appendToExistingShortcutMap(shortcut);
  return res;
}

async function zoomAPIHandler(zoom, caption, meetingLink) {
  var message = commandReplacer(caption, shortcutMap.shortcuts, '@')

  const res = await zoom.sendMessage(message, meetingLink);
  return res;
}

async function fileProcessHandler(ext, arrayBuffer) {
  var altTextResult;
  var mapForThisFile = new Map();
  switch(ext) {
  case 'docx':
    altTextResult = await extractDocxImageAltText(arrayBuffer);
    for (const [i, slide] of altTextResult.entries()) {
      for (const [j, picture] of slide.entries()) {
        mapForThisFile.set('docx' + shortcutMap.get('docx') + 'p' + j, picture);
        mapForThisFile.set('docx', shortcutMap.get('docx') + 1);

      }
    }
    break;
  case 'pptx':
    altTextResult = await extractPptxImageAltText(arrayBuffer);
    for (const [i, slide] of altTextResult.entries()) {
      for (const [j, picture] of slide.entries()) {
        mapForThisFile.set('pptx' + shortcutMap.get('pptx')  + 's' + i + 'p' + j, picture);
        mapForThisFile.set('pptx', shortcutMap.get('pptx') + 1);
      }
    }
    break;
  }
  
  shortcutMap.appendToExistingShortcutMap(mapForThisFile);
  
}



const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      enableRemoteModule: true
    },
  });
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY); // eslint-disable-line

  // Open the DevTools.
  //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  ipcMain.handle('log-message', async (event, message) => {
    return await loggerWriterHandler(logger, message);
  });

  ipcMain.handle('connection-le', async (event, host, port) => {
    return await linkEncoderConnectionHandler(linkencoder, host, port);
  });

  ipcMain.handle('check-le', async (event) => {
    return await linkEncoderConnectionChecker(linkencoder);
  });
  
  ipcMain.handle('linkencoder', async (event, caption, host, port) => {
    return await linkEncoderHandler(linkencoder, caption, host, port);
  });

  ipcMain.handle('clear-le', async (event) => {
    linkencoder = new LinkEncoderAPI();
  });

  ipcMain.handle('le-last-message', async (event) => {
    return linkencoder.last_message;
  });

  ipcMain.handle('zoom-caption', async (event, caption, meetingLink) => {
    return await zoomAPIHandler(zoom, caption, meetingLink);
  });

  ipcMain.handle('clear-zoom', async (event) => {
    zoom = new ZoomAPI();
  });

  ipcMain.handle('zoom-last-message', async (event) => {
    return zoom.last_message;
  });

  ipcMain.handle('upload-map', async (event, shortcut) => {
    return await shortcutHandler(shortcut);
  });

  ipcMain.handle('get-shortcut-map', async (event) => {
    return shortcutMap.shortcuts;
  });

  ipcMain.handle('clear-shortcuts', async (event) => {
    shortcutMap = new ShortcutMap();
  });

  ipcMain.handle('process-file', async (event, ext, buffer) => {
    return await fileProcessHandler(ext, buffer);
  })

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
