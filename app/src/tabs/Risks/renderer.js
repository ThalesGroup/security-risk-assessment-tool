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
    let risksData;

    // render selected row data on page by riskId
    const addSelectedRowData = (id) =>{
      risksTable.selectRow(id);
      const {riskId, riskName} = risksData.find((risk) => risk.riskId === id);
      const {threatAgentDetail, threatVerbDetail, motivationDetail} = riskName;

      $('.riskId').text(riskId);
      $('.riskname').text(riskName.riskName);
      tinymce.get('risk__threatAgent__rich-text').setContent(threatAgentDetail);
      tinymce.get('risk__threat__rich-text').setContent(threatVerbDetail);
      tinymce.get('risk__motivation__rich-text').setContent(motivationDetail);
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
      checkedRisks.sort();

      await window.risks.deleteRisk(checkedRisks);
      checkedRisks.forEach((id) => {
        const index = risksData.findIndex(object => {
          return object.riskId === id;
        });

        if(risksTable.getSelectedData()[0].riskId === risksData[risksData.length -1].riskId){
          // deleted last row
          if(id === risksTable.getSelectedData()[0].riskId){
            addSelectedRowData(risksData[index].riskId);
          }else{
            addSelectedRowData(risksData[index-1].riskId);
          }
        }else if(id === risksTable.getSelectedData()[0].riskId){
          addSelectedRowData(risksData[index+1].riskId);
        }

        $(`#risks__table__checkboxes__${id}`).remove();
        risksTable.getRow(Number(id)).delete();

        // update risksData`
        risksData.splice(index, 1);
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
      risksData.push(risk[0]);
      addRisk(risk[0]);
    });

    // delete Risk button
    $('#risks button:nth-child(2)').on('click', async () => {
      const checkboxes = document.getElementsByName('risks__table__checkboxes');
      deleteRisks(checkboxes);
    });

    // trigger Manual RiskName section
    $('#riskName button').on('click', async()=>{
        $('#risk__manual__riskName').show();
        $('#riskName').hide();
    });

    // trigger Automatic RiskName section
    $('#risk__manual__riskName button').on('click', async()=>{
      $('#risk__manual__riskName').hide();
      $('#riskName').show();
  });

    window.project.load(async (event, data) => {
      const fetchedData = await JSON.parse(data).Risk;
      risksData = fetchedData;
      updateRisksFields(fetchedData);
    });
    
  } catch (err) {
    alert('Failed to load Risks Tab');
  }
})();
