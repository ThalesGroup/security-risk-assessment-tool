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

const ISRAProject = require('../../model/classes/ISRAProject/isra-project');
const EncryptedISRAProject = require('../../model/classes/EncryptedISRAProject/encrypted-isra-project');
const JWKEncryptionMapping = require('../check-encryption/encryption-mapping');

//'PBES2-HS256+A128KW'
/**
  * Save project to existing json file
  * @function DataEncrypt
  * @param {ISRAProject} israProject - current instance of israProject
  * @throws reject the promise in case of error
*/
const DataEncrypt = async(israProject,secret_password,encryptionConfig) => {

  let protected = {}

  // Verify alg is valid
  let foundAlg
  if ('alg' in encryptionConfig){
    foundAlg = JWKEncryptionMapping.alg.values.find((element) => element.name == encryptionConfig.alg)
    if (!foundAlg) throw new Error('Issues in configuration linked to alg value')
    if (foundAlg.config){
      for ( param of foundAlg.config ){
        if (!(param in encryptionConfig)){
          throw new Error('Issues in configuration linked to alg parameters')
        }
      }
    }
    protected['alg'] = encryptionConfig.alg
  }

  // Verify enc is included in configuration and valid
  let foundEnc
  if ('enc' in encryptionConfig){
    foundEnc = JWKEncryptionMapping.enc.values.find((element) => element.name == encryptionConfig.enc)
    if (!foundEnc) throw new Error('Issues in configuration linked to enc value')
    protected['enc'] = encryptionConfig.enc
  } else {
    throw new Error('Enc is missing in configuration')
  }

  let wrapper
  let ISRA_ciphertext_key
  let keyToWrap
  let ISRA_ciphertext_wrapped_key
  let recipients = []

  let cipher
  let encryptedISRA = new EncryptedISRAProject()



  if ('alg' in encryptionConfig){
    if (
      (encryptionConfig.alg == 'PBES2-HS256+A128KW') || 
      (encryptionConfig.alg == 'PBES2-HS384+A192KW') || 
      (encryptionConfig.alg == 'PBES2-HS512+A256KW')
    ){
      const keylen = foundAlg.key_length/16
      let salt = crypto.randomBytes(16).toString('base64')
      let iteration = Number(encryptionConfig.p2c)
      protected['p2s'] = salt
      protected['p2c'] = iteration
      ISRA_ciphertext_key = crypto.pbkdf2Sync(secret_password, salt, iteration, keylen, `sha${foundAlg.key_length}`)
        
    }
    if ('wrapping' in foundAlg){
      const wrappinglen = foundAlg.wrapping_length/8
      const WRAPPING_ALGORITHM = foundAlg.wrapping;
      keyToWrap = crypto.randomBytes(wrappinglen).toString('hex')
  
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


      wrapper = crypto.createCipheriv(WRAPPING_ALGORITHM,keyForWrap,null);
      ISRA_ciphertext_wrapped_key = wrapper.update(keyToWrap, 'utf8', 'hex');
      ISRA_ciphertext_wrapped_key += wrapper.final('hex');
      recipients.push({"encrypted_key" : ISRA_ciphertext_wrapped_key})
    }
  }


  if ('enc' in encryptionConfig && 'algorithm' in foundEnc){
    let encKeyLength = foundEnc.key_length
    const IV = crypto.randomBytes(encKeyLength/2).toString('hex')
    let keyForEnc
    if (!keyToWrap){
      keyToWrap = secret_password
    }
    let keyDelta = keyToWrap.length - encKeyLength

    // Reform the key to have the same size as the one needed
    if (keyDelta>0){
      keyForEnc = keyToWrap.slice(0,encKeyLength)
    }else if (keyDelta<0){
      keyForEnc = keyToWrap.padEnd(encKeyLength, '0')
    } else keyForEnc = keyToWrap

    const ALGORITHM = foundEnc.algorithm;

    cipher = crypto.createCipheriv(ALGORITHM, keyForEnc, IV);
    encryptedISRA.payload.iv=IV
  }


  let encrypted = cipher.update(israProject, 'utf8', 'hex');

  encrypted += cipher.final('hex');
  encryptedISRA.payload.tag=cipher.getAuthTag().toString('hex')

  encryptedISRA.payload.ciphertext = encrypted
  encryptedISRA.payload.recipients = recipients
  encryptedISRA.payload.protected = protected


  return encryptedISRA;
};

module.exports = DataEncrypt;