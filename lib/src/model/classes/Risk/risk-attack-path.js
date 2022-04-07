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

// Vulnerability evaluation section to compute attack path name and calculate attack path score
module.exports = class RiskAttackPath {
  // referenced value of riskId from Risk
  #riskIdRef;

  // value of risk attack id
  #riskAttackPathId;

  /* map of selected vulnerabilities
  (each item contains vulernabillityId, vulnerabilityName, overallScore) */
  #vulnerabilityMap = new Map();

  // value of attack path name
  #attackPathName;

  // calculated value of attack path score
  #attackPathScore;

  set riskIdRef(riskIdRef) {
    if (Number.isSafeInteger(riskIdRef) || riskIdRef === null) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}: Risk id ref is not an integer`);
  }

  set riskAttackPathId(riskAttackPathId) {
    if (Number.isSafeInteger(riskAttackPathId) || riskAttackPathId === null) {
      this.#riskAttackPathId = riskAttackPathId;
    } else throw new Error(`Risk ${riskAttackPathId}: Risk id ref is not an integer`);
  }

  set attackPathName(attackPathName) {
    if (typeof attackPathName === 'string') this.#attackPathName = attackPathName;
    else throw new Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: attack path name is not a string`);
  }

  addVulnerability(vulnerability) {
    if (typeof vulnerability === 'object'
    && 'vulnerabilityIdRef' in vulnerability
    && 'score' in vulnerability
    && 'name' in vulnerability) this.#vulnerabilityMap.set(vulnerability.vulnerabilityIdRef, vulnerability);
    else throw Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: risk attack path is not an object`);
  }

  deleteVulnerability(vulnerabilityId) {
    if (Number.isSafeInteger(vulnerabilityId) && this.#vulnerabilityMap.size > 0) {
      this.#vulnerabilityMap.delete(vulnerabilityId);
    } else throw Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: risk attack path id is not an integer`);
  }

  updateVulnerability(vulnerabilityId, property, value) {
    if (this.#vulnerabilityMap.has(vulnerabilityId)) {
      const vulnerability = this.#vulnerabilityMap.get(vulnerabilityId);
      vulnerability[property] = value;
    } else throw new Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: Vulnerability ${vulnerabilityId}: doesn't exist`);
  }

  set attackPathScore(attackPathScore) {
    if ((!Number.isNaN(attackPathScore)
    && typeof attackPathScore === 'number'
    && attackPathScore >= 0
    && attackPathScore <= 10)
    || attackPathScore === null) {
      this.#attackPathScore = attackPathScore;
    } else throw new Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskAttackPathId}: attack path score is not a double`);
  }

  // RiskAttackPath is loaded to riskAttackPathMap in corresponding Risk
  get properties() {
    return {
      riskIdRef: this.#riskIdRef,
      riskAttackPathId: this.#riskAttackPathId,
      vulnerabilityRef: this.#vulnerabilityMap,
      attackPathName: this.#attackPathName,
      attackPathScore: this.#attackPathScore,
    };
  }
};
