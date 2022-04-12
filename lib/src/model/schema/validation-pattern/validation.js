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
  URLpattern,
  vectorPattern,
  datePattern,
  htmlPattern,
  attachmentPattern,
} = require('./validation-pattern');

const validation = (() => {
  const isValidDate = (date) => datePattern.test(date);
  const isValidHtml = (string) => htmlPattern.test(string);
  const isValidAttachment = (attachment) => attachmentPattern.test(attachment);
  const isValidURL = (url) => URLpattern.test(url);
  const isVector = (string) => vectorPattern.test(string);
  const isValidId = (id) => (Number.isSafeInteger(id) && id > 0) || id === null;

  return {
    isValidDate: (string) => isValidDate(string),
    isValidHtml: (string) => isValidHtml(string),
    isValidAttachment: (string) => isValidAttachment(string),
    isValidURL: (string) => isValidURL(string),
    isVector: (string) => isVector(string),
    isValidId: (integer) => isValidId(integer),
  };
})();

module.exports = validation;
