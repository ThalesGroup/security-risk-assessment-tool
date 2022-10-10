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
    const result = await window.render.risks();
    const risksTable = new Tabulator('#risks__table', result[1]);
    let risksData, businessAssets, supportingAssets, vulnerabilities;
    let assetsRelationship = {};

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

    const validateRiskName = (riskId, threatAgent, threatVerb, businessAssetRef, supportingAssetRef) => {
      if(threatAgent === '' || threatVerb === '' || businessAssetRef === null || supportingAssetRef === null){
        risksTable.getRow(riskId).getCell('riskName').getElement().style.color = '#FF0000';
      } else risksTable.getRow(riskId).getCell('riskName').getElement().style.color = '#000000';
    };

    // add Supporting Assets Select options
    const addSupportingAssetOptions = (businessAssetRef) =>{
      let supportingAssetOptions = '';
      $('#risk__supportingAsset').empty();
      supportingAssets.forEach((sa) =>{
        if(assetsRelationship[sa.supportingAssetId].some((baRef) => baRef === businessAssetRef)){
          supportingAssetOptions += `<option value="${sa.supportingAssetId}">${sa.supportingAssetName}</option>`;
        }
      });
      supportingAssetOptions += '<option value="null">Select...</option>'
      $('#risk__supportingAsset').append(supportingAssetOptions);
    };

    // add vulnerability ref
    const addVulnerabilityRef = (refs, div, vulnerabilityOptions) => {
      refs.forEach((ref, i) => {
        if (i > 0) div.append('<p>AND</p>');

        let vulnerabilityDiv = $('<div>');
        vulnerabilityDiv.css('display', 'flex');
        vulnerabilityDiv.css('padding', '0');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${ref.vulnerabilityIdRef}`;
        checkbox.id = `risks__vulnerability__checkboxes__${ref.vulnerabilityIdRef}`;
        checkbox.name = 'risks__vulnerability__checkboxes';
        vulnerabilityDiv.append(checkbox);

        let select = $('<select>').append(vulnerabilityOptions);
        vulnerabilityDiv.append(select);

        div.append(vulnerabilityDiv);
        select.val(ref.vulnerabilityIdRef);
      });
    };

    // add Vulnerabilities evaluation section
    const addVulnerabilitySection = (riskAttackPaths) =>{
      let vulnerabilityOptions = '';
      vulnerabilities.forEach((v)=>{
        vulnerabilityOptions += `<option value="${v.vulnerabilityId}">${v.vulnerabilityName}</option>`;
      });

      riskAttackPaths.forEach((path, i) =>{
        if(i > 0) $('#risks__vulnerability__attack__path').append('<p>OR</p>');
        const {riskAttackPathId, vulnerabilityRef, attackPathScore} = path;
        
        const mainDiv = $('<div>');
        mainDiv.css('padding', '0');

        // add checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${riskAttackPathId}`;
        checkbox.id = `risks__attack__path__checkboxes__${riskAttackPathId}`;
        checkbox.name = 'risks__attack__path__checkboxes';
        mainDiv.append(checkbox);

        // add div
        let div = $("<div>").append(`<p>Attack Path ${riskAttackPathId}</p><p>scoring: ${attackPathScore === null ? '' : attackPathScore}<p>`).css('background-color', 'rgb(183, 183, 183)');
        const addDeleteDiv = $('<div>');
        addDeleteDiv.addClass('add-delete-container');
        const addButton = document.createElement('button');
        addButton.className = 'addDelete';
        addButton.innerText = 'Add';
        const deleteButton = document.createElement('button');
        deleteButton.className = 'addDelete';
        deleteButton.innerText = 'Delete';

        addButton.addEventListener('click', async ()=>{
          const vulnerabilityRef = await window.risks.addRiskVulnerabilityRef(getCurrentRiskId(), riskAttackPathId);
          addVulnerabilityRef(vulnerabilityRef, div, vulnerabilityOptions);
          // risksData = risks;
        });

        deleteButton.addEventListener('click', ()=>{
          alert(`Delete vulnerability from attack path ${riskAttackPathId}`);
        });

        addDeleteDiv.append(addButton);
        addDeleteDiv.append(' | ');
        addDeleteDiv.append(deleteButton);
        div.append(addDeleteDiv);
        mainDiv.append(div);
        $('#risks__vulnerability__attack__path').append(mainDiv);

        addVulnerabilityRef(vulnerabilityRef, div, vulnerabilityOptions);
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
        // get schema values?
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

      $('select[id="risk__skillLevel"]').val(!skillLevel ? 'null' : skillLevel);
      $('select[id="risk__reward"]').val(!reward ? 'null' : reward);
      $('select[id="risk__accessResources"]').val(!accessResources ? 'null' : accessResources);
      $('select[id="risk__size"]').val(!size ? 'null' : size);
      $('select[id="risk__intrusionDetection"]').val(!intrusionDetection ? 'null' : intrusionDetection);
      $('select[id="risk__occurrence"]').val(!occurrence ? 'null' : occurrence);
      $('select[id="risk__likelihood"]').val(!riskLikelihood.riskLikelihood ? 'null' : riskLikelihood.riskLikelihood);
    };

    // render selected row data on page by riskId
    const addSelectedRowData = async (id) =>{
      risksTable.selectRow(id);
      const {riskId, riskName, allAttackPathsName, riskAttackPaths, riskLikelihood, riskImpact} = risksData.find((risk) => risk.riskId === id);
      const {
        threatAgent,
        threatAgentDetail, 
        threatVerb,
        threatVerbDetail,
        motivation, 
        motivationDetail,
        businessAssetRef,
        supportingAssetRef,
        isAutomaticRiskName
      } = riskName;
      const {
        riskLikelihoodDetail,
        threatFactorScore,
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
      $('select[id="risk__businessAsset"]').val(businessAssetRef === null ? 'null' : businessAssetRef);
      addSupportingAssetOptions(businessAssetRef);
      $('select[id="risk__supportingAsset"]').val(supportingAssetRef === null ? 'null' : supportingAssetRef);

      if(isAutomaticRiskName){
        $('#risk__manual__riskName').hide();
        $('#riskName').show();
        $('.riskname').text(riskName.riskName);
      }else{
        $('#risk__manual__riskName').show();
        $('#riskName').hide();
        $('#risk__manual__riskName input').val(riskName.riskName);
      }; 

      // toggleSimpleAndOWASPLikelihood();

      // Set Risk evaluation data
      // risk likelihood
      $('#risks__vulnerability__attack__path').empty();
      addVulnerabilitySection(riskAttackPaths);
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
    };

    const validatePreviousRisk = async (id) => {
      let risk = risksData.find((risk) => risk.riskId === id);
      const isRiskExist = await window.risks.isRiskExist(risk.riskId);
      console.log(isRiskExist)

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
      addSelectedRowData(row.getIndex());
    });

    const addRisk = (risk) => {
      const { riskId, projectVersionRef, residualRiskLevel, riskName, riskManagementDecision } = risk;
      const { threatAgent, threatVerb, businessAssetRef, supportingAssetRef } = riskName;
      // risksTable.on('tableBuilt', () => {
        // add risk data
        const tableData = {
          riskId,
          projectVersionRef,
          riskName: riskName.riskName,
          residualRiskLevel,
          riskManagementDecision
        };
        risksTable.addData([tableData]);
        validateRiskName(riskId, threatAgent, threatVerb, businessAssetRef, supportingAssetRef);

        // add checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${riskId}`;
        checkbox.id = `risks__table__checkboxes__${riskId}`;
        checkbox.name = 'risks__table__checkboxes';
        $('#risks__table__checkboxes').append(checkbox);
      // });
    };

    const deleteRisks = async (checkboxes) =>{
      const checkedRisks = [];
      checkboxes.forEach((box) => {
        if (box.checked) checkedRisks.push(Number(box.value));
      });

      await window.risks.deleteRisk(checkedRisks);
      checkedRisks.forEach((id) => {
        const index = risksData.findIndex(object => {
          return object.riskId === id;
        });

        $(`#risks__table__checkboxes__${id}`).remove();
        risksTable.getRow(Number(id)).delete();

        // update risksData`
        risksData.splice(index, 1);
        if(risksData.length === 0)  $('#risks section').hide();
        else {
          risksData.forEach((risk)=>{
            risksTable.deselectRow(risk.riskId);
          })
          addSelectedRowData(risksData[0].riskId);
        }
      });
    };

    const updateRisksFields = (fetchedData) => {
      risksTable.clearData();
      $('#risks__table__checkboxes').empty();
      $('#risk__simple__evaluation').hide();
      $('#risk__likehood__table').show();

      fetchedData.forEach((risk, i) => {
        addRisk(risk);
        if(i===0) {
          const {riskId} = risk;
          addSelectedRowData(riskId)
        }
      });
    };

    // add Risk button
    $('#risks button').first().on('click', async () => {
      const risk = await window.risks.addRisk();
      // update risksData
      if(risksData.length === 0) $('#risks section').show();
      risksData.push(risk[0]);
      addRisk(risk[0]);
      
      risksData.forEach((risk)=>{
        risksTable.deselectRow(risk.riskId);
      })
      addSelectedRowData(risk[0].riskId);
    });

    // delete Risk button
    $('#risks button:nth-child(2)').on('click', async () => {
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
      businessAssets.forEach((ba)=>{
        businessAssetsOptions += `<option value="${ba.businessAssetId}">${ba.businessAssetName}</option>`;
      });
      businessAssetsOptions += '<option value="null">Select...</option>'
      $('#risk__businessAsset').append(businessAssetsOptions);
    }

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
          setup: function (ed) {
            ed.on('change', function (e) {
              const { id } = e.target;
              let richText = tinymce.get(id).getContent();
              const { riskName, riskLikelihood } = risksData.find((risk) => risk.riskId === getCurrentRiskId());

              if (id === 'risk__threatAgent__rich-text') riskName.threatAgentDetail = richText;
              else if (id === 'risk__threat__rich-text') riskName.threatVerbDetail = richText;
              else if (id === 'risk__motivation__rich-text') riskName.motivationDetail = richText;
              else if (id === 'risk__likelihood__details') riskLikelihood.riskLikelihoodDetail = richText;
            });
          }
        });

        const fetchedData = await JSON.parse(data);
        risksData = fetchedData.Risk;
        vulnerabilities = fetchedData.Vulnerability;
        assetsRelationshipSetUp(fetchedData);
        updateRisksFields(risksData);
      });
    });

  /**
     * 
     * 
     * Risk description
     * 
     * 
  */
    const updateRiskName = async (field, value) =>{
      const id = getCurrentRiskId();
      await window.risks.updateRiskName(id, field, value);
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
      validateRiskName(getCurrentRiskId(), selected, 'threatVerb', 'businessAssetRef', 'supportingRef');
    });

    $('#risk__threat').on('change', ()=>{
      const selected = $('#risk__threat').find(":selected").val();
      updateRiskName('threatVerb', selected);
      validateRiskName(getCurrentRiskId(), 'threatAgent', selected, 'businessAssetRef', 'supportingRef');
    });

    $('#risk__businessAsset').on('change', ()=>{
      const selected = $('#risk__businessAsset').find(":selected").val();
      updateRiskName('businessAssetRef', selected);
      validateRiskName(getCurrentRiskId(), 'threatAgent', 'threatVerb', selected, 'supportingRef');
    });

    $('#risk__supportingAsset').on('change', ()=>{
      const id = risksTable.getSelectedData()[0].riskId;
      const selected = $('#risk__supportingAsset').find(":selected").val();
      updateRiskName('supportingAssetRef', selected);
      validateRiskName(getCurrentRiskId(), 'threatAgent', 'threatVerb', 'businessAssetRef', selected);
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
      location.href = '../Vulnerabilities/vulnerabilities.html';
    });

    const calculateThreatFactorScore = async () =>{
      const skillLevel = $('#risk__skillLevel').find(":selected").val();
      const reward = $('#risk__reward').find(":selected").val();
      const accessResources = $('#risk__accessResources').find(":selected").val();
      const size = $('#risk__size').find(":selected").val();
      const intrusionDetection = $('#risk__intrusionDetection').find(":selected").val();
      const id = getCurrentRiskId();

      const riskLikelihood = await window.risks.updateRiskLikelihood(id, 'threatFactorScore', {
        skillLevel: skillLevel,
        reward: reward,
        accessResources: accessResources,
        size: size,
        intrusionDetection: intrusionDetection
      });
      const riskData = risksData.find((risk)=> risk.riskId === id);
      riskData.riskLikelihood = riskLikelihood;

      updateOccurrenceThreatFactorTable(riskLikelihood.threatFactorLevel, riskLikelihood.occurrenceLevel);
      $('select[id="risk__likelihood"]').val(!riskLikelihood.riskLikelihood ? 'null' : riskLikelihood.riskLikelihood);
    };

    // trigger simple likelihood evaluation section
    $('#risk__likehood__table button:nth-of-type(1)').on('click', async ()=>{
      $('#risk__simple__evaluation').show();
      $('#risk__likehood__table').hide();

      const id = getCurrentRiskId();
      await window.risks.updateRiskLikelihood(id, 'threatFactorScore', {
        skillLevel: 'null',
        reward: 'null',
        accessResources: 'null',
        size: 'null',
        intrusionDetection: 'null'
      });
      await window.risks.updateRiskLikelihood(id, 'occurrence', 'null');

      const riskLikelihoodPrevValue = $('#risk__likelihood').find(":selected").val();
      const riskLikelihood = await window.risks.updateRiskLikelihood(id, 'riskLikelihood', riskLikelihoodPrevValue);
      const riskData = risksData.find((risk)=> risk.riskId === id);
      riskData.riskLikelihood = riskLikelihood;

      setSecurityPropertyValues(riskLikelihood);  
      updateOccurrenceThreatFactorTable(riskLikelihood.threatFactorLevel, riskLikelihood.occurrenceLevel);
    });

    $('#risk__likelihood').on('change', async ()=>{
      const riskLikelihood = $('#risk__likelihood').find(":selected").val();
      await window.risks.updateRiskLikelihood(getCurrentRiskId(), 'riskLikelihood', riskLikelihood); 
    });

    // trigger owasp likelihood evaluation section
    $('#risk__simple__evaluation button').on('click', async ()=>{
      $('#risk__simple__evaluation').hide();
      $('#risk__likehood__table').show();

      const riskLikelihoodPrevValue = $('#risk__likelihood').find(":selected").val();
      await window.risks.updateRiskLikelihood(getCurrentRiskId(), 'riskLikelihood', riskLikelihoodPrevValue);
      const riskLikelihood = await window.risks.updateRiskLikelihood(getCurrentRiskId(), 'isOWASPLikelihood', true);
      const riskData = risksData.find((risk)=> risk.riskId === getCurrentRiskId());
      riskData.riskLikelihood = riskLikelihood;
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

    $('#risk__occurrence').on('change', async ()=>{
      const selected = $('#risk__occurrence').find(":selected").val();
      const id = getCurrentRiskId();
      const riskLikelihood = await window.risks.updateRiskLikelihood(id, 'occurrence', selected);
      updateOccurrenceThreatFactorTable(riskLikelihood.threatFactorLevel, riskLikelihood.occurrenceLevel);
      $('select[id="risk__likelihood"]').val(!riskLikelihood.riskLikelihood ? 'null' : riskLikelihood.riskLikelihood);
    });

    // Risk Impact
    const checkbox = async (field, value)=>{
      const risk = await window.risks.updateRiskImpact(getCurrentRiskId(), field, value);
      const riskData = risksData.find((risk)=> risk.riskId === getCurrentRiskId());
      riskData.riskImpact = risk.riskImpact;

      updateEvaluationTable(risk.riskImpact, risk.riskName.businessAssetRef);
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
      const [ riskAttackPath, risks ] = await window.risks.addRiskAttackPath(getCurrentRiskId());
      addVulnerabilitySection(riskAttackPath);
      risksData = risks;
    });

    // delete Risk attack path button
    $('#risks__vulnerability__evaluation .add-delete-container:first-of-type button:nth-child(2)').on('click', async () => {
      const checkedRiskAttackPaths = [];
      const checkboxes = document.getElementsByName('risks__attack__path__checkboxes');
      checkboxes.forEach((box) => {
        if (box.checked) checkedRiskAttackPaths.push(Number(box.value));
      });
      const [riskAttackPaths, risks] = await window.risks.deleteRiskAttackPath(getCurrentRiskId(), checkedRiskAttackPaths);
      $(`#risks__vulnerability__attack__path`).empty();
      addVulnerabilitySection(riskAttackPaths);
      risksData = risks;
    });

    // refresh businessAsset & supportingAsset Data
    window.risks.load(async (event, data) => {
      const fetchedData = await JSON.parse(data);
      risksData = fetchedData.Risk;
      assetsRelationshipSetUp(fetchedData);

      const currentRiskId = risksTable.getSelectedData()[0].riskId;
      risksTable.clearData();
      $('#risks__table__checkboxes').empty();
      risksData.forEach((risk, i) => {
        addRisk(risk);
        if(risk.riskId === currentRiskId) {
          const {riskId} = risk;
          addSelectedRowData(riskId)
        }
      });
    });
    
  } catch (err) {
    alert('Failed to load Risks Tab: ' + err);
  }
})();
