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
const JWKEncryptionMapping = require('../check-encryption/encryption-mapping');

/**
  * Save project to existing json file
  * @function DataDecrypt
*/
const DataDecrypt = (encryptedData,secret_password) => {
  let ISRA_ciphertext_key
  let decrypted
  let unWrappedKey

  try {
    const payload = encryptedData.ISRAEncryptionMeta.payload
    const encryptionMeta = payload.protected

    // Verify alg is valid
    let foundAlg
    if ('alg' in encryptionMeta){
      foundAlg = JWKEncryptionMapping.alg.values.find((element) => element.name == encryptionMeta.alg)
      if (!foundAlg) throw new Error('Issues in configuration linked to alg value')
      for ( param of foundAlg.params ){
        if (!(param in encryptionMeta)){
          throw new Error(param+' is missing from protected')
        }
      }
    }

    // Verify enc is included in configuration and valid
    let foundEnc
    if ('enc' in encryptionMeta){
      foundEnc = JWKEncryptionMapping.enc.values.find((element) => element.name == encryptionMeta.enc)
      if (!foundEnc) throw new Error('Issues in configuration linked to enc value')
      for ( param of foundEnc.params ){
        if (!(param in payload)){
          throw new Error(param+' is missing from payload')
        }
      }
    } else {
      throw new Error('Enc is missing in configuration')
    }


    if ('alg' in encryptionMeta){
      if (
        (encryptionMeta.alg == 'PBES2-HS256+A128KW') || 
        (encryptionMeta.alg == 'PBES2-HS384+A192KW') || 
        (encryptionMeta.alg == 'PBES2-HS512+A256KW')
      ){
        const keylen = foundAlg.key_length/16
        ISRA_ciphertext_key = crypto.pbkdf2Sync(secret_password, encryptionMeta.p2s, encryptionMeta.p2c, keylen, `sha${foundAlg.key_length}`)
      }

      if ('wrapping' in foundAlg){
        const wrappinglen = foundAlg.wrapping_length/8
        let wrapped_key = payload.recipients[0].encrypted_key
      
        const WRAPPING_ALGORITHM = foundAlg.wrapping;

        let keyForWrap
        let keyForWrap_tmp
        if (ISRA_ciphertext_key){
          keyForWrap_tmp = ISRA_ciphertext_key
        } else keyForWrap_tmp = secret_password

        let wrapKeyDelta = keyForWrap_tmp.length - wrappinglen

        // Reform the key to have the same size as the one needed
        if (wrapKeyDelta>0){
          keyForWrap = keyForWrap_tmp.slice(0,wrappinglen-1)
        }else if (wrapKeyDelta<0){
          keyForWrap = keyForWrap_tmp.padEnd(wrappinglen, '0')
        } else keyForWrap = keyForWrap_tmp
  
        unwrapper = crypto.createDecipheriv(WRAPPING_ALGORITHM, keyForWrap,null);
        
        unWrappedKey = unwrapper.update(wrapped_key, 'hex', 'utf8');
        unWrappedKey = unWrappedKey.toString('hex')
      }
      
    }

    if ('enc' in encryptionMeta && 'algorithm' in foundEnc){
      let encKeyLength = foundEnc.key_length

      const IV = payload.iv
      const ALGORITHM = foundEnc.algorithm;

      let keyForEnc
      if (!unWrappedKey){
        unWrappedKey = secret_password
      }
      let keyDelta = unWrappedKey.length - encKeyLength
      if (keyDelta>0){
        keyForEnc = unWrappedKey.slice(0,encKeyLength)
      }else if (keyDelta<0){
        keyForEnc = unWrappedKey.padEnd(encKeyLength, '0')
      } else keyForEnc = unWrappedKey
  
      const decipher = crypto.createDecipheriv(ALGORITHM, keyForEnc, IV);
  
      decrypted = decipher.update(payload.ciphertext, 'hex', 'utf8');
    }


    return JSON.parse(decrypted);
  } catch(err){
    console.log(err)
    throw Error(`Invalid password`)
  }
  
};

module.exports = DataDecrypt;