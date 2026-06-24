# ISRA Codebase Simplification Plan

This document outlines the proposed simplifications for the ISRA (Security Risk Assessment Tool) codebase. Each candidate has been evaluated against complexity, clarity, styling, and structural redundancy, while ensuring **100% preservation of functional behavior and API contracts**.

## Prioritized Work Queue

| Priority | File Path | Score | Specific Findings & Refactor Strategy | Expected Benefits |
| :---: | :--- | :---: | :--- | :--- |
| **1** | `lib/src/api/xml-json/alter-isra/alter-business-assets.js` | **8/10** | **Finding:** Uses an anonymous immediately-invoked function to destructure properties from a business asset and repack them into `ba.businessAssetProperties`. <br><br>**Refactor:** Replace with clean, standard ES6 destructuring and direct property assignment. | Improved readability, standard syntax. |
| **2** | `lib/src/api/xml-json/alter-isra/alter-isra.js` | **8/10** | **Finding:** The main `alterISRA` function wraps its entire logic inside a self-invoking function `(israJSONDataCopy, xmlDataCopy) => { ... })(israJSONData, xmlData)` with exactly the same parameters. <br><br>**Refactor:** Remove the redundant IIFE wrapper and execute the body directly. | Elimination of unnecessary closure creation. |
| **3** | `lib/src/api/xml-json/alter-isra/alter-risks.js` | **8/10** | **Finding:** Within `risksCopy.forEach((risk) => { ... })`, the lookup maps `businessAssets` and `supportingAssets` are fully rebuilt from scratch on every iteration from the `businessAssetsCopy` and `supportingAssetsCopy` arrays. This is an $O(N \times M)$ performance anti-pattern. <br><br>**Refactor:** Move map construction outside of the `forEach` loop. | Prevents redundant allocation and speeds up parsing of large XML/SRA files. |
| **4** | `lib/src/utility-global.js` | **6/10** | **Finding:** Implemented as a verbose IIFE returning an outer object with a `counter` method that returns another closure. Contains suppressed linter warnings for unused parameters. <br><br>**Refactor:** Simplify into a standard, clean CommonJS module that directly exports a `counter` closure function. | Cleaner code, removes linter overrides, standard pattern. |
| **5** | `lib/src/api/xml-json/parser.js` | **6/10** | **Finding:** The spelling-fix helper `editName` uses five separate, chained `.match()` checks and ternary expressions to sanitize tags. <br><br>**Refactor:** Chain `.replace` operations directly, as `.replace` natively returns the original string unchanged if there is no match. | Faster, more readable tag-cleaning routine. |
| **6** | `lib/src/api/xml-json/populate-class.js` | **5/10** | **Finding:** Contains redundant ternaries like `highestBAId? highestBAId: businessAssetId` where `highestBAId` is already guaranteed to be a truthy incremented number. <br><br>**Refactor:** Simplify to just the truthy variables. | Simpler property assignments. |

---

## Refactoring Guarantees
* **Behavioral Parity:** The external API, function signatures, and data transformations will remain completely identical.
* **Hermetic Testing:** All modifications will be validated against the comprehensive 311-test suite (`npm run test`) to ensure zero regressions.
