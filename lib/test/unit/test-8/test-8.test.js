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

const user = require('os').userInfo().username;

const date = new Date();
const currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const ISRAProject = require('../../../src/model/classes/ISRAProject/isra-project');
const ISRAMetaTracking = require('../../../src/model/classes/ISRAProject/isra-meta-tracking');
const ISRAProjectContext = require('../../../src/model/classes/ISRAProjectContext/isra-project-context');
const BusinessAsset = require('../../../src/model/classes/BusinessAsset/business-asset');
const BusinessAssetProperties = require('../../../src/model/classes/BusinessAsset/business-asset-properties');
const SupportingAsset = require('../../../src/model/classes/SupportingAsset/supporting-asset');
const Risk = require('../../../src/model/classes/Risk/risk');
const RiskLikelihood = require('../../../src/model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../../src/model/classes/Risk/risk-impact');
const RiskAttackPath = require('../../../src/model/classes/Risk/risk-attack-path');
const RiskMitigation = require('../../../src/model/classes/Risk/risk-mitigation');
const Vulnerability = require('../../../src/model/classes/Vulnerability/vulnerability');
const config = require('../../../src/config')

describe('Populate class values (valid & invalid)', () => {
  const israProject = new ISRAProject();
  const israMetaTracking = new ISRAMetaTracking();
  const projectContext = new ISRAProjectContext();
  const businessAsset = new BusinessAsset();
  const businessAssetProperties = new BusinessAssetProperties();
  const supportingAsset = new SupportingAsset();
  const risk = new Risk();
  const riskLikelihood = new RiskLikelihood();
  const riskImpact = new RiskImpact();
  const riskAttackPath = new RiskAttackPath();
  const riskMitigation = new RiskMitigation();
  const vulnerability = new Vulnerability();

  // ISRA Project
  test('set iteration', () => {
    israProject.iteration = null;
    expect(israProject.iteration).toBe(null);

    israProject.iteration = 1;
    expect(israProject.iteration).toBe(1);

    expect(() => {
      israProject.iteration = '1';
    }).toThrow();
  });

  test('set projectName', () => {
    israProject.projectName = 'project name';
    expect(israProject.projectName).toBe('project name');

    israProject.projectName = '';
    expect(israProject.projectName).toBe('');

    expect(() => {
      israProject.projectName = 123;
    }).toThrow();
  });

  test('set projectOrganization', () => {
    const testValues = config.organizations;

    testValues.forEach((testValue) => {
      israProject.projectOrganization = testValue;
      expect(israProject.projectOrganization).toBe(testValue);
    });

    /* expect(() => {
      israProject.projectOrganization = 'Invalid project organization';
    }).toThrow(); */

    expect(() => {
      israProject.projectOrganization = 123;
    }).toThrow();
  });

  test('set projectVersion', () => {
    israProject.projectVersion = '1.01';
    expect(israProject.projectVersion).toBe('1.01');

    israProject.projectVersion = '';
    expect(israProject.projectVersion).toBe('');

    expect(() => {
      israProject.projectVersion = 1.01;
    }).toThrow();
  });

  test('set latestBusinessAssetId', () => {
    israProject.latestBusinessAssetId = 1;
    expect(israProject.latestBusinessAssetId).toBe(1);

    israProject.latestBusinessAssetId = null;
    expect(israProject.latestBusinessAssetId).toBe(null);

    expect(() => {
      israProject.latestBusinessAssetId = '1';
    }).toThrow();
  });

  test('set latestSupportingAssetId', () => {
    israProject.latestSupportingAssetId = 1;
    expect(israProject.latestSupportingAssetId).toBe(1);

    israProject.latestSupportingAssetId = null;
    expect(israProject.latestSupportingAssetId).toBe(null);

    expect(() => {
      israProject.latestSupportingAssetId = '1';
    }).toThrow();
  });

  test('set latestRiskId', () => {
    israProject.latestRiskId = 1;
    expect(israProject.latestRiskId).toBe(1);

    israProject.latestRiskId = null;
    expect(israProject.latestRiskId).toBe(null);

    expect(() => {
      israProject.latestRiskId = '1';
    }).toThrow();
  });

  test('set latestVulnerabilityId', () => {
    israProject.latestVulnerabilityId = 1;
    expect(israProject.latestVulnerabilityId).toBe(1);

    israProject.latestVulnerabilityId = null;
    expect(israProject.latestVulnerabilityId).toBe(null);

    expect(() => {
      israProject.latestVulnerabilityId = '1';
    }).toThrow();
  });

  // get ISRA Project
  test('get ISRAproject', () => {
    const proj = {
      ISRAmeta: {
        classification: israProject.properties.ISRAmeta.classification,
        iteration: 1,
        projectName: '',
        projectOrganization: config.organizations[config.organizations.length - 1],
        projectVersion: '',
        ISRAtracking: [],
        businessAssetsCount: 0,
        schemaVersion: 3,
        supportingAssetsCount: 0,
        risksCount: 0,
        vulnerabilitiesCount: 0,
        latestBusinessAssetId: null,
        latestRiskId: null,
        latestSupportingAssetId: null,
        latestVulnerabilityId: null,
      },
      ProjectContext: {
        projectDescription: '',
        projectDescriptionAttachment: '',
        projectURL: '',
        securityAssumptions: '',
        securityOfficerObjectives: '',
        securityProjectObjectives: '',
      },
      BusinessAsset: [],
      SupportingAssetsDesc: '',
      SupportingAsset: [],
      Risk: [],
      Vulnerability: [],
    };

    const result = israProject.toJSON();
    expect(JSON.parse(result)).toEqual(proj);
  });

  // set ISRA Meta Tracking
  test('set ISRAMetaTracking', () => {
    israProject.addMetaTracking(israMetaTracking);
    expect(israProject.getMetaTracking(1).properties)
      .toEqual({
        trackingIteration: 1,
        trackingSecurityOfficer: user,
        trackingDate: currentDate,
        trackingComment: '',
      });

    expect(() => {
      israProject.addMetaTracking({});
    }).toThrow();
  });

  test('set trackingIteration', () => {
    israMetaTracking.trackingIteration = null;
    expect(israMetaTracking.trackingIteration).toBe(null);

    israMetaTracking.trackingIteration = 1;
    expect(israMetaTracking.trackingIteration).toBe(1);

    expect(() => {
      israMetaTracking.trackingIteration = '1';
    }).toThrow();

    expect(() => {
      israMetaTracking.trackingIteration = 0;
    }).toThrow();

    expect(() => {
      israMetaTracking.trackingIteration = 1.1;
    }).toThrow();
  });

  test('set trackingSecurityOfficer', () => {
    israMetaTracking.trackingSecurityOfficer = 'officer name 1';
    expect(israMetaTracking.trackingSecurityOfficer).toBe('officer name 1');

    israMetaTracking.trackingSecurityOfficer = '';
    expect(israMetaTracking.trackingSecurityOfficer).toBe('');

    expect(() => {
      israMetaTracking.trackingSecurityOfficer = 123;
    }).toThrow();
  });

  test('set trackingDate', () => {
    israMetaTracking.trackingDate = '2022-04-08';
    expect(israMetaTracking.trackingDate).toBe('2022-04-08');

    israMetaTracking.trackingDate = '';
    expect(israMetaTracking.trackingDate).toBe('');

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
    israMetaTracking.trackingComment = '';
    expect(israMetaTracking.trackingComment).toBe('');

    israMetaTracking.trackingComment = 'comment';
    expect(israMetaTracking.trackingComment).toBe('comment');

    expect(() => {
      israMetaTracking.trackingComment = 123;
    }).toThrow();
  });

  // get ISRA Meta Tracking
  test('get ISRAMetaTracking', () => {
    const tracking = {
      trackingIteration: 1,
      trackingSecurityOfficer: '',
      trackingDate: '',
      trackingComment: 'comment',
    };

    expect(israProject.getMetaTracking(1).properties).toEqual(tracking);
  });

  // set ISRA Project Context
  test('set projectContext', () => {
    israProject.israProjectContext = projectContext;
    expect(israProject.israProjectContext.properties)
      .toEqual({
        projectDescription: undefined,
        projectURL: undefined,
        projectDescriptionAttachment: undefined,
        securityProjectObjectives: undefined,
        securityOfficerObjectives: undefined,
        securityAssumptions: undefined,
      });

    expect(() => {
      israProject.israProjectContext = {
        projectDescription: '',
        projectURL: '',
        projectDescriptionAttachment: '',
        securityProjectObjectives: '',
        securityOfficerObjectives: '',
        securityAssumptions: '',
      };
    }).toThrow(/not an instance/);
  });

  test('set projectDescription', () => {
    projectContext.projectDescription = '<p style="color:blue>project description</p>';
    expect(projectContext.projectDescription).toBe('<p style="color:blue>project description</p>');

    projectContext.projectDescription = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(projectContext.projectDescription).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    projectContext.projectDescription = '';
    expect(projectContext.projectDescription).toBe('');

    expect(() => {
      projectContext.projectDescription = 'project description';
    }).toThrow();

    expect(() => {
      projectContext.projectDescription = 123;
    }).toThrow();
  });

  test('set projectURL', () => {
    projectContext.projectURL = 'https://www.google.com';
    expect(projectContext.projectURL).toBe('https://www.google.com');

    projectContext.projectURL = 'ftp://server.example/pathname';
    expect(projectContext.projectURL).toBe('ftp://server.example/pathname');

    projectContext.projectURL = 'mailto:username@thalesgroup.com';
    expect(projectContext.projectURL).toBe('mailto:username@thalesgroup.com');

    projectContext.projectURL = '';
    expect(projectContext.projectURL).toBe('');

    const testValues = ['https://', 'htpp://', 'ftp://', 'mailto:', 'ftp://server/', 'www.google.com', 'mailto:invalidEmail'];

    testValues.forEach((testValue) => {
      expect(() => {
        projectContext.projectURL = testValue;
      }).toThrow();
    });
  });

  test('set projectDescriptionAttachment', () => {
    projectContext.projectDescriptionAttachment = 'YWJjZA==';
    expect(projectContext.projectDescriptionAttachment).toBe('YWJjZA==');

    projectContext.projectDescriptionAttachment = '';
    expect(projectContext.projectDescriptionAttachment).toBe('');

    expect(() => {
      projectContext.projectDescriptionAttachment = 123;
    }).toThrow();

    /* expect(() => {
      projectContext.projectDescriptionAttachment = 'nkjh8whNknj';
    }).toThrow(); */
  });

  test('set securityProjectObjectives', () => {
    projectContext.securityProjectObjectives = '<p style="color:blue>project description</p>';
    expect(projectContext.securityProjectObjectives).toBe('<p style="color:blue>project description</p>');

    projectContext.securityProjectObjectives = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(projectContext.securityProjectObjectives).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    projectContext.securityProjectObjectives = '';
    expect(projectContext.securityProjectObjectives).toBe('');

    expect(() => {
      projectContext.securityProjectObjectives = 'project objectives';
    }).toThrow();

    expect(() => {
      projectContext.securityProjectObjectives = 123;
    }).toThrow();
  });

  test('set securityOfficerObjectives', () => {
    projectContext.securityOfficerObjectives = '<p style="color:blue>project description</p>';
    expect(projectContext.securityOfficerObjectives).toBe('<p style="color:blue>project description</p>');

    projectContext.securityOfficerObjectives = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(projectContext.securityOfficerObjectives).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    projectContext.securityOfficerObjectives = '';
    expect(projectContext.securityOfficerObjectives).toBe('');

    expect(() => {
      projectContext.securityOfficerObjectives = 'security officer objectives';
    }).toThrow();

    expect(() => {
      projectContext.securityOfficerObjectives = 123;
    }).toThrow();
  });

  test('set securityAssumptions', () => {
    projectContext.securityAssumptions = '<p style="color:blue>project description</p>';
    expect(projectContext.securityAssumptions).toBe('<p style="color:blue>project description</p>');

    projectContext.securityAssumptions = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(projectContext.securityAssumptions).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    projectContext.securityAssumptions = '';
    expect(projectContext.securityAssumptions).toBe('');

    expect(() => {
      projectContext.securityAssumptions = 'security assumptions';
    }).toThrow();

    expect(() => {
      projectContext.securityAssumptions = 123;
    }).toThrow();
  });

  // get Project Context
  test('get ProjectContext', () => {
    const projcxt = {
      projectDescription: '',
      projectURL: '',
      projectDescriptionAttachment: '',
      securityProjectObjectives: '',
      securityOfficerObjectives: '',
      securityAssumptions: '',
    };

    expect(israProject.israProjectContext.properties).toEqual(projcxt);
  });

  // set Business Asset
  test('set BusinessAsset', () => {
    israProject.addBusinessAsset(businessAsset);
    expect(israProject.getBusinessAsset(1).properties).toEqual({
      businessAssetId: 1,
      businessAssetName: 'Please name Business Asset 1',
      businessAssetType: 'Data',
      businessAssetDescription: '',
      businessAssetProperties: {
        businessAssetAuthenticity: 3,
        businessAssetAuthorization: 3,
        businessAssetAvailability: 3,
        businessAssetConfidentiality: 3,
        businessAssetIntegrity: 3,
        businessAssetNonRepudiation: 3,
      },
    });

    expect(() => {
      israProject.addBusinessAsset({});
    }).toThrow();
  });

  test('set businessAssetId', () => {
    businessAsset.businessAssetId = null;
    expect(businessAsset.businessAssetId).toBe(null);

    businessAsset.businessAssetId = 1;
    expect(businessAsset.businessAssetId).toBe(1);

    expect(() => {
      businessAsset.businessAssetId = '1';
    }).toThrow();

    expect(() => {
      businessAsset.businessAssetId = 0;
    }).toThrow();

    expect(() => {
      businessAsset.businessAssetId = 1.1;
    }).toThrow();
  });

  test('set businessAssetName', () => {
    businessAsset.businessAssetName = 'name';
    expect(businessAsset.businessAssetName).toBe('name');

    businessAsset.businessAssetName = '';
    expect(businessAsset.businessAssetName).toBe('');

    expect(() => {
      businessAsset.businessAssetName = 123;
    }).toThrow();
  });

  test('set businessAssetType', () => {
    const testValues = ['', 'Data', 'Service'];
    testValues.forEach((testValue) => {
      businessAsset.businessAssetType = testValue;
      expect(businessAsset.businessAssetType).toBe(testValue);
    });

    expect(() => {
      businessAsset.businessAssetType = 'Invalid type';
    }).toThrow();

    expect(() => {
      businessAsset.businessAssetType = 123;
    }).toThrow();
  });

  test('set businessAssetDescription', () => {
    businessAsset.businessAssetDescription = '<p style="color:blue>project description</p>';
    expect(businessAsset.businessAssetDescription).toBe('<p style="color:blue>project description</p>');

    businessAsset.businessAssetDescription = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(businessAsset.businessAssetDescription).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    businessAsset.businessAssetDescription = '';
    expect(businessAsset.businessAssetDescription).toBe('');

    expect(() => {
      businessAsset.businessAssetDescription = 'description';
    }).toThrow();

    expect(() => {
      businessAsset.businessAssetDescription = 123;
    }).toThrow();
  });

  test('set businessAssetProperties', () => {
    businessAsset.businessAssetProperties = businessAssetProperties;

    expect(businessAsset.businessAssetProperties.properties).toEqual({
      businessAssetAuthenticity: 3,
      businessAssetAuthorization: 3,
      businessAssetAvailability: 3,
      businessAssetConfidentiality: 3,
      businessAssetIntegrity: 3,
      businessAssetNonRepudiation: 3,
    });

    expect(() => {
      businessAsset.businessAssetProperties = {};
    }).toThrow();
  });

  // set Business Asset Properties
  test('set businessAssetIdRef', () => {
    businessAssetProperties.businessAssetIdRef = null;
    expect(businessAsset
      .businessAssetProperties.businessAssetIdRef).toBe(null);

    businessAssetProperties.businessAssetIdRef = 1;
    expect(businessAsset
      .businessAssetProperties.businessAssetIdRef).toBe(1);

    expect(() => {
      businessAssetProperties.businessAssetIdRef = 0;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetIdRef = '1';
    }).toThrow();
  });

  test('set businessAssetConfidentiality', () => {
    const testValues = [null, 0, 1, 2, 3, 4];
    testValues.forEach((testValue) => {
      businessAssetProperties.businessAssetConfidentiality = testValue;
      expect(businessAssetProperties.businessAssetConfidentiality).toBe(testValue);
    });

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
    const testValues = [null, 0, 1, 2, 3, 4];
    testValues.forEach((testValue) => {
      businessAssetProperties.businessAssetIntegrity = testValue;
      expect(businessAssetProperties.businessAssetIntegrity).toBe(testValue);
    });

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
    const testValues = [null, 0, 1, 2, 3, 4];
    testValues.forEach((testValue) => {
      businessAssetProperties.businessAssetAvailability = testValue;
      expect(businessAssetProperties.businessAssetAvailability).toBe(testValue);
    });

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
    const testValues = [null, 0, 1, 2, 3, 4];
    testValues.forEach((testValue) => {
      businessAssetProperties.businessAssetAuthenticity = testValue;
      expect(businessAssetProperties.businessAssetAuthenticity).toBe(testValue);
    });

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
    const testValues = [null, 0, 1, 2, 3, 4];
    testValues.forEach((testValue) => {
      businessAssetProperties.businessAssetAuthorization = testValue;
      expect(businessAssetProperties.businessAssetAuthorization).toBe(testValue);
    });

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
    const testValues = [null, 0, 1, 2, 3, 4];
    testValues.forEach((testValue) => {
      businessAssetProperties.businessAssetNonRepudiation = testValue;
      expect(businessAssetProperties.businessAssetNonRepudiation).toBe(testValue);
    });

    expect(() => {
      businessAssetProperties.businessAssetNonRepudiation = -1;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetNonRepudiation = 5;
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetNonRepudiation = '2';
    }).toThrow();

    expect(() => {
      businessAssetProperties.businessAssetNonRepudiation = 1.1;
    }).toThrow();
  });

  // get Business Asset and Business Asset Properties
  test('get BusinessAsset', () => {
    const ba = {
      businessAssetId: 1,
      businessAssetName: '',
      businessAssetType: 'Service',
      businessAssetDescription: '',
      businessAssetProperties: {
        businessAssetAuthenticity: 4,
        businessAssetAuthorization: 4,
        businessAssetAvailability: 4,
        businessAssetConfidentiality: 4,
        businessAssetIntegrity: 4,
        businessAssetNonRepudiation: 4,
      },
    };

    expect(israProject.getBusinessAsset(1).properties).toEqual(ba);
  });

  // set and get Supporting Asset Desc
  test('set & get SupportingAssetsDesc', () => {
    israProject.supportingAssetsDesc = '<p style="color:blue>project description</p>';
    expect(israProject.supportingAssetsDesc).toBe('<p style="color:blue>project description</p>');

    israProject.supportingAssetsDesc = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(israProject.supportingAssetsDesc).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    israProject.supportingAssetsDesc = '';
    expect(israProject.supportingAssetsDesc).toBe('');

    expect(() => {
      israProject.supportingAssetsDesc = 'description';
    }).toThrow();

    expect(() => {
      israProject.supportingAssetsDesc = 123;
    }).toThrow();
  });

  // set Supporting Asset
  test('set SupportingAsset', () => {
    israProject.addSupportingAsset(supportingAsset);
    expect(israProject.getSupportingAsset(1).properties).toEqual({
      supportingAssetId: 1,
      supportingAssetHLDId: '',
      supportingAssetName: 'Please name Supporting Asset 1',
      supportingAssetType: '',
      supportingAssetSecurityLevel: -1,
      businessAssetRef: [],
    });

    expect(() => {
      israProject.addSupportingAsset({});
    }).toThrow();
  });

  test('set supportingAssetId', () => {
    supportingAsset.supportingAssetId = null;
    expect(supportingAsset.supportingAssetId).toBe(null);

    supportingAsset.supportingAssetId = 1;
    expect(supportingAsset.supportingAssetId).toBe(1);

    expect(() => {
      supportingAsset.supportingAssetId = '1';
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetId = 0;
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetId = 1.1;
    }).toThrow();
  });

  test('set supportingAssetHLDId', () => {
    supportingAsset.supportingAssetHLDId = '1';
    expect(supportingAsset.supportingAssetHLDId).toBe('1');

    supportingAsset.supportingAssetHLDId = '';
    expect(supportingAsset.supportingAssetHLDId).toBe('');

    expect(() => {
      supportingAsset.supportingAssetHLDId = 1;
    }).toThrow();
  });

  test('set supportingAssetName', () => {
    supportingAsset.supportingAssetName = 'name';
    expect(supportingAsset.supportingAssetName).toBe('name');

    supportingAsset.supportingAssetName = '';
    expect(supportingAsset.supportingAssetName).toBe('');

    expect(() => {
      supportingAsset.supportingAssetName = 123;
    }).toThrow();
  });

  test('set supportingAssetType', () => {
    const testValues = ['', 'Database', 'Operating System', 'Application Server', 'Application module', 'File', 'Log', 'Web Service',
      'Web User Interface', 'Remote API', 'Local API', 'Crypto-Key', 'Software application', 'Service Provider', 'Hardware device',
      'Computer', 'Human', 'Network', 'Server', 'Source code', 'Organization', 'Location', 'Process', 'Interface'];

    testValues.forEach((testValue) => {
      supportingAsset.supportingAssetType = testValue;
      expect(supportingAsset.supportingAssetType).toBe(testValue);
    });

    expect(() => {
      supportingAsset.supportingAssetType = 'Invalid type';
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetType = 123;
    }).toThrow();
  });

  test('set supportingAssetSecurityLevel', () => {
    const testValues = [null, -2, -1, 0, 1, 2];
    testValues.forEach((testValue) => {
      supportingAsset.supportingAssetSecurityLevel = testValue;
      expect(supportingAsset.supportingAssetSecurityLevel).toBe(testValue);
    });

    expect(() => {
      supportingAsset.supportingAssetSecurityLevel = -3;
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetSecurityLevel = 4;
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetSecurityLevel = '2';
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetSecurityLevel = 1.1;
    }).toThrow();
  });

  test('set businessAssetRef', () => {
    supportingAsset.addBusinessAssetRef(1);
    expect(supportingAsset.properties.businessAssetRef.includes(1)).toBe(true);

    expect(() => {
      supportingAsset.addBusinessAssetRef('1');
    }).toThrow();
  });

  // get Supporting Asset
  test('get SupportingAsset', () => {
    const sa = {
      supportingAssetId: 1,
      supportingAssetHLDId: '',
      supportingAssetName: '',
      supportingAssetType: 'Interface',
      supportingAssetSecurityLevel: 2,
      businessAssetRef: [1],
    };

    expect(israProject.getSupportingAsset(1).properties).toEqual(sa);
  });

  // set Risk
  test('set Risk', () => {
    israProject.addRisk(risk);
    expect(israProject.getRisk(1).properties).toEqual({
      riskId: 1,
      projectName: '',
      projectVersion: '',
      riskName: 'As a , I can  the  compromising the  in order to ',
      threatAgent: '',
      threatAgentDetail: '',
      threatVerb: '',
      threatVerbDetail: '',
      motivation: '',
      motivationDetail: '',
      businessAssetRef: null,
      supportingAssetRef: null,
      isAutomaticRiskName: true,
      riskLikelihood: {
        riskLikelihood: 3,
        riskLikelihoodDetail: '',
        skillLevel: null,
        reward: null,
        accessResources: null,
        size: null,
        intrusionDetection: null,
        threatFactorScore: null,
        threatFactorLevel: '',
        occurrence: null,
        occurrenceLevel: '',
        isOWASPLikelihood: true
      },
      riskImpact: {
        riskImpact: null,
        businessAssetConfidentialityFlag: 1,
        businessAssetIntegrityFlag: 1,
        businessAssetAvailabilityFlag: 1,
        businessAssetAuthenticityFlag: 1,
        businessAssetAuthorizationFlag: 1,
        businessAssetNonRepudiationFlag: 1,
      },
      riskAttackPaths: [],
      allAttackPathsName: '',
      allAttackPathsScore: null,
      inherentRiskScore: 0,
      riskMitigation: [],
      mitigationsBenefits: 1,
      mitigationsDoneBenefits: 1,
      mitigatedRiskScore: 0,
      riskManagementDecision: '',
      riskManagementDetail: '',
      residualRiskScore: 0,
      residualRiskLevel: 'Low',
    });

    expect(() => {
      israProject.addRisk({});
    }).toThrow();
  });

  test('set riskId', () => {
    risk.riskId = null;
    expect(risk.riskId).toBe(null);

    risk.riskId = 1;
    expect(risk.riskId).toBe(1);

    expect(() => {
      risk.riskId = '1';
    }).toThrow();

    expect(() => {
      risk.riskId = 0;
    }).toThrow();

    expect(() => {
      risk.riskId = 1.1;
    }).toThrow();
  });

  test('set projectName', () => {
    risk.projectName = 'name';
    expect(risk.projectName).toBe('name');

    risk.projectName = '';
    expect(risk.projectName).toBe('');

    expect(() => {
      risk.projectName = 123;
    }).toThrow();
  });

  test('set projectVersion', () => {
    risk.projectVersion = 'version';
    expect(risk.projectVersion).toBe('version');

    risk.projectVersion = '';
    expect(risk.projectVersion).toBe('');

    expect(() => {
      risk.projectVersion = 123;
    }).toThrow();
  });

  test('set allAttackPathsName', () => {
    risk.allAttackPathsName = 'pathsName';
    expect(risk.allAttackPathsName).toBe('pathsName');

    risk.allAttackPathsName = '';
    expect(risk.allAttackPathsName).toBe('');

    expect(() => {
      risk.allAttackPathsName = 123;
    }).toThrow();
  });

  test('set allAttackPathsScore', () => {
    risk.allAttackPathsScore = null;
    expect(risk.allAttackPathsScore).toBe(null);

    risk.allAttackPathsScore = 10;
    expect(risk.allAttackPathsScore).toBe(10);

    risk.allAttackPathsScore = 0;
    expect(risk.allAttackPathsScore).toBe(0);

    risk.allAttackPathsScore = 10.1;
    expect(risk.allAttackPathsScore).toBe(10.1);

    risk.allAttackPathsScore = -0.1;
    expect(risk.allAttackPathsScore).toBe(-0.1);

    expect(() => {
      risk.allAttackPathsScore = '5.5';
    }).toThrow();

    expect(() => {
      risk.allAttackPathsScore = NaN;
    }).toThrow();
  });

  test('set inherentRiskScore', () => {
    risk.inherentRiskScore = null;
    expect(risk.inherentRiskScore).toBe(null);

    risk.inherentRiskScore = 0;
    expect(risk.inherentRiskScore).toBe(0);

    expect(() => {
      risk.inherentRiskScore = -1;
    }).toThrow();

    expect(() => {
      risk.inherentRiskScore = '1';
    }).toThrow();

    expect(() => {
      risk.inherentRiskScore = NaN;
    }).toThrow();
  });

  test('set mitigationsBenefits', () => {
    risk.mitigationsBenefits = null;
    expect(risk.mitigationsBenefits).toBe(null);

    risk.mitigationsBenefits = 11.1;
    expect(risk.mitigationsBenefits).toBe(11.1);

    expect(() => {
      risk.mitigationsBenefits = '10';
    }).toThrow();
  });

  test('set mitigationsDoneBenefits', () => {
    risk.mitigationsDoneBenefits = null;
    expect(risk.mitigationsDoneBenefits).toBe(null);

    risk.mitigationsDoneBenefits = 11.1;
    expect(risk.mitigationsDoneBenefits).toBe(11.1);

    expect(() => {
      risk.mitigationsDoneBenefits = '10';
    }).toThrow();
  });

  test('set mitigatedRiskScore', () => {
    risk.mitigatedRiskScore = null;
    expect(risk.mitigatedRiskScore).toBe(null);

    risk.mitigatedRiskScore = 0;
    expect(risk.mitigatedRiskScore).toBe(0);

    expect(() => {
      risk.mitigatedRiskScore = -1;
    }).toThrow();

    expect(() => {
      risk.mitigatedRiskScore = '1';
    }).toThrow();

    expect(() => {
      risk.mitigatedRiskScore = 1.1;
    }).toThrow();
  });

  test('set riskManagementDecision', () => {
    const testValues = ['', 'Discarded', 'Avoid', 'Transfer', 'Mitigate', 'Accept'];

    testValues.forEach((testValue) => {
      risk.riskManagementDecision = testValue;
      expect(risk.riskManagementDecision).toBe(testValue);
    });

    expect(() => {
      risk.riskManagementDecision = 'Invalid decision';
    }).toThrow();

    expect(() => {
      risk.riskManagementDecision = 123;
    }).toThrow();
  });

  test('set riskManagementDetail', () => {
    risk.riskManagementDetail = '<p style="color:blue>project description</p>';
    expect(risk.riskManagementDetail).toBe('<p style="color:blue>project description</p>');

    risk.riskManagementDetail = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(risk.riskManagementDetail).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    risk.riskManagementDetail = '';
    expect(risk.riskManagementDetail).toBe('');

    expect(() => {
      risk.riskManagementDetail = 'detail';
    }).toThrow();

    expect(() => {
      risk.riskManagementDetail = 123;
    }).toThrow();
  });

  test('set residualRiskScore', () => {
    risk.residualRiskScore = null;
    expect(risk.residualRiskScore).toBe(null);

    risk.residualRiskScore = 10;
    expect(risk.residualRiskScore).toBe(10);

    expect(() => {
      risk.residualRiskScore = '10';
    }).toThrow();

    expect(() => {
      risk.residualRiskScore = 11.1;
    }).toThrow();
  });

  test('set residualRiskLevel', () => {
    const testValues = ['', 'Low', 'Medium', 'High', 'Critical'];

    testValues.forEach((testValue) => {
      risk.residualRiskLevel = testValue;
      expect(risk.residualRiskLevel).toBe(testValue);
    });

    expect(() => {
      risk.residualRiskLevel = 'Invalid level';
    }).toThrow();

    expect(() => {
      risk.residualRiskLevel = 123;
    }).toThrow();
  });

  // Risk Likelihood
  test('set riskLikelihood', () => {
    risk.riskLikelihood = new RiskLikelihood();
    expect(risk.riskLikelihood.properties).toEqual({
      riskLikelihood: 3,
      riskLikelihoodDetail: '',
      skillLevel: null,
      reward: null,
      accessResources: null,
      size: null,
      intrusionDetection: null,
      threatFactorScore: null,
      threatFactorLevel: '',
      occurrence: null,
      occurrenceLevel: '',
      isOWASPLikelihood: true
    });

    expect(() => {
      risk.riskLikelihood = {};
    }).toThrow();

    risk.riskLikelihood = riskLikelihood;
  });

  test('set riskIdRef', () => {
    riskLikelihood.riskIdRef = null;
    expect(riskLikelihood.riskIdRef).toBe(null);

    riskLikelihood.riskIdRef = 1;
    expect(riskLikelihood.riskIdRef).toBe(1);

    expect(() => {
      riskLikelihood.riskIdRef = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskLikelihood', () => {
    const testValues = [null, 1, 2, 3, 4];
    testValues.forEach((testValue) => {
      riskLikelihood.riskLikelihood = testValue;
      expect(riskLikelihood.riskLikelihood).toBe(testValue);
    });

    expect(() => {
      riskLikelihood.riskLikelihood = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.riskLikelihood = 5;
    }).toThrow();

    expect(() => {
      riskLikelihood.riskLikelihood = '1';
    }).toThrow();
  });

  test('set riskLikelihoodDetail', () => {
    riskLikelihood.riskLikelihoodDetail = '<p style="color:blue>project description</p>';
    expect(riskLikelihood.riskLikelihoodDetail).toBe('<p style="color:blue>project description</p>');

    riskLikelihood.riskLikelihoodDetail = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(riskLikelihood.riskLikelihoodDetail).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    riskLikelihood.riskLikelihoodDetail = '';
    expect(riskLikelihood.riskLikelihoodDetail).toBe('');

    expect(() => {
      riskLikelihood.riskLikelihoodDetail = 123;
    }).toThrow();
  });

  test('set skillLevel', () => {
    const testValues = [null, 1, 3, 5, 6, 9];
    testValues.forEach((testValue) => {
      riskLikelihood.skillLevel = testValue;
      expect(riskLikelihood.skillLevel).toBe(testValue);
    });

    expect(() => {
      riskLikelihood.skillLevel = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.skillLevel = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.skillLevel = '1';
    }).toThrow();
  });

  test('set reward', () => {
    const testValues = [null, 1, 4, 9];
    testValues.forEach((testValue) => {
      riskLikelihood.reward = testValue;
      expect(riskLikelihood.reward).toBe(testValue);
    });

    expect(() => {
      riskLikelihood.reward = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.reward = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.reward = '1';
    }).toThrow();
  });

  test('set accessResources', () => {
    const testValues = [null, 0, 4, 7, 9];
    testValues.forEach((testValue) => {
      riskLikelihood.accessResources = testValue;
      expect(riskLikelihood.accessResources).toBe(testValue);
    });

    expect(() => {
      riskLikelihood.accessResources = 1;
    }).toThrow();

    expect(() => {
      riskLikelihood.accessResources = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.accessResources = '0';
    }).toThrow();
  });

  test('set size', () => {
    const testValues = [null, 2, 4, 5, 6, 9];
    testValues.forEach((testValue) => {
      riskLikelihood.size = testValue;
      expect(riskLikelihood.size).toBe(testValue);
    });

    expect(() => {
      riskLikelihood.size = 1;
    }).toThrow();

    expect(() => {
      riskLikelihood.size = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.size = '2';
    }).toThrow();
  });

  test('set intrusionDetection', () => {
    const testValues = [null, 1, 3, 8, 9];
    testValues.forEach((testValue) => {
      riskLikelihood.intrusionDetection = testValue;
      expect(riskLikelihood.intrusionDetection).toBe(testValue);
    });

    expect(() => {
      riskLikelihood.intrusionDetection = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.intrusionDetection = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.intrusionDetection = '1';
    }).toThrow();
  });

  test('set threatFactorScore', () => {
    riskLikelihood.threatFactorScore = null;
    expect(riskLikelihood.threatFactorScore).toBe(null);

    riskLikelihood.threatFactorScore = 5.8;
    expect(riskLikelihood.threatFactorScore).toBe(5.8);

    expect(() => {
      riskLikelihood.threatFactorScore = '5.8';
    }).toThrow();
  });

  test('set threatFactorLevel', () => {
    const testValues = ['', 'Low', 'Medium', 'High', 'Very High'];
    testValues.forEach((testValue) => {
      riskLikelihood.threatFactorLevel = testValue;
      expect(riskLikelihood.threatFactorLevel).toBe(testValue);
    });

    expect(() => {
      riskLikelihood.threatFactorLevel = 'Invalid level';
    }).toThrow();

    expect(() => {
      riskLikelihood.threatFactorLevel = 123;
    }).toThrow();
  });

  test('set occurrence', () => {
    const testValues = [null, 1, 3, 5, 7, 9];
    testValues.forEach((testValue) => {
      riskLikelihood.occurrence = testValue;
      expect(riskLikelihood.occurrence).toBe(testValue);
    });

    expect(() => {
      riskLikelihood.occurrence = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.occurrence = 10;
    }).toThrow();

    expect(() => {
      riskLikelihood.occurrence = 'string';
    }).toThrow();
  });

  test('set occurrenceLevel', () => {
    const testValues = ['', 'Low', 'Medium', 'High', 'Very High'];
    testValues.forEach((testValue) => {
      riskLikelihood.occurrenceLevel = testValue;
      expect(riskLikelihood.occurrenceLevel).toBe(testValue);
    });

    expect(() => {
      riskLikelihood.occurrenceLevel = 'Invalid level';
    }).toThrow();

    expect(() => {
      riskLikelihood.occurrenceLevel = 123;
    }).toThrow();
  });

  test('set isOWASPLikelihood', () => {
    riskLikelihood.isOWASPLikelihood = false;
    expect(riskLikelihood.isOWASPLikelihood).toBe(false);

    riskLikelihood.isOWASPLikelihood = true;
    expect(riskLikelihood.isOWASPLikelihood).toBe(true);

    expect(() => {
      riskLikelihood.isOWASPLikelihood = 0;
    }).toThrow();

    expect(() => {
      riskLikelihood.isOWASPLikelihood = '1';
    }).toThrow();
  });

  // Risk Impact
  test('set riskImpact', () => {
    risk.riskImpact = new RiskImpact();
    expect(risk.riskImpact.properties).toEqual({
      riskImpact: null,
      businessAssetConfidentialityFlag: 1,
      businessAssetIntegrityFlag: 1,
      businessAssetAvailabilityFlag: 1,
      businessAssetAuthenticityFlag: 1,
      businessAssetAuthorizationFlag: 1,
      businessAssetNonRepudiationFlag: 1,
    });

    expect(() => {
      risk.riskImpact = {};
    }).toThrow();

    risk.riskImpact = riskImpact;
  });

  test('set riskIdRef', () => {
    riskImpact.riskIdRef = null;
    expect(riskImpact.riskIdRef).toBe(null);

    riskImpact.riskIdRef = 1;
    expect(riskImpact.riskIdRef).toBe(1);

    expect(() => {
      riskImpact.riskIdRef = 0;
    }).toThrow();

    expect(() => {
      riskImpact.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskImpact', () => {
    riskImpact.riskImpact = null;
    expect(riskImpact.riskImpact).toBe(null);

    riskImpact.riskImpact = 1;
    expect(riskImpact.riskImpact).toBe(1);

    expect(() => {
      riskImpact.riskImpact = 1.1;
    }).toThrow();
  });

  test('set businessAssetConfidentialityFlag', () => {
    const testValues = [null, 0, 1];
    testValues.forEach((testValue) => {
      riskImpact.businessAssetConfidentialityFlag = testValue;
      expect(riskImpact.businessAssetConfidentialityFlag).toBe(testValue);
    });

    expect(() => {
      riskImpact.businessAssetConfidentialityFlag = -1;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetConfidentialityFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetConfidentialityFlag = '0';
    }).toThrow();
  });

  test('set businessAssetIntegrityFlag', () => {
    const testValues = [null, 0, 1];
    testValues.forEach((testValue) => {
      riskImpact.businessAssetIntegrityFlag = testValue;
      expect(riskImpact.businessAssetIntegrityFlag).toBe(testValue);
    });

    expect(() => {
      riskImpact.businessAssetIntegrityFlag = -1;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetIntegrityFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetIntegrityFlag = '0';
    }).toThrow();
  });

  test('set businessAssetAvailabilityFlag', () => {
    const testValues = [null, 0, 1];
    testValues.forEach((testValue) => {
      riskImpact.businessAssetAvailabilityFlag = testValue;
      expect(riskImpact.businessAssetAvailabilityFlag).toBe(testValue);
    });

    expect(() => {
      riskImpact.businessAssetAvailabilityFlag = -1;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetAvailabilityFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetAvailabilityFlag = '0';
    }).toThrow();
  });

  test('set businessAssetAuthenticityFlag', () => {
    const testValues = [null, 0, 1];
    testValues.forEach((testValue) => {
      riskImpact.businessAssetAuthenticityFlag = testValue;
      expect(riskImpact.businessAssetAuthenticityFlag).toBe(testValue);
    });

    expect(() => {
      riskImpact.businessAssetAuthenticityFlag = -1;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetAuthenticityFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetAuthenticityFlag = '0';
    }).toThrow();
  });

  test('set businessAssetAuthorizationFlag', () => {
    const testValues = [null, 0, 1];
    testValues.forEach((testValue) => {
      riskImpact.businessAssetAuthorizationFlag = testValue;
      expect(riskImpact.businessAssetAuthorizationFlag).toBe(testValue);
    });

    expect(() => {
      riskImpact.businessAssetAuthorizationFlag = -1;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetAuthorizationFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetAuthorizationFlag = '0';
    }).toThrow();
  });

  test('set businessAssetNonRepudiationFlag', () => {
    const testValues = [null, 0, 1];
    testValues.forEach((testValue) => {
      riskImpact.businessAssetNonRepudiationFlag = testValue;
      expect(riskImpact.businessAssetNonRepudiationFlag).toBe(testValue);
    });

    expect(() => {
      riskImpact.businessAssetNonRepudiationFlag = -1;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetNonRepudiationFlag = 2;
    }).toThrow();

    expect(() => {
      riskImpact.businessAssetNonRepudiationFlag = '0';
    }).toThrow();
  });

  // set Risk Attack Path
  test('set RiskAttackPaths', () => {
    risk.addRiskAttackPath(riskAttackPath);
    expect(risk.getRiskAttackPath(1).properties).toEqual({
      riskAttackPathId: 1,
      vulnerabilityRef: [],
      attackPathName: '',
      attackPathScore: null,
    });

    expect(() => {
      risk.addRiskAttackPath({});
    }).toThrow();
  });

  test('set riskIdRef', () => {
    riskAttackPath.riskIdRef = null;
    expect(riskAttackPath.riskIdRef).toBe(null);

    riskAttackPath.riskIdRef = 1;
    expect(riskAttackPath.riskIdRef).toBe(1);

    expect(() => {
      riskAttackPath.riskIdRef = 0;
    }).toThrow();

    expect(() => {
      riskAttackPath.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskAttackPathId', () => {
    riskAttackPath.riskAttackPathId = null;
    expect(riskAttackPath.riskAttackPathId).toBe(null);

    riskAttackPath.riskAttackPathId = 1;
    expect(riskAttackPath.riskAttackPathId).toBe(1);

    expect(() => {
      riskAttackPath.riskAttackPathId = 0;
    }).toThrow();

    expect(() => {
      riskAttackPath.riskAttackPathId = '1';
    }).toThrow();
  });

  test('set attackPathName', () => {
    riskAttackPath.attackPathName = 'name';
    expect(riskAttackPath.attackPathName).toBe('name');

    riskAttackPath.attackPathName = '';
    expect(riskAttackPath.attackPathName).toBe('');

    expect(() => {
      riskAttackPath.attackPathName = 123;
    }).toThrow();
  });

  test('set attackPathScore', () => {
    riskAttackPath.attackPathScore = null;
    expect(riskAttackPath.attackPathScore).toBe(null);

    riskAttackPath.attackPathScore = 0;
    expect(riskAttackPath.attackPathScore).toBe(0);

    riskAttackPath.attackPathScore = 10;
    expect(riskAttackPath.attackPathScore).toBe(10);

    riskAttackPath.attackPathScore = -0.1;
    expect(riskAttackPath.attackPathScore).toBe(-0.1);

    riskAttackPath.attackPathScore = 10.1;
    expect(riskAttackPath.attackPathScore).toBe(10.1);

    expect(() => {
      riskAttackPath.attackPathScore = '0';
    }).toThrow();
  });

  // set Risk Mitigation
  test('set riskMitigation', () => {
    risk.addRiskMitigation(riskMitigation);
    expect(risk.getRiskMitigation(1).properties).toEqual({
      riskMitigationId: 1,
      description: '',
      benefits: null,
      cost: null,
      decision: '',
      decisionDetail: '',
    });

    expect(() => {
      risk.addRiskMitigation({});
    }).toThrow();
  });

  test('set riskIdRef', () => {
    riskMitigation.riskIdRef = null;
    expect(riskMitigation.riskIdRef).toBe(null);

    riskMitigation.riskIdRef = 1;
    expect(riskMitigation.riskIdRef).toBe(1);

    expect(() => {
      riskMitigation.riskIdRef = 0;
    }).toThrow();

    expect(() => {
      riskMitigation.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskMitigationId', () => {
    riskMitigation.riskMitigationId = null;
    expect(riskMitigation.riskMitigationId).toBe(null);

    riskMitigation.riskMitigationId = 1;
    expect(riskMitigation.riskMitigationId).toBe(1);

    expect(() => {
      riskMitigation.riskMitigationId = 0;
    }).toThrow();

    expect(() => {
      riskMitigation.riskMitigationId = '1';
    }).toThrow();
  });

  test('set description', () => {
    riskMitigation.description = '<p style="color:blue>project description</p>';
    expect(riskMitigation.description).toBe('<p style="color:blue>project description</p>');

    riskMitigation.description = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(riskMitigation.description).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    riskMitigation.description = '';
    expect(riskMitigation.description).toBe('');

    expect(() => {
      riskMitigation.description = 123;
    }).toThrow();
  });

  test('set benefits', () => {
    const testValues = [null, 0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];
    testValues.forEach((testValue) => {
      riskMitigation.benefits = testValue;
      expect(riskMitigation.benefits).toBe(testValue);
    });

    expect(() => {
      riskMitigation.benefits = '0';
    }).toThrow();

    expect(() => {
      riskMitigation.benefits = -0.1;
    }).toThrow();

    expect(() => {
      riskMitigation.benefits = 1.1;
    }).toThrow();
  });

  test('set cost', () => {
    riskMitigation.cost = null;
    expect(riskMitigation.cost).toBe(null);

    riskMitigation.cost = 10.1;
    expect(riskMitigation.cost).toBe(10.1);

    riskMitigation.cost = 123;
    expect(riskMitigation.cost).toBe(123);

    expect(() => {
      riskMitigation.cost = '10';
    }).toThrow();
  });

  test('set decision', () => {
    const testValues = ['', 'Rejected', 'Accepted', 'Postponed', 'Done'];
    testValues.forEach((testValue) => {
      riskMitigation.decision = testValue;
      expect(riskMitigation.decision).toBe(testValue);
    });

    expect(() => {
      riskMitigation.decision = 'Invalid decision';
    }).toThrow();

    expect(() => {
      riskMitigation.decision = 123;
    }).toThrow();
  });

  test('set decisionDetail', () => {
    riskMitigation.decisionDetail = '<p style="color:blue>project description</p>';
    expect(riskMitigation.decisionDetail).toBe('<p style="color:blue>project description</p>');

    riskMitigation.decisionDetail = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(riskMitigation.decisionDetail).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    riskMitigation.decisionDetail = '';
    expect(riskMitigation.decisionDetail).toBe('');

    expect(() => {
      riskMitigation.decisionDetail = 123;
    }).toThrow();
  });

  // set Vulnerability
  test('set Vulnerability', () => {
    israProject.addVulnerability(vulnerability);
    expect(israProject.getVulnerability(1).properties).toEqual({
      projectName: '',
      projectVersion: '',
      vulnerabilityId: 1,
      vulnerabilityName: 'Please name Vulnerability 1',
      vulnerabilityFamily: '',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: '',
      cveScore: 0,
      overallScore: 0,
      overallLevel: 'Low',
      supportingAssetRef: [],
    });

    expect(() => {
      israProject.addVulnerability({});
    }).toThrow();
  });

  test('set projectName', () => {
    vulnerability.projectName = 'name';
    expect(vulnerability.projectName).toBe('name');

    vulnerability.projectName = '';
    expect(vulnerability.projectName).toBe('');

    expect(() => {
      vulnerability.projectName = 123;
    }).toThrow();
  });

  test('set projectVersionRef', () => {
    vulnerability.projectVersion = 'version';
    expect(vulnerability.projectVersion).toBe('version');

    vulnerability.projectVersion = '';
    expect(vulnerability.projectVersion).toBe('');

    expect(() => {
      vulnerability.projectVersion = 123;
    }).toThrow();
  });

  test('set vulnerabilityId', () => {
    vulnerability.vulnerabilityId = null;
    expect(vulnerability.vulnerabilityId).toBe(null);

    vulnerability.vulnerabilityId = 1;
    expect(vulnerability.vulnerabilityId).toBe(1);

    expect(() => {
      vulnerability.vulnerabilityId = 0;
    }).toThrow();

    expect(() => {
      vulnerability.vulnerabilityId = '1';
    }).toThrow();
  });

  test('set vulnerabilityName', () => {
    vulnerability.vulnerabilityName = 'name';
    expect(vulnerability.vulnerabilityName).toBe('name');

    vulnerability.vulnerabilityName = '';
    expect(vulnerability.vulnerabilityName).toBe('');

    expect(() => {
      vulnerability.vulnerabilityName = 123;
    }).toThrow();
  });

  test('set vulnerabilityFamily', () => {
    const testValues = ['', 'API Abuse', 'Authentication Vulnerability', 'Authorization Vulnerability',
      'Availability Vulnerability', 'Code Permission Vulnerability', 'Code Quality Vulnerability',
      'Configuration Vulnerability', 'Cryptographic Vulnerability', 'Encoding Vulnerability',
      'Environmental Vulnerability', 'Error Handling Vulnerability', 'General Logic Error Vulnerability',
      'Input Validation Vulnerability', 'Logging and Auditing Vulnerability', 'Password Management Vulnerability',
      'Path Vulnerability', 'Protocol Errors', 'Range and Type Error Vulnerability', 'Sensitive Data Protection Vulnerability',
      'Session Management Vulnerability', 'Synchronization and Timing Vulnerability', 'Unsafe Mobile Code', 'Use of Dangerous API'];

    testValues.forEach((testValue) => {
      vulnerability.vulnerabilityFamily = testValue;
      expect(vulnerability.vulnerabilityFamily).toBe(testValue);
    });

    expect(() => {
      vulnerability.vulnerabilityFamily = 'Invalid family';
    }).toThrow();

    expect(() => {
      vulnerability.vulnerabilityFamily = 123;
    }).toThrow();
  });

  test('set vulnerabilityTrackingID', () => {
    vulnerability.vulnerabilityTrackingID = 'id';
    expect(vulnerability.vulnerabilityTrackingID).toBe('id');

    vulnerability.vulnerabilityTrackingID = '';
    expect(vulnerability.vulnerabilityTrackingID).toBe('');

    expect(() => {
      vulnerability.vulnerabilityTrackingID = 123;
    }).toThrow();
  });

  test('set vulnerabilityTrackingURI', () => {
    vulnerability.vulnerabilityTrackingURI = 'https://www.google.com';
    expect(vulnerability.vulnerabilityTrackingURI).toBe('https://www.google.com');

    vulnerability.vulnerabilityTrackingURI = 'ftp://server.example/pathname';
    expect(vulnerability.vulnerabilityTrackingURI).toBe('ftp://server.example/pathname');

    vulnerability.vulnerabilityTrackingURI = 'mailto:username@thalesgroup.com';
    expect(vulnerability.vulnerabilityTrackingURI).toBe('mailto:username@thalesgroup.com');

    vulnerability.vulnerabilityTrackingURI = '';
    expect(vulnerability.vulnerabilityTrackingURI).toBe('');

    const testValues = ['https://', 'htpp://', 'ftp://', 'mailto:', 'ftp://server/', 'www.google.com', 'mailto:invalidEmail'];

    testValues.forEach((testValue) => {
      expect(() => {
        vulnerability.vulnerabilityTrackingURI = testValue;
      }).toThrow();
    });
  });

  test('set vulnerabilityDescription', () => {
    vulnerability.vulnerabilityDescription = '<p style="color:blue>project description</p>';
    expect(vulnerability.vulnerabilityDescription).toBe('<p style="color:blue>project description</p>');

    vulnerability.vulnerabilityDescription = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(vulnerability.vulnerabilityDescription).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    vulnerability.vulnerabilityDescription = '';
    expect(vulnerability.vulnerabilityDescription).toBe('');

    expect(() => {
      vulnerability.vulnerabilityDescription = 123;
    }).toThrow();
  });

  test('set vulnerabilityDescriptionAttachment', () => {
    vulnerability.vulnerabilityDescriptionAttachment = 'YWJjZA==';
    expect(vulnerability.vulnerabilityDescriptionAttachment).toBe('YWJjZA==');

    vulnerability.vulnerabilityDescriptionAttachment = '';
    expect(vulnerability.vulnerabilityDescriptionAttachment).toBe('');

    expect(() => {
      vulnerability.vulnerabilityDescriptionAttachment = 123;
    }).toThrow();

    /* expect(() => {
      vulnerability.vulnerabilityDescriptionAttachment = 'nkjh8whNknj';
    }).toThrow(); */
  });

  test('set vulnerabilityCVE', () => {
    const testValues = [
      '',
      'CVSS:3.0/AV:N/AC:L/PR:H/UI:N/S:U/C:L/I:L/A:N/E:X/RL:O/RC:X',
      'CVSS:3.1/AV:N/AC:L/PR:H/UI:N/S:U/C:L/I:L/A:N',
      'CVSS:2.0/AV:N/AC:M/Au:N/C:N/I:P/A:C/E:U/RL:TF/RC:UR',
      'CVSS:2.0/AV:N/AC:M/Au:N/C:N/I:P/A:C',
    ];

    testValues.forEach((testValue) => {
      vulnerability.vulnerabilityCVE = testValue;
      expect(vulnerability.vulnerabilityCVE).toBe(testValue);
    });

    /* expect(() => {
      vulnerability.vulnerabilityCVE = 'Invalid cve';
    }).toThrow(); */

    /* expect(() => {
      vulnerability.vulnerabilityCVE = 'CVSS:3.0/AV:N';
    }).toThrow(); */
  });

  test('set cveScore', () => {
    vulnerability.cveScore = null;
    expect(vulnerability.cveScore).toBe(null);

    vulnerability.cveScore = -0.1;
    expect(vulnerability.cveScore).toBe(-0.1);

    vulnerability.cveScore = 10.1;
    expect(vulnerability.cveScore).toBe(10.1);

    vulnerability.cveScore = 0;
    expect(vulnerability.cveScore).toBe(0);

    vulnerability.cveScore = 10;
    expect(vulnerability.cveScore).toBe(10);

    expect(() => {
      vulnerability.cveScore = '0';
    }).toThrow();
  });

  test('set overallScore', () => {
    vulnerability.overallScore = null;
    expect(vulnerability.overallScore).toBe(null);

    vulnerability.overallScore = -0.1;
    expect(vulnerability.overallScore).toBe(-0.1);

    vulnerability.overallScore = 10.1;
    expect(vulnerability.overallScore).toBe(10.1);

    vulnerability.overallScore = 0;
    expect(vulnerability.overallScore).toBe(0);

    vulnerability.overallScore = 10;
    expect(vulnerability.overallScore).toBe(10);

    expect(() => {
      vulnerability.overallScore = '0';
    }).toThrow();
  });

  test('set overallLevel', () => {
    const testValues = ['None', 'Low', 'Medium', 'High', 'Critical'];

    testValues.forEach((testValue) => {
      vulnerability.overallLevel = testValue;
      expect(vulnerability.overallLevel).toBe(testValue);
    });

    expect(() => {
      vulnerability.overallLevel = 'Invalid level';
    }).toThrow();

    expect(() => {
      vulnerability.overallLevel = 123;
    }).toThrow();
  });

  test('set supportingAssetRef', () => {
    vulnerability.addSupportingAssetRef(1);
    expect(vulnerability.properties.supportingAssetRef.includes(1)).toBe(true);

    expect(() => {
      vulnerability.addSupportingAssetRef('1');
    }).toThrow();
  });

  test('set vulnerabilityRef', () => {
    riskAttackPath.addVulnerability({
      score: israProject.getVulnerability(1).overallScore,
      name: israProject.getVulnerability(1).vulnerabilityName,
      vulnerabilityId: israProject.getVulnerability(1).vulnerabilityId,
    });
    expect(israProject.getRisk(1).getRiskAttackPath(1).getVulnerability(1)).toEqual({
      score: 10,
      name: '',
      vulnerabilityId: 1
    });

    expect(() => {
      riskAttackPath.addVulnerability({});
    }).toThrow();
  });

  test('get Risk', () => {
    const r = {
      riskId: 1,
      projectName: '',
      projectVersion: '',
      allAttackPathsName: '',
      allAttackPathsScore: -0.1,
      inherentRiskScore: 0,
      mitigatedRiskScore: 0,
      riskManagementDecision: 'Accept',
      riskManagementDetail: '',
      residualRiskScore: 10,
      residualRiskLevel: 'Critical',
      mitigationsBenefits: 11.1,
      mitigationsDoneBenefits: 11.1,
      riskName: 'As a , I can  the  compromising the  in order to ',
      threatAgent: '',
      threatAgentDetail: '',
      threatVerb: '',
      threatVerbDetail: '',
      motivation: '',
      motivationDetail: '',
      businessAssetRef: null,
      supportingAssetRef: null,
      isAutomaticRiskName: true,
      riskLikelihood: {
        riskLikelihood: 4,
        riskLikelihoodDetail: '',
        skillLevel: 9,
        reward: 9,
        accessResources: 9,
        size: 9,
        intrusionDetection: 9,
        threatFactorScore: 5.8,
        threatFactorLevel: 'Very High',
        occurrence: 9,
        occurrenceLevel: 'Very High',
        isOWASPLikelihood: true
      },
      riskImpact: {
        riskImpact: 1,
        businessAssetConfidentialityFlag: 1,
        businessAssetIntegrityFlag: 1,
        businessAssetAvailabilityFlag: 1,
        businessAssetAuthenticityFlag: 1,
        businessAssetAuthorizationFlag: 1,
        businessAssetNonRepudiationFlag: 1,
      },
      riskAttackPaths: [
        {
          riskAttackPathId: 1,
          attackPathName: '',
          attackPathScore: 10.1,
          vulnerabilityRef: [
            {
              name: '',
              score: 10,
              vulnerabilityId: 1,
            }
          ],
        },
      ],
      riskMitigation: [
        {
          riskMitigationId: 1,
          description: '',
          benefits: 1,
          cost: 123,
          decision: 'Done',
          decisionDetail: '',
        },
      ],
    };

    expect(israProject.getRisk(1).properties).toEqual(r);
  });

  // get Vulnerability
  test('get Vulnerability', () => {
    const v = {
      projectName: '',
      projectVersion: '',
      vulnerabilityId: 1,
      vulnerabilityName: '',
      vulnerabilityFamily: 'Use of Dangerous API',
      vulnerabilityTrackingID: '',
      vulnerabilityTrackingURI: '',
      vulnerabilityDescription: '',
      vulnerabilityDescriptionAttachment: '',
      vulnerabilityCVE: 'CVSS:2.0/AV:N/AC:M/Au:N/C:N/I:P/A:C',
      cveScore: 10,
      overallScore: 10,
      overallLevel: 'Critical',
      supportingAssetRef: [1],
    };

    expect(israProject.getVulnerability(1).properties).toEqual(v);
  });

  test('get ISRAProject properties', () => {
    const proj = {
      ISRAmeta: {
        classification: israProject.properties.ISRAmeta.classification,
        iteration: 1,
        projectName: '',
        projectOrganization: config.organizations[config.organizations.length - 1],
        projectVersion: '',
        ISRAtracking: [
          {
            trackingIteration: 1,
            trackingSecurityOfficer: '',
            trackingDate: '',
            trackingComment: 'comment',
          },
        ],
        businessAssetsCount: 1,
        schemaVersion: 3,
        supportingAssetsCount: 1,
        risksCount: 1,
        vulnerabilitiesCount: 1,
        latestBusinessAssetId: 1,
        latestRiskId: 1,
        latestSupportingAssetId: 1,
        latestVulnerabilityId: 1
      },
      ProjectContext: {
        projectDescription: '',
        projectURL: '',
        projectDescriptionAttachment: '',
        securityProjectObjectives: '',
        securityOfficerObjectives: '',
        securityAssumptions: '',
      },
      BusinessAsset: [
        {
          businessAssetId: 1,
          businessAssetName: '',
          businessAssetType: 'Service',
          businessAssetDescription: '',
          businessAssetProperties: {
            businessAssetAuthenticity: 4,
            businessAssetAuthorization: 4,
            businessAssetAvailability: 4,
            businessAssetConfidentiality: 4,
            businessAssetIntegrity: 4,
            businessAssetNonRepudiation: 4,
          },
        },
      ],
      SupportingAssetsDesc: '',
      SupportingAsset: [
        {
          supportingAssetId: 1,
          supportingAssetHLDId: '',
          supportingAssetName: '',
          supportingAssetType: 'Interface',
          supportingAssetSecurityLevel: 2,
          businessAssetRef: [1],
        },
      ],
      Risk: [
        {
          riskId: 1,
          projectName: '',
          projectVersion: '',
          allAttackPathsName: '',
          allAttackPathsScore: -0.1,
          inherentRiskScore: 0,
          mitigatedRiskScore: 0,
          riskManagementDecision: 'Accept',
          riskManagementDetail: '',
          residualRiskScore: 10,
          residualRiskLevel: 'Critical',
          mitigationsBenefits: 11.1,
          mitigationsDoneBenefits: 11.1,
          riskName: 'As a , I can  the  compromising the  in order to ',
          threatAgent: '',
          threatAgentDetail: '',
          threatVerb: '',
          threatVerbDetail: '',
          motivation: '',
          motivationDetail: '',
          businessAssetRef: null,
          supportingAssetRef: null,
          isAutomaticRiskName: true,
          riskLikelihood: {
            riskLikelihood: 4,
            riskLikelihoodDetail: '',
            skillLevel: 9,
            reward: 9,
            accessResources: 9,
            size: 9,
            intrusionDetection: 9,
            threatFactorScore: 5.8,
            threatFactorLevel: 'Very High',
            occurrence: 9,
            occurrenceLevel: 'Very High',
            isOWASPLikelihood: true
          },
          riskImpact: {
            riskImpact: 1,
            businessAssetConfidentialityFlag: 1,
            businessAssetIntegrityFlag: 1,
            businessAssetAvailabilityFlag: 1,
            businessAssetAuthenticityFlag: 1,
            businessAssetAuthorizationFlag: 1,
            businessAssetNonRepudiationFlag: 1,
          },
          riskAttackPaths: [
            {
              riskAttackPathId: 1,
              attackPathName: '',
              attackPathScore: 10.1,
              vulnerabilityRef: [
                {
                  name: '',
                  score: 10,
                  vulnerabilityId: 1,
                }
              ],
            },
          ],
          riskMitigation: [
            {
              riskMitigationId: 1,
              description: '',
              benefits: 1,
              cost: 123,
              decision: 'Done',
              decisionDetail: '',
            },
          ],
        },
      ],
      Vulnerability: [
        {
          projectName: '',
          projectVersion: '',
          vulnerabilityId: 1,
          vulnerabilityName: '',
          vulnerabilityFamily: 'Use of Dangerous API',
          vulnerabilityTrackingID: '',
          vulnerabilityTrackingURI: '',
          vulnerabilityDescription: '',
          vulnerabilityDescriptionAttachment: '',
          vulnerabilityCVE: 'CVSS:2.0/AV:N/AC:M/Au:N/C:N/I:P/A:C',
          cveScore: 10,
          overallScore: 10,
          overallLevel: 'Critical',
          supportingAssetRef: [1],
        },
      ],
    };
    expect(JSON.parse(israProject.toJSON())).toEqual(proj);
  });

  test('delete metaTracking', () => {
    const israMetaTracking2 = new ISRAMetaTracking();
    const israMetaTracking3 = new ISRAMetaTracking();

    israProject.addMetaTracking(israMetaTracking2);
    israProject.addMetaTracking(israMetaTracking3);
    israProject.deleteMetaTracking(2);

    expect(() => {
      israProject.getMetaTracking(3);
    }).toThrow();

    expect(() => {
      israProject.deleteMetaTracking(3);
    }).toThrow();

    israProject.deleteMetaTracking(1);
    israProject.deleteMetaTracking(1);
  });

  test('delete businessAsset', () => {
    israProject.deleteBusinessAsset(1);

    expect(() => {
      israProject.getBusinessAsset(1);
    }).toThrow();

    expect(() => {
      israProject.deleteBusinessAsset(1);
    }).toThrow();
  });

  test('delete SupportingAsset', () => {
    // delete businessAssetRef
    israProject.getSupportingAsset(1).updateBusinessAssetRef(0, 1);
    israProject.getSupportingAsset(1).deleteBusinessAssetRef(0);

    expect(() => {
      israProject.getSupportingAsset(1).deleteBusinessAssetRef(0);
    }).toThrow();

    
    expect(() => {
      israProject.getSupportingAsset(1).updateBusinessAssetRef(0, 1);
    }).toThrow();

    israProject.deleteSupportingAsset(1);

    // delete supportingAsset
    expect(() => {
      israProject.getSupportingAsset(1);
    }).toThrow();

    expect(() => {
      israProject.deleteSupportingAsset(1);
    }).toThrow();
  });

  test('delete Risk', () => {
    const path2 = new RiskAttackPath();
    const path3 = new RiskAttackPath();
    const m2 = new RiskMitigation();
    const m3 = new RiskMitigation();

    israProject.getRisk(1).addRiskAttackPath(path2);
    israProject.getRisk(1).addRiskAttackPath(path3);
    israProject.getRisk(1).addRiskMitigation(m2);
    israProject.getRisk(1).addRiskMitigation(m3);

    // delete vulnerabilityRef
    israProject.getRisk(1).getRiskAttackPath(1).addVulnerability({
      vulnerabilityId: 1,
      name: '',
      score: null
    });
    israProject.getRisk(1).getRiskAttackPath(1).updateVulnerability(1, {
      vulnerabilityId: 1,
      name: '',
      score: null
    });
    israProject.getRisk(1).getRiskAttackPath(1).deleteVulnerability(1);

    expect(() => {
      israProject.getRisk(1).getRiskAttackPath(1).deleteVulnerability(1);
    }).toThrow();

    expect(israProject.getRisk(1).getRiskAttackPath(1).getVulnerability(1)).toBe(null);

    expect(() => {
      israProject.getRisk(1).getRiskAttackPath(1).updateVulnerability(1, {
        vulnerabilityId: 1,
        name: '',
        score: null
      });
    }).toThrow();

    // delete riskAttackPath
    israProject.getRisk(1).deleteRiskAttackPath(2);
    israProject.getRisk(1).deleteRiskAttackPath(2);
    israProject.getRisk(1).deleteRiskAttackPath(1);

    expect(() => {
      israProject.getRisk(1).deleteRiskAttackPath(1);
    }).toThrow();

    expect(() => {
      israProject.getRisk(1).getRiskAttackPath(1);
    }).toThrow();

    // delete riskMitigation
    israProject.getRisk(1).deleteRiskMitigation(1);
    israProject.getRisk(1).deleteRiskMitigation(1);
    israProject.getRisk(1).deleteRiskMitigation(1);

    expect(() => {
      israProject.getRisk(1).deleteRiskMitigation(1);
    }).toThrow();

    expect(() => {
      israProject.getRisk(1).getRiskMitigation(1);
    }).toThrow();

    // delete Risk
    israProject.deleteRisk(1);

    expect(() => {
      israProject.getRisk(1);
    }).toThrow();

    expect(() => {
      israProject.deleteRisk(1);
    }).toThrow();
  });

  test('delete Vulnerability', () => {
    // delete supportingAssetRefs
    israProject.getVulnerability(1).deleteSupportingAssetRef(1);

    expect(() => {
      israProject.getVulnerability(1).deleteSupportingAssetRef(1);
    }).toThrow();

    israProject.deleteVulnerability(1);

    // delete vulnerability
    expect(() => {
      israProject.getVulnerability(1);
    }).toThrow();

    expect(() => {
      israProject.deleteVulnerability(1);
    }).toThrow();
  });
});
