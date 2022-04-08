const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');
const ISRAMetaTracking = require('../../src/model/classes/ISRAProject/isra-meta-tracking');
const ISRAProjectContext = require('../../src/model/classes/ISRAProjectContext/isra-project-context');
const BusinessAsset = require('../../src/model/classes/BusinessAsset/business-asset');
const BusinessAssetProperties = require('../../src/model/classes/BusinessAsset/business-asset-properties');
const SupportingAsset = require('../../src/model/classes/SupportingAsset/supporting-asset');
const Risk = require('../../src/model/classes/Risk/risk');
const RiskName = require('../../src/model/classes/Risk/risk-name');
const RiskLikelihood = require('../../src/model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../src/model/classes/Risk/risk-impact');
const RiskAttackPath = require('../../src/model/classes/Risk/risk-attack-path');
const RiskMitigation = require('../../src/model/classes/Risk/risk-mitigation');

describe('Populate class values (valid & invalid)', () => {
  const israProject = new ISRAProject();
  const israMetaTracking = new ISRAMetaTracking();
  const projectContext = new ISRAProjectContext();
  const businessAsset = new BusinessAsset();
  const businessAssetProperties = new BusinessAssetProperties();
  const supportingAsset = new SupportingAsset();
  const risk = new Risk();
  const riskName = new RiskName();
  const riskLikelihood = new RiskLikelihood();
  const riskImpact = new RiskImpact();
  const riskAttackPath = new RiskAttackPath();
  const riskMitigation = new RiskMitigation();

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
      israProject.projectVersion = 1.01;
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
      israMetaTracking.trackingIteration = '1';
    }).toThrow();

    expect(() => {
      israMetaTracking.trackingIteration = 1.1;
    }).toThrow();
  });

  test('set trackingSecurityOfficer', () => {
    expect(() => {
      israMetaTracking.trackingSecurityOfficer = 123;
    }).toThrow();
  });

  test('set trackingDate', () => {
    israMetaTracking.trackingDate = '';
    expect(israMetaTracking.properties.trackingDate).toBe('');

    // invalid date format
    expect(() => {
      israMetaTracking.trackingDate = '2022-01-123';
    }).toThrow();

    expect(() => {
      israMetaTracking.trackingDate = 'string';
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
    projectContext.projectDescription = '<p style="color:blue>project description</p>';
    expect(projectContext.properties.projectDescription).toBe('<p style="color:blue>project description</p>');

    projectContext.projectDescription = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(projectContext.properties.projectDescription).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    projectContext.projectDescription = '';
    expect(projectContext.properties.projectDescription).toBe('');

    expect(() => {
      projectContext.projectDescription = 'project description';
    }).toThrow();

    expect(() => {
      projectContext.projectDescription = 123;
    }).toThrow();
  });

  test('set projectURL', () => {
    projectContext.projectURL = 'https://www.google.com';
    expect(projectContext.properties.projectURL).toBe('https://www.google.com');

    projectContext.projectURL = 'mailto:username@thalesgroup.com';
    expect(projectContext.properties.projectURL).toBe('mailto:username@thalesgroup.com');

    projectContext.projectURL = '';
    expect(projectContext.properties.projectURL).toBe('');

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
      projectContext.projectURL = 'mailto:';
    }).toThrow();

    expect(() => {
      projectContext.projectURL = 'www.google.com';
    }).toThrow();

    expect(() => {
      projectContext.projectURL = 'mailto:invalidEmail';
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
      businessAssetProperties.businessAssetIdRef = '1';
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
      businessAssetProperties.businessAssetConfidentiality = '2';
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
      businessAssetProperties.businessAssetIntegrity = '2';
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
      businessAssetProperties.businessAssetAvailability = '2';
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
      businessAssetProperties.businessAssetAuthenticity = '2';
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
      businessAssetProperties.businessAssetAuthorization = '2';
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
      businessAssetProperties.businessAssetNonRepudiation = '2';
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
      supportingAsset.supportingAssetType = '2';
    }).toThrow();
  });

  test('set businessAssetRef', () => {
    expect(() => {
      supportingAsset.addBusinessAssetRef('1');
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
      risk.riskId = '1';
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

  test('set allAttackPathsName', () => {
    expect(() => {
      risk.allAttackPathsName = 123;
    }).toThrow();
  });

  test('set allAttackPathsScore', () => {
    expect(() => {
      risk.allAttackPathsScore = 10.1;
    }).toThrow();

    expect(() => {
      risk.allAttackPathsScore = -0.1;
    }).toThrow();

    expect(() => {
      risk.allAttackPathsScore = '5.5';
    }).toThrow();
  });

  test('set inherentRiskScore', () => {
    expect(() => {
      risk.inherentRiskScore = NaN;
    }).toThrow();

    expect(() => {
      risk.inherentRiskScore = 1.1;
    }).toThrow();

    expect(() => {
      risk.inherentRiskScore = '1';
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
      riskName.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskName', () => {
    expect(() => {
      riskName.riskName = 123;
    }).toThrow();
  });

  test('set threatAgent', () => {
    expect(() => {
      riskName.threatAgent = 'Invalid agent';
    }).toThrow();

    expect(() => {
      riskName.threatAgent = 123;
    }).toThrow();
  });

  test('set threatAgentDetail', () => {
    expect(() => {
      riskName.threatAgentDetail = 123;
    }).toThrow();
  });

  test('set threatVerb', () => {
    expect(() => {
      riskName.threatVerb = 'Invalid verb';
    }).toThrow();

    expect(() => {
      riskName.threatVerb = 123;
    }).toThrow();
  });

  test('set threatVerbDetail', () => {
    expect(() => {
      riskName.threatVerbDetail = 123;
    }).toThrow();
  });

  test('set motivation', () => {
    expect(() => {
      riskName.motivation = 123;
    }).toThrow();
  });

  test('set motivationDetail', () => {
    expect(() => {
      riskName.motivationDetail = 123;
    }).toThrow();
  });

  test('set businessAssetRef', () => {
    expect(() => {
      riskName.businessAssetRef = 'string';
    }).toThrow();
  });

  test('set supportingAssetRef', () => {
    expect(() => {
      riskName.supportingAssetRef = 'string';
    }).toThrow();
  });

  // Risk Likelihood
  test('set riskLikelihood', () => {
    expect(() => {
      risk.riskLikelihood = {};
    }).toThrow();
  });

  test('set riskIdRef', () => {
    expect(() => {
      riskLikelihood.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskLikelihood', () => {
    expect(() => {
      riskLikelihood.riskLikelihood = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.riskLikelihood = 2.4;
    }).toThrow();

    expect(() => {
      riskLikelihood.riskLikelihood = 5;
    }).toThrow();

    expect(() => {
      riskLikelihood.riskLikelihood = 'string';
    }).toThrow();
  });

  test('set riskLikelihoodDetail', () => {
    expect(() => {
      riskLikelihood.riskLikelihoodDetail = 123;
    }).toThrow();
  });

  test('set skillLevel', () => {
    expect(() => {
      riskLikelihood.skillLevel = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.skillLevel = 2;
    }).toThrow();

    expect(() => {
      riskLikelihood.skillLevel = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.skillLevel = 'string';
    }).toThrow();
  });

  test('set reward', () => {
    expect(() => {
      riskLikelihood.reward = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.reward = 2;
    }).toThrow();

    expect(() => {
      riskLikelihood.reward = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.reward = 'string';
    }).toThrow();
  });

  test('set accessResources', () => {
    expect(() => {
      riskLikelihood.accessResources = 1;
    }).toThrow();

    expect(() => {
      riskLikelihood.accessResources = 6;
    }).toThrow();

    expect(() => {
      riskLikelihood.accessResources = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.accessResources = 'string';
    }).toThrow();
  });

  test('set size', () => {
    expect(() => {
      riskLikelihood.size = 1;
    }).toThrow();

    expect(() => {
      riskLikelihood.size = 7;
    }).toThrow();

    expect(() => {
      riskLikelihood.size = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.size = 'string';
    }).toThrow();
  });

  test('set intrusionDetection', () => {
    expect(() => {
      riskLikelihood.intrusionDetection = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.intrusionDetection = 5;
    }).toThrow();

    expect(() => {
      riskLikelihood.intrusionDetection = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.intrusionDetection = 'string';
    }).toThrow();
  });

  test('set threatFactorScore', () => {
    riskLikelihood.threatFactorScore = 11;
    expect(riskLikelihood.properties.threatFactorScore).toBe(11);

    riskLikelihood.threatFactorScore = 5.8;
    expect(riskLikelihood.properties.threatFactorScore).toBe(5.8);

    expect(() => {
      riskLikelihood.threatFactorScore = 'string';
    }).toThrow();
  });

  test('set threatFactorLevel', () => {
    expect(() => {
      riskLikelihood.threatFactorLevel = 'Invalid level';
    }).toThrow();

    expect(() => {
      riskLikelihood.threatFactorLevel = 123;
    }).toThrow();
  });

  test('set occurrence', () => {
    expect(() => {
      riskLikelihood.occurrence = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.occurrence = 6;
    }).toThrow();

    expect(() => {
      riskLikelihood.occurrence = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.occurrence = 'string';
    }).toThrow();
  });

  test('set occurrenceLevel', () => {
    expect(() => {
      riskLikelihood.occurrenceLevel = 'Invalid level';
    }).toThrow();

    expect(() => {
      riskLikelihood.occurrenceLevel = 123;
    }).toThrow();
  });

  // Risk Impact
  test('set riskImpact', () => {
    expect(() => {
      risk.riskImpact = {};
    }).toThrow();
  });

  test('set riskIdRef', () => {
    expect(() => {
      riskImpact.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskImpact', () => {
    expect(() => {
      riskImpact.riskImpact = '1';
    }).toThrow();
  });

  test('set businessAssetConfidentialityFlag', () => {
    expect(() => {
      riskImpact.businessAssetConfidentialityFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetConfidentialityFlag = 'string';
    }).toThrow();
  });

  test('set businessAssetIntegrityFlag', () => {
    expect(() => {
      riskImpact.businessAssetIntegrityFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetIntegrityFlag = 'string';
    }).toThrow();
  });

  test('set businessAssetAvailabilityFlag', () => {
    expect(() => {
      riskImpact.businessAssetAvailabilityFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetAvailabilityFlag = 'string';
    }).toThrow();
  });

  test('set businessAssetAuthenticityFlag', () => {
    expect(() => {
      riskImpact.businessAssetAuthenticityFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetAuthenticityFlag = 'string';
    }).toThrow();
  });

  test('set businessAssetAuthorizationFlag', () => {
    expect(() => {
      riskImpact.businessAssetAuthorizationFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetAuthorizationFlag = 'string';
    }).toThrow();
  });

  test('set businessAssetNonRepudiationFlag', () => {
    expect(() => {
      riskImpact.businessAssetNonRepudiationFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetNonRepudiationFlag = 'string';
    }).toThrow();
  });

  // Risk attack path
  test('set riskAttackPaths', () => {
    expect(() => {
      risk.addRiskAttackPath({});
    }).toThrow();
  });

  test('set riskIdRef', () => {
    expect(() => {
      riskAttackPath.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskAttackPathId', () => {
    expect(() => {
      riskAttackPath.riskAttackPathId = '1';
    }).toThrow();
  });

  test('set vulnerabilityRef', () => {
    expect(() => {
      riskAttackPath.addVulnerability({});
    }).toThrow();
  });

  test('set attackPathName', () => {
    expect(() => {
      riskAttackPath.attackPathName = 123;
    }).toThrow();
  });

  test('set attackPathScore', () => {
    expect(() => {
      riskAttackPath.attackPathScore = -0.1;
    }).toThrow();

    expect(() => {
      riskAttackPath.attackPathScore = 10.1;
    }).toThrow();

    expect(() => {
      riskAttackPath.attackPathScore = 'string';
    }).toThrow();
  });

  test('set inherentRiskScore', () => {
    expect(() => {
      risk.inherentRiskScore = -0.1;
    }).toThrow();

    expect(() => {
      risk.inherentRiskScore = 'string';
    }).toThrow();
  });

  // Risk mitigation
  test('set riskMitigation', () => {
    expect(() => {
      risk.addRiskMitigation({});
    }).toThrow();
  });

  test('set riskIdRef', () => {
    expect(() => {
      riskMitigation.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskMitigationId', () => {
    expect(() => {
      riskMitigation.riskMitigationId = '1';
    }).toThrow();
  });

  test('set benefits', () => {
    riskMitigation.benefits = null;
    expect(riskMitigation.properties.benefits).toBe(null);

    expect(() => {
      riskMitigation.benefits = 'null';
    }).toThrow();

    expect(() => {
      riskMitigation.benefits = '0';
    }).toThrow();

    expect(() => {
      riskMitigation.benefits = 'string';
    }).toThrow();

    expect(() => {
      riskMitigation.benefits = -0.1;
    }).toThrow();

    expect(() => {
      riskMitigation.benefits = 0.2;
    }).toThrow();

    expect(() => {
      riskMitigation.benefits = 1.1;
    }).toThrow();
  });

  test('set cost', () => {
    expect(() => {
      riskMitigation.cost = 10.1;
    }).toThrow();

    expect(() => {
      riskMitigation.cost = '10';
    }).toThrow();
  });

  test('set decision', () => {
    expect(() => {
      riskMitigation.decision = 'Invalid decision';
    }).toThrow();

    expect(() => {
      riskMitigation.decision = 123;
    }).toThrow();
  });
});
