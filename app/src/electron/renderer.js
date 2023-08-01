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

//const { ipcRenderer } = require('electron').ipcRenderer;

(async () => {
  try {


    const checkBoxIndex = 0

  const businessAssetsTableConfig = {
    selectable: 1,
      layout: 'fitColumns',
      height: '100%',
      index: 'businessAssetId',
      columns: [ 
        {
          title: 'Import?', field: 'checkbox', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true, width: 80
        },
        {
          title: 'Business Asset Name', field: 'businessAssetName', headerSort: false, headerHozAlign: 'center', hozAlign: 'center'
        }
      ],
  }

  

  businessAssetsTableConfig.columns[checkBoxIndex].formatter = (cell) => {
      const businessAssetId = cell.getRow().getIndex();
      if (businessAssetId) {
          return `
      <input type="checkbox" name="businessAssets__table__checkboxes" value="${businessAssetId}" id="businessAssets__table__checkboxes__${businessAssetId}"/>
  `;
      }
  };


  const supportingAssetsTableConfig = {
    selectable: 1,
      layout: 'fitColumns',
      height: '100%',
      index: 'supportingAssetId',
      columns: [ 
        {
          title: 'Import?', field: 'checkbox', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true, width: 80
        },
        {
          title: 'Supporting Asset Name', field: 'supportingAssetName', headerSort: false, headerHozAlign: 'center', hozAlign: 'center'
        }
      ],
  }

  supportingAssetsTableConfig.columns[checkBoxIndex].formatter = (cell) => {
    const supportingAssetId = cell.getRow().getIndex();
    if (supportingAssetId) {
        return `
    <input type="checkbox" name="supportingAssets__table__checkboxes" value="${supportingAssetId}" id="supportingAssets__table__checkboxes__${supportingAssetId}"/>
`;
    }
};

  const risksTableConfig = {
    selectable: 1,
      layout: 'fitColumns',
      height: '100%',
      index: 'riskId',
      columns: [ 
        {
          title: 'Import?', field: 'checkbox', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true, width: 80
        },
        {
          title: 'Risk Name', field: 'riskName.riskName', headerSort: false, headerHozAlign: 'center', hozAlign: 'center'
        },
        {
          title: 'Risk Level', field: 'residualRiskLevel', headerSort: false, headerHozAlign: 'center', hozAlign: 'center'
        }
      ],
  }

  risksTableConfig.columns[checkBoxIndex].formatter = (cell) => {
    const riskId = cell.getRow().getIndex();
    if (riskId) {
        return `
    <input type="checkbox" name="risks__table__checkboxes" value="${riskId}" id="risks__table__checkboxes__${riskId}"/>
`;
    }
};

  const vulnerabilityTableConfig = {
    selectable: 1,
      layout: 'fitColumns',
      height: '100%',
      index: 'vulnerabilityId',
      columns: [ // Define Table Columns
        {
          title: 'Import?', field: 'checkbox', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true, width: 80
        },
        {
          title: 'Vuln. Name', field: 'vulnerabilityName', headerSort: false, headerHozAlign: 'center', width: 480
        },
        {
          title: 'Vuln. Level', field: 'overallLevel', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true
        },
      ],
  }

  vulnerabilityTableConfig.columns[checkBoxIndex].formatter = (cell) => {
    const vulnerabilityId = cell.getRow().getIndex();
    if (vulnerabilityId) {
        return `
    <input type="checkbox" name="vulnerabilities__table__checkboxes" value="${vulnerabilityId}" id="vulnerabilities__table__checkboxes__${vulnerabilityId}"/>
`;
    }
};
  const businessAssetsTable = new Tabulator('#businessAssets__table', businessAssetsTableConfig);
  const supportingAssetsTable = new Tabulator('#supportingAssets__table', supportingAssetsTableConfig);
  const risksTable = new Tabulator('#risks__table', risksTableConfig);
  
  const vulnerabilitiesTable = new Tabulator('#vulnerabilities__table', vulnerabilityTableConfig);

    
 

  const importButton = document.getElementById('importButton');

    // Add a click event listener to the button
    importButton.addEventListener('click', () => {
      // This function will be executed when the button is clicked
      const imports = {}
      const baIds = document.getElementsByName('businessAssets__table__checkboxes');
      const checkedBAs = [];
      baIds.forEach((ba) => {
          if (ba.checked) checkedBAs.push(Number(ba.value));
      });
      const saIds = document.getElementsByName('supportingAssets__table__checkboxes');
      const checkedSAs = [];
      saIds.forEach((sa) => {
          if (sa.checked) checkedSAs.push(Number(sa.value));
      });
      const riskIds = document.getElementsByName('risks__table__checkboxes');
      const checkedRisks = [];
      riskIds.forEach((risk) => {
          if (risk.checked) checkedRisks.push(Number(risk.value));
      });
      const vulnerabilityIds = document.getElementsByName('vulnerabilities__table__checkboxes');
      const checkedVulnerabilities = [];
      vulnerabilityIds.forEach((vul) => {
          if (vul.checked) checkedVulnerabilities.push(Number(vul.value));
      });
      imports.supportingAssets = checkedSAs;
      imports.businessAssets = checkedBAs;
      imports.risks = checkedRisks;
      imports.vulnerabilities = checkedVulnerabilities;
      console.log(imports)
      const data = imports;
      window.import.sendImports(data);
      //window.vulnerabilities.deleteVulnerability(checkedVulnerabilities);
      // Perform any actions you want to happen when the button is clicked here.
    });


    
    $(document).ready(async function () {

      window.api.receive('import:load', (importedISRA) => {
        console.log(importedISRA)
        businessAssetsTable.addData(importedISRA.BusinessAsset);
        supportingAssetsTable.addData(importedISRA.SupportingAsset);
        risksTable.addData(importedISRA.Risk);
        vulnerabilitiesTable.addData(importedISRA.Vulnerability);
        
      });

      
  });
  
  } catch (err) {
      console.log(err)
      alert('Failed to load import window ' + err.message);
  }
})();