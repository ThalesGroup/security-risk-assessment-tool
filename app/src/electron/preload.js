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

// contextBridge.exposeInMainWorld('darkMode', {
//   toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
//   system: () => ipcRenderer.invoke('dark-mode:system'),
// });

contextBridge.exposeInMainWorld('project', {
  load: (data) => ipcRenderer.on('project:load', data),
  validationErrors: (state) => ipcRenderer.on('project:validationErrors', state),
});

contextBridge.exposeInMainWorld('render', {
  welcome: () => ipcRenderer.invoke('render:welcome'),
  projectContext: () => ipcRenderer.invoke('render:projectContext'),
  businessAssets: () => ipcRenderer.invoke('render:businessAssets'),
  supportingAssets: () => ipcRenderer.invoke('render:supportingAssets'),
  risks: () => ipcRenderer.invoke('render:risks'),
  vulnerabilities: () => ipcRenderer.invoke('render:vulnerabilities')
});

contextBridge.exposeInMainWorld('validate', {
  welcome: (data) => ipcRenderer.send('validate:welcome', data),
  projectContext: (data) => ipcRenderer.send('validate:projectContext', data),
  businessAssets: (data) => ipcRenderer.send('validate:businessAssets', data),
  supportingAssets: (data, desc) => ipcRenderer.send('validate:supportingAssets', data, desc),
  allTabs: (filePath) => ipcRenderer.on('validate:allTabs', filePath),
});

contextBridge.exposeInMainWorld('welcome', {
  addTrackingRow: () => ipcRenderer.invoke('welcome:addTrackingRow'),
  deleteTrackingRow: (iterations) => ipcRenderer.invoke('welcome:deleteTrackingRow', iterations),
  updateTrackingRow: (rowData) => ipcRenderer.send('welcome:updateTrackingRow', rowData),
});

contextBridge.exposeInMainWorld('projectContext', {
  openURL: (url, userStatus) => ipcRenderer.send('projectContext:openURL', url, userStatus),
  urlPrompt: () => ipcRenderer.invoke('projectContext:urlPrompt'),
  attachment: () => ipcRenderer.send('projectContext:attachment'),
  decodeAttachment: (fileName) => ipcRenderer.invoke('projectContext:decodeAttachment', fileName),
  fileName: (fileName) => ipcRenderer.on('projectContext:fileName', fileName),
});

contextBridge.exposeInMainWorld('businessAssets', {
  addBusinessAsset: () => ipcRenderer.invoke('businessAssets:addBusinessAsset'),
  deleteBusinessAsset: (ids) => ipcRenderer.send('businessAssets:deleteBusinessAsset', ids),
  updateBusinessAsset: (id, field, value) => ipcRenderer.send('businessAssets:updateBusinessAsset', id, field, value),
});

contextBridge.exposeInMainWorld('supportingAssets', {
  addSupportingAsset: () => ipcRenderer.invoke('supportingAssets:addSupportingAsset'),
  deleteSupportingAsset: (ids) => ipcRenderer.send('supportingAssets:deleteSupportingAsset', ids),
  updateSupportingAsset: (id, field, value) => ipcRenderer.send('supportingAssets:updateSupportingAsset', id, field, value),
  getBusinessAssets: (label, value) => ipcRenderer.on('supportingAssets:getBusinessAssets', label, value),
});

contextBridge.exposeInMainWorld('risks', {
  addRisk: () => ipcRenderer.invoke('risks:addRisk'),
  deleteRisk: (ids) => ipcRenderer.send('risks:deleteRisk', ids),
  load: (data) => ipcRenderer.on('risks:load', data),
  updateRiskName: (id, field, value) => ipcRenderer.send('risks:updateRiskName', id, field, value),
  updateRiskLikelihood: (id, field, value) => ipcRenderer.invoke('risks:updateRiskLikelihood', id, field, value),
  updateRiskImpact: (id, field, value) => ipcRenderer.invoke('risks:updateRiskImpact', id, field, value),
});

contextBridge.exposeInMainWorld('vulnerabilities', {
  addVulnerability: () => ipcRenderer.invoke('vulnerabilities:addVulnerability'),
  deleteVulnerability: (ids) => ipcRenderer.send('vulnerabilities:deleteVulnerability', ids),
  urlPrompt: (id) => ipcRenderer.invoke('vulnerabilities:urlPrompt', id),
  openURL: (url, userStatus) => ipcRenderer.send('vulnerabilities:openURL', url, userStatus),
  attachment: (id) => ipcRenderer.send('vulnerabilities:attachment', id),
  decodeAttachment: (id, fileName) => ipcRenderer.invoke('vulnerabilities:decodeAttachment', id, fileName),
  fileName: (result) => ipcRenderer.on('vulnerabilities:fileName', result),
});
