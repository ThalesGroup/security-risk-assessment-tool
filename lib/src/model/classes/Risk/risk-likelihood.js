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
const {
  isRiskId,
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
} = require('./validation');

const riskLikelihoodJsonSchema = require('../../schema/json-schema').properties.Risk.items.properties.riskLikelihood.properties;

/**
  * Create a RiskLikelihood with private members:
  * Likelihood evaluation section to calculate value of riskLikelihood (OWASP riskLikelihood),
  * also allows for manually selected riskLikelihood (Simple Likelihood)
  * @throws Risk id (riskIdRef): id ref is not a null/integer
  * @throws Risk (riskIdRef): risk likelihood is an invalid null/integer
  * @throws Risk (riskIdRef): risk likelihood is an invalid null/integer
  * @throws Risk (riskIdRef): risk likelihood detail is invalid html string
  * @throws Risk (riskIdRef): skill level is an invalid null/integer
  * @throws Risk (riskIdRef): reward is an invalid null/integer
  * @throws Risk (riskIdRef): access resources is an invalid null/integer
  * @throws Risk (riskIdRef): size is an invalid null/integer
  * @throws Risk (riskIdRef): intrusion detection is an invalid null/integer
  * @throws Risk (riskIdRef): threat factor score is not a null/double
  * @throws Risk (riskIdRef): threat factor level is invalid string
  * @throws Risk (riskIdRef): occurrence is an invalid null/integer
  * @throws Risk (riskIdRef): occurrence level is invalid string
*/
class RiskLikelihood {
  #riskIdRef;

  #riskLikelihood;

  #riskLikelihoodDetail;

  #skillLevel;

  #reward;

  #accessResources;

  #size;

  #intrusionDetection;

  #threatFactorScore;

  #threatFactorLevel;

  #occurrence;

  #occurrenceLevel;

  #isOWASPLikelihood;

  constructor() {
    this.#riskLikelihood = riskLikelihoodJsonSchema.riskLikelihood.default;
    this.#riskLikelihoodDetail = riskLikelihoodJsonSchema.riskLikelihoodDetail.default;
    this.#skillLevel = riskLikelihoodJsonSchema.skillLevel.default;
    this.#reward = riskLikelihoodJsonSchema.reward.default;
    this.#accessResources = riskLikelihoodJsonSchema.accessResources.default;
    this.#intrusionDetection = riskLikelihoodJsonSchema.intrusionDetection.default;
    this.#size = riskLikelihoodJsonSchema.size.default;
    this.#threatFactorScore = riskLikelihoodJsonSchema.threatFactorScore.default;
    this.#threatFactorLevel = riskLikelihoodJsonSchema.threatFactorLevel.default;
    this.#occurrence = riskLikelihoodJsonSchema.occurrence.default;
    this.#occurrenceLevel = riskLikelihoodJsonSchema.occurrenceLevel.default;
    this.#isOWASPLikelihood = riskLikelihoodJsonSchema.isOWASPLikelihood.default;
  }

  /** referenced value of riskId from Risk
    * @type {integer|null}
  */
  set riskIdRef(riskIdRef) {
    if (isRiskId(riskIdRef)) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}: id ref is not a null/integer`);
  }

  get riskIdRef() {
    return this.#riskIdRef;
  }

  /** calculated value of risk likelihood
    * @type {integer|null}
  */
  set riskLikelihood(riskLikelihood) {
    if (isRiskLikelihood(riskLikelihood)) {
      this.#riskLikelihood = riskLikelihood;
    } else throw new Error(`Risk ${this.#riskIdRef}: risk likelihood is an invalid null/integer`);
  }

  get riskLikelihood() {
    return this.#riskLikelihood;
  }

  /** text input of details of risk likelihood
    * @type {string}
  */
  set riskLikelihoodDetail(riskLikelihoodDetail) {
    if (isRiskLikelihoodDetail(riskLikelihoodDetail)) {
      this.#riskLikelihoodDetail = riskLikelihoodDetail;
    } else throw new Error(`Risk ${this.#riskIdRef}: risk likelihood detail is invalid html string`);
  }

  get riskLikelihoodDetail() {
    return this.#riskLikelihoodDetail;
  }

