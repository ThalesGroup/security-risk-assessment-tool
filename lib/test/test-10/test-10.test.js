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

const user = require('os').userInfo().username;

const date = new Date();
const currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const {
  DataStore,
  DataLoad,
  DataNew,
} = require('../../src/api/index');
const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');

const filePath = './test/test-10/test-10.json';

describe('Test DataStore, DataLoad, DataNew', () => {
  const israProject = new ISRAProject();

  test('Resolve DataStore', () => {
    expect.assertions(1);
    return expect(DataStore(israProject, filePath)).resolves.toEqual('Done save');
  });

  test('Reject DataStore ', () => {
    expect.assertions(1);
    return expect(DataStore({}, filePath)).rejects.toEqual(new Error('Invalid project or filepath'));
  });

  test('Reject DataStore ', () => {
    expect.assertions(1);
    return expect(DataStore(israProject, {})).rejects.toEqual(new Error('Invalid project or filepath'));
  });

  test('Reject DataStore ', () => {
    expect.assertions(1);
    return expect(DataStore(israProject, '!@#$%^&*()')).rejects.toEqual(new Error('Failed to save file'));
  });

  test('Resolve DataLoad', () => {
    expect.assertions(1);
    return expect(DataLoad(israProject, filePath)).resolves.toEqual('Done load');
  });

  test('Reject DataLoad ', () => {
    expect.assertions(1);
    return expect(DataLoad(israProject, 'Invalid file path')).rejects.toEqual(new Error('Failed to open file'));
  });

  test('Test DataNew, initialise new project', () => {
    const israProjectNew = new ISRAProject();
    DataNew(israProjectNew);
    expect(JSON.parse(israProjectNew.toJSON())).toEqual({
      ISRAmeta: {
        appVersion: 1,
        projectName: '',
        projectOrganization: '',
        projectVersion: '',
        ISRAtracking: [{
          trackingComment: '',
          trackingDate: currentDate,
          trackingIteration: 1,
          trackingSecurityOfficer: user,
        }],
        businessAssetsCount: 1,
        supportingAssetsCount: 1,
        risksCount: 1,
        vulnerabilitiesCount: 1,
      },
      ProjectContext: {
        projectDescription: '',
        projectURL: '',
        projectDescriptionAttachment: '',
        securityProjectObjectives: '',
        securityOfficerObjectives: '',
        securityAssumptions: '',
      },
      BusinessAsset: [
        {
          businessAssetId: 1,
          businessAssetName: '',
          businessAssetType: 'Data',
          businessAssetDescription: '',
          businessAssetProperties: {
            businessAssetAuthenticity: 3,
            businessAssetAuthorization: 3,
            businessAssetAvailability: 3,
            businessAssetConfidentiality: 3,
            businessAssetIdRef: 1,
            businessAssetIntegrity: 3,
            businessAssetNonRepudiation: 3,
          },
        },
      ],
      SupportingAssetsDesc: '',
      SupportingAsset: [
        {
          supportingAssetId: 1,
          supportingAssetHLDId: '',
          supportingAssetName: '',
          supportingAssetType: '',
          supportingAssetSecurityLevel: -1,
          businessAssetRef: [],
        },
      ],
      Risk: [
        {
          riskId: 1,
          projectNameRef: '',
          projectVersionRef: '',
          riskName: {
            businessAssetRef: null,
            motivation: '',
            motivationDetail: '',
            riskIdRef: 1,
            riskName: 'As a , I can  the  compromising the  in order to ',
            supportingAssetRef: null,
            threatAgent: '',
            threatAgentDetail: '',
            threatVerb: '',
            threatVerbDetail: '',
          },
          riskLikelihood: {
            accessResources: null,
            intrusionDetection: null,
            occurrence: null,
            occurrenceLevel: '',
            reward: null,
            riskIdRef: 1,
            riskLikelihood: 3,
            riskLikelihoodDetail: '',
            size: null,
            skillLevel: null,
            threatFactorLevel: '',
            threatFactorScore: null,
          },
          riskImpact: {
            businessAssetAuthenticityFlag: 1,
            businessAssetAuthorizationFlag: 1,
            businessAssetAvailabilityFlag: 1,
            businessAssetConfidentialityFlag: 1,
            businessAssetIntegrityFlag: 1,
            businessAssetNonRepudiationFlag: 1,
            riskIdRef: 1,
            riskImpact: null,
          },
          riskAttackPaths: [{
            attackPathName: '',
            attackPathScore: null,
            riskAttackPathId: 1,
            riskIdRef: 1,
            vulnerabilityRef: [{
              vulnerabilityIdRef: null,
              score: null,
              name: '',
            }],
          }],
          allAttackPathsName: '',
          allAttackPathsScore: null,
          inherentRiskScore: 0,
          riskMitigation: [{
            benefits: 0,
            cost: null,
            decision: '',
            decisionDetail: '',
            description: '',
            mitigationsBenefits: 1,
            mitigationsDoneBenefits: 1,
            riskIdRef: 1,
            riskMitigationId: 1,
          }],
          mitigatedRiskScore: 0,
          riskManagementDecision: '',
          riskManagementDetail: '',
          residualRiskScore: 0,
          residualRiskLevel: 'Low',
        },
      ],
      Vulnerability: [
        {
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
          supportingAssetRef: [],
        },
      ],
    });
  });
});
