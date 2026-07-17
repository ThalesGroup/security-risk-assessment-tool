# Architecture Overview

> **Audience:** Newcomers / onboarding developers  
> **Scope:** High-level structure of the ISRA Security Risk Assessment Tool — what exists, why it is split the way it is, and which layer owns what.

---

## Purpose & Scope

ISRA is an **offline Electron desktop application** that guides security engineers through an ISO 27005 risk assessment. It has no server, no database, and makes no network calls during normal use. All project data is stored in `.sra` files (JSON) on the local filesystem.

The project is intentionally split into two packages so that the **core business logic can be tested and reused independently** of any UI framework:

- `lib/` — pure Node.js module, framework-agnostic, unit-testable
- `app/` — Electron shell, UI only, delegates all logic to `lib/`

This document explains the top-level structure and how these two layers communicate.

---

## Monorepo Structure

```
security-risk-assessment-tool/
├── lib/                   Core business logic (npm module)
│   ├── src/
│   │   ├── config.js          App-wide config (version, classification, orgs)
│   │   ├── utility-global.js  Shared utilities (counter helper)
│   │   ├── model/
│   │   │   ├── classes/       Domain entity classes (ISRAProject, Risk, …)
│   │   │   └── schema/        AJV JSON Schema definition
│   │   └── api/               Public API: DataLoad, DataStore, DataNew, XML2JSON
│   └── test/
│       ├── unit/              Unit tests per class / utility
│       └── integration/       Full load/save round-trips with fixture files
│
└── app/                   Electron desktop application (UI only)
    └── src/
        ├── electron/
        │   ├── main.js            App entry point, creates BrowserWindow
        │   ├── preload.js         contextBridge — exposes safe IPC APIs to renderer
        │   ├── request-handlers.js  ipcMain handlers — calls lib API
        │   └── validation.js      Error message strings
        ├── tabs/                  Per-tab HTML/JS UI modules
        │   ├── Welcome/
        │   ├── Project Context/
        │   ├── Business Assets/
        │   ├── Supporting Assets/
        │   ├── Risks/
        │   ├── Vulnerabilities/
        │   └── Report/
        ├── javascript/            Shared renderer JS (tabs.js, common.js)
        └── asset/                 Icons and images
```

**The single most important rule:** business logic always goes in `lib/`. `app/` only handles IPC dispatch and DOM rendering. Never call `lib` functions directly from the renderer process.

---

## Key Components & Responsibilities

| Component | Location | Responsibility |
|---|---|---|
| `ISRAProject` | `lib/src/model/classes/ISRAProject/` | Root domain object; owns all child entity maps |
| `BusinessAsset` | `lib/src/model/classes/BusinessAsset/` | Primary assets (what has business value) |
| `SupportingAsset` | `lib/src/model/classes/SupportingAsset/` | Technical assets (where business assets reside) |
| `Risk` | `lib/src/model/classes/Risk/` | Threat scenario + likelihood + impact + mitigations |
| `Vulnerability` | `lib/src/model/classes/Vulnerability/` | Weakness scored 0–10, linked to SupportingAssets |
| `ISRAProjectContext` | `lib/src/model/classes/ISRAProjectContext/` | Scope, assumptions, trust boundaries |
| `ISRAMetaTracking` | `lib/src/model/classes/ISRAProject/` | Audit trail of assessment iterations |
| `json-schema.js` | `lib/src/model/schema/` | AJV JSON Schema — single source of truth for valid data shapes |
| `api/DataLoad` | `lib/src/api/data-load/` | Open `.sra` / `.json` file → populate `ISRAProject` |
| `api/DataStore` | `lib/src/api/data-store/` | Serialize `ISRAProject` → write `.sra` file |
| `api/DataNew` | `lib/src/api/data-new/` | Initialize a blank `ISRAProject` |
| `api/XML2JSON` | `lib/src/api/xml-json/` | Parse legacy InfoPath XML → `ISRAProject` |
| `request-handlers.js` | `app/src/electron/` | All ipcMain handlers; owns the live `israProject` instance |
| `preload.js` | `app/src/electron/` | Whitelisted contextBridge — the only bridge between renderer and main |
| `tabs/*.js` | `app/src/tabs/` | Per-tab renderer code; reads/writes via `window.render`, `window.validate`, etc. |

---

## Technology Stack

| Concern | Technology | Version / Notes |
|---|---|---|
| Desktop shell | Electron | Chromium renderer + Node.js main process |
| Business logic | Node.js (CommonJS) | No TypeScript; plain ES2020 classes |
| Validation | AJV 8 | JSON Schema draft-07 |
| XML parsing | xml2js | Legacy InfoPath migration only |
| Rich text editing | TinyMCE | Used in several description fields |
| Testing | Jest 29 | Coverage included (`npm run test`) |
| Linting | ESLint 8 | Configured at `lib/.eslintrc.json`; `lib/` only |
| Build | electron-builder | `npm run dist` from `app/` |

---

## IPC Flow (Overview)

The renderer process has **no direct access** to Node.js APIs or to `lib`. All data flows through a strictly whitelisted IPC bridge:

```
Renderer (tabs/*.js)
  │  calls window.render.risks() etc.
  ▼
contextBridge (preload.js)
  │  ipcRenderer.invoke('render:risks')
  ▼
ipcMain handler (request-handlers.js)
  │  calls lib API e.g. DataLoad, israProject.addRisk()
  ▼
lib API (lib/src/api/)
  │  mutates ISRAProject in memory
  ▼
returns JSON string back to renderer
```

See [IPC Architecture](features/ipc-architecture.md) for the full channel reference and how to add a new channel.

---

## Operational Notes

- **Where does new business logic go?** Always `lib/src/`. Add a class under `lib/src/model/classes/<Entity>/`, expose it through `lib/src/api/`, and wire up a new IPC handler in `app/src/electron/request-handlers.js`.
- **Where does new UI go?** Under `app/src/tabs/<TabName>/`. A tab gets its data by calling `window.render.<tabName>()` on load and sends mutations via `window.validate.<tabName>(data)` or similar channels.
- **No env vars** — all configuration is in `lib/src/config.js` (`appVersion`, `classification`, `organizations`).
- **No feature flags** — there are no `FF_*` flags in this codebase.

---

## Assumptions Made

- The project has no HTTP server; it is fully offline. OpenAPI documentation is not applicable.
- `lib/` is scoped as a private npm module consumed directly by `app/` via a relative path (`require('../../../lib/src/...')`).
- The Electron version in use follows the security settings documented in [Electron Security](features/electron-security.md).

## Open Questions

- Which version of Electron is currently in use? (Not specified in `package.json` excerpts reviewed.)
- Is there a planned upgrade path to ESM / TypeScript for `lib/`?

## Last Reviewed: 2026-06-24
