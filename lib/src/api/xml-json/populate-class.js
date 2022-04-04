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

const fs = require('fs');
const ISRAProject = require('../../model/classes/ISRAProject/isra-project');
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

// populating json data to each class
// Object.assign(target_class, source)
const populateClass = (data) => ((dataCopy) => {
  // Initialise new ISRAProject
  const israProject = new ISRAProject();

  // populate ISRAProject (meta)
  const {
    ISRAtracking, projectName, projectOrganization, projectVersion,
  } = dataCopy.ISRAmeta;

  Object.assign(israProject, { projectName, projectOrganization, projectVersion });

  // populate ISRAMetaTracking
  if (ISRAtracking.length !== 0) {
    ISRAtracking.forEach((tracking) => {
      const israMetaTracking = new ISRAMetaTracking();
      Object.assign(israMetaTracking, tracking);

      israProject.addMetaTracking(israMetaTracking);
    });
  }

  // populate ISRAProjectContext
  const israProjectContext = new ISRAProjectContext();

  if (dataCopy.ProjectContext.projectDescriptionAttachment !== '') {
    const buffer = new Buffer.from(dataCopy.ProjectContext.projectDescriptionAttachment, 'base64');
    fs.writeFile('lib/src/model/classes/asset/projectDescriptionAttachment.pdf', buffer, (err, result) => {
      if (err) { console.log('error in uploading attachment', err); }
    });
    dataCopy.ProjectContext.projectDescriptionAttachment = 'projectDescriptionAttachment.pdf';
  }

  Object.assign(israProjectContext, dataCopy.ProjectContext);
  israProject.israProjectContext = israProjectContext;

  // populate BusinessAsset & BusinessAssetProperties
  if (dataCopy.BusinessAsset.length !== 0) {
    dataCopy.BusinessAsset.forEach((businessAsset) => {
      const ba = new BusinessAsset();
      const baProperties = new BusinessAssetProperties();
      const { businessAssetId, businessAssetProperties, ...rest } = businessAsset;

      BusinessAsset.setIdCount(businessAssetId);
      Object.assign(baProperties, businessAssetProperties);
      Object.assign(ba, { businessAssetId, ...rest });
      ba.businessAssetProperties = baProperties;

      israProject.addBusinessAsset(ba);
    });
  }

  // populate SupportingAssetsDesc
  israProject.supportingAssetsDesc = dataCopy.SupportingAssetsDesc;

  // populate SupportingAsset
  if (dataCopy.SupportingAsset.length !== 0) {
    dataCopy.SupportingAsset.forEach((supportingAsset) => {
      const sa = new SupportingAsset();
      const { supportingAssetId, businessAssetRef, ...rest } = supportingAsset;

      SupportingAsset.setIdCount(supportingAssetId);
      Object.assign(sa, { supportingAssetId, ...rest });
      if (businessAssetRef.length !== 0) {
        businessAssetRef.forEach((ref) => {
          sa.addBusinessAssetRef(ref);
        });
      }

      israProject.addSupportingAsset(sa);
    });
  }

  // populate Risk
  if (dataCopy.Risk.length !== 0) {
    dataCopy.Risk.forEach((risk) => {
      const {
        riskId, riskName, riskLikelihood, riskImpact, riskAttackPaths, riskMitigation, ...restRisk
      } = risk;

      const r = new Risk();
      const rName = new RiskName();
      const rLikelihood = new RiskLikelihood();
      const rImpact = new RiskImpact();

      Risk.setIdCount(riskId);
      Object.assign(r, { riskId, ...restRisk });
      Object.assign(rName, riskName);
      Object.assign(rLikelihood, riskLikelihood);
      Object.assign(rImpact, riskImpact);
      r.riskName = rName;
      r.riskLikelihood = rLikelihood;
      r.riskImpact = rImpact;

      // populate Risk attack path
      if (riskAttackPaths.length !== 0) {
        riskAttackPaths.forEach((path) => {
          const rAttackPath = new RiskAttackPath();
          const { vulnerabilityRef, ...rest } = path;

          Object.assign(rAttackPath, rest);
          if (vulnerabilityRef.length !== 0) {
            vulnerabilityRef.forEach((ref) => {
              rAttackPath.addVulnerability(ref);
            });
          }

          r.addRiskAttackPath(rAttackPath);
        });
      }

      // populate Risk mitigation
      if (riskMitigation.length !== 0) {
        riskMitigation.forEach((mitigation) => {
          const rMitigation = new RiskMitigation();
          Object.assign(rMitigation, mitigation);

          r.addRiskMitigation(rMitigation);
        });
      }

      israProject.addRisk(r);
    });
  }

  // populate Vulnerability
  if (dataCopy.Vulnerability.length !== 0) {
    dataCopy.Vulnerability.forEach((vulnerability) => {
      const v = new Vulnerability();
      const { vulnerabilityId, supportingAssetRef, ...rest } = vulnerability;

      if (vulnerability.vulnerabilityDescriptionAttachment !== '') {
        const buffer = new Buffer.from(vulnerability.vulnerabilityDescriptionAttachment, 'base64');
        fs.writeFile('lib/src/model/classes/asset/vulnerabilityDescriptionAttachment.pdf', buffer, (err, result) => {
          if (err) { console.log('error in uploading attachment', err); }
        });
        vulnerability.vulnerabilityDescriptionAttachment = 'projectDescriptionAttachment.pdf';
      }

      Vulnerability.setIdCount(vulnerabilityId);
      Object.assign(v, { vulnerabilityId, ...rest });
      supportingAssetRef.forEach((ref) => {
        v.addSupportingAssetRef(ref);
      });

      israProject.addVulnerability(v);
    });
  }

  return {
    getISRAProject: () => israProject,
  };
})(data);

module.exports = populateClass;

// const ap = new RiskAttackPath();
// israProject.properties.Risk.get(4).updateRiskAttackPath(1, 'attackPathName', 'HELLO');

// console.log(israProject.properties.Risk.get(4).properties.riskAttackPaths.get(1).properties);
