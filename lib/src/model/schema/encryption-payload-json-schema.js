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

const encryptionPayloadJsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'encryptionPayloadISRAschema',
  type: 'object',
  readOnly: true,
  securityVersion: 1,
  type: 'object',
  properties: {
    recipients: {
      type: 'array',
      default: [],
      description: 'Version of the encryption method',
      items: {
        type: 'object',
        properties: {
          encrypted_key: {
            type: 'string',
            default: '',
            description: 'Defines the unique name of the business asset',
          },
        }
      }
    },
    protected: {
      type: 'object',
      description: 'Version of the schema',
    },
    iv: {
      type: 'string',
      description: 'Security classification of the project',
    },
    ciphertext: {
      type: 'string',
      description: 'iv to use GCM encryption method ',
    },
    tag: {
      type: 'string',
      description: 'iv to use GCM encryption method ',
    }
  },
  required: ['recipients','protected','iv','ciphertext','tag'],
};

module.exports = encryptionPayloadJsonSchema;
