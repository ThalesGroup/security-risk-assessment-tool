const BusinessAsset = require('../../../lib/src/model/classes/BusinessAsset/business-asset');
const SupportingAsset = require('../../../lib/src/model/classes/SupportingAsset/supporting-asset');
const Vulnerability = require('../../../lib/src/model/classes/Vulnerability/vulnerability');
const Risk = require('../../../lib/src/model/classes/Risk/risk');
const RiskName = require('../../../lib/src/model/classes/Risk/risk-name');
const RiskLikelihood = require('../../../lib/src/model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../../lib/src/model/classes/Risk/risk-impact');
const BusinessAssetProperties = require('../../../lib/src/model/classes/BusinessAsset/business-asset-properties');

function importBA(currentISRA, importedISRA, importedBAMap, selectedOptions) {
    let highestBAId = currentISRA.properties.ISRAmeta.latestBusinessAssetId;
              const currentBusinessAssets = currentISRA.properties.BusinessAsset
              const importedBusinessAssets = importedISRA.BusinessAsset

        
              // Compare the business assets name before adding

              importedBusinessAssets.forEach ((importedBA) => {
                let notSame = true;
                currentBusinessAssets.forEach ((currentBA) => {
                  if (importedBA.businessAssetName === currentBA.businessAssetName) {
                    notSame = false;
                  }
                });

                if (notSame) {

                  highestBAId += 1;
                  
                  if (selectedOptions.includes('2') || selectedOptions.includes('3') ) {
                    importedBAMap[Number(importedBA.businessAssetId)] = highestBAId;
                    
                  }
                  
                  const newBusinessAsset = new BusinessAsset();
                  const newBusinessAssetProperties = new BusinessAssetProperties();
                  newBusinessAssetProperties.businessAssetConfidentiality = importedBA.businessAssetProperties.businessAssetConfidentiality;
                  newBusinessAssetProperties.businessAssetIntegrity = importedBA.businessAssetProperties.businessAssetIntegrity
                  newBusinessAssetProperties.businessAssetAvailability = importedBA.businessAssetProperties.businessAssetAvailability
                  newBusinessAssetProperties.businessAssetAuthenticity = importedBA.businessAssetProperties.businessAssetAuthenticity
                  newBusinessAssetProperties.businessAssetAuthorization = importedBA.businessAssetProperties.businessAssetAuthorization
                  newBusinessAssetProperties.businessAssetNonRepudiation = importedBA.businessAssetProperties.businessAssetNonRepudiation

                  newBusinessAsset.businessAssetId = highestBAId;
                  newBusinessAsset.businessAssetName = importedBA.businessAssetName;
                  newBusinessAsset.businessAssetType = importedBA.businessAssetType;
                  newBusinessAsset.businessAssetDescription = importedBA.businessAssetDescription;
                  newBusinessAsset.businessAssetProperties = newBusinessAssetProperties;
                  currentISRA.addBusinessAsset(newBusinessAsset)
                }
                
              });

}

function importSA(currentISRA, importedISRA, importedBAMap, importedSAMap, selectedOptions) {

    let highestSAId = currentISRA.properties.ISRAmeta.latestSupportingAssetId;
              const currentSupportingAssets = currentISRA.properties.SupportingAsset
              const importedSupportingAssets = importedISRA.SupportingAsset
              importedSupportingAssets.forEach ((importedSA) => {
                
                let notSame = true;
                currentSupportingAssets.forEach ((currentSA) => {
                  if (importedSA.supportingAssetName === currentSA.supportingAssetName) {
                    notSame = false;
                  }
                });

                if (notSame) {
                  highestSAId += 1;
                  if (selectedOptions.includes("3") || selectedOptions.includes("4") ) {
                    importedSAMap[importedSA.supportingAssetId] = highestSAId;
                  }
                  const newSupportingAsset = new SupportingAsset();
                  newSupportingAsset.supportingAssetId = highestSAId;
                  newSupportingAsset.supportingAssetName = importedSA.supportingAssetName;
                  newSupportingAsset.supportingAssetType = importedSA.supportingAssetType;
                  newSupportingAsset.supportingAssetSecurityLevel = importedSA.supportingAssetSecurityLevel;

                  if (selectedOptions.includes('1')) {
                      
                    importedSA.businessAssetRef.forEach((ref) => {
                      newSupportingAsset.addBusinessAssetRef(importedBAMap[ref]);

                    });
                    
                  } else if (selectedOptions.includes("2X")) {
                    // Add business assets 
                    importedSA.businessAssetRef.forEach((ref) => {
                      if (!Object.keys(importedBAMap).includes(ref)) {
                        const importedBA = currentISRA.properties.BusinessAsset[ref - 1]
                        importedBAMap[importedBA.businessAssetId] = highestBAId;
                        // Convert to function
                        const newBusinessAsset = new BusinessAsset();
                        const newBusinessAssetProperties = new BusinessAssetProperties();
                        newBusinessAssetProperties.businessAssetConfidentiality = importedBA.businessAssetProperties.businessAssetConfidentiality;
                        newBusinessAssetProperties.businessAssetIntegrity = importedBA.businessAssetProperties.businessAssetIntegrity
                        newBusinessAssetProperties.businessAssetAvailability = importedBA.businessAssetProperties.businessAssetAvailability
                        newBusinessAssetProperties.businessAssetAuthenticity = importedBA.businessAssetProperties.businessAssetAuthenticity
                        newBusinessAssetProperties.businessAssetAuthorization = importedBA.businessAssetProperties.businessAssetAuthorization
                        newBusinessAssetProperties.businessAssetNonRepudiation = importedBA.businessAssetProperties.businessAssetNonRepudiation
  
                        newBusinessAsset.businessAssetId = highestBAId;
                        newBusinessAsset.businessAssetName = importedBA.businessAssetName;
                        newBusinessAsset.businessAssetType = importedBA.businessAssetType;
                        newBusinessAsset.businessAssetDescription = importedBA.businessAssetDescription;
                        newBusinessAsset.businessAssetProperties = newBusinessAssetProperties;
                        currentISRA.addBusinessAsset(newBusinessAsset)
                        newSupportingAsset.addBusinessAssetRef(importedBAMap[ref]);
                      }

                    });
                    
                  }
                  currentISRA.addSupportingAsset(newSupportingAsset)
                }
                
              });

}

