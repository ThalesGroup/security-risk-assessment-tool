const parser = require('./parser');
const alterISRA = require('./alter-isra/alter-isra');
const validateJsonSchema = require('./validate-json-schema');
const populateClass = require('./populate-class');
// eslint-disable-next-line no-unused-vars
const ISRAProject = require('../../model/classes/ISRAProject/isra-project');

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
  const israValidJSONData = validateJsonSchema(israJSONData);
  populateClass(israValidJSONData, israProject);
};

module.exports = XML2JSON;

// console.log(israJSONData.ISRAmeta.templateVersion[0]);

// const data = JSON.stringify(israProject.properties, null, 4);
// fs.writeFile('ISRAdata.json', data, (err) => {
//   if (err) throw err;
// });
