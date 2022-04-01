process.argv.push('--path', 'test-5');
const args = require('minimist')(process.argv.slice(2));

const xmlName = args.path;
const xml = require('fs').readFileSync(`./lib/test/test-5/${xmlName}.xml`, 'utf8');
const parser = require('../../src/api/xml-json/parser');

describe('XML is not well-formed', () => {
  test('xml not well-formed', () => {
    expect(() => {
      parser(xml);
    }).toThrowError(/XML not well formed at/);
  });
});
