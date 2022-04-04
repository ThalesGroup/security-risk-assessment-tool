const populateClass = require('../../src/api/xml-json/populate-class');

describe('populate class values (valid & invalid)', () => {
  test('set projectName', () => {
    expect(() => {
      populateClass({
        ISRAmeta: {
          projectName: 123,
        },
      });
    }).toThrowError('Project name is not a string');
  });

  test('set projectOrganization', () => {
    expect(() => {
      populateClass({
        ISRAmeta: {
          projectName: 'Sample Web Application',
          projectOrganization: 'a',
        },
      });
    }).toThrowError('Project organization is not a string or invalid');
  });
});
