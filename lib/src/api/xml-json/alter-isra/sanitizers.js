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

const {
  URLpattern,
} = require("../../../model/schema/validation-pattern/validation-pattern");

const sanitizeTrackingURI = (uri) => {
  if (typeof uri !== "string") return "";
  const trimmed = uri.trim();
  if (trimmed === "") return "";
  return URLpattern.test(trimmed) ? trimmed : "";
};

const sanitizeSupportingAssetRefs = (refs) => {
  if (!Array.isArray(refs)) return [];

  return refs.reduce((acc, ref) => {
    if (ref === null || ref === undefined) return acc;

    if (typeof ref === "number" && Number.isInteger(ref)) {
      acc.push(ref);
      return acc;
    }

    if (typeof ref === "string") {
      const trimmed = ref.trim();
      if (trimmed === "" || !/^-?\d+$/.test(trimmed)) return acc;
      const parsed = Number.parseInt(trimmed, 10);
      if (Number.isInteger(parsed)) acc.push(parsed);
    }

    return acc;
  }, []);
};

module.exports = {
  sanitizeTrackingURI,
  sanitizeSupportingAssetRefs,
};
