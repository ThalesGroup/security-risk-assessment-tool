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

const validateJsonSchema = require('../../../api/xml-json/validate-encrypted-json-schema');
const jsonSchema = require('../../schema/encrypted-json-schema').properties.ISRAEncryptionMeta.properties;
const securityVersion = require('../../schema/encrypted-json-schema').securityVersion;
const schemaVersion = require('../../schema/json-schema').schemaVersion;
const config = require('../../../config');

/**
  * Create a ISRA Project with private members, contains all information of project
  * @throws Project version is not a string
  * @throws ISRA project context added not an instanceof ISRAProjectContext
*/
class EncryptedISRAProject {
  // value of latest app template version
  #securityVersion;

  #schemaVersion;

  #classification;

  #salt

  #iv

  #ISRAEncryptedContent

  constructor() {
    this.#securityVersion = securityVersion;
    this.#schemaVersion = schemaVersion;
    this.#classification = config.classification? config.classification : jsonSchema.classification.default;
    this.#salt = jsonSchema.salt.default;
    this.#iv = jsonSchema.iv.default;
  }


  set securityVersion(securityVersion) {
    this.#securityVersion = securityVersion;
    
  }

  get securityVersion() {
    return this.#securityVersion;
  }

  set schemaVersion(schemaVersion) {
    this.#schemaVersion = schemaVersion;
    
  }

  get schemaVersion() {
    return this.#schemaVersion;
  }


  /** text input of name of project
    * @type {string}
  */
  set classification(classification) {
    this.#classification = classification;
    
  }

  get classification() {
    return this.#classification;
  }

  /** text input of salt of encrypted project
    * @type {string}
  */
  set salt(salt) {
    this.#salt = salt;
  }

  get salt() {
    return this.#salt;
  }

  /** text input  of iv of encrypted project
    * @type {string}
  */
  set iv(iv) {
    this.#iv = iv;
  }

  get iv() {
    return this.#iv;
  }

  /** text input of name of project
    * @type {string}
  */
     set ISRAEncryptedContent(ISRAEncryptedContent) {
      this.#ISRAEncryptedContent = ISRAEncryptedContent;
      
    }
  
    get ISRAEncryptedContent() {
      return this.#ISRAEncryptedContent;
    }

  /** get object of all values of each member property in ISRAProject
    * @type {object}
  */
  get properties() {
    return {
      ISRAEncryptionMeta: {
        securityVersion: this.#securityVersion,
        schemaVersion: this.#schemaVersion,
        classification: this.#classification,
        salt: this.#salt,
        iv: this.#iv,
      },
      ISRAEncryptedContent: this.#ISRAEncryptedContent,
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

module.exports = EncryptedISRAProject;
