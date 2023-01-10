/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
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

const ISRAMetaTracking = require('../../model/classes/ISRAProject/isra-meta-tracking');
const ISRAProjectContext = require('../../model/classes/ISRAProjectContext/isra-project-context');
const BusinessAsset = require('../../model/classes/BusinessAsset/business-asset');
const BusinessAssetProperties = require('../../model/classes/BusinessAsset/business-asset-properties');
const SupportingAsset = require('../../model/classes/SupportingAsset/supporting-asset');
const Risk = require('../../model/classes/Risk/risk');
const RiskName = require('../../model/classes/Risk/risk-name');
const RiskLikelihood = require('../../model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../model/classes/Risk/risk-impact');
const RiskAttackPath = require('../../model/classes/Risk/risk-attack-path');
const RiskMitigation = require('../../model/classes/Risk/risk-mitigation');
const Vulnerability = require('../../model/classes/Vulnerability/vulnerability');
const ISRAProject = require('../../model/classes/ISRAProject/isra-project');

/** populating each ISRA JSON data to the corresponding classes
         * @function populateClass
         * @param {object} data - valid ISRA JSON data
         * @param {ISRAProject} ISRAProject instance
         * @throws value of class property set is invalid
         * */
// Object.assign(target_class, source)
const populateClass = (data, israProject) => {
  const {
    ISRAtracking, projectName, projectOrganization, projectVersion, iteration, latestBusinessAssetId, latestSupportingAssetId, latestRiskId, latestVulnerabilityId
  } = data.ISRAmeta;

  // populate ISRAMetaTracking
  ISRAtracking.forEach((tracking) => {
    const israMetaTracking = new ISRAMetaTracking();
    Object.assign(israMetaTracking, tracking);
    israProject.addMetaTracking(israMetaTracking);
  });

  // populate ISRAProjectContext
  const israProjectContext = new ISRAProjectContext();
  Object.assign(israProjectContext, data.ProjectContext);
  israProject.israProjectContext = israProjectContext;

  // populate BusinessAsset & BusinessAssetProperties
  data.BusinessAsset.forEach((businessAsset) => {
    const ba = new BusinessAsset();
    const baProperties = new BusinessAssetProperties();
    const { businessAssetId, businessAssetProperties, ...rest } = businessAsset;

    BusinessAsset.setIdCount(businessAssetId);
    Object.assign(baProperties, businessAssetProperties);
    Object.assign(ba, { businessAssetId, ...rest });
    ba.businessAssetProperties = baProperties;

    israProject.addBusinessAsset(ba);
  });

  // populate SupportingAssetsDesc
  israProject.supportingAssetsDesc = data.SupportingAssetsDesc;

  // populate SupportingAsset
  data.SupportingAsset.forEach((supportingAsset) => {
    const sa = new SupportingAsset();
    const { supportingAssetId, businessAssetRef, ...rest } = supportingAsset;

    SupportingAsset.setIdCount(supportingAssetId);
    Object.assign(sa, { supportingAssetId, ...rest });
    businessAssetRef.forEach((ref) => {
      sa.addBusinessAssetRef(ref);
    });

    israProject.addSupportingAsset(sa);
  });

  // populate Risk
  const riskIds = [], invalidRisks = [];
  const assignRisk = (risk, r, rName, rLikelihood, rImpact, highestRiskId) => {
    const {
      projectNameRef, projectVersionRef,
      riskId, riskName, riskLikelihood, riskImpact, riskAttackPaths, riskMitigation, ...restRisk
    } = risk;

    Object.assign(r, { riskId: highestRiskId ? highestRiskId : riskId, ...restRisk });
    Object.assign(rName, riskName);
    Object.assign(rLikelihood, riskLikelihood);
    Object.assign(rImpact, riskImpact);
    r.riskName = rName;
    r.riskLikelihood = rLikelihood;
    r.riskImpact = rImpact;

    // populate Risk attack path
    riskAttackPaths.forEach((path) => {
      const rAttackPath = new RiskAttackPath();
      const { vulnerabilityRef, ...rest } = path;

      Object.assign(rAttackPath, rest);

      vulnerabilityRef.forEach((ref) => {
        rAttackPath.addVulnerability(ref);
      });

      r.addRiskAttackPath(rAttackPath);
    });

    // populate Risk mitigation
    riskMitigation.forEach((mitigation) => {
      RiskMitigation.setIdCount(mitigation.riskMitigationId);
      const rMitigation = new RiskMitigation();
      Object.assign(rMitigation, mitigation);

      r.addRiskMitigation(rMitigation);
    });

    israProject.addRisk(r);
  };

  data.Risk.forEach((risk) => {
    if(risk.riskId && !riskIds.includes(risk.riskId)){
      const {
        projectNameRef, projectVersionRef,
        riskId, riskName, riskLikelihood, riskImpact, riskAttackPaths, riskMitigation, ...restRisk
      } = risk;
      israProject.projectName = projectNameRef;
      israProject.projectVersion = projectVersionRef;

      const r = new Risk();
      const rName = new RiskName();
      const rLikelihood = new RiskLikelihood();
      const rImpact = new RiskImpact();

      Risk.setIdCount(riskId);
      assignRisk(risk, r, rName, rLikelihood, rImpact);
      riskIds.push(riskId);
    } else invalidRisks.push(risk);
  });

  let highestRiskId = riskIds.length > 0 ? Math.max(...riskIds) : 0;

  invalidRisks.forEach((risk) => {
    const {
      projectNameRef, projectVersionRef,
      riskId, riskName, riskLikelihood, riskImpact, riskAttackPaths, riskMitigation, ...restRisk
    } = risk;
    israProject.projectName = projectNameRef;
    israProject.projectVersion = projectVersionRef;

    const r = new Risk();
    const rName = new RiskName();
    const rLikelihood = new RiskLikelihood();
    const rImpact = new RiskImpact();

    highestRiskId += 1;
    Risk.setIdCount(highestRiskId);
    assignRisk(risk, r, rName, rLikelihood, rImpact, highestRiskId);
  });

  // populate Vulnerability
  data.Vulnerability.forEach((vulnerability) => {
    const {
      vulnerabilityId, supportingAssetRef, projectNameRef, projectVersionRef, ...rest
    } = vulnerability;
    israProject.projectName = projectNameRef;
    israProject.projectVersion = projectVersionRef;
    const v = new Vulnerability();

    Vulnerability.setIdCount(vulnerabilityId);
    Object.assign(v, { vulnerabilityId, ...rest });
    supportingAssetRef.forEach((ref) => {
      v.addSupportingAssetRef(ref);
    });

    israProject.addVulnerability(v);
  });

  // populate ISRAProject (meta)
  Object.assign(israProject, { projectName, projectOrganization, projectVersion, iteration, latestBusinessAssetId, latestSupportingAssetId, latestRiskId, latestVulnerabilityId });
};

module.exports = populateClass;
