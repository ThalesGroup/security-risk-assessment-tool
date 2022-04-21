const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const ISRAProject = require('../../model/classes/ISRAProject/isra-project');
const parser = require('./parser');
const alterISRA = require('./alter-isra/alter-isra');
const validateJsonSchema = require('./validate-json-schema');
const populateClass = require('./populate-class');

/**
  * Parses imported ISRA XML into JSON using xml2js, validate JSON against
  * schema using ajv, and populates class attributes
  * @function XML2JSON
  * @param {string} xmlData - xml file content
  * @param {ISRAProject} israProject - current instance of israProject
*/
const XML2JSON = (xmlData, israProject) => {
  const resultJSON = parser(xmlData);
  const israJSONData = alterISRA(resultJSON.ISRA, xmlData);

  fs.writeFile('lib/src/api/data-store/templateVersion.json', israJSONData.ISRAmeta.templateVersion[0], (err) => {
    if (err) throw err;
  });

  const israValidJSONData = validateJsonSchema(israJSONData);
  populateClass(israValidJSONData, israProject);
};

module.exports = XML2JSON;
