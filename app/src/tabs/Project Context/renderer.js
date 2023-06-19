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
/* global $ tinymce */

(async () => {
  try {
    //window.render.showLoading()
    const result = await window.render.projectContext();
    $('#project-context').append(result[0]);

    const projectDescription = (value) => {
      tinymce.get('project-description__text').setContent(value);
    };

    const projectURL = (value) => {
      const hyperlink = $('#project-description__url--hyperlink');
      const insert = $('#project-description__url--insert');

      if (value !== '' && value !== 'cancelled') {
        hyperlink.show();
        insert.hide();
        hyperlink.attr('href', value);
        hyperlink.text(value);
      } else if (value === '') {
        insert.show();
        hyperlink.hide();
      }
    };

    $('#project-description__url--hyperlink').on('click', (e) => {
      e.preventDefault();
      window.projectContext.openURL($('#project-description__url--hyperlink').attr('href'), navigator.onLine);
    });

    $('#project-description__url-image').on('click', async () => {
      const url = await window.projectContext.urlPrompt();
      projectURL(url);
    });

    $('#project-description__url--insert').on('click', async () => {
      const url = await window.projectContext.urlPrompt();
      projectURL(url);
    });

    $('#project-description__attachment').on('click', () => {
      window.projectContext.attachment();
      window.projectContext.fileName(async (event, fileName) => {
        $('#project-description__file--insert').text(fileName);
      });
    });

    const projectDescriptiveAttachment = async (value) => {
      const attachmentResult = await window.projectContext.decodeAttachment(value);
      $('#project-description__file--insert').text(attachmentResult);
    };

    const projectObjectives = (value) => {
      tinymce.get('project-objectives__text').setContent(value);
    };

    const officerObjectives = (value) => {
      tinymce.get('officer-objectives__text').setContent(value);
    };

    const assumptions = (value) => {
      tinymce.get('assumptions__text').setContent(value);
    };

    const updateProjectContextFields = (fetchedData) => {
      projectDescription(fetchedData.projectDescription);
      projectURL(fetchedData.projectURL);
      projectDescriptiveAttachment(fetchedData.projectDescriptionAttachment);
      projectObjectives(fetchedData.securityProjectObjectives);
      officerObjectives(fetchedData.securityOfficerObjectives);
      assumptions(fetchedData.securityAssumptions);
    };

    $(document).ready(function () {
      window.project.load(async (event, data) => {
        await tinymce.init({
          tooltip: 'Add your formatted picures!!',
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
          // Remove the validation from the tab and use this instead
          setup: function (ed) {
            ed.on('change', function (e) {
              window.validate.projectContext([
                tinymce.get('project-description__text').getContent(),
                tinymce.get('project-objectives__text').getContent(),
                tinymce.get('officer-objectives__text').getContent(),
                tinymce.get('assumptions__text').getContent(),
              ]);


            });
          }
        });

        updateProjectContextFields(await JSON.parse(data).ProjectContext);
        //window.render.closeLoading()
      });
    });

    
  } catch (err) {
    alert('Failed to load project context tab');
  }
})();
