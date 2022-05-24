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

const jsonSchema = require('../../../../lib/src/model/schema/json-schema');

const ISRAmetaSchema = jsonSchema.properties.ISRAmeta.properties;

const renderWelcome = () => {
  const projectOrganization = ISRAmetaSchema.projectOrganization.anyOf;
  let projectOrganizationOptions = '';
  projectOrganization.forEach((e) => {
    projectOrganizationOptions += `<option value="${e.const}">${e.title}</option>`;
  });

  const html = '<div class="details">'
  + `<p class="heading">${jsonSchema.title}</p>`
  + `<p id="details__app-version">${ISRAmetaSchema.appVersion.title}: ${ISRAmetaSchema.appVersion.default}</p>`
  + '</div>'
  + '<div id="welcome__isra-meta">'
  + `<label for="welcome__isra-meta--project-name">${ISRAmetaSchema.projectName.title}</label>`
  + '<input type="text" id="welcome__isra-meta--project-name" name="welcome__isra-meta--project-name">'
  + `<label for="welcome__isra-meta--project-version">${ISRAmetaSchema.projectVersion.title}</label>`
  + '<input type="text" id="welcome__isra-meta--project-version" name="welcome__isra-meta--project-version">'
  + `<label for="welcome__isra-meta--organization">${ISRAmetaSchema.projectOrganization.title}</label>`
  + `<select name="welcome__isra-meta--organization" id="welcome__isra-meta--organization" required title="(Mandatory) ${ISRAmetaSchema.projectOrganization.description}">`
  + `${projectOrganizationOptions}`
  + '</select>'
  + '</div>'
  + '<div id="welcome__isra-meta-tracking">'
  + `<p class="heading">${ISRAmetaSchema.ISRAtracking.title}</p>`
  + '<div class="add-delete-container">'
  + '<button class="addDelete" id="welcome__isra-meta-tracking--add">Add</button> | <button  class="addDelete" id="welcome__isra-meta-tracking--delete">Delete</button>'
  + '</div>'
  + '<div class="table">'
  + '<div class="checkbox" id="welcome__isra-meta-tracking-checkboxes"></div>'
  + '<div id="welcome__isra-meta-tracking-table"></div>'
  + '</div>'
  + '</div>'
  + '<div id="welcome__isra-meta-info">'
  + '<p class="heading">Purpose and scope</p>'
  + '</div>';

  const ISRATrackingSchema = ISRAmetaSchema.ISRAtracking.items.properties;
  const tableOptions = {
    layout: 'fitColumns',
    height: '100%',
    columns: [ // Define Table Columns
      {
        title: `${ISRATrackingSchema.trackingIteration.title}`, field: 'trackingIteration', width: 100, headerSort: false, validator: ['integer'], tooltip: `${ISRATrackingSchema.trackingIteration.description}`, headerHozAlign: 'center',
      },
      {
        title: `${ISRATrackingSchema.trackingSecurityOfficer.title}`, field: 'trackingSecurityOfficer', editor: 'input', headerSort: false, validator: ['string'], tooltip: `${ISRATrackingSchema.trackingSecurityOfficer.description}`, headerHozAlign: 'center',
      },
      {
        title: `${ISRATrackingSchema.trackingDate.title}`,
        field: 'trackingDate',
        editor: 'input',
        headerSort: false,
        validator: ['string', 'regex:(^\\d\\d\\d\\d-[0-1]\\d-[0-3]\\d$)'],
        headerHozAlign: 'center',
      },
      {
        title: `${ISRATrackingSchema.trackingComment.title}`, field: 'trackingComment', editor: 'input', headerSort: false, tooltip: `${ISRATrackingSchema.trackingComment.description}`, headerHozAlign: 'center',
      },
    ],
  };

  return [html, tableOptions];
};

module.exports = {
  renderWelcome,
};
