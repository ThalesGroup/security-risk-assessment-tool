/*----------------------------------------------------------------------------
*
*     Copyright © 2026 THALES. All Rights Reserved.
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

jest.mock('electron', () => ({
  dialog: { showMessageBoxSync: jest.fn() },
  BrowserWindow: { fromId: jest.fn(() => ({})) },
}), { virtual: true });

const { cloneRisk } = require('../../../src/api/Risk/handler-event');
const ISRAProject = require('../../../src/model/classes/ISRAProject/isra-project');
const Risk = require('../../../src/model/classes/Risk/risk');
const RiskAttackPath = require('../../../src/model/classes/Risk/risk-attack-path');
const RiskMitigation = require('../../../src/model/classes/Risk/risk-mitigation');
const RiskLikelihood = require('../../../src/model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../../src/model/classes/Risk/risk-impact');

describe('Risk clone handler', () => {
  let israProject;
  let sourceRisk;

  beforeEach(() => {
    israProject = new ISRAProject();
    sourceRisk = new Risk();
    sourceRisk.riskName = 'Original Risk';
    sourceRisk.riskLikelihood = new RiskLikelihood();
    sourceRisk.riskLikelihood.riskLikelihood = 4;
    sourceRisk.riskImpact = new RiskImpact();
    sourceRisk.riskImpact.businessAssetConfidentialityFlag = 1;

    const attackPath = new RiskAttackPath();
    attackPath.attackPathName = 'Cloned Path';
    attackPath.attackPathScore = 7;
    attackPath.addVulnerability({ vulnerabilityId: 13, name: 'Test Vulnerability', score: 5 });
    sourceRisk.addRiskAttackPath(attackPath);

    const mitigation = new RiskMitigation();
    mitigation.description = '<div>Test mitigation</div>';
    mitigation.benefits = 1;
    mitigation.cost = 100;
    mitigation.decision = 'Accepted';
    sourceRisk.addRiskMitigation(mitigation);

    israProject.addRisk(sourceRisk);
  });

  test('clones risk properties and nested references without duplicating the original riskId', () => {
    const [clonedRiskProps, allRisks] = cloneRisk(israProject, sourceRisk.riskId);

    expect(allRisks).toHaveLength(2);
    expect(clonedRiskProps).toBeDefined();
    expect(clonedRiskProps.riskId).not.toBe(sourceRisk.riskId);
    expect(clonedRiskProps.riskName).toBe(sourceRisk.riskName);
    expect(clonedRiskProps.riskLikelihood).toEqual(sourceRisk.properties.riskLikelihood);
    expect(clonedRiskProps.riskImpact).toEqual(sourceRisk.properties.riskImpact);
    expect(clonedRiskProps.riskAttackPaths).toHaveLength(1);
    expect(clonedRiskProps.riskAttackPaths[0].attackPathName).toBe('Cloned Path');
    expect(clonedRiskProps.riskAttackPaths[0].vulnerabilityRef).toEqual([
      { vulnerabilityId: 13, name: 'Test Vulnerability', score: 5 },
    ]);
    expect(clonedRiskProps.riskMitigation).toHaveLength(1);
    expect(clonedRiskProps.riskMitigation[0].description).toBe('<div>Test mitigation</div>');
  });

  test('allows multiple risks to be cloned sequentially', () => {
    const secondRisk = new Risk();
    secondRisk.riskName = 'Second Risk';
    israProject.addRisk(secondRisk);

    const [firstClone] = cloneRisk(israProject, sourceRisk.riskId);
    const [secondClone] = cloneRisk(israProject, secondRisk.riskId);

    expect(israProject.properties.Risk).toHaveLength(4);
    expect(firstClone.riskId).not.toBe(sourceRisk.riskId);
    expect(secondClone.riskId).not.toBe(secondRisk.riskId);
    expect(firstClone.riskName).toBe(sourceRisk.riskName);
    expect(secondClone.riskName).toBe(secondRisk.riskName);
    expect(firstClone.riskId).not.toBe(secondClone.riskId);
  });
});
