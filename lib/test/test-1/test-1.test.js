// npm test -- -u -p="test-2"
// npm test lib/test/test-2.test -- -u -p="test-2"
// pass arguments e.g. (--arg1, --arg2, value1, value2)
process.argv.push('--path', 'test-1');
const args = require('minimist')(process.argv.slice(2));

const xmlName = args.path;
const xml = require('fs').readFileSync(`./lib/test/test-1/${xmlName}.xml`, 'utf8');
const parser = require('../../src/api/xml-json/parser');

const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');

describe('Parse XML and Populate Classes', () => {
  const israProject = parser(xml);
  test('get israProject', () => {
    expect(israProject instanceof ISRAProject).toBe(true);
  });

  test('get projectName', () => {
    expect(israProject.properties.ISRAmeta.projectName).toBe('');
  });
});
