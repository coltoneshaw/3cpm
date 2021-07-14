const { ipcRenderer, contextBridge } = require('electron');
const api = require('../src/server/3commas')

contextBridge.exposeInMainWorld('electron', {
  data: {
    async fetch() {
      console.log('fetching shit')
      return await api.bots()
    }
  },
  notificationApi: {
    sendNotification(message) {
      console.log('hey')
      ipcRenderer.send('notify', message);
    }
  },
  filesApi: {

  }
})