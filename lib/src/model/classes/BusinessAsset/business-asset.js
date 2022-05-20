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
  isBusinessAssetId,
  isBusinessAssetName,
  isBusinessAssetType,
  isBusinessAssetDescription,
} = require('./validation');

const BusinessAssetProperties = require('./business-asset-properties');
const BusinessAssetJsonSchema = require('../../schema/json-schema').properties.BusinessAsset.items.properties;

/**
* Create a Business Asset instance with private members
* @throws Business asset id (businessAssetId): is not null/integer
* @throws Business asset id (businessAssetId): name is not a string
* @throws Business asset id (businessAssetId): type is invalid
* @throws Business asset id (businessAssetId): description is invalid html string
* @throws Business asset id (businessAssetId): business asset properties
* (businessAssetIdRef) is not an instanceOf BusinessAssetProperties
*/
class BusinessAsset {
  // value of latest businessAssetId
  static #idCount;

  #businessAssetId;

  #businessAssetName;

  #businessAssetType;

  #businessAssetDescription;

  #businessAssetProperties;

  constructor() {
    this.#businessAssetId = BusinessAsset.#incrementId();
    this.#businessAssetName = BusinessAssetJsonSchema.businessAssetName.default;
    this.#businessAssetType = BusinessAssetJsonSchema.businessAssetType.default;
    this.#businessAssetDescription = BusinessAssetJsonSchema.businessAssetDescription.default;
    this.#businessAssetProperties = new BusinessAssetProperties();
    this.#businessAssetProperties.businessAssetIdRef = this.#businessAssetId;
  }

  /** id of business asset
    * @type {integer|null}
  */
  set businessAssetId(businessAssetId) {
    if (isBusinessAssetId(businessAssetId)) {
      this.#businessAssetId = businessAssetId;
    } else throw new Error(`Business asset id ${businessAssetId} is not null/integer`);
  }

  get businessAssetId() {
    return this.#businessAssetId;
  }

  /** text input of name of business asset
    * @type {string}
  */
  set businessAssetName(businessAssetName) {
    if (isBusinessAssetName(businessAssetName)) this.#businessAssetName = businessAssetName;
    else throw new Error(`Business asset ${this.#businessAssetId}: name is not a string`);
  }

  get businessAssetName() {
    return this.#businessAssetName;
  }

  /** value of type selected
    * @type {string}
  */
  set businessAssetType(businessAssetType) {
    if (isBusinessAssetType(businessAssetType)) this.#businessAssetType = businessAssetType;
    else throw new Error(`Business asset ${this.#businessAssetId}: type is invalid`);
  }

  get businessAssetType() {
    return this.#businessAssetType;
  }

  /** text input of description of business asset
    * @type {string}
  */
  set businessAssetDescription(businessAssetDescription) {
    if (isBusinessAssetDescription(businessAssetDescription)) {
      this.#businessAssetDescription = businessAssetDescription;
    } else throw new Error(`Business asset ${this.#businessAssetId}: description is invalid html string`);
  }

  get businessAssetDescription() {
    return this.#businessAssetDescription;
  }

  /** object of corresponding business asset properties
    * (i.e CIA, Authencity, Authorization, Non-repudiation)
    * @type {BusinessAssetProperties}
  */
  set businessAssetProperties(businessAssetProperties) {
    if (businessAssetProperties instanceof BusinessAssetProperties) {
      this.#businessAssetProperties = businessAssetProperties;
      this.#businessAssetProperties.businessAssetIdRef = this.#businessAssetId;
    } else throw new Error(`Business asset ${this.#businessAssetId}: Business asset properties ${businessAssetProperties.properties.businessAssetIdRef} is not an instanceOf BusinessAssetProperties`);
  }

  get businessAssetProperties() {
    return this.#businessAssetProperties;
  }

  static #incrementId() {
    if (!this.#idCount) this.#idCount = 1;
    else this.#idCount += 1;
    return this.#idCount;
  }

  /**
    * @property {function} setIdCount - set latest id
    * @param {integer} latestId - businessAssetId
  */
  static setIdCount(latestId) {
    this.#idCount = latestId;
  }

  /** get object of each value of BusinessAsset member property
    * @type {object}
  */
  get properties() {
    return {
      businessAssetId: this.#businessAssetId,
      businessAssetName: this.#businessAssetName,
      businessAssetType: this.#businessAssetType,
      businessAssetDescription: this.#businessAssetDescription,
      businessAssetProperties: this.#businessAssetProperties.properties,
    };
  }
}

module.exports = BusinessAsset;
