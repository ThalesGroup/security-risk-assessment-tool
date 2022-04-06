const xml = require('fs').readFileSync('./lib/test/test-5/test-5.xml', 'utf8');
const parser = require('../../src/api/xml-json/parser');

describe('XML is not well-formed', () => {
  test('xml not well-formed', () => {
    expect(() => {
      parser(xml);
    }).toThrowError(/XML not well formed at/);
  });
});
