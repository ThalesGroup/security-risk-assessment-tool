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

    const addRisk = (risk) => {
      const { riskId, projectVersionRef, residualRiskLevel, riskName, riskMitigation } = risk;
      // risksTable.on('tableBuilt', () => {
        // add risk data
        const tabelData = {
          riskId,
          projectVersionRef,
          riskName: riskName.riskName,
          residualRiskLevel,
          decision: 'decision'
        };
        risksTable.addData([tabelData]);

        // add checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = `${riskId}`;
        checkbox.id = `risks__table__checkboxes__${riskId}`;
        checkbox.name = 'risks__table__checkboxes';
        $('#risks__table__checkboxes').append(checkbox);
      // });
    };

    const addDesc = (riskName) =>{
      const {threatAgentDetail, threatDetail, motivationDetail} = riskName;
      for(let i=0; i<3; i++){
        tinymce.init({
          selector: i===0 ? '.risk__threatAgent__rich-text': i===1 ? '.risk__threat__rich-text': '.risk__motivation__rich-text',
          height: 200,
          min_height: 200,
          verify_html: true,
          statusbar: false,
          plugins: 'link lists',
          toolbar: 'undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link | numlist bullist',
  
          setup: (editor) => {
            editor.on('init', () => {
              const content = i===0? threatAgentDetail : i===1 ? threatDetail : motivationDetail;
              editor.setContent(content);
            });
          },
        });
      };     
    };

    const updateRisksFields = (fetchedData) => {
      risksTable.clearData();
      $('#risks__table__checkboxes').empty();

      fetchedData.forEach((risk) => {
        addRisk(risk);
        addDesc(risk.riskName);
      });
    };

    window.project.load(async (event, data) => {
      const fetchedData = await JSON.parse(data).Risk;
      updateRisksFields(fetchedData);
    });
  } catch (err) {
    alert('Failed to load Risks Tab');
  }
})();
