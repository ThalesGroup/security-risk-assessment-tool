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
    function handleReload(event) {
        if (event.ctrlKey && event.key === 'r') {
          event.preventDefault();
        }
      }
    
      disableAllTabs()
    window.addEventListener('keydown', handleReload);
    const result = await window.render.vulnerabilities();
    let vulnerabilitiesData, supportingAssetsData;
    $('#vulnerabilities').append(result[0]);
    const tableOptions = result[1];
    const checkBoxIndex = 0
    const vulNameIndex = 3
    const overallLevelIndex = 4

    tableOptions.columns[checkBoxIndex].formatter = (cell) => {
        const vulnerabililityId = cell.getRow().getIndex();
        if (vulnerabililityId) {
            return `
        <input type="checkbox" name="vulnerabilties__table__checkboxes" value="${vulnerabililityId}" id="vulnerabilties__table__checkboxes__${vulnerabililityId}"/>
    `;
        }
    };

    tableOptions.columns[vulNameIndex].formatter = (cell) => {
        const rowData = cell.getRow().getData();
        const supportingAssetRef = rowData.supportingAssetRef
        const vulnerabilityDescription = rowData.vulnerabilityDescription
        const vulnerabilityName = rowData.vulnerabilityName
        if (supportingAssetsData.length === 0 || supportingAssetRef.length === 0 || vulnerabilityDescription === '' || vulnerabilityName === '')  {
                cell.getElement().style.color = '#FF0000';
            }
        else  {
            cell.getElement().style.color = '#000000';
        }
        return cell.getValue()
    }

    tableOptions.columns[overallLevelIndex].formatter = (cell) => {
        const overallLevel = cell.getValue()
        if (overallLevel === 'High') cell.getElement().style.color = '#FF0000';
        else if (overallLevel === 'Medium') cell.getElement().style.color = '#FFA500';
        else cell.getElement().style.color = '#000000';
        return overallLevel;
    }

    const vulnerabilitiesTable = new Tabulator('#vulnerabilties__table', result[1]);
    

    // filter
    const clearFunction = () => {
        vulnerabilitiesTable.clearFilter();
        $('input[id="filter-value"]').val('');
        if (vulnerabilitiesData.length > 0) $('#vulnerabilities section').show();
    };

    $('input[id="filter-value"]').on('change', (e)=> {
        const { value } = e.target;
        if(value === ''){
            clearFunction();
        }else {
            const filterOptions = [
                [
                    { field: "vulnerabilityId", type: "like", value: value },
                    { field: "projectVersion", type: "like", value: value },
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
        }
    });

    $('button[id="filter-clear"]').on('click', () => { 
        clearFunction();
    });

    const getCurrentVulnerabilityId = () => {
        return vulnerabilitiesTable.getSelectedData()[0].vulnerabilityId;
    };

    const getCurrentVulnerability = () => {
        return vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
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
        vulnerabilitiesTable.addData(vulnerabilities);
        vulnerabilitiesTable.selectRow(vulnerabilities[0].vulnerabilityId);
        addSelectedVulnerabilityRowData(vulnerabilities[0].vulnerabilityId);

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
        if (!Number.isInteger(cveScore) && cveScore.toString().split('.')[1].length > 9) {
            $('#vulnerability__scoring').val(Number.parseFloat(cveScore).toFixed(9));
        } else $('#vulnerability__scoring').val(cveScore);
        $('#vulnerability__scoring__round').text(Math.round(cveScore));

        $('#vulnerability__level').removeClass();
        $('#vulnerability__level').text(overallLevel).addClass(overallLevel);
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
        };  
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
        if (vulnerabilitiesData.length === 1) {
            vulnerabilitiesTable.selectRow(vulnerability.vulnerabilityId);
            addSelectedVulnerabilityRowData(vulnerability.vulnerabilityId);
        }
        // add checkbox
        // const checkbox = document.createElement('input');
        // checkbox.type = 'checkbox';
        // checkbox.value = `${vulnerability.vulnerabilityId}`;
        // checkbox.id = `vulnerabilties__table__checkboxes__${vulnerability.vulnerabilityId}`;
        // checkbox.name = 'vulnerabilties__table__checkboxes';
        // $('#vulnerabilties__table__checkboxes').append(checkbox);

        /* if (vulnerabilitiesData.length === 1) {
            vulnerabilitiesTable.selectRow(vulnerability.vulnerabilityId);
            
            addSelectedVulnerabilityRowData(vulnerability.vulnerabilityId);
            
                
                
        } */
    };

    const updateSupportingAssets = (supportingAssets) =>{
        $('.refs').empty();

        supportingAssets.filter(unfilteredSA => unfilteredSA.supportingAssetName).forEach((sa)=>{
            // add div
            const div = document.createElement('div');

            // add checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = `${sa.supportingAssetId}`;
            checkbox.id = `refs__checkboxes__${sa.supportingAssetId}`;
            checkbox.name = 'refs__checkboxes';
            checkbox.addEventListener('change', async (e) =>{
                let vulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
                if (e.target.checked) {
                    const v = await window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'addSupportingAssetRef', e.target.value);
                    vulnerability.supportingAssetRef = v.supportingAssetRef;
                }
                else {
                    const v = await window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'deleteSupportingAssetRef', e.target.value);
                    vulnerability.supportingAssetRef = v.supportingAssetRef;
                }
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

    const loadVulnerabilities = (data) =>{
        
        vulnerabilitiesData = data.Vulnerability;
        supportingAssetsData = data.SupportingAsset;
        if (vulnerabilitiesData.length === 0) $('#vulnerabilities section').hide();
        else $('#vulnerabilities section').show();
        
        updateSupportingAssets(data.SupportingAsset);
        

        updateVulnerabilityFields(vulnerabilitiesData);

    };

    $(document).ready(async function () {
        window.project.load(async (event, data) => {
        const fetchedData = await JSON.parse(data);
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
                        //console.log(e.target.id)
                        let vulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
                        vulnerability.vulnerabilityDescription = tinymce.activeEditor.getContent();
                        validateVulnerabilityName(vulnerability);
                        validatePreviousVulnerability(getCurrentVulnerabilityId());
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

            loadVulnerabilities(fetchedData);
            enableAllTabs()
            window.removeEventListener('keydown', handleReload);
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
          hyperlink.attr('href', value);
          hyperlink.hide();
        }
    };

    $('#vulnerability__url--hyperlink').on('click', (e) => {
        e.preventDefault();
        window.vulnerabilities.openURL($('#vulnerability__url--hyperlink').attr('href'), navigator.onLine);
      });

    $('#vulnerability__url--insert').on('click', async () => {
        const url = await window.vulnerabilities.urlPrompt(getCurrentVulnerabilityId(), $('#vulnerability__url--hyperlink').attr('href'));
        vulnerabilityURL(url);
    });

    $('#vulnerability__url--img').on('click', async () => {
        const url = await window.vulnerabilities.urlPrompt(getCurrentVulnerabilityId(), $('#vulnerability__url--hyperlink').attr('href'));
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
        let updatedVulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
        updatedVulnerability.vulnerabilityName = vulnerability.vulnerabilityName;
        validateVulnerabilityName(updatedVulnerability);
    });

    $('input[name="vulnerability__scoring"]').on('change', async (e)=>{
        const { value } = e.target;
        let fixedValue = value;
        if (value.includes('.') && value.split('.')[1].length > 9) {
            fixedValue = Number.parseFloat(value).toFixed(9); 
        };
        const vulnerability = await window.vulnerabilities.updateVulnerability(getCurrentVulnerabilityId(), 'cveScore', fixedValue);
        const { overallLevel, cveScore } = vulnerability;
        vulnerabilitiesTable.updateData([{ vulnerabilityId: getCurrentVulnerabilityId(), overallLevel: overallLevel }]);
        $('#vulnerability__level').removeClass();
        $('#vulnerability__level').text(overallLevel).addClass(overallLevel);
        validateCVEScore(cveScore);
        $('#vulnerability__scoring').val(cveScore); 
        $('#vulnerability__scoring__round').text(Math.round(cveScore));
    });

    $('input[name="vulnerability__trackingID"]').on('change', (e)=> {
        let vulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
        vulnerability.vulnerabilityTrackingID = e.target.value;
        validatePreviousVulnerability(getCurrentVulnerabilityId());
    });

    $('input[name="vulnerability__CVE"]').on('change', (e) => {
        let vulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
        vulnerability.vulnerabilityCVE = e.target.value;
        validatePreviousVulnerability(getCurrentVulnerabilityId());
    });

    $('select[name="vulnerability__family"]').on('change', (e) => {
        let vulnerability = vulnerabilitiesData.find((v) => v.vulnerabilityId === getCurrentVulnerabilityId());
        vulnerability.vulnerabilityFamily = e.target.value;
        validatePreviousVulnerability(getCurrentVulnerabilityId());
    });

    } catch (err) {
        console.log(err)
        alert('Failed to load vulnerabilities tab');
    }
})();