const { contextBridge, ipcRenderer } = require('electron')
// const api = require('../src/server/threeC/api')
// const Store = require('electron-store');

// establishing a config store.
const { update, bots } = require('../src/server/threeC/index')
// console.log(config.store)

const database = require('../src/server/database')

async function setupContextBridge() {
  // const foo = await ipcRenderer.invoke('getStoreValue');

  contextBridge.exposeInMainWorld('electron', {
    api: {
      async update() {
        console.log('Updating 3Commas data.')
        await update()
        alert(`Updated Data`)

      },
      async updateBots() {
        console.log('Fetching Bot Data')
        return await bots()
      }

    },
    config: {
      async get(value) {
        console.log('fetching Config')
        return await ipcRenderer.invoke('allConfig', value);;
      },
      async reset(defaultConfig) {
        /**
         * TODO
         * - Add error handling for default config here.
         */
        await ipcRenderer.invoke('resetConfigValues', defaultConfig);
        alert(`Config has been reset`)

      },
      async set(key, value) {
        console.log('writing Config')
        return await ipcRenderer.invoke('setStoreValue', key, value);

      },
      async bulk(changes) {
        console.log('writing Config bulk')
        await await ipcRenderer.invoke('setStoreValue', null, changes);
      }
    },
    database: {
      async query(queryString) {
        console.log('running database query')
        return await database.query(queryString)

      }
    }

  })
}

setupContextBridge()


// const database = require('../src/server/database');

// // const Store = require('electron-store');

// // // establishing a config store.
// // const config = new Store();


// //fetching from the general set of utils
// // const { config } = require('../src/utils/General')


