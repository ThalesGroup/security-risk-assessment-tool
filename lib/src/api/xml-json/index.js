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
  * @param {ISRAProject} israProject - current instance of israProject
  * @return {Promise}
  * @throws reject the promise in case of error
*/
const XML2JSON = (filePath, israProject) => {
  const xmlData = fs.readFileSync(filePath, 'utf8');
  const resultJSON = parser(xmlData);
  writeFile(resultJSON);
  const israJSONData = alterISRA(resultJSON.ISRA, xmlData);
  const israValidJSONData = validateJsonSchema(israJSONData);
  populateClass(israValidJSONData, israProject);
};

module.exports = XML2JSON;

// const XML2JSON = (filePath, israProject) => new Promise((resolve, reject) => {
//   let resultJSON;
//   let xmlData;

//   try {
//     xmlData = fs.readFileSync(filePath, 'utf8');
//     resultJSON = parser(xmlData);
//   } catch (err) {
//     reject(err);
//   }

//   alterISRA(resultJSON.ISRA, xmlData)
//     .then((israJSONData) => {
//       writeFile(israJSONData);
//       return validateJsonSchema(israJSONData);
//     })
//     .then((israValidJSONData) => {
//       populateClass(israValidJSONData, israProject);
//       resolve();
//     })
//     .catch((err) => reject(err));
// });
