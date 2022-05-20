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

const ISRAProject = require('../../model/classes/ISRAProject/isra-project');
const ISRAMetaTracking = require('../../model/classes/ISRAProject/isra-meta-tracking');
const SupportingAsset = require('../../model/classes/SupportingAsset/supporting-asset');
const BusinessAsset = require('../../model/classes/BusinessAsset/business-asset');
const BusinessAssetProperties = require('../../model/classes/BusinessAsset/business-asset-properties');
const Risk = require('../../model/classes/Risk/risk');
const RiskName = require('../../model/classes/Risk/risk-name');
const RiskLikelihood = require('../../model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../model/classes/Risk/risk-impact');
const RiskAttackPath = require('../../model/classes/Risk/risk-attack-path');
const RiskMitigation = require('../../model/classes/Risk/risk-mitigation');
const Vulnerability = require('../../model/classes/Vulnerability/vulnerability');
const populateClass = require('../xml-json/populate-class');

/**
  * Initialise new ISRA project
  * @function DataNew
  * @param {ISRAProject} israProject ISRA Project instance
  * @throws failed to populate class property
*/
const DataNew = (israProjectInstance) => {
  const israProject = new ISRAProject();

  // reset static idCount
  BusinessAsset.setIdCount(0);
  SupportingAsset.setIdCount(0);
  Risk.setIdCount(0);
  Vulnerability.setIdCount(0);

  // add  table rows/columns
  israProject.addMetaTracking(new ISRAMetaTracking());
  israProject.addBusinessAsset(new BusinessAsset());
  israProject.addSupportingAsset(new SupportingAsset());
  israProject.addRisk(new Risk());
  const risk = israProject.getRisk(1);
  risk.riskName = new RiskName();
  risk.riskLikelihood = new RiskLikelihood();
  risk.riskImpact = new RiskImpact();
  risk.addRiskAttackPath(new RiskAttackPath());
  risk.getRiskAttackPath(1).addVulnerability({
    vulnerabilityIdRef: null,
    score: null,
    name: '',
  });
  risk.addRiskMitigation(new RiskMitigation());
  israProject.addVulnerability(new Vulnerability());

  populateClass(JSON.parse(israProject.toJSON()), israProjectInstance);
};

module.exports = DataNew;