function importRisk(currentISRA, importedISRA, importedBAMap, importedSAMap, importedVulMap, selectedOptions) {
    let highestRiskId = currentISRA.properties.ISRAmeta.latestRiskId;
              const currentRisks = currentISRA.properties.Risk
              const importedRisks = importedISRA.Risk

              importedRisks.forEach ((importedRisk) => {
                
                let notSame = true;
                currentRisks.forEach ((currentRisk) => {
                  if (importedRisk.riskName === currentRisk.riskName) {
                    notSame = false;
                  }
                });

                if (notSame) {

                  highestRiskId += 1;
                  const newRisk = new Risk();
                  const newRiskName = new RiskName();
                  newRiskName.riskName = importedRisk.riskName.riskName;
                  newRiskName.threatAgent = importedRisk.riskName.threatAgent;
                  newRiskName.threatAgentDetail = importedRisk.riskName.threatAgentDetail;
                  newRiskName.threatVerb  = importedRisk.riskName.threatVerb;
                  newRiskName.threatVerbDetail = importedRisk.riskName.threatVerbDetail;
                  newRiskName.motivation = importedRisk.riskName.motivation;
                  newRiskName.motivationDetail = importedRisk.riskName.motivationDetail;

                  // Please rework this logic
                  if (selectedOptions.includes('1') && selectedOptions.includes('2') && selectedOptions.includes('4')) {
                    newRiskName.businessAssetRef = importedBAMap[importedRisk.riskName.businessAssetRef];
                    newRiskName.supportingAssetRef = importedSAMap[importedRisk.riskName.supportingAssetRef];
                    newRisk.allAttackPathsName = importedRisk.allAttackPathsName;
                    newRisk.allAttackPathsScore = importedRisk.allAttackPathsScore;
                    
                    
                  } else if (selectedOptions.includes("3X")) {
                    // Add business assets 
                    if (!Object.keys(importedBAMap).includes(importedRisk.riskName.businessAssetRef)) {
                      const importedBA = currentISRA.properties.BusinessAsset[importedRisk.riskName.businessAssetRef - 1]
                      importedBAMap[importedBA.businessAssetId] = currentISRA.properties.ISRAmeta.latestBusinessAssetId;
                      // Convert to function
                      const newBusinessAsset = new BusinessAsset();
                      const newBusinessAssetProperties = new BusinessAssetProperties();
                      newBusinessAssetProperties.businessAssetConfidentiality = importedBA.businessAssetProperties.businessAssetConfidentiality;
                      newBusinessAssetProperties.businessAssetIntegrity = importedBA.businessAssetProperties.businessAssetIntegrity
                      newBusinessAssetProperties.businessAssetAvailability = importedBA.businessAssetProperties.businessAssetAvailability
                      newBusinessAssetProperties.businessAssetAuthenticity = importedBA.businessAssetProperties.businessAssetAuthenticity
                      newBusinessAssetProperties.businessAssetAuthorization = importedBA.businessAssetProperties.businessAssetAuthorization
                      newBusinessAssetProperties.businessAssetNonRepudiation = importedBA.businessAssetProperties.businessAssetNonRepudiation

                      newBusinessAsset.businessAssetId = currentISRA.properties.ISRAmeta.latestBusinessAssetId;
                      newBusinessAsset.businessAssetName = importedBA.businessAssetName;
                      newBusinessAsset.businessAssetType = importedBA.businessAssetType;
                      newBusinessAsset.businessAssetDescription = importedBA.businessAssetDescription;
                      newBusinessAsset.businessAssetProperties = newBusinessAssetProperties;
                      currentISRA.addBusinessAsset(newBusinessAsset)
                      newRiskName.businessAssetRef =importedBAMap[importedRisk.riskName.businessAssetRef];
                    }

                    if (!Object.keys(importedSAMap).includes(importedRisk.riskName.supportingAssetRef)) {
                      const importedSA = currentISRA.properties.SupportingAsset[ref - 1]
                        const newSupportingAsset = new SupportingAsset();
                        newSupportingAsset.supportingAssetId = currentISRA.properties.ISRAmeta.latestSupportingAssetId;
                        newSupportingAsset.supportingAssetName = importedSA.supportingAssetName;
                        newSupportingAsset.supportingAssetType = importedSA.supportingAssetType;
                        newSupportingAsset.supportingAssetSecurityLevel = importedSA.supportingAssetSecurityLevel;
                        newSupportingAsset.addBusinessAssetRef(importedBAMap[importedRisk.riskName.businessAssetRef]);
                        currentISRA.addSupportingAsset(newSupportingAsset)
                        newRiskName.supportingAssetRef = importedVulMap[importedRisk.riskName.supportingAssetRef];
                    }

                    if (!Object.keys(importedVulMap).includes(importedRisk.riskName.supportingAssetRef)) {
                      // importedRisk.riskAttackPaths.forEach(() => {

                      //});
                      const importedVul = currentISRA.properties.Vulnerability //Need to update this to check for matching of vul name
                      const newVulnerability = new Vulnerability();
                      newVulnerability.vulnerabilityId = currentISRA.properties.ISRAmeta.latestVulnerabilityId;
                      newVulnerability.vulnerabilityName = importedVul.vulnerabilityName;
                      newVulnerability.vulnerabilityFamily = importedVul.vulnerabilityFamily;
                      newVulnerability.vulnerabilityTrackingID = importedVul.vulnerabilityTrackingID;
                      newVulnerability.vulnerabilityTrackingURI = importedVul.vulnerabilityTrackingURI;
                      newVulnerability.vulnerabilityCVE = importedVul.vulnerabilityCVE;
                      newVulnerability.vulnerabilityDescription = importedVul.vulnerabilityDescription;
                      newVulnerability.vulnerabilityDescriptionAttachment = importedVul.vulnerabilityDescriptionAttachment;
                      newVulnerability.addSupportingAssetRef(importedSAMap[importedRisk.riskName.supportingAssetRef]);
                    }
                    
                  }
                  newRiskName.riskName.isAutomaticRiskName = importedRisk.riskName.isAutomaticRiskName;

                  // Need to change to account for schema update
                  newRisk.riskId = highestRiskId;
                  newRisk.riskName  = newRiskName;
                  newRisk.mitigationsBenefits = importedRisk.mitigationsBenefits;
                  newRisk.mitigationsDoneBenefits = importedRisk.mitigationsDoneBenefits;
                  newRisk.mitigatedRiskScore = importedRisk.mitigatedRiskScore;
                  newRisk.riskManagementDecision = importedRisk.riskManagementDecision;
                  newRisk.riskManagementDetail = importedRisk.riskManagementDetail;
                  newRisk.residualRiskScore = importedRisk.residualRiskScore;
                  newRisk.residualRiskLevel = importedRisk.residualRiskLevel;
                  const newRiskLikelihood = new RiskLikelihood();
                  newRiskLikelihood.riskLikelihood = importedRisk.riskLikelihood.riskLikelihood;
                  newRiskLikelihood.riskLikelihoodDetail = importedRisk.riskLikelihood.riskLikelihoodDetail;
                  newRiskLikelihood.skillLevel = importedRisk.riskLikelihood.skillLevel;
                  newRiskLikelihood.reward = importedRisk.riskLikelihood.reward;
                  newRiskLikelihood.accessResources = importedRisk.riskLikelihood.accessResources;
                  newRiskLikelihood.intrusionDetection = importedRisk.riskLikelihood.intrusionDetection;
                  newRiskLikelihood.size = importedRisk.riskLikelihood.size;
                  newRiskLikelihood.threatFactorScore = importedRisk.riskLikelihood.threatFactorScore;
                  newRiskLikelihood.threatFactorLevel = importedRisk.riskLikelihood.threatFactorLevel;
                  newRiskLikelihood.occurrence = importedRisk.riskLikelihood.occurrence;
                  newRiskLikelihood.occurrenceLevel = importedRisk.riskLikelihood.occurrenceLevel;
                  newRiskLikelihood.isOWASPLikelihood = importedRisk.riskLikelihood.isOWASPLikelihood;
                  newRisk.riskLikelihood = newRiskLikelihood;
                  const newRiskImpact = new RiskImpact();
                  newRiskImpact.businessAssetConfidentialityFlag = importedRisk.riskImpact.businessAssetConfidentialityFlag;
                  newRiskImpact.businessAssetIntegrityFlag = importedRisk.riskImpact.businessAssetIntegrityFlag;
                  newRiskImpact.businessAssetAvailabilityFlag = importedRisk.riskImpact.businessAssetAvailabilityFlag;
                  newRiskImpact.businessAssetAuthenticityFlag = importedRisk.riskImpact.businessAssetAuthenticityFlag;
                  newRiskImpact.businessAssetAuthorizationFlag = importedRisk.riskImpact.businessAssetAuthorizationFlag;
                  newRiskImpact.businessAssetNonRepudiationFlag = importedRisk.riskImpact.businessAssetNonRepudiationFlag;
                  newRisk.riskImpact = newRiskImpact;
                  //riskAttackPaths need to use new RiskAttackPaths()
                  newRisk.riskAttackPaths = importedRisk.riskAttackPaths
                  newRisk.residualRiskLevel = importedRisk.residualRiskLevel;
                  
                 
                  currentISRA.addRisk(newRisk)
                }
                
              });
}

