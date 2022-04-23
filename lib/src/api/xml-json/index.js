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
    if (err) throw err;
  });
};

/**
  * Parses imported ISRA XML into JSON using xml2js, validate JSON against
  * schema using ajv, and populates class attributes
  * @function XML2JSON
  * @param {string} filePath - path location to uploaded file
  * @param {ISRAProject} israProject - current instance of israProject
  * @return {Promise}
*/
const XML2JSON = (filePath, israProject) => new Promise((resolve, reject) => {
  const xmlData = fs.readFileSync(filePath, 'utf8', (err) => {
    reject(err);
  });

  try {
    const resultJSON = parser(xmlData);
    const israJSONData = alterISRA(resultJSON.ISRA, xmlData);
    writeFile(israJSONData);
    const israValidJSONData = validateJsonSchema(israJSONData);
    populateClass(israValidJSONData, israProject);
    resolve();
  } catch (err) {
    reject(err);
  }
});

module.exports = XML2JSON;
