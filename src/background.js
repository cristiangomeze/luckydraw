'use strict'

import { app, protocol, BrowserWindow, dialog, ipcMain, webContents } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { readFileSync } from 'original-fs'
import { autoUpdater } from 'electron-updater'
import fetch from 'electron-fetch'
import fs from 'fs';
import sqlite3 from 'sqlite3';

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const database = isDevelopment
  ? new sqlite3.Database(':memory:')
  : new sqlite3.Database('./db.sqlite3');

database.run('CREATE TABLE IF NOT EXISTS `winners` (`id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, `winners` TEXT NOT NULL, `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL)');

ipcMain.on('openParticipantsFile', (event, payload) => {
  openParticipantsFile()
});

function openParticipantsFile() {
  const selectedParticipantFiles = dialog.showOpenDialogSync({
    title: 'Seleccione su archivo de participante',
    filters: [
      {
       name: 'Text Files',
       extensions: ['txt'] 
      }
    ],
    properties: [
      'openFile'
    ]
  })
  
  if (typeof selectedParticipantFiles === 'undefined') {
    return;
  }

  const selectedParticipantFile = selectedParticipantFiles.pop();

  const participantContent = readFileSync(selectedParticipantFile).toString();

  webContents.getAllWebContents().pop().send('participantFileSelected', {
    contents: participantContent
  });
}

ipcMain.on('remoteApiRequest', (event, payload) => {
  fetch(payload.url)
    .then(response => response.json())
    .then(data => {
        webContents.getAllWebContents().pop().send('participantApiLoaded', {
          contents: data.toString()
        });
    })
    .catch(err => {
      webContents.getAllWebContents().pop().send('participantApiFailed', {
        contents: err
      });
    });
});

ipcMain.on('contestantsFileSave', (event, payload) => {
  let options = {
      title: "Guardar el archivo de concursantes",
      defaultPath : "concursantes",
      buttonLabel : "Guardar",

      filters :[
          {name: 'txt', extensions: ['txt']},
          {name: 'All Files', extensions: ['*']}
      ]
  };

  dialog.showSaveDialog(null, options).then(({ filePath }) => {
    fs.writeFileSync(filePath, payload.contestants.toString(), 'utf-8');
  });

});

ipcMain.on('endTheContest', (event, payload) => {
  database.run(`INSERT INTO winners (winners) VALUES(?)`, [payload.winners.toString()]);

  webContents.getAllWebContents().pop().send('WinnersSavedSuccessful', {
    winners: payload.winners.toString()
  });
});

ipcMain.on('asynchronous-message', (event, arg) => {
  const sql = arg;
  database.all(sql, (err, rows) => {
      event.reply('asynchronous-reply', (err && err.message) || rows);
  });
});

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  win.removeMenu();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')

    autoUpdater.checkForUpdatesAndNotify()
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
