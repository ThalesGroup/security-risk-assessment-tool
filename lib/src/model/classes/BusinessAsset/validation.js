const jsonSchema = require('../../schema/json-schema');

const businessAssetType = jsonSchema.properties.BusinessAsset.items.properties
  .businessAssetType.enum;
const businessAssetProperties = jsonSchema.properties.BusinessAsset.items.properties
  .businessAssetProperties.properties.businessAssetConfidentiality.anyOf;

const isBusinessAssetType = (string) => businessAssetType
  .some((element) => string === element);

const isBusinessAssetProperties = (string) => businessAssetProperties
  .some((element) => string === element.const);

module.exports = { isBusinessAssetType, isBusinessAssetProperties };
