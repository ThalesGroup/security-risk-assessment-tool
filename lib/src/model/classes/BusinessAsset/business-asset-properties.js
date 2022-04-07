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

const { businessAssetPropertiesEnum } = require('./enum');

/* contains values for selected business asset properties
(i.e CIA, Authencity, Authorization, Non-repudiation) */
module.exports = class BusinessAssetProperties {
  // references id of corresponding business asset
  #businessAssetIdRef;

  // value of confidentiality selected
  #businessAssetConfidentiality;

  // value of integrity selected
  #businessAssetIntegrity;

  // value of availability selected
  #businessAssetAvailability;

  // value of authenticity selected
  #businessAssetAuthenticity;

  // value of authorization selected
  #businessAssetAuthorization;

  // value of nonrepudiation selected
  #businessAssetNonRepudiation;

  set businessAssetIdRef(businessAssetIdRef) {
    if (Number.isSafeInteger(businessAssetIdRef) || businessAssetIdRef === null) {
      this.#businessAssetIdRef = businessAssetIdRef;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: id ref is not null/integer`);
    }
  }

  set businessAssetConfidentiality(businessAssetConfidentiality) {
    if ((Number.isSafeInteger(businessAssetConfidentiality)
    && businessAssetConfidentiality in businessAssetPropertiesEnum)
    || businessAssetConfidentiality === null) {
      this.#businessAssetConfidentiality = businessAssetConfidentiality;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: confidentiality is not an null/integer or is invalid`);
    }
  }

  set businessAssetIntegrity(businessAssetIntegrity) {
    if ((Number.isSafeInteger(businessAssetIntegrity)
    && businessAssetIntegrity in businessAssetPropertiesEnum)
    || businessAssetIntegrity === null) {
      this.#businessAssetIntegrity = businessAssetIntegrity;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: integrity is not an null/integer or is invalid`);
    }
  }

  set businessAssetAvailability(businessAssetAvailability) {
    if ((Number.isSafeInteger(businessAssetAvailability)
    && businessAssetAvailability in businessAssetPropertiesEnum)
    || businessAssetAvailability === null) {
      this.#businessAssetAvailability = businessAssetAvailability;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: availability is not an null/integer or is invalid`);
    }
  }

  set businessAssetAuthenticity(businessAssetAuthenticity) {
    if ((Number.isSafeInteger(businessAssetAuthenticity)
    && businessAssetAuthenticity in businessAssetPropertiesEnum)
    || businessAssetAuthenticity === null) {
      this.#businessAssetAuthenticity = businessAssetAuthenticity;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: authenticity is not an null/integer or is invalid`);
    }
  }

  set businessAssetAuthorization(businessAssetAuthorization) {
    if ((Number.isSafeInteger(businessAssetAuthorization)
    && businessAssetAuthorization in businessAssetPropertiesEnum)
    || businessAssetAuthorization === null) {
      this.#businessAssetAuthorization = businessAssetAuthorization;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: authorization is not an null/integer or is invalid`);
    }
  }

  set businessAssetNonRepudiation(businessAssetNonRepudiation) {
    if ((Number.isSafeInteger(businessAssetNonRepudiation)
    && businessAssetNonRepudiation in businessAssetPropertiesEnum)
    || businessAssetNonRepudiation === null) {
      this.#businessAssetNonRepudiation = businessAssetNonRepudiation;
    } else {
      throw new Error(`Business asset ${this.#businessAssetIdRef}: nonrepudiation is not an null/integer or is invalid`);
    }
  }

  /* BusinessAssetProperties object is loaded to
  businessAssetProperties in corresponding Business Asset */
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
};
