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
const { supportingAssetTypeEnum, supportingAssetSecurityLevelEnum } = require('./enum');
// contains information about each supporting asset shown in product architecture diagram
module.exports = class SupportingAsset {
  // value of latest supportingAssetId
  static #idCount;

  // value of id of supporting asset
  #supportingAssetId;

  // input HLD id of supporting asset
  #supportingAssetHLDId;

  // input name of suporting asset
  #supportingAssetName;

  // value of selected type of supporting asset
  #supportingAssetType;

  // value of selected network security level
  #supportingAssetSecurityLevel;

  // id references of selected business assets
  #businessAssetRefs = new Set();

  constructor() {
    this.#supportingAssetId = SupportingAsset.incrementId();
  }

  set supportingAssetId(supportingAssetId) {
    if (Number.isSafeInteger(supportingAssetId) || supportingAssetId === null) {
      this.#supportingAssetId = supportingAssetId;
    } else throw new Error(`Supporting asset id ${supportingAssetId} does not match current supportingAssetId`);
  }

  set supportingAssetHLDId(supportingAssetHLDId) {
    if (typeof supportingAssetHLDId === 'string') this.#supportingAssetHLDId = supportingAssetHLDId;
    else throw new Error(`Supporting asset ${this.#supportingAssetId}: HLD id is not a string`);
  }

  set supportingAssetName(supportingAssetName) {
    if (typeof supportingAssetName === 'string') this.#supportingAssetName = supportingAssetName;
    else throw new Error(`Supporting asset ${this.#supportingAssetId}: name is not a string`);
  }

  set supportingAssetType(supportingAssetType) {
    if (supportingAssetType in supportingAssetTypeEnum) {
      this.#supportingAssetType = supportingAssetType;
    } else throw new Error(`Supporting asset ${this.#supportingAssetId}: type is invalid`);
  }

  set supportingAssetSecurityLevel(supportingAssetSecurityLevel) {
    if ((Number.isSafeInteger(supportingAssetSecurityLevel)
    && supportingAssetSecurityLevel in supportingAssetSecurityLevelEnum)
    || supportingAssetSecurityLevel === null) {
      this.#supportingAssetSecurityLevel = supportingAssetSecurityLevel;
    } else throw new Error(`Supporting asset ${this.#supportingAssetId}: security level is not null/integer or is invalid`);
  }

  addBusinessAssetRef(businessAssetId) {
    if (Number.isSafeInteger(businessAssetId) || businessAssetId === null) {
      this.#businessAssetRefs.add(businessAssetId);
    } else throw new Error(`Supporting asset ${this.#supportingAssetId}: business asset ref is not a string`);
  }

  deleteBusinessAssetRef(businessAssetId) {
    if (this.#businessAssetRefs.size > 0 && Number.isSafeInteger(businessAssetId)) {
      this.#businessAssetRefs.delete(businessAssetId);
    } else throw new Error(`Supporting asset ${this.#supportingAssetId}: business asset ref is not a string`);
  }

  // auto-increments static iterationCount to update trackingIteration
  static incrementId() {
    if (!this.#idCount) this.#idCount = 1;
    else this.#idCount += 1;
    return this.#idCount;
  }

  // set latest id
  static setIdCount(latestId) {
    this.#idCount = latestId;
  }

  // get obj of relevant properties for storage
  get properties() {
    return {
      supportingAssetId: this.#supportingAssetId,
      supportingAssetHLDId: this.#supportingAssetHLDId,
      supportingAssetName: this.#supportingAssetName,
      supportingAssetType: this.#supportingAssetType,
      supportingAssetSecurityLevel: this.#supportingAssetSecurityLevel,
      businessAssetRefs: this.#businessAssetRefs,
    };
  }
};
