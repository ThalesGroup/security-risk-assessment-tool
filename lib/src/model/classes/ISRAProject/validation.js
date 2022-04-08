const jsonSchema = require('../../schema/json-schema');

const projectOrganization = jsonSchema.properties.ISRAmeta.properties.projectOrganization.anyOf;

const isValidProjectOrganization = (string) => projectOrganization
  .some((element) => string === element.const);

module.exports = { isValidProjectOrganization };
