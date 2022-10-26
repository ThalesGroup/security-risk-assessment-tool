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
  isRiskMitigationId,
  isDescription,
  isBenefits,
  isCost,
  isDecision,
  isDecisionDetail,
  isMitigationsBenefits,
  isMitigationsDoneBenefits,
} = require('./validation');

const riskMitigationJsonSchema = require('../../schema/json-schema').properties.Risk.items.properties.riskMitigation.items.properties;

/**
  * Create a RiskMitigation with private members
  * @throws Risk id (riskIdRef): Risk id ref is not null/integer
  * @throws Risk (riskMitigationId): Risk mitigation id is not null/integer
  * @throws Risk (riskIdRef): mitigation : (riskMitigationId): description is not a html string
  * @throws Risk (riskIdRef): mitigation : (riskMitigationId): benefits is an invalid null/double
  * @throws Risk (riskIdRef): mitigation : (riskMitigationId): cost is not null/integer
  * @throws Risk (riskIdRef): mitigation : (riskMitigationId): decision is invalid
  * @throws Risk (riskIdRef): mitigation : (riskMitigationId):
  * mitigations done benefits is an invalid null/double
*/
class RiskMitigation {
  // value of latest riskId
  static #idCount;

  #riskIdRef;

  #riskMitigationId;

  #description;

  #benefits;

  #cost;

  #decision;

  #decisionDetail;

  #mitigationsBenefits;

  #mitigationsDoneBenefits;

  constructor() {
    this.#riskMitigationId = RiskMitigation.incrementId();
    this.#description = riskMitigationJsonSchema.description.default;
    this.#benefits = riskMitigationJsonSchema.benefits.default;
    this.#cost = riskMitigationJsonSchema.cost.default;
    this.#decision = riskMitigationJsonSchema.decision.default;
    this.#decisionDetail = riskMitigationJsonSchema.decisionDetail.default;
    this.#mitigationsBenefits = riskMitigationJsonSchema.mitigationsBenefits.default;
    this.#mitigationsDoneBenefits = riskMitigationJsonSchema.mitigationsDoneBenefits.default;
  }

  /** referenced value of riskId from Risk
    * @type {integer|null}
  */
  set riskIdRef(riskIdRef) {
    if (isRiskId(riskIdRef)) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}: Risk id ref is not null/integer`);
  }

  get riskIdRef() {
    return this.#riskIdRef;
  }

  /**  value of risk mitigation id
    * @type {integer|null}
  */
  set riskMitigationId(riskMitigationId) {
    if (isRiskMitigationId(riskMitigationId)) {
      this.#riskMitigationId = riskMitigationId;
    } else throw new Error(`Risk ${riskMitigationId}: Risk mitigation id is not null/integer`);
  }

  get riskMitigationId() {
    return this.#riskMitigationId;
  }

  /**  text input of security control description
    * @type {string}
  */
  set description(description) {
    if (isDescription(description)) this.#description = description;
    else throw new Error(`Risk ${this.#riskIdRef}: mitigation: ${this.#riskMitigationId}: description is not a html string`);
  }

  get description() {
    return this.#description;
  }

  /**  value of expected benefits selected
    * @type {number|null}
  */
  set benefits(benefits) {
    if (isBenefits(benefits)) this.#benefits = benefits;
    else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: benefits is an invalid null/double`);
  }

  get benefits() {
    return this.#benefits;
  }

  /**  integer input of cost
    * @type {integer|null}
  */
  set cost(cost) {
    if (isCost(cost)) this.#cost = cost;
    else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: cost is not null/integer`);
  }

  get cost() {
    return this.#cost;
  }

  /**  value of mitigation decision selected
    * @type {string}
  */
  set decision(decision) {
    if (isDecision(decision)) this.#decision = decision;
    else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: decision is invalid`);
  }

  get decision() {
    return this.#decision;
  }

  /**  text input of decision comment
    * @type {string}
  */
  set decisionDetail(decisionDetail) {
    if (isDecisionDetail(decisionDetail)) this.#decisionDetail = decisionDetail;
    else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: decision detail is not a string`);
  }

  get decisionDetail() {
    return this.#decisionDetail;
  }

  /**  calculated value of mitigations benefits when value of
    *  mitigation decision selected = 'Done' or 'Accepted'
    * @type {number|null}
  */
  set mitigationsBenefits(mitigationsBenefits) {
    if (isMitigationsBenefits(mitigationsBenefits)) this.#mitigationsBenefits = mitigationsBenefits;
    else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: mitigations benefits is an invalid null/double`);
  }

  get mitigationsBenefits() {
    return this.#mitigationsBenefits;
  }

  /** calculated value of mitigations when value of mitigation decision selected = 'Done'
    * @type {number|null}
  */
  set mitigationsDoneBenefits(mitigationsDoneBenefits) {
    if (isMitigationsDoneBenefits(mitigationsDoneBenefits)) {
      this.#mitigationsDoneBenefits = mitigationsDoneBenefits;
    } else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: mitigations done benefits is an invalid null/double`);
  }

  get mitigationsDoneBenefits() {
    return this.#mitigationsDoneBenefits;
  }

  // auto-increments static idCount to update riskMitigationId
  static incrementId() {
    if (!this.#idCount) this.#idCount = 1;
    else this.#idCount += 1;
    return this.#idCount;
  }

  /**
    * @property {function} setIdCount - set latest id
    * @param {integer|null} latestId - riskMitigationId
  */
  static setIdCount(latestId) {
    this.#idCount = latestId;
  }

  /** get object of each value of RiskMitigation member property
    * @type {object}
  */
  get properties() {
    return {
      riskIdRef: this.#riskIdRef,
      riskMitigationId: this.#riskMitigationId,
      description: this.#description,
      benefits: this.#benefits,
      cost: this.#cost,
      decision: this.#decision,
      decisionDetail: this.#decisionDetail,
      mitigationsBenefits: this.#mitigationsBenefits,
      mitigationsDoneBenefits: this.#mitigationsDoneBenefits,
    };
  }
}

module.exports = RiskMitigation;
