const { contextBridge, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('loggerAPI', {
    logMessage: (message) => ipcRenderer.invoke('log-message', message)
})

contextBridge.exposeInMainWorld('linkEncoderAPI', {
    sendToLinkEncoder: (caption, host, port) => ipcRenderer.invoke('linkencoder', caption, host, port),
    clearLinkEncoder: () => ipcRenderer.send('clear-le'),
    getLastMessage: () => ipcRenderer.invoke('le-last-message')
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
    processFile: (ext, arrayBuffer) => {
        if (ext == 'docx') {
            console.log(arrayBuffer);
            const mammoth = require('mammoth');

            /* empty 
            var options = {
                convertImage: mammoth.images.imgElement(function(image) {})
            };
            /* there is an option of arrayBuffer but don't use it*/
            mammoth.convertToHtml({buffer: arrayBuffer}, options).then((result) => {
                console.log(result)
            })
        }
    }
})


