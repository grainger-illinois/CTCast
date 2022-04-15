const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('backendAPI', {
    sendRequest: (title) => ipcRenderer.send('send-request', title)
})

contextBridge.exposeInMainWorld('loggerAPI', {
    logMessage: (message) => ipcRenderer.invoke('log-message', message)
})

contextBridge.exposeInMainWorld('linkEncoderAPI', {
    sendToLinkEncoder: (caption, port) => ipcRenderer.invoke('linkencoder', caption, port)
})