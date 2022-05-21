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
    const result = await window.render.businessAssets();
    $('#business-assets').append(result[0]);

    const businessAssetsTables = [];

    const addSection = (id) => {
      // add section inside sections div
      $('#business-assets__sections').append(`<div class="section" id="business-assets__sections__section__${id}">`);
      const section = $(`#business-assets__sections__section__${id}`);

      // add checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = id;
      checkbox.id = `business-assets__sections__section__checkbox${id}`;
      checkbox.name = 'business-assets__sections__section__checkboxes';
      section.append(checkbox);

      // add table
      result[1].columns[0].title = `${id} Name`;
      section.append(`<div id="business-assets__sections__section__table__${id}"></div>`);
      const businessAssetsTable = new Tabulator(`#business-assets__sections__section__table__${id}`, result[1]);
      businessAssetsTables.push(businessAssetsTable);

      // add rich text box
      section.append('<p class="business-assets__sections__description">Description</p>');
      section.append(`<textarea class="business-assets-rich-text" id="business-assets__sections__section__text__${id}" name="business-assets__sections__section__text__${id}"></textarea>`);
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
  } catch (err) {
    alert('Failed to load business assets tab');
  }
})();
