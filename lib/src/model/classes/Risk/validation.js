/*----------------------------------------------------------------------------
*
*     Copyright © 2022 THALES. All Rights Reserved.
 *
* -----------------------------------------------------------------------------
* THALES MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF
* THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE, OR NON-INFRINGEMENT. THALES SHALL NOT BE
 * LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING,
 * MODIFYING OR DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
*
* THIS SOFTWARE IS NOT DESIGNED OR INTENDED FOR USE OR RESALE AS ON-LINE
* CONTROL EQUIPMENT IN HAZARDOUS ENVIRONMENTS REQUIRING FAIL-SAFE
* PERFORMANCE, SUCH AS IN THE OPERATION OF NUCLEAR FACILITIES, AIRCRAFT
* NAVIGATION OR COMMUNICATION SYSTEMS, AIR TRAFFIC CONTROL, DIRECT LIFE
* SUPPORT MACHINES, OR WEAPONS SYSTEMS, IN WHICH THE FAILURE OF THE
* SOFTWARE COULD LEAD DIRECTLY TO DEATH, PERSONAL INJURY, OR SEVERE
* PHYSICAL OR ENVIRONMENTAL DAMAGE ("HIGH RISK ACTIVITIES"). THALES
* SPECIFICALLY DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTY OF FITNESS FOR
* HIGH RISK ACTIVITIES.
* -----------------------------------------------------------------------------
*/

const jsonSchemaRisk = require('../../schema/json-schema').properties.Risk.items.properties;
const validateClassProperties = require('../validation/validate-class-properties');

const jsonSchemaRiskName = jsonSchemaRisk.riskName.properties;
const jsonSchemaRiskLikelihood = jsonSchemaRisk.riskLikelihood.properties;
const jsonSchemaRiskImpact = jsonSchemaRisk.riskImpact.properties;
const jsonSchemaRiskAttackPath = jsonSchemaRisk.riskAttackPaths.items.properties;
const jsonSchemaRiskMitigation = jsonSchemaRisk.riskMitigation.items.properties;

const isRiskId = (val) => {
  const subSchema = jsonSchemaRisk.riskId;
  return validateClassProperties(val, subSchema);
};

const isAllAttackPathsName = (val) => {
  const subSchema = jsonSchemaRisk.allAttackPathsName;
  return validateClassProperties(val, subSchema);
};

const isAllAttackPathsScore = (val) => {
  const subSchema = jsonSchemaRisk.allAttackPathsScore;
  return validateClassProperties(val, subSchema);
};

const isInherentRiskScore = (val) => {
  const subSchema = jsonSchemaRisk.inherentRiskScore;
  return validateClassProperties(val, subSchema);
};

const isMitigatedRiskScore = (val) => {
  const subSchema = jsonSchemaRisk.mitigatedRiskScore;
  return validateClassProperties(val, subSchema);
};

const isRiskManagementDecision = (val) => {
  const subSchema = jsonSchemaRisk.riskManagementDecision;
  return validateClassProperties(val, subSchema);
};

const isRiskManagementDetail = (val) => {
  const subSchema = jsonSchemaRisk.riskManagementDetail;
  return validateClassProperties(val, subSchema);
};

const isResidualRiskScore = (val) => {
  const subSchema = jsonSchemaRisk.residualRiskScore;
  return validateClassProperties(val, subSchema);
};

const isResidualRiskLevel = (val) => {
  const subSchema = jsonSchemaRisk.residualRiskLevel;
  return validateClassProperties(val, subSchema);
};

const isRiskName = (val) => {
  const subSchema = jsonSchemaRiskName.riskName;
  return validateClassProperties(val, subSchema);
};

const isThreatAgent = (val) => {
  const subSchema = jsonSchemaRiskName.threatAgent;
  return validateClassProperties(val, subSchema);
};

const isThreatAgentDetail = (val) => {
  const subSchema = jsonSchemaRiskName.threatAgentDetail;
  return validateClassProperties(val, subSchema);
};

const isThreatVerb = (val) => {
  const subSchema = jsonSchemaRiskName.threatVerb;
  return validateClassProperties(val, subSchema);
};

const isThreatVerbDetail = (val) => {
  const subSchema = jsonSchemaRiskName.threatVerbDetail;
  return validateClassProperties(val, subSchema);
};

const isMotivation = (val) => {
  const subSchema = jsonSchemaRiskName.motivation;
  return validateClassProperties(val, subSchema);
};

const isMotivationDetail = (val) => {
  const subSchema = jsonSchemaRiskName.motivationDetail;
  return validateClassProperties(val, subSchema);
};

