const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('backendAPI', {
    sendRequest: (title) => ipcRenderer.send('send-request', title)
})

contextBridge.exposeInMainWorld('loggerAPI', {
    logMessage: (message) => ipcRenderer.invoke('log-message', message)
})