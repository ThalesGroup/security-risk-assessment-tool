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

    // update businessAssets & risk
    const updateOtherTabs = (tableOptions) => {
      const options = tableOptions;

      const update = (cell) => {
        const rowId = cell.getRow().getData().businessAssetId;
        window.businessAssets.updateBusinessAsset(rowId, cell.getField(), cell.getValue());
      };

      // name
      options.columns[0].cellEdited = (cell) => {
        update(cell);
      };
      // asset values
      options.columns[1].columns.forEach((column) => {
        const c = column;
        c.cellEdited = (cell) => {
          update(cell);
        };
      });
    };

    const addTableData = (businessAssetsTable, asset) => {
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
    };

    const addDesc = (id, desc) => {
      tinymce.init({
        selector: `#business-assets__section-text-${id}`,
        height: 200,
        min_height: 200,
        plugins: 'link lists',
        toolbar: 'undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link | numlist bullist',

        setup: (editor) => {
          editor.on('init', () => {
            const content = desc;
            editor.setContent(content);
          });
        },
      });
    };

    const addSection = (id, asset) => {
      // add section inside sections div
      $('#business-assets__sections').append(`<div class="section" id="business-assets__section__${id}">`);
      const section = $(`#business-assets__section__${id}`);

      // add checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = id;
      checkbox.id = `business-assets__section__checkbox-${id}`;
      checkbox.name = 'business-assets__section-checkboxes';
      section.append(checkbox);

      // add table
      section.append(`<div id="business-assets__section__table__${id}"></div>`);
      // custom title
      result[1].columns[0].title = `${id} Name`;
      // cell edited callback function
      const options = JSON.parse(JSON.stringify(result[1]));
      const businessAssetsTable = new Tabulator(`#business-assets__section__table__${id}`, options);
      addTableData(businessAssetsTable, asset);
      updateOtherTabs(options);

      // add rich text box
      section.append('<p class="business-assets__sections-description">Description</p>');
      section.append(`<textarea class="business-assets-rich-text" id="business-assets__section-text-${id}" name="business-assets__section-text-${id}"></textarea>`);
      addDesc(id, asset.businessAssetDescription);
    };

    const addBusinessAssetSection = (businessAssets) => {
      businessAssets.forEach((asset) => {
        const id = asset.businessAssetId;
        addSection(id, asset);
      });
    };

    window.project.load(async (event, data) => {
      tinymce.remove('.business-assets-rich-text');
      $('#business-assets__sections').empty();
      addBusinessAssetSection(await JSON.parse(data).BusinessAsset);
    });

    $('#business-assets__section--add').on('click', async () => {
      const businessAsset = await window.businessAssets.addBusinessAsset();
      addBusinessAssetSection(businessAsset);
    });

    const deleteBusinessAsset = async (checkboxIds) => {
      const checkedSections = [];
      checkboxIds.forEach((box) => {
        if (box.checked) checkedSections.push(box.value);
      });

      await window.businessAssets.deleteBusinessAsset(checkedSections);
      checkedSections.forEach((id) => {
        tinymce.remove(`#business-assets__section-text-${id}`);
        $(`#business-assets__section__${id}`).remove();
      });
    };

    $('#business-assets__section--delete').on('click', async () => {
      const checkboxIds = document.getElementsByName('business-assets__section-checkboxes');
      deleteBusinessAsset(checkboxIds);
    });
  } catch (err) {
    alert('Failed to load business assets tab');
  }
})();
