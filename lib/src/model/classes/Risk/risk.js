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
  isRiskName,
  isThreatAgent,
  isThreatAgentDetail,
  isThreatVerb,
  isThreatVerbDetail,
  isMotivation,
  isMotivationDetail,
  isAllAttackPathsName,
  isAllAttackPathsScore,
  isInherentRiskScore,
  isMitigatedRiskScore,
  isRiskManagementDecision,
  isRiskManagementDetail,
  isResidualRiskScore,
  isResidualRiskLevel,
  isMitigationsBenefits,
  isMitigationsDoneBenefits,
} = require('./validation');

const { isBusinessAssetId } = require('../BusinessAsset/validation');
const { isSupportingAssetId } = require('../SupportingAsset/validation');

const { counter } = require('../../../utility-global');
const { map2Array } = require('../map2array');

const RiskLikelihood = require('./risk-likelihood');
const RiskImpact = require('./risk-impact');
const RiskAttackPath = require('./risk-attack-path');
const RiskMitigation = require('./risk-mitigation');

const riskJsonSchema = require('../../schema/json-schema').properties.Risk.items.properties;

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
  * @throws Risk (riskIdRef): mitigations benefits is an invalid null/double
  * @throws Risk (riskIdRef): mitigations done benefits is an invalid null/double
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

  #projectName;

  #projectVersion;

  #riskName;

  #threatAgent;

  #threatAgentDetail;

  #threatVerb;

  #threatVerbDetail;

  #motivation;

  #motivationDetail;

  #businessAssetRef;

  #supportingAssetRef;

  #isAutomaticRiskName;

  #riskLikelihood;

  #riskImpact;

  // map of RiskAttackPath linked to corresponding Risk
  #riskAttackPathMap;

  #allAttackPathsName;

  #allAttackPathsScore;

  #inherentRiskScore;

  // map of RiskMitigation linked to corresponding Risk
  #riskMitigationMap;

  #mitigationsBenefits;

  #mitigationsDoneBenefits;

  #mitigatedRiskScore;

  #riskManagementDecision;

  #riskManagementDetail;

  #residualRiskScore;

  #residualRiskLevel;

  constructor() {
    this.#riskId = Risk.incrementId();
    this.#riskName = riskJsonSchema.riskName.default;
    this.#threatAgent = riskJsonSchema.threatAgent.default;
    this.#threatAgentDetail = riskJsonSchema.threatAgentDetail.default;
    this.#threatVerb = riskJsonSchema.threatVerb.default;
    this.#threatVerbDetail = riskJsonSchema.threatVerbDetail.default;
    this.#motivation = riskJsonSchema.motivation.default;
    this.#motivationDetail = riskJsonSchema.motivationDetail.default;
    this.#businessAssetRef = riskJsonSchema.businessAssetRef.default;
    this.#supportingAssetRef = riskJsonSchema.supportingAssetRef.default;
    this.#isAutomaticRiskName = riskJsonSchema.isAutomaticRiskName.default;
    this.#riskLikelihood = new RiskLikelihood();
    this.#riskLikelihood.riskIdRef = this.#riskId;
    this.#riskImpact = new RiskImpact();
    this.#riskImpact.riskIdRef = this.#riskId;
    this.#riskAttackPathMap = new Map();
    this.#allAttackPathsName = riskJsonSchema.allAttackPathsName.default;
    this.#allAttackPathsScore = riskJsonSchema.allAttackPathsScore.default;
    this.#inherentRiskScore = riskJsonSchema.inherentRiskScore.default;
    this.#riskMitigationMap = new Map();
    this.#mitigationsBenefits = riskJsonSchema.mitigationsBenefits.default;
    this.#mitigationsDoneBenefits = riskJsonSchema.mitigationsDoneBenefits.default;
    this.#mitigatedRiskScore = riskJsonSchema.mitigatedRiskScore.default;
    this.#riskManagementDecision = riskJsonSchema.riskManagementDecision.default;
    this.#riskManagementDetail = riskJsonSchema.riskManagementDetail.default;
    this.#residualRiskScore = riskJsonSchema.residualRiskScore.default;
    this.#residualRiskLevel = riskJsonSchema.residualRiskLevel.default;
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
  set projectName(projectname) {
    if (isProjectName(projectname)) this.#projectName = projectname;
    else throw new Error('Project name is not a string');
  }

  get projectName() {
    return this.#projectName;
  }

  /** referenced value of projectVersion from ISRAMetaProject
    * @type {string}
  */
  set projectVersion(projectVersion) {
    if (isProjectVersion(projectVersion)) this.#projectVersion = projectVersion;
    else throw new Error('Project version is not a string');
  }

  get projectVersion() {
    return this.#projectVersion;
  }

  /** value of computed or manual risk name
    * @type {string}
  */
  set riskName(riskName) {
    if (isRiskName(riskName)) this.#riskName = riskName;
    else throw new Error(`Risk ${this.#riskId}: risk name is not an string`);
  }

  get riskName() {
    return this.#riskName;
  }

  /** value of threat agent selected
    * @type {string}
  */
  set threatAgent(threatAgent) {
    if (isThreatAgent(threatAgent)) this.#threatAgent = threatAgent;
    else throw new Error(`Risk ${this.#riskId}: threat agent is invalid`);
  }

  get threatAgent() {
    return this.#threatAgent;
  }

  /** text input of details of threat agent
    * @type {string}
  */
  set threatAgentDetail(threatAgentDetail) {
    if (isThreatAgentDetail(threatAgentDetail)) this.#threatAgentDetail = threatAgentDetail;
    else throw new Error(`Risk ${this.#riskId}: threat agent detail is not a html string`);
  }

  get threatAgentDetail() {
    return this.#threatAgentDetail;
  }

  /** value of threat verb selected
    * @type {string}
  */
  set threatVerb(threatVerb) {
    if (isThreatVerb(threatVerb)) this.#threatVerb = threatVerb;
    else throw new Error(`Risk ${this.#riskId}: threat verb is invalid`);
  }

  get threatVerb() {
    return this.#threatVerb;
  }

  /** input details of threat
    * @type {string}
  */
  set threatVerbDetail(threatVerbDetail) {
    if (isThreatVerbDetail(threatVerbDetail)) this.#threatVerbDetail = threatVerbDetail;
    else throw new Error(`Risk ${this.#riskId}: threat verb detail is not a html string`);
  }

  get threatVerbDetail() {
    return this.#threatVerbDetail;
  }

  /** text input of motivation
    * @type {string}
  */
  set motivation(motivation) {
    if (isMotivation(motivation)) this.#motivation = motivation;
    else throw new Error(`Risk ${this.#riskId}: motivation is not a string`);
  }

  get motivation() {
    return this.#motivation;
  }

  /** text input of details of motivation
    * @type {string}
  */
  set motivationDetail(motivationDetail) {
    if (isMotivationDetail(motivationDetail)) this.#motivationDetail = motivationDetail;
    else throw new Error(`Risk ${this.#riskId}: motivation detail is not a html string`);
  }

  get motivationDetail() {
    return this.#motivationDetail;
  }

  /** referenced value of businessAssetId from selected BusinessAsset
    * @type {integer|null}
  */
  set businessAssetRef(businessAssetRef) {
    if (isBusinessAssetId(businessAssetRef)) {
      this.#businessAssetRef = businessAssetRef;
    } else throw new Error(`Risk ${this.#riskId}: business asset ref is not null/integer`);
  }

  get businessAssetRef() {
    return this.#businessAssetRef;
  }

  /** referenced value of supportingAssetId from selected SupportingAsset
    * @type {integer|null}
  */
  set supportingAssetRef(supportingAssetRef) {
    if (isSupportingAssetId(supportingAssetRef)) {
      this.#supportingAssetRef = supportingAssetRef;
    } else throw new Error(`Risk ${this.#riskId}: supporting asset ref is not null/integer`);
  }

  get supportingAssetRef() {
    return this.#supportingAssetRef;
  }

  /** verify if riskName is automatic or manual
    * @type {boolean}
  */
   set isAutomaticRiskName(boolean) {
    if (typeof boolean === 'boolean') {
      this.#isAutomaticRiskName = boolean;
    } else throw new Error(`Risk ${this.#riskId}: value is not a boolean`);
  }

  get isAutomaticRiskName() {
    return this.#isAutomaticRiskName;
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
    * add RiskAttackPath to map
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
    * deleteRiskAttackPath - delete RiskAttackPath
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
    * get RiskAttackPath
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
    * add RiskMitigation to map
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
    * delete RiskMitigation
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
    * get RiskMitigation
    * based on riskMitigationId for updating
    * @param {integer|null} businessAssetId - id of RiskMitigation
    * @returns {RiskMitigation}
  */
  getRiskMitigation(riskMitigationId) {
    if (this.#riskMitigationMap.has(riskMitigationId)) {
      return this.#riskMitigationMap.get(riskMitigationId);
    } throw Error(`Risk ${this.#riskId}: risk mitigation ${riskMitigationId}: doesn't exist`);
  }

  /**  calculated value of mitigations benefits when value of
  *  mitigation decision selected = 'Done' or 'Accepted'
  * @type {number|null}
*/
  set mitigationsBenefits(mitigationsBenefits) {
    if (isMitigationsBenefits(mitigationsBenefits)) this.#mitigationsBenefits = mitigationsBenefits;
    else throw new Error(`Risk ${this.#riskId}: mitigations benefits is an invalid null/double`);
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
    } else throw new Error(`Risk ${this.#riskId}: mitigations done benefits is an invalid null/double`);
  }

  get mitigationsDoneBenefits() {
    return this.#mitigationsDoneBenefits;
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
      projectName: this.#projectName,
      projectVersion: this.#projectVersion,
      riskName: this.#riskName,
      threatAgent: this.#threatAgent,
      threatAgentDetail: this.#threatAgentDetail,
      threatVerb: this.#threatVerb,
      threatVerbDetail: this.#threatVerbDetail,
      motivation: this.#motivation,
      motivationDetail: this.#motivationDetail,
      businessAssetRef: this.#businessAssetRef,
      supportingAssetRef: this.#supportingAssetRef,
      isAutomaticRiskName: this.#isAutomaticRiskName,
      riskLikelihood: this.#riskLikelihood.properties,
      riskImpact: this.#riskImpact.properties,
      riskAttackPaths: map2Array(this.#riskAttackPathMap),
      allAttackPathsName: this.#allAttackPathsName,
      allAttackPathsScore: this.#allAttackPathsScore,
      inherentRiskScore: this.#inherentRiskScore,
      riskMitigation: map2Array(this.#riskMitigationMap),
      mitigationsBenefits: this.#mitigationsBenefits,
      mitigationsDoneBenefits: this.#mitigationsDoneBenefits,
      mitigatedRiskScore: this.#mitigatedRiskScore,
      riskManagementDecision: this.#riskManagementDecision,
      riskManagementDetail: this.#riskManagementDetail,
      residualRiskScore: this.#residualRiskScore,
      residualRiskLevel: this.#residualRiskLevel,
    };
  }
}

module.exports = Risk;
