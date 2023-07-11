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

const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const ISRAProject = require('../../model/classes/ISRAProject/isra-project');
const parser = require('./parser');
const alterISRA = require('./alter-isra/alter-isra');
const validateJsonSchema = require('./validate-json-schema');
const populateClass = require('./populate-class');

// To switch to another file
const ISRAMetaTracking = require('../../model/classes/ISRAProject/isra-meta-tracking');
const SupportingAsset = require('../../model/classes/SupportingAsset/supporting-asset');
const BusinessAsset = require('../../model/classes/BusinessAsset/business-asset');
const BusinessAssetProperties = require('../../model/classes/BusinessAsset/business-asset-properties');
//const ISRAProjectContext = require('../ISRAProjectContext/isra-project-context'); Please update directory
const Risk = require('../../model/classes/Risk/risk');
const RiskName = require('../../model/classes/Risk/risk-name');
const RiskLikelihood = require('../../model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../model/classes/Risk/risk-impact');
const RiskAttackPath = require('../../model/classes/Risk/risk-attack-path');
const RiskMitigation = require('../../model/classes/Risk/risk-mitigation');
const Vulnerability = require('../../model/classes/Vulnerability/vulnerability');

/**
  * Write xml data to keep for reference
  * @function writeFile
  * @param {object} israJSONData - xml file content
*/
// const writeFile = (resultJSON) => {
//   fs.writeFile(`${__dirname}/xmlTemplate.json`, JSON.stringify(resultJSON, null, 4), (err) => {
//     if (err) throw err;
//   });
// };

/**
  * Parses imported ISRA XML into JSON using xml2js, validate JSON against
  * schema using ajv, and populates class attributes
  * @function XML2JSON
  * @param {string} filePath - path location to uploaded file
  * @return {ISRAProject} israProject - new instance of israProject with populated values from xml
  * @throws errors from functions parser, alterISRA, validateJsonSchema & populateClass
*/


