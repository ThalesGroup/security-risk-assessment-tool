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
  dialog,
} = require('electron');
const SupportingAsset = require('../../../../lib/src/model/classes/SupportingAsset/supporting-asset');

/**
  * add default supporting asset row
  * @param {ISRAProject} israProject current ISRA Project
*/
const addSupportingAsset = (israProject) => {
  try {
    const supportingAsset = new SupportingAsset();
    israProject.addSupportingAsset(supportingAsset);
    return [supportingAsset.properties];
  } catch (err) {
    return dialog.showMessageBoxSync(null, { message: 'Failed to add supporting asset' });
  }
};

/**
  * delete selected supporting asset row(s)
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Array} ids supporting asset id(s)
*/
const deleteSupportingAsset = (israProject, ids, win) => {
  try {
    ids.forEach((id) => {
      israProject.deleteSupportingAsset(Number(id));
      win.webContents.send('risks:load', israProject.toJSON());
    });
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: 'Failed to delete supporting asset(s)' });
  }
};

/**
  * update edited supporting asset row
  * @param {ISRAProject} israProject current ISRA Project
  * @param {BrowserWindow} win current main browser window
  * @param {integer} id supporting asset id
  * @param {string} field supporting asset class property
  * @param {string|Array} value value to be populated into class property
*/
const updateSupportingAsset = (israProject, win, id, field, value) => {
  try {
    const supportingAsset = israProject.getSupportingAsset(id);
    if (field === 'businessAssetRef') {
      // value is array
      const { businessAssetRef } = supportingAsset.properties;
      value.forEach((ref) => {
        supportingAsset.addBusinessAssetRef(Number(ref));
      });
      businessAssetRef.forEach((ref) => {
        if (!value.includes(ref.toString())) supportingAsset.deleteBusinessAssetRef(Number(ref));
      });
    } else {
      // value is string
      supportingAsset[field] = value;
    }
    win.webContents.send('risks:load', israProject.toJSON());
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: `Failed to update supporting asset ${id}` });
  }
};

/**
  * validate & populate data from Supporting Assets tab
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Array} supportingAssets supporting assets data from table
  * @param {string} desc supporting assets description content
*/
const validateSupportingAssets = (ISRAproject, supportingAssets, desc) => {
  try {
    const israProject = ISRAproject;
    israProject.supportingAssetsDesc = desc;
    supportingAssets.forEach((asset) => {
      const supportingAsset = israProject.getSupportingAsset(asset.supportingAssetId);
      const {
        supportingAssetHLDId,
        supportingAssetType,
        supportingAssetSecurityLevel,
      } = asset;
      Object.assign(supportingAsset, {
        supportingAssetHLDId,
        supportingAssetType,
        supportingAssetSecurityLevel,
      });
    });
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: 'Failed to validate Supporting Assets tab' });
  }
};

module.exports = {
  addSupportingAsset,
  deleteSupportingAsset,
  updateSupportingAsset,
  validateSupportingAssets,
};
