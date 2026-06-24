---
feature_key: issue-314
stage: tests
artifact: tests
last_updated: 2026-06-24
confidence: high
generator: skill-spec-driven-dev@0.2.0
---

# Test Specification — Provide a dedicated flow for risks transferred from a dependency

## TC-1  [unit]  (AC-2)
- **Traces:** REQ-2, NFR-2, LLD-2
- **Framework target:** Jest
- **Location:** lib/test/unit/risk/transferred-risk.test.js::"Schema validation of new fields"
- **Preconditions:** Fresh AJV schema compiler initialized.
- **Inputs / fixtures:** Risk schemas.
- **Steps:**
  1. Validate an object with `isTransferredFromDependency: true` and `dependencyOrigin: "Third-party dependency"`.
  2. Validate an object with missing properties (verify defaults).
- **Expected:** Validation succeeds, and defaults are populated.

## TC-2  [unit]  (AC-2)
- **Traces:** REQ-2, LLD-2
- **Framework target:** Jest
- **Location:** lib/test/unit/risk/transferred-risk.test.js::"Risk Class getter/setter and serialization"
- **Preconditions:** Risk class model loaded.
- **Inputs / fixtures:** None.
- **Steps:**
  1. Create a new `Risk` instance.
  2. Set `isTransferredFromDependency = true`.
  3. Set `dependencyOrigin = "Some library"`.
  4. Verify getters return correct values.
  5. Verify `.properties` serialization includes these fields.
- **Expected:** Values match and serialize correctly.

## TC-3  [unit]  (AC-4, AC-5)
- **Traces:** REQ-3, NFR-2, LLD-2
- **Framework target:** Jest
- **Location:** lib/test/unit/risk/transferred-risk.test.js::"Validation functions for transferred fields"
- **Preconditions:** validation.js exports functions `isTransferredFromDependency` and `isDependencyOrigin`.
- **Inputs / fixtures:** Valid/invalid parameters.
- **Steps:**
  1. Check `isTransferredFromDependency` with `true`, `false` (should pass) and `123`, `""` (should throw/fail).
  2. Check `isDependencyOrigin` with `"some origin"` (should pass) and `123` (should throw/fail).
- **Expected:** Correct validation checks are executed.

## TC-4  [integration]  (AC-3)
- **Traces:** REQ-4, LLD-1
- **Framework target:** Jest
- **Location:** lib/test/unit/risk/transferred-risk.test.js::"Backend Event handler short-circuit and score sync"
- **Preconditions:** ISRAProject with loaded Risk initialized.
- **Inputs / fixtures:** User-entered direct score.
- **Steps:**
  1. Set risk's `isTransferredFromDependency` to `true`.
  2. Trigger risk score update or calculate scores.
  3. Verify `inherentRiskScore`, `mitigatedRiskScore`, and `residualRiskScore` are directly set to the direct score.
  4. Verify `residualRiskLevel` is derived from standard ranges (e.g. score `12` -> `High`).
- **Expected:** Scores are bypassed and mapped correctly.

## TC-5  [integration]  (AC-1, AC-5)
- **Traces:** REQ-1, REQ-3, LLD-UI-1
- **Framework target:** Jest
- **Location:** app/test/vulnerability/transferred-renderer.test.js
- **Preconditions:** Simulated DOM in JS environment.
- **Inputs / fixtures:** DOM of Risks tab.
- **Steps:**
  1. Simulate checking the `risk__isTransferredFromDependency` checkbox.
  2. Assert standard input containers are hidden (`display: none`).
  3. Assert `dependencyOrigin` and `transferredScore` container elements are visible (`display: flex`).
- **Expected:** UI elements show/hide dynamically.

## TC-6  [integration]  (AC-6)
- **Traces:** REQ-1, REQ-3, LLD-UI-1
- **Framework target:** Jest
- **Location:** app/test/vulnerability/transferred-renderer.test.js
- **Preconditions:** Simulated DOM in JS environment.
- **Inputs / fixtures:** DOM of Risks tab.
- **Steps:**
  1. Uncheck the `risk__isTransferredFromDependency` checkbox.
  2. Assert standard input containers are shown again.
- **Expected:** UI elements toggle cleanly.
