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

const validateJsonSchema = require('../../../api/xml-json/validate-encryption-payload-json-schema');
const jsonSchema = require('../../schema/encrypted-json-schema').properties.ISRAEncryptionMeta.properties;
const securityVersion = require('../../schema/encrypted-json-schema').securityVersion;
const schemaVersion = require('../../schema/json-schema').schemaVersion;
const config = require('../../../config');

const defaultProtected = {
  "alg":"PBES2-HS512+A256KW",
  "p2s":"2WCTcJZ1Rvd_CJuJripQ1w",
  "p2c":10000,
  "enc":"A256GCM"
   } 

/**
  * Create a ISRA Project with private members, contains all information of project
  * @throws Project version is not a string
  * @throws ISRA project context added not an instanceof ISRAProjectContext
*/
class EncryptionPayload {
  // value of latest app template version
  #recipients;

  #protected;

  #iv;

  #ciphertext;

  #tag;

  constructor() {
    this.#recipients = [];
    this.#protected = defaultProtected;
  }

  /** text input of name of project
    * @type {array}
  */
  set recipients(value) {
    this.#recipients = value;
  }

  get recipients() {
    return this.#recipients;
  }

  /** text input of name of project
    * @type {object}
  */
  set protected(value) {
    this.#protected = value;
  }

  get protected() {
    return this.#protected;
  }
    
  /** text input of name of project
    * @type {string}
  */
  set iv(value) {
    this.#iv = value;
  }

  get iv() {
    return this.#iv;
  }


  /** text input of name of project
    * @type {string}
  */
  set ciphertext(value) {
    this.#ciphertext = value;
  }

  get ciphertext() {
    return this.#ciphertext;
  }

  /** text input of name of project
    * @type {string}
  */
  set tag(value) {
    this.#tag = value;
  }

  get tag() {
    return this.#tag;
  }

  /** get object of all values of each member property in ISRAProject
    * @type {object}
  */
  get properties() {
    return {
      recipients: this.#recipients,
      protected: this.#protected,
      iv: this.#iv,
      ciphertext: this.#ciphertext,
      tag: this.#tag,
    };
  }

  /** convert all class values into JSON for data store
    * @type {function}
    * @returns {string}
  */
  toJSON() {
    const israValidJSONData = validateJsonSchema(this.properties);
    return JSON.stringify(israValidJSONData, null, 4);
  }
}

module.exports = EncryptionPayload;
