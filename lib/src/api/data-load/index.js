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

const validateJSONschema = require('../xml-json/validate-json-schema');
const populateClass = require('../xml-json/populate-class');
const DataDecrypt = require('../data-decrypt/index');

/**
  * Load existing json file if any
  * @function DataLoad
  * @param {ISRAProject} israProject ISRA Project instance
  * @return {Promise}
  * @throws reject the promise in case of error
*/
const DataLoad = (filePath, password=null) => {
  // read contents of file

    try {
      const data = fs.readFileSync(filePath, 'utf8') 
      let jsonData = JSON.parse(data);
      if (password){
        jsonData = DataDecrypt(jsonData,password)
      }
      if (!jsonData.ISRAmeta.schemaVersion) {
        const risks = jsonData.Risk
        risks.forEach((risk) => {
          const riskNameObject = risk.riskName
          delete risk.riskName
          Object.keys(riskNameObject).forEach((field) => {
            risk[field] = riskNameObject[field]
          });
        });

        const vulnerabilities = jsonData.Vulnerability;
          const vulIdMap = {};
          vulnerabilities.forEach((vulnerability) => {
            vulIdMap[vulnerability.vulnerabilityName] = vulnerability.vulnerabilityId;
          });

          jsonData.Risk.forEach((risk) => {
            
            const riskAttackPaths = risk.riskAttackPaths;
            riskAttackPaths.forEach((riskAttackPath)=> {
                
                const vulnerabilityRef = riskAttackPath.vulnerabilityRef;
                const validRefs = []
                 vulnerabilityRef.forEach((ref)=> {
                  if (!(ref.name === '')) {
                    delete ref.rowId  

                    ref.vulnerabilityId = vulIdMap[ref.name];
                    validRefs.push(ref)
                  }
                  
                });
                
                riskAttackPath.vulnerabilityRef = validRefs
               
            });
        });


      } else if (jsonData.ISRAmeta.schemaVersion > 3) {
        throw Error(`Unable to load schema version ${jsonData.ISRAmeta.schemaVersion}, this version only supports 3 and below`)
      }


      

      
      const iterations = jsonData.ISRAmeta.ISRAtracking
      jsonData .ISRAmeta.iteration = jsonData .ISRAmeta.ISRAtracking.length
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
            jsonData.ISRAmeta.ISRAtracking[index].trackingDate = newDate;
          } else {
            jsonData.ISRAmeta.ISRAtracking[index].trackingDate = '';
          }
        }
      }

      const validJSONData = validateJSONschema(jsonData);

      const israProject = new ISRAProject();
      populateClass(validJSONData, israProject);
      return israProject;
    } catch (error) {
      console.log(error.message)

      if (error.code == "ENOENT") {
        return new Error('Failed to open file')
      } else if (error.message == "Cannot read properties of undefined (reading 'ISRAtracking')") {
        throw Error('Invalid ISRA JSON')
      } else {
        throw Error(error);
      }
      
    }

}


module.exports = DataLoad;