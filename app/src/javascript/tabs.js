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

/* global $ Tabulator tinymce */

const tabs = document.querySelector('.wrapper');
const tabButton = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.content');

/**
 * loads ISRA Project Data (new project/xml/json)
 * for reference in developer's tool
 */
window.project.load(async (event, data) => {
  console.log(await JSON.parse(data));
  const { projectName } = await JSON.parse(data).ISRAmeta;
  if (projectName !== '') $('footer').text(`THALES GROUP CONFIDENTIAL {${projectName}}`);
  else $('footer').text('THALES GROUP CONFIDENTIAL {PROJECT}');
});

/**
 * Validate selected tab in backend and populate data to corresponding class
 * Validates fields with no dynamic computation on current page/other pages
 * @param {String} tab name of selected tab
 */
const validateTabs = (tab) => {
  const validateWelcome = () => {
    Tabulator.findTable('#welcome__isra-meta-tracking-table')[0].getRows().forEach((row) => {
      window.welcome.updateTrackingRow(row.getData());
    });

    window.validate.welcome([
      $('#welcome__isra-meta--project-name').val(),
      $('#welcome__isra-meta--organization').val(),
      $('#welcome__isra-meta--project-version').val(),
    ]);
  };

  const validateProjectContext = () => {
    window.validate.projectContext([
      tinymce.get('project-description__text').getContent(),
      tinymce.get('project-objectives__text').getContent(),
      tinymce.get('officer-objectives__text').getContent(),
      tinymce.get('assumptions__text').getContent(),
    ]);
  };

  const validateBusinessAsset = () => {
    const checkboxIds = document.getElementsByName('business-assets__section-checkboxes');
    checkboxIds.forEach((id) => {
      console.log(id)
      const tableData = Tabulator.findTable(`#business-assets__section-table__${id.value}`)[0].getData()[0];
      tableData.businessAssetDescription = tinymce.get(`business-assets__section-text-${id.value}`).getContent();
      window.validate.businessAssets(tableData);
    });
  };

  const validateSupportingAsset = () => {
    const tableData = Tabulator.findTable('#supporting-assets__section-table')[0].getData();
    const desc = tinymce.get('product-architecture-diagram__text').getContent();
    window.validate.supportingAssets(tableData, desc);
  };

  const validateRisks = () => {
    let data = {
      riskName: {},
      riskLikelihood: {}
    };
    const selectedTableData = Tabulator.findTable('#risks__table')[0].getSelectedData()[0];
    if (selectedTableData){
      data.riskId = selectedTableData.riskId;
      data.riskName.threatAgentDetail = tinymce.get('risk__threatAgent__rich-text').getContent();
      data.riskName.threatVerbDetail = tinymce.get('risk__threat__rich-text').getContent();
      data.riskName.motivationDetail = tinymce.get('risk__motivation__rich-text').getContent();
      data.riskLikelihood.riskLikelihoodDetail = tinymce.get('risk__likelihood__details').getContent();
      data.riskMitigation = [];
      $('.mitigations section .top').each((index)=> {
        const mitigation = {};
        mitigation.riskMitigationId = index + 1;
        mitigation.description = tinymce.get(`security__control__desc__rich-text__${data.riskId}__${index + 1}`).getContent();
        mitigation.cost = $(`#risk__mitigation__cost__${index + 1}`).val() === '' ? null : Number($(`#risk__mitigation__cost__${index + 1}`).val());
        mitigation.decisionDetail = tinymce.get(`comment__desc__rich-text__${data.riskId}__${index + 1}`).getContent();
        data.riskMitigation.push(mitigation);
      });
      data.riskManagementDetail = tinymce.get('risk__management__detail__rich-text').getContent();
      window.validate.risks(data);
    }
  };

  const validateVulnerabilities = () => {
    let data = {};
    const selectedTableData = Tabulator.findTable('#vulnerabilties__table')[0].getSelectedData()[0];
    console.log(selectedTableData)
    if (selectedTableData){
      data.vulnerabilityId = selectedTableData.vulnerabilityId;
      data.vulnerabilityTrackingID = $('input[name="vulnerability__trackingID"]').val();
      data.vulnerabilityDescription = tinymce.get('vulnerability__details').getContent();
      data.vulnerabilityCVE = $('input[name="vulnerability__CVE"]').val();
      data.vulnerabilityFamily = $('select[name="vulnerability__family"]').val();
      window.validate.vulnerabilities(data);
    }
  };

  switch (tab) {
    case 'welcome':
      validateWelcome();
      break;
    case 'project-context':
      validateProjectContext();
      break;
    case 'business-assets':
      validateBusinessAsset();
      break;
    case 'supporting-assets':
      validateSupportingAsset();
      break;
    case 'risks':
      validateRisks();
      break;
    case 'vulnerabilities':
      validateVulnerabilities();
      break;
    default:
      break;
  }
};

/**
 * get & validate data of current tab
 */
window.validate.allTabs((event, labelSelected) => {
  const currentActiveTab = document.getElementsByClassName('tab-button active')[0].getAttribute('data-id');
  validateTabs(currentActiveTab);
  event.sender.send('validate:allTabs', labelSelected);
});

/**
 * validate for errors in each tab
 */
// window.project.validationErrors((event) => {
//   let state = sessionStorage.getItem('validate-isra-meta-organization') === 'true';
//   // && sessionStorage.getItem('validate-supporting-asset') === 'true';
//  // $('#supporting-asset-business-assets__table td').css('color') === 'rgb(0, 0, 0)';

//   // return boolean
//   event.sender.send('project:validationErrors', state);
// });

/**
 * validate previously viewed tab
 */
tabs.onclick = (e) => {
  const { id } = e.target.dataset;
  if(id){
    const previousActiveTab = document.getElementsByClassName('tab-button active')[0].getAttribute('data-id');
    validateTabs(previousActiveTab);
  }

  switch (id) {
    case 'welcome':
      location.href = '../Welcome/welcome.html';
      break;
    case 'project-context':
      location.href = '../Project Context/project-context.html';
      break;
    case 'business-assets':
      location.href = '../Business Assets/business-assets.html';
      break;
    case 'supporting-assets':
      location.href = '../Supporting Assets/supporting-assets.html';
      break;
    case 'risks':
      location.href = '../Risks/risks.html';
      break;
    case 'vulnerabilities':
      location.href = '../Vulnerabilities/vulnerabilities.html';
      break;
    case 'isra-report':
      location.href = '../Report/report.html';
      break;
    default:
      break;
  }
};

// check if user is connected to internet
// if (!navigator.onLine)

// document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
//   const isDarkMode = await window.darkMode.toggle();
//   document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light';
// });

// document.getElementById('reset-to-system').addEventListener('click', async () => {
//   await window.darkMode.system();
//   document.getElementById('theme-source').innerHTML = 'System';
// });

// Form Data api
// const formElement = document.forms[0];
// const data = new FormData(formElement);
// return Array.from(data.keys()).reduce((result, key) => {
//   const element = result;
//   element[key] = data.get(key);
//   return result;
// }, {})
