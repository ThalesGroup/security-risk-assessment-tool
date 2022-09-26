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
    let vulnerabilitiesData, supportingAssetsData;
    const vulnerabilitiesTable = new Tabulator('#vulnerabilties__table', result[1]);

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
            cveScore,
            overallLevel,
            supportingAssetRef
        } = vulnerabilitiesData.find((v) => v.vulnerabilityId === id);

        $('#vulnerabilityId').text(vulnerabilityId);
        $('#vulnerability__name').val(vulnerabilityName);
        $('#vulnerability__trackingID').val(vulnerabilityTrackingID);
        vulnerabilityURL(vulnerabilityTrackingURI);
        $('#vulnerability__CVE').val(vulnerabilityCVE);
        $('select[id="vulnerability__family"]').val(!vulnerabilityFamily ? 'null' : vulnerabilityFamily);
        tinymce.get('vulnerability__details').setContent(vulnerabilityDescription);
        $('#vulnerability__scoring').val(cveScore);
        $('#vulnerability__level').text(overallLevel);

        $('input[name="refs__checkboxes"]').prop('checked', false);
        supportingAssetRef.forEach((ref)=>{
            $(`input[id="refs__checkboxes__${ref}"]`).prop('checked', true);
        });

        const { fileName, vulnerabilities } = await window.vulnerabilities.decodeAttachment(vulnerabilityId ,vulnerabilityDescriptionAttachment);
        $('#vulnerability__file--insert').text(fileName);
        vulnerabilitiesData = vulnerabilities;
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

    const updateSupportingAssets = (supportingAssets) =>{
        $('.refs').empty();

        supportingAssets.forEach((sa)=>{
            // add div
            const div = document.createElement('div');

            // add checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = `${sa.supportingAssetId}`;
            checkbox.id = `refs__checkboxes__${sa.supportingAssetId}`;
            checkbox.name = 'refs__checkboxes';
            checkbox.addEventListener('change', (e) =>{
                if (e.target.checked) window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'addSupportingAssetRef', e.target.value);
                else window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'deleteSupportingAssetRef', e.target.value);
            })
            div.append(checkbox);

            // add label
            const label = document.createElement('label');
            label.innerHTML = sa.supportingAssetName;
            div.append(label);

            $('.refs').append(div);
        });
    }

    const loadVulnerabilities = async (data) =>{
        const fetchedData = await JSON.parse(data);
        vulnerabilitiesData = fetchedData.Vulnerability;
        supportingAssetsData = fetchedData.SupportingAsset;
        updateSupportingAssets(supportingAssetsData);
        updateVulnerabilityFields(vulnerabilitiesData);
    };

    $(document).ready(async function () {
        window.project.load(async (event, data) => {
            await tinymce.init({
                selector: '.rich-text',
                height: 300,
                min_height: 300,
                verify_html: true,
                statusbar: false,
                plugins: 'link lists',
                toolbar: 'undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link | numlist bullist',
            });
            loadVulnerabilities(data);
        });
    });

    const deleteVulnerabilities = async (checkboxes) =>{
        const checkedVulnerabilities = [];
        checkboxes.forEach((box) => {
          if (box.checked) checkedVulnerabilities.push(Number(box.value));
        });
  
        await window.vulnerabilities.deleteVulnerability(checkedVulnerabilities);
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
            const { fileName } = result;
            $('#vulnerability__file--insert').text(fileName);
        });
    });

    $('input[name="vulnerability__name"]').on('change', async (e)=> {
        await window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'vulnerabilityName', e.target.value);
    });

    $('input[name="vulnerability__scoring"]').on('change', async  (e)=>{
        await window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'cveScore', e.target.value);
    });

    } catch (err) {
      alert('Failed to load vulnerabilities tab');
    }
})();