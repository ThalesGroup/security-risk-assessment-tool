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

const prompt = require('electron-prompt');
const { dialog, BrowserWindow } = require('electron');
const { URLpattern } = require('../schema/validation-pattern/validation-pattern');

/**
  * Convert map to array for toJSON() in ISRAProject
  * @param {map} map selected map
*/
const map2Array = (map) => {
  const arr = [];
  map.forEach((e) => {
    arr.push(e.properties);
  });
  return arr;
};

let urlValue = 'http://www.contoso.com/';
const electronPrompt = () => prompt({
  title: 'Insert hyperlink',
  label: 'Address:',
  value: urlValue,
  type: 'input',
});

/**
  * Initialise user prompt for hyperlink
*/
const urlPrompt = async () => {
  let url = await electronPrompt();

  while (url !== null && !url.match(URLpattern)) {
    dialog.showMessageBoxSync(null, { type: 'error', title: 'Invalid URL', message: 'The address is not valid. Enter an address that begins with http://, https://, ftp://, mailto:, or another valid protocol.' });
    // eslint-disable-next-line no-await-in-loop
    url = await electronPrompt();
  }

  if (url === null) return 'cancelled';
  urlValue = url;
  return url;
};

/**
  * Open url in new window
  * @param {string} url
  * @param {boolean} userStatus offline (false) / online (true)
*/
const openUrl = (url, userStatus) => {
  if (userStatus) {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
    });
    win.loadURL(url);
  } else dialog.showMessageBoxSync(null, { type: 'info', title: 'User Status', message: 'You are offline' });
};

module.exports = {
  map2Array,
  urlPrompt,
  openUrl
};
