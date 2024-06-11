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

const encryptionConfig = {
  alg:"PBES2-HS256+A128KW",
  p2s:crypto.randomBytes(16).toString('base64'),
  p2c:10000,
  enc:"A128GCM"
}
//'PBES2-HS256+A128KW'
/**
  * Save project to existing json file
  * @function DataEncrypt
  * @param {ISRAProject} israProject - current instance of israProject
  * @throws reject the promise in case of error
*/
const DataEncrypt = async(israProject,secret_password) => {

  let foundAlg
  let foundEnc

  if ('alg' in encryptionConfig){
    foundAlg = JWKEncryptionMapping.alg.values.find((element) => element.name == encryptionConfig.alg)
    if (!foundAlg) throw new Error('Issues in configuration linked to alg value')
    /*for ( param of foundAlg.params ){
      if (!(param in encryptionConfig)){
        throw new Error('Issues in configuration linked to alg parameters')
      }
    }*/
    
  } else {
    throw new Error('Alg is missing in configuration')
  }

  if ('enc' in encryptionConfig){
    foundEnc = JWKEncryptionMapping.enc.values.find((element) => element.name == encryptionConfig.enc)
    if (!foundEnc) throw new Error('Issues in configuration linked to enc value')
    /*for ( param of foundEnc.params ){
      if (!(param in encryptionConfig)){
        throw new Error('Issues in configuration linked to enc parameters')
      }
    }*/
    
  } else {
    throw new Error('Enc is missing in configuration')
  }

  let cipher
  let wrapper
  let encryptedISRA = new EncryptedISRAProject()
  let ISRA_ciphertext_key
  let ISRA_ciphertext_wrapped_key

  encryptedISRA.payload.protected = encryptionConfig
  let recipients = []
  let keyToWrap

  if ('alg' in encryptionConfig){
    switch(true){
      case 
      (encryptionConfig.alg == 'PBES2-HS256+A128KW') || 
      (encryptionConfig.alg == 'PBES2-HS384+A192KW') || 
      (encryptionConfig.alg == 'PBES2-HS512+A256KW'):
        const keylen = foundAlg.hmac/16
        ISRA_ciphertext_key = crypto.pbkdf2Sync(secret_password, encryptionConfig.p2s, encryptionConfig.p2c, keylen, `sha${foundAlg.hmac}`)
        
        const WRAPPING_ALGORITHM = foundAlg.wrapping;
        keyToWrap = crypto.randomBytes(keylen/2).toString('hex')
        console.log("keyToWrap")
        console.log(keyToWrap)
        console.log(keyToWrap.length)


        console.log(crypto.getCipherInfo(WRAPPING_ALGORITHM))

        wrapper = crypto.createCipheriv(WRAPPING_ALGORITHM, ISRA_ciphertext_key,null);
        ISRA_ciphertext_wrapped_key = wrapper.update(keyToWrap, 'utf8', 'hex');
        ISRA_ciphertext_wrapped_key += wrapper.final('hex');
        console.log(ISRA_ciphertext_wrapped_key)
        recipients.push({"encrypted_key" : ISRA_ciphertext_wrapped_key})
    }
  }
  console.log("ISRA_ciphertext_key")
  console.log(ISRA_ciphertext_key)
  console.log(ISRA_ciphertext_key.length)

  console.log("ISRA_ciphertext_wrapped_key")
  console.log(ISRA_ciphertext_wrapped_key)
  console.log(ISRA_ciphertext_wrapped_key.length)


  if ('enc' in encryptionConfig){
    switch(true){
      case 
      (encryptionConfig.enc == 'A128GCM') || 
      (encryptionConfig.enc == 'A192GCM') || 
      (encryptionConfig.enc == 'A256GCM'):
        let encKeyLength = foundEnc.keylength

        const IV = crypto.randomBytes(encKeyLength/2).toString('hex')
        console.log('IV')
        console.log(IV)

        console.log(IV.length)

        console.log('keyToWrap')
        console.log(keyToWrap)

        let keyForEnc
        let keyDelta = keyToWrap.length - encKeyLength
        if (keyDelta>0){
          console.log('1')

          keyForEnc = keyToWrap.slice(0,encKeyLength-1)
        }else if (keyDelta<0){
          console.log('2')

          keyForEnc = keyToWrap.padEnd(encKeyLength, '0')
          console.log(keyToWrap.padEnd(encKeyLength, '0'))
        } else keyForEnc = keyToWrap
        console.log('keyForEnc')
        console.log(keyForEnc)
        console.log(keyDelta)

        const ALGORITHM = foundEnc.algorithm;
        console.log(crypto.getCipherInfo(ALGORITHM))
        cipher = crypto.createCipheriv(ALGORITHM, keyForEnc, IV);
        encryptedISRA.payload.iv=IV
    }
  }


  let encrypted = cipher.update(israProject, 'utf8', 'hex');

  encrypted += cipher.final('hex');
  encryptedISRA.payload.tag=cipher.getAuthTag().toString('hex')

  encryptedISRA.payload.ciphertext = encrypted
  encryptedISRA.payload.recipients = recipients

  return encryptedISRA;
};

module.exports = DataEncrypt;