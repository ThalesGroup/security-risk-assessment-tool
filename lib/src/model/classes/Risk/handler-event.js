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
    dialog,
} = require('electron');  
const Risk = require('./risk');
const RiskAttackPath = require('./risk-attack-path');

/**
  * add default risk row
  * @param {ISRAProject} israProject current ISRA Project
*/
const addRisk = (israProject) =>{
    try {
        const risk = new Risk();
        israProject.addRisk(risk);
        addRiskAttackPath(israProject, risk.riskId);
        return [risk.properties];
    } catch (err) {
        return dialog.showMessageBoxSync(null, { message: 'Failed to add Risk' });
    }
};

/**
  * delete selected risk row(s)
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Array} ids of risk id(s)
*/
const deleteRisk = (israProject, ids) => {
    try {
        ids.forEach((id) => {
            israProject.deleteRisk(Number(id));
        });
    } catch (err) {
      dialog.showMessageBoxSync(null, { message: 'Failed to delete risk(s)' });
    }
};

/**
  * update riskImpact checkboxes based on threatVerb field value
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} risk id
  * @param {string} riskName enum property value
*/
const updateRiskImpactThreatVerb = (israProject, riskId, value) =>{
    if(value === 'steal' || value === 'disclose' || value === 'lose'){
        updateRiskImpact(israProject, riskId, 'businessAssetConfidentialityFlag', 1);
        updateRiskImpact(israProject, riskId, 'businessAssetIntegrityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAvailabilityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthenticityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthorizationFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetNonRepudiationFlag', 0);
    }else if(value === 'tamper with'){
        updateRiskImpact(israProject, riskId, 'businessAssetConfidentialityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetIntegrityFlag', 1);
        updateRiskImpact(israProject, riskId, 'businessAssetAvailabilityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthenticityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthorizationFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetNonRepudiationFlag', 0);
    }else if(value === 'deny access to' || value === 'flood'){
        updateRiskImpact(israProject, riskId, 'businessAssetConfidentialityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetIntegrityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAvailabilityFlag', 1);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthenticityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthorizationFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetNonRepudiationFlag', 0);
    }else if(value === 'spoof'){
        updateRiskImpact(israProject, riskId, 'businessAssetConfidentialityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetIntegrityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAvailabilityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthenticityFlag', 1);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthorizationFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetNonRepudiationFlag', 0);
    }else if(value === 'repudiate'){
        updateRiskImpact(israProject, riskId, 'businessAssetConfidentialityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetIntegrityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAvailabilityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthenticityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthorizationFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetNonRepudiationFlag', 1);
    } else if(value === 'gain an unauthorized access to') {
        updateRiskImpact(israProject, riskId, 'businessAssetConfidentialityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetIntegrityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAvailabilityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthenticityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthorizationFlag', 1);
        updateRiskImpact(israProject, riskId, 'businessAssetNonRepudiationFlag', 0);
    };
};

/**
  * update risk name evaluation
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} risk id
  * @param {string} riskName property
  * @param {} riskName property value
*/
const updateRiskName = (israProject, win, id, field, value) => {
    try {
        const risk = israProject.getRisk(id);
        const { riskName, allAttackPathsName } = risk;
        
        if(field){
            if(field === 'threatAgent' || field === 'threatVerb' || field === 'motivation' || field === 'riskName'){
                riskName[field] = value;
                if (field === 'threatVerb') updateRiskImpactThreatVerb(israProject, id, value);
                else if(field === 'riskName') riskName.isAutomaticRiskName = false;
            }else{
                riskName[field] = parseInt(value);
                if(field === 'businessAssetRef') riskName.supportingAssetRef = null;
            };
        };

        let businessAsset = null, supportingAsset = null;
        if(riskName.businessAssetRef) {
            businessAsset = israProject.getBusinessAsset(riskName.businessAssetRef);
            // update riskImpact
            updateRiskImpact(israProject, risk.riskId);
        };
        if(riskName.supportingAssetRef) supportingAsset = israProject.getSupportingAsset(riskName.supportingAssetRef);

        if(field !== 'riskName'){
            riskName.riskName = 'As a '+  riskName.threatAgent + ', I can ' + riskName.threatVerb + ' the ' + (businessAsset === null ? '' : businessAsset.businessAssetName) + ' compromising the ' + (supportingAsset === null ? '' : supportingAsset.supportingAssetName) + ' in order to ' + riskName.motivation;
            if(allAttackPathsName.length > 0){
                riskName.riskName += `, exploiting the ${allAttackPathsName}`;
              };
            riskName.isAutomaticRiskName = true;
        };

        console.log('riskName', risk.riskName.properties)
        win.webContents.send('risks:load', israProject.toJSON());
    } catch (err) {
        console.log(err);
      dialog.showMessageBoxSync(null, { message: `Failed to update risk ${id}: riskName` });
    }
}; 

