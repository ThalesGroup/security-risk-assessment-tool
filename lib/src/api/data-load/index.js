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

/**
  * Load existing json file if any
  * @function DataLoad
  * @param {ISRAProject} israProject ISRA Project instance
  * @return {Promise}
  * @throws reject the promise in case of error
*/
const DataLoad = (israProject, filePath) => new Promise((resolve, reject) => {
  // read contents of file
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      // reject the promise in case of error
      reject(new Error('Failed to open file'));
    }

    try {
      const jsonData = JSON.parse(data);
      console.log(jsonData)
      const iterations = jsonData.ISRAmeta.ISRAtracking
      const newTrackings = []
      iterations.forEach((iteration ) => {
        console.log(iteration.trackingDate)
        const currentDate = new Date(iteration.trackingDate)
        const incorrectFormat = currentDate.toISOString();
        if (incorrectFormat === currentDate) {
          // Update each individual tracking JSON to update the date field
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2,'0');
          const formattedDate = `${year}-${month}-${day}`;
          iteration.trackingDate = formattedDate
          newTrackings.push(iteration)
          console.log(newTrackings)
        }
      });

      if (newTrackings) {
        //Update ISRAtracking in jsonData
        jsonData.ISRAmeta.ISRAtracking = newTrackings
      }
      console.log(jsonData.ISRAmeta.ISRAtracking)
      const validJSONData = validateJSONschema(jsonData);
      populateClass(validJSONData, israProject);
      resolve('Done load');
    } catch (error) {
      reject(error);
    }
  });
});

module.exports = DataLoad;
