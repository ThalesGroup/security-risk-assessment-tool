/*----------------------------------------------------------------------------
*
*     Copyright © 2022-2025 THALES. All Rights Reserved.
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

const { TEXT_COLOR = {} } = window.COLOR_CONSTANTS || {};
const ERROR_COLOR = TEXT_COLOR.ERROR;
const DEFAULT_TEXT_COLOR = TEXT_COLOR.DEFAULT;

(async () => {
  var fetchedData

    const countInArray = (array,ref) =>{
      return array.reduce((n, x) => n + (x === ref), 0);
    }
    // Check if the businessAsset is valid
    const checkBusinessAssetRef = (ref) =>{
      if (ref === null || ref == "null") return false
      let foundBusinessAsset = fetchedData.BusinessAsset.find(obj => obj.businessAssetId == ref);
      return foundBusinessAsset && foundBusinessAsset.businessAssetName !== '' ? true : false
    };
    
    // Check if the businessAssets are valid
    const checkBusinessAssetRefArray = (refArray) =>{
      if(refArray.length){
        for (ref of refArray){
          if (! checkBusinessAssetRef(ref)) return false
        }
      }
      return true
    };

    const findSupportingAsset = (ref) =>{
      return fetchedData.SupportingAsset.find(obj => obj.supportingAssetId == ref) || null;
    };

    const validateSAName = (sa) => {
      if (
        sa.businessAssetRef.length == 0 || 
        sa.businessAssetRef.length !== new Set(sa.businessAssetRef).size || 
        !checkBusinessAssetRefArray(sa.businessAssetRef) || 
        sa.supportingAssetName == ''
      ){
        return ERROR_COLOR;
      } else return DEFAULT_TEXT_COLOR;
    };

  try {
    function handleReload(event) {
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
      }
    }
    disableAllTabs()
    window.addEventListener('keydown', handleReload);
    const result = await window.render.supportingAssets();
    $('#supporting-assets').append(result[0]);

    const matrixTable = '#supporting-asset-business-assets__table';
    let selectOptions = {};

    const validate = (id, field, value) =>{
      let sa = supportingAssetsTable.getRow(id).getData()
      let saBARef = field === 'businessAssetRef'? value : sa?  sa.businessAssetRef : null
      let saName = field === 'supportingAssetName'? value : sa ? sa.supportingAssetName : null

      // The Supporting Asset is invalid when...
      if (
        // Its Business Asset array is empty or has invalid values
        !checkBusinessAssetRefArray(saBARef) || 
        // Its select input has no option and Business Asset array is empty
        (saBARef.length === 0 && !$(`${matrixTable}-${id} select`).length) || 
        // Its Business Asset array contains duplicated values
        saBARef.length !== new Set(saBARef).size || 
        // Its Name is undefined
        !saName || 
        // Its Name is empty
        saName==''
      ){
        $(`${matrixTable}-${id} td.matrix-sa-id`).css('color', ERROR_COLOR);
        $(`${matrixTable}-${id} td.matrix-sa-id`).css('font-weight', 'bold');
        $(`${matrixTable}-${id} td.matrix-sa-name`).css('color', ERROR_COLOR);
        $(`${matrixTable}-${id} td.matrix-sa-name`).css('font-weight', 'bold');
      } else {
        $(`${matrixTable}-${id} td.matrix-sa-id`).css('color', DEFAULT_TEXT_COLOR);
        $(`${matrixTable}-${id} td.matrix-sa-id`).css('font-weight', 'normal');
        $(`${matrixTable}-${id} td.matrix-sa-name`).css('color', DEFAULT_TEXT_COLOR);
        $(`${matrixTable}-${id} td.matrix-sa-name`).css('font-weight', 'normal');
      }
    }

    const updateSelectDesign = (id) => {
      // Retrieve the current set of selected business asset
      let currentOptions = []
      $(`${matrixTable}-${id} td.matrix-sa-ba div select`).map((key,item) => (
        currentOptions.push(item.value)
      ))
    
      // Retrieve the duplicated selected business asset
      let mappingDuplicate = {}
      $(`${matrixTable}-${id} td.matrix-sa-ba div select`).map((key,item) => (
        mappingDuplicate[item.value] = countInArray(currentOptions,item.value)
      ))

      // Update the design of the invalid selects
      $(`${matrixTable}-${id} td.matrix-sa-ba div select`).map((key,item) => (
        !item.value || 
        item.value == "null" || 
        mappingDuplicate[item.value] > 1 ? 
        item.setAttribute('style', `border-color : ${ERROR_COLOR}; border-width: 3px`): item.setAttribute('style', `border-color : ${DEFAULT_TEXT_COLOR}; border-width: 1px`)
      ))
    }

    const supportingAssetsTable = new Tabulator('#supporting-assets__section-table', result[1]);

    const updateSupportingAsset = (id, field, value) => {
      if (field === 'businessAssetRef') {
        validate(id, field, value);
      }
      else {
        if (field === 'supportingAssetName') {
          if (value && !document.getElementById(`supporting-asset-business-assets__table-${id}`)) {
            addMatrixRow(id, value);
            addBusinessAsset(id, null, 0);
            validate(id, 'businessAssetRef', $(`${matrixTable}-${id} option:selected`).map((i, e) => e.value).get());
          } else {
            validate(id, field, value);
          }
        }

        window.supportingAssets.updateSupportingAsset(id, field, value);
      }
      let updatedSA = supportingAssetsTable.getRow(id).getData()
      updatedSA[field]=value
      supportingAssetsTable.getRow(id).getCell('supportingAssetName').getElement().style.color = validateSAName(updatedSA);

    };

    const tableOptions = result[1];
    // cell edited callback function
    tableOptions.columns[3].cellEdited = (cell) => {
      const id = cell.getRow().getData().supportingAssetId;
      updateSupportingAsset(id, cell.getField(), cell.getValue());
      $(`${matrixTable}-${id} td.matrix-sa-name`).html(cell.getValue());
    };

    tableOptions.columns[0].formatter = (cell) => {
      const id = cell.getRow().getIndex();
      if (id) {
        return `
            <input type="checkbox" name="supporting-assets__section-checkbox" value="${id}" id="supporting-assets__section-checkbox${id}"/>
        `;
      }
    };

    tableOptions.columns[3].formatter = (cell) => {
      cell.getElement().style.color = validateSAName(cell.getRow().getData())
      return cell.getValue();
    }
    const addBusinessAsset = (id, ref, index) => {
      const matrixRow = $(`${matrixTable}-${id} td.matrix-sa-ba`);
      const newDiv = document.createElement('div');
      const newInput = document.createElement('input');
      const newSelect = document.createElement('select');
      newSelect.classList.add('text-wrap');
      newInput.setAttribute('type', 'checkbox');
      newInput.setAttribute('data-index', index);
      let sa = findSupportingAsset(id)
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
      newSelect.setAttribute('style',!checkBusinessAssetRef(ref) || (sa && countInArray(sa.businessAssetRef,ref) > 1 ) ? `border-color : ${ERROR_COLOR}; border-width: 3px`: `border-color : ${DEFAULT_TEXT_COLOR}; border-width: 1px`)

      // change in selected option due to user input
      $(newSelect).on('change', (e) => {
        let prevOptions=sa ? sa.businessAssetRef : []
        window.supportingAssets.updateBusinessAssetRef(id, e.target.value === 'null' ? null : e.target.value, $(e.target).attr('data-index'));
        const selected = $(`${matrixTable}-${id} option:selected`).map((i, e) => e.value).get();
        updateSupportingAsset(id, 'businessAssetRef', selected);
        newSelect.setAttribute('style',!checkBusinessAssetRef(e.target.value) || (countInArray(prevOptions,e.target.value) > 0) ? `border-color : ${ERROR_COLOR}; border-width: 3px`: `border-color : ${DEFAULT_TEXT_COLOR}; border-width: 1px`)
        updateSelectDesign(id)
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
        <td class="matrix-sa-id">${id}</td>
        <td class="matrix-sa-name text-wrap">${name}</td>
        <td class="matrix-sa-ba">
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
        validate(id, 'businessAssetRef', selected);
        updateSupportingAsset(id, 'businessAssetRef', selected)

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
        validate(id, 'businessAssetRef', selected);
        updateSupportingAsset(id, 'businessAssetRef', selected)
                
        updateSelectDesign(id)
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

        addMatrixRow(id, asset.supportingAssetName);
        asset.businessAssetRef.forEach((ref, index) => {
          addBusinessAsset(id, ref, index);
        });       

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
      businessAssets.forEach((asset) => {
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
          link_target_list: false,
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

          setup: function (ed) {
            ed.on('change', function (e) {
              const desc = tinymce.get('product-architecture-diagram__text').getContent()
              const tableData = Tabulator.findTable('#supporting-assets__section-table')[0].getData();
              window.validate.supportingAssets(tableData, desc);

            });
            ed.on('click', function (event) {
              const target = event.target;
  
              if (target.tagName === 'A') {
                event.preventDefault();
                const href = target.getAttribute('href');
                if (href) {
                  window.utility.openURL(href, navigator.onLine);
                }
              }
            });
          }

        });

        fetchedData = await JSON.parse(data);
        updateSupportingAssetFields(fetchedData);
        enableAllTabs()
        window.removeEventListener('keydown', handleReload);
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
