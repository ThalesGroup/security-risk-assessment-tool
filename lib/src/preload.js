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

const { contextBridge, ipcRenderer } = require('electron');
const { renderWelcome } = require('../../app/src/tabs/Welcome/render-welcome');
const { renderBusinessAssets } = require('../../app/src/tabs/Business Assets/render-business-assets');

// contextBridge.exposeInMainWorld('darkMode', {
//   toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
//   system: () => ipcRenderer.invoke('dark-mode:system'),
// });

contextBridge.exposeInMainWorld('project', {
  load: (data) => ipcRenderer.on('project:load', data),
});

contextBridge.exposeInMainWorld('render', {
  welcome: () => renderWelcome(),
  businessAssets: () => renderBusinessAssets(),
});

contextBridge.exposeInMainWorld('validate', {
  welcome: (data) => ipcRenderer.send('validate:welcome', data),
  projectContext: (data) => ipcRenderer.send('validate:projectContext', data),
  businessAssets: (data) => ipcRenderer.send('validate:businessAssets', data),
  allTabs: (filePath) => ipcRenderer.on('validate:allTabs', filePath),
});

contextBridge.exposeInMainWorld('welcome', {
  addTrackingRow: () => ipcRenderer.invoke('welcome:addTrackingRow'),
  deleteTrackingRow: (iterations) => ipcRenderer.invoke('welcome:deleteTrackingRow', iterations),
  updateTrackingRow: (rowData) => ipcRenderer.send('welcome:updateTrackingRow', rowData),
});

contextBridge.exposeInMainWorld('projectContext', {
  openURL: (url, status) => ipcRenderer.send('projectContext:openURL', url, status),
  urlPrompt: () => ipcRenderer.invoke('projectContext:urlPrompt'),
  attachment: () => ipcRenderer.send('projectContext:attachment'),
  decodeAttachment: (fileName) => ipcRenderer.invoke('projectContext:decodeAttachment', fileName),
  fileName: (fileName) => ipcRenderer.on('projectContext:fileName', fileName),
});

contextBridge.exposeInMainWorld('businessAssets', {
  addBusinessAsset: () => ipcRenderer.invoke('businessAssets:addBusinessAsset'),
  deleteBusinessAsset: (ids) => ipcRenderer.send('businessAssets:deleteBusinessAsset', ids),
});
