# Risk Dashboard — Feature Brief & Demo Guide

> **AI Hackathon deliverable** for the Security Risk Assessment Tool (ISRA / SRATool)
> A new at-a-glance **Risk Dashboard** tab that turns a dense, data-entry tool into a decision-support tool.

---

## 1. The one-liner

**We added a Risk Dashboard** — the first visual landing view in the entire product — that instantly answers the two questions every stakeholder actually asks: *"How risky is this project?"* and *"How much did this assessment reduce that risk?"*

---

## 2. The problem we solved

The ISRA tool is a rigorous, ISO 27005-aligned risk assessment application. But it was built entirely for **data entry**:

- 7 tabs of forms, tables, and rich-text editors.
- The **only** visualization in the whole product was a single bar chart buried deep inside the Report tab.
- A manager, client, or auditor opening an assessment had **no way to grasp the risk posture at a glance** — they had to scroll through tables of raw scores and mentally aggregate them.

**The pain:** the people who *consume* risk decisions (management, clients, auditors) couldn't read the output, only the analysts who *produced* it could. The tool captured value but didn't *communicate* it.

---

## 3. What we built

A dedicated **Dashboard** tab (now the leftmost tab) that renders a live, visual summary of the open assessment. Every element is computed from data the tool already holds — **nothing new needs to be entered.**

| Component | What it shows | The question it answers |
|---|---|---|
| **6 KPI cards** | Business Assets, Supporting Assets, Vulnerabilities, Total Risks, **Untreated Risks** (highlighted), Mitigation Cost (man-days) | "What's the scale and where are the gaps?" |
| **Residual Risk by Severity** (doughnut) | Count of risks at Critical / High / Medium / Low, in the standard severity colors | "How exposed are we *right now*?" |
| **Risk Reduction: Inherent vs Residual** (grouped bar) | Risk distribution **before vs after** treatment | "What value did this assessment deliver?" ← *the money chart* |
| **Risk Treatment Decisions** (bar) | Accept / Transfer / Mitigate / Untreated breakdown | "Are we actually managing these risks?" |
| **Top 5 Residual Risks** (table) | The 5 highest-scoring residual risks with color-coded severity chips | "What do I need to worry about first?" |
| **Smart empty state** | A friendly prompt when no data is loaded | New users aren't met with a blank screen |

---

## 4. Use cases

1. **Executive / client review.** Open the assessment, click Dashboard, and the sponsor immediately sees the risk posture — no walkthrough of raw tables required.
2. **Assessment "definition of done" check.** The **Untreated Risks** KPI instantly flags risks with no management decision — analysts can see at a glance whether the assessment is complete before sign-off.
3. **Demonstrating ROI of the assessment.** The Inherent-vs-Residual chart visually proves how much risk the treatment plan removed — a concrete justification for the security spend.
4. **Prioritization.** The Top 5 Residual Risks table tells the team where to focus remediation effort first.
5. **Budget conversation.** The Mitigation Cost KPI (in man-days) quantifies the effort behind accepted controls for planning discussions.
6. **Audit & governance.** A single, consistent, screenshot-ready view of risk status for steering committees and audit evidence.

---

## 5. How it benefits the user

- **Comprehension in seconds, not minutes.** Replaces manual scanning and mental math with instant visual aggregation.
- **Speaks to non-experts.** Management and clients can read the dashboard without understanding the ISO 27005 scoring internals.
- **Catches incomplete work.** The Untreated Risks indicator prevents assessments from being signed off with unmanaged risks.
- **Tells the value story.** The before/after chart makes the assessment's impact self-evident.
- **Zero extra effort.** It's derived entirely from existing data — analysts get the dashboard "for free," with no new fields to fill in.
- **Consistent and trustworthy.** It uses the exact same scoring thresholds and severity colors as the rest of the tool, so the numbers always match the Report tab.

---

## 6. Business impact

