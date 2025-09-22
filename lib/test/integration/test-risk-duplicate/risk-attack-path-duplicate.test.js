/*----------------------------------------------------------------------------
*
*     Copyright Ac 2025 THALES. All Rights Reserved.
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

// Ensure the backend logic for deleting vulnerabilities from attack paths works as expected 
// **Does not reproduce the UI bug where the checkbox state is not updated correctly**
const path = require('path');

jest.mock('electron', () => ({
  dialog: { showMessageBoxSync: jest.fn() },
  BrowserWindow: { fromId: jest.fn(() => ({})) },
}), { virtual: true });

const DataLoad = require('../../../src/api/data-load');
const { deleteVulnerabilityRef } = require('../../../src/api/Risk/handler-event');

const fixturePath = path.resolve(__dirname, '../fixtures/risk-duplicate-vuln.json');

describe('Risk attack path vulnerability deletion', () => {
  let israProject;

  beforeEach(() => {
    israProject = DataLoad(fixturePath);
  });

  test('sequentially removes the same vulnerability from different attack paths', () => {
    const riskId = 1;

    const afterFirstRemoval = deleteVulnerabilityRef(israProject, riskId, 1, [1]);
    expect(afterFirstRemoval).toBeDefined();
    const firstPathRefs = israProject
      .getRisk(riskId)
      .getRiskAttackPath(1)
      .properties.vulnerabilityRef;
    expect(firstPathRefs.some((ref) => ref.vulnerabilityId === 1)).toBe(false);

    const afterSecondRemoval = deleteVulnerabilityRef(israProject, riskId, 2, [1]);
    expect(afterSecondRemoval).toBeDefined();
    const secondPathRefs = israProject
      .getRisk(riskId)
      .getRiskAttackPath(2)
      .properties.vulnerabilityRef;
    expect(secondPathRefs.some((ref) => ref.vulnerabilityId === 1)).toBe(false);
  });
});

