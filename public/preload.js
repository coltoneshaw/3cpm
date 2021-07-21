const { ipcRenderer, contextBridge } = require('electron');
const api = require('../src/server/threeC/api')
const threeC = require('../src/server/threeC/index')

const config = require('../src/utils/config')
const database = require('../src/server/database');

contextBridge.exposeInMainWorld('electron', {
  data: {
    async fetch() {
      console.log('fetching shit')
      return await api.bots()
    }
  },
  api : {
    async update(){
      console.log('Updating 3Commas data.')
      await threeC.update()
    }

  },
  config: {
    async get() {
      console.log('fetching Config')
      return await config.all();

    },
    async reset() {
      console.log('fetching Config')
      await config.reset();
    },
    async set(key, value) {
      console.log('writing Config')
      return await config.set(key, value);
    },
    async bulk(changes) {
      console.log('writing Config bulk')
      await config.bulk(changes);
    },

  },
  database: {
    async query(queryString) {
      console.log('running database query')
      return await database.query(queryString)

    }
  }

})
