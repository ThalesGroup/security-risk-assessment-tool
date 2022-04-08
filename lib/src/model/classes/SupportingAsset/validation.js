const jsonSchema = require('../../schema/json-schema');

const supportingAssetType = jsonSchema.properties.SupportingAsset.items.properties
  .supportingAssetType.enum;
const supportingAssetSecurityLevel = jsonSchema.properties.SupportingAsset.items.properties
  .supportingAssetSecurityLevel.enum;

const isSupportingAssetType = (string) => supportingAssetType
  .some((element) => string === element);

const isSupportingAssetSecurityLevel = (string) => supportingAssetSecurityLevel
  .some((element) => string === element);

module.exports = { isSupportingAssetType, isSupportingAssetSecurityLevel };
