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

describe('XML is newly created, class values are valid', () => {
  const israProject = XML2JSON('./test/test-3/test-3.xml');

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
        expect(ISRAmeta.ISRAtracking.length).toBe(1);
      });

      const israTracking1 = {
        trackingIteration: 1,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-28',
        trackingComment: '',
      };

      test('get israTracking 1', () => {
        expect(ISRAmeta.ISRAtracking[0]).toEqual(israTracking1);
      });
    });

    test('get businessAssetsCount', () => {
      expect(BusinessAsset.length).toBe(1);
      expect(ISRAmeta.businessAssetsCount).toBe(1);
    });

    test('get supportingAssetsCount', () => {
      expect(SupportingAsset.length).toBe(1);
      expect(ISRAmeta.supportingAssetsCount).toBe(1);
    });

    test('get risksCount', () => {
      expect(Risk.length).toBe(1);
      expect(ISRAmeta.risksCount).toBe(1);
    });

    test('get vulnerabilitiesCount', () => {
      expect(Vulnerability.length).toBe(1);
      expect(ISRAmeta.vulnerabilitiesCount).toBe(1);
    });

    test('get latestBusinessAssetId', () => {
      expect(ISRAmeta.latestBusinessAssetId).toBe(1);
    });

    test('get latestSupportingAssetId', () => {
      expect(ISRAmeta.latestSupportingAssetId).toBe(1);
    });

    test('get latestRiskId', () => {
      expect(ISRAmeta.latestRiskId).toBe(1);
    });

    test('get latestVulnerabilityId', () => {
      expect(ISRAmeta.latestVulnerabilityId).toBe(1);
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
      businessAssetName: 'Please name Business Asset 1',
      businessAssetType: 'Data',
      businessAssetDescription: '',
      businessAssetProperties: {
        businessAssetConfidentiality: 3,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 3,
        businessAssetAuthenticity: 3,
        businessAssetAuthorization: 3,
        businessAssetNonRepudiation: 3,
      },
    };

    test('get BusinessAsset', () => {
      expect(BusinessAsset[0]).toEqual(ba1);
    });
  });

  test('get SupportingAssetDesc', () => {
    expect(SupportingAssetsDesc).toBe('');
  });

  describe('get SupportingAsset', () => {
    const sa1 = {
      supportingAssetId: 1,
      supportingAssetHLDId: '',
      supportingAssetName: 'Please name Supporting Asset 1',
      supportingAssetType: '',
      supportingAssetSecurityLevel: -1,
      businessAssetRef: [null],
    };

    test('get SupportingAsset', () => {
      expect(SupportingAsset[0]).toEqual(sa1);
    });
  });

  describe('get Risk', () => {
    const risk1 = {
      riskId: 1,
      projectName: '',
      projectVersion: '',
      riskName: {
        riskName: 'As a , I can  the  compromising the  in order to ',
        threatAgent: '',
        threatAgentDetail: '',
        threatVerb: '',
        threatVerbDetail: '',
        motivation: '',
        motivationDetail: '',
        businessAssetRef: null,
        supportingAssetRef: null,
        isAutomaticRiskName: true
      },
      riskLikelihood: {
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
        isOWASPLikelihood: true
      },
      riskImpact: {
        riskImpact: null,
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
              score: null,
              name: '',
              rowId: 1
            },
          ],
          attackPathName: '',
          attackPathScore: null,
        },
      ],
      allAttackPathsName: '',
      allAttackPathsScore: null,
      inherentRiskScore: 0,
      riskMitigation: [
        {
          riskMitigationId: 1,
          description: '',
          benefits: 0,
          cost: null,
          decision: '',
          decisionDetail: '',
        },
      ],
      mitigationsBenefits: 1,
      mitigationsDoneBenefits: 1,
      mitigatedRiskScore: 0,
      riskManagementDecision: '',
      riskManagementDetail: '',
      residualRiskScore: 0,
      residualRiskLevel: 'Low',
    };

    test('get Risk', () => {
      expect(Risk[0]).toEqual(risk1);
    });
  });

  describe('get Vulnerability', () => {
    const v1 = {
      projectName: '',
      projectVersion: '',
      vulnerabilityId: 1,
      vulnerabilityName: 'Please name Vulnerability 1',
      vulnerabilityFamily: '',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: 'CVSS:2.0/AV:L/AC:M/Au:N/C:P/I:P/A:P/E:ND/RL:ND/RC:ND',
      cveScore: 4.37803212315,
      overallScore: 4,
      overallLevel: 'Medium',
      supportingAssetRef: [],
    };

    test('get vulnerability1', () => {
      expect(Vulnerability[0]).toEqual(v1);
    });
  });
});
