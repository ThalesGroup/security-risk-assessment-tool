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
