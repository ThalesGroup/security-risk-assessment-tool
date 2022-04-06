const xml = require('fs').readFileSync('./lib/test/test-7/test-7.xml', 'utf8');
const parser = require('../../src/api/xml-json/parser');

const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');

// checks for presence of HTML elements
const isValidHtml = (string) => {
  const pattern = /<\/?[a-z][\s\S]*>/i;
  return pattern.test(string);
};

describe('XML is partially filled, class values are valid', () => {
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
      expect(ISRAmeta.projectName).toBe('name of proj');
    });

    test('get projectOrganization', () => {
      expect(ISRAmeta.projectOrganization).toBe('');
    });

    test('get projectVersion', () => {
      expect(ISRAmeta.projectVersion).toBe('');
    });

    describe('get ISRAtracking', () => {
      test('validate no of ISRAtracking', () => {
        expect(ISRAmeta.ISRAtracking.size).toBe(3);
      });

      const israTracking1 = {
        trackingIteration: 1,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: '1',
      };

      test('get israTracking 1', () => {
        expect(ISRAmeta.ISRAtracking.get(1).properties).toEqual(israTracking1);
      });

      const israTracking2 = {
        trackingIteration: 2,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: '2',
      };

      test('get israTracking 2', () => {
        expect(ISRAmeta.ISRAtracking.get(2).properties).toEqual(israTracking2);
      });

      const israTracking3 = {
        trackingIteration: 3,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: '3',
      };

      test('get israTracking 3', () => {
        expect(ISRAmeta.ISRAtracking.get(3).properties).toEqual(israTracking3);
      });
    });

    test('get businessAssetsCount', () => {
      expect(BusinessAsset.size).toBe(0);
      expect(ISRAmeta.businessAssetsCount).toBe(0);
    });

    test('get supportingAssetsCount', () => {
      expect(SupportingAsset.size).toBe(1);
      expect(ISRAmeta.supportingAssetsCount).toBe(1);
    });

    test('get risksCount', () => {
      expect(Risk.size).toBe(2);
      expect(ISRAmeta.risksCount).toBe(2);
    });

    test('get vulnerabilitiesCount', () => {
      expect(Vulnerability.size).toBe(2);
      expect(ISRAmeta.vulnerabilitiesCount).toBe(2);
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
      expect(isValidHtml(ProjectContext.securityOfficerObjectives)).toBe(true);
    });

    test('get securityAssumptions', () => {
      expect(ProjectContext.securityAssumptions).toBe('');
    });
  });

  test('get SupportingAssetDesc', () => {
    expect(SupportingAssetsDesc).toBe('');
  });

  describe('get SupportingAsset', () => {
    const sa1 = {
      supportingAssetId: 1,
      supportingAssetHLDId: '',
      supportingAssetName: 'SA1',
      supportingAssetType: '',
      supportingAssetSecurityLevel: -1,
      businessAssetRefs: new Set([]),
    };

    test('get supportingAsset1', () => {
      expect(SupportingAsset.get(1).properties).toEqual(sa1);
    });
  });

  describe('get Risk', () => {
    const Risk1 = Risk.get(1).properties;
    const Risk2 = Risk.get(2).properties;

    test('get risk1', () => {
      const risk1 = {
        riskId: 1,
        projectNameRef: 'name of proj',
        projectVersionRef: '',
        riskName: {
          riskIdRef: 1,
          riskName: 'As a Criminal, I can  the  compromising the SA1 in order to , exploiting the (V1 AND ) OR ()',
          threatAgent: 'Criminal',
          threatAgentDetail: '<ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc"><li>test</li></ul>',
          threatVerb: '',
          threatVerbDetail: '',
          motivation: '',
          motivationDetail: '',
          businessAssetRef: null,
          supportingAssetRef: 1,
        },
        riskLikelihood: {
          riskIdRef: 1,
          riskLikelihood: 2,
          riskLikelihoodDetail: '',
          skillLevel: null,
          reward: null,
          accessResources: 7,
          size: null,
          intrusionDetection: null,
          threatFactorScore: 7,
          threatFactorLevel: 'High',
          occurrence: 5,
          occurrenceLevel: 'Medium',
        },
        riskImpact: {
          riskIdRef: 1,
          riskImpact: null,
          businessAssetConfidentialityFlag: 1,
          businessAssetIntegrityFlag: 1,
          businessAssetAvailabilityFlag: 0,
          businessAssetAuthenticityFlag: 0,
          businessAssetAuthorizationFlag: 0,
          businessAssetNonRepudiationFlag: 0,
        },
        riskAttackPaths: expect.any(Map),
        allAttackPathsName: '(V1 AND ) OR ()',
        allAttackPathsScore: 4,
        inherentRiskScore: 0,
        riskMitigation: expect.any(Map),
        mitigatedRiskScore: 0,
        riskManagementDecision: '',
        riskManagementDetail: '<strong xmlns="http://www.w3.org/1999/xhtml"><em><font size="6">test</font></em></strong>',
        residualRiskScore: 0,
        residualRiskLevel: 'Low',
      };

      const riskAttackPath1 = {
        riskIdRef: 1,
        riskAttackPathId: 1,
        vulnerabilityRef: expect.any(Map),
        attackPathName: 'V1 AND ',
        attackPathScore: 4,
      };

      const vulRef1 = {
        vulnerabilityIdRef: 1,
        score: 4,
        name: 'V1',
      };

      const vulRef2 = {
        vulnerabilityIdRef: null,
        score: null,
        name: '',
      };

      const riskAttackPath2 = {
        riskIdRef: 1,
        riskAttackPathId: 2,
        vulnerabilityRef: expect.any(Map),
        attackPathName: '',
        attackPathScore: null,
      };

      const vulRef3 = {
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

      expect(Risk1).toEqual(expect.objectContaining(risk1));

      // test risk1's riskAttackPaths
      expect(Risk1.riskAttackPaths.get(1).properties)
        .toEqual(expect.objectContaining(riskAttackPath1));
      expect(Risk1.riskAttackPaths.get(1).properties.vulnerabilityRef.get(1))
        .toEqual(vulRef1);
      expect(Risk1.riskAttackPaths.get(1).properties.vulnerabilityRef.get(null))
        .toEqual(vulRef2);

      expect(Risk1.riskAttackPaths.get(2).properties)
        .toEqual(expect.objectContaining(riskAttackPath2));
      expect(Risk1.riskAttackPaths.get(2).properties.vulnerabilityRef.get(null))
        .toEqual(vulRef3);

      // test risk1's riskMitigation
      expect(Risk1.riskMitigation.get(1).properties)
        .toEqual(riskMitigation1);
    });

    test('get risk2', () => {
      const risk2 = {
        riskId: 2,
        projectNameRef: 'name of proj',
        projectVersionRef: '',
        riskName: {
          riskIdRef: 2,
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
          riskIdRef: 2,
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
          riskIdRef: 2,
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

      expect(Risk2).toEqual(expect.objectContaining(risk2));

      // test risk2's riskAttackPaths
      expect(Risk2.riskAttackPaths.size).toBe(0);

      // test risk1's riskMitigation
      expect(Risk2.riskMitigation.size).toBe(0);
    });
  });

  describe('get Vulnerability', () => {
    const Vulnerability1 = Vulnerability.get(1).properties;
    const Vulnerability2 = Vulnerability.get(2).properties;

    const v1 = {
      projectNameRef: 'name of proj',
      projectVersionRef: '',
      vulnerabilityId: 1,
      vulnerabilityName: 'V1',
      vulnerabilityFamily: 'API Abuse',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: 'CVSS',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: 'CVSS:2.0/AV:L/AC:M/Au:N/C:P/I:P/A:P/E:ND/RL:ND/RC:ND',
      cveScore: 4.37803212315,
      overallScore: 4,
      overallLevel: 'Medium',
      supportingAssetRef: new Set([]),
    };

    test('get vulnerability1', () => {
      expect(Vulnerability1).toEqual(v1);
    });

    const v2 = {
      projectNameRef: 'name of proj',
      projectVersionRef: '',
      vulnerabilityId: 2,
      vulnerabilityName: '',
      vulnerabilityFamily: 'Environmental Vulnerability',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: '',
      cveScore: null,
      overallScore: null,
      overallLevel: 'Low',
      supportingAssetRef: new Set([]),
    };

    test('get vulnerability2', () => {
      expect(Vulnerability2).toEqual(v2);
    });
  });
});
