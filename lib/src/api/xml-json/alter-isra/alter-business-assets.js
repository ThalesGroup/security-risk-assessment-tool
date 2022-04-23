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

const { counter } = require('../../../utility-global');
const { getHTMLString } = require('../utility');

/** modify parsed ISRA JSON to fit schema
       * @function alterBusinessAssets
       * @param {object} businessAssets - businessAssets JSON that has been parsed
       * @param {string} xmlDAta - content of xml file
       * @returns {object} edited businessAssets JSON data
       * */
const alterBusinessAssets = (xmlData, businessAssets) => ((xmlDataCopy, businessAssetsCopy) => {
  if (Array.isArray(businessAssetsCopy)) {
    const businessAssetCounter = counter();
    businessAssetsCopy.forEach((asset) => {
      businessAssetCounter.increment();
      const ba = asset;

      ba.businessAssetDescription = getHTMLString(xmlDataCopy, 'businessAssetDescription', businessAssetCounter.getCount());

      ba.businessAssetProperties = (({
        businessAssetConfidentiality,
        businessAssetIntegrity,
        businessAssetAvailability,
        businessAssetAuthenticity,
        businessAssetAuthorization,
        businessAssetNonRepudiation,
      }) => ({
        businessAssetConfidentiality,
        businessAssetIntegrity,
        businessAssetAvailability,
        businessAssetAuthenticity,
        businessAssetAuthorization,
        businessAssetNonRepudiation,
      }))(ba);
      ba.businessAssetProperties.businessAssetIdRef = ba.businessAssetId;
    });
  }
})(xmlData, businessAssets);

module.exports = alterBusinessAssets;
