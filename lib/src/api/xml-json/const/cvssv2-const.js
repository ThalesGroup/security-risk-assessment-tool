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

const metricsCVSSV2 = {
  accessVector: [
    {
      name: 'L',
      value: 0.395,
    },
    {
      name: 'A',
      value: 0.646,
    },
    {
      name: 'N',
      value: 1,
    },
  ],

  accessComplexity: [
    {
      name: 'H',
      value: 0.35,
    },
    {
      name: 'M',
      value: 0.61,
    },
    {
      name: 'L',
      value: 0.71,
    },
  ],

  authentication: [
    {
      name: 'M',
      value: 0.45,
    },
    {
      name: 'S',
      value: 0.56,
    },
    {
      name: 'N',
      value: 0.704,
    },
  ],

  confidentialityImpact: [
    {
      name: 'N',
      value: 0,
    },
    {
      name: 'P',
      value: 0.275,
    },
    {
      name: 'C',
      value: 0.660,
    },
  ],

  integrityImpact: [
    {
      name: 'N',
      value: 0,
    },
    {
      name: 'P',
      value: 0.275,
    },
    {
      name: 'C',
      value: 0.660,
    },
  ],

  availabilityImpact: [
    {
      name: 'N',
      value: 0,
    },
    {
      name: 'P',
      value: 0.275,
    },
    {
      name: 'C',
      value: 0.660,
    },
  ],

  // For metrics below, metric value = 1 by default assign to name = 'ND'
  exploitability: [
    {
      name: 'U',
      value: 0.85,
    },
    {
      name: 'POC',
      value: 0.9,
    },
    {
      name: 'F',
      value: 0.95,
    },
    {
      name: 'ND',
      value: 1,
    },
  ],

  remediationLevel: [
    {
      name: 'OF',
      value: 0.87,
    },
    {
      name: 'TF',
      value: 0.9,
    },
    {
      name: 'W',
      value: 0.95,
    },
    {
      name: 'ND',
      value: 1,
    },
  ],

  reportConfidence: [
    {
      name: 'UC',
      value: 0.9,
    },
    {
      name: 'UR',
      value: 0.95,
    },
    {
      name: 'ND',
      value: 1,
    },
  ],
};

module.exports = metricsCVSSV2;
