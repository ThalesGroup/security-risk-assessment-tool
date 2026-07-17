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

const fs = require('fs');
const path = require('path');

describe('Supporting Assets renderer unused assets column', () => {
  const rendererPath = path.resolve(__dirname, '../../../../app/src/tabs/Supporting Assets/renderer.js');
  const rendererSource = fs.readFileSync(rendererPath, 'utf8');

  test('dynamically injects the "Used in Risk(s)?" column before Tabulator instantiation', () => {
    // Assert that columns.push is called with title 'Used in Risk(s)?'
    expect(rendererSource).toMatch(/columns\.push\(\{[\s\S]*title:\s*['"]Used in Risk\(s\)\?['"]/);
  });

  test('uses the configured ERROR_COLOR for unused assets', () => {
    // Assert that ERROR_COLOR is used inside the formatter
    expect(rendererSource).toMatch(/color:\s*\${ERROR_COLOR}/);
  });

  test('enables header sorting on the newly added column', () => {
    // Assert that headerSort is true on the new column
    expect(rendererSource).toMatch(/headerSort:\s*true/);
  });
});
