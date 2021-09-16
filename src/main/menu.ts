const { app, Menu, dialog, BrowserWindow } = require('electron')

const isMac = process.platform === 'darwin'

const {deleteAllData} = require('@/main/Database/database');
const {setDefaultConfig} = require('@/main/Config/config')

const {win} = require('@/main/main')


const template = [
  { role: 'appMenu' },
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
  { role: 'fileMenu' },
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
    //   {
    //     label: 'Clear Cache and Reload',
    //     accelerator: 'Shift+CmdOrCtrl+R',
    //     click() {

    //         win.reload();
    //     },
    // },
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
        

          const data = await dialog.showMessageBoxSync(win, options )
          if(data === 1) {
            console.log('deleting all data')
            // await deleteAllData();
            // await setDefaultConfig();
            BrowserWindow.getAllWindows().forEach(window => window.reload())
          }
          
        }
      },
    ]
  }
]

// @ts-ignore
const menu = Menu.buildFromTemplate(template)
// Menu.setApplicationMenu(menu)

export {menu}