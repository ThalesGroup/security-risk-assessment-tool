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
      expect(BusinessAsset.size).toBe(0);
      expect(ISRAmeta.businessAssetsCount).toBe(0);
    });

    test('get supportingAssetsCount', () => {
      expect(SupportingAsset.size).toBe(0);
      expect(ISRAmeta.supportingAssetsCount).toBe(0);
    });

    test('get risksCount', () => {
      expect(Risk.size).toBe(0);
      expect(ISRAmeta.risksCount).toBe(0);
    });

    test('get vulnerabilitiesCount', () => {
      expect(Vulnerability.size).toBe(0);
      expect(ISRAmeta.vulnerabilitiesCount).toBe(0);
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
    expect(BusinessAsset).toEqual(new Map());
  });

  test('get SupportingAsset', () => {
    expect(SupportingAsset).toEqual(new Map());
  });

  test('get Risk', () => {
    expect(Risk).toEqual(new Map());
  });

  test('get Vulnerability', () => {
    expect(Vulnerability).toEqual(new Map());
  });
});
