# ISRA — Security Risk Assessment Tool

Electron desktop application for ISO 27005 security risk assessments. Fully offline, file-based storage (no network calls, no database).

## Monorepo Structure

```
lib/    Core business logic (npm module, framework-agnostic)
app/    Electron desktop app (UI only, delegates all logic to lib)
```

**Rule**: Business logic always goes in `lib/`. `app/` only handles IPC and DOM rendering.

## Running the Project

```bash
# Dev app (from repo root)
cd app && npm start

# Run tests with coverage (from repo root)
cd lib && npm run test

# Generate JSDoc
cd lib && npm run jsdoc

# Build distributable
cd app && npm run dist
```

## IPC Architecture

```
Renderer (tabs/*.js)
  → contextBridge (preload.js)
    → ipcRenderer.send / ipcRenderer.invoke
      → ipcMain handlers (request-handlers.js)
        → lib API (lib/src/api/)
```

Never call `lib` functions directly from renderer. Always go through the contextBridge → ipcMain chain.

## Data Model (ISO 27005)

```
ISRAProject
  ├── ISRAProjectContext       (scope, assumptions, trust boundaries)
  ├── BusinessAsset[]          (primary assets — what has business value)
  │     └── BusinessAssetProperties  (security sub-characteristics: CIA, authenticity, etc.)
  ├── SupportingAsset[]        (technical assets — where business assets flow/reside)
  ├── Risk[]                   (threat + vulnerability + scenario + treatment)
  │     ├── RiskAttackPath[]   (AND/OR combinations of vulnerabilities)
  │     ├── RiskImpact         (per-security-characteristic impact scores)
  │     ├── RiskLikelihood     (likelihood scores)
  │     └── RiskMitigation[]   (proposed security controls with benefit %)
  └── Vulnerability[]          (scored 0-10, linked to SupportingAssets)
```

Each class lives in `lib/src/model/classes/<ClassName>/`. AJV JSON Schema is in `lib/src/model/schema/json-schema.js`.

## Validation Pattern

All model classes use AJV for property validation. The AJV instance is in `lib/src/model/classes/validation/ajv-instance.js`. To add a new validated field:
1. Add the property to the JSON Schema in `json-schema.js`
2. Use `validateClassProperties` from `lib/src/model/classes/validation/validate-class-properties.js` in the setter

## File Format

- `.sra` files are JSON (the primary project format)
- XML format is supported for legacy InfoPath migration via `xml2js`
- File I/O lives in `lib/src/api/data-load/` (open) and `lib/src/api/data-store/` (save)

## Testing

Tests are in `lib/test/`:
- `unit/` — class-level tests, schema validation, utility functions
- `integration/` — full project load/save round-trips using fixture files in `lib/test/integration/test-N/`

Run with: `cd lib && npm run test` (Jest 29, coverage included).

## Linting

ESLint 8 configured at `lib/.eslintrc.json`. Scoped to `lib/` only (no eslint in `app/`).

## Electron Security Notes

- `nodeIntegration` must remain disabled
- `contextIsolation` must remain enabled
- All IPC channels are whitelisted in `preload.js` — add new channels explicitly
- URL schemes allowed for vulnerabilities: `ftp`, `http`, `https`, `mailto`, `tel`, `urn`
- Sanitize all rich text (TinyMCE output) before persisting — see `xml-json/` sanitization

## Config Defaults

Customizable in `lib/src/config.js`: `appVersion`, `classification`, `organizations`.
