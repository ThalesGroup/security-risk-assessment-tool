const { dialog, BrowserWindow } = require('electron');

const BusinessAsset = require('../../../lib/src/model/classes/BusinessAsset/business-asset');
const SupportingAsset = require('../../../lib/src/model/classes/SupportingAsset/supporting-asset');
const Vulnerability = require('../../../lib/src/model/classes/Vulnerability/vulnerability');
const Risk = require('../../../lib/src/model/classes/Risk/risk');
const RiskLikelihood = require('../../../lib/src/model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../../lib/src/model/classes/Risk/risk-impact');
const BusinessAssetProperties = require('../../../lib/src/model/classes/BusinessAsset/business-asset-properties');

// Prompt the user when an imported item collides with an existing one by name.
// Returns one of 'replace' | 'skip' | 'replaceAll' | 'skipAll'.
function promptDuplicate(itemType, itemName) {
  const parent = BrowserWindow.getFocusedWindow();
  const choice = dialog.showMessageBoxSync(parent, {
    type: 'question',
    buttons: ['Replace', 'Skip', 'Replace All', 'Skip All'],
    defaultId: 1,
    cancelId: 1,
    title: 'Duplicate item',
    message: `${itemType} "${itemName}" already exists.`,
    detail: 'Replace the existing item with the imported one, or skip it?',
  });
  return ['replace', 'skip', 'replaceAll', 'skipAll'][choice];
}

// Resolve what to do with a single duplicate, honoring any bulk decision already
// taken in this import run. Returns { action: 'replace'|'skip', bulkDecision }.
function resolveDuplicate(bulkDecision, itemType, itemName) {
  if (bulkDecision === 'replaceAll') return { action: 'replace', bulkDecision };
  if (bulkDecision === 'skipAll') return { action: 'skip', bulkDecision };

  const choice = promptDuplicate(itemType, itemName);
  if (choice === 'replaceAll') return { action: 'replace', bulkDecision: 'replaceAll' };
  if (choice === 'skipAll') return { action: 'skip', bulkDecision: 'skipAll' };
  return { action: choice, bulkDecision };
}

function importData(importSelection, currentISRA, importedISRA) {

  if (importSelection.businessAssets.length > 0) {
    importBA( currentISRA, importedISRA, importSelection.businessAssets)
  }

  if (importSelection.supportingAssets.length > 0) {
    importSA( currentISRA, importedISRA, importSelection.supportingAssets)
  }


  if (importSelection.risks.length > 0) {
    importRisk( currentISRA, importedISRA, importSelection.risks)
  }

  if (importSelection.vulnerabilities.length > 0) {
    importVul( currentISRA, importedISRA, importSelection.vulnerabilities)
  }

}


function buildBusinessAssetProperties(source) {
  const props = new BusinessAssetProperties();
  props.businessAssetConfidentiality = source.businessAssetConfidentiality;
  props.businessAssetIntegrity = source.businessAssetIntegrity;
  props.businessAssetAvailability = source.businessAssetAvailability;
  props.businessAssetAuthenticity = source.businessAssetAuthenticity;
  props.businessAssetAuthorization = source.businessAssetAuthorization;
  props.businessAssetNonRepudiation = source.businessAssetNonRepudiation;
  return props;
}

function importBA(currentISRA, importedISRA, selectedBAIds) {
  let highestBAId = currentISRA.properties.ISRAmeta.latestBusinessAssetId;
  const currentBusinessAssets = currentISRA.properties.BusinessAsset
  const importedBusinessAssets = importedISRA.BusinessAsset

  const selectedBusinessAssets = importedBusinessAssets.filter(
    (importedBA) => selectedBAIds.includes(importedBA.businessAssetId),
  );

  let bulkDecision = null;

  selectedBusinessAssets.forEach((selectedBA) => {
    const existing = currentBusinessAssets.find(
      (currentBA) => currentBA.businessAssetName === selectedBA.businessAssetName,
    );

    if (!existing) {
      highestBAId += 1;

      const newBusinessAsset = new BusinessAsset();
      newBusinessAsset.businessAssetId = highestBAId;
      newBusinessAsset.businessAssetName = selectedBA.businessAssetName;
      newBusinessAsset.businessAssetType = selectedBA.businessAssetType;
      newBusinessAsset.businessAssetDescription = selectedBA.businessAssetDescription;
      newBusinessAsset.businessAssetProperties = buildBusinessAssetProperties(selectedBA.businessAssetProperties);
      currentISRA.addBusinessAsset(newBusinessAsset);
      return;
    }

    const decision = resolveDuplicate(bulkDecision, 'Business Asset', selectedBA.businessAssetName);
    bulkDecision = decision.bulkDecision;
    if (decision.action === 'skip') return;

    // Replace: overwrite fields on the existing instance, keep its id so any
    // references from supporting assets / risks remain valid.
    const target = currentISRA.getBusinessAsset(existing.businessAssetId);
    target.businessAssetName = selectedBA.businessAssetName;
    target.businessAssetType = selectedBA.businessAssetType;
    target.businessAssetDescription = selectedBA.businessAssetDescription;
    target.businessAssetProperties = buildBusinessAssetProperties(selectedBA.businessAssetProperties);
  });
}

