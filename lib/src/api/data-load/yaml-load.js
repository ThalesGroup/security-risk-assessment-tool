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
const ISRAProject = require('../../model/classes/ISRAProject/isra-project');

// To switch to another file
const ISRAMetaTracking = require('../../model/classes/ISRAProject/isra-meta-tracking');
const SupportingAsset = require('../../model/classes/SupportingAsset/supporting-asset');
const BusinessAsset = require('../../model/classes/BusinessAsset/business-asset');
const BusinessAssetProperties = require('../../model/classes/BusinessAsset/business-asset-properties');
const Risk = require('../../model/classes/Risk/risk');
const RiskName = require('../../model/classes/Risk/risk-name');
const RiskLikelihood = require('../../model/classes/Risk/risk-likelihood');
const RiskImpact = require('../../model/classes/Risk/risk-impact');
const RiskAttackPath = require('../../model/classes/Risk/risk-attack-path');
const RiskMitigation = require('../../model/classes/Risk/risk-mitigation');
const Vulnerability = require('../../model/classes/Vulnerability/vulnerability');

const validateJSONschema = require('../xml-json/validate-json-schema');
const populateClass = require('../xml-json/populate-class');
const yaml = require('yaml')

/**
  * Load existing yaml file if any
  * @function DataLoad
  * @param {ISRAProject} israProject ISRA Project instance
  * @return {Promise}
  * @throws reject the promise in case of error
*/
const YamlLoad = (israProject, filePath) => new Promise((resolve, reject) => {
  // read contents of file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      // reject the promise in case of error
      reject(new Error('Failed to open file'));
    }

    try {
      const yamlData = yaml.parse(data);
      // OWASP Threat Dragon
      if (yamlData.summary) {
        const newISRA = new ISRAProject()
        // reset static idCount
        BusinessAsset.setIdCount(0);
        

        // add  table rows/columns
        newISRA.addMetaTracking(new ISRAMetaTracking());
        newISRA.addBusinessAsset(new BusinessAsset());
        

        // Update SAs
        const saTypeMap = {'tm.Store': 'Database', 'tm.Process' : 'Process'}
        const validAssets = ["store","process"];
        const diagrams = yamlData.detail.diagrams;
        let highestSAId = 0;
        diagrams.forEach((diagram) => {
          const components = diagram.cells
          components.forEach((component) => {
            if (validAssets.includes(component.shape)) {
              // Supporting Assets 
              highestSAId += 1
              const supportingAsset = new SupportingAsset();
              supportingAsset.addBusinessAssetRef(null);
              supportingAsset.supportingAssetId = highestSAId;
              supportingAsset.supportingAssetName = component.data.name;
              supportingAsset.supportingAssetType = saTypeMap[component.data.type];
              supportingAsset.supportingAssetDesc = component.data.description;
              newISRA.addSupportingAsset(supportingAsset);

              // Risks
              // risk.type 
              // riskMitigation 

              // Vulnerabilities 
              // vulnerability.vulnerabilityName title
              // vulnerability.vulnerabilityDescription description 


            }
          });
        });
        SupportingAsset.setIdCount(highestSAId);
        Risk.setIdCount(0);
        Vulnerability.setIdCount(0);
        
        
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
        newISRA.addVulnerability(new Vulnerability());
        
        // Update vulnerabilities 
        console.log(newISRA.toJSON())
        populateClass(JSON.parse(newISRA.toJSON()), israProject);
        //const validJSONData = validateJSONschema(newISRA.toJSON());
        
      } else {
        const iterations = yamlData.ISRAmeta.ISRAtracking
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
            yamlData.ISRAmeta.ISRAtracking[index].trackingDate = newDate;
          } else {
            yamlData.ISRAmeta.ISRAtracking[index].trackingDate = '';
          }
        }
      }
        const validJSONData = validateJSONschema(yamlData);
        populateClass(validJSONData, israProject);
      }
      


      //console.log(jsonData.ISRAmeta.ISRAtracking)
      
      resolve('Done load');
    } catch (error) {
      reject(error);
    }
  });
});

module.exports = YamlLoad;
