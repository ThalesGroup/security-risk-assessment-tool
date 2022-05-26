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

const SupportingAsset = require('./supporting-asset');

const addSupportingAsset = (israProject) => {
  const supportingAsset = new SupportingAsset();
  israProject.addSupportingAsset(supportingAsset);
  return [supportingAsset.properties];
};

const deleteSupportingAsset = (israProject, ids) => {
  ids.forEach((id) => {
    israProject.deleteSupportingAsset(Number(id));
  });
};

const updateSupportingAsset = (israProject, win, id, field, value) => {
  const supportingAsset = israProject.getSupportingAsset(id);
  if (field === 'businessAssetRef') {
    const { businessAssetRef } = supportingAsset.properties;
    value.forEach((ref) => {
      supportingAsset.addBusinessAssetRef(Number(ref));
    });
    businessAssetRef.forEach((ref) => {
      if (!value.includes(ref.toString())) supportingAsset.deleteBusinessAssetRef(Number(ref));
    });
  } else {
    supportingAsset[field] = value;
  }
};

const validateSupportingAssets = (ISRAproject, arr, desc) => {
  const israProject = ISRAproject;
  israProject.supportingAssetsDesc = desc;
  arr.forEach((asset) => {
    const supportingAsset = israProject.getSupportingAsset(asset.supportingAssetId);
    const {
      supportingAssetHLDId,
      supportingAssetName,
      supportingAssetType,
      supportingAssetSecurityLevel,
    } = asset;
    Object.assign(supportingAsset, {
      supportingAssetHLDId,
      supportingAssetName,
      supportingAssetType,
      supportingAssetSecurityLevel,
    });
  });
};

module.exports = {
  addSupportingAsset,
  deleteSupportingAsset,
  updateSupportingAsset,
  validateSupportingAssets,
};
