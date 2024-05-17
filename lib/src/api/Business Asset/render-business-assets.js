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

const jsonSchema = require('../../model/schema/json-schema').properties.BusinessAsset;

const businessAssetSchema = jsonSchema.items.properties;
const businessAssetPropertiesSchema = businessAssetSchema.businessAssetProperties.properties;

const renderBusinessAssets = () => {
  const html = `
  <header>Business Assets</header>
  <section id="business-asset-section">
    <p class="subheading">${jsonSchema.title}</p>
    <p class="summary">${jsonSchema.description}</p>
    <article>
      <p>Business Assets are anything that has economic value to the organization and that is central in the realization of its business objectives. They describe the information, services and resources essential to the business and its core mission.</p>
      <p>For example, business assets can be information (e.g. banking card number) or service (e.g. account management). </p>
      <p>Business assets have security properties that describe their security needs, which are, typically, expressed through confidentiality, integrity and availability of business assets. To match the threat classification schemas, the authenticity, authorization and non repudiation properties are also taken into account.</p>
      <ul>
        <li><span>Confidentiality</span> is the property that ensure that asset cannot be disclosed to unauthorized entities</li>
        <li><span>Integrity</span> is the property that ensure that the asset has not been modified by unauthorized entities</li>
        <li><span>Availability</span> is the property that assure that the asset is accessible and usable by authorized users whenever needed</li>
        <li><span>Authenticity</span> is the property that assure that the asset has been produced by a genuine entity</li>
        <li><span>Authorization</span> is the property that assure that asset can be accessed only by entities with the right privileges</li>
        <li><span>Non repudiation</span> is the property that assure that authorized access to the asset cannot be denied (accountability / trace / evidence)</li>
      </ul>
    </article>
    <div id="business-assets__sections"></div>
    <div class="add-delete-container">
      <button class="addDelete" id="business-assets__section--add">Add</button> | <button  class="addDelete" id="business-assets__section--delete">Delete</button>
    </div>
  </section>
`;

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
    index: 'businessAssetId',
    // height: '100%',
    columns: [
      {
        title: `${businessAssetSchema.businessAssetName.title}`,
        field: 'businessAssetName',
        // editor: 'input',
        headerSort: false,
        width: 140,
        headerTooltip: `${businessAssetSchema.businessAssetName.description}`,
        // formatter: "textarea",
        // editorParams: {
        //   elementAttributes: {
        //     maxlength: '20',
        //   }
        // },
        headerWordWrap: true
      },
      {
        title: 'Asset Values',
        headerHozAlign: 'center',
        columns: [
          {
            title: `${businessAssetSchema.businessAssetType.title}`,
            headerHozAlign: 'center',
            width: 70,
            field: 'businessAssetType',
            headerSort: false,
            editor: 'list',
            editorParams: {
              values: ['', 'Data', 'Service'],
            },
            validator: [businessAssetSchema.businessAssetType.type, 'required'],
            headerTooltip: `${businessAssetSchema.businessAssetType.description}`,
            headerWordWrap: true,
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetConfidentiality.title}`,
            field: 'businessAssetConfidentiality',
            ...propertiesOptions,
            headerTooltip: `${businessAssetPropertiesSchema.businessAssetConfidentiality.description}`,
            headerWordWrap: true,
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetIntegrity.title}`,
            field: 'businessAssetIntegrity',
            ...propertiesOptions,
            width: 65,
            headerTooltip: `${businessAssetPropertiesSchema.businessAssetIntegrity.description}`,
            headerWordWrap: true
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetAvailability.title}`,
            field: 'businessAssetAvailability',
            ...propertiesOptions,
            width: 85,
            headerTooltip: `${businessAssetPropertiesSchema.businessAssetAvailability.description}`,
            headerWordWrap: true
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetAuthenticity.title}`,
            field: 'businessAssetAuthenticity',
            ...propertiesOptions,
            headerTooltip: `${businessAssetPropertiesSchema.businessAssetAuthenticity.description}`,
            headerWordWrap: true
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetAuthorization.title}`,
            field: 'businessAssetAuthorization',
            ...propertiesOptions,
            headerTooltip: `${businessAssetPropertiesSchema.businessAssetAuthorization.description}`,
            headerWordWrap: true
          },
          {
            title: `${businessAssetPropertiesSchema.businessAssetNonRepudiation.title}`,
            field: 'businessAssetNonRepudiation',
            ...propertiesOptions,
            headerTooltip: `${businessAssetPropertiesSchema.businessAssetNonRepudiation.description}`,
            headerWordWrap: true
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
