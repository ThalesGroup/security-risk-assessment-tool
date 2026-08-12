# IPC Architecture

> **Audience:** Newcomers / onboarding developers  
> **Scope:** How the Electron renderer process communicates with the main process — the full IPC channel inventory and how to add a new channel safely.

---

## Purpose & Scope

Electron runs two separate JavaScript environments: the **renderer process** (Chromium, handles the DOM) and the **main process** (Node.js, has file system / OS access). These two environments cannot share memory. All communication goes through **Inter-Process Communication (IPC)** via a strictly whitelisted bridge defined in `preload.js`.

This document explains why this architecture exists, documents every exposed channel, and walks through the steps needed to add a new one.

---

## When to Use / When Not to Use

| ✅ Use IPC for… | ❌ Never do this… |
|---|---|
| Reading / writing project data (render:*, validate:*) | Call `require()` on Node.js or `lib` modules from renderer JS |
| Triggering file dialogs (open, save, save as) | Expose `ipcRenderer` directly to the renderer via `window` |
| Fetching config options (welcome:getConfig) | Add a channel that is not in the `validChannels` whitelist |
| Sending mutations (businessAssets:updateBusinessAsset) | Pass raw file paths or secrets through IPC messages |

---

## IPC Channel Reference

All channels are declared in `app/src/electron/preload.js`. They are organized into namespace groups by the `contextBridge.exposeInMainWorld()` call that exposes them.

### `window.project` — Project lifecycle events (renderer ← main)

| Channel | Direction | Description |
|---|---|---|
| `project:load` | main → renderer | Sends the full `ISRAProject.toJSON()` JSON string to all tabs on load |
| `project:iteration` | main → renderer | Notifies renderer of new iteration count after a save |

### `window.render` — Read data (renderer → main, returns data)

All `render:*` channels use `ipcRenderer.invoke` (promise-based, returns a value).

| Channel | Returns | Description |
|---|---|---|
| `render:welcome` | JSON | ISRAmeta + ISRAtracking data |
| `render:projectContext` | JSON | ISRAProjectContext data |
| `render:businessAssets` | JSON | Array of BusinessAsset objects |
| `render:supportingAssets` | JSON | Array of SupportingAsset objects + SupportingAssetsDesc |
| `render:risks` | JSON | Array of Risk objects |
| `render:vulnerabilities` | JSON | Array of Vulnerability objects |

### `window.validate` — Write mutations (renderer → main)

`send` channels fire-and-forget; `invoke` channels return a result (e.g. updated entity).

| Channel | Type | Description |
|---|---|---|
| `validate:welcome` | send | Update project-level fields (name, version, organization, classification) |
| `validate:projectContext` | send | Update ISRAProjectContext fields |
| `validate:businessAssets` | send | Bulk update BusinessAsset fields |
| `validate:supportingAssets` | send | Bulk update SupportingAsset fields + desc |
| `validate:vulnerabilities` | invoke | Update Vulnerability fields; returns updated data |
| `validate:risks` | invoke | Update Risk fields; returns updated data |
| `validate:allTabs` | on (listener) | Triggers full validation + save flow from main |

### `window.welcome` — Welcome tab actions

| Channel | Type | Description |
|---|---|---|
| `welcome:addTrackingRow` | invoke | Adds a new ISRAMetaTracking entry |
| `welcome:deleteTrackingRow` | invoke | Deletes tracking rows by iteration numbers |
| `welcome:updateTrackingRow` | send | Updates a single tracking row's fields |
| `welcome:updateProjectNameAndVersionRef` | send | Updates projectName or projectVersion across all referencing entities |
| `welcome:getConfig` | invoke | Returns the organizations list from `config.js` |
| `welcome:updateConfigOrg` | invoke | Updates the organizations list in config |

### `window.businessAssets` — Business Asset CRUD

