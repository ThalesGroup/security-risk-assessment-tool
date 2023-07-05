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
    ISRAtracking, projectName, projectOrganization, projectVersion, classification, iteration, latestBusinessAssetId, latestSupportingAssetId, latestRiskId, latestVulnerabilityId
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
  const baIds = [], invalidBAs = [], missingBAIds = [], lastBAId = []; 
  data.BusinessAsset.forEach((businessAsset) => {
    if (businessAsset.businessAssetId && !baIds.includes(businessAsset.businessAssetId)) {
      const ba = new BusinessAsset();
      const baProperties = new BusinessAssetProperties();
      const { businessAssetId, businessAssetProperties, ...rest } = businessAsset;

      Object.assign(baProperties, businessAssetProperties);
      Object.assign(ba, { businessAssetId, ...rest });
      ba.businessAssetProperties = baProperties;

      israProject.addBusinessAsset(ba);
      baIds.push(businessAssetId)
    } else invalidBAs.push(businessAsset);
    
  });

  let highestBAId = baIds.length > 0 ? Math.max(...baIds) : 0;

  // populate SupportingAssetsDesc
  israProject.supportingAssetsDesc = data.SupportingAssetsDesc;

  // populate SupportingAsset
  const saIds = [], invalidSAs = [], missingSAIds = [];
  data.SupportingAsset.forEach((supportingAsset) => {
    const { supportingAssetId, businessAssetRef, ...rest } = supportingAsset;
    businessAssetRef.forEach((ref) => {
      if (!baIds.includes(ref)) {
        if(Number.isInteger(ref)) {
          missingBAIds.push(ref);
        }
      }
    });

    if (supportingAsset.supportingAssetId && !saIds.includes(supportingAsset.supportingAssetId)){
      const sa = new SupportingAsset();
      

      Object.assign(sa, { supportingAssetId, ...rest });
      businessAssetRef.forEach((ref) => {
        sa.addBusinessAssetRef(ref);
      });

    israProject.addSupportingAsset(sa);
    saIds.push(supportingAssetId)
    } else invalidSAs.push(supportingAsset);
    
  });

  //Sort missingBAIds 

  missingBAIds.sort((a,b) => a - b);

  let index = 0
  invalidBAs.forEach((invalidBA) => {
    let baId = null;
    
    if (invalidBAs.length === missingBAIds.length) {
      baId = missingBAIds[index];
    } 
    const ba = new BusinessAsset();
    const baProperties = new BusinessAssetProperties();
    const { businessAssetId, businessAssetProperties, ...rest } = invalidBA;
    index += 1;
    highestBAId += 1;
    Object.assign(baProperties, businessAssetProperties);
    if (baId) {
      Object.assign(ba, { businessAssetId: baId, ...rest });
    } else {
      Object.assign(ba, { businessAssetId: highestBAId? highestBAId: businessAssetId, ...rest });
    }
    
    ba.businessAssetProperties = baProperties;

    israProject.addBusinessAsset(ba);
    
  });

  // populate Risk
  const riskIds = [], invalidRisks = [];
  const assignRisk = (risk, r, rName, rLikelihood, rImpact, highestRiskId) => {
    const {
      projectName, projectVersion,
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
    const {
      projectName, projectVersion,
      riskId, riskName, riskLikelihood, riskImpact, riskAttackPaths, riskMitigation, ...restRisk
    } = risk;

    if (!saIds.includes(riskName.supportingAssetRef)) {
      if(Number.isInteger(riskName.supportingAssetRef)) {
        missingSAIds.push(riskName.supportingAssetRef);
      }
    }
    
    if(risk.riskId && !riskIds.includes(risk.riskId)){
      
      israProject.projectName = projectName;
      israProject.projectVersion = projectVersion;

      const r = new Risk();
      const rName = new RiskName();
      const rLikelihood = new RiskLikelihood();
      const rImpact = new RiskImpact();

      assignRisk(risk, r, rName, rLikelihood, rImpact);
      riskIds.push(riskId);
    } else invalidRisks.push(risk);
  });
  

  let highestSAId = saIds.length > 0 ? Math.max(...saIds) : 0;
  index = 0
  invalidSAs.forEach((invalidSA) => {

    let saId = null;
    
    if (invalidSAs.length === missingSAIds.length) {
      saId = missingSAIds[index];
    } 

    const sa = new SupportingAsset();
    const { supportingAssetId, businessAssetRef, ...rest } = invalidSA;
    index += 1;
    highestSAId += 1;
    if (saId) {
      Object.assign(sa, { supportingAssetId: saId, ...rest });
    } else {
      Object.assign(sa, { supportingAssetId: highestSAId? highestSAId: supportingAssetId, ...rest });
    }
    
    businessAssetRef.forEach((ref) => {
        sa.addBusinessAssetRef(ref);
    });
    
    israProject.addSupportingAsset(sa);
    // Since saID is updated, need to update attributes linked to saID such as risks and vulnerability



  });

  

  let highestRiskId = riskIds.length > 0 ? Math.max(...riskIds) : 0;

  invalidRisks.forEach((risk) => {
    const {
      projectName, projectVersion,
      riskId, riskName, riskLikelihood, riskImpact, riskAttackPaths, riskMitigation, ...restRisk
    } = risk;
    israProject.projectName = projectName;
    israProject.projectVersion = projectVersion;

    const r = new Risk();
    const rName = new RiskName();
    const rLikelihood = new RiskLikelihood();
    const rImpact = new RiskImpact();

    highestRiskId += 1;
    assignRisk(risk, r, rName, rLikelihood, rImpact, highestRiskId);
  });

  // populate Vulnerability
  const vulIds = [], invalidVuls = [];
  data.Vulnerability.forEach((vulnerability) => {
    if(vulnerability.vulnerabilityId && !vulIds.includes(vulnerability.vulnerabilityId)) {
      const {
        vulnerabilityId, supportingAssetRef, projectName, projectVersion, ...rest
      } = vulnerability;
      israProject.projectName = projectName;
      israProject.projectVersion = projectVersion;
      const v = new Vulnerability();
  
      Object.assign(v, { vulnerabilityId, ...rest });
      supportingAssetRef.forEach((ref) => {
        v.addSupportingAssetRef(ref);
      });
  
      israProject.addVulnerability(v);
    } else invalidVuls.push(vulnerability)
    
  });

  let highestVulId = vulIds.length > 0 ? Math.max(...vulIds) : 0;

  invalidVuls.forEach((invalidVul) => {
    const {
      vulnerabilityId, supportingAssetRef, projectName, projectVersion, ...rest
    } = invalidVul;
    israProject.projectName = projectName;
    israProject.projectVersion = projectVersion;
    const v = new Vulnerability();
    highestVulId += 1;
    Object.assign(v, { vulnerabilityId: highestVulId? highestVulId: vulnerabilityId, ...rest });
    supportingAssetRef.forEach((ref) => {
      v.addSupportingAssetRef(ref);
    });

    israProject.addVulnerability(v);
    // Since vulID is updated, need to update attributes linked to vulID which is Risks under attackPaths

  });

  BusinessAsset.setIdCount(latestBusinessAssetId);
  SupportingAsset.setIdCount(latestSupportingAssetId);
  Risk.setIdCount(latestRiskId < highestRiskId ? highestRiskId : latestRiskId);
  Vulnerability.setIdCount(latestVulnerabilityId);

  // populate ISRAProject (meta)
  Object.assign(israProject, { projectName, projectOrganization, projectVersion, classification, iteration, latestBusinessAssetId, latestSupportingAssetId, latestRiskId, latestVulnerabilityId });
};

module.exports = populateClass;
