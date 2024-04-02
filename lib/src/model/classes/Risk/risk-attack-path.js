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
  isRiskAttackPathId,
  isAttackPathName,
  isVulnerabilityRef,
  isAttackPathScore,
} = require('./validation');

const riskAttackPathJsonSchema = require('../../schema/json-schema').properties.Risk.items.properties.riskAttackPaths.items.properties;

/**
  * Create a RiskAttackPath with private members: Vullnerability evaluation section
  * to compute attack path name and calculate attack path score
  * @throws Risk id (riskIdRef): id ref is not a null/integer
  * @throws Risk (riskIdRef): risk attack path id is invalid null/integer
  * @throws Risk (riskIdRef): attack path: (riskAttackPathId): attack path name is not a string
  * @throws Risk (riskIdRef): attack path: (riskAttackPathId): risk attack path is not an object
  * @throws Risk (riskIdRef): attack path: (riskAttackPathId): Vulnerability (vulnerabilityId) doesn't exist
  * @throws Risk (riskIdRef): attack path: (riskAttackPathId): attack path score is an invalid null/double
*/
class RiskAttackPath {
  #riskIdRef;

  #riskAttackPathId;

  /* map of selected vulnerabilities
  (each item contains vulernabillityId, vulnerabilityName, overallScore) */
  #vulnerabilityMap = new Map();

  #attackPathName;

  #attackPathScore;

  constructor() {
    this.#attackPathName = riskAttackPathJsonSchema.attackPathName.default;
    this.#attackPathScore = riskAttackPathJsonSchema.attackPathScore.default;
  }

  /** referenced value of riskId from Risk
    * @type {integer|null}
  */
  set riskIdRef(riskIdRef) {
    if (isRiskId(riskIdRef)) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}: Risk id ref is invalid null/integer`);
  }

  get riskIdRef() {
    return this.#riskIdRef;
  }

  /** value of risk attack id
    * @type {integer|null}
  */
  set riskAttackPathId(riskAttackPathId) {
    if (isRiskAttackPathId(riskAttackPathId)) {
      this.#riskAttackPathId = riskAttackPathId;
    } else throw new Error(`Risk ${this.#riskIdRef}: Risk attack path id is invalid null/integer`);
  }

  get riskAttackPathId() {
    return this.#riskAttackPathId;
  }

  /** value of attack path name
    * @type {string}
  */
  set attackPathName(attackPathName) {
    if (isAttackPathName(attackPathName)) this.#attackPathName = attackPathName;
    else throw new Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: attack path name is not a string`);
  }

  get attackPathName() {
    return this.#attackPathName;
  }

  /**
    * add Vulnerability ref to map
    * @param {Object} vulnerability - instance of Vulnerability
  */
  addVulnerability(vulnerabilityReference) {

    if (isVulnerabilityRef(vulnerabilityReference)) {
      this.#vulnerabilityMap.set(vulnerabilityReference.vulnerabilityId, vulnerabilityReference);
    } else throw Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: risk attack path is not an object`);
  }

  /**
    * delete Vulnerability ref
    * from vulnerabilityMap based on vulnerabilityId
    * @param {integer} vulnerabilityId - id of Vulnerability Ref Object
    * @param {object} value - Vulnerability Ref Object  
  */
  deleteVulnerability(vulnerabilityId) {
    if (this.#vulnerabilityMap.has(vulnerabilityId)) {
      this.#vulnerabilityMap.delete(vulnerabilityId);
    } else throw Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: Vulnerability Ref doesn't exist`);
  }

  /**
    * update Vulnerability ref
    * from vulnerabilityMap based on vulnerabilityId
    * @param {integer} vulnerabilityId - id of Vulnerability Ref Object
    * @param {object} value - Vulnerability Ref Object
  */
  updateVulnerability(vulnerabilityId, value) {
    if (this.#vulnerabilityMap.has(vulnerabilityId) && isVulnerabilityRef(value)) {
      this.#vulnerabilityMap.set(vulnerabilityId, value);
    } else throw Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: Failed to update Vulnerability Ref`);
  }

  /** 
    * get Vulnerability ref
    * based on vulnerabilityId for updating
    * @param {integer} vulnerabilityId - id of Vulnerability Ref Object
  */
  getVulnerability(vulnerabilityId) {
    if (this.#vulnerabilityMap.has(vulnerabilityId)) {
      return this.#vulnerabilityMap.get(vulnerabilityId);
    } else throw Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: Vulnerability Ref doesn't exist`);
  }

  /** calculated value of attack path score
    * @type {number|null}
  */
  set attackPathScore(attackPathScore) {
    if (isAttackPathScore(attackPathScore)) this.#attackPathScore = attackPathScore;
    else throw new Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: attack path score is an invalid null/double`);
  }

  get attackPathScore() {
    return this.#attackPathScore;
  }

  /** row id of vulnerability ref
    * @type {integer}
  */
  /* set rowId(rowid) {
    if (isRowId(rowid)){
      this.#rowId = rowid;
    } else throw new Error(`Risk ${riskIdRef}: rowid is invalid integer`);
  }

  get rowId() {
    return this.#rowId;
  } */

  /** get object of each value of RiskAttackPath member property
    * @type {object}
  */
  get properties() {
    return {
      // riskIdRef: this.#riskIdRef,
      riskAttackPathId: this.#riskAttackPathId,
      vulnerabilityRef: Array.from(this.#vulnerabilityMap.values()),
      attackPathName: this.#attackPathName,
      attackPathScore: this.#attackPathScore,
    };
  }
}

module.exports = RiskAttackPath;
