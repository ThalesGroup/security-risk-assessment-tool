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
  isAppVersion,
  isProjectName,
  isProjectOrganization,
  isProjectVersion,
  isSupportingAssetDesc,
} = require('./validation');

const { counter } = require('../../../utility-global');
const { map2Array } = require('../utility');
const validateJsonSchema = require('../../../api/xml-json/validate-json-schema');

const ISRAMetaTracking = require('./isra-meta-tracking');
const ISRAProjectContext = require('../ISRAProjectContext/isra-project-context');
const BusinessAsset = require('../BusinessAsset/business-asset');
const SupportingAsset = require('../SupportingAsset/supporting-asset');
const Risk = require('../Risk/risk');
const Vulnerability = require('../Vulnerability/vulnerability');

/**
  * Create a ISRA Project with private members, contains all information of project
  * @throws Project name is not a string
  * @throws Project organization is an invalid string
  * @throws Project version is not a string
  * @throws ISRA project context added not an instanceof ISRAProjectContext
  * @throws Business asset (businessAssetId) added not an instanceof BusinessAsset
  * @throws Business asset (businessAssetId): doesn't exist
  * @throws Supporting asset desc is invalid html string
  * @throws Supporting asset (supportingAssetId) added not an instanceof SupportingAsset
  * @throws Supporting asset (supportingAssetId): doesn't exist
  * @throws Risk (riskId) added not an instanceof Risk
  * @throws Risk (riskId): doesn't exist
  * @throws Vulnerability (vulnerabilityId) added not an instanceof Vulnerability
  * @throws Vulnerability (vulnerabilityId): doesn't exist
*/
class ISRAProject {
  // value of latest app template version
  #appVersion;

  #projectName;

  #projectOrganization;

  #projectVersion;

  #israProjectContext = {};

  // map of business assets created in project
  #businessAssetsMap = new Map();

  #supportingAssetsDesc;

  // map of supporting assets created in project
  #supportingAssetsMap = new Map();

  // map of risks created in project
  #risksMap = new Map();

  // map of vulnerabilities in project
  #vulnerabilitiesMap = new Map();

  // map of ISRAMetaTracking in project
  #metaTrackingMap = new Map();

  /** counts number of existing BusinessAssets
    * @type {integer}
  */
  #businessAssetsCount = 0;

  /** counts number of existing SupportingAssets
    * @type {integer}
  */
  #supportingAssetsCount = 0;

  /** counts number of existing Risks
    * @type {integer}
  */
  #risksCount = 0;

  /** counts number of existing Vulnerabilities
    * @type {integer}
  */
  #vulnerabilitiesCount = 0;

  /** app version number
    * @type {integer}
  */
  set appVersion(appVersion) {
    if (isAppVersion(appVersion)) this.#appVersion = appVersion;
    else throw new Error('App version is not an integer/null');
  }

  /** text input of name of project
    * @type {string}
  */
  set projectName(projectName) {
    if (isProjectName(projectName)) this.#projectName = projectName;
    else throw new Error('Project name is not a string');
  }

  get projectName() {
    return this.#projectName;
  }

  /** value of selected organization of project
    * @type {string}
  */
  set projectOrganization(projectOrganization) {
    if (isProjectOrganization(projectOrganization)) {
      this.#projectOrganization = projectOrganization;
    } else throw new Error('Project organization is an invalid string');
  }

  get projectOrganization() {
    return this.#projectOrganization;
  }

  /** text input of version of project
    * @type {string}
  */
  set projectVersion(projectVersion) {
    if (isProjectVersion(projectVersion)) this.#projectVersion = projectVersion;
    else throw new Error('Project version is not a string');
  }

  get projectVersion() {
    return this.#projectVersion;
  }

  /** obj of ProjectContext
    * @type {ISRAProjectContext}
  */
  set israProjectContext(israProjectContext) {
    if (israProjectContext instanceof ISRAProjectContext) {
      this.#israProjectContext = israProjectContext;
    } else throw new Error('ISRA project context added not an instanceof ISRAProjectContext');
  }

  get israProjectContext() {
    return this.#israProjectContext;
  }

