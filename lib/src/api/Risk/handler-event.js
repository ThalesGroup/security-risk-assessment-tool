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
    dialog, BrowserWindow
} = require('electron');  
const Risk = require('../../model/classes/Risk/risk');
const RiskAttackPath = require('../../model/classes/Risk/risk-attack-path');
const RiskMitigation = require('../../model/classes/Risk/risk-mitigation');

const getMainWindow = () => {
    const ID = process.env.MAIN_WINDOW_ID * 1;
    return BrowserWindow.fromId(ID);
  };

  const currentWin = BrowserWindow.getFocusedWindow();

/**
  * add default risk row
  * @param {ISRAProject} israProject current ISRA Project
*/
const addRisk = (israProject) =>{
    try {
        const risk = new Risk();
        risk.addRiskMitigation(new RiskMitigation());
        israProject.addRisk(risk);
        addRiskAttackPath(israProject, risk.riskId);
        return [risk.properties, israProject.properties.Risk];
    } catch (err) {
        return dialog.showMessageBox(currentWin, { message: 'Failed to add Risk' });
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
      dialog.showMessageBox(currentWin, { message: 'Failed to delete risk(s)' });
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
    } else if (value === '') {
        updateRiskImpact(israProject, riskId, 'businessAssetConfidentialityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetIntegrityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAvailabilityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthenticityFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetAuthorizationFlag', 0);
        updateRiskImpact(israProject, riskId, 'businessAssetNonRepudiationFlag', 0);
    };
};

