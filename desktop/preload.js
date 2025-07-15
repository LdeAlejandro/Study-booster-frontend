const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  sendNotification: (title, body) => {
    new Notification(title, { body });
  }
});

contextBridge.exposeInMainWorld('electron', {
  sendNavigateTo: (url) => ipcRenderer.send('navigate-to', url),
  onNavigateTo: (callback) => ipcRenderer.on('navigate-to', (_, url) => callback(url)),
});