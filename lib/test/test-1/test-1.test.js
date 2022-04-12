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

const xml = require('fs').readFileSync('./lib/test/test-1/test-1.xml', 'utf8');
const parser = require('../../src/api/xml-json/parser');

const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');

describe('XML is an empty form, class values are valid', () => {
  const ISRAProjectData = parser(xml);

  test('get israProject', () => {
    expect(ISRAProjectData instanceof ISRAProject).toBe(true);
  });

  const {
    ISRAmeta,
    BusinessAsset,
    SupportingAssetsDesc,
    SupportingAsset,
    Risk,
    Vulnerability,
  } = ISRAProjectData.properties;
  const ProjectContext = ISRAProjectData.israProjectContext.properties;

  describe('get ISRAmeta', () => {
    test('get projectName', () => {
      expect(ISRAmeta.projectName).toBe('');
    });

    test('get projectOrganization', () => {
      expect(ISRAmeta.projectOrganization).toBe('');
    });

    test('get projectVersion', () => {
      expect(ISRAmeta.projectVersion).toBe('');
    });

    test('get ISRAtracking', () => {
      expect(ISRAmeta.ISRAtracking).toEqual([]);
    });

    test('get businessAssetsCount', () => {
      expect(ISRAmeta.businessAssetsCount).toBe(BusinessAsset.length);
    });

    test('get supportingAssetsCount', () => {
      expect(ISRAmeta.supportingAssetsCount).toBe(SupportingAsset.length);
    });

    test('get risksCount', () => {
      expect(ISRAmeta.risksCount).toBe(Risk.length);
    });

    test('get vulnerabilitiesCount', () => {
      expect(ISRAmeta.vulnerabilitiesCount).toBe(Vulnerability.length);
    });
  });

  describe('get ProjectContext', () => {
    test('get projectDescription', () => {
      expect(ProjectContext.projectDescription).toBe('');
    });

    test('get projectURL', () => {
      expect(ProjectContext.projectURL).toBe('');
    });

    test('get projectDescriptionAttachment', () => {
      expect(ProjectContext.projectDescriptionAttachment).toBe('');
    });

    test('get securityProjectObjectives', () => {
      expect(ProjectContext.securityProjectObjectives).toBe('');
    });

    test('get securityOfficerObjectives', () => {
      expect(ProjectContext.securityOfficerObjectives).toBe('');
    });

    test('get securityAssumptions', () => {
      expect(ProjectContext.securityAssumptions).toBe('');
    });
  });

  test('get SupportingAssetsDesc', () => {
    expect(SupportingAssetsDesc).toBe('');
  });

  test('get BusinessAsset', () => {
    expect(BusinessAsset).toEqual([]);
  });

  test('get SupportingAsset', () => {
    expect(SupportingAsset).toEqual([]);
  });

  test('get Risk', () => {
    expect(Risk).toEqual([]);
  });

  test('get Vulnerability', () => {
    expect(Vulnerability).toEqual([]);
  });
});
