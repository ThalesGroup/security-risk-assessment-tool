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

const tabs = document.querySelector('.wrapper');
const tabButton = document.querySelectorAll('.tab-button');
const contents = document.querySelectorAll('.content');

/**
 * create tabs
 */
tabs.onclick = (e) => {
  const { id } = e.target.dataset;
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
  }
};

/**
 * Creates a json object including fields in the form during save/save as
 */
const getFormJSON = () => {
  // getWelcomeJSON();
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
