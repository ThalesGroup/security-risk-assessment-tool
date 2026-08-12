# Risk Assessment Workflow

> **Audience:** Newcomers / onboarding developers  
> **Scope:** The ISO 27005 risk assessment process as implemented in ISRA — from project setup through to risk treatment decisions.

---

## Purpose & Scope

ISRA guides a security engineer through a structured, iterative risk assessment following **ISO/IEC 27005**. The tool captures the assessment as a project file (`.sra`) that passes through six sequential phases. Each phase builds on data entered in the previous one — skipping phases or leaving required fields empty triggers validation warnings at save time.

This document explains what each phase produces, which domain classes are involved, and how the data flows from one phase to the next.

---

## When to Use / When Not to Use

| Use ISRA when… | Do NOT use ISRA when… |
|---|---|
| Conducting a formal ISO 27005 security risk assessment | You need a lightweight threat checklist (no scoring needed) |
| Assessing a product, system, or service for security risks | You need a real-time collaborative tool (ISRA is single-user, offline) |
| Migrating an existing InfoPath-based ISRA assessment | You need to export to a structured database or API |
| Producing a signed-off PDF risk report for stakeholders | |

---

## Workflow Steps (ISO 27005)

The assessment follows this linear progression across the UI tabs:

```
1. Project Setup (Welcome Tab)
        ↓
2. Project Context
        ↓
3. Business Assets
        ↓
4. Supporting Assets
        ↓
5. Vulnerabilities
        ↓
6. Risks + Mitigation
        ↓
7. Report (PDF export)
```

### Step 1 — Project Setup (Welcome Tab)

**Purpose:** Identify the project being assessed and record the team conducting the assessment.

**Data captured:**
- `projectName` — name of the product/system being assessed
- `projectOrganization` — which team owns the assessment (must be one of the configured organizations)
- `projectVersion` — version of the product
- `classification` — document classification label
- `ISRAtracking` — audit trail: one `ISRAMetaTracking` row per save, recording the date and reviewer

**Validation rule:** `projectOrganization` must be set before saving.

---

### Step 2 — Project Context

**Purpose:** Define the scope of the assessment — what is in-scope, trust boundaries, assumptions.

**Data captured via `ISRAProjectContext`:**
- Scope description (HTML)
- Assumptions and constraints
- Trust boundary descriptions
- Attachments (base64-encoded supporting documents)

This context is reference material for all subsequent steps; it does not link directly to other entities but is persisted as part of the project.

---

### Step 3 — Business Assets

**Purpose:** Enumerate *what* is valuable — data, services, or capabilities that must be protected.

**Entity:** `BusinessAsset` + embedded `BusinessAssetProperties`

Each Business Asset is assigned:
- A **type** (e.g. Service, Data, Process)
- A **description**
- **Security characteristic scores** for: Confidentiality, Integrity, Availability, Authenticity, Authorization, Non-repudiation

These scores drive the Impact calculation on Risks later.

**Example:**

| Business Asset | Type | Confidentiality | Integrity | Availability |
|---|---|---|---|---|
| User Authentication Tokens | Data | High | High | Medium |
| Payment Processing Service | Service | High | Critical | High |

**Validation rule:** Each Business Asset must have a non-empty name before saving.

---

### Step 4 — Supporting Assets

**Purpose:** Map *where* Business Assets live or flow — the technical components that host them.

**Entity:** `SupportingAsset`

Each Supporting Asset:
- Has a **type** (e.g. Application, Hardware, Network)
- Carries a **security level**
- References one or more `BusinessAsset` IDs via `businessAssetRef[]`

**Example:**

| Supporting Asset | Type | References Business Asset |
|---|---|---|
| Auth Service (Node.js API) | Application | User Authentication Tokens |
| Payment Gateway Integration | Application | Payment Processing Service |

The `supportingAssetsDesc` field on `ISRAProject` accepts an HTML-rich architecture diagram description covering all Supporting Assets.

**Validation rules:** Each Supporting Asset must have a non-empty name and at least one valid (non-duplicate, non-null) Business Asset reference.

---

### Step 5 — Vulnerabilities

**Purpose:** Document specific technical weaknesses that could be exploited on the Supporting Assets.

**Entity:** `Vulnerability`

Each Vulnerability:
- Is assigned to one or more `SupportingAsset` IDs (`supportingAssetRef`)
- Has a **family** (e.g. Design, Configuration, Implementation)
- Is scored with a **CVE vector** (CVSS v2/v3) and `cveScore` (0–10)
- Receives an `overallScore` and `overallLevel` (Low / Medium / High / Critical)
- Can carry a tracking ID (e.g. JIRA/GTO ticket) and URL

**Validation rules:** Each Vulnerability must have a non-empty name, non-empty description, at least one valid Supporting Asset reference, and a CVE score between 0 and 10.

---

