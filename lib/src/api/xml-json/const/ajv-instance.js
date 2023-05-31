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

const Ajv = require('ajv');
const addErrors = require('ajv-errors');
const {
  URLpattern,
  vectorPattern,
  htmlPattern,
  attachmentPattern,
  datePattern,
} = require('../../../model/schema/validation-pattern/validation-pattern');

/*
allErrors: logs all errors at once
coerceTypes: modifies original data to correctly typed data according to schema to pass validation
which includes string, number, boolean, null & array
removeAdditional: all additional properties are removed,
useDefaults: add default value for missing properties
*/
const ajvInstance = new Ajv({
  allErrors: true,
  coerceTypes: 'array',
  removeAdditional: 'all',
  useDefaults: true,
});

// addFormats: adds validation for formats like date, uri, email etc.
// addFormat: add custom format
ajvInstance
  .addFormat('attachment', '')
  .addFormat('htmlString', htmlPattern)
  .addFormat('vectorString', vectorPattern)
  .addFormat('URL', URLpattern)
  .addFormat('date', datePattern);

// add custom errors
addErrors(ajvInstance);

ajvInstance
  .addKeyword({
    keyword: "classification",
  }).addKeyword({
    keyword: "schemaVersion",
  });

module.exports = ajvInstance;
