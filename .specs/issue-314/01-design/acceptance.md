---
feature_key: issue-314
stage: design
artifact: acceptance
last_updated: 2026-06-24
confidence: high
generator: skill-spec-driven-dev@0.2.0
---

# Acceptance Criteria — Provide a dedicated flow for risks transferred from a dependency

## AC-1 (REQ-1, REQ-3)
- **kind:** automatable
- **Given** a user is on the Risks tab editing an identified risk
- **When** the user checks the "Risk transferred from a dependency" checkbox
- **Then** the UI should immediately hide Threat description, Likelihood, Impact, Vulnerability, and Mitigation sections
- **And** display only the Description (manual risk name), Dependency Origin input, and Transferred Score input.

## AC-2 (REQ-2, NFR-2)
- **kind:** automatable
- **Given** a risk is flagged as transferred from a dependency
- **When** the project is saved or exported to `.sra` file format
- **Then** the JSON schema validation should pass
- **And** the serialized Risk object must contain `isTransferredFromDependency: true` and the correct values for `dependencyOrigin`.

## AC-3 (REQ-4)
- **kind:** automatable
- **Given** a risk has `isTransferredFromDependency` set to `true`
- **When** the user sets the Transferred Score directly (e.g. `12`)
- **Then** the backend must set `inherentRiskScore`, `mitigatedRiskScore`, and `residualRiskScore` to `12`
- **And** correctly set `residualRiskLevel` to `High` (following standard thresholds: 0-5 Low, 6-10 Medium, 11-15 High, 16-20 Critical)
- **And** bypass any standard threat/asset-based computations.

## AC-4 (REQ-3, NFR-2)
- **kind:** automatable
- **Given** a risk is flagged as transferred from a dependency
- **When** the user attempts to enter an invalid score (e.g., `< 0`, `> 20`, or non-integer)
- **Then** the field is marked as invalid (red border/error styling) and the invalid score is rejected.

## AC-5 (REQ-3)
- **kind:** automatable
- **Given** a risk is flagged as transferred from a dependency
- **When** the Description (manual risk name) or Dependency Origin inputs are empty
- **Then** the UI applies invalid styling (red borders) to signal they are required.

## AC-6 (REQ-1, REQ-3)
- **kind:** automatable
- **Given** a risk has `isTransferredFromDependency` set to `true`
- **When** the user unchecks the "Risk transferred from a dependency" checkbox
- **Then** the UI restores all standard Threat description, Likelihood, Impact, Vulnerability, and Mitigation sections
- **And** `isTransferredFromDependency` is set to `false`.