### Step 6 — Risks + Mitigation

**Purpose:** Define what could go wrong (threat scenarios), evaluate their likelihood and impact, and decide how to treat them.

**Entity:** `Risk` (with nested `RiskLikelihood`, `RiskImpact`, `RiskAttackPath[]`, `RiskMitigation[]`)

Each Risk describes:

**Description sub-section:**
- `threatAgent` — who attacks (enum)
- `threatVerb` — what they do (enum: disclose, modify, deny, use, destroy, …)
- `businessAssetRef` — which Business Asset is targeted
- `supportingAssetRef` — which Supporting Asset is the attack surface
- `motivation` — why the attacker acts

**Evaluation sub-section:**
- One or more `RiskAttackPath` objects — each is an AND-combination of Vulnerabilities on the same Supporting Asset
- Multiple attack paths are combined with OR logic → `allAttackPathsScore`
- `riskLikelihood` and `riskImpact` sub-objects provide detailed scoring
- `inherentRiskScore` = risk score **before** any mitigations

**Mitigation sub-section:**
- One or more `RiskMitigation` objects, each with: description, cost, `decision` (None / Accepted / Done), and `mitigationsBenefits` (0–1 reduction factor)
- `mitigationsBenefits` and `mitigationsDoneBenefits` are computed from the individual mitigation decisions
- `mitigatedRiskScore` = inherent score reduced by mitigations

**Treatment decision:**
- `riskManagementDecision` — Accept / Mitigate / Avoid / Transfer
- `residualRiskScore` and `residualRiskLevel` — final classification after treatment

---

### Step 7 — Report

**Purpose:** Export the complete assessment as a signed PDF.

The Report tab renders all tabs' data into a printable view. The user triggers PDF generation via `downloadReport()` in `request-handlers.js`, which uses Electron's `printToPDF` API. The PDF includes:
- Project metadata header (project name)
- Classification footer on every page
- All tabs' data in a formatted layout

---

## Key Entities & Their Roles

| Entity | Produced in Step | Consumed by |
|---|---|---|
| `ISRAProject` | Step 1 | All steps (root container) |
| `ISRAProjectContext` | Step 2 | Report |
| `BusinessAsset` | Step 3 | Step 4 (`businessAssetRef`), Step 6 (`businessAssetRef`) |
| `SupportingAsset` | Step 4 | Step 5 (`supportingAssetRef`), Step 6 (`supportingAssetRef`) |
| `Vulnerability` | Step 5 | Step 6 (`RiskAttackPath.vulnerabilityRef`) |
| `Risk` | Step 6 | Report |

---

## Risk Scoring & Mitigation

The scoring pipeline for a single Risk:

1. **Attack Path Score** — computed from the vulnerabilities in each `RiskAttackPath` (AND logic within a path, OR logic across paths). `allAttackPathsScore` takes the worst case.
2. **Inherent Risk Score** — combines `allAttackPathsScore` with `riskLikelihood` and `riskImpact` sub-scores.
3. **Mitigation Benefits** — for each `RiskMitigation` with `decision = Done`, `mitigationsBenefits` is the fractional reduction (0–1). The combined `mitigationsDoneBenefits` is calculated.
4. **Mitigated Risk Score** — `inherentRiskScore × (1 - mitigationsDoneBenefits)` (approximate; exact formula is in the handler event code).
5. **Residual Risk** — after the `riskManagementDecision` is applied, the final `residualRiskScore` and `residualRiskLevel` are set.

---

## Operational Notes

- The workflow is **iterative**, not one-shot. Engineers save intermediate results, and each save increments `iteration` and adds a row to `ISRAtracking`.
- If you delete a Business Asset that is referenced by a Supporting Asset or Risk, the validation at save time will flag dangling references as errors. Referential integrity is not automatically cascaded.
- The `isAutomaticRiskName` flag on `Risk` controls whether the `riskName` is auto-computed from `threatAgent + threatVerb + businessAssetRef`; setting it to `false` allows manual naming.
- All rich-text fields (descriptions, details) accept HTML via TinyMCE. HTML is sanitized before it is persisted — see [Electron Security](electron-security.md).

---

## Assumptions Made

- The ISO 27005 scoring methodology (exact formulas for combining likelihood, impact, and vulnerability scores) is implemented in the Risk handler event code (`api/Risk/handler-event.js`), which was not fully reviewed.
- `riskManagementDecision` enum values (Accept / Mitigate / Avoid / Transfer) are verified from JSDoc but the exact schema enum was not inspected.

## Open Questions

- What is the precise formula for computing `inherentRiskScore` from likelihood + impact sub-scores?
- Can a single project have Risks that reference Business Assets from different Supporting Assets simultaneously?
- Is there a maximum number of RiskAttackPaths or RiskMitigations per Risk?

## Last Reviewed: 2026-06-24
