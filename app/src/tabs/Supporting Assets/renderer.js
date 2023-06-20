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
    //window.render.showLoading()
    const result = await window.render.supportingAssets();
    $('#supporting-assets').append(result[0]);

    const matrixTable = '#supporting-asset-business-assets__table';
    let selectOptions = {};

    const validate = (id, value) =>{
      if ((value.length === 0 && !$(`${matrixTable}-${id} select`).length)
        || value.length !== new Set(value).size
        || value.includes('null')) {
        $(`${matrixTable}-${id} td`).first().css('color', 'red');
        $(`${matrixTable}-${id} td`).first().css('font-weight', 'bold');
      } else {
        $(`${matrixTable}-${id} td`).first().css('color', 'black');
        $(`${matrixTable}-${id} td`).first().css('font-weight', 'normal');
      }
    }

    const updateSupportingAsset = (id, field, value) => {
      if (field === 'businessAssetRef') {
        validate(id, value);
      }
      else {
        if (field === 'supportingAssetName' && value) {
          if (!document.getElementById(`supporting-asset-business-assets__table-${id}`)) {
            addMatrixRow(id, value);
            addBusinessAsset(id, null, 0);
            validate(id, $(`${matrixTable}-${id} option:selected`).map((i, e) => e.value).get());
          } 
        }

        window.supportingAssets.updateSupportingAsset(id, field, value);
      } 
    };

    // cell edited callback function
    result[1].columns[3].cellEdited = (cell) => {
      const id = cell.getRow().getData().supportingAssetId;
      updateSupportingAsset(id, cell.getField(), cell.getValue());
      $(`${matrixTable}-${id} td`).first().html(cell.getValue());
    };

    result[1].columns[0].formatter = (cell) => {
      const id = cell.getRow().getIndex();
      if (id) {
        return `
            <input type="checkbox" name="supporting-assets__section-checkbox" value="${id}" id="supporting-assets__section-checkbox${id}"/>
        `;
      }
    };
    const supportingAssetsTable = new Tabulator('#supporting-assets__section-table', result[1]);

    const addBusinessAsset = (id, ref, index) => {
      const matrixRow = $(`${matrixTable}-${id} td:nth-child(2)`);

      const newDiv = document.createElement('div');
      const newInput = document.createElement('input');
      const newSelect = document.createElement('select');
      newInput.setAttribute('type', 'checkbox');
      newInput.setAttribute('data-index', index);

      Object.entries(selectOptions).forEach(([value, label]) => {
        const newOption = document.createElement('option');
        newOption.text = label;
        newOption.value = value;
        newSelect.setAttribute('data-index', index);
        newSelect.add(newOption);
      });

      // keep track of prev selected option for each select element
      const prevOption = () => {
        $(newSelect).data('prevOption', $(newSelect).val());
      };
      newSelect.value = ref;
      prevOption();

      // change in selected option due to user input
      $(newSelect).on('change', (e) => {
        // prevOption();
        window.supportingAssets.updateBusinessAssetRef(id, e.target.value === 'null' ? null : e.target.value, $(e.target).attr('data-index'));
        const selected = $(`${matrixTable}-${id} option:selected`).map((i, e) => e.value).get();
        updateSupportingAsset(id, 'businessAssetRef', selected);
      });

      // possible change in selected option due to add/delete BusinessAssets
      $(newSelect).on('check:options', () => {
        const currentOption = $(newSelect).val();
        if (currentOption !== $(newSelect).data('prevOption')) {
          $(newSelect).trigger('change');
          prevOption();
        }
      });

      newDiv.appendChild(newInput);
      newDiv.appendChild(newSelect);
      matrixRow.append(newDiv);
    };

    const addMatrixRow = (id, name) => {
      const row = `
      <tr id="supporting-asset-business-assets__table-${id}">
        <td>${name}</td>
        <td>
           <div class="add-delete-container">
              <button class="addDelete">Add</button> | <button class="addDelete">Delete</button>
           </div>
        </td>
      </tr>`;
      $(`${matrixTable} tbody`).append(row);

      // add business asset ref
      $(`${matrixTable}-${id} button`).first().on('click', async () => {
        let index = $(`${matrixTable}-${id} div:last-of-type input:last-of-type`).attr('data-index');
        if(!index) index = -1;
        addBusinessAsset(id, null, parseInt(index)+1);
        const value = $(`${matrixTable}-${id} option:selected`).last().val();
        if (!value) await window.supportingAssets.addBusinessAssetRef(id, 'null');
        else await window.supportingAssets.addBusinessAssetRef(id, value);

        const selected = $(`${matrixTable}-${id} option:selected`).map((i, e) => e.value).get();
        validate(id, selected);
      });

      // delete business asset ref
      $(`${matrixTable}-${id} button:nth-child(2)`).on('click', async () => {
        const checkedBusinessAssetRefs = $(`${matrixTable}-${id} input:checked`).map((i, e) => e.getAttribute('data-index')).get();

        await window.supportingAssets.deleteBusinessAssetRef(id, checkedBusinessAssetRefs);
        
        $(`${matrixTable}-${id} input:checked`).parent().remove();
        document.querySelectorAll(`${matrixTable}-${id} input[type="checkbox"]`).forEach((checkbox, index) => {
          checkbox.setAttribute('data-index', index);
        });
        document.querySelectorAll(`${matrixTable}-${id} select`).forEach((select, index) => {
          select.setAttribute('data-index', index);
        });

        const selected = $(`${matrixTable}-${id} option:selected`).map((i, e) => !e.value ? null : e.value).get();
        validate(id, selected);
      });
    };

    const addSupportingAsset = (assets) => {
      supportingAssetsTable.addData(assets);
      assets.forEach((asset) => {
        const id = asset.supportingAssetId;
        // const checkbox = document.createElement('input');
        // checkbox.type = 'checkbox';
        // checkbox.value = `${id}`;
        // checkbox.id = `supporting-assets__section-checkbox${id}`;
        // checkbox.name = 'supporting-assets__section-checkbox';
        if (asset.supportingAssetName) {
          addMatrixRow(id, asset.supportingAssetName);
          asset.businessAssetRef.forEach((ref, index) => {
            addBusinessAsset(id, ref, index);
          });       
        }

        const selected = $(`${matrixTable}-${id} option:selected`).map((i, e) => e.value).get();
        updateSupportingAsset(id, 'businessAssetRef', selected);
      });
    };

    const supportingAssetTable = (supportingAssets, businessAssets) => {
      // clear list of supporting assets table
      supportingAssetsTable.clearData();
      // $('#supporting-assets__section-checkboxes').empty();

      // clear relationship matrix
      $(`${matrixTable} tbody`).empty();
      selectOptions = {};
      selectOptions[null] = 'Select...';
      businessAssets.filter(uncheckedAsset => uncheckedAsset.businessAssetName).forEach((asset) => {
        selectOptions[asset.businessAssetId] = asset.businessAssetName;
      });

      addSupportingAsset(supportingAssets, businessAssets);
    };

    const supportingAssetsDesc = (desc) => {
      // initialised in project-context.js
      tinymce.get('product-architecture-diagram__text').setContent(desc);
    };

    const updateSupportingAssetFields = (fetchedData) => {
      supportingAssetsDesc(fetchedData.SupportingAssetsDesc);
      supportingAssetTable(fetchedData.SupportingAsset, fetchedData.BusinessAsset);
    };

    $(document).ready(async function () {
      window.project.load(async (event, data) => {
        await tinymce.init({
          selector: '.rich-text',
          promotion: false,
          height: 300,
          min_height: 300,
          verify_html: true,
          statusbar: false,
          plugins: 'link lists image autoresize',
          toolbar: 'undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link | numlist bullist',
          file_picker_callback: function (callback, value, meta) {
            // Provide image and alt text for the image dialog
            if (meta.filetype == 'image') {
              var input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');

              /*
                Note: In modern browsers input[type="file"] is functional without
                even adding it to the DOM, but that might not be the case in some older
                or quirky browsers like IE, so you might want to add it to the DOM
                just in case, and visually hide it. And do not forget do remove it
                once you do not need it anymore.
              */

              input.onchange = function () {
                var file = this.files[0];

                var reader = new FileReader();
                reader.onload = function () {
                  /*
                    Note: Now we need to register the blob in TinyMCEs image blob
                    registry. In the next release this part hopefully won't be
                    necessary, as we are looking to handle it internally.
                  */
                  var id = 'blobid' + (new Date()).getTime();
                  var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                  var base64 = reader.result.split(',')[1];
                  var blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);

                  /* call the callback and populate the Title field with the file name */
                  callback(blobInfo.blobUri(), { title: file.name });
                };
                reader.readAsDataURL(file);
              };

              input.click();
            }
          },
        });

        const fetchedData = await JSON.parse(data);
        updateSupportingAssetFields(fetchedData);
        //window.render.closeLoading()
      });
    });

    // add supporting asset
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
            $(`${matrixTable}-${rowId}`).remove();
          }
        });
      });
    };

    // delete supporting asset
    $('#supporting-assets__section--delete').on('click', () => {
      const checkboxes = document.getElementsByName('supporting-assets__section-checkbox');
      deleteSupportingAsset(checkboxes);
    });

    // window.supportingAssets.getBusinessAssets((event, label, value) => {
    //   const options = $(`${matrixTable} option[value=${value}]`);

    //   if (label === null) {
    //     // delete option
    //     $(`${matrixTable} option[value=${value}]`).remove();
    //     delete selectOptions[value];
    //     $(`${matrixTable} select`).trigger('check:options');
    //   } else if (options.length) {
    //     // update label
    //     options.text(label);
    //     selectOptions[value] = label;
    //   } else {
    //     // add option
    //     $(`${matrixTable} select`).append(new Option(label, value));
    //     selectOptions[value] = label;
    //     $(`${matrixTable} select`).trigger('check:options');
    //   }
    // });
  } catch (err) {
    alert('Failed to load Supporting Assets tab');
  }
})();
