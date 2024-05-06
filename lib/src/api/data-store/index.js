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
const fs = require('fs');
const ISRAProject = require('../../model/classes/ISRAProject/isra-project');
const DataEncrypt = require('../data-encryption/data-encrypt');
const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('path');

function createWindow (resolveFunc) {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, '../data-encryption/preload.js')
    }
  })

  ipcMain.on('set-secret', (event, secret) => {
    resolveFunc(secret)
  })

  mainWindow.loadFile(`${__dirname}/../data-encryption/index.html`)
}

/**
  * Save project to existing json file
  * @function DataStore
  * @param {ISRAProject} israProject - current instance of israProject
  * @param {string} filePath - path of file
  * @return {Promise}
  * @throws reject the promise in case of error
*/
const DataStore = (israProject, filePath, encryption = false) => new Promise( (resolve, reject) => {
  let savedData
  if (israProject instanceof ISRAProject && typeof filePath === 'string') {
    if(encryption){      
      const myPromise = new Promise((resolve1, reject1) => {
        app.whenReady().then(() => {
          createWindow(resolve1)
          app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) createWindow()
          })
        })
        
        app.on('window-all-closed', function () {
          if (process.platform !== 'darwin') app.quit()  
        })
      });
      myPromise.then((password) => {
        savedData = DataEncrypt(israProject.toJSON(),password)
        fs.writeFile(filePath, savedData, (err) => {
          if (err) reject(new Error('Failed to save file'));
          resolve('Done save');
        });
      })
    }else{
      savedData = israProject
      fs.writeFile(filePath, savedData, (err) => {
        if (err) reject(new Error('Failed to save file'));
        resolve('Done save');
      });
    }
  } else reject(new Error('Invalid project or filepath'));
});

module.exports = DataStore;
