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
  ipcMain,
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
const name = null;

/**
  * Create new project
  * @return {string} JSON string of new project values
*/
ipcMain.handle('project:new', () => {
  try {
    israProject = new ISRAProject();
    DataNew(israProject);
    return israProject.toJSON();
  } catch (err) {
    console.log(err);
    return 'Failed to initialise new project';
  }
});

/**
  * Save current project
  * @param {event} event Electron.IpcMainInvokeEvent
  * @param {string} filePath location of file path
  * @return {string} Saved message or error message
*/
ipcMain.handle('parse:xml', (event, filePath) => {
  try {
    israProject = new ISRAProject();
    XML2JSON(filePath, israProject);
    return israProject.toJSON();
  } catch (err) {
    console.log(err);
    return 'Invalid File';
  }
});

/**
  * Save current project
  * @return {string} Saved message or error message
*/

ipcMain.handle('project:save', async () => {
  try {
    if (israProject === undefined) israProject = new ISRAProject();
    await DataStore(israProject, name);
    return 'Successfully saved form';
  } catch (err) {
    console.log(err);
    return 'Error in saving form';
  }
});

/**
  * Save current project
  * @return {string} JSON string of project values or error message
*/
ipcMain.handle('project:load', async (event, filePath) => {
  try {
    israProject = new ISRAProject();
    await DataLoad(israProject, filePath);
    return israProject.toJSON();
  } catch (err) {
    console.log(err);
    return 'Error in loading file';
  }
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
