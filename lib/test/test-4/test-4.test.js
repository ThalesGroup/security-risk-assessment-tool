process.argv.push('--path', 'test-4');
const args = require('minimist')(process.argv.slice(2));

const xmlName = args.path;
const xml = require('fs').readFileSync(`./lib/test/test-4/${xmlName}.xml`, 'utf8');
const parser = require('../../src/api/xml-json/parser');

describe('XML is empty', () => {
  test('empty xml file', () => {
    expect(() => {
      parser(xml);
    }).toThrowError('Invalid ISRA XML');
  });
});
