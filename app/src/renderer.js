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

/* global $ Tabulator */

const tabs = document.querySelector('.wrapper');
const tabButton = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.content');

/**
 * loads ISRA Project Data (new project/xml/json)
 */
window.project.load(async (event, data) => {
  console.log(await JSON.parse(data));
});

/**
 * Intialise an instance of rich text editor textarea box
 */
window.parent.tinymce.init({
  selector: '.rich-text',
  height: 300,
  min_height: 300,
});

/**
 * Creates a json object including fields of Project Context
 * @return {Object} The form data
 */
const setProjectContext = () => {
  const { tinymce } = window.parent;
  window.validate.projectContext({
    projectDescription: tinymce.get('project-description__text').getContent(),
    securityProjectObjectives: tinymce.get('project-objectives__text').getContent(),
    securityOfficerObjectives: tinymce.get('officer-objectives__text').getContent(),
    securityAssumptions: tinymce.get('assumptions__text').getContent(),
  });
};

/**
 * Creates a json object including fields of Welcome
 * @return {Object} The form data
 */
const setWelcomeJSON = () => {
  Tabulator.findTable('#welcome__isra-meta-tracking__table')[0].getRows().forEach((row) => {
    window.welcome.updateTrackingRow(row.getData());
  });

  window.validate.welcome({
    projectName: $('#welcome__isra-meta__project-name').val(),
    projectOrganization: $('#welcome__isra-meta__organization').val(),
    projectVersion: $('#welcome__isra-meta__project-version').val(),
  });
};

/**
 * Validate previous active tab in backend and populate corresponding class
 * @param {String} tab name of previous active tab
 */
const getTabJSON = (tab) => {
  switch (tab) {
    case 'welcome':
      setWelcomeJSON();
      break;
    case 'project-context':
      setProjectContext();
      break;
    default:
      break;
  }
};

window.validate.allTabs((event, filePath) => {
  setWelcomeJSON();
  setProjectContext();
  event.sender.send('validate:allTabs', filePath);
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

    getTabJSON(previousActiveTab);
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
