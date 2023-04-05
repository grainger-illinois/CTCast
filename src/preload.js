const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('loggerAPI', {
    logMessage: (message) => ipcRenderer.invoke('log-message', message)
})

contextBridge.exposeInMainWorld('linkEncoderAPI', {
    connectionLinkEncoder: (host, port) => ipcRenderer.invoke('connection-le', host, port),
    sendToLinkEncoder: (caption, host, port) => ipcRenderer.invoke('linkencoder', caption, host, port),
    checkLinkEncoder: () => ipcRenderer.invoke('check-le'),
    clearLinkEncoder: () => ipcRenderer.send('clear-le'),
    preview: (rawText) => ipcRenderer.invoke('preview', rawText),
    getLastMessage: () => ipcRenderer.invoke('le-last-message'),
})

contextBridge.exposeInMainWorld('zoomAPI', {
    zoomCaption: (caption, meetingLink) => ipcRenderer.invoke('zoom-caption', caption, meetingLink),
    clearZoom: () => ipcRenderer.send('clear-zoom'),
    getLastMessage: () => ipcRenderer.invoke('zoom-last-message')
})

contextBridge.exposeInMainWorld('shortcutMap', {
    sendShortcut: (shortcut) => ipcRenderer.invoke('upload-map', shortcut),
    getShortcutMap: () => ipcRenderer.invoke('get-shortcut-map'),
    clearShortcuts: () => ipcRenderer.invoke('clear-shortcuts')
})

contextBridge.exposeInMainWorld('fileExtractionAPI', {
    processFile: (ext, arrayBuffer) => ipcRenderer.invoke('process-file', ext, arrayBuffer)
})


