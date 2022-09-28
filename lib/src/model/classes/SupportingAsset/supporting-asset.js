/*----------------------------------------------------------------------------
*
*     Copyright © YYYY THALES. All Rights Reserved.
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

const { isBusinessAssetId } = require('../BusinessAsset/validation');
const {
  isSupportingAssetId,
  isSupportingAssetHLDId,
  isSupportingAssetName,
  isSupportingAssetType,
  isSupportingAssetSecurityLevel,
} = require('./validation');

const supportingAssetSchema = require('../../schema/json-schema').properties.SupportingAsset.items.properties;

/**
  * Create a Supporting Asset with private members:
  * contains information about each supporting asset shown in product architecture diagram
  * @throws Supporting asset id (supportingAssetId) is not null/integer
  * @throws Supporting asset (supportingAssetId): HLD id is not a string
  * @throws Supporting asset (supportingAssetId): name is not a string
  * @throws Supporting asset (supportingAssetId): type is invalid
  * @throws Supporting asset (supportingAssetId): security level is an invalid null/integer
  * @throws Supporting asset (supportingAssetId): business asset ref is not null/integer
  * @throws Supporting asset (supportingAssetId): business asset ref doesn't exist
*/
class SupportingAsset {
  // value of latest supportingAssetId
  static #idCount;

  #supportingAssetId;

  #supportingAssetHLDId;

  #supportingAssetName;

  #supportingAssetType;

  #supportingAssetSecurityLevel;

  // id references of selected business assets
  #businessAssetRefs;

  constructor() {
    this.#supportingAssetId = SupportingAsset.incrementId();
    this.#supportingAssetHLDId = supportingAssetSchema.supportingAssetHLDId.default;
    this.#supportingAssetName = supportingAssetSchema.supportingAssetName.default;
    this.#supportingAssetType = supportingAssetSchema.supportingAssetType.default;
    this.#supportingAssetSecurityLevel = supportingAssetSchema.supportingAssetSecurityLevel.default;
    this.#businessAssetRefs = new Array();
  }

  /** value of id of supporting asset
    * @type {integer|null}
  */
  set supportingAssetId(supportingAssetId) {
    if (isSupportingAssetId(supportingAssetId)) {
      this.#supportingAssetId = supportingAssetId;
    } else throw new Error(`Supporting asset id ${supportingAssetId} is not null/integer`);
  }

  get supportingAssetId() {
    return this.#supportingAssetId;
  }

  /** input HLD id of supporting asset
    * @type {string}
  */
  set supportingAssetHLDId(supportingAssetHLDId) {
    if (isSupportingAssetHLDId(supportingAssetHLDId)) {
      this.#supportingAssetHLDId = supportingAssetHLDId;
    } else throw new Error(`Supporting asset ${this.#supportingAssetId}: HLD id is not a string`);
  }

  get supportingAssetHLDId() {
    return this.#supportingAssetHLDId;
  }

  /** input name of suporting asset
    * @type {string}
  */
  set supportingAssetName(supportingAssetName) {
    if (isSupportingAssetName(supportingAssetName)) this.#supportingAssetName = supportingAssetName;
    else throw new Error(`Supporting asset ${this.#supportingAssetId}: name is not a string`);
  }

  get supportingAssetName() {
    return this.#supportingAssetName;
  }

  /** value of selected type of supporting asset
    * @type {string}
  */
  set supportingAssetType(supportingAssetType) {
    if (isSupportingAssetType(supportingAssetType)) {
      this.#supportingAssetType = supportingAssetType;
    } else throw new Error(`Supporting asset ${this.#supportingAssetId}: type is invalid`);
  }

  get supportingAssetType() {
    return this.#supportingAssetType;
  }

  /** value of selected network security level
    * @type {string}
  */
  set supportingAssetSecurityLevel(supportingAssetSecurityLevel) {
    if (isSupportingAssetSecurityLevel(supportingAssetSecurityLevel)) {
      this.#supportingAssetSecurityLevel = supportingAssetSecurityLevel;
    } else throw new Error(`Supporting asset ${this.#supportingAssetId}: security level is an invalid null/integer`);
  }

  get supportingAssetSecurityLevel() {
    return this.#supportingAssetSecurityLevel;
  }

  /**
    * add businessAssetId to map
    * @param {integer|null} businessAssetId - id of selected BusinessAsset
  */
  addBusinessAssetRef(businessAssetId) {
    if (isBusinessAssetId(businessAssetId)) {
      this.#businessAssetRefs.push(businessAssetId);
    } else throw new Error(`Supporting asset ${this.#supportingAssetId}: business asset ref is not null/integer`);
  }

  /**
    * delete businessAssetId from array by businessAssetId's index
    * @param {integer} index - array index of selected BusinessAsset
  */
  deleteBusinessAssetRef(index) {
    if (this.#businessAssetRefs[index] !== undefined) {
      this.#businessAssetRefs.splice(index, 1);
    } else throw new Error(`Supporting asset ${this.#supportingAssetId}: business asset ref doesn't exist, failed to delete`);
  }

  /**
    * update businessAssetId from array by businessAssetId's index
    * @param {integer} index - array index of selected BusinessAsset
    * @param {integer} value - selected businessAssetId
  */
  updateBusinessAssetRef(index, value) {
    if (this.#businessAssetRefs[index] !== undefined && isBusinessAssetId(value)) {
      this.#businessAssetRefs[index] = value;
    } else throw new Error(`Supporting asset ${this.#supportingAssetId}: business asset ref doesn't exist, failed to update`);
  }


  // auto-increments static iterationCount to update trackingIteration
  static incrementId() {
    if (!this.#idCount) this.#idCount = 1;
    else this.#idCount += 1;
    return this.#idCount;
  }

  /**
    * @property {function} setIdCount - set latest id
    * @param {integer|null} latestId - riskId
  */
  static setIdCount(latestId) {
    this.#idCount = latestId;
  }

  /** get object of each value of SupportingAsset member property
    * @type {object}
  */
  get properties() {
    return {
      supportingAssetId: this.#supportingAssetId,
      supportingAssetHLDId: this.#supportingAssetHLDId,
      supportingAssetName: this.#supportingAssetName,
      supportingAssetType: this.#supportingAssetType,
      supportingAssetSecurityLevel: this.#supportingAssetSecurityLevel,
      businessAssetRef: Array.from(this.#businessAssetRefs),
    };
  }
}

module.exports = SupportingAsset;
