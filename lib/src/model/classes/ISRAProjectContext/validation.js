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
const jsonSchema = require('../../schema/json-schema').properties.ProjectContext.properties;
const validateClassProperties = require('../validation/validate-class-properties');

/** validate project description in ISRAProjectContext
    * @param {string} val value intended to be populated into projectDescription class property
    * @return {boolean}
  */
const isProjectDescription = (val) => {
  const subSchema = jsonSchema.projectDescription;
  return validateClassProperties(val, subSchema);
};

/** validate project URL in ISRAProjectContext
    * @param {string} val value intended to be populated into projectURL class property
    * @return {boolean}
  */
const isProjectURL = (val) => {
  const subSchema = jsonSchema.projectURL;
  return validateClassProperties(val, subSchema);
};

/** validate project description attachment in ISRAProjectContext
    * @param {string} val value intended to be populated into
    * projectDescriptionAttachment class property
    * @return {boolean}
  */
const isProjectDescriptionAttachment = (val) => {
  const subSchema = jsonSchema.projectDescriptionAttachment;
  return validateClassProperties(val, subSchema);
};

/** validate security project objectives in ISRAProjectContext
    * @param {string} val value intended to be populated into
    * securityProjectObjectives class property
    * @return {boolean}
  */
const isSecurityProjectObjectives = (val) => {
  const subSchema = jsonSchema.securityProjectObjectives;
  return validateClassProperties(val, subSchema);
};

/** validate security officer objectives in ISRAProjectContext
    * @param {string} val value intended to be populated into
    * securityOfficerObjectives class property
    * @return {boolean}
  */
const isSecurityOfficerObjectives = (val) => {
  const subSchema = jsonSchema.securityOfficerObjectives;
  return validateClassProperties(val, subSchema);
};

/** validate security assumptions in ISRAProjectContext
    * @param {string} val value intended to be populated into
    * securityAssumptions class property
    * @return {boolean}
  */
const isSecurityAssumptions = (val) => {
  const subSchema = jsonSchema.securityAssumptions;
  return validateClassProperties(val, subSchema);
};

module.exports = {
  isProjectDescription,
  isProjectURL,
  isProjectDescriptionAttachment,
  isSecurityProjectObjectives,
  isSecurityOfficerObjectives,
  isSecurityAssumptions,
};
