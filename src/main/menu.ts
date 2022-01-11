import { app, Menu, dialog, BrowserWindow } from 'electron';

const isMac = process.platform === 'darwin'
import log from 'electron-log';

import { deleteAllData, checkOrMakeTables } from '@/main/Database/database';
import { setDefaultConfig, getProfileConfigAll, setProfileConfig } from '@/main/Config/config';

const { win } = require('@/main/main')


const template = [
  // { role: 'appMenu' },
  ...(isMac ? [{
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  // { role: 'fileMenu' },
  {
    label: 'File',
    submenu: [
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  // { role: 'editMenu' }
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  // { role: 'viewMenu' }
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      {
        label: 'Clear Local Storage',
        click() {
          BrowserWindow.getAllWindows().forEach(window => {
            window.webContents
              .executeJavaScript('localStorage.clear();', true)
              .then(() => {
                window.reload()
              });

          })
        },
      },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  // { role: 'windowMenu' }
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Github',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/coltoneshaw/3c-portfolio-manager')
        }
      },
      {
        label: 'BotNerds discord',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://discord.gg/rXQ7PMMu')
        }
      },
      {
        label: 'Submit a feature / bug',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/coltoneshaw/3c-portfolio-manager#feedback-or-bug-submission')
        }
      },
      {
        label: 'Donate',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://www.buymeacoffee.com/ColtonS')
        }
      },
      { type: 'separator' },
      {
        label: 'Delete All Data',
        click: async () => {

          const options = {
            type: 'question',
            buttons: ['Cancel', 'Yes, delete all my data'],
            defaultId: 2,
            title: 'Delete data',
            message: 'Would you like to delete all data?',
            detail: 'Clearing your config here will delete all the data, settings, API keys, etc. Click accept to move forward.'
          };


          const data = await dialog.showMessageBoxSync(win, options)
          if (data === 1) {
            deleteAllData().then(() => setDefaultConfig())
            log.info('deleting all data as selected by the menu bar')

            BrowserWindow.getAllWindows().forEach(window => window.reload())
          }

        }
      },
      {
        label: 'Reset Current Profile',
        click: async () => {
          const currentProfileConfig = await getProfileConfigAll();

          // 1. reset the lastSyncTime in the current profile
          await setProfileConfig('syncStatus.deals.lastSyncTime', null, currentProfileConfig.id)

          // 2. Delete the database for everything pertaining to that profile
          await deleteAllData(currentProfileConfig.id)
          
          // 3. create the new table
          await checkOrMakeTables(currentProfileConfig.id)


          const options = {
            type: 'question',
            buttons: ['Ok'],
            defaultId: 0,
            title: 'Profile Reset Complete',
            message: '',
            detail: 'Profile reset is complete. The page will refresh once you hit okay. You will need to then click the refresh button to download all of your data again. This can take a minute or two.'
          };
          await dialog.showMessageBoxSync(win, options)

          // 4. refresh the page.
          await BrowserWindow.getAllWindows().forEach(window => window.reload())


        }
      },

    ]
  }
]

// @ts-ignore
const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)

export { menu }