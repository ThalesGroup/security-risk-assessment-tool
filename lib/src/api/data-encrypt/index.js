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

const jose = require('jose')

const ISRAProject = require('../../model/classes/ISRAProject/isra-project');
const EncryptedISRAProject = require('../../model/classes/EncryptedISRAProject/encrypted-isra-project');
const config = require('../../config')

/**
  * Save project to existing json file
  * @function DataEncrypt
  * @param {ISRAProject} israProject - current instance of israProject
  * @throws reject the promise in case of error
*/
const DataEncrypt = async (israProject,secret_password) => {

  const ecPublicKey = await jose.generateSecret('HS256')
 console.log(ecPublicKey)

  const jwe = await new jose.GeneralEncrypt(
    new TextEncoder().encode('It’s a dangerous business, Frodo, going out your door.'),
  )
    .setProtectedHeader({ enc: 'A256GCM' })
    .addRecipient(ecPublicKey)
    .setUnprotectedHeader({ alg: 'A256GCMKW' })
    .encrypt()
  
  console.log("jwe")
  console.log(jwe)

  console.log("jwe protected")
  console.log(atob(jwe.protected))


  //if (config && config.alg && config.enc){
    //if (config.alg == 'PBES2-HS256+A128KW'){
   // }
    let encryptedISRA = new EncryptedISRAProject()

    encryptedISRA.ISRAEncryptedContent=encrypted
    return encryptedISRA;
 // }else{
  //  return null
 // }
};

module.exports = DataEncrypt;