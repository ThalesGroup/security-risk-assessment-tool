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

//const { ipcRenderer } = require('electron');

(async () => {
  try {
    const tableConfig = {
      selectable: 1,
      layout: 'fitColumns',
      height: '100%',
      index: 'vulnerabilityId',
      columns: [ // Define Table Columns
        {
          title: 'Import?', field: 'Vuln. Checkbox', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true, width: 80
        },
        {
          title: 'Vuln. Name', field: 'vulnerabilityName', headerSort: false, headerHozAlign: 'center', width: 480
        },
        {
          title: 'Vuln. Level', field: 'overallLevel', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true
        },
      ],
    }


    const vulnerabilitiesTable = new Tabulator('#import__table', tableConfig);

    const updateVulnerabilityFields = () => {
      vulnerabilitiesTable.clearData();
      $('#import__table__checkboxes').empty();
      vulnerabilitiesTable.addData([{
        projectName: 'asdas',
        projectVersion: '1',
        vulnerabilityId: 1,
        vulnerabilityName: 'asdasd1asd',
        vulnerabilityFamily: 'Availability Vulnerability',
        vulnerabilityTrackingID: '',
        vulnerabilityTrackingURI: '',
        vulnerabilityDescription: '<p>asdasda</p>',
        vulnerabilityDescriptionAttachment: '',
        vulnerabilityCVE: '',
        cveScore: 4,
        overallScore: 4,
        overallLevel: 'Medium',
        supportingAssetRef: [Array]
      }]);

  };

  const add = (data) => {
    vulnerabilitiesTable.addData(data);
  }
  
    // Record what the user selects 

    
    $(document).ready(async function () {
      updateVulnerabilityFields()
      console.log('checkmate')
      //window
      //window.import.load(async (event, data, selection) => {
      
      /* ipcRenderer.send('request-data');
      ipcRenderer.on('response-data', (event,data) => {
        add(data.Vulnerability)
      }); */
  });
  
  } catch (err) {
      console.log(err)
      alert('Failed to load vulnerabilities tab' + err.message);
  }
})();