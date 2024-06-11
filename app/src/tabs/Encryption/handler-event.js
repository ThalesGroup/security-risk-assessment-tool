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

const setButton = document.getElementById('btn')
const setShowButton = document.getElementById('show-secret')
const setSaveInput = document.getElementById('save-secret')
const secretInput = document.getElementById('secret')
const waitingLabel = document.getElementById('waiting')

let save = false

setSaveInput.addEventListener('change', (e) => {
  setSaveInput.value = e.target.value == 'true' ? false : true
})

setButton.addEventListener('click', () => {
  if(secretInput.checkValidity() && secretInput.value){
    const secret = secretInput.value
    if (setSaveInput.value == 'true') save = true
    console.log(save)
    window.encryption.setSecret(secret,save)
  }
})

setShowButton.addEventListener('click', () => {
  if (secretInput.type === "password") {
    secretInput.type = "text";
    setShowButton.classList.add("active");
  } else {  
    secretInput.type = "password";
    setShowButton.classList.remove("active");
  }  
})

secretInput.addEventListener('keydown', () => {
  let message='Your password must contain at least:'
  const regexLowerCase = /[a-z]/g;
  const regexUpperCase = /[A-Z]/g;
  const regexSpecialCase = /[#$@!%&*?]/g;
  const regexNumber = /[\d]/g;
  message += ` ${secretInput.value.length >= 12 ? '✔ ' : ''}12 caracters`
  message += ` ${secretInput.value.match(regexLowerCase) ? '✔ ' : ''}1 lowercase caracter`
  message += ` ${secretInput.value.match(regexUpperCase) ? '✔ ' : ''}1 uppercase caracter`
  message += ` ${secretInput.value.match(regexSpecialCase) ? '✔ ' : ''}1 number`
  message += ` ${secretInput.value.match(regexNumber) ? '✔ ' : ''}1 special caracter`
  secretInput.title = message;  
})

if (waitingLabel){
  console.log(result)
  window.encryption.isWaiting(async (event, result) => {
    console.log('result')

    console.log(result)
    waitingLabel.innerHTML = result
    //if(result) passDesign.style.display = "flex";
    //else passDesign.style.display = "none";
  });
}