function importSA(currentISRA, importedISRA,  selectedSAIds) {
  let highestSAId = currentISRA.properties.ISRAmeta.latestSupportingAssetId;
  const currentSupportingAssets = currentISRA.properties.SupportingAsset
  const importedSupportingAssets = importedISRA.SupportingAsset

  const selectedSupportingAssets = importedSupportingAssets.filter(
    (importedSA) => selectedSAIds.includes(importedSA.supportingAssetId),
  );

  let bulkDecision = null;

  selectedSupportingAssets.forEach((selectedSA) => {
    const existing = currentSupportingAssets.find(
      (currentSA) => currentSA.supportingAssetName === selectedSA.supportingAssetName,
    );

    if (!existing) {
      highestSAId += 1;

      const newSupportingAsset = new SupportingAsset();
      newSupportingAsset.supportingAssetId = highestSAId;
      newSupportingAsset.supportingAssetName = selectedSA.supportingAssetName;
      newSupportingAsset.supportingAssetType = selectedSA.supportingAssetType;
      newSupportingAsset.supportingAssetSecurityLevel = selectedSA.supportingAssetSecurityLevel;

      currentISRA.addSupportingAsset(newSupportingAsset);
      return;
    }

    const decision = resolveDuplicate(bulkDecision, 'Supporting Asset', selectedSA.supportingAssetName);
    bulkDecision = decision.bulkDecision;
    if (decision.action === 'skip') return;

    const target = currentISRA.getSupportingAsset(existing.supportingAssetId);
    target.supportingAssetName = selectedSA.supportingAssetName;
    target.supportingAssetType = selectedSA.supportingAssetType;
    target.supportingAssetSecurityLevel = selectedSA.supportingAssetSecurityLevel;
  });
}

function applyRiskFields(target, source) {
  target.riskName = source.riskName;
  target.threatAgent = source.threatAgent;
  target.threatAgentDetail = source.threatAgentDetail;
  target.threatVerb  = source.threatVerb;
  target.threatVerbDetail = source.threatVerbDetail;
  target.motivation = source.motivation;
  target.motivationDetail = source.motivationDetail;
  target.isAutomaticRiskName = source.isAutomaticRiskName;
  target.mitigationsBenefits = source.mitigationsBenefits;
  target.mitigationsDoneBenefits = source.mitigationsDoneBenefits;
  target.mitigatedRiskScore = source.mitigatedRiskScore;
  target.riskManagementDecision = source.riskManagementDecision;
  target.riskManagementDetail = source.riskManagementDetail;
  target.residualRiskScore = source.residualRiskScore;
  target.residualRiskLevel = source.residualRiskLevel;

  const newRiskLikelihood = new RiskLikelihood();
  newRiskLikelihood.riskLikelihood = source.riskLikelihood.riskLikelihood;
  newRiskLikelihood.riskLikelihoodDetail = source.riskLikelihood.riskLikelihoodDetail;
  newRiskLikelihood.skillLevel = source.riskLikelihood.skillLevel;
  newRiskLikelihood.reward = source.riskLikelihood.reward;
  newRiskLikelihood.accessResources = source.riskLikelihood.accessResources;
  newRiskLikelihood.intrusionDetection = source.riskLikelihood.intrusionDetection;
  newRiskLikelihood.size = source.riskLikelihood.size;
  newRiskLikelihood.threatFactorScore = source.riskLikelihood.threatFactorScore;
  newRiskLikelihood.threatFactorLevel = source.riskLikelihood.threatFactorLevel;
  newRiskLikelihood.occurrence = source.riskLikelihood.occurrence;
  newRiskLikelihood.occurrenceLevel = source.riskLikelihood.occurrenceLevel;
  newRiskLikelihood.isOWASPLikelihood = source.riskLikelihood.isOWASPLikelihood;
  target.riskLikelihood = newRiskLikelihood;

  const newRiskImpact = new RiskImpact();
  newRiskImpact.businessAssetConfidentialityFlag = source.riskImpact.businessAssetConfidentialityFlag;
  newRiskImpact.businessAssetIntegrityFlag = source.riskImpact.businessAssetIntegrityFlag;
  newRiskImpact.businessAssetAvailabilityFlag = source.riskImpact.businessAssetAvailabilityFlag;
  newRiskImpact.businessAssetAuthenticityFlag = source.riskImpact.businessAssetAuthenticityFlag;
  newRiskImpact.businessAssetAuthorizationFlag = source.riskImpact.businessAssetAuthorizationFlag;
  newRiskImpact.businessAssetNonRepudiationFlag = source.riskImpact.businessAssetNonRepudiationFlag;
  target.riskImpact = newRiskImpact;

  target.riskAttackPaths = source.riskAttackPaths;
}