  /**
    * @property {function} addBusinessAsset - add Business Asset to map
    * @param {BusinessAsset} businessAsset - instance of Business Asset
  */
  addBusinessAsset(businessAsset) {
    if (businessAsset instanceof BusinessAsset) {
      this.#businessAssetsMap.set(
        businessAsset.businessAssetId,
        businessAsset,
      );
      this.#businessAssetsCount = this.#businessAssetsMap.size;
    } else throw Error(`Business asset ${businessAsset.businessAssetId} added not an instanceof BusinessAsset`);
  }

  /**
    * delete BusinessAsset
    * from businessAssetMap based on businessAssetId
    * @param {integer|null} businessAssetId - id of Business Asset
  */
  deleteBusinessAsset(businessAssetId) {
    if (this.#businessAssetsMap.has(businessAssetId)) {
      this.#businessAssetsMap.delete(businessAssetId);
      this.#businessAssetsCount = this.#businessAssetsMap.size;
    } else throw Error(`Business asset ${businessAssetId}: doesn't exist`);
  }

  /**
    * get BusinessAsset
    * based on businessAssetId for updating
    * @param {integer|null} businessAssetId - id of Business Asset
    * @returns {BusinessAsset}
  */
  getBusinessAsset(businessAssetId) {
    if (this.#businessAssetsMap.has(businessAssetId)) {
      return this.#businessAssetsMap.get(businessAssetId);
    } throw Error(`Business asset ${businessAssetId}: doesn't exist`);
  }

  /** input image or text of product architecture diagram of supporting asset
    * @type {string}
  */
  set supportingAssetsDesc(supportingAssetsDesc) {
    if (isSupportingAssetDesc(supportingAssetsDesc)) {
      this.#supportingAssetsDesc = supportingAssetsDesc;
    } else throw new Error('Supporting asset desc is invalid html string');
  }

  get supportingAssetsDesc() {
    return this.#supportingAssetsDesc;
  }

  /**
    * add Supporting Asset to map
    * @param {SupportingAsset} supportingAsset - instance of Supporting Asset
  */
  addSupportingAsset(supportingAsset) {
    if (supportingAsset instanceof SupportingAsset) {
      this.#supportingAssetsMap.set(
        supportingAsset.supportingAssetId,
        supportingAsset,
      );
      this.#supportingAssetsCount = this.#supportingAssetsMap.size;
    } else throw Error(`Supporting asset ${supportingAsset.supportingAssetId} added not an instanceof SupportingAsset`);
  }

  /**
    * delete SupportingAsset
    * from supportingAssetMap based on supportingAssetId
    * @param {integer|null} supportingAssetId - id of Supporting Asset
  */
  deleteSupportingAsset(supportingAssetId) {
    if (this.#supportingAssetsMap.has(supportingAssetId)) {
      this.#supportingAssetsMap.delete(supportingAssetId);
      this.#supportingAssetsCount = this.#supportingAssetsMap.size;
    } else throw Error(`Supporting asset ${supportingAssetId}: doesn't exist`);
  }

  /**
    * get SupportingAsset
    * based on supportingAssetId for updating
    * @param {integer|null} supportingAssetId - id of Supporting Asset
    * @returns {SupportingAsset}
  */
  getSupportingAsset(supportingAssetId) {
    if (this.#supportingAssetsMap.has(supportingAssetId)) {
      return this.#supportingAssetsMap.get(supportingAssetId);
    } throw Error(`Supporting asset ${supportingAssetId}: doesn't exist`);
  }

  /**
    * add Risk to map
    * @param {Risk} risk - instance of Risk
  */
  addRisk(risk) {
    if (risk instanceof Risk) {
      this.#risksMap.set(risk.riskId, risk);
      this.#risksCount = this.#risksMap.size;
    } else throw Error(`Risk ${risk.riskId} added not an instanceof Risk`);
  }

  /**
    * delete Risk
    * from risksMap based on riskId
    * @param {integer|null} riskId - id of Risk
  */
  deleteRisk(riskId) {
    if (this.#risksMap.has(riskId)) {
      this.#risksMap.delete(riskId);
      this.#risksCount = this.#risksMap.size;
    } else throw Error(`Risk ${riskId}: doesn't exist`);
  }

  /**
    * get Risk
    * based on riskId for updating
    * @param {integer|null} riskId - id of Risk
    * @returns {Risk}
  */
  getRisk(riskId) {
    if (this.#risksMap.has(riskId)) {
      return this.#risksMap.get(riskId);
    } throw Error(`Risk ${riskId}: doesn't exist`);
  }

  /**
    * add Vulnerability to map
    * @param {Vulnerability} vulnerability - instance of Vulnerability
  */
  addVulnerability(vulnerability) {
    if (vulnerability instanceof Vulnerability) {
      this.#vulnerabilitiesMap.set(
        vulnerability.vulnerabilityId,
        vulnerability,
      );
      this.#vulnerabilitiesCount = this.#vulnerabilitiesMap.size;
    } else throw Error(`Vulnerability ${vulnerability.vulnerabilityId} added not an instanceof Vulnerability`);
  }

  /**
    * delete Vulnerability
    * from vulnerabilitiesMap based on vulnerabilityId
    * @param {integer|null} vulnerabilityId - id of Vulnerability
  */
  deleteVulnerability(vulnerabilityId) {
    if (this.#vulnerabilitiesMap.has(vulnerabilityId)) {
      this.#vulnerabilitiesMap.delete(vulnerabilityId);
      this.#vulnerabilitiesCount = this.#vulnerabilitiesMap.size;
    } else throw Error(`Vulnerability ${vulnerabilityId}: doesn't exist`);
  }

  /**
    * get Vulnerability
    * based on vulnerabilityId for updating
    * @param {integer|null} vulnerabilityId - id of Vulnerability
    * @returns {Vulnerability}
  */
  getVulnerability(vulnerabilityId) {
    if (this.#vulnerabilitiesMap.has(vulnerabilityId)) {
      return this.#vulnerabilitiesMap.get(vulnerabilityId);
    } throw Error(`Vulnerability ${vulnerabilityId}: doesn't exist`);
  }

  /**
    * add ISRAMetaTracking to map
    * @param {ISRAMetaTracking} metaTracking - instance of ISRAMetaTracking
  */
  addMetaTracking(metaTracking) {
    if (metaTracking instanceof ISRAMetaTracking) {
      const meta = metaTracking;
      meta.trackingIteration = this.#metaTrackingMap.size + 1;
      this.#metaTrackingMap.set(metaTracking.trackingIteration, metaTracking);
    } else throw Error(`ISRA meta tracking ${metaTracking.trackingIteration}: added not an instanceof ISRAMetaTracking`);
  }

  /**
    * delete ISRAMetaTracking
    * from metaTrackingMap based on trackingIteration
    * @param {integer|null} trackingIteration - trackingIteration
  */
  deleteMetaTracking(trackingIteration) {
    if (this.#metaTrackingMap.has(trackingIteration)) {
      this.#metaTrackingMap.delete(trackingIteration);

      if (this.#metaTrackingMap.size > 0 && (this.#metaTrackingMap.size
        < Array.from(this.#metaTrackingMap.values()).pop().trackingIteration)) {
        const metaTrackingArr = [];
        const idCounter = counter();

        this.#metaTrackingMap.forEach((val) => {
          const metaTracking = val;
          idCounter.increment();
          metaTracking.trackingIteration = idCounter.getCount();
          metaTrackingArr.push(metaTracking);
        });

        this.#metaTrackingMap.clear();

        metaTrackingArr.forEach((metaTracking) => {
          this.#metaTrackingMap.set(metaTracking.trackingIteration, metaTracking);
        });
      }
    } else throw Error(`ISRA meta tracking ${trackingIteration}: iteration doesn't exist`);
  }

  /**
    * get ISRAMetaTracking
    * based on trackingIteration for updating
    * @param {integer|null} trackingIteration -  trackingIteration
    * @returns {ISRAMetaTracking}
  */
  getMetaTracking(trackingIteration) {
    if (this.#metaTrackingMap.has(trackingIteration)) {
      return this.#metaTrackingMap.get(trackingIteration);
    } throw Error(`ISRA meta tracking ${trackingIteration}: doesn't exist`);
  }

  /** get object of all values of each member property in ISRAProject
    * @type {object}
  */
  get properties() {
    return {
      ISRAmeta: {
        appVersion: this.#appVersion,
        projectName: this.#projectName,
        projectOrganization: this.#projectOrganization,
        projectVersion: this.#projectVersion,
        ISRAtracking: map2Array(this.#metaTrackingMap),
        businessAssetsCount: this.#businessAssetsCount,
        supportingAssetsCount: this.#supportingAssetsCount,
        risksCount: this.#risksCount,
        vulnerabilitiesCount: this.#vulnerabilitiesCount,
      },
      ProjectContext: this.#israProjectContext.properties,
      BusinessAsset: map2Array(this.#businessAssetsMap),
      SupportingAssetsDesc: this.#supportingAssetsDesc,
      SupportingAsset: map2Array(this.#supportingAssetsMap),
      Risk: map2Array(this.#risksMap),
      Vulnerability: map2Array(this.#vulnerabilitiesMap),
    };
  }

  /** convert all class values into JSON for data store
    * @type {function}
    * @returns {string}
  */
  toJSON() {
    const israValidJSONData = validateJsonSchema(this.properties);
    return JSON.stringify(israValidJSONData, null, 4);
  }
}

module.exports = ISRAProject;
