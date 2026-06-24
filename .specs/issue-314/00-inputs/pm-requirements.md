<!-- Source: user-input; fetched: 2026-06-24; by: skill-spec-driven-dev@0.2.0 -->
---
feature_key: issue-314
stage: init
artifact: pm-requirements
last_updated: 2026-06-24
confidence: high
generator: skill-spec-driven-dev@0.2.0
---

# PM Requirements for Issue 314 — Provide a dedicated flow for risks transferred from a dependency

## Summary
The goal is to allow users to define a risk that is transferred from a dependency. This risk should have a simplified, dedicated flow to avoid requiring users to import or define a large number of individual supporting and business assets.

## Detailed Requirements
- **Dedicated Flow Flag**: Each risk can be designated as "transferred from a dependency" via a flag/boolean field `isTransferredFromDependency` (default `false`).
- **Simplified Fields**: When this flag is enabled, the risk should only require:
  1. **Description**: A text field/rich-text area (stored in `riskName`) representing the risk's description.
  2. **Score**: A direct numerical score (stored in `inherentRiskScore`, `mitigatedRiskScore`, and `residualRiskScore`) directly entered by the user.
  3. **Comment for its origin / Dependency Name**: A field `dependencyOrigin` to describe the dependency or source it came from.
- **Bypassing Complex Calculations**: Bypasses the default calculations of Threat Likelihood and Threat Impact, and bypasses the requirements for referencing Business Assets, Supporting Assets, Threat Agents, Threat Verbs, Mitigations, and Attack Paths.
