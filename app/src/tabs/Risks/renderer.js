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

/* global $ tinymce Tabulator */

const { SEVERITY_COLORS = {}, TEXT_COLOR = {} } = window.COLOR_CONSTANTS || {};
const ERROR_COLOR = TEXT_COLOR.ERROR;
const DEFAULT_TEXT_COLOR = TEXT_COLOR.DEFAULT;
const normaliseSeverityLevel = (level) => (level || '').toString().trim().toLowerCase();
const getSeverityColor = (level) => {
  switch (normaliseSeverityLevel(level)) {
    case 'critical':
    case 'very high':
      return SEVERITY_COLORS.CRITICAL;
    case 'high':
      return SEVERITY_COLORS.HIGH;
    case 'medium':
      return SEVERITY_COLORS.MEDIUM;
    default:
      return SEVERITY_COLORS.LOW;
  }
};
const toRgbString = (hex) => {
  if (!hex || typeof hex !== 'string') return null;
  const normalised = hex.replace('#', '');
  if (normalised.length !== 6) return null;
  const r = parseInt(normalised.slice(0, 2), 16);
  const g = parseInt(normalised.slice(2, 4), 16);
  const b = parseInt(normalised.slice(4, 6), 16);
  if ([r, g, b].some((value) => Number.isNaN(value))) return null;
  return `rgb(${r}, ${g}, ${b})`;
};
const ERROR_COLOR_HEX = ERROR_COLOR.toLowerCase();
const ERROR_COLOR_RGB = (toRgbString(ERROR_COLOR) || '').toLowerCase();
const isErrorColor = (value) => {
  const normalised = (value || '').toString().trim().toLowerCase();
  return normalised === ERROR_COLOR_HEX || normalised === ERROR_COLOR_RGB;
};

// Display the buttons as not usable
function disableButtons(){
  for (button of document.querySelectorAll('button')) button.disabled = true;
}

function disableInputs(){
  for (input of document.querySelectorAll('input')) input.disabled = true;
  for (select of document.querySelectorAll('select')) select.disabled = true;
}

// Display the buttons as usable
function enableButtons(){
  for (button of document.querySelectorAll('button')) button.disabled = false;
}

function enableInputs(){
  for (input of document.querySelectorAll('input')) input.disabled = false;
  for (select of document.querySelectorAll('select')) select.disabled = false;

}

// Display the buttons as not selectable
function disableRiskSelection(){
  document.querySelector('#risks__table .tabulator-tableholder').classList.add('disabled')
}
// Display the buttons as selectable
function enableRiskSelection(){
  document.querySelector('#risks__table .tabulator-tableholder').classList.remove('disabled')
}

function disableInteract(){
  disableButtons()
  disableInputs()
  disableRiskSelection()
  disableAllTabs()
}

function enableInteract(){
  enableButtons()
  enableInputs()
  enableRiskSelection()
  enableAllTabs()
}

