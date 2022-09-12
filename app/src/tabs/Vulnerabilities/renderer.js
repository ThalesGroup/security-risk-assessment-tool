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
/* global $ tinymce Tabulator */

(async () => {
    try {
    const result = await window.render.vulnerabilities();
    const vulnerabilitiesTable = new Tabulator('#vulnerabilties__table', result[1]);
    let vulnerabilitiesData;

    const getCurrentVulnerabilityId = () =>{
        return vulnerabilitiesTable.getSelectedData()[0].vulnerabilityId;
    };

    const getCurrentVulnerability = () =>{
        return vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
    };

    const addSelectedVulnerabilityRowData = async (id) =>{
        vulnerabilitiesTable.selectRow(id);
        const {
            vulnerabilityId,
            vulnerabilityName,
            vulnerabilityTrackingID,
            vulnerabilityTrackingURI,
            vulnerabilityCVE,
            vulnerabilityFamily,
            vulnerabilityDescription,
            vulnerabilityDescriptionAttachment,
        } = vulnerabilitiesData.find((v) => v.vulnerabilityId === id);

        $('#vulnerabilityId').text(vulnerabilityId);
        $('#vulnerability__name').val(vulnerabilityName);
        $('#vulnerability__trackingID').val(vulnerabilityTrackingID);
        vulnerabilityURL(vulnerabilityTrackingURI);
        $('#vulnerability__CVE').val(vulnerabilityCVE);
        $('select[id="vulnerability__family"]').val(!vulnerabilityFamily ? 'null' : vulnerabilityFamily);
        tinymce.get('vulnerability__details').setContent(vulnerabilityDescription);

        const attachmentResult = await window.vulnerabilities.decodeAttachment(vulnerabilityId ,vulnerabilityDescriptionAttachment);
        $('#vulnerability__file--insert').text(attachmentResult);
    };

    // row is clicked & selected
    vulnerabilitiesTable.on('rowClick', (e, row) => {
        addSelectedVulnerabilityRowData(row.getIndex());
    });

    const addVulnerability = (vulnerability) =>{
        // add vulnerability data
        vulnerabilitiesTable.addData([vulnerability]);

        // add checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${vulnerability.vulnerabilityId}`;
        checkbox.id = `vulnerabilties__table__checkboxes__${vulnerability.vulnerabilityId}`;
        checkbox.name = 'vulnerabilties__table__checkboxes';
        $('#vulnerabilties__table__checkboxes').append(checkbox);
    };

    const updateVulnerabilityFields = (vulnerabilities) =>{
        vulnerabilitiesTable.clearData();
        $('#vulnerabilties__table__checkboxes').empty();

        vulnerabilities.forEach((v, i)=>{
            addVulnerability(v);
            if(i===0) addSelectedVulnerabilityRowData(v.vulnerabilityId);
        });
    };

    window.project.load(async (event, data) => {
    const fetchedData = await JSON.parse(data);
    vulnerabilitiesData = fetchedData.Vulnerability;
    updateVulnerabilityFields(vulnerabilitiesData);
    });

    const deleteVulnerabilities = async (checkboxes) =>{
        const checkedVulnerabilities = [];
        checkboxes.forEach((box) => {
          if (box.checked) checkedVulnerabilities.push(Number(box.value));
        });
  
        await window.vulnerabillities.deleteVulnerability(checkedVulnerabilities);
        checkedVulnerabilities.forEach((id) => {
            const index = vulnerabilitiesData.findIndex(object => {
                return object.vulnerabilityId === id;
            });
            $(`#vulnerabilties__table__checkboxes__${id}`).remove();
            vulnerabilitiesTable.getRow(Number(id)).delete();
  
            vulnerabilitiesData.splice(index, 1);
            vulnerabilitiesData.forEach((v)=>{
                vulnerabilitiesTable.deselectRow(v.vulnerabilityId);
            });
            addSelectedVulnerabilityRowData(vulnerabilitiesData[0].vulnerabilityId);
        });
    };

    // add Vulnerability button
    $('#vulnerabilities button').first().on('click', async () => {
        const vulnerability = await window.vulnerabilities.addVulnerability();
        // update vulnerabilitiesData
        vulnerabilitiesData.push(vulnerability[0]);
        addVulnerability(vulnerability[0]);
        
        vulnerabilitiesData.forEach((v)=>{
            vulnerabilitiesTable.deselectRow(v.vulnerabilityId);
        });
        addSelectedVulnerabilityRowData(vulnerability[0].vulnerabilityId);
    });

    // delete Vulnerability button
    $('#vulnerabilities button:nth-of-type(2)').on('click', async () => {
        const checkboxes = document.getElementsByName('vulnerabilties__table__checkboxes');
        deleteVulnerabilities(checkboxes);
    });

    const vulnerabilityURL = (value) => {
        getCurrentVulnerability().vulnerabilityTrackingURI = value;
        const hyperlink = $('#vulnerability__url--hyperlink');
        const insert = $('#vulnerability__url--insert');
  
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

    $('#vulnerability__url--hyperlink').on('click', (e) => {
        e.preventDefault();
        window.vulnerabilities.openURL($('#vulnerability__url--hyperlink').attr('href'), navigator.onLine);
      });

    $('#vulnerability__url--insert').on('click', async () => {
        const url = await window.vulnerabilities.urlPrompt(getCurrentVulnerabilityId());
        vulnerabilityURL(url);
    });

    $('#vulnerability__url--img').on('click', async () => {
        const url = await window.vulnerabilities.urlPrompt(getCurrentVulnerabilityId());
        vulnerabilityURL(url);
    });

    $('#vulnerability__attachment').on('click', () => {
        window.vulnerabilities.attachment(getCurrentVulnerabilityId());
        window.vulnerabilities.fileName(async (event, result) => {
            const { fileName, base64 } = result;
            $('#vulnerability__file--insert').text(fileName);
            getCurrentVulnerability().vulnerabilityDescriptionAttachment = base64;
            console.log(vulnerabilitiesData)
        });
    });

    } catch (err) {
      alert('Failed to load vulnerabilities tab');
    }
})();