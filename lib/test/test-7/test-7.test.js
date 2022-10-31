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
const { htmlPattern } = require('../../src/model/schema/validation-pattern/validation-pattern');

describe('XML is partially filled, class values are valid', () => {
  const israProject = XML2JSON('./test/test-7/test-7.xml');

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
        expect(ISRAmeta.ISRAtracking.length).toBe(3);
      });

      const israTracking1 = {
        trackingIteration: 1,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: '1',
      };

      const israTracking2 = {
        trackingIteration: 2,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: '2',
      };

      const israTracking3 = {
        trackingIteration: 3,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: '3',
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
      expect(BusinessAsset.length).toBe(0);
      expect(ISRAmeta.businessAssetsCount).toBe(0);
    });

    test('get supportingAssetsCount', () => {
      expect(SupportingAsset.length).toBe(1);
      expect(ISRAmeta.supportingAssetsCount).toBe(1);
    });

    test('get risksCount', () => {
      expect(Risk.length).toBe(2);
      expect(ISRAmeta.risksCount).toBe(2);
    });

    test('get vulnerabilitiesCount', () => {
      expect(Vulnerability.length).toBe(2);
      expect(ISRAmeta.vulnerabilitiesCount).toBe(2);
    });
  });

  describe('get ProjectContext', () => {
    test('get projectDescription', () => {
      expect(ProjectContext.projectDescription).toBe('');
    });

    test('get projectURL', () => {
      expect(ProjectContext.projectURL).toBe('mailto:username@organization.com');
    });

    test('get projectDescriptionAttachment', () => {
      expect(ProjectContext.projectDescriptionAttachment).toBe('');
    });

    test('get securityProjectObjectives', () => {
      expect(ProjectContext.securityProjectObjectives).toBe('');
    });

    test('get securityOfficerObjectives', () => {
      expect(htmlPattern.test(ProjectContext.securityOfficerObjectives)).toBe(true);
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
      businessAssetRef: [],
    };

    test('get supportingAsset1', () => {
      expect(SupportingAsset[0]).toEqual(sa1);
    });
  });

  describe('get Risk', () => {
    const risk1 = {
      riskId: 1,
      projectNameRef: 'name of proj',
      projectVersionRef: '',
      riskName: {
        riskIdRef: 1,
        riskName: 'As a Criminal, I can  the  compromising the  in order to , exploiting the (V1 AND ) OR ()',
        threatAgent: 'Criminal',
        threatAgentDetail: '<ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc"><li>test</li></ul>',
        threatVerb: '',
        threatVerbDetail: '',
        motivation: '',
        motivationDetail: '',
        businessAssetRef: null,
        supportingAssetRef: null,
        isAutomaticRiskName: true
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
        isOWASPLikelihood: true
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
      riskAttackPaths: [
        {
          riskIdRef: 1,
          riskAttackPathId: 1,
          vulnerabilityRef: [
            {
              vulnerabilityIdRef: 1,
              score: 4,
              name: 'V1',
              rowId: 1
            },
            {
              vulnerabilityIdRef: null,
              score: null,
              name: '',
              rowId: 2
            },
          ],
          attackPathName: 'V1 AND ',
          attackPathScore: 4,
        },
        {
          riskIdRef: 1,
          riskAttackPathId: 2,
          vulnerabilityRef: [
            {
              vulnerabilityIdRef: null,
              score: null,
              name: '',
              rowId: 1
            },
          ],
          attackPathName: '',
          attackPathScore: null,
        },
      ],
      allAttackPathsName: '(V1 AND ) OR ()',
      allAttackPathsScore: 4,
      inherentRiskScore: 0,
      riskMitigation: [
        {
          riskIdRef: 1,
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
      riskManagementDetail: '<strong xmlns="http://www.w3.org/1999/xhtml"><em><font size="6">test</font></em></strong>',
      residualRiskScore: 0,
      residualRiskLevel: 'Low',
    };

    const risk2 = {
      riskId: 2,
      projectNameRef: 'name of proj',
      projectVersionRef: '',
      riskName: {
        riskIdRef: 2,
        riskName: '',
        threatAgent: '',
        threatAgentDetail: '',
        threatVerb: '',
        threatVerbDetail: '',
        motivation: '',
        motivationDetail: '',
        businessAssetRef: null,
        supportingAssetRef: null,
        isAutomaticRiskName: false
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
        isOWASPLikelihood: true
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
      riskAttackPaths: [],
      allAttackPathsName: '',
      allAttackPathsScore: null,
      inherentRiskScore: 0,
      riskMitigation: [],
      mitigationsBenefits: 1,
      mitigationsDoneBenefits: 1,
      mitigatedRiskScore: 0,
      riskManagementDecision: '',
      riskManagementDetail: '',
      residualRiskScore: 0,
      residualRiskLevel: 'Low',
    };

    test.each([
      [Risk[0], risk1],
      [Risk[1], risk2],
    ])('get Risk', (value, expected) => {
      expect(value).toEqual(expected);
    });
  });

  describe('get Vulnerability', () => {
    const v1 = {
      projectNameRef: 'name of proj',
      projectVersionRef: '',
      vulnerabilityId: 1,
      vulnerabilityName: 'V1',
      vulnerabilityFamily: 'API Abuse',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '<div>CVSS</div>',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: 'CVSS:2.0/AV:L/AC:M/Au:N/C:P/I:P/A:P/E:ND/RL:ND/RC:ND',
      cveScore: 4.37803212315,
      overallScore: 4,
      overallLevel: 'Medium',
      supportingAssetRef: [],
      useNewDecode: true
    };

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
      supportingAssetRef: [],
      useNewDecode: true
    };

    test.each([
      [Vulnerability[0], v1],
      [Vulnerability[1], v2],
    ])('get Vulnerability', (value, expected) => {
      expect(value).toEqual(expected);
    });
  });
});
