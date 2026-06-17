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

const isIntegerString = (value) => /^-?\d+$/.test(value);

const pushIntegerRef = (acc, value) => {
  if (value === null || value === undefined || value === "") return;

  if (typeof value === "number") {
    if (Number.isInteger(value)) acc.push(value);
    return;
  }

  if (typeof value === "string") {
    value.split(",").forEach((part) => {
      const trimmed = part.trim();

      if (trimmed === "" || !isIntegerString(trimmed)) return;

      const parsed = Number.parseInt(trimmed, 10);

      if (Number.isInteger(parsed)) acc.push(parsed);
    });
  }
};

const sanitizeSupportingAssetRefs = (refs) => {
  if (refs === null || refs === undefined || refs === "") return [];

  const refArray = Array.isArray(refs) ? refs : [refs];

  return refArray.reduce((acc, ref) => {
    if (ref === null || ref === undefined || ref === "") return acc;

    if (typeof ref === "number" || typeof ref === "string") {
      pushIntegerRef(acc, ref);
      return acc;
    }

    if (typeof ref === "object") {
      const candidate =
        ref.supportingAssetId ??
        ref.supportingAssetRef ??
        ref.id ??
        ref.value;

      if (candidate !== undefined) {
        sanitizeSupportingAssetRefs(candidate).forEach((parsedRef) => {
          acc.push(parsedRef);
        });
      }
    }

    return acc;
  }, []);
};

module.exports = {
  sanitizeTrackingURI,
  sanitizeSupportingAssetRefs,
};