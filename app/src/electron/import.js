const BusinessAsset = require('../../../lib/src/model/classes/BusinessAsset/business-asset');
const SupportingAsset = require('../../../lib/src/model/classes/SupportingAsset/supporting-asset');
const Vulnerability = require('../../../lib/src/model/classes/Vulnerability/vulnerability');
const Risk = require('../../../lib/src/model/classes/Risk/risk');
const RiskLikelihood = require('../../../lib/src/model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../../lib/src/model/classes/Risk/risk-impact');
const BusinessAssetProperties = require('../../../lib/src/model/classes/BusinessAsset/business-asset-properties');

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


function importBA(currentISRA, importedISRA, selectedBAIds) {
  let highestBAId = currentISRA.properties.ISRAmeta.latestBusinessAssetId;
  const currentBusinessAssets = currentISRA.properties.BusinessAsset
  const importedBusinessAssets = importedISRA.BusinessAsset

  // get selected imports
  const selectedBusinessAssets = []
  importedBusinessAssets.forEach ((importedBA) => {
    if (selectedBAIds.includes(importedBA.businessAssetId)) {
      selectedBusinessAssets.push(importedBA)
    }
    
  });

  // Compare the business assets name before adding
  selectedBusinessAssets.forEach((selectedBA) => {
    let notSame = true;
    currentBusinessAssets.forEach((currentBA) => {
      if (selectedBA.businessAssetName === currentBA.businessAssetName) {
        notSame = false;
      }
    });
    
    if (notSame) {

      highestBAId += 1;
      
      //importedBAMap[Number(importedBA.businessAssetId)] = highestBAId;

      const newBusinessAsset = new BusinessAsset();
      const newBusinessAssetProperties = new BusinessAssetProperties();
      newBusinessAssetProperties.businessAssetConfidentiality = selectedBA.businessAssetProperties.businessAssetConfidentiality;
      newBusinessAssetProperties.businessAssetIntegrity = selectedBA.businessAssetProperties.businessAssetIntegrity
      newBusinessAssetProperties.businessAssetAvailability = selectedBA.businessAssetProperties.businessAssetAvailability
      newBusinessAssetProperties.businessAssetAuthenticity = selectedBA.businessAssetProperties.businessAssetAuthenticity
      newBusinessAssetProperties.businessAssetAuthorization = selectedBA.businessAssetProperties.businessAssetAuthorization
      newBusinessAssetProperties.businessAssetNonRepudiation = selectedBA.businessAssetProperties.businessAssetNonRepudiation

      newBusinessAsset.businessAssetId = highestBAId;
      newBusinessAsset.businessAssetName = selectedBA.businessAssetName;
      newBusinessAsset.businessAssetType = selectedBA.businessAssetType;
      newBusinessAsset.businessAssetDescription = selectedBA.businessAssetDescription;
      newBusinessAsset.businessAssetProperties = newBusinessAssetProperties;
      currentISRA.addBusinessAsset(newBusinessAsset)
    }
    
  });


              
}

function importSA(currentISRA, importedISRA,  selectedSAIds) {
  let highestSAId = currentISRA.properties.ISRAmeta.latestSupportingAssetId;
  const currentSupportingAssets = currentISRA.properties.SupportingAsset
  const importedSupportingAssets = importedISRA.SupportingAsset

  const selectedSupportingAssets = []
  importedSupportingAssets.forEach ((importedSA) => {
    if (selectedSAIds.includes(importedSA.supportingAssetId)) {
      selectedSupportingAssets.push(importedSA)
    }
    
  });

  selectedSupportingAssets.forEach((selectedSA) => {
                
    let notSame = true;
    currentSupportingAssets.forEach((currentSA) => {
      if (selectedSA.supportingAssetName === currentSA.supportingAssetName) {
        notSame = false;
      }
    });

    if (notSame) {
      highestSAId += 1;

      const newSupportingAsset = new SupportingAsset();
      newSupportingAsset.supportingAssetId = highestSAId;
      newSupportingAsset.supportingAssetName = selectedSA.supportingAssetName;
      newSupportingAsset.supportingAssetType = selectedSA.supportingAssetType;
      newSupportingAsset.supportingAssetSecurityLevel = selectedSA.supportingAssetSecurityLevel;


      currentISRA.addSupportingAsset(newSupportingAsset)
    }
    
  });
              

}

