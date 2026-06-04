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

const jsonSchema = require('../../schema/json-schema').properties.BusinessAsset.items.properties;
const validateClassProperties = require('../validation/validate-class-properties');

/** validate business asset id in BusinessAsset
    * @param {integer|null} val value intended to be populated into businessAssetId class property
    * @returns {boolean}
  */
const isBusinessAssetId = (val) => {
  const subSchema = jsonSchema.businessAssetId;
  return validateClassProperties(val, subSchema);
};

/** validate business asset name in BusinessAsset
    * @param {string} val value intended to be populated into businessAssetName class property
    * @returns {boolean}
  */
const isBusinessAssetName = (val) => {
  const subSchema = jsonSchema.businessAssetName;
  return validateClassProperties(val, subSchema);
};

/** validate business asset type in BusinessAsset
    * @param {string} val value intended to be populated into businessAssetType class property
    * @returns {boolean}
  */
const isBusinessAssetType = (val) => {
  const subSchema = jsonSchema.businessAssetType;
  return validateClassProperties(val, subSchema);
};

/** validate business asset description in BusinessAsset
    * @param {string} val value intended to be populated into
    * businessAssetDescription class property
    * @returns {boolean}
  */
const isBusinessAssetDescription = (val) => {
  const subSchema = jsonSchema.businessAssetDescription;
  return validateClassProperties(val, subSchema);
};

/** validate business asset properties in BusinessAssetProperties
    * @param {integer|null} val value intended to be populated into
    * businessAssetConfidentiality/
    * businessAssetIntegrity/
    * businessAssetAvailability/
    * businessAssetAuthenticity/
    * businessAssetAuthorization/
    * businessAssetNonRepudiation
    * class property
    * @returns {boolean}
  */
const isBusinessAssetProperties = (val) => {
  const subSchema = jsonSchema.businessAssetProperties.properties.businessAssetConfidentiality;
  return validateClassProperties(val, subSchema);
};

module.exports = {
  isBusinessAssetId,
  isBusinessAssetName,
  isBusinessAssetType,
  isBusinessAssetDescription,
  isBusinessAssetProperties,
};
