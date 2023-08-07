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

/** validate risk id in Risk
    * @param {integer|null} val value intended to be populated into
    * securityAssumptions class property
    * @returns {boolean}
  */
const isRiskId = (val) => {
  const subSchema = jsonSchemaRisk.riskId;
  return validateClassProperties(val, subSchema);
};

/** validate all attack paths name (AND/OR) in Risk
    * @param {string} val value intended to be populated into
    * allAttackPathsName class property
    * @returns {boolean}
  */
const isAllAttackPathsName = (val) => {
  const subSchema = jsonSchemaRisk.allAttackPathsName;
  return validateClassProperties(val, subSchema);
};

/** validate all attack paths score (average of attack path scores) in Risk
    * @param {number} val value intended to be populated into
    * allAttackPathsScore class property
    * @returns {boolean}
  */
const isAllAttackPathsScore = (val) => {
  const subSchema = jsonSchemaRisk.allAttackPathsScore;
  return validateClassProperties(val, subSchema);
};

/** validate inherent risk score in Risk
    * @param {integer} val value intended to be populated into
    * inherentRiskScore class property
    * @returns {boolean}
  */
const isInherentRiskScore = (val) => {
  const subSchema = jsonSchemaRisk.inherentRiskScore;
  return validateClassProperties(val, subSchema);
};

/** validate mitigated risk score in Risk
    * @param {integer} val value intended to be populated into
    * mitigatedRiskScore class property
    * @returns {boolean}
  */
const isMitigatedRiskScore = (val) => {
  const subSchema = jsonSchemaRisk.mitigatedRiskScore;
  return validateClassProperties(val, subSchema);
};

/** validate risk management decision in Risk
    * @param {string} val value intended to be populated into
    * riskManagementDecision class property
    * @returns {boolean}
  */
const isRiskManagementDecision = (val) => {
  const subSchema = jsonSchemaRisk.riskManagementDecision;
  return validateClassProperties(val, subSchema);
};

/** validate risk management detail in Risk
    * @param {string} val value intended to be populated into
    * riskManagementDetail class property
    * @returns {boolean}
  */
const isRiskManagementDetail = (val) => {
  const subSchema = jsonSchemaRisk.riskManagementDetail;
  return validateClassProperties(val, subSchema);
};

/** validate residual risk score in Risk
    * @param {integer|null} val value intended to be populated into
    * residualRiskScore class property
    * @returns {boolean}
  */
const isResidualRiskScore = (val) => {
  const subSchema = jsonSchemaRisk.residualRiskScore;
  return validateClassProperties(val, subSchema);
};

/** validate residual risk level in Risk
    * @param {string} val value intended to be populated into
    * residualRiskLevel class property
    * @returns {boolean}
  */
const isResidualRiskLevel = (val) => {
  const subSchema = jsonSchemaRisk.residualRiskLevel;
  return validateClassProperties(val, subSchema);
};

/** validate residual name in RiskName
    * @param {string} val value intended to be populated into
    * riskName class property
    * @returns {boolean}
  */
const isRiskName = (val) => {
  const subSchema = jsonSchemaRisk.riskName;
  return validateClassProperties(val, subSchema);
};

/** validate threat agent in RiskName
    * @param {string} val value intended to be populated into
    * threatAgent class property
    * @returns {boolean}
  */
const isThreatAgent = (val) => {
  const subSchema = jsonSchemaRisk.threatAgent;
  return validateClassProperties(val, subSchema);
};

/** validate threat agent detail in RiskName
    * @param {string} val value intended to be populated into
    * threatAgentDetail class property
    * @returns {boolean}
  */
const isThreatAgentDetail = (val) => {
  const subSchema = jsonSchemaRisk.threatAgentDetail;
  return validateClassProperties(val, subSchema);
};

/** validate threat verb in RiskName
    * @param {string} val value intended to be populated into
    * threatVerb class property
    * @returns {boolean}
  */
const isThreatVerb = (val) => {
  const subSchema = jsonSchemaRisk.threatVerb;
  return validateClassProperties(val, subSchema);
};

/** validate threat verb detail in RiskName
    * @param {string} val value intended to be populated into
    * threatVerbDetail class property
    * @returns {boolean}
  */
