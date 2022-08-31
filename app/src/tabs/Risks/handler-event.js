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
const Risk = require('../../../../lib/src/model/classes/Risk/risk');

/**
  * add default risk row
  * @param {ISRAProject} israProject current ISRA Project
*/
const addRisk = (israProject) =>{
    try {
        const risk = new Risk();
        israProject.addRisk(risk);
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
  * delete selected risk row(s)
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Array} ids of risk id(s)
*/
const updateRiskName = (israProject, win, id, field, value) => {
    try {
        const risk = israProject.getRisk(id);
        const { riskName, allAttackPathsName } = risk;
        
        if(field === 'threatAgent' || field === 'threatVerb' || field === 'motivation' || field === 'riskName'){
            riskName[field] = value;
        }else{
            riskName[field] = parseInt(value);
        };

        let businessAsset = null, supportingAsset = null;
        if(riskName.businessAssetRef) {
            businessAsset = israProject.getBusinessAsset(riskName.businessAssetRef);
            updateRiskImpact(israProject, risk.riskId);
        };
        if(riskName.supportingAssetRef) supportingAsset = israProject.getSupportingAsset(riskName.supportingAssetRef);

        if(field !== 'riskName'){
            riskName.riskName = 'As a '+  riskName.threatAgent + ', I can ' + riskName.threatVerb + ' the ' + (businessAsset === null ? '' : businessAsset.businessAssetName) + ' compromising the ' + (supportingAsset === null ? '' : supportingAsset.supportingAssetName) + ' in order to ' + riskName.motivation;
            if(allAttackPathsName.length > 0){
                riskName.riskName += `, exploiting the ${allAttackPathsName}`;
              };
        };

        // console.log(risk.riskName.properties)
        win.webContents.send('risks:load', israProject.toJSON());
    } catch (err) {
        console.log(err);
      dialog.showMessageBoxSync(null, { message: `Failed to update risk ${id}: riskName` });
    }
}; 

/**
  * update risk impact evaluation
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Integer} risk id
*/
const updateRiskLikelihood = (israProject, id, field, value) =>{
    try {
        const risk = israProject.getRisk(id);
        const { riskLikelihood } = risk;

        const updateRiskLikelihoodValue = () => {
            const { threatFactorLevel, occurrenceLevel } = riskLikelihood;
            if (
                (threatFactorLevel === 'Low' && occurrenceLevel === 'Low') ||
                (threatFactorLevel === 'Medium' && occurrenceLevel === 'Low') ||
                (threatFactorLevel === 'Low' && occurrenceLevel === 'Medium')
            ) riskLikelihood.riskLikelihood = 1;
            else if (
                (threatFactorLevel === 'Medium' && occurrenceLevel === 'Very High') ||
                (threatFactorLevel === 'High' && occurrenceLevel === 'High') ||
                (threatFactorLevel === 'Very High' && occurrenceLevel === 'Medium')
            ) riskLikelihood.riskLikelihood = 3;
            else if (
                (threatFactorLevel === 'High' && occurrenceLevel === 'Very High') ||
                (threatFactorLevel === 'Very High' && occurrenceLevel === 'Very High') ||
                (threatFactorLevel === 'Very High' && occurrenceLevel === 'High')
            ) riskLikelihood.riskLikelihood = 4;
            else riskLikelihood.riskLikelihood = 2;
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

            riskLikelihood[field] = parseInt(value);
            updateOccurrenceLevel(parseInt(value));
        };

        updateRiskLikelihoodValue();
        console.log(riskLikelihood.properties);
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
 
        return risk.properties;
    } catch (err) {
        console.log(err);
      dialog.showMessageBoxSync(null, { message: `Failed to update risk ${id}: riskLikelihood` });
    }
}; 

module.exports = {
    addRisk,
    deleteRisk,
    updateRiskName,
    updateRiskLikelihood,
    updateRiskImpact
};