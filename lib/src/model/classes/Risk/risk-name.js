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

const { isThreatAgent, isThreatVerb } = require('./validation');
const { isValidHtml, isValidId } = require('../../schema/validation-pattern/validation');

/**
  * Create a RiskName with private members
  * @throws Risk id (riskIdRef): id ref is not null/integer
  * @throws Risk (riskIdRef): risk name is not an string
  * @throws Risk (riskIdRef): threat agent is invalid
  * @throws Risk (riskIdRef): threat agent detail is not a html string
  * @throws Risk (riskIdRef): threat verb is invalid
  * @throws Risk (riskIdRef): threat verb detail is not a html string
  * @throws Risk (riskIdRef): motivation is not a string
  * @throws Risk (riskIdRef): motivation detail is not a html string
  * @throws Risk (riskIdRef): business asset ref is not null/integer
  * @throws Risk (riskIdRef): supporting asset ref is not null/integer
*/
class RiskName {
  #riskIdRef;

  #riskName;

  #threatAgent;

  #threatAgentDetail;

  #threatVerb;

  #threatVerbDetail;

  #motivation;

  #motivationDetail;

  #businessAssetRef;

  #supportingAssetRef;

  /** referenced value of riskId from Risk
    * @type {integer|null}
  */
  set riskIdRef(riskIdRef) {
    if (isValidId(riskIdRef)) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}: id ref is not null/integer`);
  }

  get riskIdRef() {
    return this.#riskIdRef;
  }

  /** value of computed or manual risk name
    * @type {string}
  */
  set riskName(riskName) {
    if (typeof riskName === 'string') this.#riskName = riskName;
    else throw new Error(`Risk ${this.#riskIdRef}: risk name is not an string`);
  }

  get riskName() {
    return this.#riskName;
  }

  /** value of threat agent selected
    * @type {string}
  */
  set threatAgent(threatAgent) {
    if (isThreatAgent(threatAgent)) this.#threatAgent = threatAgent;
    else throw new Error(`Risk ${this.#riskIdRef}: threat agent is invalid`);
  }

  get threatAgent() {
    return this.#threatAgent;
  }

  /** text input of details of threat agent
    * @type {string}
  */
  set threatAgentDetail(threatAgentDetail) {
    if (typeof threatAgentDetail === 'string' && isValidHtml(threatAgentDetail)) this.#threatAgentDetail = threatAgentDetail;
    else throw new Error(`Risk ${this.#riskIdRef}: threat agent detail is not a html string`);
  }

  get threatAgentDetail() {
    return this.#threatAgentDetail;
  }

  /** value of threat verb selected
    * @type {string}
  */
  set threatVerb(threatVerb) {
    if (isThreatVerb(threatVerb)) this.#threatVerb = threatVerb;
    else throw new Error(`Risk ${this.#riskIdRef}: threat verb is invalid`);
  }

  get threatVerb() {
    return this.#threatVerb;
  }

  /** input details of threat
    * @type {string}
  */
  set threatVerbDetail(threatVerbDetail) {
    if (typeof threatVerbDetail === 'string' && isValidHtml(threatVerbDetail)) this.#threatVerbDetail = threatVerbDetail;
    else throw new Error(`Risk ${this.#riskIdRef}: threat verb detail is not a html string`);
  }

  get threatVerbDetail() {
    return this.#threatVerbDetail;
  }

  /** text input of motivation
    * @type {string}
  */
  set motivation(motivation) {
    if (typeof motivation === 'string') this.#motivation = motivation;
    else throw new Error(`Risk ${this.#riskIdRef}: motivation is not a string`);
  }

  get motivation() {
    return this.#motivation;
  }

  /** text input of details of motivation
    * @type {string}
  */
  set motivationDetail(motivationDetail) {
    if (typeof motivationDetail === 'string' && isValidHtml(motivationDetail)) this.#motivationDetail = motivationDetail;
    else throw new Error(`Risk ${this.#riskIdRef}: motivation detail is not a html string`);
  }

  get motivationDetail() {
    return this.#motivationDetail;
  }

  /** referenced value of businessAssetId from selected BusinessAsset
    * @type {integer|null}
  */
  set businessAssetRef(businessAssetRef) {
    if (isValidId(businessAssetRef)) {
      this.#businessAssetRef = businessAssetRef;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset ref is not null/integer`);
  }

  get businessAssetRef() {
    return this.#businessAssetRef;
  }

  /** referenced value of supportingAssetId from selected SupportingAsset
    * @type {integer|null}
  */
  set supportingAssetRef(supportingAssetRef) {
    if (isValidId(supportingAssetRef)) {
      this.#supportingAssetRef = supportingAssetRef;
    } else throw new Error(`Risk ${this.#riskIdRef}: supporting asset ref is not null/integer`);
  }

  get supportingAssetRef() {
    return this.#supportingAssetRef;
  }

  /** get object of each value of RiskName member property
    * @type {object}
  */
  get properties() {
    return {
      riskIdRef: this.#riskIdRef,
      riskName: this.#riskName,
      threatAgent: this.#threatAgent,
      threatAgentDetail: this.#threatAgentDetail,
      threatVerb: this.#threatVerb,
      threatVerbDetail: this.#threatVerbDetail,
      motivation: this.#motivation,
      motivationDetail: this.#motivationDetail,
      businessAssetRef: this.#businessAssetRef,
      supportingAssetRef: this.#supportingAssetRef,
    };
  }
}

module.exports = RiskName;
