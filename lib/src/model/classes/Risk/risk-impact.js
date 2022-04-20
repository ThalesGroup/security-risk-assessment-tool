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

const { isBusinessAssetFlag } = require('./validation');
const { isValidId } = require('../../schema/validation-pattern/validation');

/**
  * Create a RiskImpact with private members: Impact evaluation section to calculate riskImpact
  * @throws Risk id (riskIdRef): id ref is not a null/integer
  * @throws Risk (riskIdRef): risk impact is an invalid null/integer
  * @throws Risk (riskIdRef): business asset confidentiality flag is an invalid null/integer
  * @throws Risk (riskIdRef): business asset integrity flag is an invalid null/integer
  * @throws Risk (riskIdRef): business asset availability flag is an invalid null/integer
  * @throws Risk (riskIdRef): business asset authenticity flag is an invalid null/integer
  * @throws Risk (riskIdRef): business asset authorization flag is an invalid null/integer
  * @throws Risk (riskIdRef): business asset non-repudiation flag is an invalid null/integer
*/
class RiskImpact {
  #riskIdRef;

  #riskImpact;

  #businessAssetConfidentialityFlag;

  #businessAssetIntegrityFlag;

  #businessAssetAvailabilityFlag;

  #businessAssetAuthenticityFlag;

  #businessAssetAuthorizationFlag;

  #businessAssetNonRepudiationFlag;

  /** referenced value of riskId from Risk
    * @type {integer|null}
  */
  set riskIdRef(riskIdRef) {
    if (isValidId(riskIdRef)) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}: id ref is not null/integer`);
  }

  get riskIdRef() {
    return this.#riskIdRef;
  }

  /** calculated value of risk impact
    * @type {integer|null}
  */
  set riskImpact(riskImpact) {
    if (Number.isSafeInteger(riskImpact) || riskImpact === null) this.#riskImpact = riskImpact;
    else throw new Error(`Risk ${this.#riskIdRef}: risk impact is not null/integer`);
  }

  get riskImpact() {
    return this.#riskImpact;
  }

  /** value of flag of business asset confidentiality
    * @type {integer|null}
  */
  set businessAssetConfidentialityFlag(businessAssetConfidentialityFlag) {
    if (isBusinessAssetFlag(businessAssetConfidentialityFlag)) {
      this.#businessAssetConfidentialityFlag = businessAssetConfidentialityFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset confidentiality flag is an invalid null/integer`);
  }

  get businessAssetConfidentialityFlag() {
    return this.#businessAssetConfidentialityFlag;
  }

  /** value of flag of business asset integrity
    * @type {integer|null}
  */
  set businessAssetIntegrityFlag(businessAssetIntegrityFlag) {
    if (isBusinessAssetFlag(businessAssetIntegrityFlag)) {
      this.#businessAssetIntegrityFlag = businessAssetIntegrityFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset integrity flag is an invalid null/integer`);
  }

  get businessAssetIntegrityFlag() {
    return this.#businessAssetIntegrityFlag;
  }

  /** value of flag of business asset availability
    * @type {integer|null}
  */
  set businessAssetAvailabilityFlag(businessAssetAvailabilityFlag) {
    if (isBusinessAssetFlag(businessAssetAvailabilityFlag)) {
      this.#businessAssetAvailabilityFlag = businessAssetAvailabilityFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset availability flag is an invalid null/integer`);
  }

  get businessAssetAvailabilityFlag() {
    return this.#businessAssetAvailabilityFlag;
  }

  /** value of flag of business asset authenticity
    * @type {integer|null}
  */
  set businessAssetAuthenticityFlag(businessAssetAuthenticityFlag) {
    if (isBusinessAssetFlag(businessAssetAuthenticityFlag)) {
      this.#businessAssetAuthenticityFlag = businessAssetAuthenticityFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset authenticity flag is an invalid null/integer`);
  }

  get businessAssetAuthenticityFlag() {
    return this.#businessAssetAuthenticityFlag;
  }

  /** value of flag of business asset authorization
    * @type {integer|null}
  */
  set businessAssetAuthorizationFlag(businessAssetAuthorizationFlag) {
    if (isBusinessAssetFlag(businessAssetAuthorizationFlag)) {
      this.#businessAssetAuthorizationFlag = businessAssetAuthorizationFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset authorization flag is an invalid null/integer`);
  }

  get businessAssetAuthorizationFlag() {
    return this.#businessAssetAuthorizationFlag;
  }

  /** value of flag of business asset non-repudiation
    * @type {integer|null}
  */
  set businessAssetNonRepudiationFlag(businessAssetNonRepudiationFlag) {
    if (isBusinessAssetFlag(businessAssetNonRepudiationFlag)) {
      this.#businessAssetNonRepudiationFlag = businessAssetNonRepudiationFlag;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset nonrepudiation flag is an invalid null/integer`);
  }

  get businessAssetNonRepudiationFlag() {
    return this.#businessAssetNonRepudiationFlag;
  }

  /** get object of each value of RiskImpact member property
    * @type {object}
  */
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
}

module.exports = RiskImpact;
