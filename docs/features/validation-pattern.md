# Validation Pattern

> **Audience:** Newcomers / onboarding developers  
> **Scope:** How property validation works in the `lib/` model layer (AJV + JSON Schema + class setters), and how the `app/` layer performs per-tab validation before saving.

---

## Purpose & Scope

ISRA uses a **two-level validation strategy**:

1. **Model-level validation** — every property setter on every domain class calls a validator function before accepting a value. Invalid values throw immediately.
2. **App-level validation** — before saving, the app checks business rules across the entire project graph (e.g. "does every Risk reference a valid, named Supporting Asset?").

This document explains both levels, shows how to add a new validated field, and describes how error messages surface to the user.

---

## AJV Instance & JSON Schema

### The JSON Schema

All valid data shapes are defined in a single file:

```
lib/src/model/schema/json-schema.js
```

This file exports:
- `properties` — the full AJV JSON Schema for the `ISRAProject` structure, including default values for every field.
- `schemaVersion` — the current schema version integer (maximum supported: `3`).

Every domain class constructor reads its default values from this schema:

```js
// Example from risk.js constructor
const riskJsonSchema = require('../../schema/json-schema').properties.Risk.items.properties;
this.#riskName = riskJsonSchema.riskName.default;
this.#threatAgent = riskJsonSchema.threatAgent.default;
```

This means the schema is the **single source of truth** for both validation rules and default values.

### The AJV Instance

A shared, pre-configured AJV instance lives at:

```
lib/src/model/classes/validation/ajv-instance.js
```

It is imported by `validateClassProperties` and by `validateJsonSchema`. Using a single shared instance ensures compiled schemas are cached and reused across all validation calls.

### validateJsonSchema

```
lib/src/api/xml-json/validate-json-schema.js
```

Called at two points:
- **On load** — after parsing a `.sra` or `.xml` file, to reject structurally invalid files.
- **On save** — inside `ISRAProject.toJSON()`, before serializing to JSON.

If validation fails, it throws with a structured error message:

```
Failed to validate json against schema at: [{"instancePath":"/Risk/0/riskId","message":"must be integer"}]
```

The `getError()` function in `request-handlers.js` parses this message to extract the affected tab and field name for the user-facing dialog.

---

## Adding a New Validated Field

Follow these steps in order:

**Step 1 — Add the field to `json-schema.js`:**

```js
// lib/src/model/schema/json-schema.js
// Under the relevant entity (e.g. properties.Risk.items.properties):
myNewField: {
  type: 'string',
  default: '',
  pattern: '^[a-zA-Z0-9 ]*$'  // example constraint
}
```

**Step 2 — Add a validator function to the class's `validation.js`:**

```js
// lib/src/model/classes/Risk/validation.js
const isMyNewField = (value) => typeof value === 'string' && /^[a-zA-Z0-9 ]*$/.test(value);
module.exports = { ..., isMyNewField };
```

**Step 3 — Add the private field and setter/getter to the class:**

```js
// lib/src/model/classes/Risk/risk.js
const { isMyNewField } = require('./validation');

class Risk {
  #myNewField;

  constructor() {
    this.#myNewField = riskJsonSchema.myNewField.default;
  }

  /** Description of the field
    * @type {string}
  */
  set myNewField(value) {
    if (isMyNewField(value)) this.#myNewField = value;
    else throw new Error(`Risk ${this.#riskId}: myNewField is invalid`);
  }

  get myNewField() {
    return this.#myNewField;
  }
}
```

**Step 4 — Expose the field in the `.properties` getter:**

```js
get properties() {
  return {
    // ... existing fields
    myNewField: this.#myNewField,
  };
}
```

**Step 5 — Add/update tests in `lib/test/unit/`** to cover valid and invalid values for the new field.

---

## Per-Tab Validation in the App

Before any save, `request-handlers.js` runs `validateClasses()`, which checks business rules across the entire project graph. This is **separate** from the AJV schema validation — it checks cross-entity referential integrity and required-field completeness.

### Validation checks per tab

| Tab | Checks performed |
|---|---|
| **Welcome** | `projectOrganization` must be non-empty |
| **Business Assets** | Each `businessAssetName` must be non-empty |
| **Supporting Assets** | Each `supportingAssetName` must be non-empty; each `businessAssetRef` must be non-null, non-duplicate, and reference a named BusinessAsset |
| **Vulnerabilities** | Each vulnerability must have: non-empty name, non-empty description, ≥1 valid Supporting Asset ref, CVE score 0–10 |
| **Risks** | Each risk must have: non-empty name, valid threatAgent + threatVerb + businessAssetRef + supportingAssetRef + motivation; attack paths must reference valid vulnerabilities; mitigation costs must be integers if set |

### Helper functions used

```js
checkBusinessAssetRef(ref)           // BA exists and has a name
checkBusinessAssetRefArray(refArray) // all BAs in array pass checkBusinessAssetRef
checkSupportingAssetRef(ref)         // SA exists, has a name, and its BA refs are valid
checkSupportingAssetRefArray(refArray)
checkVulnerabilityRef(ref, saRef)    // Vulnerability exists, matches SA, has name+description
checkRiskAttackPaths(attackPaths, saRef)  // all vulnerability refs in all attack paths are valid
```

---

## Error Message Format

When `validateClasses()` finds errors, it builds a human-readable message string organized by tab. For example:

```
⚠️ Business Assets Tab:
  - 2 assets have empty names. IDs: 1, 3

⚠️ Risks Tab:
  - 1 risk has invalid description. IDs: 2
  - 1 risk has invalid attack path evaluation. IDs: 2
```

This message is shown in a `dialog.showMessageBoxSync` warning that lets the user still save (with errors) or cancel.

For AJV schema errors, the `getError()` helper parses the JSON error and produces:

```
Invalid data input in Risk Tab,
`riskId` field: must be integer
```

---

## Operational Notes

- Validation at the setter level is **synchronous and immediate** — a bad value throws before it is assigned. This prevents the object from ever entering an invalid state.
- The AJV `validateJsonSchema()` call in `toJSON()` is a final safety net — it catches any state that slipped through setter validation (e.g. from direct property manipulation in tests).
- If you add a field that is nullable (`integer | null`), your validator function must explicitly accept `null`. Example: `const isMyField = (v) => v === null || Number.isInteger(v)`.
- There is no client-side form validation in the renderer — all validation is in the main process. The renderer only shows red borders / highlights based on the IPC response.

---

## Assumptions Made

- `validateClassProperties` in `lib/src/model/classes/validation/validate-class-properties.js` is a shared utility for multi-property AJV validation; the exact call signature was not fully reviewed.
- Enum values for fields like `threatAgent`, `threatVerb`, `vulnerabilityFamily` are defined in `json-schema.js` but not listed here to avoid duplication.

## Open Questions

- Does `validateClassProperties` validate a single property against the schema, or a batch of properties at once?
- Are there plans to add real-time renderer-side validation (e.g. inline field errors) in the UI?

## Last Reviewed: 2026-06-24
