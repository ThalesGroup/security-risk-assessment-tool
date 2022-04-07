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
// const xml1 = require('fs').readFileSync('./lib/test/test-7/test-7.xml', 'utf8');
const { parseString } = require('xml2js');
const alterISRA = require('./alter-isra/alter-isra');
const validateJsonSchema = require('./validate-json-schema');
const populateClass = require('./populate-class');

// function to parse xml
const parser = (xml) => ((xmlCopy) => {
  const xmlData = xmlCopy.replace(/xsi:nil="true"/g, '');

  // fix spelling errors
  const editName = (name) => {
    let tagname = name;
    tagname = tagname.match('ISRA_tracking') ? tagname.replace('_', '') : tagname;
    tagname = tagname.match('accessRessources') ? tagname.replace('accessRessources', 'accessResources') : tagname;
    tagname = tagname.match('intrusionDection') ? tagname.replace('intrusionDection', 'intrusionDetection') : tagname;
    tagname = tagname.match('riskManagmentDetail') ? tagname.replace('riskManagmentDetail', 'riskManagementDetail') : tagname;
    tagname = tagname.match('occurence') ? tagname.replace('occurence', 'occurrence') : tagname;
    tagname = tagname.match('occurenceLevel') ? tagname.replace('occurenceLevel', 'occurrenceLevel') : tagname;
    return tagname;
  };

  const removeNameSpacePreifx = (name) => {
    let attrname = name;
    const tags = attrname.split(':');
    const prefix = attrname.charAt(0) === '/' ? '/' : '';

    if (tags.length === 2) attrname = prefix + tags[1];
    return attrname;
  };

  const removeNaN = (value) => {
    if (value === 'NaN') return '';
    return value;
  };

  let israProject = {};
  parseString(
    xmlData,
    {
      // parser options
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
        // alter xml data to fit schema
        const israJSONData = alterISRA(result.ISRA, xmlData);
        const israValidJSONData = validateJsonSchema(israJSONData);
        israProject = populateClass(israValidJSONData).getISRAProject();
      }
    },
  );

  return israProject;
})(xml);

// parser(xml1);

module.exports = parser;
