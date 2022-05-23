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

/* global $ Tabulator tinymce */

(async () => {
  try {
    const result = await window.render.supportingAssets();
    const supportingAssetsTable = new Tabulator('#supporting-assets__section__table', result[1]);

    const supportingAssetsDesc = (desc) => {
      tinymce.get('product-architecture-diagram__text').setContent(desc);
    };

    const supportingAssetTable = (data) => {
      supportingAssetsTable.addData(data.SupportingAsset);
    };

    const updateSupportingAssetFields = (fetchedData) => {
      supportingAssetsDesc(fetchedData.SupportingAssetsDesc);
      supportingAssetTable(fetchedData);
    };

    window.project.load(async (event, data) => {
      supportingAssetsTable.clearData();
      updateSupportingAssetFields(await JSON.parse(data));
    });

    // $('#supporting-assets__section__add').on('click', () => {

    // });
  } catch (err) {
    alert('Failed to load Supporting Assets tab');
  }
})();
