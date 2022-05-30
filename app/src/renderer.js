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
});

/**
 * Validate previous active tab in backend and populate corresponding class
 * Validates fields with no dynamic computation on current page/other pages
 * @param {String} tab name of previous active tab
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
      const tableData = Tabulator.findTable(`#business-assets__section__table__${id.value}`)[0].getData()[0];
      tableData.businessAssetDescription = tinymce.get(`business-assets__section-text-${id.value}`).getContent();
      window.validate.businessAssets(tableData);
    });
  };

  const validateSupportingAsset = () => {
    const tableData = Tabulator.findTable('#supporting-assets__section-table')[0].getData();
    const desc = tinymce.get('product-architecture-diagram__text').getContent();
    window.validate.supportingAssets(tableData, desc);
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
    default:
      break;
  }
};

/**
 * get & validate all data on tabs
 */
window.validate.allTabs((event, filePath) => {
  validateTabs('welcome');
  validateTabs('project-context');
  validateTabs('business-assets');
  validateTabs('supporting-assets');
  event.sender.send('validate:allTabs', filePath);
});

/**
 * validate for errors in each tab
 */
window.project.validationErrors((event) => {
  const state = document.getElementById('welcome__isra-meta--organization').checkValidity()
    && $('#supporting-asset-business-assets__table td').css('color') === 'rgb(0, 0, 0)';

  // return boolean
  event.sender.send('project:validationErrors', state);
});

/**
 * create tabs
 */
tabs.onclick = (e) => {
  const { id } = e.target.dataset;
  const previousActiveTab = document.getElementsByClassName('tab-button active')[0].getAttribute('data-id');

  if (id) {
    tabButton.forEach((btn) => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');

    contents.forEach((content) => {
      content.classList.remove('active');
    });
    const element = document.getElementById(id);
    element.classList.add('active');

    validateTabs(previousActiveTab);
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
// }, {});
