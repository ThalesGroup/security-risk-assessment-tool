{
    "ISRAmeta": {
        "schemaVersion": 3,
        "classification": "COMPANY CONFIDENTIAL {PROJECT}",
        "iteration": 2,
        "projectName": "",
        "projectOrganization": "",
        "projectVersion": "",
        "ISRAtracking": [
            {
                "trackingIteration": 1,
                "trackingSecurityOfficer": "",
                "trackingDate": "2024-07-10",
                "trackingComment": ""
            }
        ],
        "businessAssetsCount": 1,
        "supportingAssetsCount": 2,
        "risksCount": 6,
        "vulnerabilitiesCount": 7,
        "latestBusinessAssetId": 1,
        "latestSupportingAssetId": 2,
        "latestRiskId": 6,
        "latestVulnerabilityId": 7
    },
    "ProjectContext": {
        "projectDescription": "",
        "projectURL": "",
        "projectDescriptionAttachment": "",
        "securityProjectObjectives": "",
        "securityOfficerObjectives": "",
        "securityAssumptions": ""
    },
    "BusinessAsset": [
        {
            "businessAssetId": 1,
            "businessAssetName": "BA1",
            "businessAssetType": "Data",
            "businessAssetDescription": "",
            "businessAssetProperties": {
                "businessAssetAuthenticity": 4,
                "businessAssetAuthorization": 4,
                "businessAssetAvailability": 4,
                "businessAssetConfidentiality": 4,
                "businessAssetIntegrity": 4,
                "businessAssetNonRepudiation": 4
            }
        }
    ],
    "SupportingAssetsDesc": "",
    "SupportingAsset": [
        {
            "supportingAssetId": 1,
            "supportingAssetHLDId": "",
            "supportingAssetName": "SA1",
            "supportingAssetType": "",
            "supportingAssetSecurityLevel": -1,
            "businessAssetRef": [
                1
            ]
        },
        {
            "supportingAssetId": 2,
            "supportingAssetHLDId": "",
            "supportingAssetName": "SA2",
            "supportingAssetType": "",
            "supportingAssetSecurityLevel": -1,
            "businessAssetRef": [
                1
            ]
        }
    ],
    "Risk": [
        {
            "riskId": 1,
            "projectName": "",
            "projectVersion": "",
            "riskName": "As a Criminal, I can steal the BA1 compromising the SA1 in order to Get BA1, exploiting the (Vuln1 AND Vuln2) OR (Vuln1 AND Vuln3)",
            "threatAgent": "Criminal",
            "threatAgentDetail": "<p>test1</p>",
            "threatVerb": "steal",
            "threatVerbDetail": "<p>test2</p>",
            "motivation": "Get BA1",
            "motivationDetail": "<p>Test</p>",
            "businessAssetRef": 1,
            "supportingAssetRef": 1,
            "isAutomaticRiskName": true,
            "riskLikelihood": {
                "riskLikelihood": 4,
                "riskLikelihoodDetail": "",
                "skillLevel": null,
                "reward": null,
                "accessResources": null,
                "size": null,
                "intrusionDetection": null,
                "threatFactorScore": null,
                "threatFactorLevel": "",
                "occurrence": null,
                "occurrenceLevel": "",
                "isOWASPLikelihood": false
            },
            "riskImpact": {
                "riskImpact": 4,
                "businessAssetConfidentialityFlag": 1,
                "businessAssetIntegrityFlag": 0,
                "businessAssetAvailabilityFlag": 0,
                "businessAssetAuthenticityFlag": 0,
                "businessAssetAuthorizationFlag": 0,
                "businessAssetNonRepudiationFlag": 0
            },
            "riskAttackPaths": [
                {
                    "riskAttackPathId": 1,
                    "vulnerabilityRef": [
                        {
                            "score": 10,
                            "name": "Vuln1",
                            "vulnerabilityId": 1
                        },
                        {
                            "score": 10,
                            "name": "Vuln2",
                            "vulnerabilityId": 2
                        }
                    ],
                    "attackPathName": "Vuln1 AND Vuln2",
                    "attackPathScore": 10
                },
                {
                    "riskAttackPathId": 2,
                    "vulnerabilityRef": [
                        {
                            "score": 10,
                            "name": "Vuln1",
                            "vulnerabilityId": 1
                        },
                        {
                            "score": 10,
                            "name": "Vuln3",
                            "vulnerabilityId": 3
                        }
                    ],
                    "attackPathName": "Vuln1 AND Vuln3",
                    "attackPathScore": 10
                }
            ],
            "allAttackPathsName": "(Vuln1 AND Vuln2) OR (Vuln1 AND Vuln3)",
            "allAttackPathsScore": 10,
            "inherentRiskScore": 20,
            "riskMitigation": [
                {
                    "riskMitigationId": 1,
                    "description": "<p>idk test1</p>",
                    "benefits": 0.75,
                    "cost": 111111111,
                    "decision": "Rejected",
                    "decisionDetail": "<p>no money</p>"
                }
            ],
            "mitigationsBenefits": 1,
            "mitigationsDoneBenefits": 1,
            "mitigatedRiskScore": 20,
            "riskManagementDecision": "Mitigate",
            "riskManagementDetail": "",
            "residualRiskScore": 20,
            "residualRiskLevel": "Critical"
        },
        {
            "riskId": 2,
            "projectName": "",
            "projectVersion": "",
            "riskName": "As a Competitor, I can disclose the BA1 compromising the SA2 in order to Copy the product, exploiting the (Vuln4 AND Vuln3) OR (Vuln4 AND Vuln3)",
            "threatAgent": "Competitor",
            "threatAgentDetail": "",
            "threatVerb": "disclose",
            "threatVerbDetail": "",
            "motivation": "Copy the product",
            "motivationDetail": "",
            "businessAssetRef": 1,
            "supportingAssetRef": 2,
            "isAutomaticRiskName": true,
            "riskLikelihood": {
                "riskLikelihood": 3,
                "riskLikelihoodDetail": "",
                "skillLevel": null,
                "reward": null,
                "accessResources": null,
                "size": null,
                "intrusionDetection": null,
                "threatFactorScore": null,
                "threatFactorLevel": "",
                "occurrence": null,
                "occurrenceLevel": "",
                "isOWASPLikelihood": true
            },
            "riskImpact": {
                "riskImpact": 4,
                "businessAssetConfidentialityFlag": 1,
                "businessAssetIntegrityFlag": 0,
                "businessAssetAvailabilityFlag": 0,
                "businessAssetAuthenticityFlag": 0,
                "businessAssetAuthorizationFlag": 0,
                "businessAssetNonRepudiationFlag": 0
            },
            "riskAttackPaths": [
                {
                    "riskAttackPathId": 1,
                    "vulnerabilityRef": [
                        {
                            "score": 0,
                            "name": "Vuln4",
                            "vulnerabilityId": 4
                        },
                        {
                            "score": 10,
                            "name": "Vuln3",
                            "vulnerabilityId": 3
                        }
                    ],
                    "attackPathName": "Vuln4 AND Vuln3",
                    "attackPathScore": 0
                },
                {
                    "riskAttackPathId": 2,
                    "vulnerabilityRef": [
                        {
                            "score": 0,
                            "name": "Vuln4",
                            "vulnerabilityId": 4
                        },
                        {
                            "score": 10,
                            "name": "Vuln3",
                            "vulnerabilityId": 3
                        }
                    ],
                    "attackPathName": "Vuln4 AND Vuln3",
                    "attackPathScore": 0
                }
            ],
            "allAttackPathsName": "(Vuln4 AND Vuln3) OR (Vuln4 AND Vuln3)",
            "allAttackPathsScore": 0,
            "inherentRiskScore": 8,
            "riskMitigation": [
                {
                    "riskMitigationId": 1,
                    "description": "<p>test</p>",
                    "benefits": 1,
                    "cost": null,
                    "decision": "Accepted",
                    "decisionDetail": ""
                }
            ],
            "mitigationsBenefits": 0,
            "mitigationsDoneBenefits": 1,
            "mitigatedRiskScore": 0,
            "riskManagementDecision": "Accept",
            "riskManagementDetail": "",
            "residualRiskScore": 8,
            "residualRiskLevel": "Medium"
        },
        {
            "riskId": 3,
            "projectName": "",
            "projectVersion": "",
            "riskName": "As a Criminal organization, I can disclose the BA1 compromising the SA2 in order to to rule the world, exploiting the (Vuln5 AND Vuln3) OR (Vuln3)",
            "threatAgent": "Criminal organization",
            "threatAgentDetail": "",
            "threatVerb": "disclose",
            "threatVerbDetail": "",
            "motivation": "to rule the world",
            "motivationDetail": "",
            "businessAssetRef": 1,
            "supportingAssetRef": 2,
            "isAutomaticRiskName": true,
            "riskLikelihood": {
                "riskLikelihood": 3,
                "riskLikelihoodDetail": "",
                "skillLevel": null,
                "reward": null,
                "accessResources": null,
                "size": null,
                "intrusionDetection": null,
                "threatFactorScore": null,
                "threatFactorLevel": "",
                "occurrence": null,
                "occurrenceLevel": "",
                "isOWASPLikelihood": true
            },
            "riskImpact": {
                "riskImpact": 4,
                "businessAssetConfidentialityFlag": 1,
                "businessAssetIntegrityFlag": 0,
                "businessAssetAvailabilityFlag": 0,
                "businessAssetAuthenticityFlag": 0,
                "businessAssetAuthorizationFlag": 0,
                "businessAssetNonRepudiationFlag": 0
            },
            "riskAttackPaths": [
                {
                    "riskAttackPathId": 1,
                    "vulnerabilityRef": [
                        {
                            "score": 0,
                            "name": "Vuln5",
                            "vulnerabilityId": 5
                        },
                        {
                            "score": 10,
                            "name": "Vuln3",
                            "vulnerabilityId": 3
                        }
                    ],
                    "attackPathName": "Vuln5 AND Vuln3",
                    "attackPathScore": 0
                },
                {
                    "riskAttackPathId": 2,
                    "vulnerabilityRef": [
                        {
                            "score": 10,
                            "name": "Vuln3",
                            "vulnerabilityId": 3
                        }
                    ],
                    "attackPathName": "Vuln3",
                    "attackPathScore": 10
                }
            ],
            "allAttackPathsName": "(Vuln5 AND Vuln3) OR (Vuln3)",
            "allAttackPathsScore": 10,
            "inherentRiskScore": 18,
            "riskMitigation": [
                {
                    "riskMitigationId": 1,
                    "description": "",
                    "benefits": null,
                    "cost": null,
                    "decision": "",
                    "decisionDetail": ""
                }
            ],
            "mitigationsBenefits": 1,
            "mitigationsDoneBenefits": 1,
            "mitigatedRiskScore": 18,
            "riskManagementDecision": "Mitigate",
            "riskManagementDetail": "",
            "residualRiskScore": 18,
            "residualRiskLevel": "Critical"
        },
        {
            "riskId": 4,
            "projectName": "",
            "projectVersion": "",
            "riskName": "As a Criminal, I can spoof the BA1 compromising the SA2 in order to asd",
            "threatAgent": "Criminal",
            "threatAgentDetail": "",
            "threatVerb": "spoof",
            "threatVerbDetail": "",
            "motivation": "asd",
            "motivationDetail": "<p>Testcolours</p>",
            "businessAssetRef": 1,
            "supportingAssetRef": 2,
            "isAutomaticRiskName": true,
            "riskLikelihood": {
                "riskLikelihood": 3,
                "riskLikelihoodDetail": "",
                "skillLevel": null,
                "reward": null,
                "accessResources": null,
                "size": null,
                "intrusionDetection": null,
                "threatFactorScore": null,
                "threatFactorLevel": "",
                "occurrence": null,
                "occurrenceLevel": "",
                "isOWASPLikelihood": true
            },
            "riskImpact": {
                "riskImpact": 4,
                "businessAssetConfidentialityFlag": 0,
                "businessAssetIntegrityFlag": 0,
                "businessAssetAvailabilityFlag": 0,
                "businessAssetAuthenticityFlag": 1,
                "businessAssetAuthorizationFlag": 0,
                "businessAssetNonRepudiationFlag": 0
            },
            "riskAttackPaths": [
                {
                    "riskAttackPathId": 1,
                    "vulnerabilityRef": [],
                    "attackPathName": "",
                    "attackPathScore": null
                }
            ],
            "allAttackPathsName": "",
            "allAttackPathsScore": null,
            "inherentRiskScore": 15,
            "riskMitigation": [
                {
                    "riskMitigationId": 1,
                    "description": "",
                    "benefits": 1,
                    "cost": null,
                    "decision": "Accepted",
                    "decisionDetail": ""
                }
            ],
            "mitigationsBenefits": 0,
            "mitigationsDoneBenefits": 1,
            "mitigatedRiskScore": 0,
            "riskManagementDecision": "Mitigate",
            "riskManagementDetail": "",
            "residualRiskScore": 15,
            "residualRiskLevel": "High"
        },
        {
            "riskId": 5,
            "projectName": "",
            "projectVersion": "",
            "riskName": "As a Criminal organization, I can steal the BA1 compromising the SA2 in order to asd",
            "threatAgent": "Criminal organization",
            "threatAgentDetail": "",
            "threatVerb": "steal",
            "threatVerbDetail": "",
            "motivation": "asd",
            "motivationDetail": "",
            "businessAssetRef": 1,
            "supportingAssetRef": 2,
            "isAutomaticRiskName": true,
            "riskLikelihood": {
                "riskLikelihood": 1,
                "riskLikelihoodDetail": "<p>Testcolours</p>",
                "skillLevel": null,
                "reward": null,
                "accessResources": null,
                "size": null,
                "intrusionDetection": null,
                "threatFactorScore": null,
                "threatFactorLevel": "",
                "occurrence": null,
                "occurrenceLevel": "",
                "isOWASPLikelihood": false
            },
            "riskImpact": {
                "riskImpact": 4,
                "businessAssetConfidentialityFlag": 1,
                "businessAssetIntegrityFlag": 0,
                "businessAssetAvailabilityFlag": 0,
                "businessAssetAuthenticityFlag": 0,
                "businessAssetAuthorizationFlag": 0,
                "businessAssetNonRepudiationFlag": 0
            },
            "riskAttackPaths": [
                {
                    "riskAttackPathId": 1,
                    "vulnerabilityRef": [],
                    "attackPathName": "",
                    "attackPathScore": null
                }
            ],
            "allAttackPathsName": "",
            "allAttackPathsScore": null,
            "inherentRiskScore": 5,
            "riskMitigation": [
                {
                    "riskMitigationId": 1,
                    "description": "",
                    "benefits": 1,
                    "cost": null,
                    "decision": "",
                    "decisionDetail": ""
                }
            ],
            "mitigationsBenefits": 1,
            "mitigationsDoneBenefits": 1,
            "mitigatedRiskScore": 5,
            "riskManagementDecision": "Accept",
            "riskManagementDetail": "",
            "residualRiskScore": 5,
            "residualRiskLevel": "Low"
        },
        {
            "riskId": 6,
            "projectName": "",
            "projectVersion": "",
            "riskName": "As a Criminal, I can deny access to the BA1 compromising the SA2 in order to asd",
            "threatAgent": "Criminal",
            "threatAgentDetail": "",
            "threatVerb": "deny access to",
            "threatVerbDetail": "",
            "motivation": "asd",
            "motivationDetail": "<p>TestColours</p>",
            "businessAssetRef": 1,
            "supportingAssetRef": 2,
            "isAutomaticRiskName": true,
            "riskLikelihood": {
                "riskLikelihood": 2,
                "riskLikelihoodDetail": "",
                "skillLevel": null,
                "reward": null,
                "accessResources": null,
                "size": null,
                "intrusionDetection": null,
                "threatFactorScore": null,
                "threatFactorLevel": "",
                "occurrence": null,
                "occurrenceLevel": "",
                "isOWASPLikelihood": false
            },
            "riskImpact": {
                "riskImpact": 4,
                "businessAssetConfidentialityFlag": 0,
                "businessAssetIntegrityFlag": 0,
                "businessAssetAvailabilityFlag": 1,
                "businessAssetAuthenticityFlag": 0,
                "businessAssetAuthorizationFlag": 0,
                "businessAssetNonRepudiationFlag": 0
            },
            "riskAttackPaths": [
                {
                    "riskAttackPathId": 1,
                    "vulnerabilityRef": [],
                    "attackPathName": "",
                    "attackPathScore": null
                }
            ],
            "allAttackPathsName": "",
            "allAttackPathsScore": null,
            "inherentRiskScore": 10,
            "riskMitigation": [
                {
                    "riskMitigationId": 1,
                    "description": "",
                    "benefits": null,
                    "cost": null,
                    "decision": "",
                    "decisionDetail": ""
                }
            ],
            "mitigationsBenefits": 1,
            "mitigationsDoneBenefits": 1,
            "mitigatedRiskScore": 10,
            "riskManagementDecision": "Transfer",
            "riskManagementDetail": "",
            "residualRiskScore": 10,
            "residualRiskLevel": "Medium"
        }
    ],
    "Vulnerability": [
        {
            "projectName": "",
            "projectVersion": "",
            "vulnerabilityId": 1,
            "vulnerabilityName": "Vuln1",
            "vulnerabilityFamily": "",
            "vulnerabilityTrackingID": "",
            "vulnerabilityTrackingURI": "",
            "vulnerabilityDescription": "<p>Description</p>",
            "vulnerabilityDescriptionAttachment": "",
            "vulnerabilityCVE": "",
            "cveScore": 10,
            "overallScore": 10,
            "overallLevel": "Critical",
            "supportingAssetRef": [
                1
            ]
        },
        {
            "projectName": "",
            "projectVersion": "",
            "vulnerabilityId": 2,
            "vulnerabilityName": "Vuln2",
            "vulnerabilityFamily": "",
            "vulnerabilityTrackingID": "",
            "vulnerabilityTrackingURI": "",
            "vulnerabilityDescription": "<p>Description</p>",
            "vulnerabilityDescriptionAttachment": "",
            "vulnerabilityCVE": "",
            "cveScore": 10,
            "overallScore": 10,
            "overallLevel": "Critical",
            "supportingAssetRef": [
                1
            ]
        },
        {
            "projectName": "",
            "projectVersion": "",
            "vulnerabilityId": 3,
            "vulnerabilityName": "Vuln3",
            "vulnerabilityFamily": "",
            "vulnerabilityTrackingID": "",
            "vulnerabilityTrackingURI": "",
            "vulnerabilityDescription": "<p>Description</p>",
            "vulnerabilityDescriptionAttachment": "",
            "vulnerabilityCVE": "",
            "cveScore": 10,
            "overallScore": 10,
            "overallLevel": "Critical",
            "supportingAssetRef": [
                1,
                2
            ]
        },
        {
            "projectName": "",
            "projectVersion": "",
            "vulnerabilityId": 4,
            "vulnerabilityName": "Vuln4",
            "vulnerabilityFamily": "Code Quality Vulnerability",
            "vulnerabilityTrackingID": "",
            "vulnerabilityTrackingURI": "",
            "vulnerabilityDescription": "<p>does not matter</p>",
            "vulnerabilityDescriptionAttachment": "",
            "vulnerabilityCVE": "",
            "cveScore": 0,
            "overallScore": 0,
            "overallLevel": "Low",
            "supportingAssetRef": [
                1
            ]
        },
        {
            "projectName": "",
            "projectVersion": "",
            "vulnerabilityId": 5,
            "vulnerabilityName": "Vuln5",
            "vulnerabilityFamily": "Code Permission Vulnerability",
            "vulnerabilityTrackingID": "",
            "vulnerabilityTrackingURI": "",
            "vulnerabilityDescription": "<p>does not matter</p>",
            "vulnerabilityDescriptionAttachment": "",
            "vulnerabilityCVE": "",
            "cveScore": 0,
            "overallScore": 0,
            "overallLevel": "Low",
            "supportingAssetRef": [
                1
            ]
        },
        {
            "projectName": "",
            "projectVersion": "",
            "vulnerabilityId": 6,
            "vulnerabilityName": "Vuln6",
            "vulnerabilityFamily": "Code Permission Vulnerability",
            "vulnerabilityTrackingID": "",
            "vulnerabilityTrackingURI": "",
            "vulnerabilityDescription": "<p>asd</p>",
            "vulnerabilityDescriptionAttachment": "",
            "vulnerabilityCVE": "",
            "cveScore": 6.9,
            "overallScore": 7,
            "overallLevel": "Medium",
            "supportingAssetRef": [
                2
            ]
        },
        {
            "projectName": "",
            "projectVersion": "",
            "vulnerabilityId": 7,
            "vulnerabilityName": "Vuln7",
            "vulnerabilityFamily": "Code Permission Vulnerability",
            "vulnerabilityTrackingID": "",
            "vulnerabilityTrackingURI": "",
            "vulnerabilityDescription": "<p>asd</p>",
            "vulnerabilityDescriptionAttachment": "",
            "vulnerabilityCVE": "",
            "cveScore": 7.9,
            "overallScore": 8,
            "overallLevel": "High",
            "supportingAssetRef": [
                2
            ]
        }
    ]
}