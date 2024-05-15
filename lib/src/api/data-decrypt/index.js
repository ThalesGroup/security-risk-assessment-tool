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
const crypto = require('crypto');
/**
  * Save project to existing json file
  * @function DataDecrypt
*/
const DataDecrypt = (encryptedData,secret_password) => {
  var salt = encryptedData.ISRAEncryptionMeta.salt;
  var iterations = 600000;
  var keylen = 256/16
  ISRA_ciphertext_key = crypto.pbkdf2Sync(secret_password, salt, iterations, keylen, 'sha256')
  const IV = encryptedData.ISRAEncryptionMeta.iv
  const ALGORITHM = 'aes-256-gcm';
  const decipher = crypto.createDecipheriv(ALGORITHM, ISRA_ciphertext_key.toString('hex'), IV);

  let decrypted = decipher.update(encryptedData.ISRAEncryptedContent, 'hex', 'utf8');
  return JSON.parse(decrypted);
};

module.exports = DataDecrypt;