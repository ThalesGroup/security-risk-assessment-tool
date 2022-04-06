const xml = require('fs').readFileSync('./lib/test/test-3/test-3.xml', 'utf8');
const parser = require('../../src/api/xml-json/parser');

const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');

describe('XML is newly created', () => {
  const ISRAProjectData = parser(xml);

  test('get israProject', () => {
    expect(ISRAProjectData instanceof ISRAProject).toBe(true);
  });

  const israProject = ISRAProjectData.properties;
  const {
    ISRAmeta,
    ProjectContext,
    BusinessAsset,
    SupportingAssetsDesc,
    SupportingAsset,
    Risk,
    Vulnerability,
  } = israProject;

  describe('get ISRAmeta', () => {
    test('get projectName', () => {
      expect(ISRAmeta.projectName).toBe('');
    });

    test('get projectOrganization', () => {
      expect(ISRAmeta.projectOrganization).toBe('');
    });

    test('get projectVersion', () => {
      expect(ISRAmeta.projectVersion).toBe('');
    });

    describe('get ISRAtracking', () => {
      test('validate no of ISRAtracking', () => {
        expect(ISRAmeta.ISRAtracking.size).toBe(1);
      });

      const israTracking1 = {
        trackingIteration: 1,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-28',
        trackingComment: '',
      };

      test('get israTracking 1', () => {
        expect(ISRAmeta.ISRAtracking.get(1).properties).toEqual(israTracking1);
      });
    });

    test('get businessAssetsCount', () => {
      expect(BusinessAsset.size).toBe(1);
      expect(ISRAmeta.businessAssetsCount).toBe(1);
    });

    test('get supportingAssetsCount', () => {
      expect(SupportingAsset.size).toBe(1);
      expect(ISRAmeta.supportingAssetsCount).toBe(1);
    });

    test('get risksCount', () => {
      expect(Risk.size).toBe(1);
      expect(ISRAmeta.risksCount).toBe(1);
    });

    test('get vulnerabilitiesCount', () => {
      expect(Vulnerability.size).toBe(1);
      expect(ISRAmeta.vulnerabilitiesCount).toBe(1);
    });
  });

  describe('get ProjectContext', () => {
    test('get projectDescription', () => {
      expect(ProjectContext.projectDescription).toBe('');
    });

    test('get projectURL', () => {
      expect(ProjectContext.projectURL).toBe('');
    });

    test('get projectDescriptionAttachment', () => {
      expect(ProjectContext.projectDescriptionAttachment).toBe('');
    });

    test('get securityProjectObjectives', () => {
      expect(ProjectContext.securityProjectObjectives).toBe('');
    });

    test('get securityOfficerObjectives', () => {
      expect(ProjectContext.securityOfficerObjectives).toBe('');
    });

    test('get securityAssumptions', () => {
      expect(ProjectContext.securityAssumptions).toBe('');
    });
  });

  describe('get BusinessAsset', () => {
    const ba1 = {
      businessAssetId: 1,
      businessAssetName: '',
      businessAssetType: 'Data',
      businessAssetDescription: '',
      businessAssetProperties: {
        businessAssetIdRef: 1,
        businessAssetConfidentiality: 3,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 3,
        businessAssetAuthenticity: 3,
        businessAssetAuthorization: 3,
        businessAssetNonRepudiation: 3,
      },
    };

    test('get businessAsset1', () => {
      expect(BusinessAsset.get(1).properties).toEqual(ba1);
    });
  });

  test('get SupportingAssetDesc', () => {
    expect(SupportingAssetsDesc).toBe('');
  });

  describe('get SupportingAsset', () => {
    const sa1 = {
      supportingAssetId: 1,
      supportingAssetHLDId: '',
      supportingAssetName: '',
      supportingAssetType: '',
      supportingAssetSecurityLevel: -1,
      businessAssetRefs: new Set([]),
    };

    test('get supportingAsset1', () => {
      expect(SupportingAsset.get(1).properties).toEqual(sa1);
    });
  });

  describe('get Risk', () => {
    const risk1 = {
      riskId: 1,
      projectNameRef: '',
      projectVersionRef: '',
      riskName: {
        riskIdRef: 1,
        riskName: 'As a , I can  the  compromising the  in order to ',
        threatAgent: '',
        threatAgentDetail: '',
        threatVerb: '',
        threatVerbDetail: '',
        motivation: '',
        motivationDetail: '',
        businessAssetRef: null,
        supportingAssetRef: null,
      },
      riskLikelihood: {
        riskIdRef: 1,
        riskLikelihood: 3,
        riskLikelihoodDetail: '',
        skillLevel: null,
        reward: null,
        accessResources: null,
        size: null,
        intrusionDetection: null,
        threatFactorScore: null,
        threatFactorLevel: '',
        occurrence: null,
        occurrenceLevel: '',
      },
      riskImpact: {
        riskIdRef: 1,
        riskImpact: null,
        businessAssetConfidentialityFlag: 1,
        businessAssetIntegrityFlag: 1,
        businessAssetAvailabilityFlag: 1,
        businessAssetAuthenticityFlag: 1,
        businessAssetAuthorizationFlag: 1,
        businessAssetNonRepudiationFlag: 1,
      },
      riskAttackPaths: expect.any(Map),
      allAttackPathsName: '',
      allAttackPathsScore: null,
      inherentRiskScore: 0,
      riskMitigation: expect.any(Map),
      mitigatedRiskScore: 0,
      riskManagementDecision: '',
      riskManagementDetail: '',
      residualRiskScore: 0,
      residualRiskLevel: 'Low',
    };

    const riskAttackPath1 = {
      riskIdRef: 1,
      riskAttackPathId: 1,
      vulnerabilityRef: expect.any(Map),
      attackPathName: '',
      attackPathScore: null,
    };

    const vulRef1 = {
      vulnerabilityIdRef: null,
      score: null,
      name: '',
    };

    const riskMitigation1 = {
      riskIdRef: 1,
      riskMitigationId: 1,
      description: '',
      benefits: 0,
      cost: null,
      decision: '',
      decisionDetail: '',
      mitigationsBenefits: 1,
      mitigationsDoneBenefits: 1,
    };

    test('get risk1', () => {
      expect(Risk.get(1).properties).toEqual(expect.objectContaining(risk1));

      // test risk1's riskAttackPaths
      expect(Risk.get(1).properties.riskAttackPaths.get(1).properties)
        .toEqual(expect.objectContaining(riskAttackPath1));
      expect(Risk.get(1).properties.riskAttackPaths.get(1).properties.vulnerabilityRef.get(null))
        .toEqual(vulRef1);

      // test risk1's riskMitigation
      expect(Risk.get(1).properties.riskMitigation.get(1).properties)
        .toEqual(riskMitigation1);
    });
  });

  describe('get Vulnerability', () => {
    const v1 = {
      projectNameRef: '',
      projectVersionRef: '',
      vulnerabilityId: 1,
      vulnerabilityName: '',
      vulnerabilityFamily: '',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: 'CVSS:2.0/AV:L/AC:M/Au:N/C:P/I:P/A:P/E:ND/RL:ND/RC:ND',
      cveScore: 4.37803212315,
      overallScore: 4,
      overallLevel: 'Medium',
      supportingAssetRef: new Set([]),
    };

    test('get vulnerability1', () => {
      expect(Vulnerability.get(1).properties).toEqual(expect.objectContaining(v1));
    });
  });
});
