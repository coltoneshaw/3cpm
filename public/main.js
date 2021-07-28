const {
  app,
  BrowserWindow,
  ipcMain,
  Notification
} = require("electron");


const path = require("path");

const isDev = !app.isPackaged;
const appDataPath = app.getPath('appData')
console.log(appDataPath)


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

// const Store = require('electron-store');

// // establishing a config store.
// const config = new Store();

const { config } = require('../src/utils/config')

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

ipcMain.handle('config-clear', (event, defaultConfig) => {
  return config.clear()
});

// ipcMain.handle('config-checkConfigIsValid', (event) => {
//   return config.set(defaultConfig)
// });


/**
 * 
 *      Database Functions
 * 
 */


const { update, query, checkOrMakeTables, run } = require('../src/server/database')

ipcMain.handle('query-database', (event, queryString) => {
  return query(queryString)
});

ipcMain.handle('update-database', (event, table, updateData) => {
  return update(table, updateData)
});

ipcMain.handle('run-database', (event, table, updateData) => {
  return run(table, updateData)
});

ipcMain.handle('database-checkOrMakeTables', (event) => {
  console.log('attempting to check if tables exist yet.')
  checkOrMakeTables()
});


/**
 * 
 *      3C API functions
 * 
 */


const { updateAPI, bots, getDealsBulk, getDealsUpdate, getAndStoreBotData } = require('../src/server/threeC/index')


ipcMain.handle('api-getDealsBulk', (event, limit) => {
  return getDealsBulk(limit)
});

ipcMain.handle('api-getDealsUpdate', (event, limit) => {
  return getDealsUpdate(limit)
});

ipcMain.handle('api-updateData', async (event, limit) => {
  await updateAPI(limit)
});

ipcMain.handle('api-getBots', async (event) => {
  await getAndStoreBotData()
});