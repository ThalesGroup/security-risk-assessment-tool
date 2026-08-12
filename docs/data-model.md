# Data Model

> **Audience:** Newcomers / onboarding developers  
> **Scope:** All domain entity classes in `lib/src/model/classes/`, their properties, relationships, and lifecycle methods (add / delete / get).

---

## Purpose & Scope

The ISRA data model represents an ISO 27005 security risk assessment as a tree of in-memory JavaScript class instances rooted at `ISRAProject`. Each class:

- Uses **private fields** (`#field`) for encapsulation.
- Validates every property assignment via AJV (see [Validation Pattern](features/validation-pattern.md)).
- Exposes a `.properties` getter that returns a plain object suitable for serialization.
- Is stored inside its parent's `Map` (keyed by ID), not as arrays.

The serialized form of a project is a single JSON string produced by `ISRAProject.toJSON()`, which writes the `.sra` file.

---

## Domain Entity Overview

| Class | Location | Role |
|---|---|---|
| `ISRAProject` | `ISRAProject/isra-project.js` | Root container; owns all child maps |
| `ISRAProjectContext` | `ISRAProjectContext/isra-project-context.js` | Scope, assumptions, trust boundaries |
| `ISRAMetaTracking` | `ISRAProject/isra-meta-tracking.js` | One audit-trail entry per save iteration |
| `BusinessAsset` | `BusinessAsset/business-asset.js` | Primary asset (what has business value) |
| `BusinessAssetProperties` | `BusinessAsset/business-asset-properties.js` | CIA + Authenticity/Authorization/Non-repudiation sub-scores |
| `SupportingAsset` | `SupportingAsset/supporting-asset.js` | Technical asset (where business assets reside/flow) |
| `Risk` | `Risk/risk.js` | Threat scenario: agent + verb + motivation + scores |
| `RiskLikelihood` | `Risk/risk-likelihood.js` | Likelihood scoring sub-object |
| `RiskImpact` | `Risk/risk-impact.js` | Impact scoring per security characteristic |
| `RiskAttackPath` | `Risk/risk-attack-path.js` | One AND/OR combination of vulnerability references |
| `RiskMitigation` | `Risk/risk-mitigation.js` | A proposed security control with benefit % |
| `Vulnerability` | `Vulnerability/vulnerability.js` | Weakness scored 0–10, linked to ≥1 SupportingAssets |

---

## Class Details

### ISRAProject

The root object. Constructed with `new ISRAProject()` and initialized by `DataNew` or populated by `DataLoad` / `XML2JSON`.

**Key properties:**

| Property | Type | Description |
|---|---|---|
| `projectName` | `string` | Free-text name of the assessed project |
| `projectVersion` | `string` | Version string of the assessed project |
| `projectOrganization` | `string` | Must be one of the values in `config.organizations` |
| `classification` | `string` | Document classification label (default: `config.classification`) |
| `iteration` | `integer \| null` | Current assessment iteration count |
| `appVersion` | `string` | Read-only; set from `config.appVersion` at construction |
| `schemaVersion` | `integer` | Schema version used to validate the file (max: 3) |
| `latestBusinessAssetId` | `integer \| null` | Monotonically increasing ID counter (persisted across saves) |
| `latestSupportingAssetId` | `integer \| null` | Same, for SupportingAssets |
| `latestRiskId` | `integer \| null` | Same, for Risks |
| `latestVulnerabilityId` | `integer \| null` | Same, for Vulnerabilities |

**Child collections (Maps):**

| Map field | Key | Value |
|---|---|---|
| `#businessAssetsMap` | `businessAssetId` | `BusinessAsset` instance |
| `#supportingAssetsMap` | `supportingAssetId` | `SupportingAsset` instance |
| `#risksMap` | `riskId` | `Risk` instance |
| `#vulnerabilitiesMap` | `vulnerabilityId` | `Vulnerability` instance |
| `#metaTrackingMap` | `trackingIteration` | `ISRAMetaTracking` instance |

**Lifecycle methods** (identical pattern for each entity type):

```js
// Add — throws if wrong type
israProject.addBusinessAsset(new BusinessAsset());

// Get — throws if ID doesn't exist
const ba = israProject.getBusinessAsset(1);

// Delete — throws if ID doesn't exist; reindexes map
israProject.deleteBusinessAsset(1);
```

> **Note:** When a Risk or Vulnerability is added, `ISRAProject` automatically copies `projectName` and `projectVersion` onto the child object to keep references consistent.

