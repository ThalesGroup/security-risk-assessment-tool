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

/** modify parsed ISRA JSON to fit schema
       * @function alterISRAmeta
       * @param {object} israMeta - ISRAmeta JSON that has been parsed
       * @returns {object} edited ISRAmeta JSON data
       * */
const alterISRAmeta = (israMeta) => {
  const meta = israMeta;
  const { businessAssetsCount, supportingAssetsCount, risksCount, vulnerabilitiesCount } = israMeta[0];
  if (meta[0].ISRAtracking === undefined) meta[0].ISRAtracking = [];
  const trackingIdCounter = counter();
  meta[0].ISRAtracking = meta[0].ISRAtracking.map((trackingItem) => {
    const tracking = trackingItem;
    trackingIdCounter.increment();
    const trackingIteration = trackingIdCounter.getCount();
    tracking.trackingIteration = trackingIteration;
    return tracking;
  });

  meta[0].latestBusinessAssetId = Number.parseInt(businessAssetsCount[0]) - 1;
  meta[0].latestSupportingAssetId = Number.parseInt(supportingAssetsCount[0]) - 1;
  meta[0].latestRiskId = Number.parseInt(risksCount[0]) - 1;
  meta[0].latestVulnerabilityId = Number.parseInt(vulnerabilitiesCount[0]) - 1;
  return meta;
};

module.exports = alterISRAmeta;
