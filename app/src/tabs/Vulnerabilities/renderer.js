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
    $('#vulnerabilities').append(result[0]);
    result[1].columns[0].formatter = (cell) => {
        const vulnerabililityId = cell.getRow().getIndex();
        if (vulnerabililityId) {
            return `
        <input type="checkbox" name="vulnerabilties__table__checkboxes" value="${vulnerabililityId}" id="vulnerabilties__table__checkboxes__${vulnerabililityId}"/>
    `;
        }
    };
    const vulnerabilitiesTable = new Tabulator('#vulnerabilties__table', result[1]);

    // filter
    $('input[id="filter-value"]').on('change', (e)=> {
        const { value } = e.target;
        const filterOptions = [
            [
                { field: "vulnerabilityId", type: "like", value: value },
                { field: "projectVersionRef", type: "like", value: value },
                { field: "vulnerabilityName", type: "like", value: value },
                { field: "overallLevel", type: "like", value: value },
            ]
        ];
        vulnerabilitiesTable.setFilter(filterOptions);
        const filteredRows = vulnerabilitiesTable.searchData(filterOptions);
        if (filteredRows[0]) {
            vulnerabilitiesData.forEach((v) => {
                vulnerabilitiesTable.deselectRow(v.vulnerabilityId);
            });
            vulnerabilitiesTable.selectRow(filteredRows[0].vulnerabilityId);
            addSelectedVulnerabilityRowData(filteredRows[0].vulnerabilityId);
        } else $('#vulnerabilities section').hide();
    });

    $('button[id="filter-clear"]').on('click', () => { 
        vulnerabilitiesTable.clearFilter();
        $('input[id="filter-value"]').val('');
        if (vulnerabilitiesData.length > 0) $('#vulnerabilities section').show();
    });

    const getCurrentVulnerabilityId = () => {
        return vulnerabilitiesTable.getSelectedData()[0].vulnerabilityId;
    };

    const getCurrentVulnerability = () => {
        return vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
    };

    const styleTable = (id, overallLevel) => {
        if (overallLevel === 'High') vulnerabilitiesTable.getRow(id).getCell('overallLevel').getElement().style.color = '#FF0000';
        else if (overallLevel === 'Medium') vulnerabilitiesTable.getRow(id).getCell('overallLevel').getElement().style.color = '#FFA500';
        else vulnerabilitiesTable.getRow(id).getCell('overallLevel').getElement().style.color = '#000000';
    };

    const validateCVEScore = (cveScore) => {
        if (cveScore < 0 || cveScore > 10) $('input[name="vulnerability__scoring"]').css('border', '1px solid red');
        else $('input[name="vulnerability__scoring"]').css('border', 'none');
    }

    const validateVulnerabilityName = (vulnerability) => {
        const { supportingAssetRef, vulnerabilityDescription, vulnerabilityName, vulnerabilityId } = vulnerability;
        if (supportingAssetsData.length === 0 
            || supportingAssetRef.length === 0
            || vulnerabilityDescription === '' 
            || vulnerabilityName === '') vulnerabilitiesTable.getRow(vulnerabilityId).getCell('vulnerabilityName').getElement().style.color = '#FF0000';
        else vulnerabilitiesTable.getRow(vulnerabilityId).getCell('vulnerabilityName').getElement().style.color = '#000000';
    };

    const updateVulnerabilityFields = (vulnerabilities) => {
        vulnerabilitiesTable.clearData();
        $('#vulnerabilties__table__checkboxes').empty();

        vulnerabilities.forEach((v, i) => {
            addVulnerability(v);
            if (i === 0) {
                vulnerabilitiesTable.selectRow(v.vulnerabilityId);
                addSelectedVulnerabilityRowData(v.vulnerabilityId);
            }
        });
    };
    

    const addSelectedVulnerabilityRowData = async (id) =>{
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
        $('select[id="vulnerability__family"]').val(!vulnerabilityFamily ? '' : vulnerabilityFamily);
        tinymce.get('vulnerability__details').setContent(vulnerabilityDescription);
        $('#vulnerability__scoring').val(cveScore);

        $('#vulnerability__level').removeClass();
        $('#vulnerability__level').text(overallLevel).addClass(overallLevel);
        styleTable(vulnerabilityId, overallLevel);
        validateCVEScore(cveScore);

        $('input[name="refs__checkboxes"]').prop('checked', false);
        supportingAssetRef.forEach((ref)=>{
            $(`input[id="refs__checkboxes__${ref}"]`).prop('checked', true);
        });

        const fileName = await window.vulnerabilities.decodeAttachment(vulnerabilityId ,vulnerabilityDescriptionAttachment);
        $('#vulnerability__file--insert').text(fileName);
    };

    const validatePreviousVulnerability = async (id) => {
        let vulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === id);
        const isVulnerabilityExist = await window.vulnerabilities.isVulnerabilityExist(vulnerability.vulnerabilityId);

        if(isVulnerabilityExist){
            const vulnerabilities = await window.validate.vulnerabilities(vulnerability);
            vulnerabilitiesData = vulnerabilities;
        }  
    };

    vulnerabilitiesTable.on("rowDeselected", (row) => {
        validatePreviousVulnerability(row.getIndex());
    });

    // row is clicked & selected
    vulnerabilitiesTable.on('rowClick', (e, row) => {
        vulnerabilitiesTable.selectRow(row.getIndex());
        addSelectedVulnerabilityRowData(row.getIndex());
    });

    const addVulnerability = (vulnerability) =>{
        // filter
        vulnerabilitiesTable.clearFilter();
        $('input[id="filter-value"]').val('');
        if (vulnerabilitiesData.length > 0) $('#vulnerabilities section').show();

        // add vulnerability data
        vulnerabilitiesTable.addData([vulnerability]);
        styleTable(vulnerability.vulnerabilityId, vulnerability.overallLevel);
        validateVulnerabilityName(vulnerability);
        // add checkbox
        // const checkbox = document.createElement('input');
        // checkbox.type = 'checkbox';
        // checkbox.value = `${vulnerability.vulnerabilityId}`;
        // checkbox.id = `vulnerabilties__table__checkboxes__${vulnerability.vulnerabilityId}`;
        // checkbox.name = 'vulnerabilties__table__checkboxes';
        // $('#vulnerabilties__table__checkboxes').append(checkbox);

        if (vulnerabilitiesData.length === 1) {
            vulnerabilitiesTable.selectRow(vulnerability.vulnerabilityId);
            addSelectedVulnerabilityRowData(vulnerability.vulnerabilityId);
        }
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
            checkbox.addEventListener('change', async (e) =>{
                let vulnerability;
                if (e.target.checked) vulnerability = await window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'addSupportingAssetRef', e.target.value);
                else vulnerability = await window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'deleteSupportingAssetRef', e.target.value);
                validateVulnerabilityName(vulnerability);
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
        if (vulnerabilitiesData.length === 0) $('#vulnerabilities section').hide();
        else $('#vulnerabilities section').show();
        updateSupportingAssets(fetchedData.SupportingAsset);
        updateVulnerabilityFields(vulnerabilitiesData);
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
                plugins: 'link lists',
                toolbar: 'undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link | numlist bullist',
                setup: function (ed) {
                    ed.on('change', function (e) {
                        //console.log(e.target.id)
                        let vulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
                        vulnerability.vulnerabilityDescription = tinymce.activeEditor.getContent();
                        validateVulnerabilityName(vulnerability);
                    });
                }
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
            // $(`#vulnerabilties__table__checkboxes__${id}`).remove();
  
            vulnerabilitiesTable.getRow(Number(id)).delete();
            vulnerabilitiesData.splice(index, 1);
        });
        
        if (vulnerabilitiesData.length === 0) $('#vulnerabilities section').hide();
        else {
            vulnerabilitiesData.forEach((v) => {
                vulnerabilitiesTable.deselectRow(v.vulnerabilityId);
            });
            vulnerabilitiesTable.selectRow(vulnerabilitiesData[0].vulnerabilityId);
            addSelectedVulnerabilityRowData(vulnerabilitiesData[0].vulnerabilityId);
        }
    };

    // add Vulnerability button
    $('#vulnerabilities .add-delete-container button').first().on('click', async () => {
        const vulnerability = await window.vulnerabilities.addVulnerability();
        // update vulnerabilitiesData
        $('#vulnerabilities section').show();
        vulnerabilitiesData.push(vulnerability[0]);
        addVulnerability(vulnerability[0]);
        if (vulnerabilitiesData.length === 0) vulnerabilitiesTable.selectRow(vulnerabilitiesData[0].vulnerabilityId);
        
        // vulnerabilitiesData.forEach((v)=>{
        //     vulnerabilitiesTable.deselectRow(v.vulnerabilityId);
        // });

        // addSelectedVulnerabilityRowData(vulnerability[0].vulnerabilityId);
    });

    // delete Vulnerability button
    $('#vulnerabilities .add-delete-container button:nth-of-type(2)').on('click', async () => {
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
            const fileName = result;
            $('#vulnerability__file--insert').text(fileName);
        });
    });

    $('input[name="vulnerability__name"]').on('change', async (e)=> {
        const vulnerability = await window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'vulnerabilityName', e.target.value);
        vulnerabilitiesTable.updateData([{ vulnerabilityId: getCurrentVulnerabilityId(), vulnerabilityName: e.target.value }]);
        validateVulnerabilityName(vulnerability);
    });

    $('input[name="vulnerability__scoring"]').on('change', async (e)=>{
        const vulnerability = await window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'cveScore', e.target.value);
        const { overallLevel } = vulnerability;
        vulnerabilitiesTable.updateData([{ vulnerabilityId: getCurrentVulnerabilityId(), overallLevel: overallLevel }]);
        $('#vulnerability__level').removeClass();
        $('#vulnerability__level').text(overallLevel).addClass(overallLevel);
        styleTable(getCurrentVulnerabilityId(), overallLevel);
        validateCVEScore(e.target.value);
    });

    $('input[name="vulnerability__trackingID"]').on('change', (e)=> {
        let vulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
        vulnerability.vulnerabilityTrackingID = e.target.value;
    });

    $('input[name="vulnerability__CVE"]').on('change', (e) => {
        let vulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
        vulnerability.vulnerabilityCVE = e.target.value;
    });

    $('select[name="vulnerability__family"]').on('change', (e) => {
        let vulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
        vulnerability.vulnerabilityFamily = e.target.value;
    });

    } catch (err) {
      alert('Failed to load vulnerabilities tab');
    }
})();