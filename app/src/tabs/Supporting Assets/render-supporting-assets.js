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

const jsonSchema = require('../../../../lib/src/model/schema/json-schema').properties.SupportingAsset;

const supportingAssetJsonSchema = jsonSchema.items.properties;

const renderSupportingAssets = () => {
  const html = '';

  const tableOptions = {
    layout: 'fitColumns',
    height: '100%',
    columns: [ // Define Table Columns
      {
        title: supportingAssetJsonSchema.supportingAssetId.title, field: 'supportingAssetId', width: 50, headerSort: false, validator: ['integer'], headerHozAlign: 'center',
      },
      {
        title: supportingAssetJsonSchema.supportingAssetHLDId.title, field: 'supportingAssetHLDId', editor: 'input', headerSort: false, headerHozAlign: 'center',
      },
      {
        title: supportingAssetJsonSchema.supportingAssetName.title,
        field: 'supportingAssetName',
        editor: 'input',
        headerSort: false,
        tooltip: supportingAssetJsonSchema.supportingAssetName.description,
        headerHozAlign: 'center',
      },
      {
        title: supportingAssetJsonSchema.supportingAssetType.title,
        headerHozAlign: 'center',
        field: 'supportingAssetType',
        headerSort: false,
        editor: 'list',
        editorParams: {
          values: supportingAssetJsonSchema.supportingAssetType.enum,
        },
        validator: ['string'],
        tooltip: supportingAssetJsonSchema.supportingAssetType.description,
      },
      {
        title: supportingAssetJsonSchema.supportingAssetSecurityLevel.title,
        headerHozAlign: 'center',
        field: 'supportingAssetSecurityLevel',
        headerSort: false,
        editor: 'list',
        editorParams: {
          values: supportingAssetJsonSchema.supportingAssetSecurityLevel.enum
            .filter((truthy) => !!truthy),
        },
        validator: ['integer'],
        tooltip: supportingAssetJsonSchema.supportingAssetSecurityLevel.description,
      },
    ],
  };

  return [html, tableOptions];
};

module.exports = {
  renderSupportingAssets,
};
