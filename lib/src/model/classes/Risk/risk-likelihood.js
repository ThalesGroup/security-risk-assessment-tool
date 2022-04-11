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
  isRiskLikelihood,
  isSkillLevel,
  isReward,
  isAccessResources,
  isSize,
  isIntrusionDetection,
  isThreatFactorLevel,
  isOccurrence,
  isOccurrenceLevel,
} = require('./validation');
const { isValidHtml } = require('../../schema/validation-pattern/validation');

/* Likelihood evaluation section to calculate value of riskLikelihood (OWASP riskLikelihood).
Also allows for manually selected riskLikelihood (Simple Likelihood) */
module.exports = class RiskLikelihood {
  // referenced value of riskId from Risk
  #riskIdRef;

  // calculated value of risk likelihood
  #riskLikelihood;

  // text input of details of risk likelihood
  #riskLikelihoodDetail;

  // value of skill level selected
  #skillLevel;

  // value of reward selected
  #reward;

  // value of access resources selected
  #accessResources;

  // value of size selected
  #size;

  // value of intrusion detection selected
  #intrusionDetection;

  // calculated value of threat factor score
  #threatFactorScore;

  // value of threat level score
  #threatFactorLevel;

  // value of occurrence selected
  #occurrence;

  // value of occurrence selected
  #occurrenceLevel;

  set riskIdRef(riskIdRef) {
    if ((Number.isSafeInteger(riskIdRef)
    && riskIdRef > 0)
    || riskIdRef === null) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}:Risk id ref is not an integer`);
  }

  set riskLikelihood(riskLikelihood) {
    if (isRiskLikelihood(riskLikelihood)) {
      this.#riskLikelihood = riskLikelihood;
    } else throw new Error(`Risk ${this.#riskIdRef}: risk likelihood is an invalid null/integer`);
  }

  set riskLikelihoodDetail(riskLikelihoodDetail) {
    if (isValidHtml(riskLikelihoodDetail)) this.#riskLikelihoodDetail = riskLikelihoodDetail;
    else throw new Error(`Risk ${this.#riskIdRef}: risk likelihood detail is invalid html string`);
  }

  set skillLevel(skillLevel) {
    if (isSkillLevel(skillLevel)) this.#skillLevel = skillLevel;
    else throw new Error(`Risk ${this.#riskIdRef}: skill level is an invalid null/integer`);
  }

  set reward(reward) {
    if (isReward(reward)) this.#reward = reward;
    else throw new Error(`Risk ${this.#riskIdRef}: reward is an invalid null/integer`);
  }

  set accessResources(accessResources) {
    if (isAccessResources(accessResources)) {
      this.#accessResources = accessResources;
    } else throw new Error(`Risk ${this.#riskIdRef}: access resources is an invalid null/integer`);
  }

  set size(size) {
    if (isSize(size)) this.#size = size;
    else throw new Error(`Risk ${this.#riskIdRef}: size is an invalid null/integer`);
  }

  set intrusionDetection(intrusionDetection) {
    if (isIntrusionDetection(intrusionDetection)) {
      this.#intrusionDetection = intrusionDetection;
    } else throw new Error(`Risk ${this.#riskIdRef}: intrusion detection is an invalid null/integer`);
  }

  set threatFactorScore(threatFactorScore) {
    if ((!Number.isNaN(threatFactorScore) && typeof threatFactorScore === 'number') || threatFactorScore === null) {
      this.#threatFactorScore = threatFactorScore;
    } else throw new Error(`Risk ${this.#riskIdRef}: threat factor score is not a null/double`);
  }

  set threatFactorLevel(threatFactorLevel) {
    if (isThreatFactorLevel(threatFactorLevel)) this.#threatFactorLevel = threatFactorLevel;
    else throw new Error(`Risk ${this.#riskIdRef}: threat factor level is invalid string`);
  }

  set occurrence(occurrence) {
    if (isOccurrence(occurrence)) this.#occurrence = occurrence;
    else throw new Error(`Risk ${this.#riskIdRef}: occurrence is an invalid null/integer `);
  }

  set occurrenceLevel(occurrenceLevel) {
    if (isOccurrenceLevel(occurrenceLevel)) this.#occurrenceLevel = occurrenceLevel;
    else throw new Error(`Risk ${this.#riskIdRef}: occurrence level is invalid string`);
  }

  // RiskLikelihood object is loaded to riskLikelihood in corresponding Risk
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
    };
  }
};