| Channel | Type | Description |
|---|---|---|
| `businessAssets:addBusinessAsset` | invoke | Creates a new BusinessAsset; returns the new entity |
| `businessAssets:deleteBusinessAsset` | send | Deletes BusinessAsset(s) by ID array |
| `businessAssets:updateBusinessAsset` | send | Updates a single field on a BusinessAsset |

### `window.supportingAssets` — Supporting Asset CRUD

| Channel | Type | Description |
|---|---|---|
| `supportingAssets:addSupportingAsset` | invoke | Creates a new SupportingAsset |
| `supportingAssets:deleteSupportingAsset` | send | Deletes SupportingAsset(s) by ID array |
| `supportingAssets:updateSupportingAsset` | send | Updates a single field |
| `supportingAssets:addBusinessAssetRef` | send | Adds a Business Asset reference to a Supporting Asset |
| `supportingAssets:deleteBusinessAssetRef` | send | Removes Business Asset reference(s) |
| `supportingAssets:updateBusinessAssetRef` | invoke | Updates a Business Asset reference at a given index |

### `window.risks` — Risk CRUD

| Channel | Type | Description |
|---|---|---|
| `risks:addRisk` | invoke | Creates a new Risk |
| `risks:deleteRisk` | send | Deletes Risk(s) by ID array |
| `risks:updateRiskName` | invoke | Updates the risk name or isAutomaticRiskName flag |
| `risks:updateRiskLikelihood` | invoke | Updates a RiskLikelihood field |
| `risks:updateRiskImpact` | invoke | Updates a RiskImpact field |
| `risks:addRiskAttackPath` | invoke | Adds a RiskAttackPath to a Risk |
| `risks:deleteRiskAttackPath` | invoke | Deletes RiskAttackPath(s) |
| `risks:updateRiskAttackPath` | invoke | Updates a field on a RiskAttackPath row |
| `risks:addRiskVulnerabilityRef` | invoke | Adds a Vulnerability reference to an attack path |
| `risks:deleteRiskVulnerabilityRef` | invoke | Removes Vulnerability reference(s) from an attack path |
| `risks:addRiskMitigation` | invoke | Adds a RiskMitigation to a Risk |
| `risks:deleteRiskMitigation` | invoke | Deletes RiskMitigation(s) |
| `risks:updateRiskMitigation` | invoke | Updates a field on a RiskMitigation |
| `risks:updateRiskManagement` | invoke | Updates management decision / residual fields |
| `risks:isRiskExist` | invoke | Returns boolean — whether a riskId exists |
| `risks:expectedBenefitsOptions` | invoke | Returns enum options for expected benefits |
| `risks:mitigationDecisionOptions` | invoke | Returns enum options for mitigation decision |

### `window.vulnerabilities` — Vulnerability CRUD

| Channel | Type | Description |
|---|---|---|
| `vulnerabilities:addVulnerability` | invoke | Creates a new Vulnerability |
| `vulnerabilities:deleteVulnerability` | send | Deletes Vulnerability(ies) by ID array |
| `vulnerabilities:updateVulnerability` | invoke | Updates a single field |
| `vulnerabilities:urlPrompt` | invoke | Opens a URL input dialog; returns the entered URL |
| `vulnerabilities:openURL` | send | Opens a URL in the system browser |
| `vulnerabilities:attachment` | send | Opens file picker for a vulnerability attachment |
| `vulnerabilities:decodeAttachment` | invoke | Decodes a base64 attachment; returns file content |
| `vulnerabilities:fileName` | on (listener) | Receives the filename of an attachment from main |
| `vulnerabilities:isVulnerabilityExist` | invoke | Returns boolean — whether a vulnerabilityId exists |

### `window.projectContext` — Project Context tab

| Channel | Type | Description |
|---|---|---|
| `projectContext:openURL` | send | Opens a URL in the system browser |
| `projectContext:urlPrompt` | invoke | Opens a URL input dialog |
| `projectContext:attachment` | send | Opens file picker for a context attachment |
| `projectContext:decodeAttachment` | invoke | Decodes a base64 attachment |
| `projectContext:fileName` | on (listener) | Receives filename from main |

