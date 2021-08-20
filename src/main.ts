import { app, BrowserWindow, ipcMain, shell } from 'electron';
// import isDev from 'electron-is-dev'; // New Import

const path = require("path");
const isDev = !app.isPackaged;


const { update, query, checkOrMakeTables, run, deleteAllData, upsert } = require( '@/app/Features/Database/database');

let win;

const installExtensions = async () => {
  const installer = require('electron-devtools-installer')
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS',
    'DEVTRON'
  ]

  return Promise
    .all(extensions.map(name => installer.default(installer[name], forceDownload)))
    .catch(console.log)
}

const createWindow = (): void => {
  win = new BrowserWindow({
    width: 1500,
    height: 1000,
    title: "Bot Portfolio Manager",
    // icon: path.join(__dirname, '../assets/icons/icon.png'),
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      worldSafeExecuteJavaScript: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // icon: appIcon

  });

  console.log(isDev);

  if (isDev) {
		win.webContents.openDevTools();
    installExtensions()
    win.loadURL('http://localhost:9000');

	} else {
    win.loadURL(`file://${__dirname}/index.html`);

  }


}

app.on('ready', createWindow);
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

ipcMain.handle('open-external-link', (event, link) => {
  shell.openExternal(link)
});

import { config } from './utils/config';

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
  return newThings
});

ipcMain.handle('config-clear', (event) => {
  return config.clear()
});



/**
 * 
 *      Database Functions
 * 
 */



 ipcMain.handle('query-database', (event, queryString) => {

  return query(queryString)
});

ipcMain.handle('update-database', (event, table, updateData) => {
  return update(table, updateData)
});

ipcMain.handle('upsert-database', (event, table:string, data:any[], id:string, updateColumn:string) => {
  return upsert(table, data, id, updateColumn)
});

ipcMain.handle('run-database', (event, queryString) => {
  return run(queryString)
});

ipcMain.handle('database-deleteAll', (event) => {
  deleteAllData()
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

 const { updateAPI, bots, getDealsBulk, getDealsUpdate, getAndStoreBotData, getAccountSummary } = require('@/app/Features/3Commas/API/index');


 ipcMain.handle('api-getDealsBulk', (event, limit) => {
   return getDealsBulk(limit)
 });
 
 ipcMain.handle('api-getDealsUpdate', (event, limit) => {
   return getDealsUpdate(limit)
 });
 
 ipcMain.handle('api-updateData', async (event, type, options) => {
   await updateAPI(type, options)
 });

 ipcMain.handle('api-getAccountData', async (event, key?:string, secret?:string) => {
  return await getAccountSummary(key, secret)
});
 
 ipcMain.handle('api-getBots', async (event) => {
   await getAndStoreBotData()
 });


 /************************************************************************
  * 
  * 
  *                     Push Notification Settings
  * 
  * 
  *************************************************************************/