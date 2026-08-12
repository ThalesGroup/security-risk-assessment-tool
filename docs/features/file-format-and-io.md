# File Format & I/O

> **Audience:** Newcomers / onboarding developers  
> **Scope:** The `.sra` project file format, how files are opened and saved via the `lib` API, and how legacy XML files are migrated.

---

## Purpose & Scope

ISRA projects are stored as plain JSON files with the `.sra` extension. All file I/O is handled exclusively through the `lib/src/api/` module — the Electron app never reads or writes files directly. This document explains the file structure, the four API entry points (`DataNew`, `DataLoad`, `DataStore`, `XML2JSON`), and the XML migration pipeline for legacy InfoPath-based assessments.

---

## The .sra File Format

An `.sra` file is a **UTF-8 encoded JSON file** pretty-printed with 4-space indentation. It is the serialized form of an `ISRAProject` instance.

**Top-level structure:**

```json
{
  "ISRAmeta": {
    "appVersion": "1.3.0-alpha01",
    "schemaVersion": 3,
    "classification": "COMPANY CONFIDENTIAL {MyProject}",
    "iteration": 2,
    "projectName": "MyProject",
    "projectOrganization": "Engineering department",
    "projectVersion": "1.0",
    "ISRAtracking": [ ... ],
    "businessAssetsCount": 2,
    "supportingAssetsCount": 1,
    "risksCount": 1,
    "vulnerabilitiesCount": 1,
    "latestBusinessAssetId": 2,
    "latestSupportingAssetId": 1,
    "latestRiskId": 1,
    "latestVulnerabilityId": 1
  },
  "ProjectContext": { ... },
  "BusinessAsset": [ ... ],
  "SupportingAssetsDesc": "<p>Architecture diagram...</p>",
  "SupportingAsset": [ ... ],
  "Risk": [ ... ],
  "Vulnerability": [ ... ]
}
```

**Key design decisions:**
- All child entity Maps are serialized as **arrays** (using `map2Array()`).
- IDs are monotonically increasing and are **persisted** in `ISRAmeta` (`latestBusinessAssetId`, etc.) so that counters can be restored correctly on reload — deleting entity #3 never re-uses ID 3.
- Rich-text fields (descriptions, details) are stored as **raw HTML strings** produced by TinyMCE.
- File attachments (e.g. vulnerability documents) are stored as **base64-encoded strings**.
- The `schemaVersion` field gates backwards-compatibility — files with `schemaVersion > 3` are rejected.

---

## Opening a File (DataLoad)

`DataLoad` handles `.sra` and `.json` files. It is exported from `lib/src/api/data-load/index.js`.

**Call site (in `request-handlers.js`):**

```js
const { DataLoad } = require('../../../lib/src/api/index');
israProject = DataLoad(filePath);  // returns a populated ISRAProject instance
```

**What DataLoad does:**
1. Reads the file from disk with `fs.readFileSync`.
2. Parses the JSON.
3. Handles legacy format migration (files without `schemaVersion` field — see Schema Version Handling below).
4. Normalizes `ISRAtracking` dates to `YYYY-MM-DD` format.
5. Calls `validateJsonSchema()` to validate the parsed JSON against the AJV schema.
6. Calls `populateClass()` to reconstruct the full class hierarchy from the plain JSON.
7. Returns a live `ISRAProject` instance.

If any step fails, an error is thrown and `request-handlers.js` shows a dialog with the error message.

---

## Saving a File (DataStore)

`DataStore` is exported from `lib/src/api/data-store/index.js`.

**Call site:**

```js
const { DataStore } = require('../../../lib/src/api/index');
await DataStore(israProject, filePath);
```

**What DataStore does:**
1. Calls `israProject.toJSON()` — which internally calls `validateJsonSchema()` and then `JSON.stringify(…, null, 4)`.
2. Writes the resulting JSON string to `filePath` using `fs.writeFile`.

**Two save modes in the app:**

| Mode | When triggered | Behaviour |
|---|---|---|
| **Save** | File already has a path (`jsonFilePath !== ''`) | Overwrites the existing `.sra` file at `jsonFilePath` |
| **Save As** | First save or user chooses "Save As" | Opens a native file picker; writes to the selected path |

Before saving, the app checks for unsaved changes (`israProject.toJSON() !== oldIsraProject`). If changes exist, `iteration` is incremented and a new `ISRAtracking` entry is expected.

---

## XML to JSON Migration Pipeline

Legacy ISRA assessments were created in Microsoft InfoPath as `.xml` files. The `XML2JSON` pipeline converts them to the current JSON format.

**Call site:**

```js
const { XML2JSON } = require('../../../lib/src/api/index');
israProject = XML2JSON(filePath);  // reads .xml, returns ISRAProject
```

**Pipeline stages (`lib/src/api/xml-json/`):**

| Stage | File | Purpose |
|---|---|---|
| 1. Parse | `parser.js` | Uses `xml2js` to convert raw XML to a JavaScript object |
| 2. Alter | `alter-isra/alter-isra.js` | Transforms the InfoPath-specific structure into the canonical JSON shape |
| 3. Validate | `validate-json-schema.js` | Validates the transformed JSON against the AJV schema |
| 4. Populate | `populate-class.js` | Constructs the full `ISRAProject` class hierarchy |

The `alter-isra/` directory contains transformation helpers that handle structural differences between the InfoPath XML schema and the current JSON schema, including field renaming, type coercions, and missing-field defaults.

After a successful XML import, the file is treated as "unsaved" (`jsonFilePath = ''`), so the user must Save As to a new `.sra` file — the original `.xml` is never modified.

---

## Schema Version Handling

The `schemaVersion` field in `ISRAmeta` is a forward-compatibility guard.

| Condition | Behaviour |
|---|---|
| `schemaVersion` field absent | Legacy format — applies a structural migration (removes nested `riskName` object, fixes `vulnerabilityRef` references) |
| `schemaVersion <= 3` | Accepted and loaded normally |
| `schemaVersion > 3` | **Rejected** — throws `Unable to load schema version N, this version only supports 3 and below` |

The migration for schema-less files (in `request-handlers.js getJSON()`) flattens the old `riskName` object and maps `vulnerabilityRef` by name-to-ID lookup.

---

## Operational Notes

- **Never call `fs` directly from `app/`** — all file I/O goes through `lib/src/api/`. This keeps the business logic testable and isolated from Electron.
- **Supported file extensions at the open dialog:** `.sra`, `.json` (JSON format), `.xml` (InfoPath XML).
- **The `.sra` extension** is just a naming convention; the file content is standard JSON. You can open an `.sra` file in any text editor.
- **Import vs Open:** The app has two distinct flows — "Open" (replaces the current project) and "Import" (merges selected data from another project into the current one via a modal dialog). Import uses the same parsing pipeline but routes through `import:sendImports` IPC channel.
- **File encoding:** Always UTF-8. No BOM.

---

## Assumptions Made

- `populateClass()` in `lib/src/api/xml-json/populate-class.js` reconstructs all Maps and restores static ID counters on all entity classes.
- The `DataNew` API (`lib/src/api/data-new/index.js`) initializes the `ISRAProject` with default values from the JSON Schema but does not write any file until the user explicitly saves.

## Open Questions

- What fields does `DataNew` pre-populate beyond the JSON Schema defaults?
- Does the Import dialog support merging all entity types (BusinessAssets, Risks, Vulnerabilities) or only a subset?
- Are there migration scripts for moving from schemaVersion 1 or 2 to 3?

## Last Reviewed: 2026-06-24