const constructRiskName = (risk, israProject, field = 'updateRiskName') => {
    const { riskName, allAttackPathsName } = risk;
    let businessAsset = null, supportingAsset = null;
    // if (riskName.businessAssetRef !== null) {
    //     businessAsset = israProject.getBusinessAsset(riskName.businessAssetRef);
    //     // update riskImpact
    //     updateRiskImpact(israProject, risk.riskId);
    // };
    if (riskName.businessAssetRef !== null) businessAsset = israProject.getBusinessAsset(riskName.businessAssetRef);
    updateRiskImpact(israProject, risk.riskId);
    
    if (riskName.supportingAssetRef !== null) supportingAsset = israProject.getSupportingAsset(riskName.supportingAssetRef);

    if (field !== 'riskName') {
        if (field === 'automatic riskName') riskName.isAutomaticRiskName = true;
        
        if (riskName.isAutomaticRiskName){
            riskName.riskName = 'As a ' + riskName.threatAgent + ', I can ' + riskName.threatVerb + ' the ' + (businessAsset === null ? '' : businessAsset.businessAssetName) + ' compromising the ' + (supportingAsset === null ? '' : supportingAsset.supportingAssetName) + ' in order to ' + riskName.motivation;
            if (allAttackPathsName.length > 0) {
                riskName.riskName += `, exploiting the ${allAttackPathsName}`;
            };
        }
    };
}

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
        const { riskName } = risk;
        
        if(field){
            if(field === 'threatAgent' || field === 'threatVerb' || field === 'motivation' || field === 'riskName'){
                riskName[field] = value;
                if (field === 'threatVerb') updateRiskImpactThreatVerb(israProject, id, value);
                else if(field === 'riskName') riskName.isAutomaticRiskName = false;
            }else{
                riskName[field] = value === 'null' ? null : parseInt(value);
                if(field === 'businessAssetRef') riskName.supportingAssetRef = null; 
            };
        };

        constructRiskName(risk, israProject, field);

        // console.log('riskName', risk.riskName.properties);
        return risk.properties;
        // return risk.properties;
    } catch (err) {
        console.log(err);
      dialog.showMessageBox(currentWin, { message: `Failed to update risk ${id}: riskName` });
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
const updateRiskLikelihood = (israProject, id, field, value, win) =>{
    try {
        const risk = israProject.getRisk(id);
        const { riskLikelihood, allAttackPathsScore } = risk;

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

        calculateInherentRiskScore(risk);
        console.log('riskLikelihood', riskLikelihood.properties);

        return risk.properties;
    } catch (err) {
        console.log(err);
      dialog.showMessageBox(currentWin, { message: `Failed to update risk ${id}: riskLikelihood` });
    }
};

/**
  * update risk impact evaluation
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Integer} risk id
  * @param {string} riskImpact property
  * @param {} riskImpact property value
*/
const updateRiskImpact = (israProject, id, field, value, win) => {
    try {
        const risk = israProject.getRisk(id);
        const { riskImpact, inherentRiskScore } = risk;

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

        if (inherentRiskScore != null) calculateInherentRiskScore(risk);

        console.log('riskImpact', riskImpact.properties);
        return risk.properties;
    } catch (err) {
        console.log(err);
      dialog.showMessageBox(currentWin, { message: `Failed to update risk ${id}: riskLikelihood` });
    }
}; 

const calculateAllAttackPathsName = (risk, israProject) => {
    let allAttackPathsName = '';

    risk.properties.riskAttackPaths.forEach((path, i) => {
        if (i > 0) allAttackPathsName += ' OR ';
        allAttackPathsName += `(${path.attackPathName})`;
    });

    if (risk.properties.riskAttackPaths.length === 1) allAttackPathsName = allAttackPathsName.slice(1, -1);
    risk.allAttackPathsName = allAttackPathsName;
    constructRiskName(risk, israProject);
};

const calculateAttackPathName = (risk, riskAttackPath, israProject) => {
    const names = [];
    riskAttackPath.properties.vulnerabilityRef.forEach((ref) => {
        const { name } = ref;
        names.push(name);
    });

    if (names.length === 0) riskAttackPath.attackPathName = '';
    else {
        let attackPathName = '';
        names.forEach((name, i) => {
            if (i > 0) attackPathName += ' AND ';
            attackPathName += name; 
        });
        riskAttackPath.attackPathName = attackPathName;
    }
    calculateAllAttackPathsName(risk, israProject);
};

const calculateInherentRiskScore = (risk) => {
    const { riskLikelihood, riskImpact, allAttackPathsScore } = risk;
    if (allAttackPathsScore === null) {
        risk.inherentRiskScore = Math.round((riskImpact.riskImpact * 5 * riskLikelihood.riskLikelihood * 5) / 20);
    } else {
        risk.inherentRiskScore = Math.round((riskImpact.riskImpact * 5 * (riskLikelihood.riskLikelihood * 5 + allAttackPathsScore * 2)) / 40);
    };
    calculateMitigatedRiskScore(risk);
};

const calculateAllAttackPathsScore = (risk) => {
    const { riskAttackPaths } = risk.properties;
    const attackPathScores = [];
    riskAttackPaths.forEach((path) => {
        const { attackPathScore } = path;
        if (attackPathScore !== null) attackPathScores.push(attackPathScore);
    });
    if (attackPathScores.length === 0) risk.allAttackPathsScore = null;
    else risk.allAttackPathsScore = Math.max(...attackPathScores);
    calculateInherentRiskScore(risk);
};

const calculateAttackPathScore = (risk, riskAttackPath) => {
    const overallScores = [];
    riskAttackPath.properties.vulnerabilityRef.forEach((ref) => {
        const { score } = ref;
        if (score !== null) overallScores.push(score);
    });

    if (overallScores.length === 0) riskAttackPath.attackPathScore = null;
    else riskAttackPath.attackPathScore = Math.min(...overallScores);
    calculateAllAttackPathsScore(risk);
};

/**
  * add default risk attack path row
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} riskId current riskId
  * @param {object} riskId current window
*/
const addRiskAttackPath = (israProject, riskId, win) => {
    try {
        const riskAttackPath = new RiskAttackPath();
        const risk = israProject.getRisk(riskId);

        riskAttackPath.addVulnerability({
            vulnerabilityIdRef: null,
            score: null,
            name: '',
        });
        risk.addRiskAttackPath(riskAttackPath);
        calculateAllAttackPathsName(risk, israProject);
        return risk.properties;
        // if(win) win.webContents.send('risks:load', risk.properties);
    } catch (err) {
        console.log(err)
        return dialog.showMessageBox(currentWin, { message: `Failed to add Risk Attack Path for Risk ${riskId}` });
    }
};

/**
  * delete selected risk attack path row(s)
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Array} ids of risk attack path id(s)
*/
const deleteRiskAttackPath = (israProject, riskId, ids, win) => {
    try {
        const risk = israProject.getRisk(Number(riskId));
        sortedIds = ids.sort((a, b) => b - a);
        sortedIds.forEach((id) => {
            risk.deleteRiskAttackPath(Number(id));
        });
        calculateAllAttackPathsScore(risk,);
        calculateAllAttackPathsName(risk, israProject);
        return risk.properties;
    } catch (err) {
        console.log(err)
        dialog.showMessageBox(currentWin, { message: `Failed to delete Risk Attack Path(s) for Risk ${riskId}` });
    }
};

/**
  * update selected risk attack path row
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} riskId of selected risk
  * @param {integer} riskAttackPathId of selected risk attack path
  * @param {integer} rowId of selected risk attack path vulnerability ref
  * @param {string} field
  * @param {value} value vulnerabilityIdRef
*/
const updateRiskAttackPath = (israProject, riskId, riskAttackPathId, rowid, field, value, win) => {
    try {
        const risk = israProject.getRisk(riskId);
        const riskAttackPath = risk.getRiskAttackPath(riskAttackPathId);

        if (field === 'vulnerabilityIdRef') {
            const ref = riskAttackPath.getVulnerability(rowid);
            if (value !== '') {
                const { vulnerabilityName, overallScore } = israProject.getVulnerability(Number(value));
                ref[field] = Number(value);
                ref['name'] = vulnerabilityName;
                ref['score'] = overallScore;
            } else {
                ref[field] = null;
                ref['name'] = '';
                ref['score'] = null;
            }

            const riskAttackPathScoreIsNull = [];
            for (let i = 0; i < riskAttackPath.properties.vulnerabilityRef.length; i++) {
                if (riskAttackPath.properties.vulnerabilityRef[i].score === null &&
                    riskAttackPath.properties.vulnerabilityRef[i].vulnerabilityIdRef !== null) 
                    {
                        riskAttackPathScoreIsNull.push(riskAttackPath);
                    }
            }
            
            riskAttackPath.updateVulnerability(rowid, ref);
            calculateAttackPathScore(risk, riskAttackPath);
            calculateAttackPathName(risk, riskAttackPath, israProject);

            if(riskAttackPathScoreIsNull.length > 0) {
                riskAttackPathScoreIsNull.forEach((path) => {
                    path.attackPathScore = null;
                });
                risk.allAttackPathsScore = null;
                risk.inherentRiskScore = null;
                risk.mitigatedRiskScore = null;
                risk.residualRiskScore = null;
            }
        }
        return risk.properties;
    } catch (err) {
        console.log(err)
        dialog.showMessageBox(currentWin, { message: `Failed to update Risk Attack Path ${riskAttackPathId} for Risk ${riskId}` });
    }
};

/**
  * add default risk vulnerability ref row
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} riskId of selected risk
  * @param {integer} riskAttackPathId of selected risk attack path
*/
const addVulnerabilityRef = (israProject, riskId, riskAttackPathId, win) => {
    try {
        const risk = israProject.getRisk(riskId);
        const riskAttackPath = israProject.getRisk(riskId).getRiskAttackPath(riskAttackPathId);

        riskAttackPath.addVulnerability({
            vulnerabilityIdRef: null,
            score: null,
            name: '',
        });
        calculateAttackPathName(risk, riskAttackPath, israProject);

        // return risk.properties;
        return risk.properties;
        // return [riskAttackPath.getVulnerability(riskAttackPath.rowId), israProject.properties.Risk];
        // return [riskAttackPath.properties.vulnerabilityRef.length, riskAttackPath.getVulnerability(riskAttackPath.rowId), israProject.properties.Risk];
    } catch (err) {
        console.log(err)
        return dialog.showMessageBox(currentWin, { message: `Failed to add Risk Attack Path for Risk ${riskId}` });
    }
};

/**
  * delete selected risk vulnerability ref row(s)
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} riskId of selected risk
  * @param {integer} riskAttackPathId of selected risk attack path
  * @param {integer} rowId of selected risk attack path vulnerability ref
*/
const deleteVulnerabilityRef = (israProject, riskId, riskAttackPathId, rowIds, win) => {
    try {
        const risk = israProject.getRisk(riskId);
        const riskAttackPath = risk.getRiskAttackPath(riskAttackPathId);

        rowIds.sort((a, b) => b - a).forEach((rowId)=> {
            riskAttackPath.deleteVulnerability(rowId);
        });
        calculateAttackPathScore(risk, riskAttackPath);
        calculateAttackPathName(risk, riskAttackPath, israProject);

        return risk.properties;
        // return israProject.properties.Risk;
    } catch (err) {
        dialog.showMessageBox(currentWin, { message: `Failed to delete Risk Attack Path ${riskAttackPathId}'s rowId: ${rowId} for Risk ${riskId}` });
    }
};

/**
  * calculate mitigated risk score of current risk
  * @param {Risk} risk current risk
*/
const calculateMitigatedRiskScore = (risk) => {
    const { inherentRiskScore, mitigationsBenefits } = risk;
    if (inherentRiskScore === null || mitigationsBenefits === null) risk.mitigatedRiskScore = null;
    else risk.mitigatedRiskScore = Math.round(inherentRiskScore * mitigationsBenefits);
    calculateResidualRiskScore(risk);
}

/**
  * calculate mitigations benefits & mitigation done benefits of current risk
  * @param {Risk} risk current risk
*/
const calculateMitigationsBenefits = (risk) => {
    const { riskMitigation, inherentRiskScore } = risk.properties;
    const selectedBenefits = [];
    const selectedDoneBenefits = [];

    riskMitigation.forEach((mitigation) => {
        const { benefits, decision } = mitigation;
        if(decision === 'Accepted' || decision === 'Done') {
            selectedBenefits.push(1 - benefits);
            if(decision === 'Done') selectedDoneBenefits.push(1 - benefits);
        }
    });

    if (selectedBenefits.length > 0) risk.mitigationsBenefits = Math.min(...selectedBenefits);
    else risk.mitigationsBenefits = 1;
    if (selectedDoneBenefits.length > 0) risk.mitigationsDoneBenefits = Math.min(...selectedDoneBenefits);
    else risk.mitigationsDoneBenefits = 1;

    if (inherentRiskScore != null) calculateMitigatedRiskScore(risk);
}

/**
  * add default risk mitigation
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} riskId current riskId
*/
const addRiskMitigation = (israProject, riskId, win) => {
    try {
        const risk = israProject.getRisk(riskId);
        const riskMitigation = new RiskMitigation();
        risk.addRiskMitigation(riskMitigation);
        return risk.properties;
        // return [riskMitigation.properties];
    } catch (err) {
        console.log(err)
        return dialog.showMessageBox(currentWin, { message: `Failed to add Risk Mitigation for Risk ${riskId}` });
    }
};

/**
  * delete risk mitigations
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} riskId current riskId
  * @param {Array} ids to be deleted riskMitigationIds
*/
const deleteRiskMitigation = (israProject, riskId, ids, win) => {
    try {
        const risk = israProject.getRisk(riskId);
        ids.sort((a, b) => b - a).forEach((id) => {
            risk.deleteRiskMitigation(Number(id));
        });
        calculateMitigationsBenefits(risk);
        return risk.properties;
    } catch (err) {
        console.log(err)
        return dialog.showMessageBox(currentWin, { message: `Failed to delete Risk Mitigation(s) for Risk ${riskId}` });
    }
};

/**
  * delete risk mitigations
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} riskId current riskId
  * @param {integer} riskMitigationId the corresponding riskMitigationId to be updated
  * @param {string} field field of risk mitigation to be updated
  * @param {} value to of updating field
*/
const updateRiskMitigation = (israProject, riskId, riskMitigationId, field, value, win) => {
    try {
        const risk = israProject.getRisk(riskId)
        const riskMitigation = risk.getRiskMitigation(riskMitigationId);
        riskMitigation[field] = value;
        if (field === 'benefits' || field === 'decision') calculateMitigationsBenefits(risk);
        return risk.properties;
        // return risk.properties;
    } catch (err) {
        console.log(err)
        return dialog.showMessageBox(currentWin, { message: `Failed to update Risk Mitigation ${riskMitigationId} for Risk ${riskId}` });
    }
}; 

const calculateResidualRiskLevel = (risk) => {
    const { residualRiskScore } = risk;
    if(residualRiskScore !== null) {
        if (residualRiskScore <= 5) risk.residualRiskLevel = 'Low';
        else if (residualRiskScore > 5 && residualRiskScore <= 10) risk.residualRiskLevel = 'Medium';
        else if (residualRiskScore > 10 && residualRiskScore <= 15) risk.residualRiskLevel = 'High';
        else if (residualRiskScore > 15) risk.residualRiskLevel = 'Critical';
    }
};

const calculateResidualRiskScore = (risk) => {
    const { riskManagementDecision, inherentRiskScore, mitigationsDoneBenefits, residualRiskScore } = risk;
    if (inherentRiskScore !== null){
        if (riskManagementDecision === 'Avoid' || riskManagementDecision === 'Discarded') risk.residualRiskScore = 0;
        else if (riskManagementDecision === 'Accept' || riskManagementDecision === '') risk.residualRiskScore = inherentRiskScore;
        else if (riskManagementDecision === 'Mitigate' || riskManagementDecision === 'Transfer') risk.residualRiskScore = Math.round(inherentRiskScore * mitigationsDoneBenefits);
        calculateResidualRiskLevel(risk);
    }
};

/**
  * update risk management
  * @param {ISRAProject} israProject current ISRA Project
  * @param {integer} riskId current riskId
  * @param {string} field field of risk management to be updated
  * @param {} value to of updating field
*/
const updateRiskManagement = (israProject, riskId, field, value, win) => {
    try {
        const risk = israProject.getRisk(riskId);
        risk[field] = value;
        if (risk.mitigatedRiskScore != null) calculateResidualRiskScore(risk);
        return risk.properties;
    } catch (err) {
        console.log(err);
        return dialog.showMessageBox(currentWin, { message: `Failed to update Risk Management for Risk ${riskId}` });
    }
};

/**
  * validates if previously selected risk row exists
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Integer} id risk id
*/
const isRiskExist = (israProject, id) => {
    try {
        israProject.getRisk(id);
        return true;
    } catch (err) {
        // has been deleted in 'deleteRisk'
        return false;
    }
};

/**
  * validate previous Risk's data from Risk tab
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Object} data previous risk section data
*/
const validateRisks = (israProject, data) => {
    try {
        const { riskId, riskName, riskLikelihood, riskMitigation, riskManagementDetail } = data;
        const { threatAgentDetail, threatVerbDetail, motivationDetail } = riskName;
        const { riskLikelihoodDetail } = riskLikelihood;
        const risk = israProject.getRisk(riskId);

        risk.riskName.threatAgentDetail = threatAgentDetail;
        risk.riskName.threatVerbDetail = threatVerbDetail;
        risk.riskName.motivationDetail = motivationDetail;
        risk.riskLikelihood.riskLikelihoodDetail = riskLikelihoodDetail;

        riskMitigation.forEach((mitigation) => {
            const { description, cost, decisionDetail, riskMitigationId } = mitigation;
            const selectedMitigation = risk.getRiskMitigation(riskMitigationId);
            selectedMitigation.description = description;
            selectedMitigation.cost = cost;
            selectedMitigation.decisionDetail = decisionDetail;
        });

        risk.riskManagementDetail = riskManagementDetail;

        return israProject.properties.Risk;
    } catch (err) {
        console.error(err)
        dialog.showMessageBox(currentWin, { message: 'Failed to validate Risk tab' });
    }
};

module.exports = {
    addRisk,
    deleteRisk,
    updateRiskName,
    updateRiskLikelihood,
    updateRiskImpact,
    addRiskAttackPath,
    deleteRiskAttackPath,
    addVulnerabilityRef,
    deleteVulnerabilityRef,
    isRiskExist,
    validateRisks,
    updateRiskAttackPath,
    constructRiskName,
    calculateAttackPathScore,
    calculateAttackPathName,
    addRiskMitigation,
    deleteRiskMitigation,
    updateRiskMitigation,
    updateRiskManagement 

};