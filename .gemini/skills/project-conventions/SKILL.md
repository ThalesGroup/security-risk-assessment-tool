---
name: project-conventions
description: ISRA project conventions — data model, IPC pattern, validation approach, file format, and code organization rules. Loaded automatically during development.
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

## IPC Pattern
Renderer → `preload.js` contextBridge → `ipcMain` handler in `request-handlers.js` → `lib/src/api/` function.
Never import lib directly in renderer code. All channels must be explicitly whitelisted in `preload.js`.

## Validation Pattern
Use AJV 8 with the centralized instance from `lib/src/model/classes/validation/ajv-instance.js`.  
Validate in property setters via `validateClassProperties` from `lib/src/model/classes/validation/validate-class-properties.js`.
Schema definitions in `lib/src/model/schema/json-schema.js`.
