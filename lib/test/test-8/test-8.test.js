const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');
const ISRAMetaTracking = require('../../src/model/classes/ISRAProject/isra-meta-tracking');
const ISRAProjectContext = require('../../src/model/classes/ISRAProjectContext/isra-project-context');
const BusinessAsset = require('../../src/model/classes/BusinessAsset/business-asset');
const BusinessAssetProperties = require('../../src/model/classes/BusinessAsset/business-asset-properties');

describe('Populate class values (valid & invalid)', () => {
  const israProject = new ISRAProject();
  const israMetaTracking = new ISRAMetaTracking();
  const projectContext = new ISRAProjectContext();
  const businessAsset = new BusinessAsset();
  const businessAssetProperties = new BusinessAssetProperties();

  // ISRA Project
  test('set projectName', () => {
    israProject.projectName = 'project name';
    expect(israProject.properties.ISRAmeta.projectName).toBe('project name');

    expect(() => {
      israProject.projectName = 123;
    }).toThrow();
  });

  test('set projectOrganization', () => {
    israProject.projectOrganization = 'MCS';
    expect(israProject.properties.ISRAmeta.projectOrganization).toBe('MCS');

    expect(() => {
      israProject.projectOrganization = 'Invalid proj organization';
    }).toThrow();

    expect(() => {
      israProject.projectOrganization = 123;
    }).toThrow();
  });

  test('set projectVersion', () => {
    israProject.projectVersion = '1.01';
    expect(israProject.properties.ISRAmeta.projectVersion).toBe('1.01');

    expect(() => {
      israProject.projectVersion = 123;
    }).toThrow();
  });

  // ISRA Meta Tracking
  test('set ISRAtracking', () => {
    israProject.addMetaTracking(israMetaTracking);
    expect(israProject.properties.ISRAmeta.ISRAtracking
      .get(1).properties.trackingIteration)
      .toBe(1);

    expect(() => {
      israProject.addMetaTracking({});
    }).toThrow();
  });

  test('set trackingIteration', () => {
    expect(() => {
      israMetaTracking.trackingIteration = 'string';
    }).toThrow();
  });

  test('set trackingSecurityOfficer', () => {
    expect(() => {
      israMetaTracking.trackingSecurityOfficer = 123;
    }).toThrow();
  });

  test('set trackingDate', () => {
    expect(() => {
      israMetaTracking.trackingDate = 123;
    }).toThrow();
  });

  test('set trackingComment', () => {
    expect(() => {
      israMetaTracking.trackingComment = 123;
    }).toThrow();
  });

  // ISRA Project Context
  test('set projectContext', () => {
    expect(() => {
      israProject.israProjectContext = {};
    }).toThrow();
  });

  test('set projectDescription', () => {
    projectContext.projectDescription = 'project description';
    expect(projectContext.properties.projectDescription).toBe('project description');

    expect(() => {
      projectContext.projectDescription = 123;
    }).toThrow();
  });

  test('set projectURL', () => {
    projectContext.projectURL = 'https://www.google.com';
    expect(projectContext.properties.projectURL).toBe('https://www.google.com');

    expect(() => {
      projectContext.projectURL = 'https://';
    }).toThrow();

    expect(() => {
      projectContext.projectURL = 'http://';
    }).toThrow();

    expect(() => {
      projectContext.projectURL = 'www.google.com';
    }).toThrow();
  });

  test('set projectDescriptionAttachment', () => {
    expect(() => {
      projectContext.projectDescriptionAttachment = 123;
    }).toThrow();

    expect(() => {
      projectContext.projectDescriptionAttachment = 'nkjh8whNknj';
    }).toThrow();
  });

  test('set securityProjectObjectives', () => {
    expect(() => {
      projectContext.securityProjectObjectives = 123;
    }).toThrow();
  });

  test('set securityOfficerObjectives', () => {
    expect(() => {
      projectContext.securityOfficerObjectives = 123;
    }).toThrow();
  });

  test('set securityAssumptions', () => {
    expect(() => {
      projectContext.securityAssumptions = 123;
    }).toThrow();
  });

  test('set securityAssumptions', () => {
    expect(() => {
      projectContext.securityAssumptions = 123;
    }).toThrow();
  });

  // Business Asset
  test('set BusinessAsset', () => {
    expect(() => {
      israProject.addBusinessAsset({});
    }).toThrow();
  });

  test('set businessAssetId', () => {
    expect(() => {
      businessAsset.businessAssetId = 'string';
    }).toThrow();
  });

  test('set businessAssetName', () => {
    expect(() => {
      businessAsset.businessAssetName = 123;
    }).toThrow();
  });

  test('set businessAssetType', () => {
    expect(() => {
      businessAsset.businessAssetType = 123;
    }).toThrow();
  });

  test('set businessAssetDescription', () => {
    expect(() => {
      businessAsset.businessAssetDescription = 123;
    }).toThrow();
  });

  test('set businessAssetProperties', () => {
    expect(() => {
      businessAsset.businessAssetProperties = {};
    }).toThrow();
  });

  // Business Asset Properties
  test('set businessAssetIdRef', () => {
    expect(() => {
      businessAssetProperties.businessAssetIdRef = 'string';
    }).toThrow();
  });

  test('set businessAssetConfidentiality', () => {
    expect(() => {
      businessAssetProperties.businessAssetConfidentiality = 'string';
    }).toThrow();
  });

  test('set businessAssetIntegrity', () => {
    expect(() => {
      businessAssetProperties.businessAssetIntegrity = 'string';
    }).toThrow();
  });

  test('set businessAssetAvailability', () => {
    expect(() => {
      businessAssetProperties.businessAssetAvailability = 'string';
    }).toThrow();
  });

  test('set businessAssetAuthenticity', () => {
    expect(() => {
      businessAssetProperties.businessAssetAuthenticity = 'string';
    }).toThrow();
  });

  test('set businessAssetAuthorization', () => {
    expect(() => {
      businessAssetProperties.businessAssetAuthorization = 'string';
    }).toThrow();
  });

  test('set businessAssetNonRepudiation', () => {
    expect(() => {
      businessAssetProperties.businessAssetNonRepudiation = 'string';
    }).toThrow();
  });
});