  /** value of skill level selected
    * @type {integer|null}
  */
  set skillLevel(skillLevel) {
    if (isSkillLevel(skillLevel)) this.#skillLevel = skillLevel;
    else throw new Error(`Risk ${this.#riskIdRef}: skill level is an invalid null/integer`);
  }

  get skillLevel() {
    return this.#skillLevel;
  }

  /** value of reward selected
    * @type {integer|null}
  */
  set reward(reward) {
    if (isReward(reward)) this.#reward = reward;
    else throw new Error(`Risk ${this.#riskIdRef}: reward is an invalid null/integer`);
  }

  get reward() {
    return this.#reward;
  }

  /** value of access resources selected
    * @type {integer|null}
  */
  set accessResources(accessResources) {
    if (isAccessResources(accessResources)) {
      this.#accessResources = accessResources;
    } else throw new Error(`Risk ${this.#riskIdRef}: access resources is an invalid null/integer`);
  }

  get accessResources() {
    return this.#accessResources;
  }

  /** value of size selected
    * @type {integer|null}
  */
  set size(size) {
    if (isSize(size)) this.#size = size;
    else throw new Error(`Risk ${this.#riskIdRef}: size is an invalid null/integer`);
  }

  get size() {
    return this.#size;
  }

  /** value of intrusion detection selected
    * @type {integer|null}
  */
  set intrusionDetection(intrusionDetection) {
    if (isIntrusionDetection(intrusionDetection)) {
      this.#intrusionDetection = intrusionDetection;
    } else throw new Error(`Risk ${this.#riskIdRef}: intrusion detection is an invalid null/integer`);
  }

  get intrusionDetection() {
    return this.#intrusionDetection;
  }

  /** calculated value of threat factor score
    * @type {number|null}
  */
  set threatFactorScore(threatFactorScore) {
    if (isThreatFactorScore(threatFactorScore)) this.#threatFactorScore = threatFactorScore;
    else throw new Error(`Risk ${this.#riskIdRef}: threat factor score is not a null/double`);
  }

  get threatFactorScore() {
    return this.#threatFactorScore;
  }

  /** value of threatFactorLevel
    * @type {string}
  */
  set threatFactorLevel(threatFactorLevel) {
    if (isThreatFactorLevel(threatFactorLevel)) this.#threatFactorLevel = threatFactorLevel;
    else throw new Error(`Risk ${this.#riskIdRef}: threat factor level is invalid string`);
  }

  get threatFactorLevel() {
    return this.#threatFactorLevel;
  }

  /** value of occurrence selected
    * @type {integer|null}
  */
  set occurrence(occurrence) {
    if (isOccurrence(occurrence)) this.#occurrence = occurrence;
    else throw new Error(`Risk ${this.#riskIdRef}: occurrence is an invalid null/integer `);
  }

  get occurrence() {
    return this.#occurrence;
  }

  /** value of occurrence level
    * @type {string}
  */
  set occurrenceLevel(occurrenceLevel) {
    if (isOccurrenceLevel(occurrenceLevel)) this.#occurrenceLevel = occurrenceLevel;
    else throw new Error(`Risk ${this.#riskIdRef}: occurrence level is invalid string`);
  }

  get occurrenceLevel() {
    return this.#occurrenceLevel;
  }

  /** verify if riskName is automatic or manual
    * @type {boolean}
  */
   set isOWASPLikelihood(boolean) {
    if (typeof boolean === 'boolean') {
      this.#isOWASPLikelihood = boolean;
    } else throw new Error(`Risk ${this.#riskIdRef}: value is not a boolean`);
  }

  get isOWASPLikelihood() {
    return this.#isOWASPLikelihood;
  }

  /** get object of each value of RiskLikelihood member property
    * @type {object}
  */
  get properties() {
    return {
      riskIdRef: this.#riskIdRef,
      riskLikelihood: this.#riskLikelihood,
      riskLikelihoodDetail: this.#riskLikelihoodDetail,
      skillLevel: this.#skillLevel,
      reward: this.#reward,
      accessResources: this.#accessResources,
      size: this.#size,
      intrusionDetection: this.#intrusionDetection,
      threatFactorScore: this.#threatFactorScore,
      threatFactorLevel: this.#threatFactorLevel,
      occurrence: this.#occurrence,
      occurrenceLevel: this.#occurrenceLevel,
      isOWASPLikelihood: this.#isOWASPLikelihood
    };
  }
}

module.exports = RiskLikelihood;
