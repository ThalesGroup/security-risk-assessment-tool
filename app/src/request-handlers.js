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
  dialog, ipcMain, Menu, BrowserWindow,
  // nativeTheme,
} = require('electron');

const {
  DataStore,
  XML2JSON,
  DataLoad,
  DataNew,
} = require('../../lib/src/api/index');

const ISRAProject = require('../../lib/src/model/classes/ISRAProject/isra-project');

let israProject;
let jsonFilePath = '';

/**
  * every time you want the main window, call this function.
*/
const getMainWindow = () => {
  const ID = process.env.MAIN_WINDOW_ID * 1;
  return BrowserWindow.fromId(ID);
};

// Header

/**
  * Create new project
  * @param win Browser Window
  * @param app
*/
const newISRAProject = (win, app) => {
  try {
    israProject = new ISRAProject();
    DataNew(israProject);
    win.webContents.send('project:load', israProject.toJSON());
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(null, { message: 'Failed to create new project' });
    app.quit();
  }
};

/**
 * @module saveAs
  * save as new project in selected directory (save as)
*/
const saveAs = async () => {
  const options = {
  // Placeholders
    title: 'Save file - Electron ISRA Project',
    defaultPath: 'C:\\Users\\ISRAProject.json',
    buttonLabel: 'Save JSON File',
    filters: [
      { name: 'JSON', extensions: ['json'] },
    ],
  };
  const fileName = await dialog.showSaveDialog(options);
  if (!fileName.canceled) {
    const { filePath } = fileName;
    getMainWindow().webContents.send('validate:allTabs', filePath);
  }
};

/**
  * override data in existing json file (save)
*/
const save = async () => {
  getMainWindow().webContents.send('validate:allTabs', jsonFilePath);
};

/**
  * Save current project (save/save as)
*/
const saveProject = async () => {
  if (jsonFilePath !== '') save();
  else saveAs();
};

ipcMain.on('validate:allTabs', async (event, filePath) => {
  if (jsonFilePath === '') {
    try {
      await DataStore(israProject, filePath);
      jsonFilePath = filePath;
      getMainWindow().title = filePath;
      dialog.showMessageBoxSync(null, { message: `Successfully saved form to ${filePath}` });
    } catch (err) {
      console.log(err);
      dialog.showMessageBoxSync(null, { message: `Error in saving form to ${filePath}` });
    }
  } else {
    try {
      await DataStore(israProject, jsonFilePath);
      dialog.showMessageBoxSync(null, { message: 'Successfully saved form' });
    } catch (err) {
      console.log(err);
      dialog.showMessageBoxSync(null, { message: 'Error in saving form' });
    }
  }
});

/**
  * Load JSON file
  * @param {string} win Browser window
  * @param {string} filePath path of selected json file
*/
const loadJSONFile = async (win, filePath) => {
  try {
    israProject = new ISRAProject();
    await DataLoad(israProject, filePath);
    win.webContents.send('project:load', israProject.toJSON());
    jsonFilePath = filePath;
    getMainWindow().title = filePath;
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(null, { message: 'Invalid JSON File' });
  }
};

/**
  * Load XML file
  * @param {string} win Browser window
  * @param {string} filePath path of selected xml file
*/
const loadXMLFile = (win, filePath) => {
  try {
    israProject = XML2JSON(filePath);
    win.webContents.send('project:load', israProject.toJSON());
    jsonFilePath = '';
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(null, { message: 'Invalid XML File' });
  }
};

/**
  * Load either JSON or XML file
  * @module loadFile
  * @param {string} win Browser window
*/
const loadFile = (win) => {
  const options = {
    title: 'Open file - Electron ISRA Project',
    buttonLabel: 'Open File',
    filters: [
      { name: 'JSON/XML', extensions: ['json', 'xml'] },
    ],
  };
  const filePathArr = dialog.showOpenDialogSync(options);

  if (filePathArr !== undefined) {
    const filePath = filePathArr[0];
    if (filePath.split('.').pop() === 'json') loadJSONFile(win, filePath);
    else loadXMLFile(win, filePath);
  }
};

module.exports = {
  saveAs,
  saveProject,
  loadFile,
  newISRAProject,
};

