---
name: project-conventions
description: ISRA project conventions — data model, IPC pattern, validation approach, file format, and code organization rules. Load this before generating or reviewing code for this project.
user-invocable: false
---

# ISRA Project Conventions

## Monorepo Rule
All business logic belongs in `lib/src/`. The `app/` directory is Electron UI only — it must never contain business logic.

## Data Model Hierarchy
```
ISRAProject → ISRAProjectContext
            → BusinessAsset[] (→ BusinessAssetProperties)
            → SupportingAsset[]
            → Risk[] (→ RiskAttackPath[], RiskImpact, RiskLikelihood, RiskMitigation[])
            → Vulnerability[]
```
Each entity class: `lib/src/model/classes/<ClassName>/<classname>.js`  
Each entity validation: `lib/src/model/classes/<ClassName>/validation.js`

## IPC Pattern
Renderer → `preload.js` contextBridge → `ipcMain` handler in `request-handlers.js` → `lib/src/api/` function.

Never import lib directly in renderer code. All channels must be explicitly whitelisted in `preload.js`.

## Validation Pattern
Use AJV 8 with the centralized instance from `lib/src/model/classes/validation/ajv-instance.js`.  
Validate in property setters via `validateClassProperties` from `lib/src/model/classes/validation/validate-class-properties.js`.  
Schema definitions in `lib/src/model/schema/json-schema.js`.

## File I/O
- `.sra` = JSON (primary format)
- XML supported via `xml2js` for legacy migration
- Load: `lib/src/api/data-load/`
- Save: `lib/src/api/data-store/`
- Sanitize all external content (URLs, rich text) in `lib/src/api/xml-json/`

## Testing
- Jest 29, files in `lib/test/unit/` and `lib/test/integration/`
- Integration tests use JSON fixture files alongside the test file
- Run: `cd lib && npm run test`

## Allowed URL Schemes
For vulnerability tracking URLs: `ftp`, `http`, `https`, `mailto`, `tel`, `urn` only.

## Electron Security
- Keep `nodeIntegration: false`, `contextIsolation: true`
- All IPC channels must be whitelisted
- Sanitize TinyMCE (rich text) output before storing
