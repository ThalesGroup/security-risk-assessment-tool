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
  app, BrowserWindow, Menu,
} = require('electron');
const path = require('path');
const {
  validationErrors,
  loadFile,
  newISRAProject,
  downloadReport
} = require('./request-handlers');

app.disableHardwareAcceleration();

function createWindow() {
  const win = new BrowserWindow({
    // width: 850,
    // height: 600,
    minWidth: 850,
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
    },
  });

  win.maximize();
  win.loadFile(path.join(__dirname, '../tabs/Welcome/welcome.html'));

  // send data to populate into dom fields
  win.webContents.on('dom-ready', () => {
    newISRAProject(win, app);
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

app.whenReady().then(() => {
  createWindow();

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
