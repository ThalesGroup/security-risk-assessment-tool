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

// This test is for xml-parsing-empty-tags bug 

const { XML2JSON } = require('../../src/api/index');
const { htmlPattern } = require('../../src/model/schema/validation-pattern/validation-pattern');

describe('Bug Fix Test: Correctly parse consecutive empty rich text fields in mitigations', () => {
  const israProject = XML2JSON('./test/test-utility/test-utility.xml');

  const {
    ISRAmeta,
    ProjectContext,
    Risk,
  } = israProject.properties;

  describe('get ISRAmeta', () => {
    test('get projectName', () => {
      expect(ISRAmeta.projectName).toBe('name of proj');
    });

    test('get risksCount from meta vs actual parsed risks', () => {
      expect(ISRAmeta.risksCount).toBe(2);
      expect(Risk.length).toBe(2);
    });
  });

  describe('get ProjectContext', () => {
    test('get securityOfficerObjectives contains HTML', () => {
      expect(htmlPattern.test(ProjectContext.securityOfficerObjectives)).toBe(true);
    });
  });

  describe('get Risk', () => {
    const risk1_expected = {
      riskId: 1,
      projectName: 'name of proj',
      projectVersion: '',
      riskName: 'As a Criminal, I can  the  compromising the  in order to , exploiting the (V1 AND ) OR ()',
      threatAgent: 'Criminal',
      threatAgentDetail: '<ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc"><li>test</li></ul>',
      threatVerb: '',
      threatVerbDetail: '',
      motivation: '',
      motivationDetail: '',
      businessAssetRef: null,
      supportingAssetRef: null,
      isAutomaticRiskName: true,
      riskLikelihood: {
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
          riskAttackPathId: 1,
          vulnerabilityRef: [
            { score: 4, name: 'V1', vulnerabilityId: 1 },
            { score: null, name: '', vulnerabilityId: 2 }
          ],
          attackPathName: 'V1 AND ',
          attackPathScore: 4,
        },
        {
          riskAttackPathId: 2,
          vulnerabilityRef: [],
          attackPathName: '',
          attackPathScore: null,
        },
      ],
      allAttackPathsName: '(V1 AND ) OR ()',
      allAttackPathsScore: 4,
      inherentRiskScore: 0,
      
      riskMitigation: [
        {
          riskMitigationId: 1,
          description: '<div>Desc 1</div>',
          benefits: 0,
          cost: null,
          decision: '',
          decisionDetail: '',
        },
        {
          riskMitigationId: 2,
          description: '<div>Desc 2</div>',
          benefits: 0,
          cost: null,
          decision: '',
          decisionDetail: '',
        },
        {
          riskMitigationId: 3,
          description: '<div>Desc 3</div>',
          benefits: 0,
          cost: null,
          decision: 'Done',
          decisionDetail: '<div>Third comment</div>',
        },
        {
          riskMitigationId: 4,
          description: '<div>Desc 4</div>',
          benefits: 0,
          cost: null,
          decision: 'Accepted',
          decisionDetail: '<div>Fourth comment</div>',
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

    const risk2_expected = {
      riskId: 2,
      projectName: 'name of proj',
      projectVersion: '',
      riskName: 'Please name your risk or switch to automatic risk name',
      threatAgent: '',
      threatAgentDetail: '',
      threatVerb: '',
      threatVerbDetail: '',
      motivation: '',
      motivationDetail: '',
      businessAssetRef: null,
      supportingAssetRef: null,
      isAutomaticRiskName: false,
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

    test('should correctly parse Risk 1, including all its mitigations', () => {
      expect(Risk[0]).toEqual(risk1_expected);
    });

    test('should correctly parse the empty Risk 2', () => {
      expect(Risk[1]).toEqual(risk2_expected);
    });
  });
});