const calculateRiskLikelihood = (riskLikelihood) =>{
    const { threatFactorLevel, occurrenceLevel } = riskLikelihood;
    if (
        (threatFactorLevel === 'Low' && occurrenceLevel === 'Low') ||
        (threatFactorLevel === 'Medium' && occurrenceLevel === 'Low') ||
        (threatFactorLevel === 'Low' && occurrenceLevel === 'Medium')
    ) return 1;
    else if (
        (threatFactorLevel === 'Medium' && occurrenceLevel === 'Very High') ||
        (threatFactorLevel === 'High' && occurrenceLevel === 'High') ||
        (threatFactorLevel === 'Very High' && occurrenceLevel === 'Medium')
    ) return 3;
    else if (
        (threatFactorLevel === 'High' && occurrenceLevel === 'Very High') ||
        (threatFactorLevel === 'Very High' && occurrenceLevel === 'Very High') ||
        (threatFactorLevel === 'Very High' && occurrenceLevel === 'High')
    ) return 4;
    else return 2;
};

/**
  * update risk impact evaluation
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Integer} risk id
  * @param {string} riskLikelihood property
  * @param {Object} riskLikelihood property values

*/
const updateRiskLikelihood = (israProject, id, field, value) =>{
    try {
        const risk = israProject.getRisk(id);
        const { riskLikelihood } = risk;

        const updateRiskLikelihoodValue = () => {
            riskLikelihood.riskLikelihood = calculateRiskLikelihood(riskLikelihood);
        };

        if(field === 'threatFactorScore'){
            let sum = 0, threatFactors = 0;

            const updateThreatFactorLevel = (riskLikelihood) => {
                const { threatFactorScore } = riskLikelihood;
                if(!threatFactorScore) riskLikelihood.threatFactorLevel = '';
                else if(threatFactorScore < 3) riskLikelihood.threatFactorLevel = 'Low';
                else if (threatFactorScore >= 3 && threatFactorScore <= 5) riskLikelihood.threatFactorLevel = 'Medium';
                else if (threatFactorScore > 5 && threatFactorScore <= 7) riskLikelihood.threatFactorLevel = 'High';
                else if (threatFactorScore > 7) riskLikelihood.threatFactorLevel = 'Very High';
            };

            for (let [key, threatFactorValue] of Object.entries(value)) {
                if(threatFactorValue === 'null') {
                    riskLikelihood[key] = null;
                }else{
                    riskLikelihood[key] = parseInt(threatFactorValue);
                    threatFactors ++;
                    sum += parseInt(threatFactorValue);
                };
            };

            if(!threatFactors) riskLikelihood.threatFactorScore = null;
            else riskLikelihood.threatFactorScore = sum/threatFactors;
            updateThreatFactorLevel(riskLikelihood);
        } else if (field === 'occurrence'){
            const updateOccurrenceLevel = (occurrence) =>{
                if(!occurrence) riskLikelihood.occurrenceLevel = '';
                else if (occurrence < 3) riskLikelihood.occurrenceLevel = 'Low';
                else if (occurrence >= 3 && occurrence <= 5) riskLikelihood.occurrenceLevel = 'Medium';
                else if (occurrence > 5 && occurrence <= 7) riskLikelihood.occurrenceLevel = 'High';
                else if (occurrence > 7) riskLikelihood.occurrenceLevel = 'Very High';
            };

            riskLikelihood[field] = value === 'null' ? null : parseInt(value);
            updateOccurrenceLevel(parseInt(value));
        };

        if(field === 'riskLikelihood'){
            riskLikelihood[field] = parseInt(value);
            riskLikelihood.isOWASPLikelihood = false;
        }else if (field !== 'isOWASPLikelihood'){
            updateRiskLikelihoodValue();
            riskLikelihood.isOWASPLikelihood = true;
        }else riskLikelihood[field] = value;

        console.log('riskLikelihood', riskLikelihood.properties);
        return riskLikelihood.properties;
    } catch (err) {
        console.log(err);
      dialog.showMessageBoxSync(null, { message: `Failed to update risk ${id}: riskLikelihood` });
    }
};

