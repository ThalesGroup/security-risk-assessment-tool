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
  ipcMain, dialog,
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
  * No JSON file selected, clear path
*/
ipcMain.on('clear:file', async () => {
  jsonFilePath = '';
});

/**
  * Create new project
  * @return {string} JSON string of new project values
  * @throws Failed to create new project
*/
ipcMain.handle('project:new', () => {
  try {
    israProject = new ISRAProject();
    DataNew(israProject);
    return israProject.toJSON();
  } catch (err) {
    console.log(err);
    throw new Error('Failed to create new project');
  }
});

/**
  * Save current project
  * @param {event} event Electron.IpcMainInvokeEvent
  * @param {string} filePath location of file path
  * @return {string} Saved message or error message
  * @throws Invalid XML File
*/
ipcMain.handle('parse:xml', (event, filePath) => {
  try {
    jsonFilePath = '';
    israProject = XML2JSON(filePath, israProject);
    return israProject.toJSON();
  } catch (err) {
    console.log(err);
    throw new Error('Invalid XML File');
  }
});

/**
  * Save current project
  * @return {string} Successfully saved form
  * @return {string} Successfully saved form to ${filePath}
  * @return {string} No XML file uploaded
  * @throws Error in saving form
  * @throws Error in saving form to ${filePath}
*/
ipcMain.handle('project:save', async () => {
  if (jsonFilePath !== '') {
    // override data in existing json file
    try {
      if (israProject === undefined) israProject = new ISRAProject();
      await DataStore(israProject, jsonFilePath);
      return 'Successfully saved form';
    } catch (err) {
      console.log(err);
      throw new Error('Error in saving form');
    }
  } else {
    // save as new project in selected directory
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
        return `Successfully saved form to ${fileName.filePath}`;
      } catch (err) {
        throw new Error(`Error in saving form to ${fileName.filePath}`);
      }
    }
    return 'No file saved';
  }
});

/**
  * Save current project
  * @return {string} JSON string of project values or error message
  * @return {string} No JSON file uploaded
  * @throws Invalid JSON File
*/
ipcMain.handle('project:load', async (event, filePath) => {
  try {
    jsonFilePath = filePath;
    israProject = new ISRAProject();
    await DataLoad(israProject, filePath);
    return israProject.toJSON();
  } catch (err) {
    console.log(err);
    throw new Error('Invalid JSON File');
  }
});

// ipcMain.handle('project:saveAs', async () => {
//   const options = {
//     // Placeholders
//     title: 'Save file - Electron ISRA Project',
//     defaultPath: 'C:\\Users\\ISRAProject.json',
//     buttonLabel: 'Save JSON File',
//     filters: [
//       { name: 'JSON', extensions: ['json'] },
//     ],
//   };
//   const fileName = await dialog.showSaveDialog(options);
//   try {
//     await DataStore(israProject, fileName.filePath);
//     return 'Successfully saved form to location';
//   } catch (err) {
//     return 'Error in saving form to location';
//   }
// });

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