(async () => {
  let addSelectedRowDataExecuting = false;

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
    $('#riskName .riskname').addClass('text-wrap');
    $('#risk__businessAsset, #risk__supportingAsset').addClass('text-wrap');
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
      const cellElement = cell.getElement();
      const riskManagementDecision = cell.getRow().getData().riskManagementDecision;
      const riskData = cell.getRow().getData();

      const currentColor = (cell.getElement().style.color || '').toLowerCase();
      if (riskManagementDecision === 'Discarded' && !isErrorColor(currentColor)) cell.getElement().style['text-decoration'] = 'line-through';
      else cell.getElement().style['text-decoration'] = 'none';


      const riskName = cell.getValue();
      return `<span class="risks-table__name-text text-wrap">${riskName}</span>`;
    
    }
    
    tableOptions.columns[riskLevelIndex].formatter = (cell) => {
      const residualRiskLevel = cell.getValue()
      cell.getElement().style.color = getSeverityColor(residualRiskLevel);
      
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

    $('input[id="filter-value"]').on('change', async (e) => {
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
          disableInteract()
          await addSelectedRowData(filteredRows[0].riskId);
          enableInteract()

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
    const getCurrentRiskId = () => {
      // Store the current risk id in the browser's volatile storage
      sessionStorage.setItem("currentRisk",risksTable.getSelectedData()[0].riskId);
      return risksTable.getSelectedData()[0].riskId;
    };

    // Check if the businessAsset exists globally
    const existBusinessAsset = (ref) =>{
      if (ref === null) return null
      let foundBusinessAsset = businessAssets.find(obj => obj.businessAssetId === ref);
      return foundBusinessAsset || null
    };

    // Check if the businessAsset is valid
    const checkBusinessAssetRef = (ref) =>{
      if (ref === null) return false
      let foundBusinessAsset = existBusinessAsset(ref)
      return foundBusinessAsset && foundBusinessAsset.businessAssetName !== '' ? true : false
    };

    // Check if the businessAssets are valid
    const checkBusinessAssetRefArray = (refArray) =>{
      if(refArray.length){
        for (ref of refArray){
          if (!checkBusinessAssetRef(ref)) return false
        }
      }
      return true
    };

    const existSupportingAsset = (ref) =>{
      if (ref === null) return null
      let foundSupportingAsset = supportingAssets.find(obj => obj.supportingAssetId == ref);
      return foundSupportingAsset || null
    };

    const coherentSupportingAsset = (refSA,refBA) =>{
      if (refSA === null || refBA === null) return null
      let foundSupportingAsset = existSupportingAsset(refSA)
      return (foundSupportingAsset && foundSupportingAsset.businessAssetRef.some((ba) => ba === refBA)) || null
    };

    // Check if the supportingAsset is valid
    const checkSupportingAssetRef = (ref) =>{
      if (ref === null) return 
      let foundSupportingAsset = existSupportingAsset(ref)

      if (
        foundSupportingAsset == null || 
        foundSupportingAsset.businessAssetRef.length == 0 || 
        foundSupportingAsset.businessAssetRef.length !== new Set(foundSupportingAsset.businessAssetRef).size || 
        !checkBusinessAssetRefArray(foundSupportingAsset.businessAssetRef) || 
        foundSupportingAsset.supportingAssetName == ''
      ){
        return false
      }
      return true
    };

    // Check if the supportingAssets are valid
    const checkSupportingAssetRefArray = (refArray) =>{
      if(refArray.length){
        for (ref of refArray){
          if (!checkSupportingAssetRef(ref)) return false
        }
      }
      return true
    };

    // Check if the supportingAsset exists globally
    const checkVulnerabilityRef = (ref,supportingAssetRef) =>{
      if (ref === null) return false
      found = vulnerabilities.find(obj => obj.vulnerabilityId === ref);
      if (
        !found ||
        !found.supportingAssetRef.includes(supportingAssetRef) ||
        !checkSupportingAssetRefArray(found.supportingAssetRef) || 
        found.vulnerabilityName === '' || 
        found.vulnerabilityDescription === ''
      ) return false
      return true
    };

    // Check if each vulnerability in attackPaths exist globally
    const checkRiskAttackPaths = (attackPaths,supportingAssetRef) =>{      
      if(attackPaths.length){
        for (const attackPath of attackPaths) {
          if(attackPath.vulnerabilityRef.length){
            for (const ref of attackPath.vulnerabilityRef) {
              if (!checkVulnerabilityRef(ref.vulnerabilityId,supportingAssetRef)) return false
            }
          }
        }
      }
      return true
    };

    const validateRiskName = (risk) => {
      const { threatAgent, threatVerb, businessAssetRef, supportingAssetRef, motivation,riskAttackPaths } = risk;
      if (
        threatAgent === '' || 
        threatVerb === '' || 
        ! checkBusinessAssetRef(businessAssetRef) || 
        ! checkSupportingAssetRef(supportingAssetRef) || 
        ! checkRiskAttackPaths(riskAttackPaths,supportingAssetRef) || 
        motivation === ''
      ){
        return ERROR_COLOR;
      } else return DEFAULT_TEXT_COLOR;
    };

    // add Supporting Assets Select options
    const addSupportingAssetOptions = (businessAssetRef) =>{
      let supportingAssetOptions = '<option value="">Select...</option>';
      $('#risk__supportingAsset').empty();
      if(businessAssetRef!=null && existBusinessAsset(businessAssetRef)!=null){
        supportingAssets.forEach((sa) =>{
          if(assetsRelationship[sa.supportingAssetId].some((baRef) => baRef === businessAssetRef )){
            supportingAssetOptions += `<option value="${sa.supportingAssetId}" class="text-wrap" style="${checkSupportingAssetRef(sa.supportingAssetId) ? '' : 'color:' + ERROR_COLOR}">${sa.supportingAssetName}</option>`;
          }
        });
      }
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

    const goToVulnerabilityTab = (vulnerabilityId) => {
      if (vulnerabilityId) sessionStorage.setItem("currentVulnerability", vulnerabilityId);
      location.href = '../Vulnerabilities/vulnerabilities.html';
    };

    const createVulnerabilityNavButton = (selectElement) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'risk__vulnerability__open';
      button.innerText = 'Open';
      button.addEventListener('click', () => {
        const { value } = selectElement;
        if (!value) return;
        goToVulnerabilityTab(value);
      });
      return button;
    };

    // add vulnerability ref
    const addVulnerabilityRef = (refs, div, vulnerabilityOptions, riskAttackPathId, supportingAssetRef) => {
      let numberOfVulnerabilities = refs.length;
      refs.forEach((ref, rowId) => {
        numberOfVulnerabilities--;
        let vulnerabilityDiv = $('<div>');
        vulnerabilityDiv.css('display', 'flex');
        vulnerabilityDiv.css('padding', '0');
        vulnerabilityDiv.css('margin-bottom', '1%');
        vulnerabilityDiv.addClass('risk__vulnerability-ref');
        const rowKey = `${riskAttackPathId}-${rowId}`;
        vulnerabilityDiv.attr('id', `vulnerabilityrefs_${rowKey}`);
        const checkboxRef = !ref.score ? null : '1';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${checkboxRef}`;
        checkbox.id =  `risks__vulnerability__checkboxes__${checkboxRef}`;
        checkbox.name = 'risks__vulnerability__checkboxes';
        checkbox.setAttribute('data-row-id', rowKey);
        vulnerabilityDiv.append(checkbox);

        let select = $('<select>').addClass('text-wrap').append(vulnerabilityOptions);
        const viewButton = createVulnerabilityNavButton(select[0]);
        const matchingRef = select.find(`option[value="${ref.vulnerabilityId}"]`)
        if (matchingRef.length === 0) {
          const placeholderRef = document.createElement('option')
          placeholderRef.value = ref.vulnerabilityId
          placeholderRef.text = `${ref.vulnerabilityId} - ${ref.name || 'Unknown vulnerability'}`
          if (!checkVulnerabilityRef(ref.vulnerabilityId,supportingAssetRef)){
            placeholderRef.style =`color: ${ERROR_COLOR};`
            select.css('border-color', ERROR_COLOR);
            select.css('border-width', '3px');
          }
          select.append(placeholderRef)
        }else{
          if (!checkVulnerabilityRef(ref.vulnerabilityId,supportingAssetRef)){
            for (optionRef of matchingRef){
              optionRef.style =`color: ${ERROR_COLOR};`
            }
            select.css('border-color', ERROR_COLOR);
            select.css('border-width', '3px');
          }
        }
        
        select.on('change', async (e)=> {
          const { value } = e.target;
          viewButton.disabled = !value;
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
        vulnerabilityDiv.append(viewButton);
        let visibility = 'visible';
        if (numberOfVulnerabilities === 0) visibility = 'hidden';
        vulnerabilityDiv.append(`<span style="margin-left: 2%; margin-right: 2%; visibility: ${visibility}" class="and">AND<span>`);
        div.append(vulnerabilityDiv);
        
        const selectedOption = select.find('option').filter(function() {
          return Number($(this).val()) === ref.vulnerabilityId     
        })
        select.val(selectedOption.val());
        const previousVulId = selectedOption.val();
        viewButton.disabled = !select.val();
      });
    };

    // add Vulnerabilities evaluation section
    const addVulnerabilitySection = (riskAttackPaths, supportingAssetRef) =>{
      let vulnerabilityOptions = '<option value="">Select...</option>';
      vulnerabilities.filter(uncheckedV => uncheckedV.supportingAssetRef.includes(supportingAssetRef)).forEach((v)=>{
        vulnerabilityOptions += `<option value="${v.vulnerabilityId}" ${!checkVulnerabilityRef(v.vulnerabilityId,supportingAssetRef) ? `style="color: ${ERROR_COLOR};"` : ''}>${v.vulnerabilityId} - ${v.vulnerabilityName}</option>`;
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
        div.css('margin-left', '5px');
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
          const numberOfVulnerabilities = div.find('input[name="risks__vulnerability__checkboxes"]').length;
          let vulnerabilityDiv = $('<div>');
          vulnerabilityDiv.css('display', 'flex');
          vulnerabilityDiv.css('padding', '0');
          vulnerabilityDiv.css('margin-bottom', '1%');
          vulnerabilityDiv.addClass('risk__vulnerability-ref');
          const rowKey = `${riskAttackPathId}-${numberOfVulnerabilities}`;
          vulnerabilityDiv.attr('id', `vulnerabilityrefs_${rowKey}`);
          const checkboxRef = null;
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.value = `${checkboxRef}`;
          checkbox.id =  `risks__vulnerability__checkboxes__${checkboxRef}`;
          checkbox.name = 'risks__vulnerability__checkboxes';
          checkbox.setAttribute('data-row-id', rowKey);
          vulnerabilityDiv.append(checkbox);

          let select = $('<select>').addClass('text-wrap').append(vulnerabilityOptions);
          const viewButton = createVulnerabilityNavButton(select[0]);
          viewButton.disabled = !select.val();
          select.on('change', async (e)=> {
            const { value } = e.target;
            viewButton.disabled = !value;
            await validatePreviousRisk(getCurrentRiskId());
          
            const risk = await window.risks.addRiskVulnerabilityRef(getCurrentRiskId(), riskAttackPathId, value);
            reloadCurrentRisk(risk);
            
            

          });
          vulnerabilityDiv.append(select);
          vulnerabilityDiv.append(viewButton);
          let visibility = 'visible';
          if (numberOfVulnerabilities + 1 === 0) visibility = 'hidden';
          vulnerabilityDiv.append(`<span style="margin-left: 2%; margin-right: 2%; visibility: ${visibility}" class="and">AND<span>`);
          div.append(vulnerabilityDiv);

          
          
        });

        // delete vulnerabilityRef
        deleteButton.addEventListener('click', async ()=>{
          const checkboxes = div.find('input[name="risks__vulnerability__checkboxes"]');
          const ids = [];
          checkboxes.each((_, checkboxEl) => {
            const box = checkboxEl;
            if (box.checked) {
              const rowKey = box.getAttribute('data-row-id');
              const vulRef = document.getElementById(`vulnerabilityrefs_${rowKey}`);
              if (vulRef) {
                const vulId = vulRef.querySelector('select').value;
                if (vulId) {
                  ids.push(Number(vulId));
                }
              }
            }
          });
          // Guard clause to prevent reload
          if (ids.length === 0) return;
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

        addVulnerabilityRef(vulnerabilityRef, div, vulnerabilityOptions, riskAttackPathId, supportingAssetRef);
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

    const addRichTextArea = async(selector, desc, width, riskMitigationId) => {
      const promiseSetup = new Promise((resolveSetup, rejectSetup) => {
        tinymce.init({
          selector,
          promotion: false,
          height: 250,
          min_height: 250,
          width,
          verify_html: true,
          statusbar: false,
          deep: true,
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
          setup: async (editor) => {
            const promiseInit = new Promise((resolveInit, rejectInit) => {
              editor.on('init', () => {
                const content = desc;
                editor.setContent(content);
                resolveInit()

              });
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

            editor.on('click', function (event) {
              const target = event.target;

              if (target.tagName === 'A') {
                event.preventDefault();
                const href = target.getAttribute('href');
                if (href) {
                  window.utility.openURL(href, navigator.onLine);
                }
              }
            });
            // Wait for init to finish, ensure content is displayed
            await promiseInit
            resolveSetup()
          },
        });
      });
      // Wait for setup to finish
      await promiseSetup
    }

    // add Mitigation evaluation section
    const addMitigationSection = async (riskMitigations, riskManagementDecision)=> {
      const promises = riskMitigations.map(async (mitigation)=> {
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
        mainSection.append(checkbox);
        const section = $('<section>');
        section.attr('id', `risks__mitigation__section__${riskMitigationId}`);
        section.css('background-color', 'rgb(200,212,204)');
        section.css('margin-left', '5px');
        section.css('margin-top', '2%');
        section.css('padding', '0');
        section.css('width', '100%');
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
        const promiseDescription = addRichTextArea(`#security__control__desc__rich-text__${getCurrentRiskId()}__${riskMitigationId}`, description, '100%', riskMitigationId);  
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
          if (!Number.isInteger(cost))  input.css('border', `1px solid ${ERROR_COLOR}`);
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
        if (riskManagementDecision !== 'Mitigate' && riskManagementDecision !== 'Transfer') {
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
        const promiseDecisionDetail = addRichTextArea(`#comment__desc__rich-text__${getCurrentRiskId()}__${riskMitigationId}`, decisionDetail, '100%', riskMitigationId);
       
        await promiseDecisionDetail 
        await promiseDescription
      });
      // Wait for all the risk mitigations to be assigned
      await Promise.all(promises)
    };

    const styleResidualRiskLevelTable = (id, residualRiskLevel) => {
      risksTable.getRow(id).getCell('residualRiskLevel').getElement().style.color = getSeverityColor(residualRiskLevel);
    };

    const styleResidualRiskLevel = (residualRiskLevel) => {
      $('#residual_risk_level').css('color', getSeverityColor(residualRiskLevel));
    }

    const styleRiskName = (value, id) => {
      const currentColor = (risksTable.getRow(id).getCell('riskName').getElement().style.color || '').toLowerCase();
      if (value === 'Discarded' && !isErrorColor(currentColor)) risksTable.getRow(id).getCell('riskName').getElement().style['text-decoration'] = 'line-through';
      else risksTable.getRow(id).getCell('riskName').getElement().style['text-decoration'] = 'none';
    };

    // render selected row data on page by riskId
    const addSelectedRowData = async (id) =>{
      if (!addSelectedRowDataExecuting && risksData.find((risk) => risk.riskId == id)){
        addSelectedRowDataExecuting = true;
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
        } = risksData.find((risk) => risk.riskId == id);

        const {
          riskLikelihoodDetail,
          threatFactorLevel,
          occurrenceLevel,
          isOWASPLikelihood
        } = riskLikelihood;

        // Set Risk description data
        $('.riskId').text(riskId);
        tinymce.get('risk__threatAgent__rich-text').setContent(threatAgentDetail);
        tinymce.get('risk__threat__rich-text').setContent(threatVerbDetail);
        tinymce.get('risk__motivation__rich-text').setContent(motivationDetail);
        
        $('select[id="risk__threatAgent"]').val(threatAgent);
        $('select[id="risk__threat"]').val(threatVerb);
        $('#risk__motivation').val(motivation);
        $('select[id="risk__businessAsset"]').val(existBusinessAsset(businessAssetRef) == null ? '' : businessAssetRef);
        $('select[id="risk__businessAsset"]').prop('style',`border:${existBusinessAsset(businessAssetRef) != null && checkBusinessAssetRef(businessAssetRef) ? 'none' : '3px solid ' + ERROR_COLOR}`);
        addSupportingAssetOptions(businessAssetRef);
        $('select[id="risk__supportingAsset"]').val(existBusinessAsset(businessAssetRef) == null || coherentSupportingAsset(supportingAssetRef, businessAssetRef) == null ? '' : supportingAssetRef);
        $('select[id="risk__supportingAsset"]').prop('style',`border:${coherentSupportingAsset(supportingAssetRef, businessAssetRef) != null && checkSupportingAssetRef(supportingAssetRef) ? 'none' : '3px solid ' + ERROR_COLOR}`);

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
        addVulnerabilitySection(riskAttackPaths, supportingAssetRef);
        $('#all_attack_paths_score').text(allAttackPathsScore == null ? '' : allAttackPathsScore);
        $('#inherent_risk_score').text(inherentRiskScore == null ? '' : inherentRiskScore);

        //risk mitigation
        $('#risks__risk__mitigation__evaluation section').empty();
        await addMitigationSection(riskMitigation, riskManagementDecision);
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
        enableInteract()
        addSelectedRowDataExecuting = false;
      }
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
    risksTable.on('rowClick', async(e, row) => {
      risksTable.selectRow(row.getIndex());
      disableInteract()
      await addSelectedRowData(row.getIndex());
      enableInteract()
    });

    const addRisk = (risk) => {
      // filter
      risksTable.clearFilter();
      $('input[id="filter-value"]').val('');
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

    const updateRisksFields = async (fetchedData) => {
      risksTable.clearData();
      // $('#risks__table__checkboxes').empty();
      $('#risk__simple__evaluation').hide();
      $('#risk__likehood__table').show();
      $('#risks__risk__mitigation__evaluation section').empty();
      const tableData = fetchedData.map(risk => ( {
        ...risk
      }))
      risksTable.addData(tableData);
      disableRiskSelection()

      // Select the latest risk selected (stored in the browser's volatile storage) (default: first risk of the table)
      const previousRiskId = sessionStorage.getItem("currentRisk")
      const selectedRisk = previousRiskId && fetchedData.find((risk) => risk.riskId == previousRiskId) ? previousRiskId : fetchedData[0].riskId
      risksTable.selectRow(selectedRisk);
      await addSelectedRowData(selectedRisk);
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
        disableInteract()
        await addSelectedRowData(risk.riskId);
        enableInteract()
      }
    });

    // delete Risk button
    $('#risks .add-delete-container button:nth-child(2)').on('click', async () => {
      const checkboxes = document.getElementsByName('risks__table__checkboxes');
      deleteRisks(checkboxes);
    });

    disableButtons()
    disableInputs()
    const assetsRelationshipSetUp = (fetchedData) =>{
      businessAssets = fetchedData.BusinessAsset;
      supportingAssets = fetchedData.SupportingAsset;
      supportingAssets.forEach((sa)=>{
        const { businessAssetRef } = sa;
        assetsRelationship[sa.supportingAssetId] = businessAssetRef;
      });

      $('#risk__businessAsset').empty();
      let businessAssetsOptions = '<option value="">Select...</option>';
      businessAssets.forEach((ba)=>{
        businessAssetsOptions += `<option value="${ba.businessAssetId}"style="${checkBusinessAssetRef(ba.businessAssetId)?'':'color:' + ERROR_COLOR}">${ba.businessAssetName}</option>`;

      });
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

        if (risksData.length > 0){
          await updateRisksFields(risksData);
        }else{
          $('#risks section').hide();
        }
        enableInteract()
        window.removeEventListener('keydown', handleReload);
      });

    });

    // reloads all data displayed for current risk
    const reloadCurrentRisk = async (updatedRisk) => {
      disableInteract()
      const { riskId, riskName, residualRiskLevel, riskManagementDecision } = updatedRisk;
      //const { threatAgent, threatVerb, businessAssetRef, supportingAssetRef, motivation } = riskName;
      let riskIndex = risksData.findIndex((risk) => risk.riskId === updatedRisk.riskId);
      risksData[riskIndex] = updatedRisk;
      risksTable.updateData([{ riskId: getCurrentRiskId(), riskName: riskName, residualRiskLevel }]);
      risksTable.getRow(riskId).getCell('riskName').getElement().style.color = validateRiskName(updatedRisk);
      styleResidualRiskLevelTable(riskId, residualRiskLevel);
      styleRiskName(riskManagementDecision, riskId);
      await addSelectedRowData(riskId);
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
      if ((field == "businessAssetRef" || field == "supportingAssetRef") && value == "") value = "null"
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
    });

    $('#risk__threat').on('change', ()=>{
      const selected = $('#risk__threat').find(":selected").val();
      updateRiskName('threatVerb', selected);
    });

    $('#risk__businessAsset').on('change', ()=>{
      const selected = $('#risk__businessAsset').find(":selected").val();
      updateRiskName('businessAssetRef', selected);
      addSupportingAssetOptions(selected)
      $('select[id="risk__businessAsset"]').prop('style',`border:${existBusinessAsset(selected) != null && checkBusinessAssetRef(selected) ? 'none' : '3px solid ' + ERROR_COLOR}`);
    });

    $('#risk__supportingAsset').on('change', ()=>{
      const id = risksTable.getSelectedData()[0].riskId;
      const selected = $('#risk__supportingAsset').find(":selected").val();
      updateRiskName('supportingAssetRef', selected);
      $('select[id="risk__supportingAsset"]').prop('style',`border:${existSupportingAsset(selected) != null && checkSupportingAssetRef(selected) ? 'none' : '3px solid ' + ERROR_COLOR}`);
    });

    $('#risk__motivation').on('change', ()=>{
      const input = $('#risk__motivation').val();
      updateRiskName('motivation', input);
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
      goToVulnerabilityTab();
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
      // Guard clause to prevent reload
      if (checkedRiskAttackPaths.length === 0) return;
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
      // Guard clause to prevent reload
      if (checkedRiskMitigations.length === 0) return;
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
    if (value === 'Mitigate' || value === 'Transfer') $('.bottom:hidden').css('display', 'grid');
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