const isRiskLikelihood = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.riskLikelihood;
  return validateClassProperties(val, subSchema);
};

const isRiskLikelihoodDetail = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.riskLikelihoodDetail;
  return validateClassProperties(val, subSchema);
};

const isSkillLevel = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.skillLevel;
  return validateClassProperties(val, subSchema);
};

const isReward = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.reward;
  return validateClassProperties(val, subSchema);
};

const isAccessResources = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.accessResources;
  return validateClassProperties(val, subSchema);
};

const isSize = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.size;
  return validateClassProperties(val, subSchema);
};

const isIntrusionDetection = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.intrusionDetection;
  return validateClassProperties(val, subSchema);
};

const isThreatFactorScore = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.threatFactorScore;
  return validateClassProperties(val, subSchema);
};

const isThreatFactorLevel = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.threatFactorLevel;
  return validateClassProperties(val, subSchema);
};

const isOccurrence = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.occurrence;
  return validateClassProperties(val, subSchema);
};

const isOccurrenceLevel = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.occurrenceLevel;
  return validateClassProperties(val, subSchema);
};

const isRiskImpact = (val) => {
  const subSchema = jsonSchemaRiskImpact.riskImpact;
  return validateClassProperties(val, subSchema);
};

const isBusinessAssetFlag = (val) => {
  const subSchema = jsonSchemaRiskImpact.businessAssetConfidentialityFlag;
  return validateClassProperties(val, subSchema);
};

const isRiskMitigationId = (val) => {
  const subSchema = jsonSchemaRiskMitigation.riskMitigationId;
  return validateClassProperties(val, subSchema);
};

const isDescription = (val) => {
  const subSchema = jsonSchemaRiskMitigation.description;
  return validateClassProperties(val, subSchema);
};

const isBenefits = (val) => {
  const subSchema = jsonSchemaRiskMitigation.benefits;
  return validateClassProperties(val, subSchema);
};

const isCost = (val) => {
  const subSchema = jsonSchemaRiskMitigation.cost;
  return validateClassProperties(val, subSchema);
};

const isDecision = (val) => {
  const subSchema = jsonSchemaRiskMitigation.decision;
  return validateClassProperties(val, subSchema);
};

const isDecisionDetail = (val) => {
  const subSchema = jsonSchemaRiskMitigation.decisionDetail;
  return validateClassProperties(val, subSchema);
};

const isMitigationsBenefits = (val) => {
  const subSchema = jsonSchemaRiskMitigation.mitigationsBenefits;
  return validateClassProperties(val, subSchema);
};

const isMitigationsDoneBenefits = (val) => {
  const subSchema = jsonSchemaRiskMitigation.mitigationsDoneBenefits;
  return validateClassProperties(val, subSchema);
};

const isRiskAttackPathId = (val) => {
  const subSchema = jsonSchemaRiskAttackPath.riskAttackPathId;
  return validateClassProperties(val, subSchema);
};

const isAttackPathName = (val) => {
  const subSchema = jsonSchemaRiskAttackPath.attackPathName;
  return validateClassProperties(val, subSchema);
};

const isVulnerabilityRef = (val) => {
  const subSchema = jsonSchemaRiskAttackPath.vulnerabilityRef.items;
  return validateClassProperties(val, subSchema);
};

const isAttackPathScore = (val) => {
  const subSchema = jsonSchemaRiskAttackPath.attackPathScore;
  return validateClassProperties(val, subSchema);
};

module.exports = {
  isRiskId,
  isAllAttackPathsName,
  isAllAttackPathsScore,
  isInherentRiskScore,
  isMitigatedRiskScore,
  isRiskManagementDecision,
  isRiskManagementDetail,
  isResidualRiskScore,
  isResidualRiskLevel,
  isRiskName,
  isThreatAgent,
  isThreatAgentDetail,
  isThreatVerb,
  isThreatVerbDetail,
  isMotivation,
  isMotivationDetail,
  isRiskLikelihood,
  isRiskLikelihoodDetail,
  isSkillLevel,
  isReward,
  isAccessResources,
  isSize,
  isIntrusionDetection,
  isThreatFactorScore,
  isThreatFactorLevel,
  isOccurrence,
  isOccurrenceLevel,
  isRiskImpact,
  isBusinessAssetFlag,
  isRiskMitigationId,
  isDescription,
  isBenefits,
  isCost,
  isDecision,
  isDecisionDetail,
  isMitigationsBenefits,
  isMitigationsDoneBenefits,
  isRiskAttackPathId,
  isAttackPathName,
  isVulnerabilityRef,
  isAttackPathScore,
};
