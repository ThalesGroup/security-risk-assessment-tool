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
  const result = await window.project.new();
  if (result !== 'Failed to initialise new project') console.log(JSON.parse(result));
})();

document.getElementById('load-json').addEventListener('change', async (event) => {
  if (event.target.files.length === 1) {
    const filePath = event.target.files[0].path;
    const result = await window.project.load(filePath);
    if (result === 'Invalid JSON File') alert(result);
    else console.log(JSON.parse(result));
  }
});

document.getElementById('load-xml').addEventListener('change', async (event) => {
  if (event.target.files.length === 1) {
    const filePath = event.target.files[0].path;
    const result = await window.parse.xml(filePath);
    if (result === 'Invalid XML File') alert(result);
    else console.log(JSON.parse(result));
  }
});

document.getElementById('save').addEventListener('click', async () => {
  const msg = await window.project.save();
  alert(msg);
});

// document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
//   const isDarkMode = await window.darkMode.toggle();
//   document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light';
// });

// document.getElementById('reset-to-system').addEventListener('click', async () => {
//   await window.darkMode.system();
//   document.getElementById('theme-source').innerHTML = 'System';
// });

// check if user is connected to internet
// if (!navigator.onLine)
