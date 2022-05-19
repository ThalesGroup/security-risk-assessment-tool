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
/* eslint-disable */ 

const jsonSchema = require('../../../../lib/src/model/schema/json-schema');

const BusinessAssetSchema = jsonSchema.properties.BusinessAsset.items.properties;

const renderBusinessAssets = () => {
  const html = '';

  const composeSelectFormatter = (dictionary) => (cell) => {
    const value = cell.getValue();
    if (!value) return value;

    return dictionary[value];
  };

  const tableOptions = {
    layout: 'fitColumns',
    height: '100%',
    columns: [ // Define Table Columns
      {
        title: 'Name',
        field: 'businessAssetName',
        width: 100,
        headerSort: false,
        editor: 'input',
      },
      {
        title: 'Asset Values',
        columns:[
          {
            title: 'Type',
            field: 'businessAssetType',
            headerSort: false,
            editor: 'list',
            editorParams: {
              values: ['', 'Data', 'Service'],
            },
            validator: ['string', 'required'],
          },
          {
            title: 'Confidentiality',
            field: 'businessAssetConfidentiality',
            headerSort: false,
            editor: 'list',
            editorParams: {
              values: {
                0: 'N/A',
                1: 'Low',
                2: 'Medium',
                3: 'High',
                4: 'Critical',
              },
            },
            formatter:"lookup", 
            formatterParams:{
                0: 'N/A',
                1: 'Low',
                2: 'Medium',
                3: 'High',
                4: 'Critical',
            },
            validator: ['integer', 'required'],
          },
          {
            title: 'Integrity',
            field: 'businessAssetIntegrity',
            headerSort: false,
            editor: 'list',
            editorParams: {
              values: {
                0: 'N/A',
                1: 'Low',
                2: 'Medium',
                3: 'High',
                4: 'Critical',
              },
            },
            formatter:"lookup", 
            formatterParams:{
                0: 'N/A',
                1: 'Low',
                2: 'Medium',
                3: 'High',
                4: 'Critical',
            },
            validator: ['integer', 'required'],
          },
        ]
      },
     
    ],
  };

  return [html, tableOptions];
};
module.exports = {
  renderBusinessAssets,
};