function importRisk(currentISRA, importedISRA, selectedRiskIds) {
  let highestRiskId = currentISRA.properties.ISRAmeta.latestRiskId;
  const currentRisks = currentISRA.properties.Risk;
  const importedRisks = importedISRA.Risk;

  const selectedRisks = []
  importedRisks.forEach ((importedRisk) => {
    if (selectedRiskIds.includes(importedRisk.riskId)) {
      selectedRisks.push(importedRisk)
    }
    
  });

  selectedRisks.forEach ((selectedRisk) => {
                
    let notSame = true;
    currentRisks.forEach ((currentRisk) => {
      if (selectedRisk.riskName === currentRisk.riskName) {
        notSame = false;
      }
    });

    if (notSame) {

      highestRiskId += 1;
      const newRisk = new Risk();
      
      newRisk.riskName = selectedRisk.riskName;
      newRisk.threatAgent = selectedRisk.threatAgent;
      newRisk.threatAgentDetail = selectedRisk.threatAgentDetail;
      newRisk.threatVerb  = selectedRisk.threatVerb;
      newRisk.threatVerbDetail = selectedRisk.threatVerbDetail;
      newRisk.motivation = selectedRisk.motivation;
      newRisk.motivationDetail = selectedRisk.motivationDetail;

      newRisk.isAutomaticRiskName = selectedRisk.isAutomaticRiskName;

      // Need to change to account for schema update
      newRisk.riskId = highestRiskId;
      newRisk.riskName  = selectedRisk.riskName;
      newRisk.mitigationsBenefits = selectedRisk.mitigationsBenefits;
      newRisk.mitigationsDoneBenefits = selectedRisk.mitigationsDoneBenefits;
      newRisk.mitigatedRiskScore = selectedRisk.mitigatedRiskScore;
      newRisk.riskManagementDecision = selectedRisk.riskManagementDecision;
      newRisk.riskManagementDetail = selectedRisk.riskManagementDetail;
      newRisk.residualRiskScore = selectedRisk.residualRiskScore;
      newRisk.residualRiskLevel = selectedRisk.residualRiskLevel;
      const newRiskLikelihood = new RiskLikelihood();
      newRiskLikelihood.riskLikelihood = selectedRisk.riskLikelihood.riskLikelihood;
      newRiskLikelihood.riskLikelihoodDetail = selectedRisk.riskLikelihood.riskLikelihoodDetail;
      newRiskLikelihood.skillLevel = selectedRisk.riskLikelihood.skillLevel;
      newRiskLikelihood.reward = selectedRisk.riskLikelihood.reward;
      newRiskLikelihood.accessResources = selectedRisk.riskLikelihood.accessResources;
      newRiskLikelihood.intrusionDetection = selectedRisk.riskLikelihood.intrusionDetection;
      newRiskLikelihood.size = selectedRisk.riskLikelihood.size;
      newRiskLikelihood.threatFactorScore = selectedRisk.riskLikelihood.threatFactorScore;
      newRiskLikelihood.threatFactorLevel = selectedRisk.riskLikelihood.threatFactorLevel;
      newRiskLikelihood.occurrence = selectedRisk.riskLikelihood.occurrence;
      newRiskLikelihood.occurrenceLevel = selectedRisk.riskLikelihood.occurrenceLevel;
      newRiskLikelihood.isOWASPLikelihood = selectedRisk.riskLikelihood.isOWASPLikelihood;
      newRisk.riskLikelihood = newRiskLikelihood;
      const newRiskImpact = new RiskImpact();
      newRiskImpact.businessAssetConfidentialityFlag = selectedRisk.riskImpact.businessAssetConfidentialityFlag;
      newRiskImpact.businessAssetIntegrityFlag = selectedRisk.riskImpact.businessAssetIntegrityFlag;
      newRiskImpact.businessAssetAvailabilityFlag = selectedRisk.riskImpact.businessAssetAvailabilityFlag;
      newRiskImpact.businessAssetAuthenticityFlag = selectedRisk.riskImpact.businessAssetAuthenticityFlag;
      newRiskImpact.businessAssetAuthorizationFlag = selectedRisk.riskImpact.businessAssetAuthorizationFlag;
      newRiskImpact.businessAssetNonRepudiationFlag = selectedRisk.riskImpact.businessAssetNonRepudiationFlag;
      newRisk.riskImpact = newRiskImpact;
      //riskAttackPaths need to use new RiskAttackPaths()
      newRisk.riskAttackPaths = selectedRisk.riskAttackPaths
      newRisk.residualRiskLevel = selectedRisk.residualRiskLevel;
      
     
      currentISRA.addRisk(newRisk)
    }
    
  });

              
}

function importVul(currentISRA, importedISRA, selectedVulIds) {
  let highestVulId = currentISRA.properties.ISRAmeta.latestVulnerabilityId;
  const currentVuls = currentISRA.properties.Vulnerability
  const importedVuls = importedISRA.Vulnerability

  const selectedVuls = []
  importedVuls.forEach ((importedVul) => {
    if (selectedVulIds.includes(importedVul.vulnerabilityId)) {
      selectedVuls.push(importedVul)
    }
    
  });

  selectedVuls.forEach ((selectedVul) => {
                
    let notSame = true;
    currentVuls.forEach ((currentVul) => {
      if (selectedVul.vulnerabilityName === currentVul.vulnerabilityName) {
        notSame = false;
      }
    });

    if (notSame) {
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

      currentISRA.addVulnerability(newVulnerability)
    }

  });


              
}

module.exports = {
    importBA,
    importSA,
    importRisk,
    importVul,
    importData

}