# ISRA — Security Risk Assessment Tool (Instructions Context)

This file serves as the system instruction manual and development guidelines context for the Gemini CLI and all subagents working on the repository.

## Project Overview

The **ISRA (Security Risk Assessment) Tool** is a fully offline, file-based desktop application compliant with the **ISO 27005** risk management standard. It is used to evaluate security risks of engineering projects by identifying business (primary) assets, technical (supporting) assets, vulnerabilities, threats, risk attack paths, and potential mitigation strategies.

### Architecture (Monorepo)

The repository is structured as a monorepo containing two key modules:
1. **`lib/`**: Core business logic and model layer.
   * Framework-agnostic Node.js module.
   * **Location**: Contains model classes (`lib/src/model/classes/`), JSON/AJV schema definitions (`lib/src/model/schema/`), file load/store routines (`lib/src/api/data-load/`, `lib/src/api/data-store/`), and general utilities.
   * **Rule**: All domain and business logic (including data validation, transformation, XML/JSON parsing, and math calculations) **MUST** reside inside `lib/`.
2. **`app/`**: Electron application shell and user interface.
   * **Location**: Contains IPC window configuration (`app/src/electron/main.js`), secure context bridge definition (`app/src/electron/preload.js`), request handlers (`app/src/electron/request-handlers.js`), and frontend views (`app/src/tabs/` containing HTML/CSS/renderer JS per tab, e.g., Welcome, Business Assets, Supporting Assets, Risks, Vulnerabilities, Report).
   * **Rule**: `app/` is strictly for presentation, Electron window management, and handling browser DOM events. It **MUST NEVER** contain domain or business logic. All interactions with the domain must go through IPC request handlers invoking `lib` API methods.

---

## Technical Stack & Key Tools

* **Core Runtime**: Node.js (v20 or v22 LTS) and Electron.
* **Schema Validation**: AJV (v8) with `ajv-errors` and `ajv-formats` for rigorous data and URL validation.
* **Rich Text Editing**: HugeRTE for sanitizing and editing rich text in the UI tabs.
* **Testing**: Jest 29 with code coverage.
* **API Documentation**: JSDoc.
* **Packaging**: `electron-builder` for multi-platform distribution.

---

## Building and Running

Ensure dependencies are installed for both the `app/` and `lib/` modules first.

```bash
# 1. Install dependencies across both modules
# From the root directory:
cd lib && npm install && cd ../app && npm install

# 2. Start the Electron application (development mode)
cd app && npm start

# 3. Run the test suite (from the lib directory)
cd lib && npm run test

# 4. Generate API JSDoc documentation
cd lib && npm run jsdoc

# 5. Package application for host platform
cd app && npm run dist
```

---

## Core Development Conventions

### 1. Monorepo Separation of Concerns
* Never import `lib` modules directly inside renderer code (inside `app/src/tabs/`).
* Instead, expose APIs using `contextBridge.exposeInMainWorld` in `app/src/electron/preload.js`.
* Handle these events via `ipcMain.handle` in `app/src/electron/request-handlers.js` which delegates the work directly to `lib` functions.

### 2. Schema-Based Data Validation
* All data model classes extend or utilize centralized schema patterns.
* The main validation definitions reside in `lib/src/model/schema/json-schema.js`.
* Validation in class properties must be triggered via `validateClassProperties` (from `lib/src/model/classes/validation/validate-class-properties.js`) inside setters.
* Strict input validation must be done for all user inputs. For vulnerability tracking URLs, only `ftp`, `http`, `https`, `mailto`, `tel`, and `urn` schemes are allowed.

### 3. File I/O
* **Format**: `.sra` files are native JSON structures containing the fully serialized `ISRAProject`.
* Legacy InfoPath XML parsing is supported using `xml2js` inside `lib/src/api/data-load/import-isra.js`.
* Always wrap file loads/parses in try-catch blocks and sanitize rich text before persistence.

### 4. Testing Guidelines
* All modifications or additions to business logic or model classes **MUST** include corresponding unit or integration tests.
* Unit tests belong in `lib/test/unit/`.
* Integration tests belong in `lib/test/integration/`.
* Use Jest mock patterns (e.g., mocking electron, filesystem, or remote components) where appropriate to keep tests hermetic and robust.

### 5. Electron Security Hardening
* Maintain secure window settings inside `app/src/electron/main.js`:
  * `nodeIntegration` must remain `false`.
  * `contextIsolation` must remain `true`.
* Whitelist all allowed IPC channels in `preload.js` explicitly (no wildcard channel matching).
