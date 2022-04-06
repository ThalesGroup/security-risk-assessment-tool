const xml = require('fs').readFileSync('./lib/test/test-1/test-1.xml', 'utf8');
const parser = require('../../src/api/xml-json/parser');

const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');

describe('XML is an empty form, class values are valid', () => {
  const ISRAProjectData = parser(xml);

  test('get israProject', () => {
    expect(ISRAProjectData instanceof ISRAProject).toBe(true);
  });

  const israProject = ISRAProjectData.properties;
  const {
    ISRAmeta,
    ProjectContext,
    BusinessAsset,
    SupportingAssetsDesc,
    SupportingAsset,
    Risk,
    Vulnerability,
  } = israProject;

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
      expect(ISRAmeta.ISRAtracking.size).toBe(0);
    });

    test('get businessAssetsCount', () => {
      expect(ISRAmeta.businessAssetsCount).toBe(BusinessAsset.size);
    });

    test('get supportingAssetsCount', () => {
      expect(ISRAmeta.supportingAssetsCount).toBe(SupportingAsset.size);
    });

    test('get risksCount', () => {
      expect(ISRAmeta.risksCount).toBe(Risk.size);
    });

    test('get vulnerabilitiesCount', () => {
      expect(ISRAmeta.vulnerabilitiesCount).toBe(Vulnerability.size);
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
    expect(BusinessAsset.size).toBe(0);
  });

  test('get SupportingAsset', () => {
    expect(SupportingAsset.size).toBe(0);
  });

  test('get Risk', () => {
    expect(Risk.size).toBe(0);
  });

  test('get Vulnerability', () => {
    expect(Vulnerability.size).toBe(0);
  });
});
