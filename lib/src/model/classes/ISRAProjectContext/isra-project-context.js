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

// contains scope/context of ISRA project
module.exports = class ISRAProjectContext {
  // text input of description of project
  #projectDescription;

  // inserted value of hyperlink of project
  #projectURL;

  // value of attachment of a project descriptive document file
  #projectDescriptionAttachment;

  // text input of objectives from the project/product manager's perspective
  #securityProjectObjectives;

  // text input of objectives from the security officer's perspective
  #securityOfficerObjectives;

  // text input of assumptions made on this project
  #securityAssumptions;

  set projectDescription(projectDescription) {
    if (typeof projectDescription === 'string') this.#projectDescription = projectDescription;
    else throw new Error('Project description is not a string');
  }

  set projectURL(projectURL) {
    if (typeof projectURL === 'string' && ISRAProjectContext.#isValidURI(projectURL)) this.#projectURL = projectURL;
    else throw new Error('Project URL is invalid or not a string');
  }

  set projectDescriptionAttachment(projectDescriptionAttachment) {
    if (typeof projectDescriptionAttachment === 'string' && ISRAProjectContext.#isValidAttachment(projectDescriptionAttachment)) this.#projectDescriptionAttachment = projectDescriptionAttachment;
    else throw new Error('Project description attachment is invalid or not a string');
  }

  set securityProjectObjectives(securityProjectObjectives) {
    if (typeof securityProjectObjectives === 'string') this.#securityProjectObjectives = securityProjectObjectives;
    else throw new Error('Security project objectives is not a string');
  }

  set securityOfficerObjectives(securityOfficerObjectives) {
    if (typeof securityOfficerObjectives === 'string') this.#securityOfficerObjectives = securityOfficerObjectives;
    else throw new Error('Security officer objectives is not a string');
  }

  set securityAssumptions(securityAssumptions) {
    if (typeof securityAssumptions === 'string') this.#securityAssumptions = securityAssumptions;
    else throw new Error('Security assumptions is not a string');
  }

  // validates if project URL inserted is valid
  static #isValidURI(projectURL) {
    // pattern reference from ajv-formats
    const pattern = new RegExp(
      '^(?:https?|ftp):\\/\\/' // protocol (http:// or https:// or ftp:)
    + '(?:\\S+(?::\\S*)?@)?(?:'
    + '(?!(?:10|127)(?:\\.\\d{1,3}){3})'
    + '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})'
    + '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])'
    + '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}'
    + '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\\d{2,5})?(?:\\/[^\\s]*)?$',
      'iu',
    );
    return pattern.test(projectURL) || projectURL === '';
  }

  // validates if project descriptive document file is a valid base64 string
  static #isValidAttachment(projectDescAttachment) {
    const pattern = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return pattern.test(projectDescAttachment);
  }

  // get JSON string of relevant properties
  get properties() {
    return {
      projectDescription: this.#projectDescription,
      projectURL: this.#projectURL,
      projectDescriptionAttachment: this.#projectDescriptionAttachment,
      securityProjectObjectives: this.#securityProjectObjectives,
      securityOfficerObjectives: this.#securityOfficerObjectives,
      securityAssumptions: this.#securityAssumptions,
    };
  }
};