const isThreatVerbDetail = (val) => {
  const subSchema = jsonSchemaRisk.threatVerbDetail;
  return validateClassProperties(val, subSchema);
};

/** validate motivation in RiskName
    * @param {string} val value intended to be populated into
    * motivation class property
    * @returns {boolean}
  */
const isMotivation = (val) => {
  const subSchema = jsonSchemaRisk.motivation;
  return validateClassProperties(val, subSchema);
};

/** validate motivation detail in RiskName
    * @param {string} val value intended to be populated into
    * motivationDetail class property
    * @returns {boolean}
  */
const isMotivationDetail = (val) => {
  const subSchema = jsonSchemaRisk.motivationDetail;
  return validateClassProperties(val, subSchema);
};

/** validate risk likelihood in RiskLikelihood
    * @param {integer|null} val value intended to be populated into
    * riskLikelihood class property
    * @returns {boolean}
  */
const isRiskLikelihood = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.riskLikelihood;
  return validateClassProperties(val, subSchema);
};

/** validate risk likelihood detail in RiskLikelihood
    * @param {string} val value intended to be populated into
    * riskLikelihoodDetail class property
    * @returns {boolean}
  */
const isRiskLikelihoodDetail = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.riskLikelihoodDetail;
  return validateClassProperties(val, subSchema);
};

/** validate skill level in RiskLikelihood
    * @param {integer|null} val value intended to be populated into
    * skillLevel class property
    * @returns {boolean}
  */
const isSkillLevel = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.skillLevel;
  return validateClassProperties(val, subSchema);
};

/** validate reward in RiskLikelihood
    * @param {integer|null} val value intended to be populated into
    * reward class property
    * @returns {boolean}
  */
const isReward = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.reward;
  return validateClassProperties(val, subSchema);
};

/** validate access resources in RiskLikelihood
    * @param {integer|null} val value intended to be populated into
    * accessResources class property
    * @returns {boolean}
  */
const isAccessResources = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.accessResources;
  return validateClassProperties(val, subSchema);
};

/** validate size in RiskLikelihood
    * @param {integer|null} val value intended to be populated into
    * size class property
    * @returns {boolean}
  */
const isSize = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.size;
  return validateClassProperties(val, subSchema);
};

/** validate intrusion detection in RiskLikelihood
    * @param {integer|null} val value intended to be populated into
    * intrusionDetection class property
    * @returns {boolean}
  */
const isIntrusionDetection = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.intrusionDetection;
  return validateClassProperties(val, subSchema);
};

/** validate threat factor score in RiskLikelihood
    * @param {number|null} val value intended to be populated into
    * threatFactorScore class property
    * @returns {boolean}
  */
const isThreatFactorScore = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.threatFactorScore;
  return validateClassProperties(val, subSchema);
};

/** validate threat factor level in RiskLikelihood
    * @param {string} val value intended to be populated into
    * threatFactorLevel class property
    * @returns {boolean}
  */
const isThreatFactorLevel = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.threatFactorLevel;
  return validateClassProperties(val, subSchema);
};

/** validate occurrence in RiskLikelihood
    * @param {integer|null} val value intended to be populated into
    * occurrence class property
    * @returns {boolean}
  */
const isOccurrence = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.occurrence;
  return validateClassProperties(val, subSchema);
};

/** validate occurrence level in RiskLikelihood
    * @param {string} val value intended to be populated into
    * occurrenceLevel class property
    * @returns {boolean}
  */
const isOccurrenceLevel = (val) => {
  const subSchema = jsonSchemaRiskLikelihood.occurrenceLevel;
  return validateClassProperties(val, subSchema);
};

/** validate risk impact level in RiskImpact
    * @param {integer|null} val value intended to be populated into
    * riskImpact class property
    * @returns {boolean}
  */
const isRiskImpact = (val) => {
  const subSchema = jsonSchemaRiskImpact.riskImpact;
  return validateClassProperties(val, subSchema);
};

/** validate business asset flag(s) in RiskImpact
    * @param {integer|null} val value intended to be populated into
    * businessAssetConfidentialityFlag/
    * businessAssetIntegrityFlag/
    * businessAssetAvailabilityFlag/
    * businessAssetAuthenticityFlag/
    * businessAssetAuthorizationFlag/
    * businessAssetNonRepudiationFlag
    * class property
    * @returns {boolean}
  */