function importRisk(currentISRA, importedISRA, selectedRiskIds) {
  let highestRiskId = currentISRA.properties.ISRAmeta.latestRiskId;
  const currentRisks = currentISRA.properties.Risk;
  const importedRisks = importedISRA.Risk;

  const selectedRisks = importedRisks.filter(
    (importedRisk) => selectedRiskIds.includes(importedRisk.riskId),
  );

  let bulkDecision = null;

  selectedRisks.forEach((selectedRisk) => {
    const existing = currentRisks.find(
      (currentRisk) => currentRisk.riskName === selectedRisk.riskName,
    );

    if (!existing) {
      highestRiskId += 1;
      const newRisk = new Risk();
      newRisk.riskId = highestRiskId;
      applyRiskFields(newRisk, selectedRisk);
      currentISRA.addRisk(newRisk);
      return;
    }

    const decision = resolveDuplicate(bulkDecision, 'Risk', selectedRisk.riskName);
    bulkDecision = decision.bulkDecision;
    if (decision.action === 'skip') return;

    const target = currentISRA.getRisk(existing.riskId);
    applyRiskFields(target, selectedRisk);
  });
}

function importVul(currentISRA, importedISRA, selectedVulIds) {
  let highestVulId = currentISRA.properties.ISRAmeta.latestVulnerabilityId;
  const currentVuls = currentISRA.properties.Vulnerability
  const importedVuls = importedISRA.Vulnerability

  const selectedVuls = importedVuls.filter(
    (importedVul) => selectedVulIds.includes(importedVul.vulnerabilityId),
  );

  let bulkDecision = null;

  selectedVuls.forEach((selectedVul) => {
    const existing = currentVuls.find(
      (currentVul) => currentVul.vulnerabilityName === selectedVul.vulnerabilityName,
    );

    if (!existing) {
      highestVulId += 1;

      const newVulnerability = new Vulnerability();
      newVulnerability.vulnerabilityId = highestVulId;
      newVulnerability.vulnerabilityName = selectedVul.vulnerabilityName;
      newVulnerability.vulnerabilityFamily = selectedVul.vulnerabilityFamily;
      newVulnerability.vulnerabilityTrackingID = selectedVul.vulnerabilityTrackingID;
      newVulnerability.vulnerabilityTrackingURI = selectedVul.vulnerabilityTrackingURI;
      newVulnerability.vulnerabilityCVE = selectedVul.vulnerabilityCVE;
      newVulnerability.vulnerabilityDescription = selectedVul.vulnerabilityDescription;
      newVulnerability.vulnerabilityDescriptionAttachment = selectedVul.vulnerabilityDescriptionAttachment;
      newVulnerability.overallScore = selectedVul.overallScore;
      newVulnerability.overallLevel = selectedVul.overallLevel;
      newVulnerability.cveScore = selectedVul.cveScore;

      currentISRA.addVulnerability(newVulnerability);
      return;
    }

    const decision = resolveDuplicate(bulkDecision, 'Vulnerability', selectedVul.vulnerabilityName);
    bulkDecision = decision.bulkDecision;
    if (decision.action === 'skip') return;

    const target = currentISRA.getVulnerability(existing.vulnerabilityId);
    target.vulnerabilityName = selectedVul.vulnerabilityName;
    target.vulnerabilityFamily = selectedVul.vulnerabilityFamily;
    target.vulnerabilityTrackingID = selectedVul.vulnerabilityTrackingID;
    target.vulnerabilityTrackingURI = selectedVul.vulnerabilityTrackingURI;
    target.vulnerabilityCVE = selectedVul.vulnerabilityCVE;
    target.vulnerabilityDescription = selectedVul.vulnerabilityDescription;
    target.vulnerabilityDescriptionAttachment = selectedVul.vulnerabilityDescriptionAttachment;
    target.overallScore = selectedVul.overallScore;
    target.overallLevel = selectedVul.overallLevel;
    target.cveScore = selectedVul.cveScore;
  });
}

module.exports = {
    importBA,
    importSA,
    importRisk,
    importVul,
    importData

}
