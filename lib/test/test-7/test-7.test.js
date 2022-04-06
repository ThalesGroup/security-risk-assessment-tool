const xml = require('fs').readFileSync('./lib/test/test-7/test-7.xml', 'utf8');
const parser = require('../../src/api/xml-json/parser');

const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');

const isBase64 = (string) => {
  const pattern = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return pattern.test(string);
};

// checks for presence of HTML elements
const isValidHtml = (string) => {
  const pattern = /<\/?[a-z][\s\S]*>/i;
  return pattern.test(string);
};

describe('XML is partially filled, class values are valid', () => {
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
      expect(ISRAmeta.projectName).toBe('name of proj');
    });

    test('get projectOrganization', () => {
      expect(ISRAmeta.projectOrganization).toBe('');
    });

    test('get projectVersion', () => {
      expect(ISRAmeta.projectVersion).toBe('');
    });

    describe('get ISRAtracking', () => {
      test('validate no of ISRAtracking', () => {
        expect(ISRAmeta.ISRAtracking.size).toBe(3);
      });

      const israTracking1 = {
        trackingIteration: 1,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: '1',
      };

      test('get israTracking 1', () => {
        expect(ISRAmeta.ISRAtracking.get(1).properties).toEqual(israTracking1);
      });

      const israTracking2 = {
        trackingIteration: 2,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: '2',
      };

      test('get israTracking 2', () => {
        expect(ISRAmeta.ISRAtracking.get(2).properties).toEqual(israTracking2);
      });

      const israTracking3 = {
        trackingIteration: 3,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: '3',
      };

      test('get israTracking 3', () => {
        expect(ISRAmeta.ISRAtracking.get(3).properties).toEqual(israTracking3);
      });
    });

    test('get businessAssetsCount', () => {
      expect(BusinessAsset.size).toBe(0);
      expect(ISRAmeta.businessAssetsCount).toBe(0);
    });

    test('get supportingAssetsCount', () => {
      expect(SupportingAsset.size).toBe(1);
      expect(ISRAmeta.supportingAssetsCount).toBe(1);
    });

    test('get risksCount', () => {
      expect(Risk.size).toBe(2);
      expect(ISRAmeta.risksCount).toBe(2);
    });

    test('get vulnerabilitiesCount', () => {
      expect(Vulnerability.size).toBe(2);
      expect(ISRAmeta.vulnerabilitiesCount).toBe(2);
    });
  });
});
