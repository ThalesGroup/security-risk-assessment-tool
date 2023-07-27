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

function disableAllTabs() {
  document.querySelector('button.tab-button[data-id="welcome"]').disabled = true;
  document.querySelector('button.tab-button[data-id="project-context"]').disabled = true;
  document.querySelector('button.tab-button[data-id="business-assets"]').disabled = true;
  document.querySelector('button.tab-button[data-id="supporting-assets"]').disabled = true;
  document.querySelector('button.tab-button[data-id="risks"]').disabled = true;
  document.querySelector('button.tab-button[data-id="vulnerabilities"]').disabled = true;
  document.querySelector('button.tab-button[data-id="isra-report"]').disabled = true;
}

function enableAllTabs() {
  document.querySelector('button.tab-button[data-id="welcome"]').disabled = false;
  document.querySelector('button.tab-button[data-id="project-context"]').disabled = false;
  document.querySelector('button.tab-button[data-id="business-assets"]').disabled = false;
  document.querySelector('button.tab-button[data-id="supporting-assets"]').disabled = false;
  document.querySelector('button.tab-button[data-id="risks"]').disabled = false;
  document.querySelector('button.tab-button[data-id="vulnerabilities"]').disabled = false;
  document.querySelector('button.tab-button[data-id="isra-report"]').disabled = false;
}

