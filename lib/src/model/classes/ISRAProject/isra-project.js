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

const { counter } = require('../../../utility-global');
const { isValidHtml } = require('../../validation/validation');
const { projectOrganizationEnums } = require('./enum');

const ISRAMetaTracking = require('./isra-meta-tracking');
const ISRAProjectContext = require('../ISRAProjectContext/isra-project-context');
const BusinessAsset = require('../BusinessAsset/business-asset');
const SupportingAsset = require('../SupportingAsset/supporting-asset');
const Risk = require('../Risk/risk');
const Vulnerability = require('../Vulnerability/vulnerability');

// contains all information of an ISRA Project
module.exports = class ISRAProject {
  // value of latest version of electron
  #appVersion = process.versions.electron;

  // text input of name of project
  #projectName;

  // value of selected organization of project
  #projectOrganization;

  // text input of version of project
  #projectVersion;

  // obj of ProjectContext
  #israProjectContext = {};

  // map of business assets created in project
  #businessAssetsMap = new Map();

  // input image or text of product architecture diagram of supporting asset
  #supportingAssetsDesc;

  // map of supporting assets created in project
  #supportingAssetsMap = new Map();

  // map of risks created in project
  #risksMap = new Map();

  // map of vulnerabilities in project
  #vulnerabilitiesMap = new Map();

  // map of ISRAMetaTracking in project
  #metaTrackingMap = new Map();

  // counts number of existing BusinessAssets
  #businessAssetsCount = 0;

  // counts number of existing SupportingAssets
  #supportingAssetsCount = 0;

  // counts number of existing Risks
  #risksCount = 0;

  // counts number of existing Vulnerabilities
  #vulnerabilitiesCount = 0;

  set projectName(projectName) {
    if (typeof projectName === 'string') this.#projectName = projectName;
    else throw new Error('Project name is not a string');
  }

  set projectOrganization(projectOrganization) {
    if (typeof projectOrganization === 'string' && projectOrganization in projectOrganizationEnums) this.#projectOrganization = projectOrganization;
    else throw new Error('Project organization is not a string or invalid');
  }

  set projectVersion(projectVersion) {
    if (typeof projectVersion === 'string') this.#projectVersion = projectVersion;
    else throw new Error('Project version is not a string');
  }

  set israProjectContext(israProjectContext) {
    if (israProjectContext instanceof ISRAProjectContext) {
      this.#israProjectContext = israProjectContext;
    } else throw new Error('ISRA project context added not an instanceof ISRAProjectContext');
  }

  // add BusinessAsset to businessAssetMap (key=businessAssetId)
  addBusinessAsset(businessAsset) {
    if (businessAsset instanceof BusinessAsset) {
      this.#businessAssetsMap.set(
        businessAsset.properties.businessAssetId,
        businessAsset,
      );
      this.#businessAssetsCount = this.#businessAssetsMap.size;
    } else throw Error(`Business asset ${businessAsset.properties.businessAssetId} added not an instanceof BusinessAsset`);
  }

  // delete BusinessAsset from businessAssetMap based on businessAssetId
  deleteBusinessAsset(businessAssetId) {
    if (this.#businessAssetsMap.has(businessAssetId)) {
      this.#businessAssetsMap.delete(businessAssetId);
      this.#businessAssetsCount = this.#businessAssetsMap.size;
    } else throw Error(`Business asset ${businessAssetId}: doesn't exist`);
  }

  // updates BusinessAsset based on businessAssetId
  updateBusinessAsset(businessAssetId, property, value) {
    if (this.#businessAssetsMap.has(businessAssetId)) {
      const businessAsset = this.#businessAssetsMap.get(businessAssetId);
      businessAsset[property] = value;
    } else throw Error(`Business asset ${businessAssetId}: doesn't exist`);
  }

  set supportingAssetsDesc(supportingAssetsDesc) {
    if (typeof supportingAssetsDesc === 'string' && isValidHtml(supportingAssetsDesc)) this.#supportingAssetsDesc = supportingAssetsDesc;
    else throw new Error('Supporting asset desc is not a html string');
  }

  // add SupportingAsset to supportingAssetMap (key=supportingAssetId)
  addSupportingAsset(supportingAsset) {
    if (supportingAsset instanceof SupportingAsset) {
      this.#supportingAssetsMap.set(
        supportingAsset.properties.supportingAssetId,
        supportingAsset,
      );
      this.#supportingAssetsCount = this.#supportingAssetsMap.size;
    } else throw Error(`Supporting asset ${supportingAsset.properties.supportingAssetId} added not an instanceof SupportingAsset`);
  }

  // delete SupportingAsset from supportingAssetMap based on supportingAssetId
  deleteSupportingAsset(supportingAssetId) {
    if (this.#supportingAssetsMap.has(supportingAssetId)) {
      this.#supportingAssetsMap.delete(supportingAssetId);
      this.#supportingAssetsCount = this.#supportingAssetsMap.size;
    } else throw Error(`Supporting asset ${supportingAssetId}: doesn't exist`);
  }

  // updates SupportingAsset based on supportingAssetId
  updateSupportingAsset(supportingAssetId, property, value) {
    if (this.#supportingAssetsMap.has(supportingAssetId)) {
      const supportingAsset = this.#supportingAssetsMap.get(supportingAssetId);
      supportingAsset[property] = value;
    } else throw Error(`Supporting asset ${supportingAssetId}: doesn't exist`);
  }

  // add Risk to riskMap (key=riskId)
  addRisk(risk) {
    if (risk instanceof Risk) {
      this.#risksMap.set(risk.properties.riskId, risk);
      this.#risksCount = this.#risksMap.size;
    } else throw Error(`Risk ${risk.properties.riskId} added not an instanceof Risk`);
  }

  // delete Risk from riskMap based on riskId
  deleteRisk(riskId) {
    if (this.#risksMap.has(riskId)) {
      this.#risksMap.delete(riskId);
      this.#risksCount = this.#risksMap.size;
    } else throw Error(`Risk ${riskId}: doesn't exist`);
  }

  // updates Risk based on riskId
  updateRisk(riskId, property, value) {
    if (this.#risksMap.has(riskId)) {
      const risk = this.#risksMap.get(riskId);
      risk[property] = value;
    } else throw Error(`Risk ${riskId}: doesn't exist`);
  }

  // add Vulnerability to vulnerabilitiesMap (key=vulnerabilityId)
  addVulnerability(vulnerability) {
    if (vulnerability instanceof Vulnerability) {
      this.#vulnerabilitiesMap.set(
        vulnerability.properties.vulnerabilityId,
        vulnerability,
      );
      this.#vulnerabilitiesCount = this.#vulnerabilitiesMap.size;
    } else throw Error(`Vulnerability ${vulnerability.properties.vulnerabilityId} added not an instanceof Vulnerability`);
  }

  // delete Vulnerability from vulnerabilitiesMap based on vulnerabilityId
  deleteVulnerability(vulnerabilityId) {
    if (this.#vulnerabilitiesMap.has(vulnerabilityId)) {
      this.#vulnerabilitiesMap.delete(vulnerabilityId);
      this.#vulnerabilitiesCount = this.#vulnerabilitiesMap.size;
    } else throw Error(`Vulnerability ${vulnerabilityId}: doesn't exist`);
  }

  // updates Vulnerability based on vulnerabilityId
  updateVulnerability(vulnerabilityId, property, value) {
    if (this.#vulnerabilitiesMap.has(vulnerabilityId)) {
      const vulnerability = this.#vulnerabilitiesMap.get(vulnerabilityId);
      vulnerability[property] = value;
    } else throw Error(`Vulnerability ${vulnerabilityId}: doesn't exist`);
  }

  // add ISRAMetaTracking to metaTrackingMap (key=trackingIteration)
  addMetaTracking(metaTracking) {
    if (metaTracking instanceof ISRAMetaTracking) {
      const meta = metaTracking;
      meta.trackingIteration = this.#metaTrackingMap.size + 1;
      this.#metaTrackingMap.set(metaTracking.properties.trackingIteration, metaTracking);
    } else throw Error(`ISRA meta tracking ${metaTracking.properties.trackingIteration}: added not an instanceof ISRAMetaTracking`);
  }

  // delete ISRAMetaTracking from metaTrackingMap based on trackingIteration
  deleteMetaTracking(trackingIteration) {
    if (this.#metaTrackingMap.has(trackingIteration)) {
      this.#metaTrackingMap.delete(trackingIteration);

      if (this.#metaTrackingMap.has(trackingIteration) && (this.#metaTrackingMap.size
        < Array.from(this.#metaTrackingMap.values()).pop().properties.trackingIteration)) {
        const metaTrackingArr = [];
        const idCounter = counter();

        this.#metaTrackingMap.forEach((val, key) => {
          const metaTracking = this.#metaTrackingMap.get(key);
          idCounter.increment();
          metaTracking.trackingIteration = metaTracking.trackingIteration === idCounter.getCount()
            ? metaTracking.trackingIteration : idCounter.getCount();
          metaTrackingArr.push(metaTracking);
        });

        this.#metaTrackingMap.clear();

        metaTrackingArr.forEach((metaTracking) => {
          this.#metaTrackingMap.set(metaTracking.properties.trackingIteration, metaTracking);
        });
      }
    } else throw Error(`ISRA meta tracking ${trackingIteration}: iteration doesn't exist`);
  }

  // updates ISRAMetaTracking based on trackingIteration
  updateMetaTracking(trackingIteration, property, value) {
    if (this.#metaTrackingMap.has(trackingIteration)) {
      const metaTracking = this.#metaTrackingMap.get(trackingIteration);
      metaTracking[property] = value;
    } else throw Error(`ISRA meta tracking ${trackingIteration}: doesn't exist`);
  }

  // get obj of relevant properties for storage
  get properties() {
    return {
      ISRAmeta: {
        appVersion: this.#appVersion,
        projectName: this.#projectName,
        projectOrganization: this.#projectOrganization,
        projectVersion: this.#projectVersion,
        ISRAtracking: this.#metaTrackingMap,
        businessAssetsCount: this.#businessAssetsCount,
        supportingAssetsCount: this.#supportingAssetsCount,
        risksCount: this.#risksCount,
        vulnerabilitiesCount: this.#vulnerabilitiesCount,
      },
      ProjectContext: this.#israProjectContext,
      BusinessAsset: this.#businessAssetsMap,
      SupportingAssetsDesc: this.#supportingAssetsDesc,
      SupportingAsset: this.#supportingAssetsMap,
      Risk: this.#risksMap,
      Vulnerability: this.#vulnerabilitiesMap,
    };
  }
};
