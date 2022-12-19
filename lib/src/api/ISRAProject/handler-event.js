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
const ISRAMetaTracking = require('../../model/classes/ISRAProject/isra-meta-tracking');
const ISRAProject = require('../../model/classes/ISRAProject/isra-project');

/**
  * add default iterations tracking row
  * @param {ISRAProject} israProject current ISRA Project
*/
const addTrackingRow = (israProject) => {
  try {
    const israTracking = new ISRAMetaTracking();
    israProject.addMetaTracking(israTracking);
    return israTracking.properties;
  } catch (err) {
    return dialog.showMessageBoxSync(null, { message: 'Failed to add iteration row' });
  }
};

/**
  * deleted selected iterations tracking row(s)
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Array} iterations selected iteration rows (unsorted)
*/
const deleteTrackingRow = (israProject, iterations) => {
  try {
    const sortedIterations = iterations.sort((a, b) => Number(b) - Number(a));
    sortedIterations.forEach((iteration) => {
      israProject.deleteMetaTracking(Number(iteration));
    });
    return israProject.properties.ISRAmeta.ISRAtracking;
  } catch (err) {
    return dialog.showMessageBoxSync(null, { message: 'Failed to delete iteration row(s)' });
  }
};

/**
  * update selected iteration tracking row
  * @param {ISRAProject} israProject current ISRA Project
  * @param {object} rowData data from iterations table
*/
const updateTrackingRow = (israProject, rowData) => {
  try {
    const tracking = israProject.getMetaTracking(rowData.trackingIteration);
    Object.assign(tracking, rowData);
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: `Failed to update iteration row ${rowData.trackingIteration}` });
  }
};

/**
  * update selected iteration tracking row
  * @param {ISRAProject} israProject current ISRA Project
  * @param {string} field projectNameRef or projectVersionRef field
  * @param {string} value value of projectName or projectVersion
*/
const updateProjectNameAndVersionRef = (israProject, field, value) => {
  try {
    const { Risk, Vulnerability } = israProject.properties;
    Risk.forEach((r) => {
      const risk = israProject.getRisk(r.riskId);
      if (risk[field] === '') risk[field] = value;
    });
    Vulnerability.forEach((v) => {
      const vulnerability = israProject.getVulnerability(v.vulnerabilityId);
      if (vulnerability[field] === '') vulnerability[field] = value;
    });
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: `Failed to update project name/version of Risk/Vulnerability` });
  }
};

/**
  * validate and populate data from Welcome tab
  * @param {ISRAProject} israProject current ISRA Project
  * @param {Array} data
*/
const validateISRAmeta = (israProject, data) => {
  try {
    const object = {
      projectName: data[0],
      projectOrganization: data[1],
      projectVersion: data[2],
    };
    Object.assign(israProject, object);
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: 'Failed to validate Welcome tab' });
  }
};

module.exports = {
  addTrackingRow,
  deleteTrackingRow,
  updateTrackingRow,
  updateProjectNameAndVersionRef,
  validateISRAmeta,
};
