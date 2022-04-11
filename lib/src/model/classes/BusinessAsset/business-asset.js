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

const { isBusinessAssetType } = require('./validation');
const { isValidHtml, isValidId } = require('../../schema/validation-pattern/validation');

const BusinessAssetProperties = require('./business-asset-properties');
// contains information about each business asset
module.exports = class BusinessAsset {
  // value of latest businessAssetId
  static #idCount;

  // value of id of business asset
  #businessAssetId;

  // text input of name of business asset
  #businessAssetName;

  // value of type selected
  #businessAssetType;

  // text input of description of business asset
  #businessAssetDescription;

  /* object of corresponding business asset properties
  (i.e CIA, Authencity, Authorization, Non-repudiation) */
  #businessAssetProperties;

  constructor() {
    this.#businessAssetId = BusinessAsset.#incrementId();
  }

  set businessAssetId(businessAssetId) {
    if (isValidId(businessAssetId)) {
      this.#businessAssetId = businessAssetId;
    } else throw new Error(`Business asset id ${businessAssetId} is not null/integer`);
  }

  set businessAssetName(businessAssetName) {
    if (typeof businessAssetName === 'string') this.#businessAssetName = businessAssetName;
    else throw new Error(`Business asset ${this.#businessAssetId}: name is not a string`);
  }

  set businessAssetType(businessAssetType) {
    if (isBusinessAssetType(businessAssetType)) this.#businessAssetType = businessAssetType;
    else throw new Error(`Business asset ${this.#businessAssetId}: type is invalid`);
  }

  set businessAssetDescription(businessAssetDescription) {
    if (isValidHtml(businessAssetDescription)) {
      this.#businessAssetDescription = businessAssetDescription;
    } else throw new Error(`Business asset ${this.#businessAssetId}: description is invalid html string`);
  }

  set businessAssetProperties(businessAssetProperties) {
    if (businessAssetProperties instanceof BusinessAssetProperties) {
      this.#businessAssetProperties = businessAssetProperties;
    } else throw new Error(`Business asset ${this.#businessAssetId}: Business asset properties is not an instanceOf BusinessAssetProperties`);
  }

  // auto-increments static idCount to update businessAssetId
  static #incrementId() {
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
      businessAssetId: this.#businessAssetId,
      businessAssetName: this.#businessAssetName,
      businessAssetType: this.#businessAssetType,
      businessAssetDescription: this.#businessAssetDescription,
      businessAssetProperties: this.#businessAssetProperties,
    };
  }
};
