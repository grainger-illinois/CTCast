const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('loggerAPI', {
    logMessage: (message) => ipcRenderer.invoke('log-message', message)
})

contextBridge.exposeInMainWorld('linkEncoderAPI', {
    sendToLinkEncoder: (caption, host, port) => ipcRenderer.invoke('linkencoder', caption, host, port)
})

contextBridge.exposeInMainWorld('zoomAPI', {
    zoomCaption: (caption, meetingLink) => ipcRenderer.invoke('zoom-caption', caption, meetingLink)
})

contextBridge.exposeInMainWorld('uploadMap', {
    sendShortcut: (shortcut) => ipcRenderer.invoke('upload-map', shortcut)
})