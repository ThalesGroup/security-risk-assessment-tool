---
feature_key: issue-314
stage: design
artifact: lld
last_updated: 2026-06-24
confidence: high
generator: skill-spec-driven-dev@0.2.0
---

# Low-Level Design — Provide a dedicated flow for risks transferred from a dependency

## Overview & scope

This feature provides a simplified, dedicated flow for risks that are transferred from a dependency (such as a third-party service or library). Instead of requiring users to specify complex threat agents, threat verbs, business assets, supporting assets, and detailed likelihood/impact scores, users can simply check a box designating the risk as "transferred from a dependency". This triggers a simplified UI and data flow requiring only:
1. **Description**: Text description of the risk (utilizing the existing manual `riskName` field).
2. **Score**: A direct numerical score between 0 and 20 (mapped to `inherentRiskScore`, `mitigatedRiskScore`, and `residualRiskScore`).
3. **Comment for its origin / Dependency Name**: Stored in a new `dependencyOrigin` field.

This avoids the administrative burden of importing/creating numerous individual supporting and business assets for simple dependency-level risks.

## Context & assumptions

- ✅ Bypasses the default calculations of Threat Likelihood and Threat Impact.
- ✅ The risk management decision is implicitly and permanently set to "Share (Transfer)" for transferred risks.
- ✅ Bypasses the requirement for referencing Business Assets, Supporting Assets, Threat Agents, Threat Verbs, Mitigations, and Attack Paths during validation.

## Affected components / modules / packages

| Component | Role in this feature | Source path |
|---|---|---|
| `json-schema.js` | Defines schema for the new Risk fields | `lib/src/model/schema/json-schema.js` |
| `risk.js` | Implements the getters, setters, and serialization of the new fields | `lib/src/model/classes/Risk/risk.js` |
| `validation.js` | Implements properties validation functions | `lib/src/model/classes/Risk/validation.js` |
| `handler-event.js` | Implements core backend event handling, score syncing, and bypassing calculations | `lib/src/api/Risk/handler-event.js` |
| `render-risks.js` | Adds the HTML layout elements for the checkbox, score input, and dependency origin input | `lib/src/api/Risk/render-risks.js` |
| `renderer.js` | Manages the dynamic UI display, toggling sections, saving field values, and client-side validation | `app/src/tabs/Risks/renderer.js` |

## Interfaces

### LLD-1 Backend Event Handlers (`handler-event.js`)
- **traces:** REQ-2, REQ-4
- When a risk is updated (via `updateRiskLikelihood`, `updateRiskImpact`, or `updateRiskName`), if `isTransferredFromDependency` is `true`:
  - The `inherentRiskScore`, `mitigatedRiskScore`, and `residualRiskScore` are directly set to the user-entered score.
  - The `residualRiskLevel` is derived using the standard thresholds:
    - 0–5: `Low`
    - 6–10: `Medium`
    - 11–15: `High`
    - 16–20: `Critical`
  - Threat Agent, Threat Verb, Business Asset, Supporting Asset, and other calculations are bypassed.

## Data model

### LLD-2 Schema & Class Additions (`json-schema.js` & `risk.js`)
- **traces:** REQ-2
- **Properties added to `Risk`**:
  - `isTransferredFromDependency`:
    - Type: `boolean`
    - Default: `false`
    - Description: "Flag indicating whether this risk is transferred from an external dependency."
  - `dependencyOrigin`:
    - Type: `string`
    - Default: `""`
    - Description: "Comment/name of the dependency from which this risk is transferred."

## State & concurrency

- **UI State transition**:
  - Toggling `isTransferredFromDependency` triggers an immediate refresh of the Risk tab's DOM structure.
- **Save Flow**:
  - Fields are immediately synchronized to the backend via existing Electron IPC `risks:updateRiskName` or similar events.

## Dependencies

- **AJV (v8)**: For schema validation. No new third-party dependencies are required.

## Error handling & observability

- **Score Range Validation**: Checks that the user-entered score is an integer between 0 and 20. Displays an error styling in the UI if invalid.
- **Dependency Origin Validation**: Ensures that `dependencyOrigin` is validated as a string.

## Configuration

No new compile-time or runtime configuration options are added.

## UI / UX
<!-- Applicable: true -->

### LLD-UI-1 Checkbox and Toggle
- **traces:** REQ-1, REQ-3
- A checkbox and label are added above the risk details panel:
  - `<input type="checkbox" id="risk__isTransferredFromDependency">`
  - `<label for="risk__isTransferredFromDependency">Risk transferred from a dependency</label>`
- Toggling this checkbox:
  - Checks/unchecks the property.
  - If checked, hides:
    - Default Risk Name explanation and automatic generation UI.
    - Threat Agent section (`#risks__risk__threat__agent__evaluation` elements).
    - Threat Likelihood evaluation section.
    - Threat Impact evaluation section.
    - Vulnerability section (`#risks__vulnerability__evaluation`).
    - Mitigation section (`#risks__risk__mitigation__evaluation`).
    - Standard Decision Radio input options.
  - If checked, shows:
    - Manual Risk Name text input (labeled "Description of the Risk").
    - Dependency Origin Container (`#risk__dependencyOriginContainer`).
    - Transferred Risk Score Input (`#risk__transferredScoreContainer`).
    - Sets decision to "Share (Transfer)" automatically.

### LLD-UI-2 Component decomposition
- All UI actions occur dynamically in the existing `app/src/tabs/Risks/` tab.

### LLD-UI-3 Accessibility
- Standard keyboard navigation and screen readers will read the checkbox and the inputs. Form elements will have explicit labels and `id` properties.

### LLD-UI-4 Responsive design
- The input containers are styled using CSS flex and grid layouts to adapt cleanly to various screen sizes.

### LLD-UI-5 Design tokens / theming
- Matches the workspace's default colors, typography, and borders. If invalid values are entered, they are styled with a `3px solid red` (ERROR_COLOR) border.

## Edge cases

| Edge case | Covered by |
|---|---|
| User enters score > 20 | AC-4 |
| User enters score < 0 or negative | AC-4 |
| User enters empty description | AC-5 |
| User toggles checkbox off after entering transferred data | AC-6 |

## Constraints

- **Validation**: Schema validation must succeed for both standard and transferred risks.

## Backward / forward compatibility

- **SRA file compatibility**: Older `.sra` files will load correctly, default `isTransferredFromDependency` to `false`, and remain fully compatible.

## Rollout & fallback

- Fully offline deployment inside the Electron app.

## Open questions

- None. All requirements are clarified.

## Related

- Existing Risk Tab code under `app/src/tabs/Risks/` and API under `lib/src/api/Risk/`.
