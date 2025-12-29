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
        "supportingAssetsCount": 3,
        "risksCount": 1,
        "vulnerabilitiesCount": 3,
        "latestBusinessAssetId": 1,
        "latestSupportingAssetId": 3,
        "latestRiskId": 1,
        "latestVulnerabilityId": 3
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
                "businessAssetAuthenticity": 3,
                "businessAssetAuthorization": 3,
                "businessAssetAvailability": 3,
                "businessAssetConfidentiality": 3,
                "businessAssetIntegrity": 3,
                "businessAssetNonRepudiation": 3
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
        },
        {
            "supportingAssetId": 3,
            "supportingAssetHLDId": "",
            "supportingAssetName": "SA3",
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
            "threatAgentDetail": "",
            "threatVerb": "steal",
            "threatVerbDetail": "",
            "motivation": "Get BA1",
            "motivationDetail": "",
            "businessAssetRef": 1,
            "supportingAssetRef": 1,
            "isAutomaticRiskName": true,
            "riskLikelihood": {
                "riskLikelihood": 2,
                "riskLikelihoodDetail": "",
                "skillLevel": 5,
                "reward": 4,
                "accessResources": 4,
                "size": 9,
                "intrusionDetection": 9,
                "threatFactorScore": 6.2,
                "threatFactorLevel": "High",
                "occurrence": 5,
                "occurrenceLevel": "Medium",
                "isOWASPLikelihood": true
            },
            "riskImpact": {
                "riskImpact": 3,
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
                            "name": "Vuln1",
                            "vulnerabilityId": 1
                        },
                        {
                            "score": 0,
                            "name": "Vuln2",
                            "vulnerabilityId": 2
                        }
                    ],
                    "attackPathName": "Vuln1 AND Vuln2",
                    "attackPathScore": 0
                },
                {
                    "riskAttackPathId": 2,
                    "vulnerabilityRef": [
                        {
                            "score": 0,
                            "name": "Vuln1",
                            "vulnerabilityId": 1
                        },
                        {
                            "score": 0,
                            "name": "Vuln3",
                            "vulnerabilityId": 3
                        }
                    ],
                    "attackPathName": "Vuln1 AND Vuln3",
                    "attackPathScore": 0
                }
            ],
            "allAttackPathsName": "(Vuln1 AND Vuln2) OR (Vuln1 AND Vuln3)",
            "allAttackPathsScore": 0,
            "inherentRiskScore": 4,
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
            "mitigatedRiskScore": 4,
            "riskManagementDecision": "",
            "riskManagementDetail": "",
            "residualRiskScore": 4,
            "residualRiskLevel": "Low"
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
            "vulnerabilityId": 2,
            "vulnerabilityName": "Vuln2",
            "vulnerabilityFamily": "",
            "vulnerabilityTrackingID": "",
            "vulnerabilityTrackingURI": "",
            "vulnerabilityDescription": "<p>Description</p>",
            "vulnerabilityDescriptionAttachment": "",
            "vulnerabilityCVE": "",
            "cveScore": 0,
            "overallScore": 0,
            "overallLevel": "Low",
            "supportingAssetRef": [
                1,
                3
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
            "cveScore": 0,
            "overallScore": 0,
            "overallLevel": "Low",
            "supportingAssetRef": [
                1,
                "hi",
                3
            ]
        }
    ]
}