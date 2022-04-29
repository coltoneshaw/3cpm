import { app, BrowserWindow, ipcMain, shell, Menu } from 'electron';
import { config } from '@/main/Config/config';
import log from 'electron-log';
import path from "path";
const isDev = !app.isPackaged;
import { menu } from './menu';
import { update, query, checkOrMakeTables, run, deleteAllData, upsert } from '@/main/Database/database';
let win: BrowserWindow;

import { default as installExtension, REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

import contextMenu from 'electron-context-menu';

contextMenu();

const createWindow = (): void => {
  win = new BrowserWindow({
    width: 1500,
    height: 1000,
    title: "Bot Portfolio Manager",
    // icon: path.join(__dirname, '../assets/icons/icon.png'),
    webPreferences: {
      spellcheck: true,
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      // enableRemoteModule: false, // turn off remote
      // worldSafeExecuteJavaScript: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // icon: appIcon

  });

  Menu.setApplicationMenu(menu)

  let loadURL = `file://${__dirname}/index.html`
  if (isDev) {

    // Errors are thrown if the dev tools are opened
    // before the DOM is ready
    win.webContents.once("dom-ready", async () => {
        await installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
            .then((name:any) => console.log(`Added Extension:  ${name}`))
            .catch((err:any) => console.log("An error occurred: ", err))
            .finally( () => win.webContents.openDevTools() )

    });
    loadURL = 'http://localhost:9000';

}


  win.loadURL(loadURL);
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

ipcMain.handle('preload-check', (event, link) => {
  preloadCheck()
});


ipcMain.handle('allConfig', (event, value:string ) => {
  if (value  != 'all') return config.get(value)
  return config.store
});

ipcMain.handle('setStoreValue', (event, key:string, value:any) => config.set(key, value));
ipcMain.handle('setBulkValues', (event, values) => config.set(values) );

ipcMain.handle('config-clear', () =>config.clear());



/**
 * 
 *      Database Functions
 * 
 */



ipcMain.handle('query-database', async (event, profileId:string, queryString) => await query(profileId, queryString) );

ipcMain.handle('update-database', (event,  profileId:string, table, updateData): void => update(profileId, table, updateData));

ipcMain.handle('upsert-database', (event,  profileId:string, table: string, data: any[], id: string, updateColumn: string): void => upsert(table, data, id, updateColumn, profileId));

ipcMain.handle('run-database', (event,  profileId:string, queryString): void => run(profileId, queryString));

ipcMain.handle('database-deleteAll', async (event, profileID?: string): Promise<void> => await deleteAllData(profileID));

ipcMain.handle('database-checkOrMakeTables', async (event, profileId:string): Promise<void> => {
  log.log('attempting to check if tables exist yet.')
  checkOrMakeTables(profileId)
});


/**
 * 
 *      3C API functions
 * 
 */

import { updateAPI, getAndStoreBotData, getAccountSummary, getDealOrders, updateDeal } from '@/main/3Commas/index';
import { UpdateDealRequest } from "@/main/3Commas/types/Deals";
import { Type_Profile } from '@/types/config'

ipcMain.handle('api-updateData', async (event, type, options, profileData: Type_Profile): Promise<ReturnType<typeof updateAPI>> => {
  return await updateAPI(type, options, profileData)
});

ipcMain.handle('api-getBots', async (event, profileData: Type_Profile): Promise<void> => {
  await getAndStoreBotData(profileData)
});

ipcMain.handle('api-getAccountData', async (event, profileData: Type_Profile, key?: string, secret?: string, mode?: string) => {
  return await getAccountSummary(profileData, key, secret, mode)
});

ipcMain.handle('api-getDealOrders', async (event, profileData: Type_Profile, deal_id: number) => {
  return await getDealOrders(profileData, deal_id)
});




ipcMain.handle('api-deals-update', async (event, profileData: Type_Profile, deal: UpdateDealRequest) => {
  return await updateDeal(profileData, deal)
});

/************************************************************************
 * 
*
*                     Binance API
 * 
*
*************************************************************************/

import { fetchCoinPricesBinance } from '@/app/Features/CoinPriceHeader/BinanceApi';

ipcMain.handle('binance-getCoins', async (event) => {
  return await fetchCoinPricesBinance()
});

import { fetchVersions } from '../app/Features/UpdateBanner/UpdateApiFetch';
import { preloadCheck } from './precheck';

ipcMain.handle('pm-versions', async (event) => {
  return await fetchVersions()
});

export { win }