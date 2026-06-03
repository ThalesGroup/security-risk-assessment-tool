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

const sanitizeTrackingURIWithResult = (uri) => {
  if (typeof uri !== "string") return { uri: "", removed: false };
  const trimmed = uri.trim();
  if (trimmed === "") return { uri: "", removed: false };
  return URLpattern.test(trimmed)
    ? { uri: trimmed, removed: false }
    : { uri: "", removed: true, original: trimmed };
};

const sanitizeSupportingAssetRefs = (refs, validIds = null) => {
  if (!Array.isArray(refs)) return { refs: [], removedCount: 0 };

  const validIdSet = validIds ? new Set(validIds) : null;
  let removedCount = 0;
  const cleaned = [];

  refs.forEach(ref => {
    if (ref === null || ref === undefined || ref === '') {
      removedCount++;
      return;
    }

    let refId = ref;
    if (typeof ref === "string") {
      const trimmed = ref.trim();
      if (!trimmed || !/^-?\d+$/.test(trimmed)) {
        removedCount++;
        return;
      }
      refId = Number.parseInt(trimmed, 10);
    }

    if (typeof refId === "number" && Number.isInteger(refId)) {
      if (validIdSet && !validIdSet.has(refId)) {
        removedCount++;
        return;
      }
      cleaned.push(refId);
    } else {
      removedCount++;
    }
  });

  return { refs: cleaned, removedCount };
};

module.exports = {
  sanitizeTrackingURI,
  sanitizeTrackingURIWithResult,
  sanitizeSupportingAssetRefs,
};
