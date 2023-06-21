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

function updateBusinessAssetName(id, field){
  const value = document.querySelector(`textarea[id="${id}"][name="businessAssetName"]`).value;  
  window.businessAssets.updateBusinessAsset(id, field, value);   
}

(async () => {
  try {
    //window.render.showLoading()
    function handleReload(event) {
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
      }
    }
    document.querySelector('button.tab-button[data-id="business-assets"]').disabled = true;
    window.addEventListener('keydown', handleReload);
    const result = await window.render.businessAssets();
    $('#business-assets').append(result[0]);

    // update businessAssets & risk
    const updateOtherTabs = (tableOptions, businessAssetName) => {
      const options = tableOptions;

      const update = (cell) => {
        const rowId = cell.getRow().getData().businessAssetId;
        window.businessAssets.updateBusinessAsset(rowId, cell.getField(), cell.getValue());
      };

      // name
      // options.columns[0].cellEdited = (cell) => {
      //   update(cell);
      // };
      options.columns[0].formatter = (cell) => {
        const id = cell.getRow().getIndex();
        if (id) {
          return `
            <textarea id="${id}" rows="2" cols="16" name="businessAssetName" onchange="updateBusinessAssetName(${id}, 'businessAssetName')">${businessAssetName}</textarea>
          `;
        }
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

    const addDesc = async (id, desc) => {
      await tinymce.init({
        selector: `#business-assets__section-text-${id}`,
        promotion: false,
        height: 200,
        min_height: 200,
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
        setup: function (editor)  {
          editor.on('init', () => {
            const content = desc;
            editor.setContent(content);
          });
          editor.on('change', function (e) {
            let richText = tinymce.get(e.target.id).getContent();
            const id = e.target.id.replace(/\D/g,'')
            const tableData = Tabulator.findTable(`#business-assets__section-table__${id}`)[0].getData()[0];
            tableData.businessAssetDescription = richText
            window.validate.businessAssets(tableData)
          });
        },
        
      });
      //window.render.closeLoading()
      document.querySelector('button.tab-button[data-id="business-assets"]').disabled = false;
      window.removeEventListener('keydown', handleReload);
    };

    const addSection = (id, asset) => {
      // add checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = id;
      checkbox.id = `business-assets__section__checkbox-${id}`;
      checkbox.name = 'business-assets__section-checkboxes';
      checkbox.style.position = 'absolute';
      $('#business-assets__sections').append(checkbox);

      // add section inside sections div
      $('#business-assets__sections').append(`<section class="section" id="business-assets__section__${id}"></section>`);
      const section = $(`#business-assets__section__${id}`);
      section.css('margin-left', '20px');

      // add table
      section.append(`<div id="business-assets__section-table__${id}"></div>`);
      // custom title
      result[1].columns[0].title = `${id} Name`;
      // cell edited callback function
      const options = JSON.parse(JSON.stringify(result[1]));
      const businessAssetsTable = new Tabulator(`#business-assets__section-table__${id}`, options);
      addTableData(businessAssetsTable, asset);
      updateOtherTabs(options, asset.businessAssetName);

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

    $(document).ready(function () {
      window.project.load(async (event, data) => {
        tinymce.remove('.business-assets-rich-text');
        $('#business-assets__sections').empty();
        addBusinessAssetSection(await JSON.parse(data).BusinessAsset);
      });
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
        $(`input[id="business-assets__section__checkbox-${id}"]`).remove();
      });
    };

    $('#business-assets__section--delete').on('click', async () => {
      const checkboxIds = document.getElementsByName('business-assets__section-checkboxes');
      deleteBusinessAsset(checkboxIds);
    });
    // document.querySelectorAll('textarea').forEach((textarea) => {
    //   textarea.addEventListener('change', (e) => {
        
    //   // window.businessAssets.updateBusinessAsset(id, name, value);
    //   });
    // })
  } catch (err) {
    alert('Failed to load business assets tab');
  }
})();
