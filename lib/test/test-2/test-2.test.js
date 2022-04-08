const xml = require('fs').readFileSync('./lib/test/test-2/test-2.xml', 'utf8');
const parser = require('../../src/api/xml-json/parser');
const { isValidHtml, isValidAttachment } = require('../../src/model/validation/validation');
const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');

describe('XML is fully filled, class values are valid', () => {
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
      expect(ISRAmeta.projectName).toBe('Sample Mobile Application');
    });

    test('get projectOrganization', () => {
      expect(ISRAmeta.projectOrganization).toBe('ITE');
    });

    test('get projectVersion', () => {
      expect(ISRAmeta.projectVersion).toBe('1.0');
    });

    describe('get ISRAtracking', () => {
      test('validate no of ISRAtracking', () => {
        expect(ISRAmeta.ISRAtracking.size).toBe(3);
      });

      const israTracking1 = {
        trackingIteration: 1,
        trackingSecurityOfficer: 'anotherUser',
        trackingDate: '2022-03-24',
        trackingComment: 'a comment',
      };

      test('get israTracking 1', () => {
        expect(ISRAmeta.ISRAtracking.get(1).properties).toEqual(israTracking1);
      });

      const israTracking2 = {
        trackingIteration: 2,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: 'a comment 2',
      };

      test('get israTracking 2', () => {
        expect(ISRAmeta.ISRAtracking.get(2).properties).toEqual(israTracking2);
      });

      const israTracking3 = {
        trackingIteration: 3,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: 'a comment 3',
      };

      test('get israTracking 3', () => {
        expect(ISRAmeta.ISRAtracking.get(3).properties).toEqual(israTracking3);
      });
    });

    test('get businessAssetsCount', () => {
      expect(BusinessAsset.size).toBe(3);
      expect(ISRAmeta.businessAssetsCount).toBe(3);
    });

    test('get supportingAssetsCount', () => {
      expect(SupportingAsset.size).toBe(4);
      expect(ISRAmeta.supportingAssetsCount).toBe(4);
    });

    test('get risksCount', () => {
      expect(Risk.size).toBe(4);
      expect(ISRAmeta.risksCount).toBe(4);
    });

    test('get vulnerabilitiesCount', () => {
      expect(Vulnerability.size).toBe(5);
      expect(ISRAmeta.vulnerabilitiesCount).toBe(5);
    });
  });

  describe('get ProjectContext', () => {
    test('get projectDescription', () => {
      expect(isValidHtml(ProjectContext.projectDescription)).toBe(true);
    });

    test('get projectURL', () => {
      expect(ProjectContext.projectURL).toBe('https://www.google.com/');
    });

    test('get projectDescriptionAttachment', () => {
      expect(isValidAttachment(ProjectContext.projectDescriptionAttachment)).toBe(true);
    });

    test('get securityProjectObjectives', () => {
      expect(ProjectContext.securityProjectObjectives).toBe('<div xmlns="http://www.w3.org/1999/xhtml" align="center"><em>Test</em></div>');
    });

    test('get securityOfficerObjectives', () => {
      expect(ProjectContext.securityOfficerObjectives).toBe('<strong xmlns="http://www.w3.org/1999/xhtml">Test</strong>');
    });

    test('get securityAssumptions', () => {
      expect(ProjectContext.securityAssumptions).toBe('<div xmlns="http://www.w3.org/1999/xhtml">&lt;dfgdg&gt;</div>'
      + '<ul style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc" xmlns="http://www.w3.org/1999/xhtml" xmlns:pc="http://schemas.microsoft.com/office/infopath/2007/PartnerControls">'
      + '<li>test</li>'
      + '<li>We assume that the platform interface internal processing are valid and yield correct result</li>'
      + '<li><font size="2" face="Calibri">We assume that the server and backend is secure and yield correct results.</font></li></ul>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">hey</div>');
    });
  });

  describe('get BusinessAsset', () => {
    const ba1 = {
      businessAssetId: 1,
      businessAssetName: 'User credentials',
      businessAssetType: 'Data',
      businessAssetDescription: '<ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc"><li xmlns="http://www.w3.org/1999/xhtml" xmlns:pc="http://schemas.microsoft.com/office/infopath/2007/PartnerControls">Presents the user credential to login to the payment application</li></ul>',
      businessAssetProperties: {
        businessAssetIdRef: 1,
        businessAssetConfidentiality: 4,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 1,
        businessAssetAuthenticity: 1,
        businessAssetAuthorization: 1,
        businessAssetNonRepudiation: 1,
      },
    };

    test('get businessAsset1', () => {
      expect(BusinessAsset.get(1).properties).toEqual(ba1);
    });

    const ba2 = {
      businessAssetId: 2,
      businessAssetName: 'Financial transactions',
      businessAssetType: 'Data',
      businessAssetDescription: '',
      businessAssetProperties: {
        businessAssetIdRef: 2,
        businessAssetConfidentiality: 3,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 2,
        businessAssetAuthenticity: 2,
        businessAssetAuthorization: 3,
        businessAssetNonRepudiation: 1,
      },
    };

    test('get businessAsset2', () => {
      expect(BusinessAsset.get(2).properties).toEqual(ba2);
    });

    const ba3 = {
      businessAssetId: 4,
      businessAssetName: 'Server URL',
      businessAssetType: 'Data',
      businessAssetDescription: '<div>Server address to execute financial transactions and retrieve account information</div>',
      businessAssetProperties: {
        businessAssetIdRef: 4,
        businessAssetConfidentiality: 2,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 1,
        businessAssetAuthenticity: 1,
        businessAssetAuthorization: 0,
        businessAssetNonRepudiation: 0,
      },
    };

    test('get businessAsset3', () => {
      expect(BusinessAsset.get(4).properties).toEqual(ba3);
    });
  });

  test('get SupportingAssetDesc', () => {
    expect(SupportingAssetsDesc).toBe('<div xmlns="http://www.w3.org/1999/xhtml" xmlns:pc="http://schemas.microsoft.com/office/infopath/2007/PartnerControls"> </div>');
  });

  describe('get SupportingAsset', () => {
    const sa1 = {
      supportingAssetId: 1,
      supportingAssetHLDId: '1',
      supportingAssetName: 'Local client storage',
      supportingAssetType: 'Hardware device',
      supportingAssetSecurityLevel: -1,
      businessAssetRefs: new Set([1]),
    };

    test('get supportingAsset1', () => {
      expect(SupportingAsset.get(1).properties).toEqual(sa1);
    });

    const sa2 = {
      supportingAssetId: 2,
      supportingAssetHLDId: '2',
      supportingAssetName: 'Internet connection (TLS)',
      supportingAssetType: 'Network',
      supportingAssetSecurityLevel: -1,
      businessAssetRefs: new Set([4, 2, 1]),
    };

    test('get supportingAsset2', () => {
      expect(SupportingAsset.get(2).properties).toEqual(sa2);
    });

    const sa3 = {
      supportingAssetId: 3,
      supportingAssetHLDId: '3',
      supportingAssetName: ' User Interface',
      supportingAssetType: 'Interface',
      supportingAssetSecurityLevel: -1,
      businessAssetRefs: new Set([4, 2]),
    };

    test('get supportingAsset3', () => {
      expect(SupportingAsset.get(3).properties).toEqual(sa3);
    });

    const sa4 = {
      supportingAssetId: 4,
      supportingAssetHLDId: '4',
      supportingAssetName: 'Device keyboard',
      supportingAssetType: '',
      supportingAssetSecurityLevel: -1,
      businessAssetRefs: new Set([2]),
    };

    test('get supportingAsset4', () => {
      expect(SupportingAsset.get(4).properties).toEqual(sa4);
    });
  });

  describe('get Risk', () => {
    const Risk1 = Risk.get(1).properties;
    const Risk2 = Risk.get(2).properties;
    const Risk3 = Risk.get(3).properties;
    const Risk4 = Risk.get(4).properties;

    describe('get risk1', () => {
      const risk1 = {
        riskId: 1,
        projectNameRef: 'Sample Mobile Application',
        projectVersionRef: '1.0',
        riskName: {
          riskIdRef: 1,
          riskName: 'As a Activist, I can steal the User credentials compromising the Internet connection (TLS) in order to get the user credentials to be able to login through the web interface and do financial transactions, exploiting the Shoulder surfing attack AND Man in the middle attack through network interception',
          threatAgent: 'Activist',
          threatAgentDetail: '<div xmlns="http://www.w3.org/1999/xhtml">fddh</div><div xmlns="http://www.w3.org/1999/xhtml">fh</div>',
          threatVerb: 'steal',
          threatVerbDetail: '<ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc"><li>dhdh</li><li>hhdh</li></ul>',
          motivation: 'get the user credentials to be able to login through the web interface and do financial transactions',
          motivationDetail: '<strong xmlns="http://www.w3.org/1999/xhtml"><em><font size="6">HEYYYYYYYYYYYY</font></em></strong>',
          businessAssetRef: 1,
          supportingAssetRef: 2,
        },
        riskLikelihood: {
          riskIdRef: 1,
          riskLikelihood: 3,
          riskLikelihoodDetail: '<div xmlns="http://www.w3.org/1999/xhtml"><strong><em><font size="5">cdf </font></em></strong></div><ul style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc" xmlns="http://www.w3.org/1999/xhtml"><li><strong><em><font size="5">dfdf</font></em></strong></li></ul>',
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
          riskImpact: 4,
          businessAssetConfidentialityFlag: 1,
          businessAssetIntegrityFlag: 0,
          businessAssetAvailabilityFlag: 0,
          businessAssetAuthenticityFlag: 0,
          businessAssetAuthorizationFlag: 0,
          businessAssetNonRepudiationFlag: 0,
        },
        riskAttackPaths: expect.any(Map),
        allAttackPathsName: 'Shoulder surfing attack AND Man in the middle attack through network interception',
        allAttackPathsScore: 6,
        inherentRiskScore: 14,
        riskMitigation: expect.any(Map),
        mitigatedRiskScore: 7,
        riskManagementDecision: 'Mitigate',
        riskManagementDetail: '<ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc"><li><strong>Security control implemented by adding proprietary encryption on top of TLS communication layer.</strong></li></ul>',
        residualRiskScore: 7,
        residualRiskLevel: 'Medium',
      };

      const riskAttackPath1 = {
        riskIdRef: 1,
        riskAttackPathId: 1,
        vulnerabilityRef: expect.any(Map),
        attackPathName: 'Shoulder surfing attack AND Man in the middle attack through network interception',
        attackPathScore: 6,
      };

      const vulRef1 = {
        vulnerabilityIdRef: 3,
        score: 6,
        name: 'Shoulder surfing attack',
      };

      const vulRef2 = {
        vulnerabilityIdRef: 1,
        score: 7,
        name: 'Man in the middle attack through network interception',
      };

      const riskMitigation1 = {
        riskIdRef: 1,
        riskMitigationId: 1,
        description: '<div xmlns="http://www.w3.org/1999/xhtml">Additional proprietary encryption.</div><ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc"><li>dfdsfsf</li></ul>',
        benefits: 0.5,
        cost: null,
        decision: 'Done',
        decisionDetail: '<div xmlns="http://www.w3.org/1999/xhtml"><strong>fgdgdfg</strong></div><div xmlns="http://www.w3.org/1999/xhtml"><strong>dsfsfsfsf</strong></div>',
        mitigationsBenefits: 0.5,
        mitigationsDoneBenefits: 0.5,
      };

      test('get risk1', () => {
        expect(Risk1).toEqual(expect.objectContaining(risk1));

        // test risk1's riskAttackPaths
        expect(Risk1.riskAttackPaths.get(1).properties)
          .toEqual(expect.objectContaining(riskAttackPath1));
        expect(Risk1.riskAttackPaths.get(1).properties.vulnerabilityRef.get(3))
          .toEqual(vulRef1);
        expect(Risk1.riskAttackPaths.get(1).properties.vulnerabilityRef.get(1))
          .toEqual(vulRef2);

        // test risk1's riskMitigation
        expect(Risk1.riskMitigation.get(1).properties)
          .toEqual(riskMitigation1);
      });
    });

    describe('get risk2', () => {
      const risk2 = {
        riskId: 2,
        projectNameRef: 'Sample Mobile Application',
        projectVersionRef: '1.0',
        riskName: {
          riskIdRef: 2,
          riskName: 'As a Criminal, I can steal the User credentials compromising the Internet connection (TLS) in order to get the user credentials to be able to login through the web interface and do financial transactions, exploiting the Keystroke logging attack by malware',
          threatAgent: 'Criminal',
          threatAgentDetail: '',
          threatVerb: 'steal',
          threatVerbDetail: '',
          motivation: 'get the user credentials to be able to login through the web interface and do financial transactions',
          motivationDetail: '',
          businessAssetRef: 1,
          supportingAssetRef: 2,
        },
        riskLikelihood: {
          riskIdRef: 2,
          riskLikelihood: 2,
          riskLikelihoodDetail: '',
          skillLevel: 3,
          reward: 4,
          accessResources: 4,
          size: 9,
          intrusionDetection: 9,
          threatFactorScore: 5.8,
          threatFactorLevel: 'High',
          occurrence: 3,
          occurrenceLevel: 'Medium',
        },
        riskImpact: {
          riskIdRef: 2,
          riskImpact: 4,
          businessAssetConfidentialityFlag: 1,
          businessAssetIntegrityFlag: 1,
          businessAssetAvailabilityFlag: 1,
          businessAssetAuthenticityFlag: 1,
          businessAssetAuthorizationFlag: 1,
          businessAssetNonRepudiationFlag: 1,
        },
        riskAttackPaths: expect.any(Map),
        allAttackPathsName: 'Keystroke logging attack by malware',
        allAttackPathsScore: 6,
        inherentRiskScore: 11,
        riskMitigation: expect.any(Map),
        mitigatedRiskScore: 11,
        riskManagementDecision: 'Avoid',
        riskManagementDetail: '<div>Risk accepted by Product Owner on 2020-11-24.</div>',
        residualRiskScore: 0,
        residualRiskLevel: 'Low',
      };

      const riskAttackPath1 = {
        riskIdRef: 2,
        riskAttackPathId: 1,
        vulnerabilityRef: expect.any(Map),
        attackPathName: 'Keystroke logging attack by malware',
        attackPathScore: 6,
      };

      const vulRef1 = {
        vulnerabilityIdRef: 5,
        score: 6,
        name: 'Keystroke logging attack by malware',
      };

      const riskMitigation1 = {
        riskIdRef: 2,
        riskMitigationId: 1,
        description: '',
        benefits: 0.9,
        cost: null,
        decision: '',
        decisionDetail: '',
        mitigationsBenefits: 1,
        mitigationsDoneBenefits: 1,
      };

      test('get risk2', () => {
        expect(Risk2).toEqual(expect.objectContaining(risk2));

        // test risk2's riskAttackPaths
        expect(Risk2.riskAttackPaths.get(1).properties)
          .toEqual(expect.objectContaining(riskAttackPath1));
        expect(Risk2.riskAttackPaths.get(1).properties.vulnerabilityRef.get(5))
          .toEqual(vulRef1);

        // test risk2's riskMitigation
        expect(Risk2.riskMitigation.get(1).properties)
          .toEqual(riskMitigation1);
      });
    });

    describe('get risk3', () => {
      const risk3 = {
        riskId: 3,
        projectNameRef: 'Sample Mobile Application',
        projectVersionRef: '1.0',
        riskName: {
          riskIdRef: 3,
          riskName: 'As a Criminal, I can steal the User credentials compromising the  User Interface in order to get the user credentials to be able to login through the web interface and do financial transactions, exploiting the Shoulder surfing attack',
          threatAgent: 'Criminal',
          threatAgentDetail: '',
          threatVerb: 'steal',
          threatVerbDetail: '',
          motivation: 'get the user credentials to be able to login through the web interface and do financial transactions',
          motivationDetail: '<div>The threat agent looks over the shoulder while the person is entering their credentials.</div>',
          businessAssetRef: 1,
          supportingAssetRef: 3,
        },
        riskLikelihood: {
          riskIdRef: 3,
          riskLikelihood: 2,
          riskLikelihoodDetail: '',
          skillLevel: 9,
          reward: 4,
          accessResources: 4,
          size: 9,
          intrusionDetection: 9,
          threatFactorScore: 7,
          threatFactorLevel: 'High',
          occurrence: 5,
          occurrenceLevel: 'Medium',
        },
        riskImpact: {
          riskIdRef: 3,
          riskImpact: 4,
          businessAssetConfidentialityFlag: 1,
          businessAssetIntegrityFlag: 0,
          businessAssetAvailabilityFlag: 0,
          businessAssetAuthenticityFlag: 0,
          businessAssetAuthorizationFlag: 0,
          businessAssetNonRepudiationFlag: 0,
        },
        riskAttackPaths: expect.any(Map),
        allAttackPathsName: 'Shoulder surfing attack',
        allAttackPathsScore: 6,
        inherentRiskScore: 11,
        riskMitigation: expect.any(Map),
        mitigatedRiskScore: 11,
        riskManagementDecision: 'Transfer',
        riskManagementDetail: '<div>Risk transferred to users, with application help  indicating that displaying of sensitive information should be protected from prying eyes and users should be aware of their surroundings.</div>',
        residualRiskScore: 11,
        residualRiskLevel: 'High',
      };

      const riskAttackPath1 = {
        riskIdRef: 3,
        riskAttackPathId: 1,
        vulnerabilityRef: expect.any(Map),
        attackPathName: 'Shoulder surfing attack',
        attackPathScore: 6,
      };

      const vulRef1 = {
        vulnerabilityIdRef: 3,
        score: 6,
        name: 'Shoulder surfing attack',
      };

      const riskMitigation1 = {
        riskIdRef: 3,
        riskMitigationId: 1,
        description: '',
        benefits: 0,
        cost: null,
        decision: '',
        decisionDetail: '',
        mitigationsBenefits: 1,
        mitigationsDoneBenefits: 1,
      };

      test('get risk3', () => {
        expect(Risk3).toEqual(expect.objectContaining(risk3));

        // test risk2's riskAttackPaths
        expect(Risk3.riskAttackPaths.get(1).properties)
          .toEqual(expect.objectContaining(riskAttackPath1));
        expect(Risk3.riskAttackPaths.get(1).properties.vulnerabilityRef.get(3))
          .toEqual(vulRef1);

        // test risk2's riskMitigation
        expect(Risk3.riskMitigation.get(1).properties)
          .toEqual(riskMitigation1);
      });
    });

    describe('get risk4', () => {
      const risk4 = {
        riskId: 4,
        projectNameRef: 'Sample Mobile Application',
        projectVersionRef: '1.0',
        riskName: {
          riskIdRef: 4,
          riskName: 'As a Criminal, I can steal the  compromising the Local client storage in order to get account information and balance of specific users, exploiting the (Shoulder surfing attack AND Man in the middle attack through network interception) OR (Phone backup data analysis of a non-encrypted backup)',
          threatAgent: 'Criminal',
          threatAgentDetail: '',
          threatVerb: 'steal',
          threatVerbDetail: '',
          motivation: 'get account information and balance of specific users',
          motivationDetail: '',
          businessAssetRef: 3,
          supportingAssetRef: 1,
        },
        riskLikelihood: {
          riskIdRef: 4,
          riskLikelihood: 2,
          riskLikelihoodDetail: '',
          skillLevel: 3,
          reward: 1,
          accessResources: 4,
          size: 9,
          intrusionDetection: 9,
          threatFactorScore: 5.2,
          threatFactorLevel: 'High',
          occurrence: 3,
          occurrenceLevel: 'Medium',
        },
        riskImpact: {
          riskIdRef: 4,
          riskImpact: null,
          businessAssetConfidentialityFlag: 1,
          businessAssetIntegrityFlag: 0,
          businessAssetAvailabilityFlag: 0,
          businessAssetAuthenticityFlag: 0,
          businessAssetAuthorizationFlag: 0,
          businessAssetNonRepudiationFlag: 0,
        },
        riskAttackPaths: expect.any(Map),
        allAttackPathsName: '(Shoulder surfing attack AND Man in the middle attack through network interception) OR (Phone backup data analysis of a non-encrypted backup)',
        allAttackPathsScore: null,
        inherentRiskScore: null,
        riskMitigation: expect.any(Map),
        mitigatedRiskScore: null,
        riskManagementDecision: 'Mitigate',
        riskManagementDetail: '<div>Risk reduced through implementation of hardware backed storage.</div>',
        residualRiskScore: null,
        residualRiskLevel: 'Low',
      };

      const riskAttackPath1 = {
        riskIdRef: 4,
        riskAttackPathId: 1,
        vulnerabilityRef: expect.any(Map),
        attackPathName: 'Shoulder surfing attack AND Man in the middle attack through network interception',
        attackPathScore: 6,
      };

      const vulRef1 = {
        vulnerabilityIdRef: 3,
        score: 6,
        name: 'Shoulder surfing attack',
      };

      const vulRef2 = {
        vulnerabilityIdRef: 1,
        score: 7,
        name: 'Man in the middle attack through network interception',
      };

      const riskAttackPath2 = {
        riskIdRef: 4,
        riskAttackPathId: 2,
        vulnerabilityRef: expect.any(Map),
        attackPathName: 'Phone backup data analysis of a non-encrypted backup',
        attackPathScore: null,
      };

      const vulRef3 = {
        vulnerabilityIdRef: 16,
        score: null,
        name: 'Phone backup data analysis of a non-encrypted backup',
      };

      const riskMitigation1 = {
        riskIdRef: 4,
        riskMitigationId: 1,
        description: '<div>Encrypt the local storage on the device by using a diversified key from a random generated on the device.</div>',
        benefits: 0.25,
        cost: null,
        decision: '',
        decisionDetail: '',
        mitigationsBenefits: 0.25,
        mitigationsDoneBenefits: 0.25,
      };

      const riskMitigation2 = {
        riskIdRef: 4,
        riskMitigationId: 2,
        description: '<div>Use hardware-backed encryption available on the device.</div>',
        benefits: 0.75,
        cost: null,
        decision: 'Done',
        decisionDetail: '<div>Usage of secure enclave on iOS and hardware backed keystore on Android.</div>',
        mitigationsBenefits: 0.25,
        mitigationsDoneBenefits: 0.25,
      };

      test('get risk4', () => {
        expect(Risk4).toEqual(expect.objectContaining(risk4));

        // test risk2's riskAttackPaths
        expect(Risk4.riskAttackPaths.get(1).properties)
          .toEqual(expect.objectContaining(riskAttackPath1));
        expect(Risk4.riskAttackPaths.get(1).properties.vulnerabilityRef.get(3))
          .toEqual(vulRef1);
        expect(Risk4.riskAttackPaths.get(1).properties.vulnerabilityRef.get(1))
          .toEqual(vulRef2);

        expect(Risk4.riskAttackPaths.get(2).properties)
          .toEqual(expect.objectContaining(riskAttackPath2));
        expect(Risk4.riskAttackPaths.get(2).properties.vulnerabilityRef.get(16))
          .toEqual(vulRef3);

        // test risk2's riskMitigation
        expect(Risk4.riskMitigation.get(1).properties)
          .toEqual(riskMitigation1);
        expect(Risk4.riskMitigation.get(2).properties)
          .toEqual(riskMitigation2);
      });
    });
  });

  describe('get Vulnerability', () => {
    const vulnerability = israProject.Vulnerability;

    const v1 = {
      projectNameRef: 'Enter your project name',
      projectVersionRef: '1.0',
      vulnerabilityId: 1,
      vulnerabilityName: 'Man in the middle attack through network interception',
      vulnerabilityFamily: 'API Abuse',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '<div xmlns="http://www.w3.org/1999/xhtml">Assumptions for this attack:</div>'
      + '<ul style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc" xmlns="http://www.w3.org/1999/xhtml">'
      + '<li>TLS is used.</li></ul>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">In all cases, TLS is required for all mobile deployments today on the official stores. The two use-cases possible are :</div>'
      + '<ol style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="1" xmlns="http://www.w3.org/1999/xhtml">'
      + '<li>'
      + '<div>A Trusted CA is compromised</div>'
      + '</li><li>'
      + '<div>Installing a custom CA using social engineering or malware</div></li></ol>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">We are taking the highest CVSS3 scoring between the two use cases above.</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">CVSS:3.0/AV:N/AC:H/PR:N/UI:N/S:U/C:H/I:N/A:N</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">CVSSV3 Score: 5.9</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>',
      vulnerabilityDescriptionAttachment: expect.any(String),
      vulnerabilityCVE: 'CVSS:2.0/AV:N/AC:M/Au:N/C:C/I:N/A:N/E:F/RL:ND/RC:ND',
      cveScore: 6.767863536,
      overallScore: 7,
      overallLevel: 'High',
      supportingAssetRef: new Set([2, 1, 3, 4]),
    };

    test('get vulnerability1', () => {
      expect(vulnerability.get(1).properties).toEqual(expect.objectContaining(v1));
      expect(isValidAttachment(vulnerability.get(1).properties.vulnerabilityDescriptionAttachment))
        .toBe(true);
    });

    const v2 = {
      projectNameRef: 'Enter your project name',
      projectVersionRef: '1.0',
      vulnerabilityId: 2,
      vulnerabilityName: 'Dumping of the local storage from a rooted device',
      vulnerabilityFamily: '',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '<div xmlns="http://www.w3.org/1999/xhtml">When a device is rooted it is possible to completely dump data anywhere on the devices, bypassing the platform\'s sandbox mechanisms.</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">CVSS:3.0/AV:P/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">CVSSV3 Score: 4.6</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">Assumptions:</div>'
      + '<ul style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc" xmlns="http://www.w3.org/1999/xhtml">'
      + '<li>Physical access to the device</li></ul>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: '',
      cveScore: 4.6,
      overallScore: 5,
      overallLevel: 'Medium',
      supportingAssetRef: new Set([1]),
    };

    test('get vulnerability2', () => {
      expect(vulnerability.get(2).properties).toEqual(v2);
    });

    const v3 = {
      projectNameRef: 'Enter your project name',
      projectVersionRef: '1.0',
      vulnerabilityId: 3,
      vulnerabilityName: 'Shoulder surfing attack',
      vulnerabilityFamily: '',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '<div xmlns="http://www.w3.org/1999/xhtml">Attacker peeks at the user\'s screen to discover the assets.</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">CVSS:3.0/AV:A/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">CVSSV3: 5.7</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">Assumption:</div>'
      + '<ul style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc" xmlns="http://www.w3.org/1999/xhtml">'
      + '<li>User interaction required by using the application and accessing / showing confidential data</li></ul>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: '',
      cveScore: 5.7,
      overallScore: 6,
      overallLevel: 'Medium',
      supportingAssetRef: new Set([3]),
    };

    test('get vulnerability3', () => {
      expect(vulnerability.get(3).properties).toEqual(v3);
    });

    const v4 = {
      projectNameRef: 'Enter your project name',
      projectVersionRef: '1.0',
      vulnerabilityId: 5,
      vulnerabilityName: 'Keystroke logging attack by malware',
      vulnerabilityFamily: '',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '<div xmlns="http://www.w3.org/1999/xhtml">Attacker logs all the key inputs done by the user, for example a fake keyboard application.</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">CVSS:3.0/AV:L/AC:L/PR:N/UI:R/S:U/C:H/I:N/A:N</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">CVSSV3: 5.5</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: '',
      cveScore: 5.5,
      overallScore: 6,
      overallLevel: 'Medium',
      supportingAssetRef: new Set([4]),
    };

    test('get vulnerability4', () => {
      expect(vulnerability.get(5).properties).toEqual(v4);
    });

    const v5 = {
      projectNameRef: 'Enter your project name',
      projectVersionRef: '1.0',
      vulnerabilityId: 16,
      vulnerabilityName: 'Phone backup data analysis of a non-encrypted backup',
      vulnerabilityFamily: '',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '<div xmlns="http://www.w3.org/1999/xhtml">Attacker makes a backup of the data on the devices or has access to this data and attacks the data backup blob. </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">CVSS:3.0/AV:L/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml">CVSS3: 6.2</div>'
      + '<div xmlns="http://www.w3.org/1999/xhtml"> </div>',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: '',
      cveScore: null,
      overallScore: null,
      overallLevel: 'Low',
      supportingAssetRef: new Set([1]),
    };

    test('get vulnerability5', () => {
      expect(vulnerability.get(16).properties).toEqual(v5);
    });
  });
});
