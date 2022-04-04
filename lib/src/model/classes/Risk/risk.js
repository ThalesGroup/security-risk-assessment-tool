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

const RiskName = require('./risk-name');
const RiskLikelihood = require('./risk-likelihood');
const RiskImpact = require('./risk-impact');
const RiskAttackPath = require('./risk-attack-path');
const RiskMitigation = require('./risk-mitigation');
const utilityGlobal = require('../../../utility-global');
const { riskManagementDecisionEnum, residualRiskLevelEnum } = require('./enum');

// contains information about each risk
module.exports = class Risk {
  // value of latest riskId
  static #idCount;

  // value of id of risk
  #riskId;

  // referenced value of projectName from ISRAMetaProject
  #projectNameRef;

  // referenced value of projectVersion from ISRAMetaProject
  #projectVersionRef;

  // object of corresponding riskName
  #riskName;

  // object of corresponding riskLikelihood
  #riskLikelihood;

  // object of corresponding riskImpact
  #riskImpact;

  // map of RiskAttackPath linked to corresponding Risk
  #riskAttackPathMap = new Map();

  // computed name of all attack paths (OR)
  #allAttackPathsName;

  // calculated value of score for all attack paths
  #allAttackPathsScore;

  // calculated value of inherent risk score
  #inherentRiskScore;

  // map of RiskMitigation linked to corresponding Risk
  #riskMitigationMap = new Map();

  // calculated value of mitigated risk score
  #mitigatedRiskScore;

  // value of risk management decision selected
  #riskManagementDecision;

  // input decision details of risk management
  #riskManagementDetail;

  // calculated value of residual risk score
  #residualRiskScore;

  // value of residual risk level
  #residualRiskLevel;

  constructor() {
    this.#riskId = Risk.incrementId();
  }

  set riskId(riskId) {
    if (Number.isSafeInteger(riskId) || riskId === null) this.#riskId = riskId;
    else throw new Error(`Risk id ${riskId} is not an integer`);
  }

  set projectNameRef(projectname) {
    if (typeof projectname === 'string') this.#projectNameRef = projectname;
    else throw new Error('Project name is not a string');
  }

  set projectVersionRef(projectVersion) {
    if (typeof projectVersion === 'string') this.#projectVersionRef = projectVersion;
    else throw new Error('Project version is not a string');
  }

  set riskName(riskName) {
    if (riskName instanceof RiskName) this.#riskName = riskName;
    else throw new Error(`Risk ${this.#riskId}: name is not an object`);
  }

  set riskLikelihood(riskLikelihood) {
    if (riskLikelihood instanceof RiskLikelihood) this.#riskLikelihood = riskLikelihood;
    else throw new Error(`Risk ${this.#riskId}: likelihood is not an object`);
  }

  set riskImpact(riskImpact) {
    if (riskImpact instanceof RiskImpact) this.#riskImpact = riskImpact;
    else throw new Error(`Risk ${this.#riskId}: impact is not an object`);
  }

  addRiskAttackPath(riskAttackPath) {
    if (riskAttackPath instanceof RiskAttackPath) {
      const attackPath = riskAttackPath;
      attackPath.riskAttackPathId = this.#riskAttackPathMap.size + 1;
      this.#riskAttackPathMap.set(riskAttackPath.properties.riskAttackPathId, riskAttackPath);
    } else throw Error(`Risk ${this.#riskId}: added risk attack path is not an object`);
  }

  deleteRiskAttackPath(riskAttackPathId) {
    if (Number.isSafeInteger(riskAttackPathId) && this.#riskAttackPathMap.size > 0) {
      this.#riskAttackPathMap.delete(riskAttackPathId);

      if (this.#riskAttackPathMap.size > 0 && (this.#riskAttackPathMap.size
        < Array.from(this.#riskAttackPathMap.values()).pop().properties.riskAttackPathId)) {
        const attackPathArr = [];
        const idCounter = utilityGlobal().counter();

        this.#riskAttackPathMap.forEach((val, key) => {
          const path = this.#riskAttackPathMap.get(key);
          idCounter.increment();
          path.riskAttackPathId = path.riskAttackPathId === idCounter.getCount()
            ? path.riskAttackPathId : idCounter.getCount();
          attackPathArr.push(path);
        });

        this.#riskAttackPathMap.clear();

        attackPathArr.forEach((path) => {
          this.#riskAttackPathMap.set(path.properties.riskAttackPathId, path);
        });
      }
    } else throw Error(`Risk ${this.#riskId}: risk attack path id is not an integer`);
  }

  // updates RiskAttackPath based on their riskAttackPathId
  updateRiskAttackPath(riskAttackPathId, property, value) {
    if (this.#riskAttackPathMap.has(riskAttackPathId)) {
      const riskAttackPath = this.#riskAttackPathMap.get(riskAttackPathId);
      riskAttackPath[property] = value;
    } else throw Error(`Risk ${this.#riskId}: risk attack path ${riskAttackPathId}: doesn't exist`);
  }

  set allAttackPathsName(allAttackPathsName) {
    if (typeof allAttackPathsName === 'string') this.#allAttackPathsName = allAttackPathsName;
    else throw new Error(`Risk ${this.#riskId}: all attack paths name is not a string`);
  }

  set allAttackPathsScore(allAttackPathsScore) {
    if (!Number.isNaN(allAttackPathsScore) || allAttackPathsScore === null) {
      this.#allAttackPathsScore = allAttackPathsScore;
    } else throw new Error(`Risk ${this.#riskId}: all attack paths score is not a double`);
  }

  set inherentRiskScore(inherentRiskScore) {
    if (Number.isSafeInteger(inherentRiskScore) || inherentRiskScore === null) {
      this.#inherentRiskScore = inherentRiskScore;
    } else throw new Error(`Risk ${this.#riskId}: inherent risk score is not an integer`);
  }

  addRiskMitigation(riskMitigation) {
    if (riskMitigation instanceof RiskMitigation) {
      const mitigation = riskMitigation;
      mitigation.riskMitigationId = this.#riskMitigationMap.size + 1;
      this.#riskMitigationMap.set(riskMitigation.properties.riskMitigationId, riskMitigation);
    } else throw Error(`Risk ${this.#riskId}: added risk mitigation is not an object`);
  }

  deleteRiskMitigation(riskMitigationId) {
    if (Number.isSafeInteger(riskMitigationId) && this.#riskMitigationMap.size > 0) {
      this.#riskMitigationMap.delete(riskMitigationId);

      if (this.#riskMitigationMap.size > 0 && (this.#riskMitigationMap.size
        < Array.from(this.#riskMitigationMap.values()).pop().properties.riskMitigationId)) {
        const mitigationArr = [];
        const idCounter = utilityGlobal().counter();

        this.#riskMitigationMap.forEach((val, key) => {
          const mitigation = this.#riskMitigationMap.get(key);
          idCounter.increment();
          mitigation.riskMitigationId = mitigation.riskMitigationId
          === idCounter.getCount() ? mitigation.riskMitigationId : idCounter.getCount();
          mitigationArr.push(mitigation);
        });

        this.#riskMitigationMap.clear();

        mitigationArr.forEach((mitigation) => {
          this.#riskMitigationMap.set(mitigation.properties.riskMitigationId, mitigation);
        });
      }
    } else throw Error(`Risk ${this.#riskId}: risk mitigation id is not an integer`);
  }

  // updates RiskMitigation based on their riskMitigationId
  updateRiskMitigation(riskMitigationId, property, value) {
    if (this.#riskAttackPathMap.has(riskMitigationId)) {
      const riskMitigation = this.#riskAttackPathMap.get(riskMitigationId);
      riskMitigation[property] = value;
    } else throw Error(`Risk ${this.#riskId}: risk attack path ${riskMitigationId}: doesn't exist`);
  }

  set mitigatedRiskScore(mitigatedRiskScore) {
    if (Number.isSafeInteger(mitigatedRiskScore) || mitigatedRiskScore === null) {
      this.#mitigatedRiskScore = mitigatedRiskScore;
    } else throw new Error(`Risk ${this.#riskId}: mitigated risk score is not an integer`);
  }

  set riskManagementDecision(riskManagementDecision) {
    if (typeof riskManagementDecision === 'string' && riskManagementDecision in riskManagementDecisionEnum) this.#riskManagementDecision = riskManagementDecision;
    else throw new Error(`Risk ${this.#riskId}: management decision is not a string`);
  }

  set riskManagementDetail(riskManagementDetail) {
    if (typeof riskManagementDetail === 'string') this.#riskManagementDetail = riskManagementDetail;
    else throw new Error(`Risk ${this.#riskId}: management detail is not a string`);
  }

  set residualRiskScore(residualRiskScore) {
    if (Number.isSafeInteger(residualRiskScore) || residualRiskScore === null) {
      this.#residualRiskScore = residualRiskScore;
    } else throw new Error(`Risk ${this.#riskId}: residual risk score is not an integer`);
  }

  set residualRiskLevel(residualRiskLevel) {
    if (typeof residualRiskLevel === 'string' && residualRiskLevel in residualRiskLevelEnum) this.#residualRiskLevel = residualRiskLevel;
    else throw new Error(`Risk ${this.#riskId}: residual risk level is not a string`);
  }

  // auto-increments static idCount to update riskId
  static incrementId() {
    if (!this.#idCount) this.#idCount = 1;
    else this.#idCount += 1;
    return this.#idCount;
  }

  // set latest id
  static setIdCount(latestId) {
    this.#idCount = latestId;
  }

  // get obj of relevant properties for storage
  get properties() {
    return {
      riskId: this.#riskId,
      projectNameRef: this.#projectNameRef,
      projectVersionRef: this.#projectVersionRef,
      riskName: this.#riskName.properties,
      riskLikelihood: this.#riskLikelihood.properties,
      riskImpact: this.#riskImpact.properties,
      riskAttackPaths: this.#riskAttackPathMap,
      allAttackPathsName: this.#allAttackPathsName,
      allAttackPathsScore: this.#allAttackPathsScore,
      inherentRiskScore: this.#inherentRiskScore,
      riskMitigation: this.#riskMitigationMap,
      mitigatedRiskScore: this.#mitigatedRiskScore,
      riskManagementDecision: this.#riskManagementDecision,
      riskManagementDetail: this.#riskManagementDetail,
      residualRiskScore: this.#residualRiskScore,
      residualRiskLevel: this.#residualRiskLevel,
    };
  }
};