| Dimension | Impact |
|---|---|
| **Faster decisions** | Stakeholders reach risk decisions in a single screen instead of reading through tabbed forms — shortening review cycles. |
| **Higher assessment quality** | The Untreated Risks signal drives assessments to completion, reducing the chance of unmanaged risk slipping through. |
| **Stronger client perception** | A modern, visual dashboard repositions an internal data-entry tool as a professional decision-support product — directly improving how Thales DIS presents risk work to clients. |
| **Demonstrable ROI** | The inherent-vs-residual view turns "we did a risk assessment" into "we cut critical/high risk by X" — a quantified outcome. |
| **Low delivery risk / cost** | Shipped as a purely additive UI feature: **no changes to the domain model, data schema, file format, or backend** — so it carries near-zero regression risk and no migration cost. |
| **Foundation for AI** | The dashboard is the natural surface for the next phase: AI-suggested risks, mitigations, and auto-generated executive narratives. |

---

## 7. Engineering quality (why the jury can trust it)

This was delivered as a **safe, additive** change:

- **No backend, schema, or file-format changes.** It reuses the existing `project:load` data broadcast — the same mechanism the Report tab uses.
- **Consistent logic.** Severity thresholds mirror the backend's own `calculateResidualRiskLevel` (≤5 Low, ≤10 Medium, ≤15 High, >15 Critical), and colors come from the shared color constants — guaranteeing the dashboard always agrees with the rest of the app.
- **Verified end-to-end:**
  - Backend test suite: **19 suites / 311 tests — all passing** (unchanged baseline, confirming no regression).
  - Dashboard rendering logic verified against **all 4 bundled sample assessments** plus the empty-project case — every KPI cross-checked against an independent recount.
  - The Electron app **boots and runs** with the new tab in place (confirmed live).

**Files added:** `app/src/tabs/Dashboard/` (`dashboard.html`, `renderer.js`, `styles.css`).
**Files touched (tab registration only):** `tabs.js`, `common.js`, `global-styles.css`, and the tab bar in each existing tab.

---

## 8. Live demo script (≈ 3 minutes)

1. **Set the scene (15s).** "ISRA is a rigorous risk assessment tool — but until now, all its value was locked inside data-entry forms. The only chart was buried in a report. Let's fix how risk is *communicated*."
2. **Launch the app** (`cd app && npm start`). It opens on the Welcome tab. *Point out the new leftmost **Dashboard** tab.*
3. **Open a populated assessment:** File → Open → `doc/resources/sample001.sra`.
4. **Click the Dashboard tab.** Let the visuals land for a beat.
5. **Walk the top row (30s):** "Six KPIs — scale of the assessment, and crucially, how many risks are still **untreated**."
6. **The money chart (30s):** point at *Inherent vs Residual* — "This is the value of the assessment, made visible: the risk we started with versus what remains after the treatment plan."
7. **Severity doughnut + Top 5 (20s):** "Where we stand today, and the five risks to tackle first."
8. **Show robustness (15s):** start a new/empty project → the Dashboard shows a clean guiding empty state, not a broken screen.
9. **Close on the roadmap (20s):** "This dashboard is also the launchpad for AI — next, Claude suggests the risks, the mitigations, and writes the executive summary."

---

## 9. Roadmap — where this goes next

- **AI Risk Authoring (the headline next step):** "Suggest Risks" from the project's assets, AI-drafted vulnerability/CVE entries, mitigation suggestions, and an auto-generated executive report narrative.
- **Interactivity:** click a Top-5 risk to jump straight to it on the Risks tab.
- **Export:** one-click export of the dashboard as an image/PDF for slide decks and audit packs.
- **Polish:** dark mode, wider responsive layouts, and a global Ctrl+K search across assets and risks.

---

*Prepared for the AI Hackathon jury demo — Security Risk Assessment Tool (ISRA / SRATool), v1.3.0-alpha01.*
