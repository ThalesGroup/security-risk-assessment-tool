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
  try {
    var salt = encryptedData.ISRAEncryptionMeta.payload.protected.p2s;
    var iterations = encryptedData.ISRAEncryptionMeta.payload.protected.p2c;
    var keylen = 32
    ISRA_ciphertext_key = crypto.pbkdf2Sync(secret_password, salt, iterations, keylen, 'sha512')
    let wrapped_key = encryptedData.ISRAEncryptionMeta.payload.recipients[0].encrypted_key
    console.log(wrapped_key)
    console.log(encryptedData.ISRAEncryptionMeta.payload.recipients)

    const WRAPPING_ALGORITHM = 'aes-256-ecb';
    console.log(crypto.getCipherInfo(WRAPPING_ALGORITHM))

    unwrapper = crypto.createDecipheriv(WRAPPING_ALGORITHM, ISRA_ciphertext_key,null);
    let unWrappedKey = unwrapper.update(wrapped_key, 'hex', 'utf8');
    console.log("unWrappedKey")
    console.log(unWrappedKey)

    unWrappedKey = unWrappedKey.toString('hex')
    console.log(unWrappedKey)

    console.log(unWrappedKey.length)
    const IV = encryptedData.ISRAEncryptionMeta.payload.iv
    const ALGORITHM = 'aes-256-gcm';
    console.log(crypto.getCipherInfo(ALGORITHM))

    const decipher = crypto.createDecipheriv(ALGORITHM, unWrappedKey, IV);

    let decrypted = decipher.update(encryptedData.ISRAEncryptionMeta.payload.ciphertext, 'hex', 'utf8');
    return JSON.parse(decrypted);
  } catch(err){
    console.log(err)
    throw Error(`Invalid password`)
  }
  
};

module.exports = DataDecrypt;