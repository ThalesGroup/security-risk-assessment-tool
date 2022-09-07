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
const BusinessAsset = require('../../../../lib/src/model/classes/BusinessAsset/business-asset');
const { updateRiskImpact, updateRiskName } = require('../Risks/handler-event');

/**
  * add default business asset section
  * @param {ISRAProject} israProject current ISRA Project
  * @param {BrowserWindow} win current main browser window
*/
const addBusinessAsset = (israProject, win) => {
  try {
    const businessAsset = new BusinessAsset();
    israProject.addBusinessAsset(businessAsset);
    win.webContents.send('supportingAssets:getBusinessAssets', businessAsset.businessAssetName, businessAsset.businessAssetId);
    win.webContents.send('risks:load', israProject.toJSON());
    return [businessAsset.properties];
  } catch (err) {
    return dialog.showMessageBoxSync(null, { message: 'Failed to add business asset' });
  }
};

/**
  * delete selected business asset section(s)
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Array} ids (string) selected business asset id(s)
  * @param {BrowserWindow} win current main browser window
*/
const deleteBusinessAsset = (israProject, ids, win) => {
  try {
    const risks = israProject.properties.Risk;
    const affectedRisks = {};

    ids.forEach((id) => {
      israProject.deleteBusinessAsset(Number(id));
      win.webContents.send('supportingAssets:getBusinessAssets', null, id);
    });

    const deletedIds = new Set(ids);
    risks.forEach((risk)=>{
      const { riskId, riskName } = risk;
      if(deletedIds.has(String(riskName.businessAssetRef))){
        const affectedRisk = israProject.getRisk(riskId);
        affectedRisk.riskName.businessAssetRef = null;
        affectedRisk.riskName.supportingAssetRef = null;
        updateRiskName(israProject, win, riskId);
      }
    });

    win.webContents.send('risks:load', israProject.toJSON());
  } catch (err) {
    console.log(err)
    dialog.showMessageBoxSync(null, { message: 'Failed to delete business asset(s)' });
  }
};

/**
  * validate & populate data from Business Assets tab
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Object} data business asset section data
*/
const validateBusinessAsset = (israProject, data) => {
  try {
    const { businessAssetId, businessAssetDescription } = data;
    const businessAsset = israProject.getBusinessAsset(businessAssetId);
    businessAsset.businessAssetDescription = businessAssetDescription;
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: 'Failed to validate Business Assets tab' });
  }
};

/**
  * update selected business asset section,
  * update data in Supporting Assets & Vulnerabilities tabs
  * @param {ISRAProject} israProject current ISRA Project
  * @param {BrowserWindow} win current main browser window
  * @param {integer} id business asset id
  * @param {string} field business asset/business asset properties class property
  * @param {string} value value to be populated into class property
*/
const updateBusinessAsset = (ISRAproject, win, id, field, value) => {
  try {
    const israProject = ISRAproject;

    if (field === 'businessAssetName' || field === 'businessAssetType') {
      israProject.getBusinessAsset(id)[field] = value;

      // update riskName
      if (field === 'businessAssetName') {
        const risks = israProject.properties.Risk;
        win.webContents.send('supportingAssets:getBusinessAssets', value, id);
        risks.forEach((risk)=>{
          const { riskId, riskName } = risk;
          if(riskName.businessAssetRef === id){
            updateRiskName(israProject, win, riskId);
          }
        })
      };
    } else {
      israProject.getBusinessAsset(id).businessAssetProperties[field] = Number(value);
      const risks = israProject.properties.Risk;
        risks.forEach((risk) => {
          if(risk.riskName.businessAssetRef === id) updateRiskImpact(israProject, risk.riskId);
      });
    }
    win.webContents.send('risks:load', israProject.toJSON());
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: `Failed to update business asset ${id}` });
  }
};

module.exports = {
  addBusinessAsset,
  deleteBusinessAsset,
  validateBusinessAsset,
  updateBusinessAsset,
};