(async () => {
  try {
    function handleReload(event) {
      if (event.ctrlKey && event.key === 'r') {
        event.preventDefault();
      }
    }
    disableAllTabs()
    window.addEventListener('keydown', handleReload);
    const result = await window.render.risks();
    $('#risks').append(result[0]);
    const tableOptions = result[1];
    const checkBoxIndex = 0
    const riskNameIndex = 3
    const riskLevelIndex = 4
    tableOptions.columns[checkBoxIndex].formatter = (cell) => {
      const riskId = cell.getRow().getIndex();
      if (riskId) {
        return `
            <input type="checkbox" name="risks__table__checkboxes" value="${riskId}" id="risks__table__checkboxes__${riskId}"/>
        `;
      }
    };

    tableOptions.columns[riskNameIndex].formatter = (cell) => {
      const riskManagementDecision = cell.getRow().getData().riskManagementDecision;
      const threatAgent = cell.getRow().getData().threatAgent;
      const threatVerb =cell.getRow().getData().threatVerb;
      const businessAssetRef = cell.getRow().getData().businessAssetRef;
      const supportingAssetRef = cell.getRow().getData().supportingAssetRef;
      const motivation = cell.getRow().getData().motivation;
      if (threatAgent === '' || threatVerb === '' || businessAssetRef === null || supportingAssetRef === null || motivation === ''){
        cell.getElement().style.color = '#FF0000';
      } else cell.getElement().style.color = '#000000';

      const currentColour = cell.getElement().style.color;
      if (riskManagementDecision === 'Discarded' && currentColour !== 'rgb(255, 0, 0)') cell.getElement().style['text-decoration'] = 'line-through';
      else cell.getElement().style['text-decoration'] = 'none';

      return cell.getValue();
    
    }
    
    tableOptions.columns[riskLevelIndex].formatter = (cell) => {
      const residualRiskLevel = cell.getValue()
      if (residualRiskLevel === 'Critical') cell.getElement().style.color = '#FF0000';
      else if (residualRiskLevel === 'High') cell.getElement().style.color = '#E73927';
      else if (residualRiskLevel === 'Medium') cell.getElement().style.color = '#FFA500';
      else cell.getElement().style.color = '#000000';
    
      
      return residualRiskLevel;
    
    }
    



    const risksTable = new Tabulator('#risks__table', result[1]);
    let risksData, businessAssets, supportingAssets, vulnerabilities;
    let assetsRelationship = {};

    // filter
    const clearFunction = () => {
      risksTable.clearFilter();
      $('input[id="filter-value"]').val('');
      if (risksData.length > 0) $('#risks section').show();
    };

    $('input[id="filter-value"]').on('change', (e) => {
      const { value } = e.target;
      if(value === ''){
        clearFunction();
      }else {
        const filterOptions = [
          [
            { field: "riskId", type: "like", value: value },
            { field: "projectVersion", type: "like", value: value },
            { field: "riskName", type: "like", value: value },
            { field: "residualRiskLevel", type: "like", value: value },
            { field: "riskManagementDecision", type: "like", value: value },
          ]
        ];
        risksTable.setFilter(filterOptions);
        const filteredRows = risksTable.searchData(filterOptions);
        if (filteredRows[0]) {
          risksData.forEach((r) => {
            risksTable.deselectRow(r.riskId);
          });
          risksTable.selectRow(filteredRows[0].riskId);
          addSelectedRowData(filteredRows[0].riskId);
        } else $('#risks section').hide();
      }
    });

    $('button[id="filter-clear"]').on('click', () => {
      clearFunction();
    });

    /**
     * 
     * 
     * Risk
     * 
     * 
  */
    const getCurrentRiskId = () =>{
      return risksTable.getSelectedData()[0].riskId;
    };

    const validateRiskName = (riskId, threatAgent, threatVerb, businessAssetRef, supportingAssetRef, motivation) => {
      if (threatAgent === '' || threatVerb === '' || businessAssetRef === null || supportingAssetRef === null || motivation === ''){
        risksTable.getRow(riskId).getCell('riskName').getElement().style.color = '#FF0000';
      } else risksTable.getRow(riskId).getCell('riskName').getElement().style.color = '#000000';
    };

    // add Supporting Assets Select options
    const addSupportingAssetOptions = (businessAssetRef) =>{
      let supportingAssetOptions = '';
      $('#risk__supportingAsset').empty();
      supportingAssets.filter(uncheckedSA => uncheckedSA.supportingAssetName).forEach((sa) =>{
        if(assetsRelationship[sa.supportingAssetId].some((baRef) => baRef === businessAssetRef)){
          supportingAssetOptions += `<option value="${sa.supportingAssetId}">${sa.supportingAssetName}</option>`;
        }
      });
      supportingAssetOptions += '<option value="null">Select...</option>'
      $('#risk__supportingAsset').append(supportingAssetOptions);
    };

    const setNaNValues = (riskAttackPathId) => {
      if(riskAttackPathId) {
        $(`#risk__attack__path__score__${riskAttackPathId}`).text('NaN').addClass('NaN');
        $('#all_attack_paths_score').text('NaN').addClass('NaN');
        $('#inherent_risk_score').text('NaN').addClass('NaN');
        $('#mitigated_risk_score').text('NaN').addClass('NaN');
        $('#residual_risk_score').text('NaN').addClass('NaN');
      }else {
        $(`#risk__attack__path__score__${riskAttackPathId}`).removeClass();
        $('#all_attack_paths_score').removeClass();
        $('#inherent_risk_score').removeClass();
        $('#mitigated_risk_score').removeClass();
        $('#residual_risk_score').removeClass();
      }
    }

    // add vulnerability ref
    const addVulnerabilityRef = (refs, div, vulnerabilityOptions, riskAttackPathId) => {
      let refLength = refs.length;
      refs.forEach((ref, rowId) => {
        refLength--;
        let vulnerabilityDiv = $('<div>');
        vulnerabilityDiv.css('display', 'flex');
        vulnerabilityDiv.css('padding', '0');
        vulnerabilityDiv.css('margin-bottom', '1%');
        vulnerabilityDiv.attr('id', `vulnerabilityrefs_${rowId}`);

        const checkboxRef = !ref.score ? null : '1';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${checkboxRef}`;
        checkbox.id =  `risks__vulnerability__checkboxes__${checkboxRef}`;
        checkbox.name = 'risks__vulnerability__checkboxes';
        checkbox.setAttribute('data-row-id', rowId);
        vulnerabilityDiv.append(checkbox);
        console.log(rowId)
        let select = $('<select>').append(vulnerabilityOptions);
        
        select.on('change', async (e)=> {
          const { value } = e.target;
          console.log(previousVulId)
          await validatePreviousRisk(getCurrentRiskId());
          if (value) {
            let risk = await window.risks.deleteRiskVulnerabilityRef(getCurrentRiskId(), riskAttackPathId, [previousVulId]);
            risk = await window.risks.addRiskVulnerabilityRef(getCurrentRiskId(), riskAttackPathId, value);
            reloadCurrentRisk(risk);
          } else {

            const risk = await window.risks.deleteRiskVulnerabilityRef(getCurrentRiskId(), riskAttackPathId, [previousVulId]);
            reloadCurrentRisk(risk);
          }
          
          // if (id) setNaNValues(id);
          // else setNaNValues();
        });
        vulnerabilityDiv.append(select);
        let visibility = 'visible';
        if (refLength === 0) visibility = 'hidden';
        vulnerabilityDiv.append(`<span style="margin-left: 2%; margin-right: 2%; visibility: ${visibility}" class="and">AND<span>`);
        div.append(vulnerabilityDiv);
        const selectedOption = select.find('option').filter(function() {
          return $(this).text() === ref.name
        })
        select.val(selectedOption.val());
        const previousVulId = selectedOption.val();
      });
    };

    // add Vulnerabilities evaluation section
    const addVulnerabilitySection = (riskAttackPaths) =>{
      let vulnerabilityOptions = '<option value="">Select...</option>';
      vulnerabilities.filter(uncheckedV => uncheckedV.vulnerabilityName).forEach((v)=>{
        vulnerabilityOptions += `<option value="${v.vulnerabilityId}">${v.vulnerabilityName}</option>`;
      });

      riskAttackPaths.forEach((path, i) =>{
        const {riskAttackPathId, vulnerabilityRef, attackPathScore} = path;
        if (i > 0 || riskAttackPathId > 1) $('#risks__vulnerability__attack__path').append('<p style="margin-left: 18px">OR</p>');
        
        const mainDiv = $('<div>');
        mainDiv.css('padding', '0');
        mainDiv.attr('class', 'attackpathsections')
        mainDiv.attr('id', `attackpath_${riskAttackPathId}`);

        // add checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${riskAttackPathId}`;
        checkbox.id = `risks__attack__path__checkboxes__${riskAttackPathId}`;
        checkbox.name = 'risks__attack__path__checkboxes';
        mainDiv.append(checkbox);

        // add div
        let div = $("<div>").append(`
          <div style="width:100%; display: grid; grid-template-columns: auto auto;">
            <div style="display:inline-block; padding:2%; border: 1px solid black;">
              <span>Attack Path ${riskAttackPathId}</span>
            </div>
            <div style="text-align:right; display:inline-block; padding:2%; border: 1px solid black;">
              <span>scoring: <span id="risk__attack__path__score__${riskAttackPathId}">${attackPathScore == null ? '' : attackPathScore}<span><span>
            </div>
          </div>
        `).css('background-color', 'rgb(248,220,212)');
        div.css('width', '100%');
        div.css('margin-left', '3%');
        div.css('border', '1px solid black');
        div.attr('id', `risk_attack_path_${riskAttackPathId}`);
        div.attr('class', `risk_attack_paths`);
        const addDeleteDiv = $('<div>');
        addDeleteDiv.addClass('add-delete-container');
        addDeleteDiv.css('margin-top', '2%');
        const addButton = document.createElement('button');
        addButton.className = 'addDelete';
        addButton.innerText = 'Add';
        const deleteButton = document.createElement('button');
        deleteButton.className = 'addDelete';
        deleteButton.innerText = 'Delete';

        // add vulnerabilityRef
        addButton.addEventListener('click', async ()=>{
          const refLength = document.getElementsByName('risks__vulnerability__checkboxes').length;
          
          let vulnerabilityDiv = $('<div>');
          vulnerabilityDiv.css('display', 'flex');
          vulnerabilityDiv.css('padding', '0');
          vulnerabilityDiv.css('margin-bottom', '1%');
          vulnerabilityDiv.attr('id', `vulnerabilityrefs_${refLength}`);
  
          const checkboxRef = null;
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = `${checkboxRef}`;
          checkbox.id =  `risks__vulnerability__checkboxes__${checkboxRef}`;
          checkbox.name = 'risks__vulnerability__checkboxes';
          checkbox.setAttribute('data-row-id', refLength);
          vulnerabilityDiv.append(checkbox);
          let select = $('<select>').append(vulnerabilityOptions);
          select.on('change', async (e)=> {
            const { value } = e.target;
            console.log(value)
            await validatePreviousRisk(getCurrentRiskId());
          
            const risk = await window.risks.addRiskVulnerabilityRef(getCurrentRiskId(), riskAttackPathId, value);
            //reloadCurrentRisk(risk);
            
            

          });
          vulnerabilityDiv.append(select);
          let visibility = 'visible';
          if (refLength + 1 === 0) visibility = 'hidden';
          vulnerabilityDiv.append(`<span style="margin-left: 2%; margin-right: 2%; visibility: ${visibility}" class="and">AND<span>`);
          div.append(vulnerabilityDiv);

          
          
        });

        // delete vulnerabilityRef
        deleteButton.addEventListener('click', async ()=>{
          const checkboxes = document.getElementsByName('risks__vulnerability__checkboxes');
          const ids = [];

          checkboxes.forEach((box) => {
            if (box.checked) {
              const vulRef = document.getElementById(`vulnerabilityrefs_${Number(box.getAttribute('data-row-id'))}`)
              const vulId = vulRef.querySelector('select').value
              ids.push(Number(vulId))
              //console.log(document.getElementById(`vulnerabilityrefs_${Number(box.getAttribute('data-row-id'))}`))
              //ids.push(Number(box.getAttribute('data-row-id')));
              // window.risks.deleteRiskVulnerabilityRef(getCurrentRiskId(), riskAttackPathId, Number(box.getAttribute('data-row-id'))); 
            }
          });

          await validatePreviousRisk(getCurrentRiskId());
          const risk = await window.risks.deleteRiskVulnerabilityRef(getCurrentRiskId(), riskAttackPathId, ids);
          reloadCurrentRisk(risk);
        });

        addDeleteDiv.append(addButton);
        addDeleteDiv.append(' | ');
        addDeleteDiv.append(deleteButton);
        div.append(addDeleteDiv);
        mainDiv.append(div);
        $('#risks__vulnerability__attack__path').append(mainDiv);

        addVulnerabilityRef(vulnerabilityRef, div, vulnerabilityOptions, riskAttackPathId);
      });
    };

    // update riskLikelihood occurrence-threatFactor table
    const updateOccurrenceThreatFactorTable = (threatFactorLevel, occurrenceLevel) =>{
      $('#risk__occurrence__threatFactor__table tbody:first-of-type tr:nth-of-type(n+2)  td:nth-of-type(n+2) span').css('visibility', 'hidden');
      $('.occurrence').css('font-weight', 'normal');
      $('.threatFactor').css('font-weight', 'normal');

      $(`td[data-factor="${threatFactorLevel}"]`).css('font-weight', 'bold');
      $(`td[data-occurrence="${occurrenceLevel}"]`).css('font-weight', 'bold');
      let col = $(`td[data-factor="${threatFactorLevel}"]`).attr('data-col');
      let row = $(`td[data-occurrence="${occurrenceLevel}"]`).attr('data-row');

      if (col && row) $(`#risk__occurrence__threatFactor__table tbody:first-of-type tr:nth-of-type(${parseInt(row) + 1})  td:nth-of-type(${parseInt(col) + 1}) span`).css('visibility', 'visible');
    };

    // update risk impact evaluation table
    const updateEvaluationTable = (riskImpact, businessAssetRef) => {
      const {
        businessAssetConfidentialityFlag,
        businessAssetIntegrityFlag,
        businessAssetAvailabilityFlag,
        businessAssetAuthenticityFlag,
        businessAssetAuthorizationFlag,
        businessAssetNonRepudiationFlag,
      } = riskImpact
      let businessAssetValues = new Array(6).fill('');

      businessAssets.forEach((ba) =>{
        if(!businessAssetRef || ba.businessAssetId === businessAssetRef) {
          const {businessAssetProperties} = ba;
            businessAssetValues = [
              businessAssetProperties.businessAssetConfidentiality,
              businessAssetProperties.businessAssetIntegrity,
              businessAssetProperties.businessAssetAvailability,
              businessAssetProperties.businessAssetAuthenticity,
              businessAssetProperties.businessAssetAuthorization,
              businessAssetProperties.businessAssetNonRepudiation
            ];

            $('#risk__confidentialty').prop( "checked", businessAssetConfidentialityFlag);
            $('#risk__integrity').prop( "checked", businessAssetIntegrityFlag);
            $('#risk__availability').prop( "checked", businessAssetAvailabilityFlag);
            $('#risk__authenticity').prop( "checked", businessAssetAuthenticityFlag);
            $('#risk__authorization').prop( "checked", businessAssetAuthorizationFlag);
            $('#risk__nonrepudiation').prop( "checked", businessAssetNonRepudiationFlag);
        };
      });

      if(businessAssetRef){
        const values = {
          0: 'Not Applicable',
          1: 'Low',
          2: 'Medium',
          3: 'High',
          4: 'Critical'
        };

        businessAssetValues.forEach((value, i) => {
          $(`#risk__evaluation__table tr:nth-of-type(${i+1}) td:nth-of-type(2)`).text('');
          $(`#risk__evaluation__table tr:nth-of-type(${i+1}) td:nth-of-type(2)`).append(values[value]);
      });
      } else {
        businessAssetValues.forEach((value, i) => {
          $(`#risk__evaluation__table tr:nth-of-type(${i+1}) td:nth-of-type(2)`).text('');
        });
      }
    };

    const setSecurityPropertyValues = (riskLikelihood) =>{
      const {
        skillLevel,
        reward,
        accessResources,
        size,
        intrusionDetection,
        occurrence
      } = riskLikelihood;

      $('select[id="risk__skillLevel"]').val(skillLevel == null? 'null' : skillLevel);
      $('select[id="risk__reward"]').val(reward == null? 'null' : reward);
      $('select[id="risk__accessResources"]').val(accessResources == null? 'null' : accessResources);
      $('select[id="risk__size"]').val(size == null? 'null' : size);
      $('select[id="risk__intrusionDetection"]').val(intrusionDetection == null? 'null' : intrusionDetection);
      $('select[id="risk__occurrence"]').val(occurrence == null? 'null' : occurrence);
      $('select[id="risk__likelihood"]').val(riskLikelihood.riskLikelihood == null? 'null' : riskLikelihood.riskLikelihood);
    };

    const addRichTextArea = (selector, desc, width, riskMitigationId) => {
      tinymce.init({
        selector,
        promotion: false,
        height: 250,
        min_height: 250,
        width,
        verify_html: true,
        statusbar: false,
        deep: true,
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
        setup: (editor) => {
          editor.on('init', () => {
            const content = desc;
            editor.setContent(content);
            
          });

          editor.on('change', function (e) {
            const { id } = e.target;
            let richText = tinymce.get(id).getContent();
            const risk = risksData.find((risk) => risk.riskId === getCurrentRiskId());
            const { riskMitigation } = risk;
            const mitigation = riskMitigation.find((mitigation) => mitigation.riskMitigationId === riskMitigationId);
         
            if (id === `security__control__desc__rich-text__${getCurrentRiskId()}__${riskMitigationId}`) mitigation.description = richText;
            else if (id === `comment__desc__rich-text__${getCurrentRiskId()}__${riskMitigationId}`) mitigation.decisionDetail = richText;
            validatePreviousRisk(getCurrentRiskId());
          });
        },
      });
    }

    // add Mitigation evaluation section
    const addMitigationSection = (riskMitigations, riskManagementDecision)=> {
      riskMitigations.forEach(async (mitigation)=> {
        const { description, benefits, cost, decision, decisionDetail, riskMitigationId } = mitigation;
        const mitigationSections = $('#risks__risk__mitigation__evaluation .mitigations');

        const mainSection = $('<section>');
        mainSection.css('padding', '0');

        // add checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${riskMitigationId}`;
        checkbox.id = `risks__mitigation__checkboxes__${riskMitigationId}`;
        checkbox.name = 'risks__mitigation__checkboxes';
        checkbox.style.position = 'absolute';
        mainSection.append(checkbox);

        const section = $('<section>');
        section.attr('id', `risks__mitigation__section__${riskMitigationId}`);
        section.css('background-color', 'rgb(200,212,204)');
        section.css('margin-left', '20px');
        section.css('margin-top', '2%');
        section.css('padding', '0');

        const topSection = $('<section>');
        topSection.attr('class', 'top');
        topSection.css('background-color', 'transparent');

        // security control desc
        const securityControlDescSection = $('<section>');
        securityControlDescSection.css('background-color', 'transparent');
        securityControlDescSection.css('margin', '0');
        securityControlDescSection.css('padding', '5px');
        const textArea1 = $('<textArea>');
        textArea1.attr('class', 'rich-text');
        textArea1.attr('id', `security__control__desc__rich-text__${getCurrentRiskId()}__${riskMitigationId}`);
        textArea1.attr('name', `security__control__desc__rich-text__${riskMitigationId}`);
        securityControlDescSection.append('<p style="font-size: small; font-weight: bold; font-style: italic; text-align: center;">Security control Description</p>');
        securityControlDescSection.append(textArea1);
        
        topSection.append(securityControlDescSection);
        section.append(topSection);
        mainSection.append(section);
        mitigationSections.append(mainSection);
        addRichTextArea(`#security__control__desc__rich-text__${getCurrentRiskId()}__${riskMitigationId}`, description, '100%', riskMitigationId);

        // expected benefits
        const benefitsSection = $('<section>');
        benefitsSection.css('background-color', 'transparent');
        benefitsSection.css('margin', '0');
        benefitsSection.css('padding', '5px');
        benefitsSection.append('<p style="font-size: small; font-weight: bold; font-style: italic; text-align: center;">Expected benefits</p>');
        // to get from schema
        const expectedBenefitsOptions = {};
        const options = await window.risks.expectedBenefitsOptions();
        options.forEach((option)=> {
          if(option.title) expectedBenefitsOptions[option.const] = option.title;
        });

        const div = $('<div>');
        for (const [key, value] of Object.entries(expectedBenefitsOptions)) {
          const input = $('<input>');
          input.attr('type', 'radio');
          input.attr('name', `benefits__risk__mitigation__${riskMitigationId}`);
          input.attr('id', value);
          input.attr('value', key);
          if (benefits == key) input.attr('checked', true);
          const label = $('<label>');
          label.attr('id', value);
          label.text(value);
          div.append(input);
          div.append(label);
          div.append('<br>');

          input.on('change', async (e)=> {
            const { value } = e.target;
            await validatePreviousRisk(getCurrentRiskId());
            const risk = await window.risks.updateRiskMitigation(getCurrentRiskId(), riskMitigationId, 'benefits', Number(value));
            updateScoresAndLevel(risk);
            // reloadCurrentRisk(risk);
          })
        }
        benefitsSection.append(div);
        topSection.append(benefitsSection);
       
        // cost
        const validateCost = (input, cost) => {
          if (!Number.isInteger(cost))  input.css('border', '1px solid red');
          else {
            input.css('border', 'none');
            validatePreviousRisk(getCurrentRiskId());
          } 
        }

        const costSection = $('<section>');
        costSection.css('background-color', 'transparent');
        costSection.css('margin', '0');
        costSection.css('padding', '5px');
        costSection.append('<p style="font-size: small; font-weight: bold; font-style: italic; text-align: center;">Estimated Cost (md)</p>');
        const input = $('<input>');
        input.attr('type', 'number');
        input.attr('title', 'Only integers allowed');
        input.attr('id', `risk__mitigation__cost__${riskMitigationId}`);
        input.attr('name', `risk__mitigation__cost__${riskMitigationId}`);
        input.attr('value', `${cost == null ? '' : cost}`);
        validateCost(input, Number(cost));
        input.on('change', (e) => {
          const { value } = e.target;
          const risk = risksData.find((risk) => risk.riskId === getCurrentRiskId());
          const { riskMitigation } = risk
          const rm = riskMitigation.find((mitigation) => mitigation.riskMitigationId === riskMitigationId);
          rm.cost = Number(value);
          validateCost(input, Number(value));
          
        });
        costSection.append(input);
        
        topSection.append(costSection);
        section.append(topSection);

        const bottomSection = $('<section>');
        bottomSection.attr('class', 'bottom');
        bottomSection.css('background-color', 'transparent');

        if (riskManagementDecision !== 'Mitigate') {
          bottomSection.css('display', 'none');
        }

        // mitigation decision
        const mitigationDecisionSection = $('<section>');
        mitigationDecisionSection.css('background-color', 'transparent');
        mitigationDecisionSection.css('margin', '0');
        mitigationDecisionSection.css('padding', '5px');
        mitigationDecisionSection.append('<p style="font-size: small; font-weight: bold; font-style: italic; text-align: center;">Mitigation Decision</p>');
        // to get from schema
        const mitigationDecisionOptions = {};
        const decisionOptions = await window.risks.mitigationDecisionOptions();
        decisionOptions.forEach((option) => {
          mitigationDecisionOptions[option.title] = option.const;
        });

        const div2 = $('<div>');
        for (const [key, value] of Object.entries(mitigationDecisionOptions)) {
          const input = $('<input>');
          input.attr('type', 'radio');
          input.attr('name', `risk__mitigation__decision__${riskMitigationId}`);
          input.attr('id', key);
          input.attr('value', value);
          if(decision === value) input.attr('checked', true);
          const label = $('<label>');
          label.attr('id', key);
          label.text(key);
          div2.append(input);
          div2.append(label);
          div2.append('<br>');

          input.on('change', async (e) => {
            const { value } = e.target;
            await validatePreviousRisk(getCurrentRiskId());
            const risk = await window.risks.updateRiskMitigation(getCurrentRiskId(), riskMitigationId, 'decision', value);
            updateScoresAndLevel(risk);
            // reloadCurrentRisk(risk);
          })
        }
        mitigationDecisionSection.append(div2);
        bottomSection.append(mitigationDecisionSection);

        // decision comment
        const decisionSection = $('<section>');
        decisionSection.css('background-color', 'transparent');
        decisionSection.css('margin', '0');
        decisionSection.css('padding', '5px');
        decisionSection.append('<p style="font-size: small; font-weight: bold; font-style: italic; text-align: center;">Decision Comment</p>');

        const textArea2 = $('<textArea>');
        textArea2.attr('class', 'rich-text');
        textArea2.attr('id', `comment__desc__rich-text__${getCurrentRiskId()}__${riskMitigationId}`);
        textArea2.attr('name', `comment__desc__rich-text__${riskMitigationId}`);
        decisionSection.append(textArea2);

        bottomSection.append(decisionSection);
        section.append(bottomSection);
        mainSection.append(section);
        mitigationSections.append(mainSection);
        addRichTextArea(`#comment__desc__rich-text__${getCurrentRiskId()}__${riskMitigationId}`, decisionDetail, '100%', riskMitigationId);
      });
    };

    const styleResidualRiskLevelTable = (id, residualRiskLevel) => {
      if (residualRiskLevel === 'Critical') risksTable.getRow(id).getCell('residualRiskLevel').getElement().style.color = '#FF0000';
      else if (residualRiskLevel === 'High') risksTable.getRow(id).getCell('residualRiskLevel').getElement().style.color = '#E73927';
      else if (residualRiskLevel === 'Medium') risksTable.getRow(id).getCell('residualRiskLevel').getElement().style.color = '#FFA500';
      else risksTable.getRow(id).getCell('residualRiskLevel').getElement().style.color = '#000000';
    };

    const styleResidualRiskLevel = (residualRiskLevel) => {
      if (residualRiskLevel === 'Critical') $('#residual_risk_level').css('color', '#FF0000');
      else if (residualRiskLevel === 'High') $('#residual_risk_level').css('color', '#E73927');
      else if (residualRiskLevel === 'Medium') $('#residual_risk_level').css('color', '#FFA500');
      else $('#residual_risk_level').css('color', '#000000');
    }

    const styleRiskName = (value, id) => {
      const currentColour = risksTable.getRow(id).getCell('riskName').getElement().style.color;
      if (value === 'Discarded' && currentColour !== 'rgb(255, 0, 0)') risksTable.getRow(id).getCell('riskName').getElement().style['text-decoration'] = 'line-through';
      else risksTable.getRow(id).getCell('riskName').getElement().style['text-decoration'] = 'none';
    };

    // render selected row data on page by riskId
    const addSelectedRowData = (id) =>{
      const {
        riskId,
        riskName,
        threatAgent,
        threatAgentDetail, 
        threatVerb,
        threatVerbDetail,
        motivation, 
        motivationDetail,
        businessAssetRef,
        supportingAssetRef,
        isAutomaticRiskName,
        allAttackPathsScore,
        inherentRiskScore,
        riskAttackPaths,
        riskLikelihood,
        riskImpact,
        riskMitigation,
        mitigatedRiskScore,
        riskManagementDecision,
        riskManagementDetail,
        residualRiskScore,
        residualRiskLevel
      } = risksData.find((risk) => risk.riskId === id);

      const {
        riskLikelihoodDetail,
        threatFactorLevel,
        occurrenceLevel,
        isOWASPLikelihood
      } = riskLikelihood;

      console.log(risksData)
      // Set Risk description data
      $('.riskId').text(riskId);
      tinymce.get('risk__threatAgent__rich-text').setContent(threatAgentDetail);
      tinymce.get('risk__threat__rich-text').setContent(threatVerbDetail);
      tinymce.get('risk__motivation__rich-text').setContent(motivationDetail);
      $('select[id="risk__threatAgent"]').val(threatAgent);
      $('select[id="risk__threat"]').val(threatVerb);
      $('#risk__motivation').val(motivation);
      $('select[id="risk__businessAsset"]').val(businessAssetRef === null ? 'null' : businessAssetRef);
      addSupportingAssetOptions(businessAssetRef);
      $('select[id="risk__supportingAsset"]').val(supportingAssetRef === null ? 'null' : supportingAssetRef);

      if(isAutomaticRiskName){
        $('#risk__manual__riskName').hide();
        $('#riskName').show();
        $('.riskname').text(riskName);
      }else{
        $('#risk__manual__riskName').show();
        $('#riskName').hide();
        $('#risk__manual__riskName input').val(riskName);
      }; 

      // Set Risk evaluation data
      // risk likelihood
      $('#risks__vulnerability__attack__path').empty();
      setSecurityPropertyValues(riskLikelihood);
      updateOccurrenceThreatFactorTable(threatFactorLevel, occurrenceLevel);
      tinymce.get('risk__likelihood__details').setContent(riskLikelihoodDetail);

      if(isOWASPLikelihood){
        $('#risk__simple__evaluation').hide();
        $('#risk__likehood__table').show();
      }else{
        $('#risk__simple__evaluation').show();
        $('#risk__likehood__table').hide();
      }

      // risk impact
      updateEvaluationTable(riskImpact, businessAssetRef);
      addVulnerabilitySection(riskAttackPaths);
      $('#all_attack_paths_score').text(allAttackPathsScore == null ? '' : allAttackPathsScore);
      $('#inherent_risk_score').text(inherentRiskScore == null ? '' : inherentRiskScore);

      //risk mitigation
      $('#risks__risk__mitigation__evaluation section').empty();
      addMitigationSection(riskMitigation, riskManagementDecision);
      $('#mitigated_risk_score').text(mitigatedRiskScore == null ? '' : mitigatedRiskScore);

      //risk management
      $(`input[name='risk__management__decision'][value='${riskManagementDecision}']`).prop('checked', true);
      tinymce.get('risk__management__detail__rich-text').setContent(riskManagementDetail);
      $('#residual_risk_score').text(residualRiskScore == null ? '' : residualRiskScore);
      $('#residual_risk_level').text(residualRiskLevel == null ? '' : residualRiskLevel);
      styleResidualRiskLevel(residualRiskLevel);

      // set 'NaN' values
      riskAttackPaths.forEach((path) => {
        const { vulnerabilityRef, riskAttackPathId } = path;
        for(let i=0; i<vulnerabilityRef.length; i++){
          if (vulnerabilityRef[i].name !== '' && vulnerabilityRef[i].score === null) {
            setNaNValues(riskAttackPathId);
            break;
          } else setNaNValues();
        }
      })
    };

    const validatePreviousRisk = async (id) => {
      let risk = risksData.find((risk) => risk.riskId === id);
      const isRiskExist = await window.risks.isRiskExist(risk.riskId);

      if (isRiskExist) {
        const risks = await window.validate.risks(risk);
        risksData = risks;
      } 
    };

    risksTable.on("rowDeselected", (row) => {
      validatePreviousRisk(row.getIndex());
    });

    // row is clicked & selected
    risksTable.on('rowClick', (e, row) => {
      risksTable.selectRow(row.getIndex());
      addSelectedRowData(row.getIndex());
    });

    const addRisk = (risk) => {
      // filter
      risksTable.clearFilter();
      $('input[id="filter-value"]').val('');
      if (risksData.length > 0) $('#risks section').show();
      const rowData = {
        ...risk
      }
      risksTable.addData([rowData]);

    };

    const deleteRisks = async (checkboxes) =>{
      const checkedRisks = [];
      let currentRiskId;
      checkboxes.forEach((box) => {
        if (box.checked) checkedRisks.push(Number(box.value));
      });

      await window.risks.deleteRisk(checkedRisks);
      checkedRisks.forEach((id) => {
        const index = risksData.findIndex(object => {
          return object.riskId === id;
        });

        risksTable.getRow(Number(id)).delete();

        // update risksData`
        risksData.splice(index, 1);
        if(risksData.length === 0)  $('#risks section').hide();
        else {
          risksData.forEach((risk)=>{
            risksTable.deselectRow(risk.riskId);
          })
          risksTable.selectRow(risksData[0].riskId);
          currentRiskId = risksData[0].riskId;
        }
      });

      if (currentRiskId) addSelectedRowData(currentRiskId);
    };

    const updateRisksFields = (fetchedData) => {
      risksTable.clearData();
      // $('#risks__table__checkboxes').empty();
      $('#risk__simple__evaluation').hide();
      $('#risk__likehood__table').show();
      $('#risks__risk__mitigation__evaluation section').empty();
      const tableData = fetchedData.map(risk => ( {
        ...risk
      }))
      risksTable.addData(tableData);
      risksTable.selectRow(fetchedData[0].riskId);
      addSelectedRowData(fetchedData[0].riskId);
      
      /* fetchedData.forEach((risk, i) => {
        addRisk(risk);

      }); */
    };

    // add Risk button
    $('#risks .add-delete-container button').first().on('click', async () => {
      const [risk, risks] = await window.risks.addRisk();
      // update risksData
      if(risksData.length === 0) $('#risks section').show();
      risksData.push(risk);
      addRisk(risk);
      if (risksData.length === 1) {
        risksTable.selectRow(risk.riskId);
        addSelectedRowData(risk.riskId);
      }
    });

    // delete Risk button
    $('#risks .add-delete-container button:nth-child(2)').on('click', async () => {
      const checkboxes = document.getElementsByName('risks__table__checkboxes');
      deleteRisks(checkboxes);
    });

    const assetsRelationshipSetUp = (fetchedData) =>{
      businessAssets = fetchedData.BusinessAsset;
      supportingAssets = fetchedData.SupportingAsset;
      supportingAssets.forEach((sa)=>{
        const { businessAssetRef } = sa;
        assetsRelationship[sa.supportingAssetId] = businessAssetRef;
      });

      $('#risk__businessAsset').empty();
      let businessAssetsOptions = '';
      businessAssets.filter(uncheckedBA => uncheckedBA.businessAssetName).forEach((ba)=>{
        businessAssetsOptions += `<option value="${ba.businessAssetId}">${ba.businessAssetName}</option>`;
      });
      businessAssetsOptions += '<option value="null">Select...</option>'
      $('#risk__businessAsset').append(businessAssetsOptions);
    }

    $(document).ready(async function () {
      window.project.load(async (event, data) => {
        const fetchedData = await JSON.parse(data);
        risksData = fetchedData.Risk;
        if (risksData.length === 0) $('#risks section').hide();
        else $('#risks section').show();
        vulnerabilities = fetchedData.Vulnerability;
        assetsRelationshipSetUp(fetchedData);
        
        
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
          setup: function (ed) {
            ed.on('change', function (e) {
              const { id } = e.target;
              let richText = tinymce.get(id).getContent();
              const risk = risksData.find((risk) => risk.riskId === getCurrentRiskId());
              const { riskLikelihood } = risk;
              if (id === 'risk__threatAgent__rich-text') risk.threatAgentDetail = richText;
              else if (id === 'risk__threat__rich-text') risk.threatVerbDetail = richText;
              else if (id === 'risk__motivation__rich-text') risk.motivationDetail = richText;
              else if (id === 'risk__likelihood__details') riskLikelihood.riskLikelihoodDetail = richText;
              else if (id === 'risk__management__detail__rich-text') risk.riskManagementDetail = richText;
              validatePreviousRisk(getCurrentRiskId());
            });
          }
        });

        updateRisksFields(risksData);
        enableAllTabs()
        window.removeEventListener('keydown', handleReload);
      });
    });

    // reloads all data displayed for current risk
    const reloadCurrentRisk = (updatedRisk) => {
      const { riskId, riskName, threatAgent, threatVerb, businessAssetRef, supportingAssetRef, motivation, residualRiskLevel, riskManagementDecision } = updatedRisk;
      //const { threatAgent, threatVerb, businessAssetRef, supportingAssetRef, motivation } = riskName;
      let riskIndex = risksData.findIndex((risk) => risk.riskId === updatedRisk.riskId);

      risksData[riskIndex] = updatedRisk;
      risksTable.updateData([{ riskId: getCurrentRiskId(), riskName: riskName, residualRiskLevel }]);
      validateRiskName(riskId, threatAgent, threatVerb, businessAssetRef, supportingAssetRef, motivation);
      styleResidualRiskLevelTable(riskId, residualRiskLevel);
      styleRiskName(riskManagementDecision, riskId);
      addSelectedRowData(riskId);
    };

    // reloads selected data displayed for updateRiskLikelihood, updateRiskMitigation, updateRiskManagement
    const updateScoresAndLevel = (risk) => {
      let riskIndex = risksData.findIndex((r) => r.riskId === risk.riskId);
      risksData[riskIndex] = risk;
      risksTable.updateData([{ riskId: getCurrentRiskId(), riskName: risk.riskName, residualRiskLevel: risk.residualRiskLevel }]);
      if(risk.inherentRiskScore != null){
        $('#inherent_risk_score').text(risk.inherentRiskScore);
        $('#mitigated_risk_score').text(risk.mitigatedRiskScore);
        $('#residual_risk_score').text(risk.residualRiskScore);
        $('#residual_risk_level').text(risk.residualRiskLevel);
        styleResidualRiskLevel(risk.residualRiskLevel);
        styleResidualRiskLevelTable(risk.riskId, risk.residualRiskLevel);
      }
    }

  /**
     * 
     * 
     * Risk description
     * 
     * 
  */
    const updateRiskName = async (field, value) =>{
      await validatePreviousRisk(getCurrentRiskId());
      const risk = await window.risks.updateRiskName(getCurrentRiskId(), field, value);
      reloadCurrentRisk(risk);
    };

    // trigger Manual RiskName section
    $('#riskName button').on('click', async()=>{
        $('#risk__manual__riskName').show();
        $('#riskName').hide();
        updateRiskName('riskName', '');
    });

    // trigger Automatic RiskName section
    $('#risk__manual__riskName button').on('click', async()=>{
      $('#risk__manual__riskName').hide();
      $('#riskName').show();
      updateRiskName('automatic riskName');
    });

    $('#risk__manual__riskName input').on('change', ()=>{
      const input = $('#risk__manual__riskName input').val();
      updateRiskName('riskName', input);
    });

    $('#risk__threatAgent').on('change', ()=>{   
      const selected = $('#risk__threatAgent').find(":selected").val();
      updateRiskName('threatAgent', selected);
      validateRiskName(getCurrentRiskId(), selected, 'threatVerb', 'businessAssetRef', 'supportingRef', 'motivation');
    });

    $('#risk__threat').on('change', ()=>{
      const selected = $('#risk__threat').find(":selected").val();
      updateRiskName('threatVerb', selected);
      validateRiskName(getCurrentRiskId(), 'threatAgent', selected, 'businessAssetRef', 'supportingRef', 'motivation');
    });

    $('#risk__businessAsset').on('change', ()=>{
      const selected = $('#risk__businessAsset').find(":selected").val();
      updateRiskName('businessAssetRef', selected);
      validateRiskName(getCurrentRiskId(), 'threatAgent', 'threatVerb', selected, 'supportingRef', 'motivation');
    });

    $('#risk__supportingAsset').on('change', ()=>{
      const id = risksTable.getSelectedData()[0].riskId;
      const selected = $('#risk__supportingAsset').find(":selected").val();
      updateRiskName('supportingAssetRef', selected);
      validateRiskName(getCurrentRiskId(), 'threatAgent', 'threatVerb', 'businessAssetRef', selected, 'motivation');
    });

    $('#risk__motivation').on('change', ()=>{
      const input = $('#risk__motivation').val();
      updateRiskName('motivation', input);
      validateRiskName(getCurrentRiskId(), 'threatAgent', 'threatVerb', 'businessAssetRef', 'supportingRef', input);
    });

  /**
     * 
     * 
     * Risk evaluation
     * 
     * 
  */

  // Risk Likelihood
    $('[name="Go to vulnerabilities view"]').on('click', ()=>{
      location.href = '../Vulnerabilities/vulnerabilities.html';
    });

    const calculateThreatFactorScore = async () =>{
      const skillLevel = $('#risk__skillLevel').find(":selected").val();
      const reward = $('#risk__reward').find(":selected").val();
      const accessResources = $('#risk__accessResources').find(":selected").val();
      const size = $('#risk__size').find(":selected").val();
      const intrusionDetection = $('#risk__intrusionDetection').find(":selected").val();
      const id = getCurrentRiskId();

      await validatePreviousRisk(getCurrentRiskId());
      const risk = await window.risks.updateRiskLikelihood(id, 'threatFactorScore', {
        skillLevel: skillLevel,
        reward: reward,
        accessResources: accessResources,
        size: size,
        intrusionDetection: intrusionDetection
      });
      // reloadCurrentRisk(risk);
      updateScoresAndLevel(risk);
      updateOccurrenceThreatFactorTable(risk.riskLikelihood.threatFactorLevel, risk.riskLikelihood.occurrenceLevel);
      $('select[id="risk__likelihood"]').val(!risk.riskLikelihood.riskLikelihood ? 'null' : risk.riskLikelihood.riskLikelihood);
    };

    // trigger simple likelihood evaluation section
    $('#risk__likehood__table button:nth-of-type(1)').on('click', async ()=>{
      $('#risk__simple__evaluation').show();
      $('#risk__likehood__table').hide();

      const id = getCurrentRiskId();
      const prevRisk = await window.risks.updateRiskLikelihood(id, 'isOWASPLikelihood', false);
      await window.risks.updateRiskLikelihood(id, 'threatFactorScore', {
        skillLevel: 'null',
        reward: 'null',
        accessResources: 'null',
        size: 'null',
        intrusionDetection: 'null'
      });
      await window.risks.updateRiskLikelihood(id, 'occurrence', 'null');

      // const riskLikelihoodPrevValue = $('#risk__likelihood').find(":selected").val();
      await validatePreviousRisk(getCurrentRiskId());
      const risk = await window.risks.updateRiskLikelihood(id, 'riskLikelihood', prevRisk.riskLikelihood.riskLikelihood);
      // reloadCurrentRisk(risk);
      // setSecurityPropertyValues(risk.riskLikelihood);
      updateScoresAndLevel(risk);
      updateOccurrenceThreatFactorTable(risk.riskLikelihood.threatFactorLevel, risk.riskLikelihood.occurrenceLevel);
      $('select[id="risk__likelihood"]').val(!risk.riskLikelihood.riskLikelihood ? 'null' : risk.riskLikelihood.riskLikelihood);
    });

    $('#risk__likelihood').on('change', async ()=>{
      const riskLikelihood = $('#risk__likelihood').find(":selected").val();
      await validatePreviousRisk(getCurrentRiskId());
      const risk = await window.risks.updateRiskLikelihood(getCurrentRiskId(), 'riskLikelihood', riskLikelihood);
      // reloadCurrentRisk(risk);
      updateScoresAndLevel(risk);
    });

    // trigger owasp likelihood evaluation section
    $('#risk__simple__evaluation button').on('click', async ()=>{
      $('#risk__simple__evaluation').hide();
      $('#risk__likehood__table').show();

      const riskLikelihoodPrevValue = $('#risk__likelihood').find(":selected").val();
      await validatePreviousRisk(getCurrentRiskId());
      await window.risks.updateRiskLikelihood(getCurrentRiskId(), 'riskLikelihood', riskLikelihoodPrevValue);
      const risk = await window.risks.updateRiskLikelihood(getCurrentRiskId(), 'isOWASPLikelihood', true);
      // reloadCurrentRisk(risk);
      updateScoresAndLevel(risk);
      const { riskLikelihood } = risk;
      const { skillLevel, reward, accessResources, size, intrusionDetection, occurrence } = riskLikelihood;
      $('select[id="risk__skillLevel"]').val(!skillLevel ? 'null' : skillLevel);
      $('select[id="risk__reward"]').val(!reward ? 'null' : reward);
      $('select[id="risk__accessResources"]').val(!accessResources ? 'null' : accessResources);
      $('select[id="risk__size"]').val(!size ? 'null' : size);
      $('select[id="risk__intrusionDetection"]').val(!intrusionDetection ? 'null' : intrusionDetection);
      $('select[id="risk__occurrence"]').val(!occurrence ? 'null' : occurrence);
    });

    $('#risk__skillLevel').on('change', ()=>{
      calculateThreatFactorScore();
    });

    $('#risk__reward').on('change', ()=>{
      calculateThreatFactorScore();
    });

    $('#risk__accessResources').on('change', ()=>{
      calculateThreatFactorScore();
    });

    $('#risk__size').on('change', ()=>{
      calculateThreatFactorScore();
    });

    $('#risk__intrusionDetection').on('change', ()=>{
      calculateThreatFactorScore();
    });

    const calculateOccurrence = async () => {
      const selected = $('#risk__occurrence').find(":selected").val();
      const id = getCurrentRiskId();
      await validatePreviousRisk(getCurrentRiskId());
      const risk = await window.risks.updateRiskLikelihood(id, 'occurrence', selected);
      // reloadCurrentRisk(risk);
      updateScoresAndLevel(risk);
      updateOccurrenceThreatFactorTable(risk.riskLikelihood.threatFactorLevel, risk.riskLikelihood.occurrenceLevel);
    };

    $('#risk__occurrence').on('change', async ()=>{
      await calculateOccurrence();
    });

    // Risk Impact
    const checkbox = async (field, value)=>{
      await validatePreviousRisk(getCurrentRiskId());
      const risk = await window.risks.updateRiskImpact(getCurrentRiskId(), field, value);
      reloadCurrentRisk(risk);
    };

    $('#risk__confidentialty').on('change', ()=>{
      checkbox('businessAssetConfidentialityFlag', $('#risk__confidentialty').is(":checked") ? 1 : 0);
    });

    $('#risk__integrity').on('change', ()=>{
      checkbox('businessAssetIntegrityFlag', $('#risk__integrity').is(":checked") ? 1 : 0);
    });

    $('#risk__availability').on('change', ()=>{
      checkbox('businessAssetAvailabilityFlag', $('#risk__availability').is(":checked") ? 1 : 0);
    });

    $('#risk__authenticity').on('change', ()=>{
      checkbox('businessAssetAuthenticityFlag', $('#risk__authenticity').is(":checked") ? 1 : 0);
    });

    $('#risk__authorization').on('change', ()=>{
      checkbox('businessAssetAuthorizationFlag', $('#risk__authorization').is(":checked") ? 1 : 0);
    });

    $('#risk__nonrepudiation').on('change', ()=>{
      checkbox('businessAssetNonRepudiationFlag', $('#risk__nonrepudiation').is(":checked") ? 1 : 0);
    });

    /**
    * 
    * 
    * Vulnerability evaluation
    * 
    * 
 */
    // add Risk attack path button
    $('#risks__vulnerability__evaluation .add-delete-container:first-of-type button:first-of-type').on('click', async () => {
      await validatePreviousRisk(getCurrentRiskId());
      const risk = await window.risks.addRiskAttackPath(getCurrentRiskId());
      reloadCurrentRisk(risk);
    });

    // delete Risk attack path button
    $('#risks__vulnerability__evaluation .add-delete-container:first-of-type button:nth-child(2)').on('click', async () => {
      const checkedRiskAttackPaths = [];
      const checkboxes = document.getElementsByName('risks__attack__path__checkboxes');
      checkboxes.forEach((box) => {
        if (box.checked) checkedRiskAttackPaths.push(Number(box.value));
      });
      await validatePreviousRisk(getCurrentRiskId());
      const risk = await window.risks.deleteRiskAttackPath(getCurrentRiskId(), checkedRiskAttackPaths);
      reloadCurrentRisk(risk);
    });

        /**
    * 
    * 
    * Risk Mitigation evaluation
    * 
    * 
 */

    // add Risk Mitigation button
    $('#risks__risk__mitigation__evaluation .add-delete-container:first-of-type button:first-of-type').on('click', async () => {
      await validatePreviousRisk(getCurrentRiskId());
      const risk = await window.risks.addRiskMitigation(getCurrentRiskId());
      reloadCurrentRisk(risk);
    });

    // delete Risk Mitigation button
    $('#risks__risk__mitigation__evaluation .add-delete-container:first-of-type button:nth-child(2)').on('click', async () => {
      const checkedRiskMitigations = [];
      const checkboxes = document.getElementsByName('risks__mitigation__checkboxes');
      checkboxes.forEach((box) => {
        if (box.checked) checkedRiskMitigations.push(Number(box.value));
      });
      await validatePreviousRisk(getCurrentRiskId());
      const risk = await window.risks.deleteRiskMitigation(getCurrentRiskId(), checkedRiskMitigations);
      reloadCurrentRisk(risk);
    });


    /**
* 
* 
* Risk Management evaluation
* 
* 
*/

  $(`input[type='radio'][name='risk__management__decision']`).change(async (e) => {
    const { value } = e.target;
    if (value === 'Mitigate') $('.bottom:hidden').css('display', 'grid');
    else $('.bottom').css('display', 'none');

    await validatePreviousRisk(getCurrentRiskId());
    const risk = await window.risks.updateRiskManagement(getCurrentRiskId(), 'riskManagementDecision', value);
    updateScoresAndLevel(risk);
    risksTable.updateData([{ riskId: getCurrentRiskId(), riskManagementDecision: value }]);
    styleRiskName(value, risk.riskId)
    //reloadCurrentRisk(risk);
  });
    
  } catch (err) {
    alert('Failed to load Risks Tab: ' + err);
  }
})();

// window.onload = setTimeout(function () {
//   alert('Loading...');
// }, 3000);
