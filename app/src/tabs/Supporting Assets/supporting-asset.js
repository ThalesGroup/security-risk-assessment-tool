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

    // cell edited callback function
    result[1].columns[2].cellEdited = (cell) => {
      const id = cell.getRow().getData().supportingAssetId;
      $(`#supporting-asset-business-assets__table-${id} td`).first().html(cell.getValue());
    };
    const supportingAssetsTable = new Tabulator('#supporting-assets__section-table', result[1]);

    const updateMatrix = (id, name) => {
      const row = `
      <tr id="supporting-asset-business-assets__table-${id}">
        <td>${name}</td>
        <td>
          <div>
           <div class="add-delete-container">
              <button class="addDelete" id=supporting-asset-business-assets__table--add${id}>Add</button> | <button class="addDelete" supporting-asset-business-assets__table--delete${id}>Delete</button>
           </div>
           <div style="display:flex; flex-direction:row;">
              <input type="checkbox"></input>
              <select style="width: 100%"></select>
           </div>
          </div>
        </td>
      </tr>`;
      $('#supporting-asset-business-assets__table tbody').append(row);
    };

    const addSupportingAsset = (assets) => {
      supportingAssetsTable.addData(assets);
      assets.forEach((asset) => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${asset.supportingAssetId}`;
        checkbox.id = `supporting-assets__section-checkbox${asset.supportingAssetId}`;
        checkbox.name = 'supporting-assets__section-checkbox';
        $('#supporting-assets__section-checkboxes').append(checkbox);
        updateMatrix(asset.supportingAssetId, asset.supportingAssetName);
      });
    };

    const supportingAssetTable = (assets) => {
      supportingAssetsTable.clearData();
      $('#supporting-assets__section-checkboxes').empty();
      $('#supporting-asset-business-assets__table tbody').empty();
      addSupportingAsset(assets);
    };

    const supportingAssetsDesc = (desc) => {
      tinymce.get('product-architecture-diagram__text').setContent(desc);
    };

    const updateSupportingAssetFields = (fetchedData) => {
      supportingAssetsDesc(fetchedData.SupportingAssetsDesc);
      supportingAssetTable(fetchedData.SupportingAsset);
    };

    window.project.load(async (event, data) => {
      const fetchedData = await JSON.parse(data);
      updateSupportingAssetFields(fetchedData);
    });

    $('#supporting-assets__section--add').on('click', async () => {
      const asset = await window.supportingAssets.addSupportingAsset();
      addSupportingAsset(asset);
    });

    const deleteSupportingAsset = async (checkboxes) => {
      const checkedAssets = [];
      checkboxes.forEach((box) => {
        if (box.checked) checkedAssets.push(box.value);
      });

      await window.supportingAssets.deleteSupportingAsset(checkedAssets);
      checkedAssets.forEach((id) => {
        $(`#supporting-assets__section-checkbox${id}`).remove();

        supportingAssetsTable.getRows().forEach((row) => {
          const rowId = Number(row.getData().supportingAssetId);
          if (rowId === Number(id)) {
            row.delete();
            $(`#supporting-asset-business-assets__table-${rowId}`).remove();
          }
        });
      });
    };

    $('#supporting-assets__section--delete').on('click', () => {
      const checkboxes = document.getElementsByName('supporting-assets__section-checkbox');
      deleteSupportingAsset(checkboxes);
    });

    // window.supportingAssets.getBusinessAssets((e, label, value) => {
    //   $('#supporting-asset-business-assets__table select').append(`<option value="${value}">${label}</option>`);
    // });
  } catch (err) {
    alert('Failed to load Supporting Assets tab');
  }
})();
