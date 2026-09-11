/*----------------------------------------------------------------------------
*
*     Copyright © 2022 THALES. All Rights Reserved.
 *
* -----------------------------------------------------------------------------
* THALES MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF
* THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE, OR NON-INFRINGEMENT. THALES SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING,
 * MODIFYING OR DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
*
* THIS SOFTWARE IS NOT DESIGNED OR INTENDED FOR USE OR RESALE AS ON-LINE
* CONTROL EQUIPMENT IN HAZARDOUS ENVIRONMENTS REQUIRING FAIL-SAFE
* PERFORMANCE, SUCH AS IN THE OPERATION OF NUCLEAR FACILITIES, AIRCRAFT
* NAVIGATION OR COMMUNICATION SYSTEMS, AIR TRAFFIC CONTROL, DIRECT LIFE
* SUPPORT MACHINES, OR WEAPONS SYSTEMS, IN WHICH THE FAILURE OF THE
* SOFTWARE COULD LEAD DIRECTLY TO DEATH, PERSONAL INJURY, OR SEVERE
* PHYSICAL OR ENVIRONMENTAL DAMAGE ("HIGH RISK ACTIVITIES"). THALES
* SPECIFICALLY DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTY OF FITNESS FOR
* HIGH RISK ACTIVITIES.
* -----------------------------------------------------------------------------
*/
const {
  app, BrowserWindow, Menu, ipcMain,
} = require('electron');
const path = require('path');
const { getUserArgs } = require('./argv');
const { initLogger, isLoggingEnabled } = require('./logger');
const blockedAt = require('blocked-at');
const {
  validationErrors,
  loadFile,
  loadData,
  newISRAProject,
  downloadReport,
  exit,
  loadJSONFile,
  loadXMLFile
} = require('./request-handlers');

app.disableHardwareAcceleration();

const { logging: loggingRequested, filePath: cliFilePath } = getUserArgs(process.argv, app.isPackaged);

const log = initLogger(loggingRequested);

ipcMain.on('diagnostics:log', (_event, level, args) => {
  if (!isLoggingEnabled() || typeof log[level] !== 'function') return;
  log[level](...args);
});

if (isLoggingEnabled()) {
  blockedAt((time, stack) => {
    log.warn(`[MAIN] Event loop blocked for ${Math.round(time)}ms`);
    log.warn(`[MAIN] Blocked stack trace:\n${stack.join('\n')}`);
  }, { threshold: 200 });

  process.on('uncaughtException', (err) => {
    log.error('[MAIN] uncaughtException', err && err.name, err && err.message, err && err.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    const err = reason instanceof Error ? reason : new Error(String(reason));
    log.error('[MAIN] unhandledRejection', err.name, err.message, err.stack);
  });
}

const HEARTBEAT_INTERVAL_MS = 15000;
function startMainHeartbeat() {
  if (!isLoggingEnabled()) return;
  setInterval(() => {
    log.info(`[MAIN] heartbeat, uptime=${Math.round(process.uptime())}s`);
  }, HEARTBEAT_INTERVAL_MS).unref();
}

function instrumentWindow(win, label) {
  if (!isLoggingEnabled()) return;
  const start = Date.now();
  win.on('unresponsive', () => log.error(`[MAIN] BrowserWindow (${label}) became unresponsive`));
  win.on('responsive', () => log.info(`[MAIN] BrowserWindow (${label}) became responsive again`));
  win.on('closed', () => log.info(`[MAIN] BrowserWindow (${label}) closed`));
  win.webContents.on('render-process-gone', (event, details) => {
    log.error(`[MAIN] render-process-gone (${label})`, `reason=${details.reason}`, `exitCode=${details.exitCode}`);
  });
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log.error(`[MAIN] did-fail-load (${label})`, `errorCode=${errorCode}`, errorDescription);
  });
  win.webContents.on('did-finish-load', () => {
    log.info(`[MAIN] did-finish-load (${label}) in ${Date.now() - start}ms`);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    // width: 850,
    // height: 600,
    minWidth: 850,
    icon: path.join(__dirname, '../asset/isra-app-icon-512.png'),
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
    },
  });

  if (isLoggingEnabled()) log.info('[MAIN] BrowserWindow creation started');
  instrumentWindow(win, 'main');

  win.maximize();
  win.loadFile(path.join(__dirname, '../tabs/Welcome/welcome.html'));
  if (isLoggingEnabled()) log.info('[MAIN] BrowserWindow created, page load started');

  // send data to populate into dom fields
  win.webContents.on('dom-ready', () => {
    newISRAProject(win, app);
  });

  win.on('close', (e) => {
    exit(e, app);
  });

  // save current window at runtime
  process.env.MAIN_WINDOW_ID = win.id;

  // header menu
  const mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          click: () => validationErrors('Save'),
          accelerator: 'CmdOrCtrl+S',
        },
        {
          label: 'Save As',
          click: () => validationErrors('Save As'),
        },
        {
          label: 'Open File',
          click: () => loadFile(win),
        },
        {
          label: 'Import Data',
          click: () => loadData(win),
        },
        {
          label: 'Print',
          click: () => downloadReport(app),
        },
        {
          role: 'quit',
          accelerator: 'CmdOrCtrl+Q',
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },

    // for development
    {
      label: 'Window',
      submenu: [
        { role: 'toggleDevTools' },
        { role: 'togglefullscreen' },
        { role: 'reload' },
      ],
    },
  ];

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

let filePath = cliFilePath || '';


app.on('open-file', function(event, openedPath) {
  event.preventDefault();
  filePath = openedPath;
})



app.whenReady().then(() => {

  if (isLoggingEnabled()) log.info('[MAIN] Application startup: app ready');
  startMainHeartbeat();

  createWindow();

  const getMainWindow = () => {
    const ID = process.env.MAIN_WINDOW_ID * 1;
    return BrowserWindow.fromId(ID);
  };

  if (filePath) {
    const fileType = filePath.split('.').pop();
    if (fileType === 'json' || fileType === 'sra') loadJSONFile(getMainWindow(), filePath);
    else if (fileType === 'xml') loadXMLFile(getMainWindow(), filePath);
    else if (isLoggingEnabled()) log.warn(`[MAIN] Ignoring CLI argument with unsupported extension: .${fileType}`);
  }


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});