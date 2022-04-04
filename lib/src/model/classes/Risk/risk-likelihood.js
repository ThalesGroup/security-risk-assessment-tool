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
  riskLikelihoodEnum,
  skillLevelEnum,
  rewardEnum,
  accessResourcesEnum,
  sizeEnum,
  intrusionDetectionEnum,
  threatFactorLevelEnum,
  occurrenceEnum,
  occurrenceLevelEnum,
} = require('./enum');

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
    if (Number.isSafeInteger(riskIdRef) || riskIdRef !== null) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}:Risk id ref is not an integer`);
  }

  set riskLikelihood(riskLikelihood) {
    if ((Number.isSafeInteger(riskLikelihood)
    && riskLikelihood in riskLikelihoodEnum)
    || riskLikelihood === null) {
      this.#riskLikelihood = riskLikelihood;
    } else throw new Error(`Risk ${this.#riskIdRef}: risk likelihood is not null/integer or is invalid`);
  }

  set riskLikelihoodDetail(riskLikelihoodDetail) {
    if (typeof riskLikelihoodDetail === 'string') this.#riskLikelihoodDetail = riskLikelihoodDetail;
    else throw new Error(`Risk ${this.#riskIdRef}: risk likelihood detail is not a string`);
  }

  set skillLevel(skillLevel) {
    if ((Number.isSafeInteger(skillLevel)
    && skillLevel in skillLevelEnum)
    || skillLevel === null) this.#skillLevel = skillLevel;
    else throw new Error(`Risk ${this.#riskIdRef}: skill level is not null/integer or is invalid`);
  }

  set reward(reward) {
    if ((Number.isSafeInteger(reward)
    && reward in rewardEnum)
    || reward === null) this.#reward = reward;
    else throw new Error(`Risk ${this.#riskIdRef}: reward is not null/integer or is invalid`);
  }

  set accessResources(accessResources) {
    if ((Number.isSafeInteger(accessResources)
    && accessResources in accessResourcesEnum)
    || accessResources === null) {
      this.#accessResources = accessResources;
    } else throw new Error(`Risk ${this.#riskIdRef}: access resources is not null/integer or is invalid`);
  }

  set size(size) {
    if ((Number.isSafeInteger(size)
    && size in sizeEnum)
    || size === null) this.#size = size;
    else throw new Error(`Risk ${this.#riskIdRef}: size is not null/integer or is invalid`);
  }

  set intrusionDetection(intrusionDetection) {
    if ((Number.isSafeInteger(intrusionDetection)
    && intrusionDetection in intrusionDetectionEnum)
    || intrusionDetection === null) {
      this.#intrusionDetection = intrusionDetection;
    } else throw new Error(`Risk ${this.#riskIdRef}: intrusion detection is not null/integer or is invalid`);
  }

  set threatFactorScore(threatFactorScore) {
    if (!Number.isNaN(threatFactorScore) || threatFactorScore === null) {
      this.#threatFactorScore = threatFactorScore;
    } else throw new Error(`Risk ${this.#riskIdRef}: threat factor score is not a double`);
  }

  set threatFactorLevel(threatFactorLevel) {
    if (typeof threatFactorLevel === 'string' && threatFactorLevel in threatFactorLevelEnum) this.#threatFactorLevel = threatFactorLevel;
    else throw new Error(`Risk ${this.#riskIdRef}: threat factor level is not a string`);
  }

  set occurrence(occurrence) {
    if ((Number.isSafeInteger(occurrence)
    && occurrence in occurrenceEnum)
    || occurrence === null) this.#occurrence = occurrence;
    else throw new Error(`Risk ${this.#riskIdRef}: occurrence is not null/integer or is invalid`);
  }

  set occurrenceLevel(occurrenceLevel) {
    if (typeof occurrenceLevel === 'string' && occurrenceLevel in occurrenceLevelEnum) this.#occurrenceLevel = occurrenceLevel;
    else throw new Error(`Risk ${this.#riskIdRef}: occurrence level is not a string`);
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
