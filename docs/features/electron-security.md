# Electron Security

> **Audience:** Newcomers / onboarding developers  
> **Scope:** Security configuration of the Electron shell — which settings must never change and why, URL scheme constraints, and rich-text sanitization.

---

## Purpose & Scope

Electron applications run Chromium (renderer) + Node.js (main) in the same process tree. Misconfigured Electron apps can expose the host OS to attacks from malicious content rendered in the browser window. ISRA applies a strict security configuration that must be preserved as the application evolves.

This document describes each security setting, explains why it exists, and lists what must never be relaxed.

---

## Core Security Settings

These settings are configured in `app/src/electron/main.js` when creating the `BrowserWindow`:

| Setting | Value | Why |
|---|---|---|
| `nodeIntegration` | `false` | Prevents renderer JS from calling `require()` and accessing Node.js APIs directly. A compromised renderer cannot read the filesystem or execute child processes. |
| `contextIsolation` | `true` | The preload script runs in a separate JavaScript context. `window` in preload ≠ `window` in the page — attackers cannot overwrite preload globals from page scripts. |
| `preload` | `path.join(__dirname, './preload.js')` | Only the explicitly listed `contextBridge` APIs are accessible to the renderer. No other Node APIs leak through. |

These three settings work together as a defence-in-depth stack. Disabling any one of them breaks the security model:

- Disabling `contextIsolation` alone allows renderer scripts to prototype-pollute preload globals.
- Disabling `nodeIntegration` alone (with `contextIsolation: false`) still leaves prototype-pollution vectors.
- Both must remain enabled together.

---

## URL Scheme Whitelist

Vulnerability tracking URIs (the `vulnerabilityTrackingURI` field on `Vulnerability`) accept only a restricted set of URL schemes to prevent `javascript:`, `file:`, or other dangerous schemes from being stored and later opened.

**Allowed schemes** (verified from `CLAUDE.md` and validation layer):

| Scheme | Use case |
|---|---|
| `ftp` | Legacy FTP-based tracking systems |
| `http` | Internal tracking tools |
| `https` | Standard web-based defect trackers |
| `mailto` | Email references |
| `tel` | Phone number references |
| `urn` | Uniform Resource Names |

Any URI that does not start with one of these schemes is rejected by the `isVulnerabilityTrackingURI` validator in `lib/src/model/classes/Vulnerability/validation.js`.

The same scheme restriction applies to URLs opened via `utility:openURL`, `vulnerabilities:openURL`, and `projectContext:openURL` IPC channels — these channels call `shell.openExternal()` in the main process, which opens URLs in the system browser. Passing a `javascript:` or `file:` URI here would execute code or expose local files.

---

## Rich-Text Sanitization

Several fields accept HTML rich text edited via TinyMCE:

- `businessAssetDescription`
- `supportingAssetsDesc`
- `vulnerabilityDescription`
- `threatAgentDetail`, `threatVerbDetail`, `motivationDetail`, `riskManagementDetail`
- `ISRAProjectContext` scope / assumption fields

TinyMCE output is sanitized before being persisted. The sanitization logic lives in `lib/src/api/xml-json/` (the `utility.js` file in that directory). Sanitization removes:

- `<script>` tags and `javascript:` event attributes
- Inline event handlers (`onerror`, `onclick`, etc.)
- Potentially dangerous iframe or object embeds

This prevents stored XSS: if a project file is shared and opened by another user, malicious HTML stored in description fields cannot execute in the renderer.

---

## What Must Never Change

The following constraints are **non-negotiable** and must not be relaxed in any future development:

| Constraint | Risk if relaxed |
|---|---|
| `nodeIntegration: false` | Renderer gains full Node.js access — RCE from any XSS |
| `contextIsolation: true` | Preload APIs become prototype-pollution targets |
| URL scheme whitelist | `javascript:` or `file:` URIs could execute code or exfiltrate files |
| Sanitize all TinyMCE output before persistence | Stored XSS persists across sessions and users |
| Never expose `ipcRenderer` directly on `window` | Bypasses the contextBridge whitelist entirely |
| All new IPC channels must be added to the whitelist in `preload.js` | Unlisted channels are silently dropped — but if the whitelist logic is bypassed, arbitrary channels become accessible |

---

## Operational Notes

- When adding a new rich-text field, ensure TinyMCE output passes through the sanitization utility before being assigned to the model property.
- When adding a new URL field, add the same scheme validation (`isVulnerabilityTrackingURI` or equivalent) before accepting user input.
- The Import dialog (`tabs/Import/`) opens a separate `BrowserWindow` with `modal: true` and the same `preload.js` — it inherits the same security settings.
- The PDF report generation creates an invisible `BrowserWindow` (`show: false`) — this window also uses `preload.js` and must not relax security settings just because it is hidden.
- There are no Content Security Policy headers currently configured for the local `file://` pages — this is an open area for improvement (see Open Questions).

---

## Assumptions Made

- `nodeIntegration: false` and `contextIsolation: true` are set in `main.js` based on the CLAUDE.md security notes and the preload architecture. The exact `webPreferences` object was not read from `main.js` directly.
- TinyMCE sanitization is applied in `lib/src/api/xml-json/utility.js` — the specific sanitization approach (allowlist vs denylist) was not fully reviewed.

## Open Questions

- Is a Content Security Policy (CSP) configured for the `file://` renderer pages? If not, is there a plan to add one?
- Does the sanitization use an allowlist of safe tags, or a denylist of dangerous tags? Allowlist is safer.
- Is `webSecurity` explicitly set to `true` (the default) or has it been disabled anywhere for development convenience?

## Last Reviewed: 2026-06-24
