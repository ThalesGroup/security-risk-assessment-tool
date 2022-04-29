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
// eslint-disable-next-line no-unused-vars
const ISRAProject = require('../../model/classes/ISRAProject/isra-project');
const parser = require('./parser');
const alterISRA = require('./alter-isra/alter-isra');
const validateJsonSchema = require('./validate-json-schema');
const populateClass = require('./populate-class');

/**
  * Write xml data to keep for reference
  * @function writeFile
  * @param {object} israJSONData - xml file content
*/
const writeFile = (resultJSON) => {
  fs.writeFile('lib/src/api/data-store/xmlTemplate.json', JSON.stringify(resultJSON, null, 4), (err) => {
    if (err) throw err;
  });
};

/**
  * Parses imported ISRA XML into JSON using xml2js, validate JSON against
  * schema using ajv, and populates class attributes
  * @function XML2JSON
  * @param {string} filePath - path location to uploaded file
  * @return {ISRAProject} israProject - new instance of israProject with populated values from xml
  * @throws errors from functions parser, alterISRA, validateJsonSchema & populateClass
*/
const XML2JSON = (filePath) => {
  const xmlData = fs.readFileSync(filePath, 'utf8');

  const resultJSON = parser(xmlData);

  writeFile(resultJSON);

  const israJSONData = alterISRA(resultJSON.ISRA, xmlData);

  const israValidJSONData = validateJsonSchema(israJSONData);

  const israProject = new ISRAProject();
  populateClass(israValidJSONData, israProject);
  return israProject;
};

module.exports = XML2JSON;
