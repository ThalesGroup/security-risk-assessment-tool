const jsonSchema = require('../../schema/json-schema');

const threatAgent = jsonSchema.properties.Risk.items.properties
  .riskName.properties.threatAgent.enum;
const threatVerb = jsonSchema.properties.Risk.items.properties
  .riskName.properties.threatVerb.enum;
const riskLikelihood = jsonSchema.properties.Risk.items.properties
  .riskLikelihood.properties.riskLikelihood.anyOf;
const skillLevel = jsonSchema.properties.Risk.items.properties
  .riskLikelihood.properties.skillLevel.anyOf;
const reward = jsonSchema.properties.Risk.items.properties
  .riskLikelihood.properties.reward.anyOf;
const accessResources = jsonSchema.properties.Risk.items.properties
  .riskLikelihood.properties.accessResources.anyOf;
const size = jsonSchema.properties.Risk.items.properties
  .riskLikelihood.properties.size.anyOf;
const intrusionDetection = jsonSchema.properties.Risk.items.properties
  .riskLikelihood.properties.intrusionDetection.anyOf;
const threatFactorLevel = jsonSchema.properties.Risk.items.properties
  .riskLikelihood.properties.threatFactorLevel.enum;
const occurrence = jsonSchema.properties.Risk.items.properties
  .riskLikelihood.properties.occurrence.anyOf;
const occurrenceLevel = jsonSchema.properties.Risk.items.properties
  .riskLikelihood.properties.occurrenceLevel.enum;
const businessAssetFlag = jsonSchema.properties.Risk.items.properties
  .riskImpact.properties.businessAssetIntegrityFlag.enum;
const benefits = jsonSchema.properties.Risk.items.properties
  .riskMitigation.items.properties.benefits.anyOf;
const decision = jsonSchema.properties.Risk.items.properties
  .riskMitigation.items.properties.decision.anyOf;
const riskManagementDecision = jsonSchema.properties.Risk.items.properties
  .riskManagementDecision.anyOf;
const residualRiskLevel = jsonSchema.properties.Risk.items.properties
  .residualRiskLevel.enum;

const isThreatAgent = (string) => threatAgent
  .some((element) => string === element);

const isThreatVerb = (string) => threatVerb
  .some((element) => string === element);

const isRiskLikelihood = (string) => riskLikelihood
  .some((element) => string === element.const);

const isSkillLevel = (string) => skillLevel
  .some((element) => string === element.const);

const isReward = (string) => reward
  .some((element) => string === element.const);

const isAccessResources = (string) => accessResources
  .some((element) => string === element.const);

const isSize = (string) => size
  .some((element) => string === element.const);

const isIntrusionDetection = (string) => intrusionDetection
  .some((element) => string === element.const);

const isThreatFactorLevel = (string) => threatFactorLevel
  .some((element) => string === element);

const isOccurrence = (string) => occurrence
  .some((element) => string === element.const);

const isOccurrenceLevel = (string) => occurrenceLevel
  .some((element) => string === element);

const isBusinessAssetFlag = (string) => businessAssetFlag
  .some((element) => string === element);

const isBenefits = (string) => benefits
  .some((element) => string === element.const);

const isDecision = (string) => decision
  .some((element) => string === element.const);

const isRiskManagementDecision = (string) => riskManagementDecision
  .some((element) => string === element.const);

const isResidualRiskLevel = (string) => residualRiskLevel
  .some((element) => string === element);

module.exports = {
  isThreatAgent,
  isThreatVerb,
  isRiskLikelihood,
  isSkillLevel,
  isReward,
  isAccessResources,
  isSize,
  isIntrusionDetection,
  isThreatFactorLevel,
  isOccurrence,
  isOccurrenceLevel,
  isBusinessAssetFlag,
  isBenefits,
  isDecision,
  isRiskManagementDecision,
  isResidualRiskLevel,
};
