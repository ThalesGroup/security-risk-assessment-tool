/*----------------------------------------------------------------------------
*
*     Copyright © 2025 THALES. All Rights Reserved.
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

// pattern reference for validation.js and ajv-instance.js
const validationPattern = Object.freeze({
  URLpattern: new RegExp(
    '^(?:' +

      // http / https (strict domain)
      '(?:https?):\\/\\/' +
      '(?:[a-z0-9\\u00a1-\\uffff]+-)*[a-z0-9\\u00a1-\\uffff]+' +
      '(?:\\.(?:[a-z0-9\\u00a1-\\uffff]+-)*[a-z0-9\\u00a1-\\uffff]+)*' +
      '(?:\\.[a-z\\u00a1-\\uffff]{2,})' +
      '(?::\\d{2,5})?' +
      '(?:\\/[^\\s]*)?' +

    '|' +

      // ftp 
      'ftp:\\/\\/' +
      '(?:[a-z0-9\\u00a1-\\uffff]+-)*[a-z0-9\\u00a1-\\uffff]+' +
      '(?:\\.(?:[a-z0-9\\u00a1-\\uffff]+-)*[a-z0-9\\u00a1-\\uffff]+)*' +
      '(?:\\.[a-z\\u00a1-\\uffff]{2,})' +
      '(?::\\d{2,5})?' +
      '(?:\\/[^\\s]*)?' +

    '|' +

      // mailto
      'mailto:[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}' +

    '|' +

      // tel
      'tel:\\+?[0-9\\-(). ]+' +

    '|' +

      // urn
      'urn:[A-Za-z0-9][A-Za-z0-9-]{0,31}:[^\\s]+' +

    '|' +

      '$' +

    ')$',
    'iu'
  ),

  vectorPattern: '',

  datePattern: new RegExp('(^\\d\\d\\d\\d-[0-1]\\d-[0-3]\\d$)'
  + '|(^$)'),

  htmlPattern: new RegExp('</?[a-z][\\s\\S]*>'
  + '|(^$)'),
  attachmentPattern: ''
});

module.exports = validationPattern;