/**
  * update risk impact evaluation
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Integer} risk id
  * @param {string} riskImpact property
  * @param {} riskImpact property value
*/
const updateRiskImpact = (israProject, id, field, value) => {
    try {
        const risk = israProject.getRisk(id);
        const { riskImpact } = risk;

        // set businessAsset property Flags
        if(field) riskImpact[field] = value;
        const {
            businessAssetConfidentialityFlag,
            businessAssetIntegrityFlag,
            businessAssetAvailabilityFlag,
            businessAssetAuthenticityFlag,
            businessAssetAuthorizationFlag,
            businessAssetNonRepudiationFlag,
        } = riskImpact;

        if(risk.riskName.businessAssetRef){
            const businessAsset = israProject.getBusinessAsset(risk.riskName.businessAssetRef);
            const {
                businessAssetConfidentiality,
                businessAssetIntegrity,
                businessAssetAvailability,
                businessAssetAuthenticity,
                businessAssetAuthorization,
                businessAssetNonRepudiation,

            } = businessAsset.businessAssetProperties;
            riskImpact.riskImpact = Math.max(
                businessAssetConfidentialityFlag ? businessAssetConfidentiality : 0,
                businessAssetIntegrityFlag ? businessAssetIntegrity : 0,
                businessAssetAvailabilityFlag ? businessAssetAvailability : 0,
                businessAssetAuthenticityFlag ? businessAssetAuthenticity : 0,
                businessAssetAuthorizationFlag ? businessAssetAuthorization : 0,
                businessAssetNonRepudiationFlag ? businessAssetNonRepudiation : 0
            );

        }else riskImpact.riskImpact = null;
 
        console.log('riskImpact', riskImpact.properties);
        return risk.properties;
    } catch (err) {
        console.log(err);
      dialog.showMessageBoxSync(null, { message: `Failed to update risk ${id}: riskLikelihood` });
    }
}; 

/**
  * add default risk attack path row
  * @param {ISRAProject} israProject current ISRA Project
*/
const addRiskAttackPath = (israProject, riskId) => {
    try {
        const riskAttackPath = new RiskAttackPath();
        const risk = israProject.getRisk(riskId);

        riskAttackPath.addVulnerability({
            vulnerabilityIdRef: null,
            score: null,
            name: '',
        });
        risk.addRiskAttackPath(riskAttackPath);

        return [[riskAttackPath.properties], israProject.properties.Risk];
    } catch (err) {
        return dialog.showMessageBoxSync(null, { message: `Failed to add Risk Attack Path for Risk ${riskId}` });
    }
};

/**
  * delete selected risk attack path row(s)
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Array} ids of risk attack path id(s)
*/
const deleteRiskAttackPath = (israProject, riskId, ids) => {
    try {
        ids.forEach((id) => {
            israProject.getRisk(Number(riskId)).deleteRiskAttackPath(Number(id));
        });
    } catch (err) {
        dialog.showMessageBoxSync(null, { message: `Failed to delete Risk Attack Path(s) for Risk ${riskId}` });
    }
};

module.exports = {
    addRisk,
    deleteRisk,
    updateRiskName,
    updateRiskLikelihood,
    updateRiskImpact,
    addRiskAttackPath,
    deleteRiskAttackPath
};