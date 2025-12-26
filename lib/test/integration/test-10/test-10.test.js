/*----------------------------------------------------------------------------
*
*     Copyright © 2022-2025 THALES. All Rights Reserved.
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
const os = require('os');
const path = require('path');

const date = new Date();
const currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const {
  DataStore,
  DataLoad,
  DataNew,
} = require('../../../src/api/index');
const ISRAProject = require('../../../src/model/classes/ISRAProject/isra-project');
const config = require('../../../src/config')

const filePath = './test/integration/fixtures/test-10.json';

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

  // test('Reject DataStore ', () => {
  //   expect.assertions(1);
  //   return expect(DataStore(israProject, '!@#$%^&*()')).rejects.toEqual(new Error('Failed to save file'));
  // });

  test('Resolve DataLoad', () => {
    return expect(JSON.parse(DataLoad(filePath).toJSON())).toEqual({
      "ISRAmeta": {
          "schemaVersion": 3,
          "classification": "COMPANY CONFIDENTIAL {PROJECT}",
          "iteration": 0,
          "projectName": "",
          "projectOrganization": "",
          "projectVersion": "",
          "ISRAtracking": [],
          "businessAssetsCount": 0,
          "supportingAssetsCount": 0,
          "risksCount": 0,
          "vulnerabilitiesCount": 0,
          "latestBusinessAssetId": null,
          "latestSupportingAssetId": null,
          "latestRiskId": null,
          "latestVulnerabilityId": null
      },
      "ProjectContext": {
          "projectDescription": "",
          "projectURL": "",
          "projectDescriptionAttachment": "",
          "securityProjectObjectives": "",
          "securityOfficerObjectives": "",
          "securityAssumptions": ""
      },
      "BusinessAsset": [],
      "SupportingAssetsDesc": "",
      "SupportingAsset": [],
      "Risk": [],
      "Vulnerability": []
    });
  });

  test('Reject DataLoad ', () => {
    return expect(DataLoad('Invalid file path')).toEqual(new Error('Failed to open file'));
  });

  test('Test DataNew, initialise new project', () => {
    const israProjectNew = new ISRAProject();
    DataNew(israProjectNew);
    expect(JSON.parse(israProjectNew.toJSON())).toEqual({
      ISRAmeta: {
        classification: config.classification,
        iteration: 1,
        projectName: '',
        projectOrganization: '',
        projectVersion: '',
        ISRAtracking: [{
          trackingComment: '',
          trackingDate: currentDate,
          trackingIteration: 1,
          trackingSecurityOfficer: user,
        }],
        schemaVersion: 3,
        businessAssetsCount: 1,
        supportingAssetsCount: 1,
        risksCount: 1,
        vulnerabilitiesCount: 1,
        latestBusinessAssetId: 1,
        latestRiskId: 1,
        latestSupportingAssetId: 1,
        latestVulnerabilityId: 1
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
          businessAssetName: 'Please name Business Asset 1',
          businessAssetType: 'Data',
          businessAssetDescription: '',
          businessAssetProperties: {
            businessAssetAuthenticity: 3,
            businessAssetAuthorization: 3,
            businessAssetAvailability: 3,
            businessAssetConfidentiality: 3,
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
          supportingAssetName: 'Please name Supporting Asset 1',
          supportingAssetType: '',
          supportingAssetSecurityLevel: -1,
          businessAssetRef: [null],
        },
      ],
      Risk: [
        {
          riskId: 1,
          projectName: '',
          projectVersion: '',
          businessAssetRef: null,
          motivation: '',
          motivationDetail: '',
          riskName: 'As a , I can  the  compromising the  in order to ',
          supportingAssetRef: null,
          threatAgent: '',
          threatAgentDetail: '',
          threatVerb: '',
          threatVerbDetail: '',
          isAutomaticRiskName: true,
          riskLikelihood: {
            accessResources: null,
            intrusionDetection: null,
            occurrence: null,
            occurrenceLevel: '',
            reward: null,
            riskLikelihood: 3,
            riskLikelihoodDetail: '',
            size: null,
            skillLevel: null,
            threatFactorLevel: '',
            threatFactorScore: null,
            isOWASPLikelihood: true
          },
          riskImpact: {
            businessAssetAuthenticityFlag: 1,
            businessAssetAuthorizationFlag: 1,
            businessAssetAvailabilityFlag: 1,
            businessAssetConfidentialityFlag: 1,
            businessAssetIntegrityFlag: 1,
            businessAssetNonRepudiationFlag: 1,
            riskImpact: null,
          },
          riskAttackPaths: [{
            attackPathName: '',
            attackPathScore: null,
            riskAttackPathId: 1,
            vulnerabilityRef: [],
          }],
          allAttackPathsName: '',
          allAttackPathsScore: null,
          inherentRiskScore: 0,
          riskMitigation: [{
            benefits: null,
            cost: null,
            decision: '',
            decisionDetail: '',
            description: '',
            riskMitigationId: 1,
          }],
          mitigationsBenefits: 1,
          mitigationsDoneBenefits: 1,
          mitigatedRiskScore: 0,
          riskManagementDecision: '',
          riskManagementDetail: '',
          residualRiskScore: 0,
          residualRiskLevel: 'Low',
        },
      ],
      Vulnerability: [
        {
          projectName: '',
          projectVersion: '',
          vulnerabilityId: 1,
          vulnerabilityName: 'Please name Vulnerability 1',
          vulnerabilityFamily: '',
          vulnerabilityTrackingID: '',
          vulnerabilityTrackingURI: '',
          vulnerabilityDescription: '',
          vulnerabilityDescriptionAttachment: '',
          vulnerabilityCVE: '',
          cveScore: 0,
          overallScore: 0,
          overallLevel: 'Low',
          supportingAssetRef: [],
        },
      ],
    });
  });
});
