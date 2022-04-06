const xml = require('fs').readFileSync('./lib/test/test-6/test-6.xml', 'utf8');
const parser = require('../../src/api/xml-json/parser');

describe('XML is an invalid ISRA', () => {
  test('invalid ISRA xml file', () => {
    expect(() => {
      parser(xml);
    }).toThrowError('Invalid ISRA XML');
  });
});