---

### BusinessAsset

Represents something of value to the business (e.g. user credentials, transaction data, a service).

**Key properties:**

| Property | Type | Description |
|---|---|---|
| `businessAssetId` | `integer \| null` | Auto-incremented at construction |
| `businessAssetName` | `string` | Free-text name |
| `businessAssetType` | `string` | Enum defined in JSON Schema |
| `businessAssetDescription` | `string` | HTML (TinyMCE) rich text |
| `businessAssetProperties` | `BusinessAssetProperties` | CIA + extended security characteristics |

`BusinessAssetProperties` carries per-characteristic scores (Confidentiality, Integrity, Availability, Authenticity, Authorization, Non-repudiation).

---

### SupportingAsset

Represents a technical component (server, database, API, device) that stores or processes BusinessAssets.

**Key properties:**

| Property | Type | Description |
|---|---|---|
| `supportingAssetId` | `integer \| null` | Auto-incremented at construction |
| `supportingAssetName` | `string` | Free-text name |
| `supportingAssetType` | `string` | Enum defined in JSON Schema |
| `supportingAssetSecurityLevel` | `string` | Security level classification |
| `businessAssetRef` | `integer[]` | IDs of BusinessAssets that reside on this asset |

---

### Vulnerability

A specific technical weakness. Each vulnerability is scored independently and linked to one or more SupportingAssets.

**Key properties:**

| Property | Type | Description |
|---|---|---|
| `vulnerabilityId` | `integer \| null` | Auto-incremented |
| `vulnerabilityName` | `string` | Free-text name |
| `vulnerabilityFamily` | `string` | Category enum (e.g. Configuration, Design) |
| `vulnerabilityTrackingID` | `string` | External defect ID (e.g. GTO ticket) |
| `vulnerabilityTrackingURI` | `string` | URL to tracking system (validated scheme) |
| `vulnerabilityDescription` | `string` | HTML rich text |
| `vulnerabilityDescriptionAttachment` | `string` | Base64-encoded attachment |
| `vulnerabilityCVE` | `string` | CVSS v2/v3 vector string |
| `cveScore` | `number \| null` | 0–10 CVSS score |
| `overallScore` | `integer \| null` | Computed overall vulnerability score |
| `overallLevel` | `string` | Enum: Low / Medium / High / Critical |
| `supportingAssetRef` | `Set<integer>` | IDs of SupportingAssets this vulnerability affects |

---

### Risk

A complete threat scenario linking a threat agent + verb to a specific BusinessAsset on a specific SupportingAsset.

**Key properties:**

| Property | Type | Description |
|---|---|---|
| `riskId` | `integer \| null` | Auto-incremented via static counter |
| `riskName` | `string` | Auto-computed or manually overridden |
| `isAutomaticRiskName` | `boolean` | Whether the name is auto-generated |
| `threatAgent` | `string` | Enum: type of attacker |
| `threatAgentDetail` | `string` | HTML detail text |
| `threatVerb` | `string` | Enum: action taken (disclose, modify, deny, …) |
| `threatVerbDetail` | `string` | HTML detail text |
| `motivation` | `string` | Free-text motivation |
| `motivationDetail` | `string` | HTML detail text |
| `businessAssetRef` | `integer \| null` | Which BusinessAsset is targeted |
| `supportingAssetRef` | `integer \| null` | Which SupportingAsset is the attack surface |
| `riskLikelihood` | `RiskLikelihood` | Likelihood scoring sub-object |
| `riskImpact` | `RiskImpact` | Impact scoring per characteristic |
| `allAttackPathsName` | `string` | Combined name of all attack paths (OR) |
| `allAttackPathsScore` | `number \| null` | Computed worst-case attack path score |
| `inherentRiskScore` | `number \| null` | Score before mitigations |
| `mitigationsBenefits` | `number \| null` | Reduction from all accepted/done mitigations |
| `mitigationsDoneBenefits` | `number \| null` | Reduction from "Done" mitigations only |
| `mitigatedRiskScore` | `number \| null` | Score after all mitigations |
| `riskManagementDecision` | `string` | Enum: Accept / Mitigate / Avoid / Transfer |
| `riskManagementDetail` | `string` | HTML detail text |
| `residualRiskScore` | `number \| null` | Final residual score |
| `residualRiskLevel` | `string` | Enum: Low / Medium / High / Critical |

