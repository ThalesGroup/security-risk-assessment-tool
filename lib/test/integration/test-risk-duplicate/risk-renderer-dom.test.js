/*----------------------------------------------------------------------------
*
*     Copyright © 2025 THALES. All Rights Reserved.
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

const fs = require('fs');
const path = require('path');

// Ensures the frontend renderer code is using the correct attack-path-aware logic
// for vulnerability checkboxes and row keys
describe('Risk renderer vulnerability wiring', () => {
  const rendererPath = path.resolve(__dirname, '../../../../app/src/tabs/Risks/renderer.js');
  const rendererSource = fs.readFileSync(rendererPath, 'utf8');

  test('assigns attack-path-aware row keys to vulnerability rows', () => {
    expect(rendererSource).toMatch(/const rowKey = `\${riskAttackPathId}-\${[^}]+}`;/);
    expect(rendererSource).toMatch(/`vulnerabilityrefs_\${rowKey}`/);
  });

  test('scopes vulnerability checkbox queries to the attack-path container', () => {
    expect(rendererSource).toMatch(/div\.find\('input\[name="risks__vulnerability__checkboxes"\]'/);
  });

  test('no longer relies on document.getElementsByName for vulnerability checkboxes', () => {
    expect(rendererSource).not.toMatch(/document\.getElementsByName\('risks__vulnerability__checkboxes'\)/);
  });
});
