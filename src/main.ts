import { app, BrowserWindow, ipcMain } from 'electron';
import isDev from 'electron-is-dev'; // New Import

import { update, query, checkOrMakeTables, run } from './server/database';


const createWindow = (): void => {
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  console.log(isDev);
  win.loadURL(
    isDev
      ? 'http://localhost:9000'
      : `file://${app.getAppPath()}/index.html`,
  );
}

app.on('ready', createWindow);


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

ipcMain.handle('run-database', (event, queryString) => {
  return run(queryString)
});

ipcMain.handle('database-checkOrMakeTables', (event) => {
  console.log('attempting to check if tables exist yet.')
  checkOrMakeTables()
});