**Child collections on Risk:**

| Map | Purpose |
|---|---|
| `#riskAttackPathMap` | Attack paths (AND combinations of Vulnerabilities) |
| `#riskMitigationMap` | Proposed security controls |

---

### RiskAttackPath

One attack path = one AND-combination of vulnerabilities. Multiple attack paths on the same Risk are combined with OR logic.

Each `RiskAttackPath` holds an array of `vulnerabilityRef` objects (`{ vulnerabilityId, weight }`).

---

### RiskMitigation

A proposed security control for a risk.

**Key properties:** `riskMitigationId`, `riskIdRef`, `description` (HTML), `cost` (integer | null), `decision` (enum), `decisionDetail` (HTML), `mitigationsBenefits` (0–1 double).

---

## Cross-References & Relationships

```
ISRAProject
  ├── ISRAProjectContext          (1:1)
  ├── ISRAMetaTracking[]          (1:N, keyed by trackingIteration)
  ├── BusinessAsset[]             (1:N, keyed by businessAssetId)
  │     └── BusinessAssetProperties  (1:1 embedded)
  ├── SupportingAsset[]           (1:N, keyed by supportingAssetId)
  │     └── businessAssetRef[]    → references BusinessAsset.businessAssetId
  ├── Vulnerability[]             (1:N, keyed by vulnerabilityId)
  │     └── supportingAssetRef[]  → references SupportingAsset.supportingAssetId
  └── Risk[]                      (1:N, keyed by riskId)
        ├── businessAssetRef      → references BusinessAsset.businessAssetId
        ├── supportingAssetRef    → references SupportingAsset.supportingAssetId
        ├── RiskAttackPath[]      (1:N, keyed by riskAttackPathId)
        │     └── vulnerabilityRef[] → references Vulnerability.vulnerabilityId
        ├── RiskLikelihood        (1:1 embedded)
        ├── RiskImpact            (1:1 embedded)
        └── RiskMitigation[]      (1:N, keyed by riskMitigationId)
```

**The reference direction is always downward** — Vulnerability references SupportingAsset, not vice versa. Referential integrity is enforced at save time by the per-tab validators in `request-handlers.js`.

---

## ID Management Pattern

All entity IDs are **monotonically increasing integers** that persist across saves. This means deleting entity #3 does not reuse ID 3 for the next entity.

- **Static counter pattern** (Risk, Vulnerability, BusinessAsset, SupportingAsset): each class holds a private static `#idCount` that auto-increments in `static incrementId()`. On file load, `Class.setIdCount(latestId)` restores the counter to where it left off.
- **ISRAProject-managed counters** (`#latestBusinessAssetId`, etc.): also persisted in the JSON and used to restore static counters on load.
- **Map-based re-indexing**: when an item is deleted from a Map (e.g. `RiskAttackPath`), the remaining items are re-indexed sequentially using the `counter()` utility from `utility-global.js` to close gaps.

Example — adding a new BusinessAsset:

```js
const ba = new BusinessAsset();          // gets next auto-incremented ID
ba.businessAssetName = 'User Data';
ba.businessAssetType = 'Data';
israProject.addBusinessAsset(ba);        // stored in #businessAssetsMap
```

---

## Operational Notes

- All Maps are converted to plain arrays before serialization using `map2Array()` from `lib/src/model/classes/map2array.js`.
- `ISRAProject.toJSON()` calls `validateJsonSchema()` before serializing — it will throw if the in-memory state violates the JSON Schema.
- Never mutate a child object after extracting it from the Map with `getX(id)` without re-setting it — you are working with the live reference, so changes are immediate.
- `RiskAttackPath` and `RiskMitigation` are nested within `Risk` — they do not have their own top-level Map in `ISRAProject`.

---

## Assumptions Made

- All IDs are positive integers starting from 1. `null` is a valid default for a new unset ID.
- `BusinessAssetProperties` is always created automatically by `BusinessAsset`'s constructor — it cannot be null.
- `supportingAssetsDesc` on `ISRAProject` is a free HTML field for attaching an architecture diagram description; it is not a separate class.

## Open Questions

- What are the valid enum values for `businessAssetType`, `supportingAssetType`, `threatAgent`, `threatVerb`, and `overallLevel`? These are defined in `json-schema.js` which was not fully reviewed.
- Is `ISRAProjectContext` always populated, or can it be empty on a new project?

## Last Reviewed: 2026-06-24
