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

const jsonSchemaSA = require('../../schema/json-schema').properties.SupportingAsset.items.properties;
const validateClassProperties = require('../validation/validate-class-properties');

/** validate supporting asset id in SupportingAsset
    * @param {integer|null} val value intended to be populated into
    * supportingAssetId class property
    * @returns {boolean}
  */
const isSupportingAssetId = (val) => {
  const subSchema = jsonSchemaSA.supportingAssetId;
  return validateClassProperties(val, subSchema);
};

/** validate supporting asset HLD id in SupportingAsset
    * @param {string} val value intended to be populated into
    * supportingAssetHLDId class property
    * @returns {boolean}
  */
const isSupportingAssetHLDId = (val) => {
  const subSchema = jsonSchemaSA.supportingAssetHLDId;
  return validateClassProperties(val, subSchema);
};

/** validate supporting asset name in SupportingAsset
    * @param {string} val value intended to be populated into
    * supportingAssetName class property
    * @returns {boolean}
  */
const isSupportingAssetName = (val) => {
  const subSchema = jsonSchemaSA.supportingAssetName;
  return validateClassProperties(val, subSchema);
};

/** validate supporting asset type in SupportingAsset
    * @param {string} val value intended to be populated into
    * supportingAssetType class property
    * @returns {boolean}
  */
const isSupportingAssetType = (val) => {
  const subSchema = jsonSchemaSA.supportingAssetType;
  return validateClassProperties(val, subSchema);
};

/** validate supporting asset security level in SupportingAsset
    * @param {integer|null} val value intended to be populated into
    * supportingAssetSecurityLevel class property
    * @returns {boolean}
  */
const isSupportingAssetSecurityLevel = (val) => {
  const subSchema = jsonSchemaSA.supportingAssetSecurityLevel;
  return validateClassProperties(val, subSchema);
};

module.exports = {
  isSupportingAssetId,
  isSupportingAssetHLDId,
  isSupportingAssetName,
  isSupportingAssetType,
  isSupportingAssetSecurityLevel,
};
