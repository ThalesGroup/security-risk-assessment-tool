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
// const ISRAProject = require('../../src/model/classes/ISRAProject/isra-project');
const BusinessAssetProperties = require('../../src/model/classes/BusinessAsset/business-asset-properties');
const RiskAttackPath = require('../../src/model/classes/Risk/risk-attack-path');
const RiskImpact = require('../../src/model/classes/Risk/risk-impact');
const RiskName = require('../../src/model/classes/Risk/risk-name');
const Vulnerability = require('../../src/model/classes/Vulnerability/vulnerability');

const {
  computeAttackPathName,
  calculateAttackPathScore,
  updateBusinessAssetFlags,
  calculateRiskImpact,
} = require('../../src/model/classes/Risk/computation');
const { calculateOverallScore } = require('../../src/model/classes/Vulnerability/computation');

describe('Test all class property computations', () => {
//   const israProject = new ISRAProject();
  const riskAttackPath = new RiskAttackPath();
  const vulnerability = new Vulnerability();

  test('test Risk Attack Path Name computation', () => {
    computeAttackPathName(riskAttackPath);
    expect(riskAttackPath.attackPathName).toBe('');

    riskAttackPath.addVulnerability({
      vulnerabilityIdRef: 1,
      name: 'Vulnerability name 1',
      score: 1,
    });

    computeAttackPathName(riskAttackPath);
    expect(riskAttackPath.attackPathName).toBe('Vulnerability name 1');

    riskAttackPath.addVulnerability({
      vulnerabilityIdRef: 2,
      name: 'Vulnerability name 2',
      score: 2,
    });

    computeAttackPathName(riskAttackPath);
    expect(riskAttackPath.attackPathName).toBe('Vulnerability name 1 AND Vulnerability name 2');
  });

  test('test Risk Attack Path Score computation', () => {
    calculateAttackPathScore(riskAttackPath);
    expect(riskAttackPath.attackPathScore).toBe(1);
  });

  test('test Vulnerability overallScore & overallLevel computation', () => {
    vulnerability.cveScore = 1.4;
    calculateOverallScore(vulnerability);
    expect(vulnerability.overallScore).toEqual(1);
    expect(vulnerability.overallLevel).toEqual('Low');

    vulnerability.cveScore = 5.5;
    calculateOverallScore(vulnerability);
    expect(vulnerability.overallScore).toEqual(6);
    expect(vulnerability.overallLevel).toEqual('Medium');

    vulnerability.cveScore = 9.7;
    calculateOverallScore(vulnerability);
    expect(vulnerability.overallScore).toEqual(10);
    expect(vulnerability.overallLevel).toEqual('High');
  });
});
