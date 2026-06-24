---
feature_key: issue-314
stage: design
artifact: risks
last_updated: 2026-06-24
confidence: high
generator: skill-spec-driven-dev@0.2.0
---

# Risk Register — Provide a dedicated flow for risks transferred from a dependency

## RISK-1
- **Description:** Older or legacy `.sra` files failing to parse/load due to missing properties.
- **Likelihood:** low
- **Impact:** high
- **Mitigation:** The AJV schema defines proper `default` fallback values (`false` and `""`) so that missing attributes are automatically populated on load.
- **Owner:** Backend Developer
- **Related:** LLD-2, AC-2, TASK-1
- **Status:** open

## RISK-2
- **Description:** Default risk calculation formulas inadvertently overwriting the direct user-entered score.
- **Likelihood:** medium
- **Impact:** high
- **Mitigation:** Code paths in `handler-event.js` and `risk.js` are updated to check the `isTransferredFromDependency` flag and early-return/short-circuit automatic calculation updates.
- **Owner:** Backend Developer
- **Related:** LLD-1, AC-3, TASK-3
- **Status:** open
