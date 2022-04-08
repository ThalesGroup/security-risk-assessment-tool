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

const { businessAssetFlagEnum } = require('./enum');

// Impact evaluation section to calculate riskImpact
module.exports = class RiskImpact {
  // referenced value of riskId from Risk
  #riskIdRef;

  // calculated value of risk impact
  #riskImpact;

  // value of flag of business asset confidentiality
  #businessAssetConfidentialityFlag;

  // value of flag of business asset integrity
  #businessAssetIntegrityFlag;

  // value of flag of business asset availability
  #businessAssetAvailabilityFlag;

  // value of flag of business asset authenticity
  #businessAssetAuthenticityFlag;

  // value of flag of business asset authorization
  #businessAssetAuthorizationFlag;

  // value of flag of business asset nonrepudiation
  #businessAssetNonRepudiationFlag;

  set riskIdRef(riskIdRef) {
    if ((Number.isSafeInteger(riskIdRef)
    && riskIdRef > 0)
    || riskIdRef === null) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}:Risk id ref is not null/integer`);
  }

  set riskImpact(riskImpact) {
    if (Number.isSafeInteger(riskImpact) || riskImpact === null) this.#riskImpact = riskImpact;
    else throw new Error(`Risk ${this.#riskIdRef}: risk impact is not null/integer`);
  }

  set businessAssetConfidentialityFlag(businessAssetConfidentialityFlag) {
    if ((Number.isSafeInteger(businessAssetConfidentialityFlag)
    && businessAssetConfidentialityFlag in businessAssetFlagEnum)
    || businessAssetConfidentialityFlag === null) {
      this.#businessAssetConfidentialityFlag = businessAssetConfidentialityFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset confidentiality flag is an invalid null/integer`);
  }

  set businessAssetIntegrityFlag(businessAssetIntegrityFlag) {
    if ((Number.isSafeInteger(businessAssetIntegrityFlag)
    && businessAssetIntegrityFlag in businessAssetFlagEnum)
    || businessAssetIntegrityFlag === null) {
      this.#businessAssetIntegrityFlag = businessAssetIntegrityFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset integrity flag is an invalid null/integer`);
  }

  set businessAssetAvailabilityFlag(businessAssetAvailabilityFlag) {
    if ((Number.isSafeInteger(businessAssetAvailabilityFlag)
    && businessAssetAvailabilityFlag in businessAssetFlagEnum)
    || businessAssetAvailabilityFlag === null) {
      this.#businessAssetAvailabilityFlag = businessAssetAvailabilityFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset availability flag is an invalid null/integer`);
  }

  set businessAssetAuthenticityFlag(businessAssetAuthenticityFlag) {
    if ((Number.isSafeInteger(businessAssetAuthenticityFlag)
    && businessAssetAuthenticityFlag in businessAssetFlagEnum)
    || businessAssetAuthenticityFlag === null) {
      this.#businessAssetAuthenticityFlag = businessAssetAuthenticityFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset authenticity flag is an invalid null/integer`);
  }

  set businessAssetAuthorizationFlag(businessAssetAuthorizationFlag) {
    if ((Number.isSafeInteger(businessAssetAuthorizationFlag)
    && businessAssetAuthorizationFlag in businessAssetFlagEnum)
    || businessAssetAuthorizationFlag === null) {
      this.#businessAssetAuthorizationFlag = businessAssetAuthorizationFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset authorization flag is an invalid null/integer`);
  }

  set businessAssetNonRepudiationFlag(businessAssetNonRepudiationFlag) {
    if ((Number.isSafeInteger(businessAssetNonRepudiationFlag)
    && businessAssetNonRepudiationFlag in businessAssetFlagEnum)
    || businessAssetNonRepudiationFlag === null) {
      this.#businessAssetNonRepudiationFlag = businessAssetNonRepudiationFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset nonrepudiation flag is an invalid null/integer`);
  }

  // RiskImpact object is loaded to riskImpact in corresponding Risk
  get properties() {
    return {
      riskIdRef: this.#riskIdRef,
      riskImpact: this.#riskImpact,
      businessAssetConfidentialityFlag: this.#businessAssetConfidentialityFlag,
      businessAssetIntegrityFlag: this.#businessAssetIntegrityFlag,
      businessAssetAvailabilityFlag: this.#businessAssetAvailabilityFlag,
      businessAssetAuthenticityFlag: this.#businessAssetAuthenticityFlag,
      businessAssetAuthorizationFlag: this.#businessAssetAuthorizationFlag,
      businessAssetNonRepudiationFlag: this.#businessAssetNonRepudiationFlag,
    };
  }
};
