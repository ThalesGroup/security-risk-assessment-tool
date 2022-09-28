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

const alterISRAmeta = require('./alter-isra-meta');
const alterProjectContext = require('./alter-project-context');
const alterBusinessAssets = require('./alter-business-assets');
const alterSupportingAssets = require('./alter-supporting-assets');
const alterRisks = require('./alter-risks');
const alterVulnerability = require('./alter-vulnerability');
const { getHTMLString } = require('../utility');

/** modify parsed ISRA JSON to fit schema
       * @function alterISRA
       * @param {object} israJSONData - ISRA JSON that has been parsed
       * @param {string} xmlDAta - content of xml file
       * @returns {object} edited ISRA JSON data
       * */
const alterISRA = (israJSONData, xmlData) => ((israJSONDataCopy, xmlDataCopy) => {
  const israJSON = israJSONDataCopy;

  // alter contents of each key tagname
  israJSON.ISRAmeta = alterISRAmeta(israJSONDataCopy.ISRAmeta).pop();
  israJSON.ProjectContext = alterProjectContext(xmlDataCopy, israJSONDataCopy.ProjectContext).pop();
  israJSON.SupportingAssetsDesc = getHTMLString(xmlDataCopy, 'supportingAssetDiagram');
  alterBusinessAssets(xmlDataCopy, israJSONDataCopy.BusinessAsset);
  alterSupportingAssets(israJSONDataCopy.SupportingAsset, israJSONDataCopy.BusinessAsset);
  alterRisks(xmlDataCopy, israJSONDataCopy.Risk, israJSONDataCopy.BusinessAsset, israJSONDataCopy.SupportingAsset);
  alterVulnerability(xmlDataCopy, israJSONDataCopy.Vulnerability);

  return israJSON;
})(israJSONData, xmlData);

module.exports = alterISRA;
