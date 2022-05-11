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
  const result = await window.render.welcome();
  const organization = document.getElementById('organization');
  organization.innerHTML += result;
})();

const appVersion = (value) => {
  const paragraph = document.getElementById('app-version');
  const text = document.createTextNode(value);
  paragraph.appendChild(text);
};

const projectName = (value) => {
  document.getElementById('project-name').value = value;
};

const projectVersion = (value) => {
  document.getElementById('project-version').value = value;
};

const organization = (value) => {
  document.getElementById('organization').value = value;
};

const updateFields = (fetchedData) => {
  appVersion(fetchedData.appVersion);
  projectName(fetchedData.projectName);
  projectVersion(fetchedData.projectVersion);
  organization(fetchedData.projectOrganization);
};

window.project.load((event, data) => {
  updateFields(JSON.parse(data).ISRAmeta);
});

/**
 * Creates a json object including fields when current tab is no longer active
 * @param {HTMLElement} form The form element to convert
 * @return {Object} The form data
 */
const getFormJSON = () => {
  const formElement = document.querySelector('welcome-form');
  const data = new FormData(formElement);
  return Array.from(data.keys()).reduce((result, key) => {
    const element = result;
    element[key] = data.get(key);
    return result;
  }, {});
};
