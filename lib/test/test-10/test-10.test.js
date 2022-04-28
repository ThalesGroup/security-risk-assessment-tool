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

const filePath = 'lib/test/test-10/test-10.json';

describe('Test DataStore, DataLoad, DataNew', () => {
  const israProject = new ISRAProject();

  test('Resolve DataStore', () => {
    expect.assertions(1);
    return expect(DataStore(israProject)).resolves.toEqual('Done save');
  });

  test('Reject DataStore ', () => {
    expect.assertions(1);
    return expect(DataStore({})).rejects.toEqual(new Error('israProject not anInstance of ISRAProject'));
  });

  test('Resolve DataLoad', () => {
    expect.assertions(1);
    return expect(DataLoad(israProject, filePath)).resolves.toEqual('Done load');
  });

  test('Reject DataLoad ', () => {
    expect.assertions(1);
    return expect(DataLoad(israProject, 'Invalid file path')).rejects.toEqual(new Error('Failed to open file'));
  });

  test('Project data loaded from DataLoad', () => {
    expect(israProject.properties).toEqual({

    });
  });

  test('Test DataNew, initialise new project', () => {
    const israProjectNew = new ISRAProject();
    DataNew(israProjectNew);
    expect(israProjectNew.properties).toEqual({
      ISRAmeta: {
        appVersion: undefined,
        projectName: undefined,
        projectOrganization: undefined,
        projectVersion: undefined,
        ISRAtracking: [{
          trackingComment: undefined,
          trackingDate: currentDate,
          trackingIteration: 1,
          trackingSecurityOfficer: user,
        }],
        businessAssetsCount: 1,
        supportingAssetsCount: 1,
        risksCount: 1,
        vulnerabilitiesCount: 1,
      },
      ProjectContext: undefined,
      BusinessAsset: [
        {
          businessAssetId: 1,
          businessAssetName: undefined,
          businessAssetType: undefined,
          businessAssetDescription: undefined,
          businessAssetProperties: {
            businessAssetAuthenticity: undefined,
            businessAssetAuthorization: undefined,
            businessAssetAvailability: undefined,
            businessAssetConfidentiality: undefined,
            businessAssetIdRef: 1,
            businessAssetIntegrity: undefined,
            businessAssetNonRepudiation: undefined,
          },
        },
      ],
      SupportingAssetsDesc: undefined,
      SupportingAsset: [
        {
          supportingAssetId: 1,
          supportingAssetHLDId: undefined,
          supportingAssetName: undefined,
          supportingAssetType: undefined,
          supportingAssetSecurityLevel: undefined,
          businessAssetRef: [],
        },
      ],
      Risk: [
        {
          riskId: 1,
          projectNameRef: undefined,
          projectVersionRef: undefined,
          riskName: {
            businessAssetRef: undefined,
            motivation: undefined,
            motivationDetail: undefined,
            riskIdRef: 1,
            riskName: undefined,
            supportingAssetRef: undefined,
            threatAgent: undefined,
            threatAgentDetail: undefined,
            threatVerb: undefined,
            threatVerbDetail: undefined,
          },
          riskLikelihood: {
            accessResources: undefined,
            intrusionDetection: undefined,
            occurrence: undefined,
            occurrenceLevel: undefined,
            reward: undefined,
            riskIdRef: 1,
            riskLikelihood: undefined,
            riskLikelihoodDetail: undefined,
            size: undefined,
            skillLevel: undefined,
            threatFactorLevel: undefined,
            threatFactorScore: undefined,
          },
          riskImpact: {
            businessAssetAuthenticityFlag: undefined,
            businessAssetAuthorizationFlag: undefined,
            businessAssetAvailabilityFlag: undefined,
            businessAssetConfidentialityFlag: undefined,
            businessAssetIntegrityFlag: undefined,
            businessAssetNonRepudiationFlag: undefined,
            riskIdRef: 1,
            riskImpact: undefined,
          },
          riskAttackPaths: [{
            attackPathName: undefined,
            attackPathScore: undefined,
            riskAttackPathId: 1,
            riskIdRef: 1,
            vulnerabilityRef: [],
          }],
          allAttackPathsName: undefined,
          allAttackPathsScore: undefined,
          inherentRiskScore: undefined,
          riskMitigation: [{
            benefits: undefined,
            cost: undefined,
            decision: undefined,
            decisionDetail: undefined,
            description: undefined,
            mitigationsBenefits: undefined,
            mitigationsDoneBenefits: undefined,
            riskIdRef: 1,
            riskMitigationId: 1,
          }],
          mitigatedRiskScore: undefined,
          riskManagementDecision: undefined,
          riskManagementDetail: undefined,
          residualRiskScore: undefined,
          residualRiskLevel: undefined,
        },
      ],
      Vulnerability: [
        {
          projectNameRef: undefined,
          projectVersionRef: undefined,
          vulnerabilityId: 1,
          vulnerabilityName: undefined,
          vulnerabilityFamily: undefined,
          vulnerabilityTrackingID: undefined,
          vulnerabilityTrackingURI: undefined,
          vulnerabilityDescription: undefined,
          vulnerabilityDescriptionAttachment: undefined,
          vulnerabilityCVE: undefined,
          cveScore: undefined,
          overallScore: undefined,
          overallLevel: undefined,
          supportingAssetRef: [],
        },
      ],
    });
  });
});
