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
const ISRAMetaTracking = require('./isra-meta-tracking');

const addTrackingRow = (israProject) => {
  try {
    const israTracking = new ISRAMetaTracking();
    israProject.addMetaTracking(israTracking);
    return israTracking.properties;
  } catch (err) {
    return dialog.showMessageBoxSync(null, { message: 'Failed to add iteration row' });
  }
};

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

const updateTrackingRow = (israProject, rowData) => {
  try {
    const tracking = israProject.getMetaTracking(rowData.trackingIteration);
    Object.assign(tracking, rowData);
  } catch (err) {
    dialog.showMessageBoxSync(null, { message: `Failed to update iteration row ${rowData.trackingIteration}` });
  }
};

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
  validateISRAmeta,
};
