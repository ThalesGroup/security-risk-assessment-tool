const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');
const ISRAMetaTracking = require('../../src/model/classes/ISRAProject/isra-meta-tracking');
const ISRAProjectContext = require('../../src/model/classes/ISRAProjectContext/isra-project-context');
const BusinessAsset = require('../../src/model/classes/BusinessAsset/business-asset');
const BusinessAssetProperties = require('../../src/model/classes/BusinessAsset/business-asset-properties');
const SupportingAsset = require('../../src/model/classes/SupportingAsset/supporting-asset');
const Risk = require('../../src/model/classes/Risk/risk');
const RiskName = require('../../src/model/classes/Risk/risk-name');

describe('Populate class values (valid & invalid)', () => {
  const israProject = new ISRAProject();
  const israMetaTracking = new ISRAMetaTracking();
  const projectContext = new ISRAProjectContext();
  const businessAsset = new BusinessAsset();
  const businessAssetProperties = new BusinessAssetProperties();
  const supportingAsset = new SupportingAsset();
  const risk = new Risk();
  const riskName = new RiskName();

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
      israProject.projectOrganization = 'Invalid project organization';
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
      israMetaTracking.trackingDate = 'comment';
    }).toThrow();

    expect(() => {
      israMetaTracking.trackingDate = '2022-01-123';
    }).toThrow();

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

    projectContext.projectDescription = '<div>project description</div>';
    expect(projectContext.properties.projectDescription).toBe('<div>project description</div>');

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
      projectContext.projectURL = 'ftp://';
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
      businessAsset.businessAssetType = 'Invalid type';
    }).toThrow();

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
      businessAssetProperties.businessAssetConfidentiality = -1;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetConfidentiality = 5;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetConfidentiality = 'string';
    }).toThrow();
  });

  test('set businessAssetIntegrity', () => {
    expect(() => {
      businessAssetProperties.businessAssetIntegrity = -1;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetIntegrity = 5;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetIntegrity = 'string';
    }).toThrow();
  });

  test('set businessAssetAvailability', () => {
    expect(() => {
      businessAssetProperties.businessAssetAvailability = -1;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetAvailability = 5;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetAvailability = 'string';
    }).toThrow();
  });

  test('set businessAssetAuthenticity', () => {
    expect(() => {
      businessAssetProperties.businessAssetAuthenticity = -1;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetAuthenticity = 5;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetAuthenticity = 'string';
    }).toThrow();
  });

  test('set businessAssetAuthorization', () => {
    expect(() => {
      businessAssetProperties.businessAssetAuthorization = -1;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetAuthorization = 5;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetAuthorization = 'string';
    }).toThrow();
  });

  test('set businessAssetNonRepudiation', () => {
    expect(() => {
      businessAssetProperties.businessAssetNonRepudiation = -1;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetNonRepudiation = 5;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetNonRepudiation = 'string';
    }).toThrow();
  });

  // Supporting Asset Desc
  test('set supportingAssetsDesc', () => {
    expect(() => {
      israProject.supportingAssetsDesc = 123;
    }).toThrow();
  });

  // Supporting Asset
  test('set SupportingAsset', () => {
    expect(() => {
      israProject.addSupportingAsset({});
    }).toThrow();
  });

  test('set supportingAssetId', () => {
    expect(() => {
      supportingAsset.supportingAssetId = 'string';
    }).toThrow();
  });

  test('set supportingAssetHLDId', () => {
    expect(() => {
      supportingAsset.supportingAssetHLDId = 123;
    }).toThrow();
  });

  test('set supportingAssetName', () => {
    expect(() => {
      supportingAsset.supportingAssetName = 123;
    }).toThrow();
  });

  test('set supportingAssetType', () => {
    expect(() => {
      supportingAsset.supportingAssetType = 'Invalid type';
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetType = 123;
    }).toThrow();
  });

  test('set supportingAssetSecurityLevel', () => {
    expect(() => {
      supportingAsset.supportingAssetType = -3;
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetType = 3;
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetType = 0.1;
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetType = 'string';
    }).toThrow();
  });

  test('set businessAssetRef', () => {
    expect(() => {
      supportingAsset.addBusinessAssetRef('string');
    }).toThrow();
  });

  // Risk
  test('set Risk', () => {
    expect(() => {
      israProject.addRisk({});
    }).toThrow();
  });

  test('set riskId', () => {
    expect(() => {
      risk.riskId = 'string';
    }).toThrow();
  });

  test('set projectNameRef', () => {
    expect(() => {
      risk.projectNameRef = 123;
    }).toThrow();
  });

  test('set projectVersionRef', () => {
    expect(() => {
      risk.projectVersionRef = 123;
    }).toThrow();
  });

  // Risk Name
  test('set riskName', () => {
    expect(() => {
      risk.riskName = {};
    }).toThrow();
  });

  test('set riskIdRef', () => {
    expect(() => {
      riskName.riskIdRef = 'string';
    }).toThrow();
  });

  test('set riskName', () => {
    expect(() => {
      riskName.riskName = 123;
    }).toThrow();
  });
});
