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

const businessAssetsTables = [];

const addSection = (id) => {
  // add section div
  $('#business-assets__sections').append(`<div id="business-assets__sections__section__${id}">`);

  // add checkbox
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = id;
  checkbox.id = `business-assets__sections__section__checkbox${id}`;
  checkbox.name = 'business-assets__sections__section__checkboxes';
  $(`#business-assets__sections__section__${id}`).append(checkbox);

  // add table
  const result = window.render.businessAssets();
  result[1].columns[0].title = `${id} Name`;
  $(`#business-assets__sections__section__${id}`).append(`<div id="business-assets__sections__section__table__${id}"></div>`);
  const businessAssetsTable = new Tabulator(`#business-assets__sections__section__table__${id}`, result[1]);
  businessAssetsTables.push(businessAssetsTable);

  // add rich text box
  $(`#business-assets__sections__section__${id}`).append('<p>Description</p>');
  $(`#business-assets__sections__section__${id}`).append(`<textarea class="business-assets-rich-text" id="business-assets__sections__section__text__${id}" name="business-assets__sections__section__text__${id}"></textarea>`);
};

const initialiseBusinessAssets = (businessAssets) => {
  businessAssets.forEach((asset) => {
    addSection(asset.businessAssetId);

    tinymce.init({
      selector: `#business-assets__sections__section__text__${asset.businessAssetId}`,
      height: 200,
      min_height: 200,

      setup: (editor) => {
        editor.on('init', () => {
          const content = asset.businessAssetDescription;
          editor.setContent(content);
        });
      },
    });
  });
};

const addBusinessAssetData = (businessAssets) => {
  businessAssets.forEach((asset) => {
    businessAssetsTables.forEach((businessAssetsTable) => {
      businessAssetsTable.on('tableBuilt', () => {
        const {
          businessAssetId,
          businessAssetName,
          businessAssetType,
          businessAssetProperties,
        } = asset;
        businessAssetsTable.addData([{
          businessAssetId,
          businessAssetName,
          businessAssetType,
          ...businessAssetProperties,
        }]);
      });
    });
  });
};

const addBusinessAssetSection = (businessAssets) => {
  initialiseBusinessAssets(businessAssets);
  addBusinessAssetData(businessAssets);
};

window.project.load(async (event, data) => {
  tinymce.remove('.business-assets-rich-text');
  $('#business-assets__sections').empty();
  addBusinessAssetSection(await JSON.parse(data).BusinessAsset);
});

$('#business-assets__section__add').on('click', async (e) => {
  e.preventDefault();
  const businessAsset = await window.businessAssets.addBusinessAsset();
  addBusinessAssetSection([businessAsset]);
});

const deleteBusinessAsset = async (checkboxIds) => {
  const checkedSections = [];
  checkboxIds.forEach((box) => {
    if (box.checked) checkedSections.push(box.value);
  });
  await window.businessAssets.deleteBusinessAsset(checkedSections);
  checkedSections.forEach((id) => {
    tinymce.remove(`#business-assets__sections__section__text__${id}`);
    $(`#business-assets__sections__section__${id}`).remove();
  });
};

$('#business-assets__section__delete').on('click', async (e) => {
  e.preventDefault();
  const checkboxIds = document.getElementsByName('business-assets__sections__section__checkboxes');
  deleteBusinessAsset(checkboxIds);
});
