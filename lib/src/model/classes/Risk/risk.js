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
  isProjectVersion,
  isProjectName,
} = require('../ISRAProject/validation');

const {
  isRiskId,
  isAllAttackPathsName,
  isAllAttackPathsScore,
  isInherentRiskScore,
  isMitigatedRiskScore,
  isRiskManagementDecision,
  isRiskManagementDetail,
  isResidualRiskScore,
  isResidualRiskLevel,
} = require('./validation');

const { counter } = require('../../../utility-global');
const { map2Array } = require('../utility');

const RiskName = require('./risk-name');
const RiskLikelihood = require('./risk-likelihood');
const RiskImpact = require('./risk-impact');
const RiskAttackPath = require('./risk-attack-path');
const RiskMitigation = require('./risk-mitigation');

/**
  * Create a Risk with private members
  * @throws Risk id (riskId) is invalid null/integer
  * @throws Project name is not a string
  * @throws Project version is not a string
  * @throws Risk (riskId): name is not an instance of RiskName
  * @throws Risk (riskId): likelihood is not an instance of RiskLikelihood
  * @throws Risk (riskId): impact is not an instance of RiskImpact
  * @throws Risk (riskId): added risk attack path is not an instance of Risk Attack Path
  * @throws Risk (riskId): risk attack path (riskAttackPathId) doesn't exist
  * @throws Risk (riskId): all attack paths name is not a string
  * @throws Risk (riskId): all attack paths score is invalid
  * @throws Risk (riskId): inherent risk score is invalid
  * @throws Risk (riskId): added risk mitigation is not an instance of Risk Mitigation
  * @throws Risk (riskId): risk mitigation (riskMitigationId) doesn't exist
  * @throws Risk (riskId): mitigated risk score is not an integer
  * @throws Risk (riskId): management decision is invalid
  * @throws Risk (riskId): management detail is invalid html string
  * @throws Risk (riskId): residual risk score is not an integer
  * @throws Risk (riskId): residual risk level is invalid
*/
class Risk {
  // value of latest riskId
  static #idCount;

  #riskId;

  #projectNameRef;

  #projectVersionRef;

  #riskName = {};

  #riskLikelihood = {};

  #riskImpact = {};

  // map of RiskAttackPath linked to corresponding Risk
  #riskAttackPathMap = new Map();

  #allAttackPathsName;

  #allAttackPathsScore;

  #inherentRiskScore;

  // map of RiskMitigation linked to corresponding Risk
  #riskMitigationMap = new Map();

  #mitigatedRiskScore;

  #riskManagementDecision;

  #riskManagementDetail;

  #residualRiskScore;

  #residualRiskLevel;

  constructor() {
    this.#riskId = Risk.incrementId();
  }

  /** value of id of risk
    * @type {integer|null}
  */
  set riskId(riskId) {
    if (isRiskId(riskId)) this.#riskId = riskId;
    else throw new Error(`Risk id ${riskId} is invalid null/integer`);
  }

  get riskId() {
    return this.#riskId;
  }

  /** referenced value of projectName from ISRAMetaProject
    * @type {string}
  */
  set projectNameRef(projectname) {
    if (isProjectName(projectname)) this.#projectNameRef = projectname;
    else throw new Error('Project name is not a string');
  }

  get projectNameRef() {
    return this.#projectNameRef;
  }

  /** referenced value of projectVersion from ISRAMetaProject
    * @type {string}
  */
  set projectVersionRef(projectVersion) {
    if (isProjectVersion(projectVersion)) this.#projectVersionRef = projectVersion;
    else throw new Error('Project version is not a string');
  }

  get projectVersionRef() {
    return this.#projectVersionRef;
  }

  /** object of corresponding riskName
    * @type {RiskName}
  */
  set riskName(riskName) {
    if (riskName instanceof RiskName) {
      this.#riskName = riskName;
      this.#riskName.riskIdRef = this.#riskId;
    } else throw new Error(`Risk ${this.#riskId}: name is not an instance of RiskName`);
  }

  get riskName() {
    return this.#riskName;
  }

  /** object of corresponding riskLikelihood
    * @type {RiskLikelihood}
  */
  set riskLikelihood(riskLikelihood) {
    if (riskLikelihood instanceof RiskLikelihood) {
      this.#riskLikelihood = riskLikelihood;
      this.#riskLikelihood.riskIdRef = this.#riskId;
    } else throw new Error(`Risk ${this.#riskId}: likelihood is not an instance of RiskLikelihood`);
  }

  get riskLikelihood() {
    return this.#riskLikelihood;
  }

  /** object of corresponding riskImpact
    * @type {RiskImpact}
  */
  set riskImpact(riskImpact) {
    if (riskImpact instanceof RiskImpact) {
      this.#riskImpact = riskImpact;
      this.#riskImpact.riskIdRef = this.#riskId;
    } else throw new Error(`Risk ${this.#riskId}: impact is not an instance of RiskImpact`);
  }

