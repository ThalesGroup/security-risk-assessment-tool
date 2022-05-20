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

const businessAssetSchema = jsonSchema.properties.BusinessAsset.items.properties;
const businessAssetPropertiesSchema = businessAssetSchema.businessAssetProperties.properties;

const renderBusinessAssets = () => {
  const html = '';
  const dropDownOptions = businessAssetPropertiesSchema.businessAssetConfidentiality.anyOf;
  const formatValues = {};
  dropDownOptions.forEach((option) => {
    if ('title' in option) formatValues[option.const] = option.title;
  });

  const propertiesOptions = {
    headerHozAlign: 'center',
    headerSort: false,
    editor: 'list',
    editorParams: {
      values: formatValues,
    },
    formatter: 'lookup',
    formatterParams: formatValues,
    validator: ['integer', 'required'],
  };

  const tableOptions = {
    layout: 'fitColumns',
    height: '100%',
    columns: [
      {
        title: `${businessAssetSchema.businessAssetName.title}`,
        field: 'businessAssetName',
        editor: 'input',
        headerSort: false,
        width: 60,
        tooltip: `${businessAssetSchema.businessAssetName.description}`,
      },
      {
        title: 'Asset Values',
        headerHozAlign: 'center',
        columns: [
          {
            title: `${businessAssetSchema.businessAssetType.title}`,
            headerHozAlign: 'center',
            width: 50,
            field: 'businessAssetType',
            headerSort: false,
            editor: 'list',
            editorParams: {
              values: ['', 'Data', 'Service'],
            },
            validator: ['string', 'required'],
            tooltip: `${businessAssetSchema.businessAssetType.description}`,
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetConfidentiality.title}`,
            field: 'businessAssetConfidentiality',
            ...propertiesOptions,
            tooltip: `${businessAssetPropertiesSchema.businessAssetConfidentiality.description}`,
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetIntegrity.title}`,
            field: 'businessAssetIntegrity',
            ...propertiesOptions,
            width: 65,
            tooltip: `${businessAssetPropertiesSchema.businessAssetIntegrity.description}`,
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetAvailability.title}`,
            field: 'businessAssetAvailability',
            ...propertiesOptions,
            width: 85,
            tooltip: `${businessAssetPropertiesSchema.businessAssetAvailability.description}`,
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetAuthenticity.title}`,
            field: 'businessAssetAuthenticity',
            ...propertiesOptions,
            tooltip: `${businessAssetPropertiesSchema.businessAssetAuthenticity.description}`,
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetAuthorization.title}`,
            field: 'businessAssetAuthorization',
            ...propertiesOptions,
            tooltip: `${businessAssetPropertiesSchema.businessAssetAuthorization.description}`,
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetNonRepudiation.title}`,
            field: 'businessAssetNonRepudiation',
            ...propertiesOptions,
            tooltip: `${businessAssetPropertiesSchema.businessAssetNonRepudiation.description}`,
          },
        ],
      },

    ],
  };

  return [html, tableOptions];
};

module.exports = {
  renderBusinessAssets,
};
