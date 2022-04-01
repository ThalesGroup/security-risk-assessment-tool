process.argv.push('--path', 'test-2');
const args = require('minimist')(process.argv.slice(2));

const xmlName = args.path;
const xml = require('fs').readFileSync(`./lib/test/test-2/${xmlName}.xml`, 'utf8');
const parser = require('../../src/api/xml-json/parser');

describe('XML is fully filled', () => {
  const israProject = parser(xml).properties;
  const {
    ISRAmeta,
    ProjectContext,
    BusinessAsset,
    SupportingAssetsDesc,
    SupportingAsset,
    Risk,
    Vulnerability,
  } = israProject;

  test('get projectName', () => {
    expect(ISRAmeta.projectName).toBe('Sample Mobile Application');
  });

  test('get projectOrganization', () => {
    expect(ISRAmeta.projectOrganization).toBe('ITE');
  });

  test('get projectVersion', () => {
    expect(ISRAmeta.projectVersion).toBe('1.0');
  });

  describe('get ISRAtracking properties', () => {
    const israTracking1 = ISRAmeta.ISRAtracking.get(1).properties;
    const israTracking2 = ISRAmeta.ISRAtracking.get(2).properties;
    const israTracking3 = ISRAmeta.ISRAtracking.get(3).properties;

    test('get israTracking 1', () => {
      expect(israTracking1.trackingIteration).toBe(1);
      expect(israTracking1.trackingSecurityOfficer).toBe('anotherUser');
      expect(israTracking1.trackingDate).toBe('2022-03-24');
      expect(israTracking1.trackingComment).toBe('a comment');
    });

    test('get israTracking 2', () => {
      expect(israTracking2.trackingIteration).toBe(2);
      expect(israTracking2.trackingSecurityOfficer).toBe('t0263774');
      expect(israTracking2.trackingDate).toBe('2022-03-29');
      expect(israTracking2.trackingComment).toBe('a comment 2');
    });

    test('get israTracking 3', () => {
      expect(israTracking3.trackingIteration).toBe(3);
      expect(israTracking3.trackingSecurityOfficer).toBe('t0263774');
      expect(israTracking3.trackingDate).toBe('2022-03-29');
      expect(israTracking3.trackingComment).toBe('a comment 3');
    });
  });

  test('get businessAssetsCount', () => {
    expect(ISRAmeta.businessAssetsCount).toBe(3);
  });

  test('get supportingAssetsCount', () => {
    expect(ISRAmeta.supportingAssetsCount).toBe(4);
  });

  test('get risksCount', () => {
    expect(ISRAmeta.risksCount).toBe(4);
  });

  test('get vulnerabilitiesCount', () => {
    expect(ISRAmeta.vulnerabilitiesCount).toBe(5);
  });

  // test('get projectDescription', () => {
  //   expect(ProjectContext.projectDescription).toBe();
  // });

  test('get projectURL', () => {
    expect(ProjectContext.projectURL).toBe('https://www.google.com/');
  });

  // test('get projectDescriptionAttachment', () => {
  //   expect(ProjectContext.projectDescriptionAttachment).toBe('');
  // });

  describe('get businessAsset', () => {
    const businessAsset1 = BusinessAsset.get(1).properties;
    const businessAsset2 = BusinessAsset.get(2).properties;
    const businessAsset3 = BusinessAsset.get(4).properties;

    test('get businessAsset1', () => {
      expect(businessAsset1.businessAssetId).toBe(1);
      expect(businessAsset1.businessAssetName).toBe('User credentials');
      expect(businessAsset1.businessAssetType).toBe('Data');
      // expect(businessAsset1.businessAssetDescription).toBe();

      const {
        businessAssetConfidentiality,
        businessAssetIntegrity,
        businessAssetAvailability,
        businessAssetAuthenticity,
        businessAssetAuthorization,
        businessAssetNonRepudiation,
      } = businessAsset1.businessAssetProperties;
      expect(businessAssetConfidentiality).toBe(4);
      expect(businessAssetIntegrity).toBe(3);
      expect(businessAssetAvailability).toBe(1);
      expect(businessAssetAuthenticity).toBe(1);
      expect(businessAssetAuthorization).toBe(1);
      expect(businessAssetNonRepudiation).toBe(1);
    });

    test('get businessAsset2', () => {
      expect(businessAsset2.businessAssetId).toBe(2);
      expect(businessAsset2.businessAssetName).toBe('Financial transactions');
      expect(businessAsset2.businessAssetType).toBe('Data');
      expect(businessAsset2.businessAssetDescription).toBe('');

      const {
        businessAssetConfidentiality,
        businessAssetIntegrity,
        businessAssetAvailability,
        businessAssetAuthenticity,
        businessAssetAuthorization,
        businessAssetNonRepudiation,
      } = businessAsset2.businessAssetProperties;
      expect(businessAssetConfidentiality).toBe(3);
      expect(businessAssetIntegrity).toBe(3);
      expect(businessAssetAvailability).toBe(2);
      expect(businessAssetAuthenticity).toBe(2);
      expect(businessAssetAuthorization).toBe(3);
      expect(businessAssetNonRepudiation).toBe(1);
    });

    test('get businessAsset4', () => {
      expect(businessAsset3.businessAssetId).toBe(4);
      expect(businessAsset3.businessAssetName).toBe('Server URL');
      expect(businessAsset3.businessAssetType).toBe('Data');
      expect(businessAsset3.businessAssetDescription).toBe('Server address to execute financial transactions and retrieve account information');

      const {
        businessAssetConfidentiality,
        businessAssetIntegrity,
        businessAssetAvailability,
        businessAssetAuthenticity,
        businessAssetAuthorization,
        businessAssetNonRepudiation,
      } = businessAsset3.businessAssetProperties;
      expect(businessAssetConfidentiality).toBe(2);
      expect(businessAssetIntegrity).toBe(3);
      expect(businessAssetAvailability).toBe(1);
      expect(businessAssetAuthenticity).toBe(1);
      expect(businessAssetAuthorization).toBe(0);
      expect(businessAssetNonRepudiation).toBe(0);
    });
  });
});
