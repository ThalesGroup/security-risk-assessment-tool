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

// contains threat properties that compute risk name. Also allows for manual input of risk name
module.exports = class RiskName {
  // referenced value of riskId from Risk
  #riskIdRef;

  // value of computed or manual risk name
  #riskName;

  // value of threat agent selected
  #threatAgent;

  // text input of details of threat agent
  #threatAgentDetail;

  // value of threat selected
  #threatVerb;

  // input details of threat
  #threatVerbDetail;

  // text input of motivation
  #motivation;

  // text input of details of motivation
  #motivationDetail;

  // referenced value of businessAssetId from selected BusinessAsset
  #businessAssetRef;

  // referenced value of supportingAssetId from selected SupportingAsset
  #supportingAssetRef;

  set riskIdRef(riskIdRef) {
    if (Number.isSafeInteger(riskIdRef) || riskIdRef === null) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}: id ref is not an integer`);
  }

  set riskName(riskName) {
    if (typeof riskName === 'string') this.#riskName = riskName;
    else throw new Error(`Risk ${this.#riskIdRef}: risk name is not an string`);
  }

  set threatAgent(threatAgent) {
    if (typeof threatAgent === 'string') this.#threatAgent = threatAgent;
    else throw new Error(`Risk ${this.#riskIdRef}: threat agent is not an string`);
  }

  set threatAgentDetail(threatAgentDetail) {
    if (typeof threatAgentDetail === 'string') this.#threatAgentDetail = threatAgentDetail;
    else throw new Error(`Risk ${this.#riskIdRef}: threat agent detail is not an string`);
  }

  set threatVerb(threatVerb) {
    if (typeof threatVerb === 'string') this.#threatVerb = threatVerb;
    else throw new Error(`Risk ${this.#riskIdRef}: threat verb is not an string`);
  }

  set threatVerbDetail(threatVerbDetail) {
    if (typeof threatVerbDetail === 'string') this.#threatVerbDetail = threatVerbDetail;
    else throw new Error(`Risk ${this.#riskIdRef}: threat verb detail is not an string`);
  }

  set motivation(motivation) {
    if (typeof motivation === 'string') this.#motivation = motivation;
    else throw new Error(`Risk ${this.#riskIdRef}: motivation is not an string`);
  }

  set motivationDetail(motivationDetail) {
    if (typeof motivationDetail === 'string') this.#motivationDetail = motivationDetail;
    else throw new Error(`Risk ${this.#riskIdRef}: motivation detail is not an string`);
  }

  set businessAssetRef(businessAssetRef) {
    if (Number.isSafeInteger(businessAssetRef) || businessAssetRef === null) {
      this.#businessAssetRef = businessAssetRef;
    } else throw new Error(`Risk ${this.#riskIdRef}: business asset ref is not an integer`);
  }

  set supportingAssetRef(supportingAssetRef) {
    if (Number.isSafeInteger(supportingAssetRef) || supportingAssetRef === null) {
      this.#supportingAssetRef = supportingAssetRef;
    } else throw new Error(`Risk ${this.#riskIdRef}: supporting asset ref is not an integer`);
  }

  // RiskName object is loaded to riskName in corresponding Risk
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
};