  get riskImpact() {
    return this.#riskImpact;
  }

  /**
    * @property {function} addRiskAttackPath - add RiskAttackPath to map
    * @param {RiskAttackPath} riskAttackPath - instance of RiskAttackPath
  */
  addRiskAttackPath(riskAttackPath) {
    if (riskAttackPath instanceof RiskAttackPath) {
      const attackPath = riskAttackPath;
      attackPath.riskAttackPathId = this.#riskAttackPathMap.size + 1;
      attackPath.riskIdRef = this.#riskId;
      this.#riskAttackPathMap.set(riskAttackPath.properties.riskAttackPathId, riskAttackPath);
    } else throw Error(`Risk ${this.#riskId}: added risk attack path is not an instance of Risk Attack Path`);
  }

  /**
    * @property {function} deleteRiskAttackPath - delete RiskAttackPath
    * from riskAttackPathMap based on riskAttackPathId
    * @param {integer|null} riskAttackPathId - id of RiskAttackPath
  */
  deleteRiskAttackPath(riskAttackPathId) {
    if (this.#riskAttackPathMap.has(riskAttackPathId)) {
      this.#riskAttackPathMap.delete(riskAttackPathId);

      if (this.#riskAttackPathMap.size > 0 && (this.#riskAttackPathMap.size
        < Array.from(this.#riskAttackPathMap.values()).pop().properties.riskAttackPathId)) {
        const attackPathArr = [];
        const idCounter = counter();

        this.#riskAttackPathMap.forEach((val) => {
          const path = val;
          idCounter.increment();
          path.riskAttackPathId = idCounter.getCount();
          attackPathArr.push(path);
        });

        this.#riskAttackPathMap.clear();

        attackPathArr.forEach((path) => {
          this.#riskAttackPathMap.set(path.properties.riskAttackPathId, path);
        });
      }
    } else throw Error(`Risk ${this.#riskId}: risk attack path ${riskAttackPathId} doesn't exist`);
  }

  /**
    * @property {function} getRiskAttackPath - get RiskAttackPath
    * based on riskAttackPathId for updating
    * @param {integer|null} businessAssetId - id of RiskAttackPath
    * @returns {RiskAttackPath}
  */
  getRiskAttackPath(riskAttackPathId) {
    if (this.#riskAttackPathMap.has(riskAttackPathId)) {
      return this.#riskAttackPathMap.get(riskAttackPathId);
    } throw Error(`Risk ${this.#riskId}: risk attack path ${riskAttackPathId}: doesn't exist`);
  }

  /** computed name of all attack paths (OR)
    * @type {string}
  */
  set allAttackPathsName(allAttackPathsName) {
    if (isAllAttackPathsName(allAttackPathsName)) this.#allAttackPathsName = allAttackPathsName;
    else throw new Error(`Risk ${this.#riskId}: all attack paths name is not a string`);
  }

  get allAttackPathsName() {
    return this.#allAttackPathsName;
  }

  /** calculated value of score for all attack paths
    * @type {number|null}
  */
  set allAttackPathsScore(allAttackPathsScore) {
    if (isAllAttackPathsScore(allAttackPathsScore)) {
      this.#allAttackPathsScore = allAttackPathsScore;
    } else throw new Error(`Risk ${this.#riskId}: all attack paths score is invalid`);
  }

  get allAttackPathsScore() {
    return this.#allAttackPathsScore;
  }

  /** calculated value of inherent risk score
    * @type {number|null}
  */
  set inherentRiskScore(inherentRiskScore) {
    if (isInherentRiskScore(inherentRiskScore)) {
      this.#inherentRiskScore = inherentRiskScore;
    } else throw new Error(`Risk ${this.#riskId}: inherent risk score is invalid`);
  }

  get inherentRiskScore() {
    return this.#inherentRiskScore;
  }

  /**
    * @property {function} addRiskMitigation - add RiskMitigation to map
    * @param {RiskMitigation} riskMitigation - instance of RiskMitigation
  */
  addRiskMitigation(riskMitigation) {
    if (riskMitigation instanceof RiskMitigation) {
      const mitigation = riskMitigation;
      mitigation.riskMitigationId = this.#riskMitigationMap.size + 1;
      mitigation.riskIdRef = this.#riskId;
      this.#riskMitigationMap.set(riskMitigation.riskMitigationId, riskMitigation);
    } else throw Error(`Risk ${this.#riskId}: added risk mitigation is not an instance of Risk Mitigation`);
  }

  /**
    * @property {function} deleteRiskAttackPath - delete RiskMitigation
    * from riskMitigationMap based on riskMitigationId
    * @param {integer|null} riskMitigationId - id of RiskMitigation
  */
  deleteRiskMitigation(riskMitigationId) {
    if (this.#riskMitigationMap.has(riskMitigationId)) {
      this.#riskMitigationMap.delete(riskMitigationId);

      if (this.#riskMitigationMap.size > 0 && (this.#riskMitigationMap.size
        < Array.from(this.#riskMitigationMap.values()).pop().properties.riskMitigationId)) {
        const mitigationArr = [];
        const idCounter = counter();

        this.#riskMitigationMap.forEach((val) => {
          const mitigation = val;
          idCounter.increment();
          mitigation.riskMitigationId = idCounter.getCount();
          mitigationArr.push(mitigation);
        });

        this.#riskMitigationMap.clear();

        mitigationArr.forEach((mitigation) => {
          this.#riskMitigationMap.set(mitigation.properties.riskMitigationId, mitigation);
        });
      }
    } else throw Error(`Risk ${this.#riskId}: risk mitigation ${riskMitigationId} doesn't exist`);
  }

  /**
    * @property {function} getRiskMitigation - get RiskMitigation
    * based on riskMitigationId for updating
    * @param {integer|null} businessAssetId - id of RiskMitigation
    * @returns {RiskMitigation}
  */
  getRiskMitigation(riskMitigationId) {
    if (this.#riskMitigationMap.has(riskMitigationId)) {
      return this.#riskMitigationMap.get(riskMitigationId);
    } throw Error(`Risk ${this.#riskId}: risk mitigation ${riskMitigationId}: doesn't exist`);
  }

  /** calculated value of mitigated risk score
    * @type {number|null}
  */
  set mitigatedRiskScore(mitigatedRiskScore) {
    if (isMitigatedRiskScore(mitigatedRiskScore)) {
      this.#mitigatedRiskScore = mitigatedRiskScore;
    } else throw new Error(`Risk ${this.#riskId}: mitigated risk score is not an integer`);
  }

  get mitigatedRiskScore() {
    return this.#mitigatedRiskScore;
  }

  /** value of risk management decision selected
    * @type {string}
  */
  set riskManagementDecision(riskManagementDecision) {
    if (isRiskManagementDecision(riskManagementDecision)) {
      this.#riskManagementDecision = riskManagementDecision;
    } else throw new Error(`Risk ${this.#riskId}: management decision is invalid`);
  }

  get riskManagementDecision() {
    return this.#riskManagementDecision;
  }

  /** input decision details of risk management
    * @type {string}
  */
  set riskManagementDetail(riskManagementDetail) {
    if (isRiskManagementDetail(riskManagementDetail)) {
      this.#riskManagementDetail = riskManagementDetail;
    } else throw new Error(`Risk ${this.#riskId}: management detail is invalid html string`);
  }

  get riskManagementDetail() {
    return this.#riskManagementDetail;
  }

  /** calculated value of residual risk score
    * @type {number|null}
  */
  set residualRiskScore(residualRiskScore) {
    if (isResidualRiskScore(residualRiskScore)) {
      this.#residualRiskScore = residualRiskScore;
    } else throw new Error(`Risk ${this.#riskId}: residual risk score is not an integer`);
  }

  get residualRiskScore() {
    return this.#residualRiskScore;
  }

  /** value of residual risk level
    * @type {string}
  */
  set residualRiskLevel(residualRiskLevel) {
    if (isResidualRiskLevel(residualRiskLevel)) this.#residualRiskLevel = residualRiskLevel;
    else throw new Error(`Risk ${this.#riskId}: residual risk level is invalid`);
  }

  get residualRiskLevel() {
    return this.#residualRiskLevel;
  }

  // auto-increments static idCount to update riskId
  static incrementId() {
    if (!this.#idCount) this.#idCount = 1;
    else this.#idCount += 1;
    return this.#idCount;
  }

  /**
    * @property {function} setIdCount - set latest id
    * @param {integer|null} latestId - riskId
  */
  static setIdCount(latestId) {
    this.#idCount = latestId;
  }

  /** get object of each value of Risk member property
    * @type {object}
  */
  get properties() {
    return {
      riskId: this.#riskId,
      projectNameRef: this.#projectNameRef,
      projectVersionRef: this.#projectVersionRef,
      riskName: this.#riskName.properties,
      riskLikelihood: this.#riskLikelihood.properties,
      riskImpact: this.#riskImpact.properties,
      riskAttackPaths: map2Array(this.#riskAttackPathMap),
      allAttackPathsName: this.#allAttackPathsName,
      allAttackPathsScore: this.#allAttackPathsScore,
      inherentRiskScore: this.#inherentRiskScore,
      riskMitigation: map2Array(this.#riskMitigationMap),
      mitigatedRiskScore: this.#mitigatedRiskScore,
      riskManagementDecision: this.#riskManagementDecision,
      riskManagementDetail: this.#riskManagementDetail,
      residualRiskScore: this.#residualRiskScore,
      residualRiskLevel: this.#residualRiskLevel,
    };
  }
}

module.exports = Risk;
