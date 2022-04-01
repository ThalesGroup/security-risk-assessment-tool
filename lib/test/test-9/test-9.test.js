const validateJSONSchema = require('../../src/api/xml-json/validate-json-schema');

test('validate JSON schema', () => {
  const invalidIsraJson = {};
  expect(() => {
    validateJSONSchema(invalidIsraJson);
  }).toThrowError(/Failed to validate json against schema at:/);
});
