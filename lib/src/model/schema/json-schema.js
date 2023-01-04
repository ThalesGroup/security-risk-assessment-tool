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

const jsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'ISRAschema',
  type: 'object',
  readOnly: true,
  title: 'Welcome to the Information Security Risk Assessment (ISRA)',
  properties: {
    ISRAmeta: {
      type: 'object',
      properties: {
        appVersion: { type: ['integer', 'null'], default: 1, title: 'App Version' },
        iteration: { type: ['integer', 'null'], default: 1, title: 'Iteration' },
        projectName: { type: 'string', default: '', title: 'Project Name' },
        projectOrganization: {
          type: 'string',
          default: '',
          title: 'Organization',
          description: 'Identifies your organization',
          anyOf: [{
            const: '',
            title: 'Select',
          },
          {
            const: 'AIS',
            title: 'Analytics & IoT Solutions (AIS)',
          },
          {
            const: 'BPS',
            title: 'Banking and Payment Services (BPS)',
          },
          {
            const: 'CPL',
            title: 'Cloud Protection & Licensing (CPL)',
          },
          {
            const: 'IBS',
            title: 'Identity and Biometric Solutions (IBS)',
          },
          {
            const: 'ITE',
            title: 'Innovation, Technology & Engineering (ITE)',
          },
          {
            const: 'MCS',
            title: 'Mobile Connectivity Solutions (MCS)',
          },
          {
            const: 'Banking and Payment',
            title: 'Banking and Payment',
          },
          {
            const: 'Enterprise & Cybersecurity',
            title: 'Enterprise & Cybersecurity',
          },
          {
            const: 'Government',
            title: 'Government',
          },
          {
            const: 'Mobile Services & IoT',
            title: 'Mobile Services & IoT',
          },
          {
            const: 'R&D Issuance Solutions & Services',
            title: 'R&D Issuance Solutions & Services',
          },
          {
            const: 'SHD',
            title: 'SHD',
          },
          {
            const: 'Netsize',
            title: 'Netsize',
          },
          {
            const: 'IDSS',
            title: 'IDSS',
          },
          {
            const: 'Software House',
            title: 'Software House',
          },
          {
            const: 'GGS',
            title: 'GGS',
          },
          {
            const: 'ICS',
            title: 'ICS',
          },
          {
            const: 'Coesys',
            title: 'Coesys',
          },
          {
            const: 'eBanking',
            title: 'eBanking',
          },
          {
            const: 'PSE',
            title: 'PSE',
          }],
        },
        projectVersion: { type: 'string', default: '', title: 'Project Version' },
        ISRAtracking: {
          type: 'array',
          title: 'Iterations History',
          default: [],
          items: {
            type: 'object',
            properties: {
              trackingIteration: {
                type: ['integer', 'null'],
                default: null,
                minimum: 1,
                title: 'Iteration',
                description: 'Identifies the risk assessment iteration on your project',
              },
              trackingSecurityOfficer: {
                type: 'string',
                default: '',
                title: 'Security Officer',
                description: 'Is the Name of the Security Officer accountable on the risk assessment',
              },
              trackingDate: {
                // string with date format dddd-dd-dd
                type: 'string',
                default: '',
                format: 'date',
                title: 'Date',
                description: 'Is the date of the last modification on this iteration',
              },
              trackingComment: {
                type: 'string',
                default: '',
                title: 'Description',
                description: 'Describes the current iteration',
              },
            },
            required: ['trackingIteration'],
          },
        },
        businessAssetsCount: {
          type: ['integer', 'null'],
          default: 0,
          description: 'Number of exisiting business asset(s)',
        },
        supportingAssetsCount: {
          type: ['integer', 'null'],
          default: 0,
          description: 'Number of exisiting supporting asset(s)',
        },
        risksCount: {
          type: ['integer', 'null'],
          default: 0,
          description: 'Number of exisiting risk(s)',
        },
        vulnerabilitiesCount: {
          type: ['integer', 'null'],
          default: 0,
          description: 'Number of exisiting vulnerabilitie(s)',
        },
      },
    },

    ProjectContext: {
      type: 'object',
      default: {},
      properties: {
        projectDescription: {
          type: 'string',
          default: '',
          format: 'htmlString',
          title: 'Project Description',
          description: 'Figures out the environment the solution deals with. It is done by specifying the scope of the risk assessment, who are the enemies and what are the threats. Project Description:',
        },
        projectURL: {
          default: '',
          // string with url format
          type: 'string',
          format: 'URL',
          title: 'Project URL',
          description: 'Click here to insert a hyperlink',
        },
        projectDescriptionAttachment: {
          // string with valid base64 format
          default: '',
          type: 'string',
          format: 'attachment',
          title: 'Project Descriptive Document',
          description: 'Click here to attach a file',
        },
        securityProjectObjectives: {
          type: 'string',
          format: 'htmlString',
          default: '',
          title: 'Security Project objectives',
          description: 'Describes the security objectives on this project from the project / product manager perspective',
        },
        securityOfficerObjectives: {
          type: 'string',
          format: 'htmlString',
          default: '',
          title: 'Security Officer objectives',
          description: 'Describes the security objectives on this project from the security officer perspective',
        },
        securityAssumptions: {
          type: 'string',
          format: 'htmlString',
          default: '',
          title: 'Assumptions',
          description: 'Describes the assumptions made on this project e.g what policies, regulations or standards applies in the context of this project',
        },
        useNewDecode: {
          type: 'boolean',
          default: true,
          description: 'Verifies if file attachment is decoded using old or new method',
        },
      },
    },

    BusinessAsset: {
      type: 'array',
      default: [],
      title: 'List of Business Assets',
      description: 'Describe the Business Assets managed or delivered in your product.',
      items: {
        type: 'object',
        properties: {
          businessAssetId: { type: ['integer', 'null'], default: 1, minimum: 1 },
          businessAssetName: {
            type: 'string',
            default: '',
            title: 'Name',
            description: 'Defines the unique name of the business asset',
          },
          businessAssetType: {
            type: 'string',
            default: 'Data',
            enum: ['', 'Data', 'Service'],
            title: 'Type',
            description: 'Identifies the business asset category',
          },
          businessAssetDescription: {
            type: 'string',
            default: '',
            format: 'htmlString',
          },
          businessAssetProperties: {
            type: 'object',
            default: {},
            properties: {
              businessAssetIdRef: { type: ['integer', 'null'], default: null },
              businessAssetConfidentiality: {
                type: ['integer', 'null'],
                default: 3,
                title: 'Confidentiality',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 0,
                    title: 'N/A',
                  },
                  {
                    const: 1,
                    title: 'Low',
                  },
                  {
                    const: 2,
                    title: 'Medium',
                  },
                  {
                    const: 3,
                    title: 'High',
                  },
                  {
                    const: 4,
                    title: 'Critical',
                  }],
                description: 'Estimates the loss on the business asset value if it is disclosed to unauthorized entities',
              },
              businessAssetIntegrity: {
                type: ['integer', 'null'],
                default: 3,
                title: 'Integrity',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 0,
                    title: 'N/A',
                  },
                  {
                    const: 1,
                    title: 'Low',
                  },
                  {
                    const: 2,
                    title: 'Medium',
                  },
                  {
                    const: 3,
                    title: 'High',
                  },
                  {
                    const: 4,
                    title: 'Critical',
                  }],
                description: 'Estimates the loss on the business asset value if it has been modified by unauthorized entities',
              },
              businessAssetAvailability: {
                type: ['integer', 'null'],
                default: 3,
                title: 'Avaliability',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 0,
                    title: 'N/A',
                  },
                  {
                    const: 1,
                    title: 'Low',
                  },
                  {
                    const: 2,
                    title: 'Medium',
                  },
                  {
                    const: 3,
                    title: 'High',
                  },
                  {
                    const: 4,
                    title: 'Critical',
                  }],
                description: 'Estimates the loss on the business asset value if it is not accessible and not usable by authorized users whenever needed',
              },
              businessAssetAuthenticity: {
                type: ['integer', 'null'],
                default: 3,
                title: 'Authenticity',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 0,
                    title: 'N/A',
                  },
                  {
                    const: 1,
                    title: 'Low',
                  },
                  {
                    const: 2,
                    title: 'Medium',
                  },
                  {
                    const: 3,
                    title: 'High',
                  },
                  {
                    const: 4,
                    title: 'Critical',
                  }],
                description: 'Estimates the loss on the business asset value if it has not been produced by a genuine entity',
              },
              businessAssetAuthorization: {
                type: ['integer', 'null'],
                default: 3,
                title: 'Authorization',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 0,
                    title: 'N/A',
                  },
                  {
                    const: 1,
                    title: 'Low',
                  },
                  {
                    const: 2,
                    title: 'Medium',
                  },
                  {
                    const: 3,
                    title: 'High',
                  },
                  {
                    const: 4,
                    title: 'Critical',
                  }],
                description: 'Estimates the loss on the business asset value if it can be accessed by entities with the wrong privileges',
              },
              businessAssetNonRepudiation: {
                type: ['integer', 'null'],
                default: 3,
                title: 'Non repudiation',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 0,
                    title: 'N/A',
                  },
                  {
                    const: 1,
                    title: 'Low',
                  },
                  {
                    const: 2,
                    title: 'Medium',
                  },
                  {
                    const: 3,
                    title: 'High',
                  },
                  {
                    const: 4,
                    title: 'Critical',
                  }],
                description: 'Estimates the loss on the business asset value if authorized access to it can be denied',
              },
            },
          },
        },
        required: ['businessAssetId'],
      },
    },

    SupportingAssetsDesc: {
      type: 'string',
      format: 'htmlString',
      default: '',
      title: 'Product architecture diagram',
      description: 'Because pictures are better than a long speech, you can submit here the architecture / infrastructure diagrams used to identify the supporting assets.It is a rich text section.You can copy/paste/insert images, resize it and add formatted text to explain your schemas.',
    },

    SupportingAsset: {
      type: 'array',
      default: [],
      title: 'List of Supporting Assets',
      description: 'Describe the Supporting Assets shown in the architecture diagram.All the Supporting Assets should appear in the diagram.',
      items: {
        type: 'object',
        properties: {
          supportingAssetId: {
            title: 'Id',
            type: ['integer', 'null'],
            default: 1,
            minimum: 1,
          },
          supportingAssetHLDId: { type: 'string', default: '', title: 'HLD Id' },
          supportingAssetName: {
            type: 'string',
            default: '',
            title: 'Name',
            description: 'Defines the unique name of the supporting asset',
          },
          supportingAssetType: {
            type: ['string'],
            default: '',
            enum: ['', 'Database', 'Operating System', 'Application Server', 'Application module', 'File', 'Log', 'Web Service',
              'Web User Interface', 'Remote API', 'Local API', 'Crypto-Key', 'Software application', 'Service Provider', 'Hardware device',
              'Computer', 'Human', 'Network', 'Server', 'Source code', 'Organization', 'Location', 'Process', 'Interface'],
            title: 'Type',
            description: 'Identifies the supporting asset category',
          },
          supportingAssetSecurityLevel: {
            type: ['integer', 'null'],
            default: -1,
            enum: [null, -2, -1, 0, 1, 2, 3],
            title: 'Network Security Level',
            description: 'Company secure zoning based on information sensitivity',
          },
          businessAssetRef: {
            type: 'array',
            default: [null],
            items: { type: ['integer', 'null'] },
            title: 'Supporting Asset / Business Assets.Relationship Matrix',
            description: 'Defines the list of supporting assets supporting business assets.',
          },
        },
        required: ['supportingAssetId'],
      },
    },

    Risk: {
      type: 'array',
      default: [],
      title: 'List of Identified Risks',
      description: 'A Risk is the combination of the probability of an event (likelihood) and its consequence (impact)',
      items: {
        type: 'object',
        properties: {
          riskId: { type: ['integer', 'null'], default: 1, minimum: 1 },
          projectNameRef: { type: 'string', default: '' },
          projectVersionRef: { type: 'string', default: '' },
          riskName: {
            type: 'object',
            default: {},
            title: 'Risk Name',
            description: 'As a Threat Agent, I can Threat the Business Asset compromising the Supporting Asset in order to Motivation, by exploiting the Vulnerability',
            properties: {
              riskIdRef: { type: ['integer', 'null'], default: null, minimum: 1 },
              riskName: { type: 'string', default: 'As a , I can  the  compromising the  in order to ' },
              threatAgent: {
                type: 'string',
                default: '',
                enum: ['', 'Insider', 'Criminal', 'Competitor', 'Criminal organization', 'Government agency', 'Researcher', 'Activist',
                  'Script Kiddy', 'User', 'R&D Employee', 'Operational Employee', 'Maintenance Employee', 'IT Employee'],
                title: 'As a Threat Agent',
                description: 'Is the individual or the organization which is motivated to corrupt Business Assets',
              },
              threatAgentDetail: {
                type: 'string',
                format: 'htmlString',
                default: '',
                title: 'Details:',
                description: 'Add your fomatted rich text and your pictures',
              },
              threatVerb: {
                type: 'string',
                default: '',
                enum: ['', 'lose', 'spoof', 'tamper with', 'repudiate', 'disclose', 'steal', 'deny access to',
                  'gain an unauthorized access to', 'flood'],
                title: 'I can Threat',
                description: 'Is anything that could cause harm to assets involved in the information security',
              },
              threatVerbDetail: {
                type: 'string',
                format: 'htmlString',
                default: '',
                title: 'Details:',
                description: 'Add your fomatted rich text and your pictures',
              },
              motivation: {
                type: 'string',
                default: '',
                title: 'In order to Motivation',
                description: 'Is the business asset value perceived by the agent',
              },
              motivationDetail: {
                type: 'string',
                format: 'htmlString',
                default: '',
                title: 'Details:',
                description: 'Add your fomatted rich text and your pictures',
              },
              businessAssetRef: {
                type: ['integer', 'null'],
                default: null,
                title: 'The Business Asset',
                description: 'Represents what makes value for the Customer or Gemalto. It can be information (sensitive data) or services (use case of the project)',
              },
              supportingAssetRef: {
                type: ['integer', 'null'],
                default: null,
                title: 'Compromising the Supporting Asset',
                description: 'Represents the means that are involved by and needed to support and protect the value chain. It can be technical data, software, servers, network components, secure elements',
              },
              isAutomaticRiskName: {
                type: ['boolean'],
                default: true,
                description: 'Verifies if Risk Name is automatic or manual',
              }
            },
          },
          riskLikelihood: {
            type: 'object',
            default: {},
            title: 'Likelihood evaluation',
            description: 'Chance for a threat agent to successfully attack the business asset based on resources, skill, opportunity, and motivation',
            properties: {
              riskIdRef: { type: ['integer', 'null'], default: null, minimum: 1 },
              riskLikelihood: {
                type: ['integer', 'null'],
                default: 3,
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 1,
                    title: 'Low',
                  },
                  {
                    const: 2,
                    title: 'Medium',
                  },
                  {
                    const: 3,
                    title: 'High',
                  },
                  {
                    const: 4,
                    title: 'Very High',
                  }],
              },
              riskLikelihoodDetail: {
                type: 'string',
                default: '',
                format: 'htmlString',
                title: 'Justify your likelihood evaluation',
                description: 'Add your fomatted rich text and your pictures',
              },
              skillLevel: {
                type: ['integer', 'null'],
                default: null,
                description: 'How technically skilled is this group of threat agents?',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 1,
                    title: 'Security penetration skills',
                  },
                  {
                    const: 3,
                    title: 'Network and programming skills',
                  },
                  {
                    const: 5,
                    title: 'Advanced computer skills',
                  },
                  {
                    const: 6,
                    title: 'Some technical skills',
                  },
                  {
                    const: 9,
                    title: 'No technical skill',
                  }],
              },
              reward: {
                type: ['integer', 'null'],
                default: null,
                description: 'How motivated is this group of threat agents to find and exploit this vulnerability?',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 1,
                    title: 'Low or no reward',
                  },
                  {
                    const: 4,
                    title: 'Possible reward',
                  },
                  {
                    const: 9,
                    title: 'High reward',
                  }],
              },
              accessResources: {
                type: ['integer', 'null'],
                default: null,
                description: 'What resources and opportunities are required for this group of threat agents to find and exploit this vulnerability?',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 0,
                    title: 'Full access or expensive resources required',
                  },
                  {
                    const: 4,
                    title: 'Special access or resources required',
                  },
                  {
                    const: 7,
                    title: 'Some access or resources required',
                  },
                  {
                    const: 9,
                    title: 'No access or resources required',
                  }],
              },
              size: {
                type: ['integer', 'null'],
                default: null,
                description: 'How large is this group of threat agents?',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 2,
                    title: 'Developers / system administrators',
                  },
                  {
                    const: 4,
                    title: 'Intranet users',
                  },
                  {
                    const: 5,
                    title: 'Partners',
                  },
                  {
                    const: 6,
                    title: 'Authenticated users',
                  },
                  {
                    const: 9,
                    title: 'Anonymous Internet users',
                  }],
              },
              intrusionDetection: {
                type: ['integer', 'null'],
                default: null,
                description: 'How likely is an exploit to be detected?',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 1,
                    title: 'Active detection in application',
                  },
                  {
                    const: 3,
                    title: 'Logged and reviewed',
                  },
                  {
                    const: 8,
                    title: 'Logged without review',
                  },
                  {
                    const: 9,
                    title: 'Not logged',
                  }],
              },
              threatFactorScore: {
                type: ['number', 'null'],
                default: null,
                minimum: 0,
                description: 'Average of threat factors',
              },
              threatFactorLevel: {
                type: 'string',
                default: '',
                enum: ['', 'Low', 'Medium', 'High', 'Very High'],
              },
              occurrence: {
                type: ['integer', 'null'],
                default: null,
                description: 'What is the probability of occurrence?',
                anyOf: [
                  {
                    const: null,
                  },
                  {
                    const: 1,
                    title: 'Very low',
                  },
                  {
                    const: 3,
                    title: 'Low (it happened)',
                  },
                  {
                    const: 5,
                    title: 'Medium (it already happened in similar companies)',
                  },
                  {
                    const: 7,
                    title: 'High (it already happened in Thales DIS)',
                  },
                  {
                    const: 9,
                    title: 'Very high (it will happen)',
                  }],
              },
              occurrenceLevel: {
                type: 'string',
                default: '',
                enum: ['', 'Low', 'Medium', 'High', 'Very High'],
              },
              isOWASPLikelihood: {
                type: ['boolean'],
                default: true,
                description: 'Verifies if Risk Likelihood is OWASP or simple',
              }
            },
          },
          riskImpact: {
            type: 'object',
            default: {},
            title: 'Impact Evaluation',
            description: 'Select the Business Asset security properties you want to take into account for this risk evaluation',
            properties: {
              riskIdRef: { type: ['integer', 'null'], default: null, minimum: 1 },
              riskImpact: { type: ['integer', 'null'], default: null },
              businessAssetConfidentialityFlag: {
                type: ['integer', 'null'],
                default: 1,
                enum: [null, 0, 1],
                title: 'Business Asset Security Property',
                description: 'Confidentiality',
              },
              businessAssetIntegrityFlag: {
                type: ['integer', 'null'],
                default: 1,
                enum: [null, 0, 1],
                title: 'Business Asset Security Property',
                description: 'Integrity',
              },
              businessAssetAvailabilityFlag: {
                type: ['integer', 'null'],
                default: 1,
                enum: [null, 0, 1],
                title: 'Business Asset Security Property',
                description: 'Availability',
              },
              businessAssetAuthenticityFlag: {
                type: ['integer', 'null'],
                default: 1,
                enum: [null, 0, 1],
                title: 'Business Asset Security Property',
                description: 'Authetication',
              },
              businessAssetAuthorizationFlag: {
                type: ['integer', 'null'],
                default: 1,
                enum: [null, 0, 1],
                title: 'Business Asset Security Property',
                description: 'Authorization',
              },
              businessAssetNonRepudiationFlag: {
                type: ['integer', 'null'],
                default: 1,
                enum: [null, 0, 1],
                title: 'Business Asset Security Property',
                description: 'Non Repudiation',
              },
            },
          },
          riskAttackPaths: {
            type: 'array',
            default: [],
            title: 'Vulnerability Evaluation',
            description: 'What is the vulnerability on your supporting asset that should be taken into account for this risk?',
            items: {
              type: 'object',
              title: 'Attack Path',
              properties: {
                riskIdRef: { type: ['integer', 'null'], default: null, minimum: 1 },
                riskAttackPathId: { type: ['integer', 'null'], default: null, minimum: 1 },
                vulnerabilityRef: {
                  type: 'array',
                  default: [],
                  items: {
                    type: 'object',
                    properties: {
                      rowId: { type: 'integer' },
                      vulnerabilityIdRef: { type: ['integer', 'null'], default: null },
                      score: {
                        type: ['integer', 'null'],
                        default: null,
                      },
                      name: { type: 'string', default: '' },
                    },
                    required: ['vulnerabilityIdRef', 'score', 'name'],
                  },
                },
                attackPathName: {
                  type: 'string',
                  default: '',
                  description: 'Concatenate all vulnerability name (AND)',
                },
                attackPathScore: {
                  type: ['number', 'null'],
                  default: null,
                  description: 'Minimum value from all overall score',
                },
              },
              required: ['riskAttackPathId'],
            },
          },
          allAttackPathsName: {
            type: 'string',
            default: '',
            description: 'Concatenate all attack path name (OR)',
          },
          allAttackPathsScore: {
            type: ['number', 'null'],
            default: null,
            title: 'The vulnerability scoring of worst attack path is: /10',
            description: 'Maximum value from all attack path scores',
          },
          inherentRiskScore: { type: ['integer', 'null'], default: 0, minimum: 0 },
          riskMitigation: {
            type: 'array',
            default: [],
            title: 'Risk Mitigation',
            description: 'Define here the different controls and counter measures that could mitigate the risk',
            items: {
              type: 'object',
              properties: {
                riskIdRef: { type: ['integer', 'null'], default: null, minimum: 1 },
                riskMitigationId: { type: ['integer', 'null'], default: null, minimum: 1 },
                description: {
                  type: 'string',
                  format: 'htmlString',
                  default: '',
                  title: 'Security Control Description',
                  description: 'Add your fomatted rich text and your pictures',
                },
                benefits: {
                  type: ['number', 'null'],
                  default: null,
                  title: 'Expected Benefits',
                  anyOf: [{
                    const: null,
                  },
                  {
                    const: 0,
                  },
                  {
                    const: 1,
                    title: '100%',
                  },
                  {
                    const: 0.9,
                    title: '90%',
                  },
                  {
                    const: 0.75,
                    title: '75%',
                  },
                  {
                    const: 0.5,
                    title: '50%',
                  },
                  {
                    const: 0.25,
                    title: '25%',
                  },
                  {
                    const: 0.1,
                    title: '10%',
                  }
                ],
                },
                cost: {
                  type: ['number', 'null'],
                  default: null,
                  title: 'Estimated Cost (md)',
                  errorMessage: 'Only integers allowed.',
                },
                decision: {
                  type: 'string',
                  default: '',
                  title: 'Mitigation Decision',
                  anyOf: [{
                    const: '',
                    title: 'Not defined',
                  },
                  {
                    const: 'Rejected',
                    title: 'Rejected',
                  },
                  {
                    const: 'Accepted',
                    title: 'Accepted',
                  },
                  {
                    const: 'Postponed',
                    title: 'Postponed',
                  },
                  {
                    const: 'Done',
                    title: 'Done',
                  }],
                },
                decisionDetail: {
                  type: 'string',
                  format: 'htmlString',
                  default: '',
                  title: 'Decision comment',
                  description: 'Add your fomatted rich text and your pictures',
                },
              },
              required: ['riskMitigationId'],
            },
          },
          mitigationsBenefits: {
            type: ['number', 'null'],
            default: 1,
            description: 'Taking into account mitigations done or acccepted',
          },
          mitigationsDoneBenefits: {
            type: ['number', 'null'],
            default: 1,
            description: 'Taking into account mitigations done',
          },
          mitigatedRiskScore: {
            type: ['integer', 'null'],
            default: 0,
            minimum: 0,
            title: 'Mitigated Risk Score',
            description: 'Taking into account mitigations accepted or done',
          },
          riskManagementDecision: {
            type: 'string',
            default: '',
            title: 'Decision',
            description: 'Decided action on risk',
            anyOf: [{
              const: '',
              title: 'Not defined',
            },
            {
              const: 'Discarded',
              title: 'Discarded',
            },
            {
              const: 'Avoid',
              title: 'Avoid (Avoid)',
            },
            {
              const: 'Transfer',
              title: 'Share (Transfer)',
            },
            {
              const: 'Mitigate',
              title: 'Reduce (Mitigate)',
            },
            {
              const: 'Accept',
              title: 'Retain (Accept)',
            }],
          },
          riskManagementDetail: {
            type: 'string',
            format: 'htmlString',
            default: '',
            title: 'Decision details (who take the decision, who must do what, what and when)',
            description: 'Add your fomatted rich text and your pictures',
          },
          residualRiskScore: {
            type: ['integer', 'null'],
            default: 0,
            minimum: 0,
            title: 'Residual Risk Score',
            description: 'Taking into account mitigations done',
          },
          residualRiskLevel: {
            type: 'string',
            default: 'Low',
            enum: ['', 'Low', 'Medium', 'High', 'Critical'],
            title: 'Residual Risk Level',
          },
        },
        required: ['riskId'],
      },
    },

    Vulnerability: {
      type: 'array',
      default: [],
      description: 'Vulnerability evaluation for CVSSV2 or CVSSV3',
      items: {
        type: 'object',
        properties: {
          projectNameRef: {
            type: 'string',
            default: '',
            description: 'Identify vulnerability based on project name',
          },
          projectVersionRef: {
            type: 'string',
            default: '',
            description: 'Identify vulnerability based on project version',
          },
          vulnerabilityId: { type: ['integer', 'null'], default: 1, minimum: 1 },
          vulnerabilityName: {
            type: 'string',
            default: '',
            description: 'Input given name of vulnerability',
          },
          vulnerabilityFamily: {
            type: ['string'],
            default: '',
            description: 'Type of vulnerability',
            enum: ['', 'API Abuse', 'Authentication Vulnerability', 'Authorization Vulnerability',
              'Availability Vulnerability', 'Code Permission Vulnerability', 'Code Quality Vulnerability',
              'Configuration Vulnerability', 'Cryptographic Vulnerability', 'Encoding Vulnerability',
              'Environmental Vulnerability', 'Error Handling Vulnerability', 'General Logic Error Vulnerability',
              'Input Validation Vulnerability', 'Logging and Auditing Vulnerability', 'Password Management Vulnerability',
              'Path Vulnerability', 'Protocol Errors', 'Range and Type Error Vulnerability', 'Sensitive Data Protection Vulnerability',
              'Session Management Vulnerability', 'Synchronization and Timing Vulnerability', 'Unsafe Mobile Code', 'Use of Dangerous API'],
          },
          vulnerabilityTrackingID: {
            type: 'string',
            default: '',
            description: 'Input tracking id',
          },
          vulnerabilityTrackingURI: {
            default: '',
            type: 'string',
            format: 'URL',
          },
          vulnerabilityDescription: {
            type: 'string',
            format: 'htmlString',
            default: '',
            description: 'Add your fomatted rich text and your pictures',
          },
          vulnerabilityDescriptionAttachment: {
            // string with valid base64 format
            default: '',
            type: 'string',
            format: 'attachment',
          },
          vulnerabilityCVE: {
            default: 'CVSS:2.0/AV:L/AC:M/Au:N/C:P/I:P/A:P/E:ND/RL:ND/RC:ND',
            description: 'CVSS:2.0/AV:?/AC:?/Au:?/C:?/I:?/A:?/E:?/RL:?/RC:? or CVSS:3.?/AV:?/AC:?/PR:?/UI:?/S:?/C:?/I:?/A:?/E:?/RL:?/RC:?',
            errorMessage: 'CVSS vector is invalid',
            type: 'string',
            format: 'vectorString',
          },
          cveScore: {
            type: ['number', 'null'],
            default: 4.37803212315,
            description: 'Input calculated cve score',
            errorMessage: 'The CVSS Score must be defined between 0 and 10 (inclusive)',
          },
          overallScore: {
            type: ['null', 'number'],
            default: 4,
            title: 'Vulnerability scoring',
          },
          overallLevel: {
            type: 'string',
            default: 'Medium',
            enum: ['None', 'Low', 'Medium', 'High', 'Critical'],
            title: 'Vulnerability level',
          },
          supportingAssetRef: {
            type: 'array',
            default: [],
            items: { type: 'integer' },
            description: 'Supporting asset(s) potentially impacted by this vulnerability',
          },
          useNewDecode: {
            type: 'boolean',
            default: true,
            description: 'Verifies if file attachment is decoded using old or new method',
          },
        },
        required: ['vulnerabilityId'],
      },
    },
  },
  required: ['ISRAmeta', 'ProjectContext', 'BusinessAsset', 'SupportingAssetsDesc', 'SupportingAsset', 'Risk', 'Vulnerability'],
};

module.exports = jsonSchema;
