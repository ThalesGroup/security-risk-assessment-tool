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
    // add Supporting Assets Select options
    const addSupportingAssetOptions = (businessAssetRef) =>{
      let supportingAssetOptions = '';
      $('#risk__supportingAsset').empty();
      supportingAssets.forEach((sa) =>{
        if(assetsRelationship[sa.supportingAssetId].some((baRef) => baRef === businessAssetRef)){
          supportingAssetOptions += `<option value="${sa.supportingAssetId}">${sa.supportingAssetName}</option>`;
        }
      });
      $('#risk__supportingAsset').append(supportingAssetOptions);
    };

    // add Vulnerabilities evaluation section
    const addVulnerabilitySection = (riskAttackPaths) =>{
      let vulnerabilityOptions = '';
      vulnerabilities.forEach((v)=>{
        vulnerabilityOptions += `<option value="${v.vulnerabilityId}">${v.vulnerabilityName}</option>`;
      });

      $('#risks__vulnerability__evaluation').empty();
      riskAttackPaths.forEach((path, i) =>{
        if(i > 0) $('#risks__vulnerability__evaluation').append('<p>OR</p>');
        const {riskAttackPathId, vulnerabilityRef, attackPathScore} = path;
        let div = $("<div>").append(`<p>Attack Path ${riskAttackPathId}</p><p>scoring: ${attackPathScore === null ? '' : attackPathScore}<p>`).css('background-color', 'rgb(183, 183, 183)');
        $('#risks__vulnerability__evaluation').append(div);
        vulnerabilityRef.forEach((ref, i)=>{
          if(i > 0) div.append('<p>AND</p>');
          let select = $('<select>').append(vulnerabilityOptions);
          div.append(select);
          select.val(ref.vulnerabilityIdRef);
        });
      });
    };

    // render selected row data on page by riskId
    const addSelectedRowData = (id) =>{
      risksTable.selectRow(id);
      const {riskId, riskName, allAttackPathsName, riskAttackPaths, riskLikelihood} = risksData.find((risk) => risk.riskId === id);
      const {
        threatAgent,
        threatAgentDetail, 
        threatVerb,
        threatVerbDetail,
        motivation, 
        motivationDetail,
        businessAssetRef,
        supportingAssetRef,
      } = riskName;
      const {
        riskLikelihoodDetail,
        skillLevel,
        reward,
        accessResources,
        size,
        intrusionDetection,
        threatFactorScore,
        threatFactorLevel,
        occurrence,
        occurrenceLevel,
      } = riskLikelihood;

      // Set Risk description data
      $('.riskId').text(riskId);
      tinymce.get('risk__threatAgent__rich-text').setContent(threatAgentDetail);
      tinymce.get('risk__threat__rich-text').setContent(threatVerbDetail);
      tinymce.get('risk__motivation__rich-text').setContent(motivationDetail);
      $('select[id="risk__threatAgent"]').val(threatAgent);
      $('select[id="risk__threat"]').val(threatVerb);
      $('#risk__motivation').val(motivation);
      $('select[id="risk__businessAsset"]').val(businessAssetRef);
      addSupportingAssetOptions(businessAssetRef);
      $('select[id="risk__supportingAsset"]').val(supportingAssetRef);

      let businessAsset = null, supportingAsset = null;
      businessAssets.forEach((ba) => {
        if(ba.businessAssetId === businessAssetRef) businessAsset = ba;
      })
      supportingAssets.forEach((sa) => {
        if(sa.supportingAssetId === supportingAssetRef) supportingAsset = sa;
      })
      let concatedRiskName = 'As a '+  threatAgent + ', I can ' + threatVerb + ' the ' + (businessAsset === null ? '' : businessAsset.businessAssetName) + ' compromising the ' + (supportingAsset === null ? '' : supportingAsset.supportingAssetName) + 'in order to' + motivation;
      if(allAttackPathsName.length > 0){
        concatedRiskName += `, exploiting the ${allAttackPathsName}`;
      }
      if(riskName.riskName.replace(/\s/g, '') !== concatedRiskName.replace(/\s/g, '')){
        $('#risk__manual__riskName').show();
        $('#riskName').hide();
        $('#risk__manual__riskName input').val(riskName.riskName);
      }else{
        $('#risk__manual__riskName').hide();
        $('#riskName').show();
        $('.riskname').text(riskName.riskName);
      }

      // Set Risk evaluation data
      addVulnerabilitySection(riskAttackPaths);
      $('select[id="risk__skillLevel"]').val(skillLevel);
      $('select[id="risk__reward"]').val(reward);
      $('select[id="risk__accessResources"]').val(accessResources);
      $('select[id="risk__size"]').val(size);
      $('select[id="risk__intrusionDetection"]').val(intrusionDetection);
      $('select[id="risk__occurrence"]').val(occurrence);

    };

    // row is clicked & selected
    risksTable.on('rowClick', (e, row) => {
      addSelectedRowData(row.getIndex());
    });

    const addRisk = (risk) => {
      const { riskId, projectVersionRef, residualRiskLevel, riskName, riskManagementDecision } = risk;
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
      $('#risk__businessAsset').append(businessAssetsOptions);
    }

    window.project.load(async (event, data) => {
      const fetchedData = await JSON.parse(data);
      risksData = fetchedData.Risk;
      vulnerabilities = fetchedData.Vulnerability;
      assetsRelationshipSetUp(fetchedData);
      updateRisksFields(risksData);
    });

  /**
     * 
     * 
     * Risk description
     * 
     * 
  */
    const updateRiskName = async (field, value) =>{
      const id = risksTable.getSelectedData()[0].riskId;
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
    });

    $('#risk__threat').on('change', ()=>{
      const selected = $('#risk__threat').find(":selected").val();
      updateRiskName('threatVerb', selected);
    });

    $('#risk__businessAsset').on('change', ()=>{
      const selected = $('#risk__businessAsset').find(":selected").val();
      updateRiskName('businessAssetRef', selected);
    });

    $('#risk__supportingAsset').on('change', ()=>{
      const id = risksTable.getSelectedData()[0].riskId;
      const selected = $('#risk__supportingAsset').find(":selected").val();
      updateRiskName('supportingAssetRef', selected);
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

    $('[name="Go to vulnerabilities view"]').on('click', ()=>{
      alert('Go to vulnerability tab');
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
