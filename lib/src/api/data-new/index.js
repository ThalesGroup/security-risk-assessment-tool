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

const DataNew = (israProjectInstance) => {
  const israProject = israProjectInstance;

  israProject.addMetaTracking(new ISRAMetaTracking());
  israProject.addBusinessAsset(new BusinessAsset());
  israProject.getBusinessAsset(1).businessAssetProperties = new BusinessAssetProperties();
  israProject.addSupportingAsset(new SupportingAsset());
  israProject.addRisk(new Risk());
  const riskDefault = israProject.getRisk(1);
  riskDefault.riskName = new RiskName();
  riskDefault.riskLikelihood = new RiskLikelihood();
  riskDefault.riskImpact = new RiskImpact();
  riskDefault.addRiskAttackPath(new RiskAttackPath());
  riskDefault.addRiskMitigation(new RiskMitigation());
  israProject.addVulnerability(new Vulnerability());
};

module.exports = DataNew;
