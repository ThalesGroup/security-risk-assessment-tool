/*
* ----------------------------------------------------------------------------
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

// const fs = require('fs');
const { parseString } = require('xml2js');
const alterISRA = require('./alter-isra/alter-isra');
const validateJsonSchema = require('./validate-json-schema');
const populateClass = require('./populate-class');

/**
  * Parses imported ISRA XML into JSON using xml2js, validate JSON against
  * schema using ajv, and populates class attributes
  * @module XML2JSON
*/

/**
  * Parses imported ISRA XML into JSON using xml2js, validate JSON against
  * schema using ajv, and populates class attributes
  * @function parser
  * @param {string} xml - content of xml file
  * @return {object} ISRA Project JSON
  * @throws if result is undefined: XML not well formed at (position of xml element)
  * @throws if result is null/ result.ISRA is undefined: Invalid ISRA XML
  * @example
  * const xml = require('fs').readFileSync('path-to-xml-file');
  * const israProject = parser(xml);
*/

const parser = (xml) => ((xmlCopy) => {
  const xmlData = xmlCopy.replace(/xsi:nil="true"/g, '');

  /** to fix spelling errors
   * @function editName
   * @param {string} name - name of xml element
   * @returns {string} edited xml name
   * */
  const editName = (name) => {
    let tagname = name;
    tagname = tagname.match('ISRA_tracking') ? tagname.replace('_', '') : tagname;
    tagname = tagname.match('accessRessources') ? tagname.replace('accessRessources', 'accessResources') : tagname;
    tagname = tagname.match('intrusionDection') ? tagname.replace('intrusionDection', 'intrusionDetection') : tagname;
    tagname = tagname.match('riskManagmentDetail') ? tagname.replace('riskManagmentDetail', 'riskManagementDetail') : tagname;
    tagname = tagname.match('occurence') ? tagname.replace('occurence', 'occurrence') : tagname;
    return tagname;
  };

  /** to remove namespace
   * @function removeNameSpacePreifx
   * @param {string} name - name of xml element
   * @returns {string} edited xml name
   * */
  const removeNameSpacePreifx = (name) => {
    let attrname = name;
    const tags = attrname.split(':');

    if (tags.length === 2) attrname = tags.pop();
    return attrname;
  };

  /** to remove NaN value of xml element
   * @function removeNaN
   * @param {string} value - value of xml element
   * @returns {string} edited xml value
   * */
  const removeNaN = (value) => {
    if (value === 'NaN') return '';
    return value;
  };

  let israProject = {};

  /** parse xml content to JSON
   * @function parseString
   * @param {string} xmlData - content of xml file
   * @param {object} processors - parser options
   * @param {function} function - processed data
   * */
  parseString(
    xmlData,
    {
      tagNameProcessors: [editName, removeNameSpacePreifx],
      attrNameProcessors: [removeNameSpacePreifx],
      valueProcessors: [removeNaN],
      attrValueProcessors: [removeNaN],
      charkey: 'char',
    },
    (xmlErr, result) => {
      if (result === undefined) throw new Error(`XML not well formed at \nXML ${xmlErr}`);
      else if (result === null || result.ISRA === undefined) throw new Error('Invalid ISRA XML');
      else {
        const israJSONData = alterISRA(result.ISRA, xmlData);
        // console.log(israJSONData.ISRAmeta.templateVersion[0]);

        const israValidJSONData = validateJsonSchema(israJSONData);

        israProject = populateClass(israValidJSONData).getISRAProject();

        // const data = JSON.stringify(israProject.properties, null, 4);
        // fs.writeFile('ISRAdata.json', data, (err) => {
        //   if (err) throw err;
        // });
      }
    },
  );

  return israProject;
})(xml);

module.exports = parser;