// Welcome Tab
const {
  addTrackingRow,
  deleteTrackingRow,
  updateTrackingRow,
  validateISRAmeta,
} = require('../../lib/src/model/classes/ISRAProject/handler-event');

ipcMain.handle('welcome:addTrackingRow', () => addTrackingRow(israProject));
ipcMain.handle('welcome:deleteTrackingRow', (event, iterations) => deleteTrackingRow(israProject, iterations));
ipcMain.on('welcome:updateTrackingRow', (event, rowData) => {
  updateTrackingRow(israProject, rowData);
});
ipcMain.on('validate:welcome', (event, arr) => {
  validateISRAmeta(israProject, arr);
});

// Project Context Tab
const {
  attachFile,
  removeFile,
  saveAsFile,
  decodeFile,
  urlPrompt,
  validateProjectContext,
} = require('../../lib/src/model/classes/ISRAProjectContext/handler-event');

ipcMain.on('projectContext:openURL', (event, url, status) => {
  if (status) {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
    });
    win.loadURL(url);
  } else dialog.showMessageBoxSync(null, { message: 'You are offline' });
});

ipcMain.handle('projectContext:urlPrompt', async () => {
  const url = await urlPrompt();
  if (url !== 'cancelled') israProject.israProjectContext.projectURL = url;
  return url;
});

const attachmentOptions = () => {
  const attachLabel = {
    label: 'Attach',
    click: () => {
      try {
        const [fileName, base64data] = attachFile();
        israProject.israProjectContext.projectDescriptionAttachment = base64data;
        getMainWindow().webContents.send('projectContext:fileName', fileName);
      } catch (err) {
        console.log(err);
        dialog.showMessageBoxSync(null, { message: 'Invalid Project Descriptive Document' });
        getMainWindow().webContents.send('projectContext:fileName', 'Click here to attach a file');
      }
    },
  };

  if (israProject.israProjectContext.projectDescriptionAttachment !== ''
  && israProject.israProjectContext.projectDescriptionAttachment !== undefined) {
    return [
      attachLabel,
      {
        label: 'Save as',
        click: () => saveAsFile(israProject.israProjectContext.projectDescriptionAttachment),
      },
      {
        label: 'Remove',
        click: () => {
          const [fileName, base64data] = removeFile();
          israProject.israProjectContext.projectDescriptionAttachment = base64data;
          getMainWindow().webContents.send('projectContext:fileName', fileName);
        },
      },
    ];
  }
  return [
    attachLabel,
  ];
};

ipcMain.on('projectContext:attachment', () => {
  const contextMenu = Menu.buildFromTemplate(attachmentOptions());
  contextMenu.popup();
});

ipcMain.handle('projectContext:decodeAttachment', (event, base64) => {
  try {
    const fileName = decodeFile(base64);
    return fileName;

    // israProject.israProjectContext.projectDescriptionAttachment = base64;
    // const buffer = Buffer.from(base64, 'base64');
    // const content = buffer.toString();
    // console.log(content);
    // return 'JSON file opened';
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(null, { message: 'Invalid Project Descriptive Document' });
    return 'Click here to attach a file';
  }
});

ipcMain.on('validate:projectContext', (event, arr) => {
  validateProjectContext(israProject, arr);
});

// Business Asset Tab

const { addBusinessAsset, deleteBusinessAsset, validateBusinessAsset } = require('../../lib/src/model/classes/BusinessAsset/handler-event');

ipcMain.handle('businessAssets:addBusinessAsset', () => addBusinessAsset(israProject));
ipcMain.on('businessAssets:deleteBusinessAsset', (event, ids) => {
  deleteBusinessAsset(israProject, ids);
});
ipcMain.on('validate:businessAssets', (event, arr) => {
  validateBusinessAsset(israProject, arr);
});

// ipcMain.handle('dark-mode:toggle', () => {
//   if (nativeTheme.shouldUseDarkColors) {
//     nativeTheme.themeSource = 'light';
//   } else {
//     nativeTheme.themeSource = 'dark';
//   }
//   return nativeTheme.shouldUseDarkColors;
// });

// ipcMain.handle('dark-mode:system', () => {
//   nativeTheme.themeSource = 'system';
// });