const XML2JSON = (filePath) => {
  const xmlData = fs.readFileSync(filePath, 'utf8');
  const resultJSON = parser(xmlData);

  // writeFile(resultJSON);
  const israProject = new ISRAProject();

  if (resultJSON.cairis_model) {

    const newISRA = new ISRAProject()
    console.log(resultJSON.cairis_model.cairis[0].project_settings)
    //newISRA.projectName = resultJSON.cairis_model.cairis[0].project_settings.$.name
    // add project context = project_settings.background
    // securityProjectObjectives = project_settings.strategic_goals
    // 

    // add  table rows/columns
    newISRA.addMetaTracking(new ISRAMetaTracking());
    // Iteration: 
    // iteration_data = resultJSON.cairis_model.cairis[0].project_settings.revisions.$.date


    console.log(resultJSON.cairis_model.riskanalysis[0].asset[0])
    console.log(resultJSON.cairis_model.riskanalysis[0].asset[0].$)
    console.log(resultJSON.cairis_model.riskanalysis[0].asset[0].$.name)
    console.log(resultJSON.cairis_model.riskanalysis[0].asset[0].description)

    // Update SAs
    const saTypeMap = {'tm.Store': 'Database', 'tm.Process' : 'Process'}
    const validAssets = {"Information" : "Data","Systems": "Computer","Software" : "Software application","Hardware" : "Hardware device", "Person" : "Human"};
    const assets = resultJSON.cairis_model.riskanalysis[0].asset;
    const risks = resultJSON.cairis_model.riskanalysis[0].risk;
    const mitigation = resultJSON.cairis_model.riskanalysis[0].response;
    const businessAssetRef = resultJSON.cairis_model.riskanalysis[0].asset_association;
    const vulnerabilities = resultJSON.cairis_model.riskanalysis[0].vulnerability;
    let highestSAId = 0;
    let highestBAId = 0;
    let highestVulId = 0;
    const baIdMap = {};
    const saIdMap = {};
    // BA and SA
    assets.forEach((asset) => { 

      
      if (validAssets[asset.$.type]) { // Change this to a "get" method to handle null
        // Business Asset
        if (asset.$.type === 'Information') {
          highestBAId += 1
          const businessAsset = new BusinessAsset();
          businessAsset.businessAssetId = highestBAId;
          businessAsset.businessAssetName = asset.$.name;
          // Update baIdMap
          baIdMap[asset.$.name] = highestBAId
          businessAsset.businessAssetType = validAssets[asset.$.type];
          businessAsset.businessAssetDescription = `<p>${asset.description}</p>`;
          //businessAsset.businessAssetProperties = asset._name; Loop through asset.security_property and add to businessAssetProperties object
          // BusinessAssetProperties
          //const businessAssetProperties = new BusinessAssetProperties()
          //businessAssetProperties.
          //businessAsset.businessAssetProperties = 
          newISRA.addBusinessAsset(businessAsset);

        // Supporting Asset
        } else {
          highestSAId += 1
          const supportingAsset = new SupportingAsset();
          //supportingAsset.addBusinessAssetRef(null);
          supportingAsset.supportingAssetId = highestSAId;
          // Update saIdMap
          saIdMap[asset.$.name] = highestSAId
          supportingAsset.supportingAssetName = asset.$.name;
          supportingAsset.supportingAssetType = validAssets[asset.$.type];
          newISRA.addSupportingAsset(supportingAsset);
        }
      }
      
      
    });

    // BusinessAssetRef
    console.log(newISRA.properties.SupportingAsset)
    console.log(newISRA.getSupportingAsset(1))
    businessAssetRef.forEach((ref) => { 
      const supportingAssetName = ref.$.head_name
      const supportingAssetId = saIdMap[supportingAssetName]
      const businessAssetName = ref.$.tail_name
      const businessAssetId = baIdMap[businessAssetName]

      if (businessAssetId && supportingAssetId) {
        const supportingAsset = newISRA.getSupportingAsset(supportingAssetId)
        if (!supportingAsset.properties.businessAssetRef.includes(businessAssetId)) {
          supportingAsset.addBusinessAssetRef(Number(businessAssetId))
        }
        
        
      }
      
      



    });
    


    const vulFamilyMap = {"Configuration": "Configuration Vulnerability"};

    vulnerabilities.forEach((vulnerability) => {
      highestVulId += 1;
      const newVulnerability = new Vulnerability();
      newVulnerability.vulnerabilityId = highestVulId
      newVulnerability.vulnerabilityName = vulnerability.$.name;
      newVulnerability.vulnerabilityDescription = `<p>${vulnerability.description}</p>`;
      //newVulnerability.vulnerabilityFamily = vulFamilyMap[vulnerability.$.type] Please update the mapping first 
      // for supportingAssetRef, loop through vulnerability.vulnerable_asset -> asset._name
      vulnerability.vulnerability_environment[0].vulnerable_asset.forEach((supportingAsset) => {
        const supportingAssetId = saIdMap[supportingAsset.$.name]
        //console.log(supportingAssetId)
        if (supportingAssetId) {
          newVulnerability.addSupportingAssetRef(Number(supportingAssetId))
        }
        
      });
      
      newISRA.addVulnerability(newVulnerability);

    });
    SupportingAsset.setIdCount(highestSAId);
    Risk.setIdCount(0);
    Vulnerability.setIdCount(highestVulId);
    BusinessAsset.setIdCount(highestBAId);
    
    
    newISRA.addRisk(new Risk());
    const risk = newISRA.getRisk(1);
    const riskAttackPath = new RiskAttackPath();
    riskAttackPath.addVulnerability({
      rowId: 1,
      score: null,
      name: '',
    });
    risk.addRiskAttackPath(riskAttackPath);
    risk.addRiskMitigation(new RiskMitigation());
    
    
    // Update vulnerabilities 
    console.log(newISRA.toJSON())
    populateClass(JSON.parse(newISRA.toJSON()), israProject);

  } else {
  const israJSONData = alterISRA(resultJSON.ISRA, xmlData);
  const iterations = israJSONData.ISRAmeta.ISRAtracking
  const dateFormat = new RegExp('(^\\d\\d\\d\\d-[0-1]\\d-[0-3]\\d$)' 
  + '|(^$)')
  for (var index = 0; index < iterations.length; index++) {
    const currentDate = iterations[index].trackingDate
    const validFormat = dateFormat.test(currentDate)
    const isValidDate = !isNaN(new Date(currentDate));
    if (!validFormat) {
      if (isValidDate) {
        // convert to correct format
        const date = new Date(currentDate);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const newDate = year + '-' + month + '-' + day;
        israJSONData.ISRAmeta.ISRAtracking[index].trackingDate = newDate;
      } else {
        israJSONData.ISRAmeta.ISRAtracking[index].trackingDate = '';
      }
    }
  }

  const israValidJSONData = validateJsonSchema(israJSONData);
 

  
  populateClass(israValidJSONData, israProject);
  }

  
  return israProject;
};

module.exports = XML2JSON;
