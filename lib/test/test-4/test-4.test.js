const xml = require('fs').readFileSync('./lib/test/test-4/test-4.xml', 'utf8');
const parser = require('../../src/api/xml-json/parser');

describe('XML is empty', () => {
  test('empty xml file', () => {
    expect(() => {
      parser(xml);
    }).toThrowError('Invalid ISRA XML');
  });
});
