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

const fs = require('fs');
const prompt = require('electron-prompt');
const path = require('path');
const { dialog, BrowserWindow } = require('electron');
const { URLpattern } = require('../../../../lib/src/model/schema/validation-pattern/validation-pattern');
const ISRAProject = require('../../../../lib/src/model/classes/ISRAProject/isra-project');

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

/**
  * Attach and encode file to base64 string
*/
const attachFile = () => {
  const options = {
    title: 'Insert file - Electron ISRA Project',
    buttonLabel: 'Insert File',
  };
  const filePathArr = dialog.showOpenDialogSync(options);

  if (filePathArr !== undefined) {
    const filePath = filePathArr[0];
    const fileName = path.basename(filePath);

    // TO-DO
    // encode
    const data = fs.readFileSync(filePath);
    const buff = Buffer.from(data);
    const base64data = buff.toString('base64');

    return [fileName, base64data];
  }
  return ['', ''];
};

/**
  * remove file
*/
const removeFile = () => ['Click here to attach a file', ''];

/**
  * Save as file attached
  * @param {string} base64 base64 string of content from file
*/
const saveAsFile = async (base64data, projectContextFileName) => {
  const options = {
    title: 'Save as file - Electron ISRA Project',
    defaultPath: `${projectContextFileName}`,
    buttonLabel: 'Save as file',
  };
  const fileName = await dialog.showSaveDialog(options);
  if (!fileName.canceled) {
    try {
      // convert base64 string to buffer (raw data)
      const data = Buffer.from(base64data, 'base64');

      fs.writeFileSync(fileName.filePath, data, (err) => {
        if (err) throw new Error('Failed to save as file');
      });
      dialog.showMessageBoxSync(null, { message: `Successfully saved file to ${fileName.filePath}` });
    } catch (err) {
      console.log(err);
      dialog.showMessageBoxSync(null, { message: `Error in saving file to ${fileName.filePath}` });
    }
  }
};

/**
  * (InfoPath) Decode file attachments
  * @param {string} base64 base64 string of content from file attached in infopath
*/
const decodeFile = (base64) => {
  if (base64 !== '') {
    const buffer = Buffer.from(base64, 'base64');
    const fileName = buffer.toString('utf16le', 24).match(/.*(json|png|docx|doc|jpg|jpeg|pdf|xml|csv|xlsx|ppt)/)[0];
    const fileNameLength = buffer.readUInt32LE(20);
    const binary = buffer.slice(24 + fileNameLength * 2);
    const base64data = binary.toString('base64');

    return [fileName, base64data];
  }
  return ['Click here to attach a file', base64];
};

/**
  * validate & populate data from Project Context tab
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Array} data
*/
const validateProjectContext = (israProject, data) => {
  try {
    const object = {
      projectDescription: data[0],
      securityProjectObjectives: data[1],
      securityOfficerObjectives: data[2],
      securityAssumptions: data[3],
    };
    Object.assign(israProject.israProjectContext, object);
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: 'Failed to validate Project Context tab' });
  }
};

module.exports = {
  urlPrompt,
  openUrl,
  attachFile,
  removeFile,
  saveAsFile,
  decodeFile,
  validateProjectContext,
};
