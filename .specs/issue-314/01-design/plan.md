---
feature_key: issue-314
stage: design
artifact: plan
last_updated: 2026-06-24
confidence: high
generator: skill-spec-driven-dev@0.2.0
---

# Implementation Plan — Provide a dedicated flow for risks transferred from a dependency

## Phase 1 — Scaffold

```yaml
- id: TASK-1
  title: "Extend JSON schema and validation rules"
  description: |
    Add isTransferredFromDependency (boolean, default: false) and dependencyOrigin (string, default: '') properties to Risk items in json-schema.js. Export corresponding validators in validation.js.
  status: done
  depends_on: []
  lld_refs: [LLD-2]
  ac_refs: [AC-2]
  risk_refs: []
  files:
    - lib/src/model/schema/json-schema.js
    - lib/src/model/classes/Risk/validation.js
  validation:
    build: "npm run test"
    tests: [TC-1, TC-3]
  est_effort: S

- id: TASK-2
  title: "Update Risk class model"
  description: |
    Declare private variables #isTransferredFromDependency and #dependencyOrigin inside Risk class in risk.js. Implement their getters/setters and update the serialization in the properties getter.
  status: done
  depends_on: [TASK-1]
  lld_refs: [LLD-2]
  ac_refs: [AC-2]
  risk_refs: []
  files:
    - lib/src/model/classes/Risk/risk.js
  validation:
    build: "npm run test"
    tests: [TC-2]
  est_effort: S
```

## Phase 2 — Core

```yaml
- id: TASK-3
  title: "Implement backend bypassing & score mapping logic"
  description: |
    Modify handler-event.js so that if isTransferredFromDependency is true, threat/asset calculations are bypassed, the score values are set directly to the user-entered score, and the residualRiskLevel is derived from standard score ranges.
  status: done
  depends_on: [TASK-2]
  lld_refs: [LLD-1]
  ac_refs: [AC-3]
  risk_refs: []
  files:
    - lib/src/api/Risk/handler-event.js
  validation:
    build: "npm run test"
    tests: [TC-4]
  est_effort: S
```

## Phase 3 — Integration

```yaml
- id: TASK-4
  title: "Render HTML inputs for transferred risks"
  description: |
    Add HTML layout elements for the isTransferredFromDependency checkbox, dependencyOrigin input field, and direct score input in render-risks.js.
  status: done
  depends_on: [TASK-3]
  lld_refs: [LLD-UI-1]
  ac_refs: [AC-1]
  risk_refs: []
  files:
    - lib/src/api/Risk/render-risks.js
  validation:
    build: "npm run test"
    tests: [TC-5, TC-6]
  est_effort: S

- id: TASK-5
  title: "Update frontend renderer for dynamic toggling"
  description: |
    Update renderer.js to listen to isTransferredFromDependency checkbox state changes, show/hide respective UI containers, set the decision automatically to Share (Transfer), perform client-side inputs verification, and trigger save handlers.
  status: done
  depends_on: [TASK-4]
  lld_refs: [LLD-UI-1]
  ac_refs: [AC-1, AC-4, AC-5, AC-6]
  risk_refs: []
  files:
    - app/src/tabs/Risks/renderer.js
  validation:
    build: "npm run test"
    tests: [TC-5, TC-6]
  est_effort: M
```

## Phase 4 — Hardening

```yaml
- id: TASK-6
  title: "Add unit and integration tests"
  description: |
    Write Jest unit tests in lib/test/unit/ and/or integration tests verifying schema validation, data model correctness, score mapping, level thresholds, and renderer behaviors for transferred risks.
  status: done
  depends_on: [TASK-5]
  lld_refs: [LLD-1, LLD-2]
  ac_refs: [AC-1, AC-2, AC-3, AC-4, AC-5, AC-6]
  risk_refs: []
  files:
    - lib/test/unit/risk/transferred-risk.test.js
  validation:
    build: "npm run test"
    tests: [TC-1, TC-2, TC-3, TC-4, TC-5, TC-6]
  est_effort: S
```
