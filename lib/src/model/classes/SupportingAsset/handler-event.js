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
const SupportingAsset = require('./supporting-asset');
const { updateRiskName } = require('../Risk/handler-event');

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
    const risks = israProject.properties.Risk;

    ids.forEach((id) => {
      israProject.deleteSupportingAsset(Number(id));
    });

    const deletedIds = new Set(ids);
    risks.forEach((risk)=>{
      const { riskId, riskName } = risk;
      if(deletedIds.has(String(riskName.supportingAssetRef))){
        const affectedRisk = israProject.getRisk(riskId);
        affectedRisk.riskName.supportingAssetRef = null;
        updateRiskName(israProject, win, riskId);
      }
    });

    // win.webContents.send('risks:load', israProject.toJSON());
  } catch (err) {
    console.log(err);
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
    // if (field === 'businessAssetRef') {
    //   // value is array
    //   const { businessAssetRef } = supportingAsset.properties;
    //   businessAssetRef.forEach((ref) => {
    //     supportingAsset.deleteBusinessAssetRef(Number(ref));
    //   });
    //   value.forEach((ref) => {
    //     if(ref) supportingAsset.addBusinessAssetRef(Number(ref));
    //     else supportingAsset.addBusinessAssetRef(null);
    //   });
    // } else {
      // value is string
      supportingAsset[field] = value;

      // update riskName
      if(field === 'supportingAssetName'){
        const risks = israProject.properties.Risk;
        risks.forEach((risk)=>{
          const { riskId, riskName } = risk;
          if(riskName.supportingAssetRef === id){
            updateRiskName(israProject, win, riskId);
          }
        })
      }
    // }
    // win.webContents.send('risks:load', israProject.toJSON());
  } catch (err) {
    console.log(err)
    dialog.showMessageBoxSync(null, { message: `Failed to update supporting asset ${id}` });
  }
};

/**
  * add business asset ref of selected supporting asset
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} id supporting asset id
*/
const addBusinessAssetRef = (israProject, id, value) => {
  if(value === 'null') israProject.getSupportingAsset(id).addBusinessAssetRef(null);
  else israProject.getSupportingAsset(id).addBusinessAssetRef(Number(value));
}

/**
  * add business asset ref of selected supporting asset
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} id supporting asset id
*/
const deleteBusinessAssetRef = (israProject, id, index) => {
  israProject.getSupportingAsset(id).deleteBusinessAssetRef(Number(index));
}

/**
  * update business asset ref of selected supporting asset
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} id supporting asset id
  * @param {integer} value business asset ref id
  * @param {integer} index index of business asset ref in array
*/
const updateBusinessAssetRef = (israProject, id, value, index) => {
  try {
    israProject.getSupportingAsset(id).updateBusinessAssetRef(index, value);
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: 'Failed to update Business Asset Ref' });
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
  addBusinessAssetRef,
  deleteBusinessAssetRef,
  updateBusinessAssetRef
};
