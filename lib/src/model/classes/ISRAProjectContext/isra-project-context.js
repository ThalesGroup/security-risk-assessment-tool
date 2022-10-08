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

const {
  isProjectDescription,
  isProjectURL,
  isProjectDescriptionAttachment,
  isSecurityProjectObjectives,
  isSecurityOfficerObjectives,
  isSecurityAssumptions,
} = require('./validation');

const DecodeAttachment = require('../../superclass/index');

/**
  * Create a ISRA Project Context with private members
  * @throws Project description is invalid html string
  * @throws Project URL is invalid url string
  * @throws Project description attachment is invalid base64 string
  * @throws Security project objectives is invalid html string
  * @throws Security officer objectives is invalid html string
  * @throws Security assumptions is invalid html string
*/
class ISRAProjectContext extends DecodeAttachment {
  #projectDescription;

  #projectURL;

  #projectDescriptionAttachment;

  #securityProjectObjectives;

  #securityOfficerObjectives;

  #securityAssumptions;

  constructor() {
    super();
  }

  /** text input of description of project
    * @type {string}
  */
  set projectDescription(projectDescription) {
    if (isProjectDescription(projectDescription)) this.#projectDescription = projectDescription;
    else throw new Error('Project description is invalid html string');
  }

  get projectDescription() {
    return this.#projectDescription;
  }

  /** inserted value of hyperlink of project
    * @type {string}
  */
  set projectURL(projectURL) {
    if (isProjectURL(projectURL)) this.#projectURL = projectURL;
    else throw new Error('Project URL is invalid url string');
  }

  get projectURL() {
    return this.#projectURL;
  }

  /** value of attachment of a project descriptive document file
    * @type {string}
  */
  set projectDescriptionAttachment(projectDescriptionAttachment) {
    if (isProjectDescriptionAttachment(projectDescriptionAttachment)) {
      this.#projectDescriptionAttachment = projectDescriptionAttachment;
    } else throw new Error('Project description attachment is invalid base64 string');
  }

  get projectDescriptionAttachment() {
    return this.#projectDescriptionAttachment;
  }

  /** text input of objectives from the project/product manager's perspective
    * @type {string}
  */
  set securityProjectObjectives(securityProjectObjectives) {
    if (isSecurityProjectObjectives(securityProjectObjectives)) {
      this.#securityProjectObjectives = securityProjectObjectives;
    } else throw new Error('Security project objectives is invalid html string');
  }

  get securityProjectObjectives() {
    return this.#securityProjectObjectives;
  }

  /** text input of objectives from the security officer's perspective
    * @type {string}
  */
  set securityOfficerObjectives(securityOfficerObjectives) {
    if (isSecurityOfficerObjectives(securityOfficerObjectives)) {
      this.#securityOfficerObjectives = securityOfficerObjectives;
    } else throw new Error('Security officer objectives is invalid html string');
  }

  get securityOfficerObjectives() {
    return this.#securityOfficerObjectives;
  }

  /** text input of assumptions made on this project
    * @type {string}
  */
  set securityAssumptions(securityAssumptions) {
    if (isSecurityAssumptions(securityAssumptions)) this.#securityAssumptions = securityAssumptions;
    else throw new Error('Security assumptions is invalid html string');
  }

  get securityAssumptions() {
    return this.#securityAssumptions;
  }
  
  /** get object of each value of ISRAProjectContext member property
    * @type {object}
  */
  get properties() {
    return {
      projectDescription: this.#projectDescription,
      projectURL: this.#projectURL,
      projectDescriptionAttachment: this.#projectDescriptionAttachment,
      securityProjectObjectives: this.#securityProjectObjectives,
      securityOfficerObjectives: this.#securityOfficerObjectives,
      securityAssumptions: this.#securityAssumptions,
      useNewDecode: super.useNewDecode
    };
  }
}

module.exports = ISRAProjectContext;