### `window.import` / `window.api` — Import dialog

| Channel | Type | Description |
|---|---|---|
| `import:sendImports` | send | Sends import data from the import dialog to main |
| `import:submit` | send | (via window.api) Submits the import selection |
| `import:load` | on (via window.api) | Receives parsed import data in the dialog |

### `window.israreport` — PDF Report

| Channel | Type | Description |
|---|---|---|
| `israreport:saveGraph` | send | Sends a chart/graph image from the report tab to main |
| `israreport:fetchedContent` | send | Signals that the report tab has finished loading data (triggers PDF generation) |

### `window.utility`

| Channel | Type | Description |
|---|---|---|
| `utility:openURL` | send | Opens a URL in the default system browser |

---

## Adding a New IPC Channel

Follow these four steps — each is a **Baby Step™** that must be validated before the next.

**Step 1 — Decide the communication pattern:**
- Use `ipcRenderer.invoke` / `ipcMain.handle` if the renderer needs a return value (e.g. "give me the updated Risk object").
- Use `ipcRenderer.send` / `ipcMain.on` if it is fire-and-forget (e.g. "delete this asset").
- Use `ipcRenderer.on` / `win.webContents.send` if main needs to push data to the renderer.

**Step 2 — Add the channel to `preload.js`:**

```js
// app/src/electron/preload.js
contextBridge.exposeInMainWorld('myFeature', {
  doSomething: (id, value) => ipcRenderer.invoke('myFeature:doSomething', id, value),
});
```

If you use `api.send` / `api.receive`, add the new channel name to the `validChannels` whitelist inside those methods.

**Step 3 — Add the `ipcMain` handler in `request-handlers.js`:**

```js
// app/src/electron/request-handlers.js
ipcMain.handle('myFeature:doSomething', async (event, id, value) => {
  // Call lib API — e.g. israProject.getMyEntity(id).someField = value;
  return israProject.getMyEntity(id).properties;  // return plain object, not class instance
});
```

**Step 4 — Call from the renderer tab:**

```js
// app/src/tabs/MyFeature/my-feature.js
const result = await window.myFeature.doSomething(id, value);
```

> ⚠️ Never pass a class instance (e.g. `ISRAProject`) through IPC. Always serialize to a plain object or JSON string first.

---

## Security Constraints

- `nodeIntegration` is **disabled** — renderer scripts cannot call `require()`.
- `contextIsolation` is **enabled** — the preload script runs in an isolated context; `window` in preload ≠ `window` in renderer.
- Only channels explicitly listed in `preload.js` are reachable from the renderer. Any attempt to call an unlisted channel is silently dropped.
- File paths are never passed from renderer to main as user-controlled input. File dialogs are opened by `ipcMain` handlers, which return a path; the renderer never supplies a raw path.

---

## Operational Notes

- All `ipcMain.handle` handlers in `request-handlers.js` operate on the shared `israProject` variable, which is the single live `ISRAProject` instance for the current session.
- If a handler mutates `israProject`, the updated state is not automatically pushed to the renderer — the caller must re-fetch via the appropriate `render:*` channel or use the return value.
- The `validate:allTabs` flow is the save trigger: renderer → main triggers validation → if valid, calls `saveProject()`.

---

## Assumptions Made

- The `validChannels` arrays in `window.api.send` and `window.api.receive` are maintained manually — they are not auto-generated from the handler registrations.
- There is no IPC channel versioning or middleware — all channels are flat strings.

## Open Questions

- Are there any `ipcMain.on` handlers registered outside of `request-handlers.js` (e.g. in `main.js`)?
- Is there a plan to migrate from `ipcRenderer.send` (fire-and-forget) to `ipcRenderer.invoke` (promise-based) for consistency?

## Last Reviewed: 2026-06-24
