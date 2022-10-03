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

const { getHTMLString } = require('../utility');

/** modify parsed ISRA JSON to fit schema
       * @function alterProjectContext
       * @param {object} projectContext - projectContext JSON that has been parsed
       * @param {string} xmlDAta - content of xml file
       * @returns {object} edited projectContext JSON data
       * */
const alterProjectContext = (xmlData, projectContext) => {
  const pc = projectContext;
  Object.entries(pc[0]).forEach((entry) => {
    const [key, value] = entry;
    if (key !== 'projectDescriptionAttachment'
        && key !== 'projectURL') {
      pc[0][key] = getHTMLString(xmlData, key);
    }
    if (key === 'projectDescriptionAttachment'){
      if (value[0] !== '') pc[0]['useNewDecode'] = false;
      else pc[0]['useNewDecode'] = true;
    }
  });
  
  return pc;
};

module.exports = alterProjectContext;
