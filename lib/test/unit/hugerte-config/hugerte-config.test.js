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

// Unit tests for HugeRTE menu configuration — Issue #99
// These tests perform static analysis of renderer files to confirm
// that the "New Document" item is removed from the File menu in every
// hugerte.init() call, while the menubar itself remains visible.

const fs = require('fs');
const path = require('path');

const APP_TABS = path.resolve(__dirname, '../../../../app/src/tabs');

const rendererFiles = [
  path.join(APP_TABS, 'Project Context', 'renderer.js'),
  path.join(APP_TABS, 'Business Assets', 'renderer.js'),
  path.join(APP_TABS, 'Supporting Assets', 'renderer.js'),
  path.join(APP_TABS, 'Vulnerabilities', 'renderer.js'),
  path.join(APP_TABS, 'Risks', 'renderer.js'),
];

/**
 * Count the number of occurrences of a substring in a string.
 */
function countOccurrences(str, substr) {
  let count = 0;
  let pos = 0;
  while ((pos = str.indexOf(substr, pos)) !== -1) {
    count++;
    pos += substr.length;
  }
  return count;
}

describe('HugeRTE menu configuration (Issue #99) — New Document item removal', () => {
  test('Project Context renderer has custom menu config without newdocument', () => {
    const filePath = rendererFiles[0];
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain("file: { title: 'File', items:");
    expect(content).not.toContain('newdocument');
  });

  test('Business Assets renderer has custom menu config without newdocument', () => {
    const filePath = rendererFiles[1];
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain("file: { title: 'File', items:");
    expect(content).not.toContain('newdocument');
  });

  test('Supporting Assets renderer has custom menu config without newdocument', () => {
    const filePath = rendererFiles[2];
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain("file: { title: 'File', items:");
    expect(content).not.toContain('newdocument');
  });

  test('Vulnerabilities renderer has custom menu config without newdocument', () => {
    const filePath = rendererFiles[3];
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain("file: { title: 'File', items:");
    expect(content).not.toContain('newdocument');
  });

  test('Risks renderer has custom menu config in addRichTextArea (first hugerte.init call)', () => {
    const filePath = rendererFiles[4];
    const content = fs.readFileSync(filePath, 'utf8');
    const menuConfigCount = countOccurrences(content, "file: { title: 'File', items:");
    expect(menuConfigCount).toBeGreaterThanOrEqual(2);
  });

  test('Risks renderer has custom menu config in window.project.load handler (second hugerte.init call)', () => {
    const filePath = rendererFiles[4];
    const content = fs.readFileSync(filePath, 'utf8');
    const menuConfigCount = countOccurrences(content, "file: { title: 'File', items:");
    const hugerteInitCount = countOccurrences(content, 'hugerte.init(');
    expect(menuConfigCount).toBe(hugerteInitCount);
  });

  test('No renderer contains newdocument in any configuration', () => {
    rendererFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      expect(content).not.toContain('newdocument');
    });
  });

  test('No renderer exposes mceNewDocument in toolbar strings', () => {
    rendererFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      const toolbarMatches = content.match(/toolbar\s*:\s*['"][^'"]*['"]/g) || [];
      toolbarMatches.forEach((toolbarStr) => {
        expect(toolbarStr.toLowerCase()).not.toContain('newdocument');
      });
    });
  });

  test('All renderer files exist and are readable', () => {
    rendererFiles.forEach((filePath) => {
      expect(() => fs.readFileSync(filePath, 'utf8')).not.toThrow();
    });
  });
});
