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

  describe('get ISRAmeta', () => {
    test('get projectName', () => {
      expect(ISRAmeta.projectName).toBe('Sample Mobile Application');
    });

    test('get projectOrganization', () => {
      expect(ISRAmeta.projectOrganization).toBe('ITE');
    });

    test('get projectVersion', () => {
      expect(ISRAmeta.projectVersion).toBe('1.0');
    });

    describe('get ISRAtracking', () => {
      test('validate no of ISRAtracking', () => {
        expect(Array.from(ISRAmeta.ISRAtracking)).toHaveLength(3);
      });

      const israTracking1 = {
        trackingIteration: 1,
        trackingSecurityOfficer: 'anotherUser',
        trackingDate: '2022-03-24',
        trackingComment: 'a comment',
      };

      test('get israTracking 1', () => {
        expect(ISRAmeta.ISRAtracking.get(1).properties).toEqual(israTracking1);
      });

      const israTracking2 = {
        trackingIteration: 2,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: 'a comment 2',
      };

      test('get israTracking 2', () => {
        expect(ISRAmeta.ISRAtracking.get(2).properties).toEqual(israTracking2);
      });

      const israTracking3 = {
        trackingIteration: 3,
        trackingSecurityOfficer: 't0263774',
        trackingDate: '2022-03-29',
        trackingComment: 'a comment 3',
      };

      test('get israTracking 3', () => {
        expect(ISRAmeta.ISRAtracking.get(3).properties).toEqual(israTracking3);
      });
    });

    test('get businessAssetsCount', () => {
      expect(ISRAmeta.businessAssetsCount).toBe(3);
      expect(Array.from(BusinessAsset)).toHaveLength(3);
    });

    test('get supportingAssetsCount', () => {
      expect(ISRAmeta.supportingAssetsCount).toBe(4);
      expect(Array.from(SupportingAsset)).toHaveLength(4);
    });

    test('get risksCount', () => {
      expect(ISRAmeta.risksCount).toBe(4);
      expect(Array.from(Risk)).toHaveLength(4);
    });

    test('get vulnerabilitiesCount', () => {
      expect(ISRAmeta.vulnerabilitiesCount).toBe(5);
      expect(Array.from(Vulnerability)).toHaveLength(5);
    });
  });

  describe('get ProjectContext', () => {
    test('get projectDescription', () => {
      expect(ProjectContext.projectDescription).toMatch(/system is composed of a mobile payment application that permits to do financial transactions which connects to the ban/);
      expect(ProjectContext.projectDescription).toMatch(/src="data:image\/png;base64,iVBORw0KGgoAAAANSUhEUgAABaUAAAC6CAYAAAC/);
      expect(ProjectContext.projectDescription).toMatch(/It permits to see the account information of the user even if offline./);
    });

    test('get projectURL', () => {
      expect(ProjectContext.projectURL).toBe('https://www.google.com/');
    });

    test('get projectDescriptionAttachment', () => {
      expect(ProjectContext.projectDescriptionAttachment).toMatch(/x0lGQRQAAAABAAAAAAAAAOwxAAAKAAAAdABlAHMAdAAuAGQAbwBjAHgAAABQSwMEFAAGAAgAAAAhAN/);
    });

    test('get securityProjectObjectives', () => {
      expect(ProjectContext.securityProjectObjectives).toBe('<div xmlns="http://www.w3.org/1999/xhtml" align="center"><em>Test</em></div>');
    });

    test('get securityOfficerObjectives', () => {
      expect(ProjectContext.securityOfficerObjectives).toBe('<strong xmlns="http://www.w3.org/1999/xhtml">Test</strong>');
    });

    test('get securityAssumptions', () => {
      expect(ProjectContext.securityAssumptions).toMatch('<div xmlns="http://www.w3.org/1999/xhtml">&lt;dfgdg&gt;</div>');
      expect(ProjectContext.securityAssumptions).toMatch('<ul style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc" xmlns="http://www.w3.org/1999/xhtml" xmlns:pc="http://schemas.microsoft.com/office/infopath/2007/PartnerControls">');
      expect(ProjectContext.securityAssumptions).toMatch('<ul style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc" xmlns="http://www.w3.org/1999/xhtml" xmlns:pc="http://schemas.microsoft.com/office/infopath/2007/PartnerControls">');
      expect(ProjectContext.securityAssumptions).toMatch('<li>test</li>');
      expect(ProjectContext.securityAssumptions).toMatch('<li>We assume that the platform interface internal processing are valid and yield correct result</li>');
      expect(ProjectContext.securityAssumptions).toMatch('<div xmlns="http://www.w3.org/1999/xhtml">hey</div>');
    });
  });

  describe('get BusinessAsset', () => {
    const ba1 = {
      businessAssetId: 1,
      businessAssetName: 'User credentials',
      businessAssetType: 'Data',
      businessAssetDescription: '<ul xmlns="http://www.w3.org/1999/xhtml" style="MARGIN-BOTTOM: 0px; MARGIN-TOP: 0px" type="disc">\n'
      + '<li xmlns="http://www.w3.org/1999/xhtml" xmlns:pc="http://schemas.microsoft.com/office/infopath/2007/PartnerControls">Presents the user credential to login to the payment application</li></ul>',
      businessAssetProperties: {
        businessAssetIdRef: 1,
        businessAssetConfidentiality: 4,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 1,
        businessAssetAuthenticity: 1,
        businessAssetAuthorization: 1,
        businessAssetNonRepudiation: 1,
      },
    };

    test('get businessAsset1', () => {
      expect(BusinessAsset.get(1).properties).toEqual(ba1);
    });

    const ba2 = {
      businessAssetId: 2,
      businessAssetName: 'Financial transactions',
      businessAssetType: 'Data',
      businessAssetDescription: '',
      businessAssetProperties: {
        businessAssetIdRef: 2,
        businessAssetConfidentiality: 3,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 2,
        businessAssetAuthenticity: 2,
        businessAssetAuthorization: 3,
        businessAssetNonRepudiation: 1,
      },
    };

    test('get businessAsset2', () => {
      expect(BusinessAsset.get(2).properties).toEqual(ba2);
    });

    const ba3 = {
      businessAssetId: 4,
      businessAssetName: 'Server URL',
      businessAssetType: 'Data',
      businessAssetDescription: 'Server address to execute financial transactions and retrieve account information',
      businessAssetProperties: {
        businessAssetIdRef: 4,
        businessAssetConfidentiality: 2,
        businessAssetIntegrity: 3,
        businessAssetAvailability: 1,
        businessAssetAuthenticity: 1,
        businessAssetAuthorization: 0,
        businessAssetNonRepudiation: 0,
      },
    };

    test('get businessAsset3', () => {
      expect(BusinessAsset.get(4).properties).toEqual(ba3);
    });
  });

  test('get SupportingAssetDesc', () => {
    expect(SupportingAssetsDesc).toMatch('<div xmlns="http://www.w3.org/1999/xhtml" xmlns:pc="http://schemas.microsoft.com/office/infopath/2007/PartnerControls"> </div>');
  });

  describe('get SupportingAsset', () => {
    const supportingAsset1 = {
      supportingAssetId: 1,
      supportingAssetHLDId: '1',
      supportingAssetName: 'Local client storage',
      supportingAssetType: 'Hardware device',
      supportingAssetSecurityLevel: -1,
      businessAssetRefs: new Set([1]),
    };

    test('get supportingAsset1', () => {
      expect(SupportingAsset.get(1).properties).toEqual(supportingAsset1);
    });

    const supportingAsset2 = {
      supportingAssetId: 2,
      supportingAssetHLDId: '2',
      supportingAssetName: 'Internet connection (TLS)',
      supportingAssetType: 'Network',
      supportingAssetSecurityLevel: -1,
      businessAssetRefs: new Set([4, 2, 1]),
    };

    test('get supportingAsset2', () => {
      expect(SupportingAsset.get(2).properties).toEqual(supportingAsset2);
    });

    const supportingAsset3 = {
      supportingAssetId: 3,
      supportingAssetHLDId: '3',
      supportingAssetName: ' User Interface',
      supportingAssetType: 'Interface',
      supportingAssetSecurityLevel: -1,
      businessAssetRefs: new Set([4, 2]),
    };

    test('get supportingAsset3', () => {
      expect(SupportingAsset.get(3).properties).toEqual(supportingAsset3);
    });

    const supportingAsset4 = {
      supportingAssetId: 4,
      supportingAssetHLDId: '4',
      supportingAssetName: 'Device keyboard',
      supportingAssetType: '',
      supportingAssetSecurityLevel: -1,
      businessAssetRefs: new Set([2]),
    };

    test('get supportingAsset4', () => {
      expect(SupportingAsset.get(4).properties).toEqual(supportingAsset4);
    });
  });
});
