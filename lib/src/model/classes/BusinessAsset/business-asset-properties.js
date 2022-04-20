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

const { isBusinessAssetProperties } = require('./validation');
const { isValidId } = require('../../schema/validation-pattern/validation');

/**
  * Create a Business Asset Properties instance with private members
  * @throws Business asset id (businessAssetIdRef): id ref is not null/integer
  * @throws Business asset id (businessAssetIdRef):
  * confidentiality is not a null/integer or is invalid
  * @throws Business asset id (businessAssetIdRef):
  * integrity is not a null/integer or is invalid
  * @throws Business asset id (businessAssetIdRef):
  * availability is not a null/integer or is invalid
  * @throws Business asset id (businessAssetIdRef):
  * authenticity is not a null/integer or is invalid
  * @throws Business asset id (businessAssetIdRef):
  * authorization is not a null/integer or is invalid
  * @throws Business asset id (businessAssetIdRef):
  * nonrepudiation is not a null/integer or is invalid
  */
class BusinessAssetProperties {
  #businessAssetIdRef;

  #businessAssetConfidentiality;

  #businessAssetIntegrity;

  #businessAssetAvailability;

  #businessAssetAuthenticity;

  #businessAssetAuthorization;

  #businessAssetNonRepudiation;

  /** references id of corresponding business asset
    * @type {integer|null}
  */
  set businessAssetIdRef(businessAssetIdRef) {
    if (isValidId(businessAssetIdRef)) {
      this.#businessAssetIdRef = businessAssetIdRef;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: id ref is not null/integer`);
    }
  }

  get businessAssetIdRef() {
    return this.#businessAssetIdRef;
  }

  /** value of confidentiality selected
    * @type {integer|null}
  */
  set businessAssetConfidentiality(businessAssetConfidentiality) {
    if (isBusinessAssetProperties(businessAssetConfidentiality)) {
      this.#businessAssetConfidentiality = businessAssetConfidentiality;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: confidentiality is not an null/integer or is invalid`);
    }
  }

  get businessAssetConfidentiality() {
    return this.#businessAssetConfidentiality;
  }

  /**  value of integrity selected
    * @type {integer|null}
  */
  set businessAssetIntegrity(businessAssetIntegrity) {
    if (isBusinessAssetProperties(businessAssetIntegrity)) {
      this.#businessAssetIntegrity = businessAssetIntegrity;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: integrity is not an null/integer or is invalid`);
    }
  }

  get businessAssetIntegrity() {
    return this.#businessAssetIntegrity;
  }

  /**  value of availability selected
    * @type {integer|null}
  */
  set businessAssetAvailability(businessAssetAvailability) {
    if (isBusinessAssetProperties(businessAssetAvailability)) {
      this.#businessAssetAvailability = businessAssetAvailability;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: availability is not an null/integer or is invalid`);
    }
  }

  get businessAssetAvailability() {
    return this.#businessAssetAvailability;
  }

  /**  value of authenticity selected
    * @type {integer|null}
  */
  set businessAssetAuthenticity(businessAssetAuthenticity) {
    if (isBusinessAssetProperties(businessAssetAuthenticity)) {
      this.#businessAssetAuthenticity = businessAssetAuthenticity;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: authenticity is not an null/integer or is invalid`);
    }
  }

  get businessAssetAuthenticity() {
    return this.#businessAssetAuthenticity;
  }

  /**  value of authorization selected
    * @type {integer|null}
  */
  set businessAssetAuthorization(businessAssetAuthorization) {
    if (isBusinessAssetProperties(businessAssetAuthorization)) {
      this.#businessAssetAuthorization = businessAssetAuthorization;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: authorization is not an null/integer or is invalid`);
    }
  }

  get businessAssetAuthorization() {
    return this.#businessAssetAuthorization;
  }

  /**  value of nonrepudiation selected
    * @type {integer|null}
  */
  set businessAssetNonRepudiation(businessAssetNonRepudiation) {
    if (isBusinessAssetProperties(businessAssetNonRepudiation)) {
      this.#businessAssetNonRepudiation = businessAssetNonRepudiation;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: nonrepudiation is not an null/integer or is invalid`);
    }
  }

  get businessAssetNonRepudiation() {
    return this.#businessAssetNonRepudiation;
  }

  /** get object of each value of BusinessAssetProperties member property
    * @type {object}
  */
  get properties() {
    return {
      businessAssetIdRef: this.#businessAssetIdRef,
      businessAssetAuthenticity: this.#businessAssetAuthenticity,
      businessAssetAuthorization: this.#businessAssetAuthorization,
      businessAssetAvailability: this.#businessAssetAvailability,
      businessAssetConfidentiality: this.#businessAssetConfidentiality,
      businessAssetIntegrity: this.#businessAssetIntegrity,
      businessAssetNonRepudiation: this.#businessAssetNonRepudiation,
    };
  }
}

module.exports = BusinessAssetProperties;
