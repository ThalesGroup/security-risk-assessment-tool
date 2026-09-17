# Development Guide

> **Audience:** Newcomers / onboarding developers  
> **Scope:** Local setup, running the app, testing, linting, and building a distributable.

---

## Purpose & Scope

This guide covers everything a new contributor needs to get the ISRA tool running locally, make changes, verify them through automated tests, and produce a distribution build. It does **not** cover deployment or hosting — ISRA is a fully offline desktop application.

---

## Prerequisites & Setup

| Requirement | Version / Notes |
|---|---|
| Node.js | LTS recommended (see `app/package.json` engines if specified) |
| npm | Bundled with Node.js |
| Git | Any recent version |
| Operating System | Windows, macOS, or Linux (Electron supports all three) |

**Clone and install:**

```bash
# Clone the repository
git clone <repo-url>
cd security-risk-assessment-tool

# Install lib dependencies
cd lib
npm install

# Install app dependencies
cd ../app
npm install
```

> Both `lib/` and `app/` are independent npm packages. They each have their own `package.json` and `node_modules/`. You must run `npm install` in **both** directories.

The `app/` package references `lib/` directly via a relative `require()` path — no symlinks or `npm link` are needed.

---

## Running the Application

```bash
# From the repo root
cd app
npm start
```

This launches the Electron application in development mode. The window title will show `ISRA Risk Assessment`. You can open DevTools with `Ctrl+Shift+I` / `Cmd+Option+I`.

**What happens on startup:**

1. `electron/main.js` creates the `BrowserWindow` and loads `tabs/Welcome/welcome.html`.
2. `main.js` calls `newISRAProject()` via `request-handlers.js`, which initializes a blank `ISRAProject` in memory using `DataNew`.
3. The renderer receives `project:load` via IPC and populates all tab UIs.

---

## Testing

Tests live in `lib/test/` and are run with Jest 29.

```bash
# From the repo root
cd lib
npm run test
```

This runs the full test suite **with coverage output**.

**Test structure:**

| Directory | What it tests |
|---|---|
| `lib/test/unit/` | Individual classes, schema validation, utility functions |
| `lib/test/integration/` | Full project load → mutate → save → reload round-trips |
| `lib/test/integration/fixtures/` | Shared fixture `.sra` / `.json` files used by integration tests |
| `lib/test/integration/test-N/` | Numbered integration scenarios (test-1 through test-10, etc.) |

**Example: running a single test file:**

```bash
cd lib
npx jest test/unit/validation-pattern/validation-pattern.test.js
```

**Coverage report** is printed to the terminal after each run. No external coverage server is required.

> Tests are scoped to `lib/` only. There are no automated tests for the Electron UI (`app/`). UI behavior can be verified by running the app and exercising the tabs manually.

---

## Linting

ESLint 8 is configured only for `lib/`. There is no ESLint setup in `app/`.

```bash
# From the repo root
cd lib
npx eslint src/
```

Configuration file: `lib/.eslintrc.json`.

**Common rules to be aware of:**
- No unused variables
- Consistent `require()` ordering
- The linter does **not** run as a pre-commit hook by default — run it manually before opening a PR

---

## Building a Distributable

```bash
# From the repo root
cd app
npm run dist
```

This uses **electron-builder** to produce a platform-native installer (`.exe` on Windows, `.dmg` on macOS, `.AppImage` / `.deb` on Linux). The output is placed in `app/dist/`.

**Notes:**
- The build bundles `lib/` as a local dependency — no npm publish step is needed.
- Code signing configuration (if required) is set in `app/package.json` under the `build` key.
- The distributable is fully self-contained and offline — no internet access is required at runtime.

---

## Generating JSDoc

```bash
cd lib
npm run jsdoc
```

This generates HTML documentation from JSDoc comments in `lib/src/`. Output location is determined by the `jsdoc.json` config in `lib/`.

---

## Operational Notes

- **Adding a new npm dependency to `lib`:** Run `npm install <pkg>` inside `lib/`. Make sure to also add it to `lib/package.json`. Since `app/` uses `lib/` via relative path, the dependency will be available automatically.
- **Adding a new npm dependency to `app`:** Run `npm install <pkg>` inside `app/`.
- **Environment variables:** None. All configuration is in `lib/src/config.js` — edit that file directly for defaults.
- **Node version compatibility:** Use the same Node.js version that Electron bundles internally for `lib/` code, to avoid subtle compatibility issues.
- **Windows path notes:** Some `npm` scripts may use Unix-style paths. If you encounter issues on Windows, check the `scripts` section of `lib/package.json`.

---

## Assumptions Made

- Node.js LTS is already installed and available on `PATH`.
- Both `lib/` and `app/` `node_modules/` are installed before running any command.
- There are no pre-commit hooks or CI/CD pipelines described in the reviewed files — these may exist outside the scanned scope.

## Open Questions

- Is there a `.nvmrc` or `engines` field specifying the exact required Node.js version?
- Are there any CI pipelines (GitHub Actions, etc.) that automate test and lint on push?
- Is code signing configured for the distributable build?

## Last Reviewed: 2026-06-24
