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

describe('Vulnerability and Supporting Asset Name long text overflow fix tests', () => {
  const globalStylesPath = path.resolve(__dirname, '../../../../app/src/global styles/global-styles.css');
  const vulnerabilitiesRenderPath = path.resolve(__dirname, '../../../../lib/src/api/Vulnerability/render-vulnerabilities.js');
  const vulnerabilitiesRendererPath = path.resolve(__dirname, '../../../../app/src/tabs/Vulnerabilities/renderer.js');
  const supportingAssetsRendererPath = path.resolve(__dirname, '../../../../app/src/tabs/Supporting Assets/renderer.js');

  test('global-styles.css restricts select elements to prevent horizontal overflow', () => {
    const source = fs.readFileSync(globalStylesPath, 'utf8');
    expect(source).toMatch(/select\s*\{\s*width:\s*100%;\s*max-width:\s*100%;\s*text-overflow:\s*ellipsis;\s*overflow:\s*hidden;\s*\}/);
  });

  test('render-vulnerabilities.js configures vulnerabilityName column with variableHeight', () => {
    const source = fs.readFileSync(vulnerabilitiesRenderPath, 'utf8');
    expect(source).toContain('variableHeight: true');
  });

  test('Vulnerabilities renderer.js wraps vulnerabilityName cells in text-wrap spans', () => {
    const source = fs.readFileSync(vulnerabilitiesRendererPath, 'utf8');
    expect(source).toContain('return `<span class="text-wrap">${cell.getValue()}</span>`;');
  });

  test('Supporting Assets renderer.js wraps supportingAssetName cells in text-wrap spans', () => {
    const source = fs.readFileSync(supportingAssetsRendererPath, 'utf8');
    expect(source).toContain('return `<span class="text-wrap">${cell.getValue()}</span>`;');
  });
});
