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

// gets current operating system user as a string
const user = require('os').userInfo().username;
// uses user's time zone and displays current date as a string
const currentDate = new Date();
const { isValidDate, isValidId } = require('../../schema/validation-pattern/validation');

module.exports = class ISRAMetaTracking {
  // value of selected iteration row
  #trackingIteration;

  // assigns current operating system user to trackingSecurityOfficer
  #trackingSecurityOfficer = user;

  // assigns current date in YYYY-MM-DD to trackingDate
  #trackingDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

  // text input of description of iteration
  #trackingComment;

  set trackingIteration(trackingIteration) {
    if (isValidId(trackingIteration)) {
      this.#trackingIteration = trackingIteration;
    } else throw new Error(`Tracking iteration ${trackingIteration} is not null/integer`);
  }

  set trackingSecurityOfficer(trackingSecurityOfficer) {
    if (typeof trackingSecurityOfficer === 'string') this.#trackingSecurityOfficer = trackingSecurityOfficer;
    else throw new Error(`Meta tracking ${this.#trackingIteration}: tracking officer is not a string`);
  }

  set trackingDate(trackingDate) {
    if (isValidDate(trackingDate)) this.#trackingDate = trackingDate;
    else throw new Error(`Meta tracking ${this.#trackingIteration}: tracking date is invalid date string`);
  }

  set trackingComment(trackingComment) {
    if (typeof trackingComment === 'string') this.#trackingComment = trackingComment;
    else throw new Error(`Meta tracking ${this.#trackingIteration}: tracking comment is not a string`);
  }

  // get obj of relevant properties for storage
  get properties() {
    return {
      trackingIteration: this.#trackingIteration,
      trackingSecurityOfficer: this.#trackingSecurityOfficer,
      trackingDate: this.#trackingDate,
      trackingComment: this.#trackingComment,
    };
  }
};
