/*----------------------------------------------------------------------------
*
*     Copyright © 2022-2025 THALES. All Rights Reserved.
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


/* Shared severity palette mirrored from the CSS custom properties in
 * app/src/global styles/global-styles.css so renderer scripts can
 * consume consistent colour values without duplicating hex codes.
*/

(function (root) {
  const SEVERITY_COLORS = Object.freeze({
    LOW: '#61B144',
    LOW_BACKGROUND: '#61B144',
    MEDIUM: '#FAAB24',
    MEDIUM_BACKGROUND: '#FAAB24',
    HIGH: '#E35623',
    HIGH_BACKGROUND: '#E35623',
    CRITICAL: '#D32A26',
    CRITICAL_BACKGROUND: '#D32A26'
  });

  const SEVERITY_CONTRAST_COLORS = Object.freeze({
    LOW: '#ffffff',
    MEDIUM: '#000000',
    HIGH: '#ffffff',
    CRITICAL: '#ffffff'
  });

  const TEXT_COLOR = Object.freeze({
    DEFAULT: '#000000',
    ERROR: '#ff0000'
  });

  const exported = Object.freeze({
    SEVERITY_COLORS,
    SEVERITY_CONTRAST_COLORS,
    TEXT_COLOR,
    LOW: SEVERITY_COLORS.LOW,
    MEDIUM: SEVERITY_COLORS.MEDIUM,
    HIGH: SEVERITY_COLORS.HIGH,
    CRITICAL: SEVERITY_COLORS.CRITICAL,
    LOW_CONTRAST: SEVERITY_CONTRAST_COLORS.LOW,
    MEDIUM_CONTRAST: SEVERITY_CONTRAST_COLORS.MEDIUM,
    HIGH_CONTRAST: SEVERITY_CONTRAST_COLORS.HIGH,
    CRITICAL_CONTRAST: SEVERITY_CONTRAST_COLORS.CRITICAL
  });

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
  }

  if (root) {
    const target = Object.assign({}, root.COLOR_CONSTANTS || {}, exported);
    root.COLOR_CONSTANTS = Object.freeze(target);
  }
})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : undefined));
