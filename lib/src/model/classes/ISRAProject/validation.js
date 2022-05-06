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

const jsonSchema = require('../../schema/json-schema').properties;
const validateClassProperties = require('../validation/validate-class-properties');

const jsonSchemaISRAmeta = jsonSchema.ISRAmeta.properties;

const isAppVersion = (val) => {
  const subSchema = jsonSchemaISRAmeta.appVersion;
  return validateClassProperties(val, subSchema);
};

const isProjectName = (val) => {
  const subSchema = jsonSchemaISRAmeta.projectName;
  return validateClassProperties(val, subSchema);
};

const isProjectOrganization = (val) => {
  const subSchema = jsonSchemaISRAmeta.projectOrganization;
  return validateClassProperties(val, subSchema);
};

const isProjectVersion = (val) => {
  const subSchema = jsonSchemaISRAmeta.projectVersion;
  return validateClassProperties(val, subSchema);
};

const isSupportingAssetDesc = (val) => {
  const subSchema = jsonSchema.SupportingAssetsDesc;
  return validateClassProperties(val, subSchema);
};

const jsonSchemaISRATracking = jsonSchemaISRAmeta.ISRAtracking.items.properties;

const isTrackingIteration = (val) => {
  const subSchema = jsonSchemaISRATracking.trackingIteration;
  return validateClassProperties(val, subSchema);
};

const isTrackingSecurityOfficer = (val) => {
  const subSchema = jsonSchemaISRATracking.trackingSecurityOfficer;
  return validateClassProperties(val, subSchema);
};

const isTrackingDate = (val) => {
  const subSchema = jsonSchemaISRATracking.trackingDate;
  return validateClassProperties(val, subSchema);
};

const isTrackingComment = (val) => {
  const subSchema = jsonSchemaISRATracking.trackingComment;
  return validateClassProperties(val, subSchema);
};

module.exports = {
  isAppVersion,
  isProjectName,
  isProjectOrganization,
  isProjectVersion,
  isSupportingAssetDesc,
  isTrackingIteration,
  isTrackingSecurityOfficer,
  isTrackingDate,
  isTrackingComment,
};