const isBusinessAssetFlag = (val) => {
  const subSchema = jsonSchemaRiskImpact.businessAssetConfidentialityFlag;
  return validateClassProperties(val, subSchema);
};

/** validate risk mitigation id in RiskMitigation
    * @param {integer|null} val value intended to be populated into
    * riskMitigationId class property
    * @returns {boolean}
  */
const isRiskMitigationId = (val) => {
  const subSchema = jsonSchemaRiskMitigation.riskMitigationId;
  return validateClassProperties(val, subSchema);
};

/** validate description in RiskMitigation
    * @param {string} val value intended to be populated into
    * description class property
    * @returns {boolean}
  */
const isDescription = (val) => {
  const subSchema = jsonSchemaRiskMitigation.description;
  return validateClassProperties(val, subSchema);
};

/** validate benefits in RiskMitigation
    * @param {number|null} val value intended to be populated into
    * benefits class property
    * @returns {boolean}
  */
const isBenefits = (val) => {
  const subSchema = jsonSchemaRiskMitigation.benefits;
  return validateClassProperties(val, subSchema);
};

/** validate cost in RiskMitigation
    * @param {integer|null} val value intended to be populated into
    * cost class property
    * @returns {boolean}
  */
const isCost = (val) => {
  const subSchema = jsonSchemaRiskMitigation.cost;
  return validateClassProperties(val, subSchema);
};

/** validate decision in RiskMitigation
    * @param {string} val value intended to be populated into
    * decision class property
    * @returns {boolean}
  */
const isDecision = (val) => {
  const subSchema = jsonSchemaRiskMitigation.decision;
  return validateClassProperties(val, subSchema);
};

/** validate decision detial in RiskMitigation
    * @param {string} val value intended to be populated into
    * decisionDetail class property
    * @returns {boolean}
  */
const isDecisionDetail = (val) => {
  const subSchema = jsonSchemaRiskMitigation.decisionDetail;
  return validateClassProperties(val, subSchema);
};

/** validate mitigations benefits in RiskMitigation
    * @param {number|null} val value intended to be populated into
    * mitigationsBenefits class property
    * @returns {boolean}
  */
const isMitigationsBenefits = (val) => {
  const subSchema = jsonSchemaRisk.mitigationsBenefits;
  return validateClassProperties(val, subSchema);
};

/** validate mitigations done benefits in RiskMitigation
    * @param {number|null} val value intended to be populated into
    * mitigationsDoneBenefits class property
    * @returns {boolean}
  */
const isMitigationsDoneBenefits = (val) => {
  const subSchema = jsonSchemaRisk.mitigationsDoneBenefits;
  return validateClassProperties(val, subSchema);
};

/** validate risk attack path id in RiskAttackPath
    * @param {integer|null} val value intended to be populated into
    * riskAttackPathId class property
    * @returns {boolean}
  */
const isRiskAttackPathId = (val) => {
  const subSchema = jsonSchemaRiskAttackPath.riskAttackPathId;
  return validateClassProperties(val, subSchema);
};

/** validate attack path name in RiskAttackPath
    * @param {string} val value intended to be populated into
    * attackPathName class property
    * @returns {boolean}
  */
const isAttackPathName = (val) => {
  const subSchema = jsonSchemaRiskAttackPath.attackPathName;
  return validateClassProperties(val, subSchema);
};

/** validate vulnerabilityRef in RiskAttackPath
    * @param {object} val value intended to be populated into
    * vulnerabilityRef class property
    * @returns {boolean}
  */
const isVulnerabilityRef = (val) => {
  const subSchema = jsonSchemaRiskAttackPath.vulnerabilityRef.items;
  return validateClassProperties(val, subSchema);
};

/** validate attack path score in RiskAttackPath
    * @param {number|null} val value intended to be populated into
    * attackPathScore class property
    * @returns {boolean}
  */
const isAttackPathScore = (val) => {
  const subSchema = jsonSchemaRiskAttackPath.attackPathScore;
  return validateClassProperties(val, subSchema);
};

const isRowId = (val) => {
  const subSchema = jsonSchemaRiskAttackPath.vulnerabilityRef.items.properties.rowId;
  return validateClassProperties(val, subSchema);
}

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
  isRowId
};
