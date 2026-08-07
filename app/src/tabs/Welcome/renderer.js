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

/* global $ Tabulator */

(async () => {
  try {
    function handleReload(event) {
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
      }
    }
    disableAllTabs()
    window.addEventListener('keydown', handleReload);
    const result = await window.render.welcome();
    result[1].editable = true;

    result[1].cellClick = function (e, cell) {
      cell.edit();
      return false;
    };

    result[1].cellEdited = function (cell) {
      window.welcome.updateTrackingRow(cell.getRow().getData());
    };

    const trackingCommentColumn = result[1].columns.find(
      (column) => column.field === 'trackingComment'
    );

    if (trackingCommentColumn) {
      /*
      * Use Tabulator's built-in multiline textarea editor.
      */
      trackingCommentColumn.editor = 'textarea';
      trackingCommentColumn.formatter = 'textarea';
      trackingCommentColumn.variableHeight = true;
      trackingCommentColumn.editable = true;
      trackingCommentColumn.cssClass = 'welcome__tracking-comment-cell';

      trackingCommentColumn.editorParams = {
        verticalNavigation: 'editor',
      };
    }

    /*
    * When Tabulator opens the trackingComment editor,
    * allow Shift + Enter to insert a newline without
    * Tabulator treating Enter as "finish editing".
    */
    result[1].cellEditing = function (cell) {
      if (cell.getField() !== 'trackingComment') {
        return;
      }

      requestAnimationFrame(() => {
        const cellElement = cell.getElement();
        const textarea = cellElement.querySelector('textarea');

        if (!textarea) {
          return;
        }

        textarea.addEventListener(
          'keydown',
          (event) => {
            if (event.key === 'Enter' && event.shiftKey) {
              /*
              * Stop Tabulator from processing this Enter.
              */
              event.preventDefault();
              event.stopPropagation();
              event.stopImmediatePropagation();

              const start = textarea.selectionStart;
              const end = textarea.selectionEnd;

              const value = textarea.value;

              textarea.value =
                value.substring(0, start) +
                '\n' +
                value.substring(end);

              /*
              * Put the cursor after the new line.
              */
              textarea.selectionStart = start + 1;
              textarea.selectionEnd = start + 1;

              /*
              * Trigger input so Tabulator knows the textarea changed.
              */
              textarea.dispatchEvent(
                new Event('input', {
                  bubbles: true,
                })
              );
            }
          },
          true
        );
      });
    };
    $('#welcome').append(result[0]);
    result[1].columns[0].formatter = (cell) => {
      const id = cell.getRow().getIndex();
      if (id) {
        return `
            <input type="checkbox" name="welcome__isra-meta-tracking-checkbox" value="${id}" id="welcome__isra-meta-tracking-checkbox${id}"/>
        `;
      }
    };
    let classificationLabel;

    // result[1]['columnDefaults'] = {
    //   tooltip: function(e, cell, onRendered) {
    //     var el = document.createElement("div");
    //     el.style.fontFamily = "Arial";
    //     el.style.color = "red";
    //     el.innerText = cell.getColumn().getField() + " - " + cell.getValue(); //return cells "field - value";

    //     return el;
    //   },
    // };


    const trackingtable = new Tabulator('#welcome__isra-meta-tracking-table', result[1]);

    const appVersion = (value) => {
      $('#details__app-version').val(`App Version: ${value}`);
    };

    const projectName = (value) => {
      $('#welcome__isra-meta--project-name').val(value);
    };

    const projectVersion = (value) => {
      $('#welcome__isra-meta--project-version').val(value);
    };

    const setSessionStorage = () =>{
      sessionStorage.setItem('validate-isra-meta-organization', document.getElementById('welcome__isra-meta--organization').checkValidity());
    }

    const targetedLevelOfTrust = (value) => {
      $('#welcome__isra-meta--targeted-level-of-trust').val(value);
    };

    $('#welcome__isra-meta--organization').click((e)=>{
      setSessionStorage();
    })

    const organization = async (value) => {
      const config = await window.welcome.getConfig();
      const orgOptions = document.getElementById('welcome__isra-meta--organization');
      const numberOfOrgs = orgOptions.options.length - 1
      if (!config.organizations.includes(value) && value !== '') {
        var newOrg = document.createElement('option');
        newOrg.text = value;
        newOrg.value = value;
        orgOptions.appendChild(newOrg);
      } else if (numberOfOrgs > config.organizations.length ) {
        const addedOrgIndex = orgOptions.options.length - 1
        orgOptions.options[addedOrgIndex].remove()

      }

      $('#welcome__isra-meta--organization').val(value);
      setSessionStorage();
    };

    const addTrackingRow = (tracking) => {
      trackingtable.addData([tracking]);
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = `${tracking.trackingIteration}`;
      checkbox.id = `welcome__isra-meta-tracking-checkbox${tracking.trackingIteration}`;
      checkbox.name = 'welcome__isra-meta-tracking-checkbox';
      // $('#welcome__isra-meta-tracking-checkboxes').append(checkbox);
    };

    const iterationsHistory = (arr) => {
      trackingtable.clearData();
      // $('#welcome__isra-meta-tracking-checkboxes').empty();

      arr.forEach((tracking) => {
        addTrackingRow(tracking);
      });
    };

    const updateWelcomeFields = (fetchedData) => {
      appVersion(fetchedData.appVersion);
      projectName(fetchedData.projectName);
      targetedLevelOfTrust(fetchedData.targetedLevelOfTrust);
      projectVersion(fetchedData.projectVersion);
      organization(fetchedData.projectOrganization);
      iterationsHistory(fetchedData.ISRAtracking);
    };

    $(document).ready(function () {
      window.project.load(async (data) => {
        isra= await JSON.parse(data).ISRAmeta
        updateWelcomeFields(isra);
        classificationLabel = isra.classification;
      });
      enableAllTabs()
      window.removeEventListener('keydown', handleReload);
    });

    // events

    $('#welcome__isra-meta-tracking--add').on('click', async () => {
      const rowData = await window.welcome.addTrackingRow();
      addTrackingRow(rowData);
    });

    const deleteTrackingRow = async (checkboxes) => {
      const checkedRows = [];
      checkboxes.forEach((box) => {
        if (box.checked) {
          checkedRows.push(box.value);
        }
      });
      if (checkedRows.length > 0) {
        trackingtable.getRows().forEach((row) => {
          window.welcome.updateTrackingRow(row.getData());
        });

        $('#welcome__isra-meta-tracking-checkboxes').empty();
        trackingtable.clearData();

        const data = await window.welcome.deleteTrackingRow(checkedRows);
        data.forEach((row) => {
          addTrackingRow(row);
        });
      }
    };

    $('#welcome__isra-meta-tracking--delete').on('click', async () => {
      const checkboxes = document.getElementsByName('welcome__isra-meta-tracking-checkbox');
      deleteTrackingRow(checkboxes);
    });

    $('input[id="welcome__isra-meta--project-name"]').on('change', async(e) => {
      const { value } = e.target;
      await window.welcome.updateProjectNameAndVersionRef('projectName', value);
      if (value === '') $('footer').text(classificationLabel);
      else $('footer').text(classificationLabel.substring(0, classificationLabel.indexOf('{') + 1) + value + classificationLabel[classificationLabel.length - 1]);

    });

    $('input[id="welcome__isra-meta--project-version"]').on('change', async (e) => {
      const { value } = e.target;
      await window.welcome.updateProjectNameAndVersionRef('projectVersion', value);
    });
  } catch (err) {
    alert('Failed to load welcome tab');
  }
})();