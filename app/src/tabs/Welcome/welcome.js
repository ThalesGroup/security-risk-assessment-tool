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

(async () => {
  try {
    const result = await window.render.welcome();
    const welcomeForm = document.forms[0];
    welcomeForm.innerHTML += result;
  } catch (err) {
    alert('Failed to load html');
  }
})();

const appVersion = (value) => {
  const paragraph = document.getElementById('details__app-version');
  paragraph.innerText = `App Version: ${value}`;
};

const projectName = (value) => {
  $('#welcome__isra-meta__project-name').val(value);
};

const projectVersion = (value) => {
  document.getElementById('welcome__isra-meta__project-version').value = value;
};

const organization = (value) => {
  document.getElementById('welcome__isra-meta__organization').value = value;
};

const updateWelcomeFields = (fetchedData) => {
  appVersion(fetchedData.appVersion);
  projectName(fetchedData.projectName);
  projectVersion(fetchedData.projectVersion);
  organization(fetchedData.projectOrganization);
};

window.project.load((event, data) => {
  updateWelcomeFields(JSON.parse(data).ISRAmeta);
});

/**
 * Creates a json object including fields when current tab is no longer active
 * @param {HTMLElement} form The form element to convert
 * @return {Object} The form data
 */
const getWelcomeJSON = () => {
  const formElement = document.forms[0];
  const data = new FormData(formElement);
  return Array.from(data.keys()).reduce((result, key) => {
    const element = result;
    element[key] = data.get(key);
    return result;
  }, {});
};
