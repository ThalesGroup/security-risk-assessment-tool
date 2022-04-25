const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const ISRAProject = require('../../model/classes/ISRAProject/isra-project');
const parser = require('./parser');
const alterISRA = require('./alter-isra/alter-isra');
const validateJsonSchema = require('./validate-json-schema');
const populateClass = require('./populate-class');

/**
  * Write data to keep to file in data-store for reference
  * @function writeFile
  * @param {object} israJSONData - xml file content
*/
const writeFile = (israJSONData) => {
  fs.writeFile('lib/src/api/data-store/templateVersion.json', israJSONData.ISRAmeta.templateVersion[0], (err) => {
    if (err) console.log(err);
  });
};

/**
  * Parses imported ISRA XML into JSON using xml2js, validate JSON against
  * schema using ajv, and populates class attributes
  * @function XML2JSON
  * @param {string} filePath - path location to uploaded file
  * @param {ISRAProject} israProject - current instance of israProject
  * @return {Promise}
  * @throws reject the promise in case of error
*/
const XML2JSON = (filePath, israProject) => {
  const xmlData = fs.readFileSync(filePath, 'utf8');
  const resultJSON = parser(xmlData);
  const israJSONData = alterISRA(resultJSON.ISRA, xmlData);
  writeFile(israJSONData);
  const israValidJSONData = validateJsonSchema(israJSONData);
  populateClass(israValidJSONData, israProject);
};

module.exports = XML2JSON;
