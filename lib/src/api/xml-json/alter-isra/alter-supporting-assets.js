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

/** modify parsed ISRA JSON to fit schema
       * @function alterSupportingAssets
       * @param {object} supportingAssets - supportingAssets JSON that has been parsed
       * @returns {object} edited supportingAssets JSON data
       * */
const alterSupportingAssets = (supportingAssets) => ((supportingAssetsCopy) => {
  if (Array.isArray(supportingAssetsCopy)) {
    supportingAssetsCopy.forEach((asset) => {
      const sa = asset;
      const { supportingAndBusinessAssetLink } = sa;
      if (supportingAndBusinessAssetLink !== undefined) {
        const businessAssetRef = supportingAndBusinessAssetLink.map((link) => {
          if (link.$.businessAssetRef !== '') return link.$.businessAssetRef;
          return null;
        });
        sa.businessAssetRef = businessAssetRef.filter(Number);
      }
    });
  }
  return supportingAssetsCopy;
})(supportingAssets);

module.exports = alterSupportingAssets;
