/*----------------------------------------------------------------------------
*
*     Copyright © 2025 THALES. All Rights Reserved.
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

const { SEVERITY_COLORS = {} } = window.COLOR_CONSTANTS || {};
const getSeverityColor = (level) => {
  switch (level) {
    case 'Critical':
      return SEVERITY_COLORS.CRITICAL || '#D32A26';
    case 'High':
      return SEVERITY_COLORS.HIGH || '#E35623';
    case 'Medium':
      return SEVERITY_COLORS.MEDIUM || '#FAAB24';
    default:
      return SEVERITY_COLORS.LOW || '#000000';
  }
};


(async () => {
  try {


    const checkBoxIndex = 0
    const levelIndex = 2

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
          title: 'Risk Name', field: 'riskName', headerSort: false, headerHozAlign: 'center', hozAlign: 'center'
        },
        {
          title: 'Risk Level', field: 'residualRiskLevel', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', width: 80
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

risksTableConfig.columns[levelIndex].formatter = (cell) => {
  const residualRiskLevel = cell.getValue()
  cell.getElement().style.color = getSeverityColor(residualRiskLevel);

  
  return residualRiskLevel;

}

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
          title: 'Vuln. Name', field: 'vulnerabilityName', headerSort: false, headerHozAlign: 'center'
        },
        {
          title: 'Vuln. Level', field: 'overallLevel', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true, width: 80
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

vulnerabilityTableConfig.columns[levelIndex].formatter = (cell) => {
  const overallLevel = cell.getValue()
  cell.getElement().style.color = getSeverityColor(overallLevel);
  return overallLevel;
}

  const businessAssetsTable = new Tabulator('#businessAssets__table', businessAssetsTableConfig);
  const supportingAssetsTable = new Tabulator('#supportingAssets__table', supportingAssetsTableConfig);
  const risksTable = new Tabulator('#risks__table', risksTableConfig);
  
  const vulnerabilitiesTable = new Tabulator('#vulnerabilities__table', vulnerabilityTableConfig);

  // filter
  function clearFunction(field) {
    if (field === "BA") {

      businessAssetsTable.clearFilter();
      $('input[id="filterBA-value"]').val('');
      if (businessAssetsTable.getData().length > 0) $('#businessAssets section').show();

    } else if (field === "SA") {

      supportingAssetsTable.clearFilter();
      $('input[id="filterSA-value"]').val('');
      if (supportingAssetsTable.getData().length > 0) $('#supportingAssets section').show();

    } else if (field === "Risk") {

      risksTable.clearFilter();
      $('input[id="filterRisk-value"]').val('');
      if (risksTable.getData().length > 0) $('#risks section').show();

    } else if (field === "Vul") {

      vulnerabilitiesTable.clearFilter();
      $('input[id="filterVul-value"]').val('');
      if (vulnerabilitiesTable.getData().length > 0) $('#vulnerabilities section').show();

    }
    
  };

  function filter(field, e) {

    const { value } = e.target;
 
    if (field === 'BA') {

      if(value === ''){
        clearFunction(field);
      }else {
        const filterOptions = [
            [
                { field: "businessAssetName", type: "like", value: value },
                
            ]
        ];
        businessAssetsTable.setFilter(filterOptions);
        const filteredRows = businessAssetsTable.searchData(filterOptions);
        if (!filteredRows[0]) {
          $('#businessAssets section').hide();
        } 
    }

      

    } else if (field === 'SA') {

      if(value === ''){
        clearFunction(field);
      }else {
        const filterOptions = [
            [
                { field: "supportingAssetName", type: "like", value: value },
                
            ]
        ];
        supportingAssetsTable.setFilter(filterOptions);
        const filteredRows = supportingAssetsTable.searchData(filterOptions);
        if (!filteredRows[0]) {
          $('#supportingAssets section').hide();
        } 
    }

      

    } else if (field === 'Risk') {

      if(value === ''){
        clearFunction(field);
      }else {
        const filterOptions = [
            [
                { field: "riskName", type: "like", value: value },
                { field: "residualRiskLevel", type: "like", value: value },
                
            ]
        ];
        risksTable.setFilter(filterOptions);
        const filteredRows = risksTable.searchData(filterOptions);
        if (!filteredRows[0]) {
          $('#risks section').hide();
        } 
    }


    } else if (field === 'Vul') {

      if(value === ''){
        clearFunction(field);
      }else {
        const filterOptions = [
            [
              { field: "vulnerabilityName", type: "like", value: value },
              { field: "overallLevel", type: "like", value: value },
                
            ]
        ];
        vulnerabilitiesTable.setFilter(filterOptions);
        const filteredRows = vulnerabilitiesTable.searchData(filterOptions);
        if (!filteredRows[0]) {
          $('#vulnerabilities section').hide();
        } 
    }


    }


  }

  function importAll(field) {
    if (field === "BA") {

      const baIds = document.getElementsByName('businessAssets__table__checkboxes');
      baIds.forEach((ba) => {
          ba.checked = true
      });

    } else if (field === "SA") {

      const saIds = document.getElementsByName('supportingAssets__table__checkboxes');
      saIds.forEach((sa) => {
        sa.checked = true
      });

    } else if (field === "Risk") {

      const riskIds = document.getElementsByName('risks__table__checkboxes');
      riskIds.forEach((risk) => {
          risk.checked = true
      });

    } else if (field === "Vul") {

      const vulnerabilityIds = document.getElementsByName('vulnerabilities__table__checkboxes');
      vulnerabilityIds.forEach((vul) => {
          vul.checked = true
      });

    }
  }

  $('input[id="filterBA-value"]').on('change', (e)=> {
    filter('BA', e)
  });

  $('input[id="filterSA-value"]').on('change', (e)=> {
    filter('SA', e)
  });

  $('input[id="filterRisk-value"]').on('change', (e)=> {
    filter('Risk', e)
  });

  $('input[id="filterVul-value"]').on('change', (e)=> {
    filter('Vul', e)
  });



$('button[id="filterBA-clear"]').on('click', () => { 
  clearFunction('BA');
});

$('button[id="filterSA-clear"]').on('click', () => { 
  clearFunction('SA');
});

$('button[id="filterRisk-clear"]').on('click', () => { 
  clearFunction('Risk');
});

$('button[id="filterVul-clear"]').on('click', () => { 
  clearFunction('Vul');
});

$('button[id="select-all-BA"]').on('click', () => { 
  importAll('BA');
});

$('button[id="select-all-SA"]').on('click', () => { 
  importAll('SA');
});

$('button[id="select-all-Risk"]').on('click', () => { 
  importAll('Risk');
});

$('button[id="select-all-Vul"]').on('click', () => { 
  importAll('Vul');
});

  


 

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
      const data = imports;
      window.import.sendImports(data);

    });


    
    $(document).ready(async function () {

      window.api.receive('import:load', (importedISRA) => {
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