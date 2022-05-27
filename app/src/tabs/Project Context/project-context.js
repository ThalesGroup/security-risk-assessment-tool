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
    const result = await window.render.projectContext();
    $('#project-context').append(result[0]);

    const projectDescription = (value) => {
      tinymce.get('project-description__text').setContent(value);
    };

    const projectURL = (value) => {
      if (value !== '' && value !== 'cancelled') {
        $('#project-description__url--hyperlink').show();
        $('#project-description__url--insert').hide();
        $('#project-description__url--hyperlink').attr('href', value);
        $('#project-description__url--hyperlink').text(value);
      } else if (value === '') {
        $('#project-description__url--insert').show();
        $('#project-description__url--hyperlink').hide();
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
      if (value !== '') {
        const attachmentResult = await window.projectContext.decodeAttachment(value);
        $('#project-description__file--insert').text(attachmentResult);
      }
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

    window.project.load(async (event, data) => {
      tinymce.init({
        selector: '.rich-text',
        height: 300,
        min_height: 300,
        plugins: 'link lists',
        toolbar: 'undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link | numlist bullist',
      });
      updateProjectContextFields(await JSON.parse(data).ProjectContext);
    });
  } catch (err) {
    alert('Failed to load project context tab');
  }
})();
