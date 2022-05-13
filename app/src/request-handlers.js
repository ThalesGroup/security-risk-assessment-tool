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
  dialog, ipcMain,
  // ipcMain,
  nativeTheme,
} = require('electron');

const {
  DataStore,
  XML2JSON,
  DataLoad,
  DataNew,
} = require('../../lib/src/api/index');
const ISRAMetaTracking = require('../../lib/src/model/classes/ISRAProject/isra-meta-tracking');

const ISRAProject = require('../../lib/src/model/classes/ISRAProject/isra-project');

let israProject;
let jsonFilePath = '';

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
  * save as new project in selected directory
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
    try {
      await DataStore(israProject, fileName.filePath);
      dialog.showMessageBoxSync(null, { message: `Successfully saved form to ${fileName.filePath}` });
    } catch (err) {
      console.log(err);
      dialog.showMessageBoxSync(null, { message: `Error in saving form to ${fileName.filePath}` });
    }
  }
};

/**
  * override data in existing json file
*/
const save = async () => {
  try {
    if (israProject === undefined) israProject = new ISRAProject();
    await DataStore(israProject, jsonFilePath);
    dialog.showMessageBoxSync(null, { message: 'Successfully saved form' });
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(null, { message: 'Error in saving form' });
  }
};

/**
  * Save current project
  * @module saveForm
*/
const saveProject = async () => {
  if (jsonFilePath !== '') save();
  else saveAs();
};

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

ipcMain.handle('welcome:addTrackingRow', () => {
  const israTracking = new ISRAMetaTracking();
  israProject.addMetaTracking(israTracking);
  return israTracking.properties;
});

ipcMain.handle('welcome:deleteTrackingRow', (event, iterations) => {
  const sortedIterations = iterations.sort((a, b) => Number(b) - Number(a));
  sortedIterations.forEach((iteration) => {
    israProject.deleteMetaTracking(Number(iteration));
  });
  return israProject.properties.ISRAmeta.ISRAtracking;
});

ipcMain.handle('welcome:updateTrackingRow', (event, rowData) => {
  const tracking = israProject.getMetaTracking(rowData.trackingIteration);
  Object.assign(tracking, rowData);
});
