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

const { benefitsEnum, decisionEnum } = require('./enum');
const { isValidHtml } = require('../../validation/validation');

// Risk mitigation evaluation to calculate mitigatedRiskScore for each risk mitigation
module.exports = class RiskMitigation {
  // value of risk attack id
  #riskMitigationId;

  // referenced value of riskId from Risk
  #riskIdRef;

  // text input of security control description
  #description;

  // value of expected benefits selected
  #benefits;

  // integer input of cost
  #cost;

  // value of mitigation decision selected
  #decision;

  // text input of decision comment
  #decisionDetail;

  /* calculated value of mitigations benefits when value of
  mitigation decision selected = 'Done' or 'Accepted' */
  #mitigationsBenefits;

  // calculated value of mitigations when value of mitigation decision selected = 'Done'
  #mitigationsDoneBenefits;

  set riskIdRef(riskIdRef) {
    if ((Number.isSafeInteger(riskIdRef)
    && riskIdRef > 0)
    || riskIdRef === null) this.#riskIdRef = riskIdRef;
    else throw new Error(`Risk ${riskIdRef}: Risk id ref is not null/integer`);
  }

  set riskMitigationId(riskMitigationId) {
    if ((Number.isSafeInteger(riskMitigationId)
    && riskMitigationId > 0)
    || riskMitigationId === null) {
      this.#riskMitigationId = riskMitigationId;
    } else throw new Error(`Risk ${riskMitigationId}: Risk id ref is not null/integer`);
  }

  set description(description) {
    if (typeof description === 'string' && isValidHtml(description)) this.#description = description;
    else throw new Error(`Risk ${this.#riskIdRef}: attack path: ${this.#riskMitigationId}: description is not a html string`);
  }

  set benefits(benefits) {
    if ((!Number.isNaN(benefits)
    && typeof benefits === 'number'
    && benefits in benefitsEnum)
    || benefits === null) this.#benefits = benefits;
    else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: benefits is an invalid null/double`);
  }

  set cost(cost) {
    if (Number.isSafeInteger(cost) || cost === null) this.#cost = cost;
    else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: cost is not null/integer`);
  }

  set decision(decision) {
    if (decision in decisionEnum) this.#decision = decision;
    else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: decision is invalid`);
  }

  set decisionDetail(decisionDetail) {
    if (typeof decisionDetail === 'string' && isValidHtml(decisionDetail)) this.#decisionDetail = decisionDetail;
    else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: decision detail is not a string`);
  }

  set mitigationsBenefits(mitigationsBenefits) {
    if ((!Number.isNaN(mitigationsBenefits)
    && typeof mitigationsBenefits === 'number')
    || mitigationsBenefits === null) {
      this.#mitigationsBenefits = mitigationsBenefits;
    } else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: mitigations benefits is an invalid null/double`);
  }

  set mitigationsDoneBenefits(mitigationsDoneBenefits) {
    if ((!Number.isNaN(mitigationsDoneBenefits)
    && typeof mitigationsDoneBenefits === 'number')
    || mitigationsDoneBenefits === null) {
      this.#mitigationsDoneBenefits = mitigationsDoneBenefits;
    } else throw new Error(`Risk ${this.#riskIdRef}: ${this.#riskMitigationId}: mitigations done benefits is an invalid null/double`);
  }

  // RiskMitigation is loaded to riskMitigationMap in corresponding Risk
  get properties() {
    return {
      riskIdRef: this.#riskIdRef,
      riskMitigationId: this.#riskMitigationId,
      description: this.#description,
      benefits: this.#benefits,
      cost: this.#cost,
      decision: this.#decision,
      decisionDetail: this.#decisionDetail,
      mitigationsBenefits: this.#mitigationsBenefits,
      mitigationsDoneBenefits: this.#mitigationsDoneBenefits,
    };
  }
};
