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
const utility = require('../utility');

// modify isra JSON and return modified isra JSON back to parser.js for validation against schema
const alterISRA = (israJSONData, xmlData) => ((israJSONDataCopy, xmlDataCopy) => {
  const israJSON = israJSONDataCopy;

  // alter contents of each key tagname
  israJSON.ISRAmeta = utility().arr2Obj(alterISRAmeta(israJSONDataCopy.ISRAmeta));
  israJSON.ProjectContext = utility().arr2Obj(
    alterProjectContext(xmlDataCopy, israJSONDataCopy.ProjectContext),
  );
  israJSON.BusinessAsset = alterBusinessAssets(xmlDataCopy, israJSONDataCopy.BusinessAsset);
  israJSON.SupportingAssetsDesc = utility().getHTMLString(xmlDataCopy, 'supportingAssetDiagram');
  israJSON.SupportingAsset = alterSupportingAssets(israJSONDataCopy.SupportingAsset);
  israJSON.Risk = alterRisks(xmlDataCopy, israJSONDataCopy.Risk);
  israJSON.Vulnerability = alterVulnerability(xmlDataCopy, israJSONDataCopy.Vulnerability);

  return israJSON;
})(israJSONData, xmlData);

module.exports = alterISRA;
