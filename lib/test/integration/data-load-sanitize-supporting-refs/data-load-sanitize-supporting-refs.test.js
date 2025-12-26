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
const os = require('os');
const path = require('path');

const { DataLoad, DataStore, XML2JSON } = require('../../../src/api/index');

const xmlFixturePath = './test/integration/fixtures/test-7.xml';

describe('DataLoad silently repairs illegal supportingAssetRef', () => {
  let tmpDir;
  let sraPath;

  beforeAll(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sra-data-load-'));
    sraPath = path.join(tmpDir, 'project.sra');

    const israProject = XML2JSON(xmlFixturePath);
    await DataStore(israProject, sraPath);

    const jsonData = JSON.parse(fs.readFileSync(sraPath, 'utf8'));
    const firstVulnerability = Array.isArray(jsonData.Vulnerability)
      ? jsonData.Vulnerability[0]
      : undefined;

    if (!firstVulnerability) {
      throw new Error('Expected fixture to include at least 1 vulnerability');
    }

    firstVulnerability.supportingAssetRef = [
      '1',
      '',
      '2',
    ];

    fs.writeFileSync(sraPath, JSON.stringify(jsonData, null, 2), 'utf8');
  });

  afterAll(() => {
    if (tmpDir) fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('loads without schema error and normalizes refs to integers', () => {
    const loadedProject = DataLoad(sraPath);
    const loadedJson = JSON.parse(loadedProject.toJSON());

    expect(Array.isArray(loadedJson.Vulnerability)).toBe(true);
    expect(Array.isArray(loadedJson.Vulnerability[0].supportingAssetRef)).toBe(
      true
    );
    expect(loadedJson.Vulnerability[0].supportingAssetRef).toEqual([1, 2]);
  });
});
