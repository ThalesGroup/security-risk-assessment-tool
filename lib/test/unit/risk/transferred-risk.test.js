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
    BrowserWindow: { fromId: jest.fn(() => ({})) }
}), { virtual: true });

const fs = require('fs');
const path = require('path');
const Risk = require('../../../src/model/classes/Risk/risk');
const validateJSONschema = require('../../../src/api/xml-json/validate-json-schema');
const { isTransferredFromDependency, isDependencyOrigin } = require('../../../src/model/classes/Risk/validation');
const { updateRiskName } = require('../../../src/api/Risk/handler-event');
const ISRAProject = require('../../../src/model/classes/ISRAProject/isra-project');

describe('TC-1: Schema validation of new fields', () => {
  test('TC-1 validation', () => {
    // Read clean fixture
    const fixturePath = path.join(__dirname, '../../integration/fixtures/test-10.json');
    const projectJson = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

    // Add a transferred risk
    projectJson.Risk.push({
      riskId: 1,
      isTransferredFromDependency: true,
      dependencyOrigin: 'Third-party OAuth Service'
    });

    // Validate using the schema validator - should succeed without throwing
    expect(() => {
      validateJSONschema(projectJson);
    }).not.toThrow();
  });
});

describe('TC-2: Risk Class getter/setter and serialization', () => {
  test('TC-2 validation', () => {
    const risk = new Risk();

    // Verify default values
    expect(risk.isTransferredFromDependency).toBe(false);
    expect(risk.dependencyOrigin).toBe('');

    // Set and verify getter values
    risk.isTransferredFromDependency = true;
    risk.dependencyOrigin = 'Custom Service';

    expect(risk.isTransferredFromDependency).toBe(true);
    expect(risk.dependencyOrigin).toBe('Custom Service');

    // Verify serialization in .properties
    const props = risk.properties;
    expect(props.isTransferredFromDependency).toBe(true);
    expect(props.dependencyOrigin).toBe('Custom Service');
  });
});

describe('TC-3: Validation functions for transferred fields', () => {
  test('TC-3 validation', () => {
    // Check isTransferredFromDependency validator
    expect(isTransferredFromDependency(true)).toBe(true);
    expect(isTransferredFromDependency(false)).toBe(true);
    expect(isTransferredFromDependency(123)).toBe(false);
    expect(isTransferredFromDependency('true')).toBe(false);

    // Check isDependencyOrigin validator
    expect(isDependencyOrigin('some value')).toBe(true);
    expect(isDependencyOrigin('')).toBe(true);
    expect(isDependencyOrigin(123)).toBe(false);
    expect(isDependencyOrigin(null)).toBe(false);
  });
});

describe('TC-4: Backend Event handler short-circuit and score sync', () => {
  test('TC-4 validation', () => {
    const israProject = new ISRAProject();
    const risk = new Risk();
    risk.riskId = 1;
    israProject.addRisk(risk);
    const riskId = risk.properties.riskId;

    // Verify initial values
    expect(risk.isTransferredFromDependency).toBe(false);

    // Toggle isTransferredFromDependency via updateRiskName event handler
    updateRiskName(israProject, null, riskId, 'isTransferredFromDependency', true);
    expect(risk.isTransferredFromDependency).toBe(true);
    expect(risk.isAutomaticRiskName).toBe(false);
    expect(risk.riskManagementDecision).toBe('Transfer');

    // Verify that updating transferredScore updates scores and level directly
    updateRiskName(israProject, null, riskId, 'transferredScore', '12');
    expect(risk.properties.inherentRiskScore).toBe(12);
    expect(risk.properties.mitigatedRiskScore).toBe(12);
    expect(risk.properties.residualRiskScore).toBe(12);
    expect(risk.properties.residualRiskLevel).toBe('High');

    // Verify thresholds: 0-5 Low
    updateRiskName(israProject, null, riskId, 'transferredScore', '4');
    expect(risk.properties.residualRiskLevel).toBe('Low');

    // Verify thresholds: 6-10 Medium
    updateRiskName(israProject, null, riskId, 'transferredScore', '8');
    expect(risk.properties.residualRiskLevel).toBe('Medium');

    // Verify thresholds: 16-20 Critical
    updateRiskName(israProject, null, riskId, 'transferredScore', '18');
    expect(risk.properties.residualRiskLevel).toBe('Critical');
  });
});

describe('TC-5: Loading transferred risk in UI correctly toggles visibility', () => {
  test('TC-5 validation', () => {
    // Verify static content/bindings in app/src/tabs/Risks/renderer.js and render-risks.js
    const rendererPath = path.join(__dirname, '../../../../app/src/tabs/Risks/renderer.js');
    const renderRisksPath = path.join(__dirname, '../../../src/api/Risk/render-risks.js');

    const rendererContent = fs.readFileSync(rendererPath, 'utf8');
    const renderRisksContent = fs.readFileSync(renderRisksPath, 'utf8');

    // Assert render-risks.js defines all DOM elements correctly
    expect(renderRisksContent).toContain('id="risk__isTransferredFromDependency"');
    expect(renderRisksContent).toContain('id="risk__dependencyOriginContainer"');
    expect(renderRisksContent).toContain('id="risk__transferredScoreContainer"');

    // Assert renderer.js contains toggle logic
    expect(rendererContent).toContain('toggleTransferredRiskSections');
    expect(rendererContent).toContain("$('#risk__dependencyOriginContainer').css('display', 'flex');");
    expect(rendererContent).toContain("$('#risk__transferredScoreContainer').css('display', 'flex');");
    expect(rendererContent).toContain("$('#risk__automatic_riskname').hide();");
  });
});

describe('TC-6: Toggling checkbox updates domestic elements and model values back', () => {
  test('TC-6 validation', () => {
    const rendererPath = path.join(__dirname, '../../../../app/src/tabs/Risks/renderer.js');
    const rendererContent = fs.readFileSync(rendererPath, 'utf8');

    // Assert change listener triggers and updates
    expect(rendererContent).toContain("$('#risk__isTransferredFromDependency').on('change'");
    expect(rendererContent).toContain('toggleTransferredRiskSections(isChecked)');
    expect(rendererContent).toContain("updateRiskName('isTransferredFromDependency', isChecked)");
    expect(rendererContent).toContain("updateRiskName('dependencyOrigin', value)");
    expect(rendererContent).toContain("updateRiskName('transferredScore', value)");
  });
});
