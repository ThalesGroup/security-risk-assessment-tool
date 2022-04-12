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
const Vulnerability = require('../../src/model/classes/Vulnerability/vulnerability');

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
  const vulnerability = new Vulnerability();

  // ISRA Project
  test('set projectName', () => {
    israProject.projectName = 'project name';
    expect(israProject.properties.ISRAmeta.projectName).toBe('project name');

    israProject.projectName = '';
    expect(israProject.properties.ISRAmeta.projectName).toBe('');

    expect(() => {
      israProject.projectName = 123;
    }).toThrow();
  });

  test('set projectOrganization', () => {
    const testValues = ['', 'AIS', 'BPS', 'CPL', 'IBS', 'ITE', 'MCS', 'Banking and Payment', 'Enterprise & Cybersecurity',
      'Government', 'Mobile Services & IoT', 'R&D Issuance Solutions & Services', 'SHD', 'Netsize', 'IDSS', 'Software House',
      'GGS', 'ICS', 'Coesys', 'eBanking', 'PSE'];

    testValues.forEach((testValue) => {
      israProject.projectOrganization = testValue;
      expect(israProject.properties.ISRAmeta.projectOrganization).toBe(testValue);
    });

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

    israProject.projectVersion = '';
    expect(israProject.properties.ISRAmeta.projectVersion).toBe('');

    expect(() => {
      israProject.projectVersion = 1.01;
    }).toThrow();
  });

  // get ISRA Project
  test('get ISRAproject', () => {
    const proj = {
      ISRAmeta: {
        appVersion: undefined,
        projectName: '',
        projectOrganization: 'PSE',
        projectVersion: '',
        ISRAtracking: [],
        businessAssetsCount: 0,
        supportingAssetsCount: 0,
        risksCount: 0,
        vulnerabilitiesCount: 0,
      },
      ProjectContext: undefined,
      BusinessAsset: [],
      SupportingAssetsDesc: undefined,
      SupportingAsset: [],
      Risk: [],
      Vulnerability: [],
    };

    expect(israProject.properties).toEqual(proj);
  });

  // set ISRA Meta Tracking
  test('set ISRAMetaTracking', () => {
    israProject.addMetaTracking(israMetaTracking);
    expect(israProject.getMetaTracking(1).properties)
      .toEqual({
        trackingIteration: 1,
        trackingSecurityOfficer: user,
        trackingDate: currentDate,
        trackingComment: undefined,
      });

    expect(() => {
      israProject.addMetaTracking({});
    }).toThrow();
  });

  test('set trackingIteration', () => {
    israMetaTracking.trackingIteration = null;
    expect(israMetaTracking.properties.trackingIteration).toBe(null);

    israMetaTracking.trackingIteration = 1;
    expect(israMetaTracking.properties.trackingIteration).toBe(1);

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
    expect(israMetaTracking.properties.trackingSecurityOfficer).toBe('officer name 1');

    israMetaTracking.trackingSecurityOfficer = '';
    expect(israMetaTracking.properties.trackingSecurityOfficer).toBe('');

    expect(() => {
      israMetaTracking.trackingSecurityOfficer = 123;
    }).toThrow();
  });

  test('set trackingDate', () => {
    israMetaTracking.trackingDate = '2022-04-08';
    expect(israMetaTracking.properties.trackingDate).toBe('2022-04-08');

    israMetaTracking.trackingDate = '';
    expect(israMetaTracking.properties.trackingDate).toBe('');

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
    expect(israMetaTracking.properties.trackingComment).toBe('');

    israMetaTracking.trackingComment = 'comment';
    expect(israMetaTracking.properties.trackingComment).toBe('comment');

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

    projectContext.projectURL = 'ftp://server/pathname';
    expect(projectContext.properties.projectURL).toBe('ftp://server/pathname');

    projectContext.projectURL = 'mailto:username@thalesgroup.com';
    expect(projectContext.properties.projectURL).toBe('mailto:username@thalesgroup.com');

    projectContext.projectURL = '';
    expect(projectContext.properties.projectURL).toBe('');

    const testValues = ['https://', 'htpp://', 'ftp://', 'mailto:', 'ftp://server/', 'www.google.com', 'mailto:invalidEmail'];

    testValues.forEach((testValue) => {
      expect(() => {
        projectContext.projectURL = testValue;
      }).toThrow();
    });
  });

  test('set projectDescriptionAttachment', () => {
    projectContext.projectDescriptionAttachment = 'YWJjZA==';
    expect(projectContext.properties.projectDescriptionAttachment).toBe('YWJjZA==');

    projectContext.projectDescriptionAttachment = '';
    expect(projectContext.properties.projectDescriptionAttachment).toBe('');

    expect(() => {
      projectContext.projectDescriptionAttachment = 123;
    }).toThrow();

    expect(() => {
      projectContext.projectDescriptionAttachment = 'nkjh8whNknj';
    }).toThrow();
  });

  test('set securityProjectObjectives', () => {
    projectContext.securityProjectObjectives = '<p style="color:blue>project description</p>';
    expect(projectContext.properties.securityProjectObjectives).toBe('<p style="color:blue>project description</p>');

    projectContext.securityProjectObjectives = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(projectContext.properties.securityProjectObjectives).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    projectContext.securityProjectObjectives = '';
    expect(projectContext.properties.securityProjectObjectives).toBe('');

    expect(() => {
      projectContext.securityProjectObjectives = 'project objectives';
    }).toThrow();

    expect(() => {
      projectContext.securityProjectObjectives = 123;
    }).toThrow();
  });

  test('set securityOfficerObjectives', () => {
    projectContext.securityOfficerObjectives = '<p style="color:blue>project description</p>';
    expect(projectContext.properties.securityOfficerObjectives).toBe('<p style="color:blue>project description</p>');

    projectContext.securityOfficerObjectives = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(projectContext.properties.securityOfficerObjectives).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    projectContext.securityOfficerObjectives = '';
    expect(projectContext.properties.securityOfficerObjectives).toBe('');

    expect(() => {
      projectContext.securityOfficerObjectives = 'security officer objectives';
    }).toThrow();

    expect(() => {
      projectContext.securityOfficerObjectives = 123;
    }).toThrow();
  });

  test('set securityAssumptions', () => {
    projectContext.securityAssumptions = '<p style="color:blue>project description</p>';
    expect(projectContext.properties.securityAssumptions).toBe('<p style="color:blue>project description</p>');

    projectContext.securityAssumptions = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(projectContext.properties.securityAssumptions).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    projectContext.securityAssumptions = '';
    expect(projectContext.properties.securityAssumptions).toBe('');

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
      businessAssetName: undefined,
      businessAssetType: undefined,
      businessAssetDescription: undefined,
      businessAssetProperties: undefined,
    });

    expect(() => {
      israProject.addBusinessAsset({});
    }).toThrow();
  });

  test('set businessAssetId', () => {
    businessAsset.businessAssetId = null;
    expect(businessAsset.properties.businessAssetId).toBe(null);

    businessAsset.businessAssetId = 1;
    expect(businessAsset.properties.businessAssetId).toBe(1);

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
    expect(businessAsset.properties.businessAssetName).toBe('name');

    businessAsset.businessAssetName = '';
    expect(businessAsset.properties.businessAssetName).toBe('');

    expect(() => {
      businessAsset.businessAssetName = 123;
    }).toThrow();
  });

  test('set businessAssetType', () => {
    const testValues = ['', 'Data', 'Service'];
    testValues.forEach((testValue) => {
      businessAsset.businessAssetType = testValue;
      expect(businessAsset.properties.businessAssetType).toBe(testValue);
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
    expect(businessAsset.properties.businessAssetDescription).toBe('<p style="color:blue>project description</p>');

    businessAsset.businessAssetDescription = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(businessAsset.properties.businessAssetDescription).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    businessAsset.businessAssetDescription = '';
    expect(businessAsset.properties.businessAssetDescription).toBe('');

    expect(() => {
      businessAsset.businessAssetDescription = 'description';
    }).toThrow();

    expect(() => {
      businessAsset.businessAssetDescription = 123;
    }).toThrow();
  });

  test('set businessAssetProperties', () => {
    businessAsset.businessAssetProperties = businessAssetProperties;
    businessAsset.businessAssetProperties
      .businessAssetIdRef = businessAsset.properties.businessAssetId;

    expect(businessAsset.businessAssetProperties.properties).toEqual({
      businessAssetIdRef: 1,
      businessAssetAuthenticity: undefined,
      businessAssetAuthorization: undefined,
      businessAssetAvailability: undefined,
      businessAssetConfidentiality: undefined,
      businessAssetIntegrity: undefined,
      businessAssetNonRepudiation: undefined,
    });

    expect(() => {
      businessAsset.businessAssetProperties = {};
    }).toThrow();
  });

  // set Business Asset Properties
  test('set businessAssetIdRef', () => {
    businessAssetProperties.businessAssetIdRef = null;
    expect(businessAsset
      .businessAssetProperties.properties.businessAssetIdRef).toBe(null);

    businessAssetProperties.businessAssetIdRef = 1;
    expect(businessAsset
      .businessAssetProperties.properties.businessAssetIdRef).toBe(1);

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
      expect(businessAssetProperties.properties.businessAssetConfidentiality).toBe(testValue);
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
      expect(businessAssetProperties.properties.businessAssetIntegrity).toBe(testValue);
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
      expect(businessAssetProperties.properties.businessAssetAvailability).toBe(testValue);
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
      expect(businessAssetProperties.properties.businessAssetAuthenticity).toBe(testValue);
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
      expect(businessAssetProperties.properties.businessAssetAuthorization).toBe(testValue);
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
      expect(businessAssetProperties.properties.businessAssetNonRepudiation).toBe(testValue);
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
        businessAssetIdRef: 1,
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
    expect(israProject.properties.SupportingAssetsDesc).toBe('<p style="color:blue>project description</p>');

    israProject.supportingAssetsDesc = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(israProject.properties.SupportingAssetsDesc).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    israProject.supportingAssetsDesc = '';
    expect(israProject.properties.SupportingAssetsDesc).toBe('');

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
    expect(israProject.properties.SupportingAsset).toEqual([{
      supportingAssetId: 1,
      supportingAssetHLDId: undefined,
      supportingAssetName: undefined,
      supportingAssetType: undefined,
      supportingAssetSecurityLevel: undefined,
      businessAssetRefs: [],
    }]);

    expect(() => {
      israProject.addSupportingAsset({});
    }).toThrow();
  });

  test('set supportingAssetId', () => {
    supportingAsset.supportingAssetId = null;
    expect(supportingAsset.properties.supportingAssetId).toBe(null);

    supportingAsset.supportingAssetId = 1;
    expect(supportingAsset.properties.supportingAssetId).toBe(1);

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
    expect(supportingAsset.properties.supportingAssetHLDId).toBe('1');

    supportingAsset.supportingAssetHLDId = '';
    expect(supportingAsset.properties.supportingAssetHLDId).toBe('');

    expect(() => {
      supportingAsset.supportingAssetHLDId = 1;
    }).toThrow();
  });

  test('set supportingAssetName', () => {
    supportingAsset.supportingAssetName = 'name';
    expect(supportingAsset.properties.supportingAssetName).toBe('name');

    supportingAsset.supportingAssetName = '';
    expect(supportingAsset.properties.supportingAssetName).toBe('');

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
      expect(supportingAsset.properties.supportingAssetType).toBe(testValue);
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
      expect(supportingAsset.properties.supportingAssetSecurityLevel).toBe(testValue);
    });

    expect(() => {
      supportingAsset.supportingAssetSecurityLevel = -3;
    }).toThrow();

    expect(() => {
      supportingAsset.supportingAssetSecurityLevel = 3;
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
    expect(supportingAsset.properties.businessAssetRefs.includes(1)).toBe(true);

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
      businessAssetRefs: [1],
    };

    expect(israProject.getSupportingAsset(1).properties).toEqual(sa);
  });

  // set Risk
  test('set Risk', () => {
    israProject.addRisk(risk);
    expect(israProject.getRisk(1).properties).toEqual({
      riskId: 1,
      projectNameRef: undefined,
      projectVersionRef: undefined,
      riskName: undefined,
      riskLikelihood: undefined,
      riskImpact: undefined,
      riskAttackPaths: [],
      allAttackPathsName: undefined,
      allAttackPathsScore: undefined,
      inherentRiskScore: undefined,
      riskMitigation: [],
      mitigatedRiskScore: undefined,
      riskManagementDecision: undefined,
      riskManagementDetail: undefined,
      residualRiskScore: undefined,
      residualRiskLevel: undefined,
    });

    expect(() => {
      israProject.addRisk({});
    }).toThrow();
  });

  test('set riskId', () => {
    risk.riskId = null;
    expect(risk.properties.riskId).toBe(null);

    risk.riskId = 1;
    expect(risk.properties.riskId).toBe(1);

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

  test('set projectNameRef', () => {
    risk.projectNameRef = 'name';
    expect(risk.properties.projectNameRef).toBe('name');

    risk.projectNameRef = '';
    expect(risk.properties.projectNameRef).toBe('');

    expect(() => {
      risk.projectNameRef = 123;
    }).toThrow();
  });

  test('set projectVersionRef', () => {
    risk.projectNameRef = 'version';
    expect(risk.properties.projectNameRef).toBe('version');

    risk.projectNameRef = '';
    expect(risk.properties.projectNameRef).toBe('');

    expect(() => {
      risk.projectVersionRef = 123;
    }).toThrow();
  });

  test('set allAttackPathsName', () => {
    risk.allAttackPathsName = 'pathsName';
    expect(risk.properties.allAttackPathsName).toBe('pathsName');

    risk.allAttackPathsName = '';
    expect(risk.properties.allAttackPathsName).toBe('');

    expect(() => {
      risk.allAttackPathsName = 123;
    }).toThrow();
  });

  test('set allAttackPathsScore', () => {
    risk.allAttackPathsScore = null;
    expect(risk.properties.allAttackPathsScore).toBe(null);

    risk.allAttackPathsScore = 10;
    expect(risk.properties.allAttackPathsScore).toBe(10);

    risk.allAttackPathsScore = 0;
    expect(risk.properties.allAttackPathsScore).toBe(0);

    expect(() => {
      risk.allAttackPathsScore = 10.1;
    }).toThrow();

    expect(() => {
      risk.allAttackPathsScore = -0.1;
    }).toThrow();

    expect(() => {
      risk.allAttackPathsScore = '5.5';
    }).toThrow();

    expect(() => {
      risk.allAttackPathsScore = NaN;
    }).toThrow();
  });

  test('set inherentRiskScore', () => {
    risk.inherentRiskScore = null;
    expect(risk.properties.inherentRiskScore).toBe(null);

    risk.inherentRiskScore = 0;
    expect(risk.properties.inherentRiskScore).toBe(0);

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

  test('set mitigatedRiskScore', () => {
    risk.mitigatedRiskScore = null;
    expect(risk.properties.mitigatedRiskScore).toBe(null);

    risk.mitigatedRiskScore = 0;
    expect(risk.properties.mitigatedRiskScore).toBe(0);

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
      expect(risk.properties.riskManagementDecision).toBe(testValue);
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
    expect(risk.properties.riskManagementDetail).toBe('<p style="color:blue>project description</p>');

    risk.riskManagementDetail = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(risk.properties.riskManagementDetail).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    risk.riskManagementDetail = '';
    expect(risk.properties.riskManagementDetail).toBe('');

    expect(() => {
      risk.riskManagementDetail = 'detail';
    }).toThrow();

    expect(() => {
      risk.riskManagementDetail = 123;
    }).toThrow();
  });

  test('set residualRiskScore', () => {
    risk.residualRiskScore = null;
    expect(risk.properties.residualRiskScore).toBe(null);

    risk.residualRiskScore = 10;
    expect(risk.properties.residualRiskScore).toBe(10);

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
      expect(risk.properties.residualRiskLevel).toBe(testValue);
    });

    expect(() => {
      risk.residualRiskLevel = 'Invalid level';
    }).toThrow();

    expect(() => {
      risk.residualRiskLevel = 123;
    }).toThrow();
  });

  // set Risk Name
  test('set riskName', () => {
    risk.riskName = riskName;
    risk.riskName.riskIdRef = risk.properties.riskId;
    expect(risk.riskName.properties).toEqual({
      riskIdRef: 1,
      riskName: undefined,
      threatAgent: undefined,
      threatAgentDetail: undefined,
      threatVerb: undefined,
      threatVerbDetail: undefined,
      motivation: undefined,
      motivationDetail: undefined,
      businessAssetRef: undefined,
      supportingAssetRef: undefined,
    });

    expect(() => {
      risk.riskName = {};
    }).toThrow();
  });

  test('set riskIdRef', () => {
    riskName.riskIdRef = null;
    expect(riskName.properties.riskIdRef).toBe(null);

    riskName.riskIdRef = 1;
    expect(riskName.properties.riskIdRef).toBe(1);

    expect(() => {
      riskLikelihood.riskIdRef = 0;
    }).toThrow();

    expect(() => {
      riskName.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskName', () => {
    riskName.riskName = 'name';
    expect(riskName.properties.riskName).toBe('name');

    riskName.riskName = '';
    expect(riskName.properties.riskName).toBe('');

    expect(() => {
      riskName.riskName = 123;
    }).toThrow();
  });

  test('set threatAgent', () => {
    const testValues = ['', 'Insider', 'Criminal', 'Competitor', 'Criminal organization', 'Government agency', 'Researcher', 'Activist',
      'Script Kiddy', 'User', 'R&D Employee', 'Operationnal Employee', 'Maintenance Employee', 'IT Employee'];

    testValues.forEach((testValue) => {
      riskName.threatAgent = testValue;
      expect(riskName.properties.threatAgent).toBe(testValue);
    });

    expect(() => {
      riskName.threatAgent = 'Invalid agent';
    }).toThrow();

    expect(() => {
      riskName.threatAgent = 123;
    }).toThrow();
  });

  test('set threatAgentDetail', () => {
    riskName.threatAgentDetail = '<p style="color:blue>project description</p>';
    expect(riskName.properties.threatAgentDetail).toBe('<p style="color:blue>project description</p>');

    riskName.threatAgentDetail = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(riskName.properties.threatAgentDetail).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    riskName.threatAgentDetail = '';
    expect(riskName.properties.threatAgentDetail).toBe('');

    expect(() => {
      riskName.threatAgentDetail = 'detail';
    }).toThrow();

    expect(() => {
      riskName.threatAgentDetail = 123;
    }).toThrow();
  });

  test('set threatVerb', () => {
    const testValues = ['', 'lose', 'spoof', 'tamper with', 'repudiate', 'disclose', 'steal', 'deny access to',
      'gain an unauthorized access to', 'flood'];

    testValues.forEach((testValue) => {
      riskName.threatVerb = testValue;
      expect(riskName.properties.threatVerb).toBe(testValue);
    });

    expect(() => {
      riskName.threatVerb = 'Invalid verb';
    }).toThrow();

    expect(() => {
      riskName.threatVerb = 123;
    }).toThrow();
  });

  test('set threatVerbDetail', () => {
    riskName.threatVerbDetail = '<p style="color:blue>project description</p>';
    expect(riskName.properties.threatVerbDetail).toBe('<p style="color:blue>project description</p>');

    riskName.threatVerbDetail = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(riskName.properties.threatVerbDetail).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    riskName.threatVerbDetail = '';
    expect(riskName.properties.threatVerbDetail).toBe('');

    expect(() => {
      riskName.threatVerbDetail = 'detail';
    }).toThrow();

    expect(() => {
      riskName.threatVerbDetail = 123;
    }).toThrow();
  });

  test('set motivation', () => {
    riskName.motivation = 'motivation';
    expect(riskName.properties.motivation).toBe('motivation');

    riskName.motivation = '';
    expect(riskName.properties.motivation).toBe('');

    expect(() => {
      riskName.motivation = 123;
    }).toThrow();
  });

  test('set motivationDetail', () => {
    riskName.motivationDetail = '<p style="color:blue>project description</p>';
    expect(riskName.properties.motivationDetail).toBe('<p style="color:blue>project description</p>');

    riskName.motivationDetail = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(riskName.properties.motivationDetail).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    riskName.motivationDetail = '';
    expect(riskName.properties.motivationDetail).toBe('');

    expect(() => {
      riskName.motivationDetail = 'detail';
    }).toThrow();

    expect(() => {
      riskName.motivationDetail = 123;
    }).toThrow();
  });

  test('set businessAssetRef', () => {
    riskName.businessAssetRef = null;
    expect(riskName.properties.businessAssetRef).toBe(null);

    riskName.businessAssetRef = businessAsset.properties.businessAssetId;
    expect(riskName.properties.businessAssetRef).toBe(1);

    expect(() => {
      riskName.businessAssetRef = 0;
    }).toThrow();

    expect(() => {
      riskName.businessAssetRef = '1';
    }).toThrow();
  });

  test('set supportingAssetRef', () => {
    riskName.supportingAssetRef = null;
    expect(riskName.properties.supportingAssetRef).toBe(null);

    riskName.supportingAssetRef = supportingAsset.properties.supportingAssetId;
    expect(riskName.properties.supportingAssetRef).toBe(1);

    expect(() => {
      riskName.supportingAssetRef = 0;
    }).toThrow();

    expect(() => {
      riskName.supportingAssetRef = '1';
    }).toThrow();
  });

  // Risk Likelihood
  test('set riskLikelihood', () => {
    risk.riskLikelihood = riskLikelihood;
    risk.riskLikelihood.riskIdRef = risk.properties.riskId;

    expect(risk.riskLikelihood.properties).toEqual({
      riskIdRef: 1,
      riskLikelihood: undefined,
      riskLikelihoodDetail: undefined,
      skillLevel: undefined,
      reward: undefined,
      accessResources: undefined,
      size: undefined,
      intrusionDetection: undefined,
      threatFactorScore: undefined,
      threatFactorLevel: undefined,
      occurrence: undefined,
      occurrenceLevel: undefined,
    });

    expect(() => {
      risk.riskLikelihood = {};
    }).toThrow();
  });

  test('set riskIdRef', () => {
    riskLikelihood.riskIdRef = null;
    expect(riskLikelihood.properties.riskIdRef).toBe(null);

    riskLikelihood.riskIdRef = 1;
    expect(riskLikelihood.properties.riskIdRef).toBe(1);

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
      expect(riskLikelihood.properties.riskLikelihood).toBe(testValue);
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
    expect(riskLikelihood.properties.riskLikelihoodDetail).toBe('<p style="color:blue>project description</p>');

    riskLikelihood.riskLikelihoodDetail = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(riskLikelihood.properties.riskLikelihoodDetail).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    riskLikelihood.riskLikelihoodDetail = '';
    expect(riskLikelihood.properties.riskLikelihoodDetail).toBe('');

    expect(() => {
      riskLikelihood.riskLikelihoodDetail = 123;
    }).toThrow();
  });

  test('set skillLevel', () => {
    const testValues = [null, 1, 3, 5, 6, 9];
    testValues.forEach((testValue) => {
      riskLikelihood.skillLevel = testValue;
      expect(riskLikelihood.properties.skillLevel).toBe(testValue);
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
      expect(riskLikelihood.properties.reward).toBe(testValue);
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
      expect(riskLikelihood.properties.accessResources).toBe(testValue);
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
      expect(riskLikelihood.properties.size).toBe(testValue);
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
      expect(riskLikelihood.properties.intrusionDetection).toBe(testValue);
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
    expect(riskLikelihood.properties.threatFactorScore).toBe(null);

    riskLikelihood.threatFactorScore = 5.8;
    expect(riskLikelihood.properties.threatFactorScore).toBe(5.8);

    expect(() => {
      riskLikelihood.threatFactorScore = '5.8';
    }).toThrow();
  });

  test('set threatFactorLevel', () => {
    const testValues = ['', 'Low', 'Medium', 'High', 'Very High'];
    testValues.forEach((testValue) => {
      riskLikelihood.threatFactorLevel = testValue;
      expect(riskLikelihood.properties.threatFactorLevel).toBe(testValue);
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
      expect(riskLikelihood.properties.occurrence).toBe(testValue);
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
      expect(riskLikelihood.properties.occurrenceLevel).toBe(testValue);
    });

    expect(() => {
      riskLikelihood.occurrenceLevel = 'Invalid level';
    }).toThrow();

    expect(() => {
      riskLikelihood.occurrenceLevel = 123;
    }).toThrow();
  });

  // Risk Impact
  test('set riskImpact', () => {
    risk.riskImpact = riskImpact;
    risk.riskImpact.riskIdRef = risk.properties.riskId;

    expect(risk.riskImpact.properties).toEqual({
      riskIdRef: 1,
      riskImpact: undefined,
      businessAssetConfidentialityFlag: undefined,
      businessAssetIntegrityFlag: undefined,
      businessAssetAvailabilityFlag: undefined,
      businessAssetAuthenticityFlag: undefined,
      businessAssetAuthorizationFlag: undefined,
      businessAssetNonRepudiationFlag: undefined,
    });

    expect(() => {
      risk.riskImpact = {};
    }).toThrow();
  });

  test('set riskIdRef', () => {
    riskImpact.riskIdRef = null;
    expect(riskImpact.properties.riskIdRef).toBe(null);

    riskImpact.riskIdRef = 1;
    expect(riskImpact.properties.riskIdRef).toBe(1);

    expect(() => {
      riskImpact.riskIdRef = 0;
    }).toThrow();

    expect(() => {
      riskImpact.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskImpact', () => {
    riskImpact.riskImpact = null;
    expect(riskImpact.properties.riskImpact).toBe(null);

    riskImpact.riskImpact = 1;
    expect(riskImpact.properties.riskImpact).toBe(1);

    expect(() => {
      riskImpact.riskImpact = 1.1;
    }).toThrow();
  });

  test('set businessAssetConfidentialityFlag', () => {
    const testValues = [null, 0, 1];
    testValues.forEach((testValue) => {
      riskImpact.businessAssetConfidentialityFlag = testValue;
      expect(riskImpact.properties.businessAssetConfidentialityFlag).toBe(testValue);
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
      expect(riskImpact.properties.businessAssetIntegrityFlag).toBe(testValue);
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
      expect(riskImpact.properties.businessAssetAvailabilityFlag).toBe(testValue);
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
      expect(riskImpact.properties.businessAssetAuthenticityFlag).toBe(testValue);
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
      expect(riskImpact.properties.businessAssetAuthorizationFlag).toBe(testValue);
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
      expect(riskImpact.properties.businessAssetNonRepudiationFlag).toBe(testValue);
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
    riskAttackPath.riskIdRef = 1;
    expect(risk.getRiskAttackPath(1).properties).toEqual({
      riskIdRef: 1,
      riskAttackPathId: 1,
      vulnerabilityRef: [],
      attackPathName: undefined,
      attackPathScore: undefined,
    });

    expect(() => {
      risk.addRiskAttackPath({});
    }).toThrow();
  });

  test('set riskIdRef', () => {
    riskAttackPath.riskIdRef = null;
    expect(riskAttackPath.properties.riskIdRef).toBe(null);

    riskAttackPath.riskIdRef = 1;
    expect(riskAttackPath.properties.riskIdRef).toBe(1);

    expect(() => {
      riskAttackPath.riskIdRef = 0;
    }).toThrow();

    expect(() => {
      riskAttackPath.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskAttackPathId', () => {
    riskAttackPath.riskAttackPathId = null;
    expect(riskAttackPath.properties.riskAttackPathId).toBe(null);

    riskAttackPath.riskAttackPathId = 1;
    expect(riskAttackPath.properties.riskAttackPathId).toBe(1);

    expect(() => {
      riskAttackPath.riskAttackPathId = 0;
    }).toThrow();

    expect(() => {
      riskAttackPath.riskAttackPathId = '1';
    }).toThrow();
  });

  test('set attackPathName', () => {
    riskAttackPath.attackPathName = 'name';
    expect(riskAttackPath.properties.attackPathName).toBe('name');

    riskAttackPath.attackPathName = '';
    expect(riskAttackPath.properties.attackPathName).toBe('');

    expect(() => {
      riskAttackPath.attackPathName = 123;
    }).toThrow();
  });

  test('set attackPathScore', () => {
    riskAttackPath.attackPathScore = null;
    expect(riskAttackPath.properties.attackPathScore).toBe(null);

    riskAttackPath.attackPathScore = 0;
    expect(riskAttackPath.properties.attackPathScore).toBe(0);

    riskAttackPath.attackPathScore = 10;
    expect(riskAttackPath.properties.attackPathScore).toBe(10);

    expect(() => {
      riskAttackPath.attackPathScore = -0.1;
    }).toThrow();

    expect(() => {
      riskAttackPath.attackPathScore = 10.1;
    }).toThrow();

    expect(() => {
      riskAttackPath.attackPathScore = '0';
    }).toThrow();
  });

  // set Risk Mitigation
  test('set riskMitigation', () => {
    risk.addRiskMitigation(riskMitigation);
    risk.getRiskMitigation(1).riskIdRef = risk.properties.riskId;
    expect(risk.getRiskMitigation(1).properties).toEqual({
      riskIdRef: 1,
      riskMitigationId: 1,
      description: undefined,
      benefits: undefined,
      cost: undefined,
      decision: undefined,
      decisionDetail: undefined,
      mitigationsBenefits: undefined,
      mitigationsDoneBenefits: undefined,
    });

    expect(() => {
      risk.addRiskMitigation({});
    }).toThrow();
  });

  test('set riskIdRef', () => {
    riskMitigation.riskIdRef = null;
    expect(riskMitigation.properties.riskIdRef).toBe(null);

    riskMitigation.riskIdRef = 1;
    expect(riskMitigation.properties.riskIdRef).toBe(1);

    expect(() => {
      riskMitigation.riskIdRef = 0;
    }).toThrow();

    expect(() => {
      riskMitigation.riskIdRef = '1';
    }).toThrow();
  });

  test('set riskMitigationId', () => {
    riskMitigation.riskMitigationId = null;
    expect(riskMitigation.properties.riskMitigationId).toBe(null);

    riskMitigation.riskMitigationId = 1;
    expect(riskMitigation.properties.riskMitigationId).toBe(1);

    expect(() => {
      riskMitigation.riskMitigationId = 0;
    }).toThrow();

    expect(() => {
      riskMitigation.riskMitigationId = '1';
    }).toThrow();
  });

  test('set benefits', () => {
    const testValues = [null, 0, 0.1, 0.25, 0.5, 0.75, 0.9, 1];
    testValues.forEach((testValue) => {
      riskMitigation.benefits = testValue;
      expect(riskMitigation.properties.benefits).toBe(testValue);
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
    expect(riskMitigation.properties.cost).toBe(null);

    riskMitigation.cost = 123;
    expect(riskMitigation.properties.cost).toBe(123);

    expect(() => {
      riskMitigation.cost = 10.1;
    }).toThrow();

    expect(() => {
      riskMitigation.cost = '10';
    }).toThrow();
  });

  test('set decision', () => {
    const testValues = ['', 'Rejected', 'Accepted', 'Postphoned', 'Done'];
    testValues.forEach((testValue) => {
      riskMitigation.decision = testValue;
      expect(riskMitigation.properties.decision).toBe(testValue);
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
    expect(riskMitigation.properties.decisionDetail).toBe('<p style="color:blue>project description</p>');

    riskMitigation.decisionDetail = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(riskMitigation.properties.decisionDetail).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    riskMitigation.decisionDetail = '';
    expect(riskMitigation.properties.decisionDetail).toBe('');

    expect(() => {
      riskMitigation.decisionDetail = 123;
    }).toThrow();
  });

  test('set mitigationsBenefits', () => {
    riskMitigation.mitigationsBenefits = null;
    expect(riskMitigation.properties.mitigationsBenefits).toBe(null);

    riskMitigation.mitigationsBenefits = 11.1;
    expect(riskMitigation.properties.mitigationsBenefits).toBe(11.1);

    expect(() => {
      riskMitigation.mitigationsBenefits = '10';
    }).toThrow();
  });

  test('set mitigationsDoneBenefits', () => {
    riskMitigation.mitigationsDoneBenefits = null;
    expect(riskMitigation.properties.mitigationsDoneBenefits).toBe(null);

    riskMitigation.mitigationsDoneBenefits = 11.1;
    expect(riskMitigation.properties.mitigationsDoneBenefits).toBe(11.1);

    expect(() => {
      riskMitigation.mitigationsDoneBenefits = '10';
    }).toThrow();
  });

  // set Vulnerability
  test('set Vulnerability', () => {
    israProject.addVulnerability(vulnerability);
    expect(israProject.getVulnerability(1).properties).toEqual({
      projectNameRef: undefined,
      projectVersionRef: undefined,
      vulnerabilityId: 1,
      vulnerabilityName: undefined,
      vulnerabilityFamily: undefined,
      vulnerabilityTrackingID: undefined,
      vulnerabilityTrackingURI: undefined,
      vulnerabilityDescription: undefined,
      vulnerabilityDescriptionAttachment: undefined,
      vulnerabilityCVE: undefined,
      cveScore: undefined,
      overallScore: undefined,
      overallLevel: undefined,
      supportingAssetRef: [],
    });

    expect(() => {
      israProject.addVulnerability({});
    }).toThrow();
  });

  test('set projectNameRef', () => {
    vulnerability.projectNameRef = 'name';
    expect(vulnerability.properties.projectNameRef).toBe('name');

    vulnerability.projectNameRef = '';
    expect(vulnerability.properties.projectNameRef).toBe('');

    expect(() => {
      vulnerability.projectNameRef = 123;
    }).toThrow();
  });

  test('set projectVersionRef', () => {
    vulnerability.projectVersionRef = 'version';
    expect(vulnerability.properties.projectVersionRef).toBe('version');

    vulnerability.projectVersionRef = '';
    expect(vulnerability.properties.projectVersionRef).toBe('');

    expect(() => {
      vulnerability.projectVersionRef = 123;
    }).toThrow();
  });

  test('set vulnerabilityId', () => {
    vulnerability.vulnerabilityId = null;
    expect(vulnerability.properties.vulnerabilityId).toBe(null);

    vulnerability.vulnerabilityId = 1;
    expect(vulnerability.properties.vulnerabilityId).toBe(1);

    expect(() => {
      vulnerability.vulnerabilityId = 0;
    }).toThrow();

    expect(() => {
      vulnerability.vulnerabilityId = '1';
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
      expect(vulnerability.properties.vulnerabilityFamily).toBe(testValue);
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
    expect(vulnerability.properties.vulnerabilityTrackingID).toBe('id');

    vulnerability.vulnerabilityTrackingID = '';
    expect(vulnerability.properties.vulnerabilityTrackingID).toBe('');

    expect(() => {
      vulnerability.vulnerabilityTrackingID = 123;
    }).toThrow();
  });

  test('set vulnerabilityTrackingURI', () => {
    vulnerability.vulnerabilityTrackingURI = 'https://www.google.com';
    expect(vulnerability.properties.vulnerabilityTrackingURI).toBe('https://www.google.com');

    vulnerability.vulnerabilityTrackingURI = 'ftp://server/pathname';
    expect(vulnerability.properties.vulnerabilityTrackingURI).toBe('ftp://server/pathname');

    vulnerability.vulnerabilityTrackingURI = 'mailto:username@thalesgroup.com';
    expect(vulnerability.properties.vulnerabilityTrackingURI).toBe('mailto:username@thalesgroup.com');

    vulnerability.vulnerabilityTrackingURI = '';
    expect(vulnerability.properties.vulnerabilityTrackingURI).toBe('');

    const testValues = ['https://', 'htpp://', 'ftp://', 'mailto:', 'ftp://server/', 'www.google.com', 'mailto:invalidEmail'];

    testValues.forEach((testValue) => {
      expect(() => {
        vulnerability.vulnerabilityTrackingURI = testValue;
      }).toThrow();
    });
  });

  test('set vulnerabilityDescription', () => {
    vulnerability.vulnerabilityDescription = '<p style="color:blue>project description</p>';
    expect(vulnerability.properties.vulnerabilityDescription).toBe('<p style="color:blue>project description</p>');

    vulnerability.vulnerabilityDescription = '<img src="pic_trulli.jpg" alt="Italian Trulli/">';
    expect(vulnerability.properties.vulnerabilityDescription).toBe('<img src="pic_trulli.jpg" alt="Italian Trulli/">');

    vulnerability.vulnerabilityDescription = '';
    expect(vulnerability.properties.vulnerabilityDescription).toBe('');

    expect(() => {
      vulnerability.vulnerabilityDescription = 123;
    }).toThrow();
  });

  test('set vulnerabilityDescriptionAttachment', () => {
    vulnerability.vulnerabilityDescriptionAttachment = 'YWJjZA==';
    expect(vulnerability.properties.vulnerabilityDescriptionAttachment).toBe('YWJjZA==');

    vulnerability.vulnerabilityDescriptionAttachment = '';
    expect(vulnerability.properties.vulnerabilityDescriptionAttachment).toBe('');

    expect(() => {
      vulnerability.vulnerabilityDescriptionAttachment = 123;
    }).toThrow();

    expect(() => {
      vulnerability.vulnerabilityDescriptionAttachment = 'nkjh8whNknj';
    }).toThrow();
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
      expect(vulnerability.properties.vulnerabilityCVE).toBe(testValue);
    });

    expect(() => {
      vulnerability.vulnerabilityCVE = 'Invalid cve';
    }).toThrow();

    expect(() => {
      vulnerability.vulnerabilityCVE = 'CVSS:3.0/AV:N';
    }).toThrow();
  });

  test('set cveScore', () => {
    vulnerability.cveScore = null;
    expect(vulnerability.properties.cveScore).toBe(null);

    vulnerability.cveScore = 0;
    expect(vulnerability.properties.cveScore).toBe(0);

    vulnerability.cveScore = 10;
    expect(vulnerability.properties.cveScore).toBe(10);

    expect(() => {
      vulnerability.cveScore = -0.1;
    }).toThrow();

    expect(() => {
      vulnerability.cveScore = 10.1;
    }).toThrow();

    expect(() => {
      vulnerability.cveScore = '0';
    }).toThrow();
  });

  test('set overallScore', () => {
    vulnerability.overallScore = null;
    expect(vulnerability.properties.overallScore).toBe(null);

    vulnerability.overallScore = 0;
    expect(vulnerability.properties.overallScore).toBe(0);

    vulnerability.overallScore = 10;
    expect(vulnerability.properties.overallScore).toBe(10);

    expect(() => {
      vulnerability.overallScore = -0.1;
    }).toThrow();

    expect(() => {
      vulnerability.overallScore = 10.1;
    }).toThrow();

    expect(() => {
      vulnerability.overallScore = '0';
    }).toThrow();
  });

  test('set overallLevel', () => {
    const testValues = ['None', 'Low', 'Medium', 'High', 'Critical'];

    testValues.forEach((testValue) => {
      vulnerability.overallLevel = testValue;
      expect(vulnerability.properties.overallLevel).toBe(testValue);
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
      vulnerabilityIdRef: israProject.getVulnerability(1).properties.vulnerabilityId,
      score: israProject.getVulnerability(1).properties.overallScore,
      name: israProject.getVulnerability(1).properties.vulnerabilityName,
    });
    expect(israProject.getRisk(1).getRiskAttackPath(1).getVulnerability(1)).toEqual({
      vulnerabilityIdRef: 1,
      score: 10,
      name: undefined,
    });

    expect(() => {
      riskAttackPath.addVulnerability({});
    }).toThrow();
  });

  test('get Risk', () => {
    const r = {
      riskId: 1,
      projectNameRef: '',
      allAttackPathsName: '',
      allAttackPathsScore: 0,
      inherentRiskScore: 0,
      mitigatedRiskScore: 0,
      riskManagementDecision: 'Accept',
      riskManagementDetail: '',
      residualRiskScore: 10,
      residualRiskLevel: 'Critical',
      riskName: {
        riskIdRef: 1,
        riskName: '',
        threatAgent: 'IT Employee',
        threatAgentDetail: '',
        threatVerb: 'flood',
        threatVerbDetail: '',
        motivation: '',
        motivationDetail: '',
        businessAssetRef: 1,
        supportingAssetRef: 1,
      },
      riskLikelihood: {
        riskIdRef: 1,
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
      },
      riskImpact: {
        riskIdRef: 1,
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
          riskIdRef: 1,
          riskAttackPathId: 1,
          attackPathName: '',
          attackPathScore: 10,
          vulnerabilityRef: [{
            vulnerabilityIdRef: 1,
            score: 10,
            name: undefined,
          }],
        },
      ],
      riskMitigation: [
        {
          riskIdRef: 1,
          riskMitigationId: 1,
          benefits: 1,
          cost: 123,
          decision: 'Done',
          decisionDetail: '',
          mitigationsBenefits: 11.1,
          mitigationsDoneBenefits: 11.1,
        },
      ],
    };

    expect(israProject.getRisk(1).properties).toEqual(r);
  });

  // get Vulnerability
  test('get Vulnerability', () => {
    const v = {
      projectNameRef: '',
      projectVersionRef: '',
      vulnerabilityId: 1,
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
        appVersion: undefined,
        projectName: '',
        projectOrganization: 'PSE',
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
        supportingAssetsCount: 1,
        risksCount: 1,
        vulnerabilitiesCount: 1,
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
            businessAssetIdRef: 1,
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
          businessAssetRefs: [1],
        },
      ],
      Risk: [
        {
          riskId: 1,
          projectNameRef: '',
          allAttackPathsName: '',
          allAttackPathsScore: 0,
          inherentRiskScore: 0,
          mitigatedRiskScore: 0,
          riskManagementDecision: 'Accept',
          riskManagementDetail: '',
          residualRiskScore: 10,
          residualRiskLevel: 'Critical',
          riskName: {
            riskIdRef: 1,
            riskName: '',
            threatAgent: 'IT Employee',
            threatAgentDetail: '',
            threatVerb: 'flood',
            threatVerbDetail: '',
            motivation: '',
            motivationDetail: '',
            businessAssetRef: 1,
            supportingAssetRef: 1,
          },
          riskLikelihood: {
            riskIdRef: 1,
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
          },
          riskImpact: {
            riskIdRef: 1,
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
              riskIdRef: 1,
              riskAttackPathId: 1,
              attackPathName: '',
              attackPathScore: 10,
              vulnerabilityRef: [{
                vulnerabilityIdRef: 1,
                score: 10,
                name: undefined,
              }],
            },
          ],
          riskMitigation: [
            {
              riskIdRef: 1,
              riskMitigationId: 1,
              benefits: 1,
              cost: 123,
              decision: 'Done',
              decisionDetail: '',
              mitigationsBenefits: 11.1,
              mitigationsDoneBenefits: 11.1,
            },
          ],
        },
      ],
      Vulnerability: [
        {
          projectNameRef: '',
          projectVersionRef: '',
          vulnerabilityId: 1,
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

    expect(israProject.properties).toEqual(proj);
  });
});