function importVul(currentISRA, importedISRA, importedBAMap, importedSAMap, importedVulMap, selectedOptions) {
    let highestVulId = currentISRA.properties.ISRAmeta.latestVulnerabilityId;
              const currentVuls = currentISRA.properties.Vulnerability
              const importedVuls = importedISRA.Vulnerability

              importedVuls.forEach ((importedVul) => {
                
                let notSame = true;
                currentVuls.forEach ((currentVul) => {
                  if (importedVul.vulnerabilityName === currentVul.vulnerabilityName) {
                    notSame = false;
                  }
                });

                if (notSame) {
                  highestVulId += 1;
                  if (selectedOptions.includes("3") ) {
                    importedVulMap[importedVul.vulnerabilityId] = highestVulId;
                  }
                  const newVulnerability = new Vulnerability();
                  newVulnerability.vulnerabilityId = highestVulId;
                  newVulnerability.vulnerabilityName = importedVul.vulnerabilityName;
                  newVulnerability.vulnerabilityFamily = importedVul.vulnerabilityFamily;
                  newVulnerability.vulnerabilityTrackingID = importedVul.vulnerabilityTrackingID;
                  newVulnerability.vulnerabilityTrackingURI = importedVul.vulnerabilityTrackingURI;
                  newVulnerability.vulnerabilityCVE = importedVul.vulnerabilityCVE;
                  newVulnerability.vulnerabilityDescription = importedVul.vulnerabilityDescription;
                  newVulnerability.vulnerabilityDescriptionAttachment = importedVul.vulnerabilityDescriptionAttachment;
                  // Only add SARefs if SA was selected
                  if (selectedOptions.includes("2")) {
                    importedVul.supportingAssetRef.forEach((ref) => {
                      newVulnerability.addSupportingAssetRef(importedSAMap[ref]);

                    });

                  } else if (selectedOptions.includes("4X")) {

                    importedVul.supportingAssetRef.forEach((ref) => {
                      

                      if (!Object.keys(importedVulMap).includes(ref)) {
                        const importedSA = currentISRA.properties.SupportingAsset[ref - 1]
                        const newSupportingAsset = new SupportingAsset();
                        newSupportingAsset.supportingAssetId = currentISRA.properties.ISRAmeta.latestSupportingAssetId;
                        newSupportingAsset.supportingAssetName = importedSA.supportingAssetName;
                        newSupportingAsset.supportingAssetType = importedSA.supportingAssetType;
                        newSupportingAsset.supportingAssetSecurityLevel = importedSA.supportingAssetSecurityLevel;
                        if (selectedOptions.includes('1')) {
                      
                          importedSA.businessAssetRef.forEach((ref) => {
                            newSupportingAsset.addBusinessAssetRef(importedBAMap[ref]);
      
                          });
                          
                        }

                        currentISRA.addSupportingAsset(newSupportingAsset)
                        newVulnerability.addSupportingAssetRef(importedSAMap[ref]);

                      }

                    });
                    

                  }
                  newVulnerability.overallScore = importedVul.overallScore;
                  newVulnerability.overallLevel = importedVul.overallLevel;
                  newVulnerability.cveScore = importedVul.cveScore;

                  currentISRA.addVulnerability(newVulnerability)
                }

              });
}

module.exports = {
    importBA,
    importSA,
    importRisk,
    importVul

}