const {
  app,
  BrowserWindow,
  ipcMain,
  Notification
} = require("electron");


const path = require("path");

const isDev = !app.isPackaged;
const appDataPath = app.getPath('appData')





// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {

  // Create the browser window.
  win = new BrowserWindow({
    width: 2500,
    height: 1500,
    title: "Bot Portfolio Manager",
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      worldSafeExecuteJavaScript: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, 'robot.png')

  });

  // Load app
  win.loadFile('./public/index.html');
  win.webContents.openDevTools()


}

if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
  });
}

ipcMain.on('notify', (_, message) => {
  new Notification({ title: 'Notifiation', body: message }).show();
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const Store = require('electron-store');

// establishing a config store.
const config = new Store();

ipcMain.handle('allConfig', (event, value) => {
  if (value != null) return config.get(value)
  return config.store
});

ipcMain.handle('setStoreValue', (event, key, value) => {
  if (key === null) return config.set(value);
  return config.set(key, value);
});

ipcMain.handle('setBulkValues', (event, values) => {
  const newThings = config.set(values)

  console.log(newThings)
  return newThings
});

ipcMain.handle('resetConfigValues', (event, defaultConfig) => {
  config.clear()
  return config.set(defaultConfig)
});

/**
 * 
 *      Database Functions
 * 
 */


const Database = require('better-sqlite3');
const { update, query } = require('../src/server/database')

//config file.
const db_type = config.get('database.type')
console.log(`Database type: ${db_type}`)


const db = new Database(path.join(appDataPath, 'bot-manager', 'db.sqlite3'));
// console.log(db)

ipcMain.handle('query-database', (event, queryString) => {
  return query(queryString)
});

ipcMain.handle('update-database', (event, table, updateData) => {
  return update(db, table, updateData)
});


/**
 * 
 *      3C API functions
 * 
 */

const threeCommasAPI = require('3commas-api-node')

const api = new threeCommasAPI({
  apiKey: config.get('apis.threeC.key'),
  apiSecret: config.get('apis.threeC.secret')
})

const { getDealsBulk,
  getDealsUpdate,
  getAccountDetail,
  deals } = require('../src/server/threeC/api')

const { updateAPI, bots } = require('../src/server/threeC/index')


ipcMain.handle('api-getDealsBulk', (event, limit) => {
  return getDealsBulk(api, limit)
});

ipcMain.handle('api-getDealsUpdate', (event, limit) => {
  return getDealsUpdate(api, config, limit)
});

/**
 * this manages the updating of data. It kicks off a process to update deals and account details.
 * 
 * Can be broken into another file if needed, but would need to pass the proper functions here.
 */
ipcMain.handle('api-updateData', async (event, limit) => {
  await deals(api, config, limit)
    .then(data => {
      console.log('made it back here')
      update(db, 'deals', data)
    })

  await getAccountDetail(api)
    .then(data => {
      update(db, 'accountData', data)
    })
});


ipcMain.handle('api-getBots', async (event) => {
  return await bots(api)
});