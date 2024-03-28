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

const { XML2JSON } = require('../../src/api/index');
const { htmlPattern, attachmentPattern } = require('../../src/model/schema/validation-pattern/validation-pattern');

describe('XML is fully filled, class values are valid', () => {
  const israProject = XML2JSON('./test/test-2/test-2.xml');

  const {
    ISRAmeta,
    ProjectContext,
    BusinessAsset,
    SupportingAssetsDesc,
    SupportingAsset,
    Risk,
    Vulnerability,
  } = israProject.properties;

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
      const israTracking1 = {
        trackingIteration: 1,
        trackingSecurityOfficer: 'anotherUser',
        trackingDate: '2022-03-24',
        trackingComment: 'a comment',
      };

      const israTracking2 = {
        trackingIteration: 2,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: 'a comment 2',
      };

      const israTracking3 = {
        trackingIteration: 3,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: 'a comment 3',
      };

      test.each([
        [
          ISRAmeta.ISRAtracking[0],
          israTracking1,
        ],
        [
          ISRAmeta.ISRAtracking[1],
          israTracking2,
        ],
        [
          ISRAmeta.ISRAtracking[2],
          israTracking3,
        ],
      ])('get ISRAtracking', (value, expected) => {
        expect(value).toEqual(expected);
      });
    });

    test('get businessAssetsCount', () => {
      expect(ISRAmeta.businessAssetsCount).toBe(BusinessAsset.length);
    });

    test('get supportingAssetsCount', () => {
      expect(ISRAmeta.supportingAssetsCount).toBe(SupportingAsset.length);
    });

    test('get risksCount', () => {
      expect(ISRAmeta.risksCount).toBe(Risk.length);
    });

    test('get vulnerabilitiesCount', () => {
      expect(ISRAmeta.vulnerabilitiesCount).toBe(Vulnerability.length);
    });

    test('get latestBusinessAssetId', () => {
      expect(ISRAmeta.latestBusinessAssetId).toBe(4);
    });

    test('get latestSupportingAssetId', () => {
      expect(ISRAmeta.latestSupportingAssetId).toBe(4);
    });

    test('get latestRiskId', () => {
      expect(ISRAmeta.latestRiskId).toBe(5);
    });

    test('get latestVulnerabilityId', () => {
      expect(ISRAmeta.latestVulnerabilityId).toBe(51);
    });
  });

  describe('get ProjectContext', () => {
    test('get projectDescription', () => {
      expect(htmlPattern.test(ProjectContext.projectDescription)).toBe(true);
    });

    test('get projectURL', () => {
      expect(ProjectContext.projectURL).toBe('https://www.google.com/');
    });

    test('get projectDescriptionAttachment', () => {
      //expect(attachmentPattern.test(ProjectContext.projectDescriptionAttachment)).toBe(true);
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
        businessAssetConfidentiality: 4,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 1,
        businessAssetAuthenticity: 1,
        businessAssetAuthorization: 1,
        businessAssetNonRepudiation: 1,
      },
    };

    const ba2 = {
      businessAssetId: 2,
      businessAssetName: 'Financial transactions',
      businessAssetType: 'Data',
      businessAssetDescription: '',
      businessAssetProperties: {
        businessAssetConfidentiality: 3,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 2,
        businessAssetAuthenticity: 2,
        businessAssetAuthorization: 3,
        businessAssetNonRepudiation: 1,
      },
    };

    const ba3 = {
      businessAssetId: 4,
      businessAssetName: 'Server URL',
      businessAssetType: 'Data',
      businessAssetDescription: '<div>Server address to execute financial transactions and retrieve account information</div>',
      businessAssetProperties: {
        businessAssetConfidentiality: 2,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 1,
        businessAssetAuthenticity: 1,
        businessAssetAuthorization: 0,
        businessAssetNonRepudiation: 0,
      },
    };

    test.each([
      [BusinessAsset[0], ba1],
      [BusinessAsset[1], ba2],
      [BusinessAsset[2], ba3],
    ])('get BusinessAsset', (value, expected) => {
      expect(value).toEqual(expected);
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
      businessAssetRef: [1],
    };

    const sa2 = {
      supportingAssetId: 2,
      supportingAssetHLDId: '2',
      supportingAssetName: 'Internet connection (TLS)',
      supportingAssetType: 'Network',
      supportingAssetSecurityLevel: -1,
      businessAssetRef: [4, 2, 1],
    };

    const sa3 = {
      supportingAssetId: 3,
      supportingAssetHLDId: '3',
      supportingAssetName: ' User Interface',
      supportingAssetType: 'Interface',
      supportingAssetSecurityLevel: -1,
      businessAssetRef: [4, 2],
    };

    const sa4 = {
      supportingAssetId: 4,
      supportingAssetHLDId: '4',
      supportingAssetName: 'Device keyboard',
      supportingAssetType: '',
      supportingAssetSecurityLevel: -1,
      businessAssetRef: [2],
    };

    test.each([
      [SupportingAsset[0], sa1],
      [SupportingAsset[1], sa2],
      [SupportingAsset[2], sa3],
      [SupportingAsset[3], sa4],
    ])('get SupportingAsset', (value, expected) => {
      expect(value).toEqual(expected);
    });
  });

  describe('get Risk', () => {
    const risk1 = {
      riskId: 2,
      projectName: 'Sample Mobile Application',
      projectVersion: '1.0',
      riskName: 'As a Criminal, I can steal the User credentials compromising the Internet connection (TLS) in order to get the user credentials to be able to login through the web interface and do financial transactions, exploiting the Keystroke logging attack by malware',
      threatAgent: 'Criminal',
      threatAgentDetail: '',
      threatVerb: 'steal',
      threatVerbDetail: '',
      motivation: 'get the user credentials to be able to login through the web interface and do financial transactions',
      motivationDetail: '',
      businessAssetRef: 1,
      supportingAssetRef: 2,
      isAutomaticRiskName: true,
      riskLikelihood: {
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
        isOWASPLikelihood: true
      },
      riskImpact: {
        riskImpact: 4,
        businessAssetConfidentialityFlag: 1,
        businessAssetIntegrityFlag: 1,
        businessAssetAvailabilityFlag: 1,
        businessAssetAuthenticityFlag: 1,
        businessAssetAuthorizationFlag: 1,
        businessAssetNonRepudiationFlag: 1,
      },
      riskAttackPaths: [
        {
          riskAttackPathId: 1,
          vulnerabilityRef: [
            {
              score: 6,
              name: 'Keystroke logging attack by malware',
              rowId: 5
            },
          ],
          attackPathName: 'Keystroke logging attack by malware',
          attackPathScore: 6,
        },
      ],
      allAttackPathsName: 'Keystroke logging attack by malware',
      allAttackPathsScore: 6,
      inherentRiskScore: 11,
      riskMitigation: [
        {
          riskMitigationId: 1,
          description: '',
          benefits: 0.9,
          cost: null,
          decision: '',
          decisionDetail: '',
        },
      ],
      mitigationsBenefits: 1,
      mitigationsDoneBenefits: 1,
      mitigatedRiskScore: 11,
      riskManagementDecision: 'Avoid',
      riskManagementDetail: '<div>Risk accepted by Product Owner on 2020-11-24.</div>',
      residualRiskScore: 0,
      residualRiskLevel: 'Low',
    };

    const risk2 = {
      riskId: 4,
      projectName: 'Sample Mobile Application',
      projectVersion: '1.0',
      riskName: 'As a Criminal, I can steal the  compromising the  in order to get account information and balance of specific users, exploiting the (Shoulder surfing attack AND Man in the middle attack through network interception) OR (Phone backup data analysis of a non-encrypted backup)',
      threatAgent: 'Criminal',
      threatAgentDetail: '',
      threatVerb: 'steal',
      threatVerbDetail: '',
      motivation: 'get account information and balance of specific users',
      motivationDetail: '',
      businessAssetRef: null,
      supportingAssetRef: null,
      isAutomaticRiskName: true,
      riskLikelihood: {
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
        isOWASPLikelihood: true
      },
      riskImpact: {
        riskImpact: null,
        businessAssetConfidentialityFlag: 1,
        businessAssetIntegrityFlag: 0,
        businessAssetAvailabilityFlag: 0,
        businessAssetAuthenticityFlag: 0,
        businessAssetAuthorizationFlag: 0,
        businessAssetNonRepudiationFlag: 0,
      },
      riskAttackPaths: [
        {
          riskAttackPathId: 1,
          vulnerabilityRef: [
            {
              score: 6,
              name: 'Shoulder surfing attack',
              rowId: 3
            },
            {
              score: 7,
              name: 'Man in the middle attack through network interception',
              rowId: 1
            },
          ],
          attackPathName: 'Shoulder surfing attack AND Man in the middle attack through network interception',
          attackPathScore: 6,
        },
        {
          riskAttackPathId: 2,
          vulnerabilityRef: [
            {
              score: null,
              name: 'Phone backup data analysis of a non-encrypted backup',
              rowId: 16
            },
          ],
          attackPathName: 'Phone backup data analysis of a non-encrypted backup',
          attackPathScore: null,
        },
      ],
      allAttackPathsName: '(Shoulder surfing attack AND Man in the middle attack through network interception) OR (Phone backup data analysis of a non-encrypted backup)',
      allAttackPathsScore: null,
      inherentRiskScore: null,
      riskMitigation: [
        {
          riskMitigationId: 1,
          description: '<div>Encrypt the local storage on the device by using a diversified key from a random generated on the device.</div>',
          benefits: 0.25,
          cost: null,
          decision: '',
          decisionDetail: '',
        },
        {
          riskMitigationId: 2,
          description: '<div>Use hardware-backed encryption available on the device.</div>',
          benefits: 0.75,
          cost: null,
          decision: 'Done',
          decisionDetail: '<div>Usage of secure enclave on iOS and hardware backed keystore on Android.</div>',
        },
      ],
      mitigationsBenefits: 0.25,
      mitigationsDoneBenefits: 0.25,
      mitigatedRiskScore: null,
      riskManagementDecision: 'Mitigate',
      riskManagementDetail: '<div>Risk reduced through implementation of hardware backed storage.</div>',
      residualRiskScore: null,
      residualRiskLevel: 'Low',
    };

    const risk3 = {
      riskId: 5,
      projectName: 'Sample Mobile Application',
      projectVersion: '1.0',
      riskName: 'As a Operationnal Employee, I can steal the User credentials compromising the Internet connection (TLS) in order to get the user credentials to be able to login through the web interface and do financial transactions, exploiting the Shoulder surfing attack AND Man in the middle attack through network interception',
      threatAgent: 'Operational Employee',
      threatAgentDetail: '<div xmlns="http://www.w3.org/1999/xhtml">fddh</div><div xmlns="http://www.w3.org/1999/xhtml">fh</div>',
      threatVerb: 'steal',
      threatVerbDetail: '<ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc"><li>dhdh</li><li>hhdh</li></ul>',
      motivation: 'get the user credentials to be able to login through the web interface and do financial transactions',
      motivationDetail: '<strong xmlns="http://www.w3.org/1999/xhtml"><em><font size="6">HEYYYYYYYYYYYY</font></em></strong>',
      businessAssetRef: 1,
      supportingAssetRef: 2,
      isAutomaticRiskName: true,
      riskLikelihood: {
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
        isOWASPLikelihood: false
      },
      riskImpact: {
        riskImpact: 4,
        businessAssetConfidentialityFlag: 1,
        businessAssetIntegrityFlag: 0,
        businessAssetAvailabilityFlag: 0,
        businessAssetAuthenticityFlag: 0,
        businessAssetAuthorizationFlag: 0,
        businessAssetNonRepudiationFlag: 0,
      },
      riskAttackPaths: [
        {
          riskAttackPathId: 1,
          vulnerabilityRef: [
            {
              score: 6,
              name: 'Shoulder surfing attack',
              rowId: 3
            },
            {
              score: 7,
              name: 'Man in the middle attack through network interception',
              rowId: 1
            },
          ],
          attackPathName: 'Shoulder surfing attack AND Man in the middle attack through network interception',
          attackPathScore: 6,
        },
      ],
      allAttackPathsName: 'Shoulder surfing attack AND Man in the middle attack through network interception',
      allAttackPathsScore: 6,
      inherentRiskScore: 14,
      riskMitigation: [{
        riskMitigationId: 1,
        description: '<div xmlns="http://www.w3.org/1999/xhtml">Additional proprietary encryption.</div><ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc"><li>dfdsfsf</li></ul>',
        benefits: 0.5,
        cost: null,
        decision: 'Done',
        decisionDetail: '<div xmlns="http://www.w3.org/1999/xhtml"><strong>fgdgdfg</strong></div><div xmlns="http://www.w3.org/1999/xhtml"><strong>dsfsfsfsf</strong></div>',
      }],
      mitigationsBenefits: 0.5,
      mitigationsDoneBenefits: 0.5,
      mitigatedRiskScore: 7,
      riskManagementDecision: 'Mitigate',
      riskManagementDetail: '<ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc"><li><strong>Security control implemented by adding proprietary encryption on top of TLS communication layer.</strong></li></ul>',
      residualRiskScore: 7,
      residualRiskLevel: 'Medium',
    };

    const risk4 = {
      riskId: 6,
      projectName: 'Sample Mobile Application',
      projectVersion: '1.0',
      riskName: 'As a Criminal, I can steal the User credentials compromising the  User Interface in order to get the user credentials to be able to login through the web interface and do financial transactions, exploiting the Shoulder surfing attack',
      threatAgent: 'Criminal',
      threatAgentDetail: '',
      threatVerb: 'steal',
      threatVerbDetail: '',
      motivation: 'get the user credentials to be able to login through the web interface and do financial transactions',
      motivationDetail: '<div>The threat agent looks over the shoulder while the person is entering their credentials.</div>',
      businessAssetRef: 1,
      supportingAssetRef: 3,
      isAutomaticRiskName: true,
      riskLikelihood: {
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
        isOWASPLikelihood: true
      },
      riskImpact: {
        riskImpact: 4,
        businessAssetConfidentialityFlag: 1,
        businessAssetIntegrityFlag: 0,
        businessAssetAvailabilityFlag: 0,
        businessAssetAuthenticityFlag: 0,
        businessAssetAuthorizationFlag: 0,
        businessAssetNonRepudiationFlag: 0,
      },
      riskAttackPaths: [
        {
          riskAttackPathId: 1,
          vulnerabilityRef: [
            {
              score: 6,
              name: 'Shoulder surfing attack',
              rowId: 3
            },
          ],
          attackPathName: 'Shoulder surfing attack',
          attackPathScore: 6,
        },
      ],
      allAttackPathsName: 'Shoulder surfing attack',
      allAttackPathsScore: 6,
      inherentRiskScore: 11,
      riskMitigation: [{
        riskMitigationId: 1,
        description: '',
        benefits: 0,
        cost: null,
        decision: '',
        decisionDetail: '',
      }],
      mitigationsBenefits: 1,
      mitigationsDoneBenefits: 1,
      mitigatedRiskScore: 11,
      riskManagementDecision: 'Transfer',
      riskManagementDetail: '<div>Risk transferred to users, with application help  indicating that displaying of sensitive information should be protected from prying eyes and users should be aware of their surroundings.</div>',
      residualRiskScore: 11,
      residualRiskLevel: 'High',
    };

    test.each([
      [Risk[0], risk1],
      [Risk[1], risk2],
      [Risk[2], risk3],
      [Risk[3], risk4],
    ])('get Risk', (value, expected) => {
      expect(value).toEqual(expected);
    });
  });

  describe('get Vulnerability', () => {
    const v1 = {
      projectName: 'Enter your project name',
      projectVersion: '1.0',
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
      supportingAssetRef: [2, 1, 3, 4],
    };

    const v2 = {
      projectName: 'Enter your project name',
      projectVersion: '1.0',
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
      vulnerabilityCVE: 'http:///',
      cveScore: 4.6,
      overallScore: 5,
      overallLevel: 'Medium',
      supportingAssetRef: [1],
    };

    const v3 = {
      projectName: 'Enter your project name',
      projectVersion: '1.0',
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
      vulnerabilityCVE: 'http:///',
      cveScore: 5.7,
      overallScore: 6,
      overallLevel: 'Medium',
      supportingAssetRef: [3],
    };

    const v4 = {
      projectName: 'Enter your project name',
      projectVersion: '1.0',
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
      vulnerabilityCVE: 'http:///',
      cveScore: 5.5,
      overallScore: 6,
      overallLevel: 'Medium',
      supportingAssetRef: [4],
    };

    const v5 = {
      projectName: 'Enter your project name',
      projectVersion: '1.0',
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
      vulnerabilityCVE: 'https:///',
      cveScore: null,
      overallScore: null,
      overallLevel: 'Low',
      supportingAssetRef: [1],
    };

    test.each([
      [Vulnerability[0], v1],
      [Vulnerability[1], v2],
      [Vulnerability[2], v3],
      [Vulnerability[3], v4],
      [Vulnerability[4], v5],
    ])('get Vulnerability', (value, expected) => {
      expect(value).toEqual(expected);
    });
  });
});
