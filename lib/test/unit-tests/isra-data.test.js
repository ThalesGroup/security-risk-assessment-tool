const { DataNew } = require('../../src/api/index');
const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');
const ISRAMetaTracking = require('../../src/model/classes/ISRAProject/isra-meta-tracking');
const SupportingAsset = require('../../src/model/classes/SupportingAsset/supporting-asset');
const BusinessAsset = require('../../src/model/classes/BusinessAsset/business-asset');
const BusinessAssetProperties = require('../../src/model/classes/BusinessAsset/business-asset-properties');
const Risk = require('../../src/model/classes/Risk/risk');
const RiskName = require('../../src/model/classes/Risk/risk-name');
const RiskLikelihood = require('../../src/model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../src/model/classes/Risk/risk-impact');
const RiskAttackPath = require('../../src/model/classes/Risk/risk-attack-path');
const RiskMitigation = require('../../src/model/classes/Risk/risk-mitigation');
const Vulnerability = require('../../src/model/classes/Vulnerability/vulnerability');
const validateJSONschema = require('../../src/api/xml-json/validate-json-schema');
const populateClass = require('../../src/api/xml-json/populate-class');
const ISRA_JSON_1 = require('./data/ISRA-JSON-1.json');

describe('Initialize new ISRA', () => {

    it('UTCX: Null ISRA', () => {

        expect(populateClass(null, new ISRAProject())).toBeUndefined();
        
    });

    it('UTCX: New ISRA', () => {
        const israProject = new ISRAProject();

        // reset static idCount
        BusinessAsset.setIdCount(0);
        SupportingAsset.setIdCount(0);
        Risk.setIdCount(0);
        Vulnerability.setIdCount(0);

        // add  table rows/columns
        israProject.addMetaTracking(new ISRAMetaTracking());
        israProject.addBusinessAsset(new BusinessAsset());
        const supportingAsset = new SupportingAsset();
        supportingAsset.addBusinessAssetRef(null);
        israProject.addSupportingAsset(supportingAsset);
        israProject.addRisk(new Risk());
        const risk = israProject.getRisk(1);
        const riskAttackPath = new RiskAttackPath();
        riskAttackPath.addVulnerability({
            rowId: 1,
            score: null,
            name: '',
        });
        risk.addRiskAttackPath(riskAttackPath);
        risk.addRiskMitigation(new RiskMitigation());
        israProject.addVulnerability(new Vulnerability());

        expect(populateClass(null, new ISRAProject())).toBeUndefined();
        
    });
});

describe('Initialize validated existing ISRA', () => {
    it('Normal ISRA', () => {
        const israProject = new ISRAProject();
        const validJSONData = validateJSONschema(JSON.parse(ISRA_JSON_1));
        expect(populateClass(validJSONData, israProject)).toBeUndefined();
        expect(JSON.parse(israProject.toJSON())).toEqual(ISRA_JSON_1);
       
    });

    it('ISRA with empty fields', () => {
        // Use two datasets
        
        
    });

    it('ISRA with invalid fields', () => {
        // Need to create a class comparator
        
        
    });

    it('ISRA with invalid and empty fields', () => {
        // Need to create a class comparator
        
        
    });
});