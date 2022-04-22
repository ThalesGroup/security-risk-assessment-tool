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

const path = 'lib/src/api/data-store/ISRAProject.json';
const validateJSONschema = require('../xml-json/validate-json-schema');
const populateClass = require('../xml-json/populate-class');

/**
  * Parses imported ISRA XML into JSON
  * @function DataLoad
  * @param {ISRAProject} israProject ISRA Project instance
  * @throws if result is undefined: XML not well formed at (position of xml element)
  * @throws if result is null/ result.ISRA is undefined: Invalid ISRA XML
*/
const DataLoad = (israProject) => new Promise((resolve, reject) => {
  fs.access(path, (error) => {
    if (!error) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          console.log(`Error reading file: ${err}`);
          // reject the promise in case of error
          reject(err);
        }
        setTimeout(() => {
          // resolve the promise after successfull execution of asynchronous code
          const jsonData = JSON.parse(data);
          resolve(
            validateJSONschema(jsonData),
            populateClass(jsonData, israProject),
          );
        }, 2000);
      });
    } else {
      console.log("File doesn't exists");
      // reject the promise in case of error
      reject(error);
    }
  });
});

module.exports = DataLoad;

// fs.access(path, (error) => {
//     if (!error) {
//       fs.readFile(path, 'utf8', (err, data) => {
//         if (err) {
//           console.error(err);
//           return;
//         }
//         populateClass(JSON.parse(data), israProject);
//       });
//     } else {
//       console.log("doesn't exists");
//     }
//   });
