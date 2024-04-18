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

const jsonSchema = require('../../model/schema/json-schema').properties.SupportingAsset;

const supportingAssetJsonSchema = jsonSchema.items.properties;
const supportingAssetDescJsonSchema = require('../../model/schema/json-schema').properties.SupportingAssetsDesc;

const renderSupportingAssets = () => {
  const html = `
          <header>Supporting Assets</header>

          <section id="product-architecture-diagram">
            <p class="subheading">${supportingAssetDescJsonSchema.title}</p>
            <p class="summary">${supportingAssetDescJsonSchema.description.split('.')[0]}.</p>
            <p class="summary">${supportingAssetDescJsonSchema.description.split('.')[1]}.${supportingAssetDescJsonSchema.description.split('.')[2]}.</p>
            <div class="btn btn-primary tooltip">
              <textarea class="rich-text" id="product-architecture-diagram__text" name="product-architecture-diagram__text"></textarea>
                <div class="top">
                  <p>Add your formatted rich text and your pictures.</p>
                  <i></i>
                </div>
            </div>
          </section>

          <section id="supporting-assets__section">
            <p class="subheading">${jsonSchema.title}</p>
            <p class="summary">${jsonSchema.description.split('.')[0]}.</p>
            <p class="summary">${jsonSchema.description.split('.')[1]}.</p>

            <div class="table">
              <div id="supporting-assets__section-table"></div>
            </div>
            <div class="add-delete-container">
              <button class="addDelete" id="supporting-assets__section--add">Add</button> | <button  class="addDelete" id="supporting-assets__section--delete">Delete</button>
            </div>
          </section>

          <section>
            <p class="subheading">${supportingAssetJsonSchema.businessAssetRef.title.split('.')[0]}</p>
            <p class="subheading" style="font-weight: bold">${supportingAssetJsonSchema.businessAssetRef.title.split('.')[1]}</p>
            <p class="summary">${supportingAssetJsonSchema.businessAssetRef.description}</p>

            <table id="supporting-asset-business-assets__table">
              <thead>
                <tr>
                 <th>Id</th><th>Supporting Asset</th><th>Business Asset</th>
                </tr>
              </thead>
              <tbody></tbody>
            </table>
          </section>
            
          <footer></footer>`;

  const tableOptions = {
    layout: 'fitColumns',
    // maxHeight: '100%',
    index: 'supportingAssetId',
    columns: [ // Define Table Columns
      {
        title: 'Delete?', field: 'Supporting Asset Checkbox', headerSort: false, headerHozAlign: 'center', hozAlign: 'center', headerWordWrap: true, width: 80
      },
      {
        title: supportingAssetJsonSchema.supportingAssetId.title, field: 'supportingAssetId', width: 50, headerSort: false, validator: 'string', headerHozAlign: 'center',
      },
      {
        title: supportingAssetJsonSchema.supportingAssetHLDId.title, field: 'supportingAssetHLDId', editor: 'input', headerSort: false, headerHozAlign: 'center', width: 70,
      },
      {
        title: supportingAssetJsonSchema.supportingAssetName.title,
        field: 'supportingAssetName',
        editor: 'input',
        headerSort: false,
        headerTooltip: supportingAssetJsonSchema.supportingAssetName.description,
        headerHozAlign: 'center',
        formatter: 'textarea',
        variableHeight: true,
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
        validator: supportingAssetJsonSchema.supportingAssetType.type,
        headerTooltip: supportingAssetJsonSchema.supportingAssetType.description,
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
        validator: 'integer',
        headerTooltip: supportingAssetJsonSchema.supportingAssetSecurityLevel.description,
      },
    ],
  };

  return [html, tableOptions];
};

module.exports = {
  renderSupportingAssets,
};
