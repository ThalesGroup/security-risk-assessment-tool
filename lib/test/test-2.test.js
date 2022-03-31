/* eslint-disable dot-notation */
// npm test -- -u -p="test-2"
// npm test lib/test/test-2.test -- -u -p="test-2"
const args = require('minimist')(process.argv.slice(2));

console.log(args);
const xmlName = args['p'];
const xml = require('fs').readFileSync(`./lib/test/${xmlName}.xml`, 'utf8');
const parser = require('../src/api/xml-json/parser');

const ISRAProject = require('../src/model/classes/ISRAProject/isra-project');

describe('Parse XML and Populate Classes', () => {
  const israProject = parser(xml);
  test('get israProject', () => {
    expect(israProject instanceof ISRAProject).toBe(true);
  });

  test('get projectName', () => {
    expect(israProject.properties.ISRAmeta.projectName).toBe('Sample Mobile Application');
  });
});
