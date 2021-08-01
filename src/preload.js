const { contextBridge, ipcRenderer } = require('electron')


async function setupContextBridge() {

  contextBridge.exposeInMainWorld('test', {
    api: {
      async update(limit) {
        console.log('Updating 3Commas data.')
        await ipcRenderer.invoke('api-updateData', limit);
        alert(`Updated Data`)
      },
      async updateBots() {
        console.log('Fetching Bot Data')
        return await ipcRenderer.invoke('api-getBots');
      },
      async getDealsBulk(limit) {
        // console.log('updating the database.')
        return await ipcRenderer.invoke('api-getDealsBulk', limit);
      },
      async getDealsUpdate(limit) {
        console.log('updating threeC deals.')
        return await ipcRenderer.invoke('api-getDealsUpdate', limit);
      }

    },
    config: {
      async get(value) {
        console.log('fetching Config')
        return await ipcRenderer.invoke('allConfig', value);;
      },
      async reset() {
        /**
         * TODO
         * - Add error handling for default config here.
         */
        console.log('attempting to reset the config to default values.')
        await ipcRenderer.invoke('config-clear')
        alert(`Config has been reset`)
      },
      async set(key, value) {
        console.log('writing Config')
        return await ipcRenderer.invoke('setStoreValue', key, value);

      },
      async bulk(changes) {
        console.log('writing Config bulk')
        return await ipcRenderer.invoke('setStoreValue', null, changes);
      }
    },
    database: {
      async query(queryString) {
        console.log('running database query')
        return await ipcRenderer.invoke('query-database', queryString);
      },
      async update(table, updateData) {
        console.log('updating the database.')
        return await ipcRenderer.invoke('update-database', table, updateData);
      },
      async run(query) {
        console.log('running query')
        return await ipcRenderer.invoke('run-database', query);
      }
    },
  })
}



async function databaseSetup() {
  await ipcRenderer.invoke('database-checkOrMakeTables');
}


databaseSetup();

setupContextBridge();