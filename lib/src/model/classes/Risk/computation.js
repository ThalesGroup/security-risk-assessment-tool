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

/** compute Risk Attack Path name (AND)
    * @param {RiskAttackPath} riskAttackPath instance of RiskAttackPath
  */
const computeAttackPathName = (riskAttackPath) => {
  const rap = riskAttackPath;
  const attackPathNameArr = rap.properties.vulnerabilityRef.map((ref) => `${ref.name}`);
  rap.attackPathName = attackPathNameArr.join(' AND ');
};

/** calculate Risk Attack Path Score
    * @param {RiskAttackPath} riskAttackPath instance of RiskAttackPath
  */
const calculateAttackPathScore = (riskAttackPath) => {
  const rap = riskAttackPath;
  const attackPathScoreArr = rap.properties.vulnerabilityRef.map((ref) => `${ref.score}`);
  rap.attackPathScore = Math.min(...attackPathScoreArr);
};

// const computeAutomaticRiskName = (riskName, israProject) => {
//   const rn = riskName;
//   const businessAssetName = israProject.getBusinessAsset(riskName.businessAssetRef);
//   const supportingAssetName = israProject.getBusinessAsset(riskName.supportingAssetRef);

//   rn.riskName = `As a ${rn.threatAgent}, I can ${rn.threatVerb} the ${businessAssetName}, compromising the ${supportingAssetName}`;
// };

/** update Business Asset Property Flags in RiskImpact based on threatVerb in RiskName
    * @param {RiskImpact} riskImpact instance of RiskImpact
    * @param {RiskName} riskName corresponding instance of RiskName
  */
const updateBusinessAssetFlags = (riskImpact, riskName) => {
  const ri = riskImpact;
  const verb = riskName.threatVerb;
  switch (verb) {
    case 'steal':
    case 'disclose':
    case 'lose':
      ri.businessAssetConfidentialityFlag = 1;
      ri.businessAssetIntegrityFlag = 0;
      ri.businessAssetAvailabilityFlag = 0;
      ri.businessAssetAuthenticityFlag = 0;
      ri.businessAssetNonRepudiationFlag = 0;
      ri.businessAssetAuthorizationFlag = 0;
      break;
    case 'tamper with':
      ri.businessAssetConfidentialityFlag = 0;
      ri.businessAssetIntegrityFlag = 1;
      ri.businessAssetAvailabilityFlag = 0;
      ri.businessAssetAuthenticityFlag = 0;
      ri.businessAssetNonRepudiationFlag = 0;
      ri.businessAssetAuthorizationFlag = 0;
      break;
    case 'deny access to':
    case 'flood':
      ri.businessAssetConfidentialityFlag = 0;
      ri.businessAssetIntegrityFlag = 0;
      ri.businessAssetAvailabilityFlag = 1;
      ri.businessAssetAuthenticityFlag = 0;
      ri.businessAssetNonRepudiationFlag = 0;
      ri.businessAssetAuthorizationFlag = 0;
      break;
    case 'spoof':
      ri.businessAssetConfidentialityFlag = 0;
      ri.businessAssetIntegrityFlag = 0;
      ri.businessAssetAvailabilityFlag = 0;
      ri.businessAssetAuthenticityFlag = 1;
      ri.businessAssetNonRepudiationFlag = 0;
      ri.businessAssetAuthorizationFlag = 0;
      break;
    case 'repudiate':
      ri.businessAssetConfidentialityFlag = 0;
      ri.businessAssetIntegrityFlag = 0;
      ri.businessAssetAvailabilityFlag = 0;
      ri.businessAssetAuthenticityFlag = 0;
      ri.businessAssetNonRepudiationFlag = 1;
      ri.businessAssetAuthorizationFlag = 0;
      break;
    case 'gain an unauthorized access to':
      ri.businessAssetConfidentialityFlag = 0;
      ri.businessAssetIntegrityFlag = 0;
      ri.businessAssetAvailabilityFlag = 0;
      ri.businessAssetAuthenticityFlag = 0;
      ri.businessAssetNonRepudiationFlag = 0;
      ri.businessAssetAuthorizationFlag = 1;
      break;
    default:
      ri.businessAssetConfidentialityFlag = 1;
      ri.businessAssetIntegrityFlag = 1;
      ri.businessAssetAvailabilityFlag = 1;
      ri.businessAssetAuthenticityFlag = 1;
      ri.businessAssetNonRepudiationFlag = 1;
      ri.businessAssetAuthorizationFlag = 1;
  }
};

/** calculate riskImpact in RiskImpact based on
 * corresponding value of selected falg properties in Business Asset Properties
    * @param {RiskImpact} riskImpact instance of RiskImpact
    * @param {BusinessAssetProperties} businessAssetProperties
    * corresponding instance of BusinessAssetProperties
  */
const calculateRiskImpact = (riskImpact, businessAssetProperties) => {
  const ri = riskImpact;
  const valuesOfSelectedFlags = [];

  const updateValue = (flagValue) => {
    valuesOfSelectedFlags.push(flagValue);
  };

  if (ri.businessAssetConfidentialityFlag === 1) {
    updateValue(businessAssetProperties.businessAssetConfidentiality);
  }
  if (ri.businessAssetIntegrityFlag === 1) {
    updateValue(businessAssetProperties.businessAssetIntegrity);
  }
  if (ri.businessAssetAvailabilityFlag === 1) {
    updateValue(businessAssetProperties.businessAssetAvailability);
  }
  if (ri.businessAssetAuthenticityFlag === 1) {
    updateValue(businessAssetProperties.businessAssetAuthenticity);
  }
  if (ri.businessAssetNonRepudiationFlag === 1) {
    updateValue(businessAssetProperties.businessAssetNonRepudiation);
  }
  if (ri.businessAssetAuthorizationFlag === 1) {
    updateValue(businessAssetProperties.businessAssetAuthorization);
  }

  ri.riskImpact = Math.max(...valuesOfSelectedFlags);
};

module.exports = {
  computeAttackPathName,
  calculateAttackPathScore,
  updateBusinessAssetFlags,
  calculateRiskImpact,
};
