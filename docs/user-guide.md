# ISRA Security Risk Assessment Tool — User Guide

> **Audience:** Security engineers and analysts using the ISRA tool to conduct risk assessments.  
> **Scope:** Step-by-step usage guide, asset criticality guidelines, and likelihood evaluation guidelines.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [Step-by-Step Workflow](#3-step-by-step-workflow)
   - [Step 1 – Project Setup](#step-1--project-setup)
   - [Step 2 – Project Context](#step-2--project-context)
   - [Step 3 – Business Assets & Criticality](#step-3--business-assets--criticality)
   - [Step 4 – Supporting Assets](#step-4--supporting-assets)
   - [Step 5 – Vulnerabilities](#step-5--vulnerabilities)
   - [Step 6 – Risks & Likelihood Evaluation](#step-6--risks--likelihood-evaluation)
   - [Step 7 – Report](#step-7--report)
4. [Asset Criticality Guidelines](#4-asset-criticality-guidelines)
5. [Likelihood Evaluation Guidelines](#5-likelihood-evaluation-guidelines)
6. [Risk Treatment Decisions](#6-risk-treatment-decisions)
7. [Saving & File Formats](#7-saving--file-formats)
8. [Frequently Asked Questions](#8-frequently-asked-questions)

---

## 1. Introduction

ISRA (Information Security Risk Assessment) is a desktop application that guides security engineers through a structured risk assessment following the **ISO/IEC 27005** standard. It produces a documented, traceable risk register stored as an `.sra` file, and can export a PDF report for stakeholder review.

### Key Concepts

| Term | Definition |
|---|---|
| **Business Asset** | What has value from a business perspective (data, services, processes). Also called a *primary asset*. |
| **Supporting Asset** | The technical component where a Business Asset lives or flows through (e.g., a server, database, network link). |
| **Vulnerability** | A specific technical weakness on a Supporting Asset that could be exploited. |
| **Risk** | A threat scenario combining a threat agent, a target, and the vulnerabilities they could exploit. |
| **Inherent Risk Score** | The risk level before any mitigations are applied. |
| **Residual Risk Score** | The risk level after mitigations and the management treatment decision are applied. |

---

## 2. Getting Started

### Launching the Application

Download the appropriate binary for your platform from the [releases page](https://github.com/ThalesGroup/security-risk-assessment-tool/releases) and run `sratool` (Linux/macOS) or `SRATool.exe` (Windows).

### Creating a New Assessment

1. Click **New** on the Welcome tab to start a blank assessment.
2. Enter the project name, organization, and version.
3. Use **File > Save** (or Ctrl+S) to save your work as an `.sra` file at any time.

### Opening an Existing Assessment

Use **File > Open** to open an `.sra` or `.json` file, or drag and drop the file onto the application window.

### Migrating from InfoPath (Legacy XML)

Use **File > Import XML** to import a legacy InfoPath-based ISRA XML file. The tool will automatically migrate the data to the current format.

---

## 3. Step-by-Step Workflow

The assessment follows a linear progression across the UI tabs. Each step builds on the previous one.

```
1. Project Setup → 2. Project Context → 3. Business Assets
        → 4. Supporting Assets → 5. Vulnerabilities
                → 6. Risks & Mitigation → 7. Report
```

---

### Step 1 – Project Setup

**Tab:** Welcome

Fill in the basic project metadata:

| Field | Description | Example |
|---|---|---|
| Project Name | Name of the product or system being assessed | `PaymentGateway v3` |
| Organization | Team or division owning the assessment | `FinTech division` |
| Project Version | Version of the product being assessed | `3.1.0` |
| Classification | Data classification label for this document | `COMPANY CONFIDENTIAL` |

> **Tip:** The *Organization* dropdown is pre-configured by your tool administrator. If your team is missing, ask an administrator to update `lib/src/config.js`.

---

### Step 2 – Project Context

**Tab:** Project Context

Define the scope of the assessment. This section answers: *What is in scope? What are we NOT assessing?*

- **Scope Description:** Describe the product/system being assessed, its purpose, and the deployment environment.
- **Assumptions & Constraints:** Document any assumptions (e.g., "assumes TLS is in place between services") and constraints (e.g., "physical security is out of scope").
- **Trust Boundaries:** Identify where data crosses trust zones — e.g., from a user browser to a backend API, or from an internal service to an external partner.
- **Attachments:** Upload supporting documents such as architecture diagrams, data flow diagrams, or network topology maps.

> **Tip:** A clear, detailed context section is essential. Reviewers use it to judge whether the scope is appropriate and whether important assets or threats have been omitted.

---

### Step 3 – Business Assets & Criticality

**Tab:** Business Assets

Business Assets are *what* you are protecting. Each represents a unit of information or capability that has business value.

**Adding a Business Asset:**
1. Click **Add** to create a new asset.
2. Set the **Name** (e.g., `Customer Payment Data`) and **Type** (Data / Service / Process / Other).
3. Write a clear **Description** explaining what this asset is and why it is important.
4. Score each **Security Characteristic** (see [Asset Criticality Guidelines](#4-asset-criticality-guidelines) below).

**Security Characteristics to Score:**

| Characteristic | Description |
|---|---|
| **Confidentiality** | Protecting information from unauthorised disclosure |
| **Integrity** | Ensuring data is accurate and not tampered with |
| **Availability** | Ensuring the asset is accessible when needed |
| **Authenticity** | Ensuring the asset's identity or origin can be verified |
| **Authorization** | Ensuring only permitted entities can access or modify the asset |
| **Non-repudiation** | Ensuring actions cannot be denied after the fact |

> **See Section 4** for detailed guidance on how to score each characteristic.

---

### Step 4 – Supporting Assets

**Tab:** Supporting Assets

Supporting Assets are the *technical components* that store, process, or transmit your Business Assets. They can have vulnerabilities; Business Assets do not.

**Adding a Supporting Asset:**
1. Click **Add** to create a new asset.
2. Set the **Name** (e.g., `Auth Database`) and **Type** (Application / Hardware / Network / Storage / Cryptographic Key / Other).
3. Write a **Description** identifying where this component sits in the architecture.
4. **Link to Business Assets:** In the Business Asset reference section, select which Business Assets flow through or are stored in this component.

**Examples:**

| Supporting Asset | Type | Linked Business Asset(s) |
|---|---|---|
| `Customer Database (PostgreSQL)` | Storage | Customer Payment Data, Customer PII |
| `Auth Service API (Node.js)` | Application | Authentication Tokens |
| `TLS Certificate` | Cryptographic Key | All Business Assets |
| `Internal Network Segment` | Network | All Business Assets |

> **Tip:** If you are unsure what level of granularity to use, follow the data flow: trace each Business Asset from creation to deletion and add a Supporting Asset for each distinct technical component it passes through.

---

### Step 5 – Vulnerabilities

**Tab:** Vulnerabilities

Vulnerabilities are specific technical weaknesses that could be exploited on a Supporting Asset.

**Adding a Vulnerability:**
1. Click **Add**.
2. Set the **Name** (e.g., `SQL Injection in Login Endpoint`) and **Family** (Design / Configuration / Implementation / Operational / Other).
3. Write a **Description** explaining the weakness.
4. **Link to Supporting Asset(s):** The vulnerability must be associated with at least one Supporting Asset.
5. **Score the Vulnerability:**
   - Enter the **CVSS Vector** (v2 or v3) if a CVE or known scoring exists, or assign a manual score from **0 to 10**.
   - `0` = No risk, `10` = Critical/maximum risk.
6. Optionally add a **tracking ID** (e.g., a Jira ticket reference) and a **URL** for further details.

**Scoring Reference:**

| Score Range | Level | Description |
|---|---|---|
| 0.0 | None | No impact |
| 0.1 – 3.9 | Low | Limited exploitability or impact |
| 4.0 – 6.9 | Medium | Moderate impact, exploitable under specific conditions |
| 7.0 – 8.9 | High | Significant impact, relatively easy to exploit |
| 9.0 – 10.0 | Critical | Severe impact, trivial to exploit |

---

### Step 6 – Risks & Likelihood Evaluation

**Tab:** Risks

A Risk defines a complete threat scenario: *who* attacks, *what* they target, *how* they exploit vulnerabilities, and what the *impact* is.

**Adding a Risk:**
1. Click **Add**.
2. Complete the **Description** sub-section:
   - **Threat Agent** — Who is the attacker? (see Likelihood Guidelines, Section 5)
   - **Threat Verb** — What action do they take? (Disclose / Modify / Deny / Use / Destroy)
   - **Business Asset** — Which Business Asset is targeted?
   - **Supporting Asset** — Which Supporting Asset is the attack surface?
3. Complete the **Evaluation** sub-section:
   - Build one or more **Attack Paths** by selecting vulnerabilities. Within a path, vulnerabilities are combined with **AND** logic (all must be exploited). Multiple paths are combined with **OR** logic (any path succeeds → risk realised).
   - Score the **Likelihood** (see [Section 5](#5-likelihood-evaluation-guidelines)).
4. Complete the **Mitigation** sub-section:
   - Add security controls as **Mitigations**, each with a description, estimated cost, and expected benefit (% reduction).
   - Set the `decision` for each mitigation: **None / Accepted / Done**.
5. Set the **Risk Management Decision**: Accept / Mitigate / Avoid / Transfer.

> **See Section 5** for detailed guidance on likelihood scoring.

---

### Step 7 – Report

**Tab:** Report

The Report tab renders a complete view of all assessment data. When you are satisfied:

1. Click **Download PDF** to export the report.
2. The PDF includes the project header, classification footer, and all tab data.
3. Share the PDF with your security review board or project stakeholders.

---

## 4. Asset Criticality Guidelines

The **security characteristic scores** you assign to Business Assets determine how high the *impact* will be if those assets are compromised. Scoring must be consistent across your team.

### Score Scale

| Score Value | Label | Meaning |
|---|---|---|
| `0` | None | Loss of this characteristic has no business impact |
| `1` | Low | Minor inconvenience; easily recoverable; no regulatory implication |
| `2` | Medium | Noticeable disruption; possible financial or reputational cost |
| `3` | High | Significant disruption; regulatory notification may be required |
| `4` | Critical | Severe or irreversible harm; regulatory action, major financial loss, or safety risk |

### Guidance by Characteristic

#### Confidentiality
Score based on *who should not see this data and what happens if they do*.

| Score | When to apply |
|---|---|
| None (0) | Publicly available data — no harm if disclosed |
| Low (1) | Internal-only data; disclosure is embarrassing but not damaging |
| Medium (2) | Business-sensitive data; competitive disadvantage if leaked |
| High (3) | Personal data (GDPR-regulated); financial records; partner agreements |
| Critical (4) | Passwords, private keys, payment card data (PCI-DSS); health records; government-classified |

#### Integrity
Score based on *what happens if the data is tampered with or corrupted*.

| Score | When to apply |
|---|---|
| None (0) | Data is read-only reference material; tampering has no downstream effect |
| Low (1) | Errors are easily detected and corrected |
| Medium (2) | Tampering causes incorrect business decisions or financial discrepancies |
| High (3) | Corruption causes regulatory or legal exposure, or safety-critical system misbehaviour |
| Critical (4) | Tampering could cause direct financial fraud, physical harm, or critical system failure |

#### Availability
Score based on *how much downtime is tolerable*.

| Score | When to apply |
|---|---|
| None (0) | Asset is archival or non-operational; outage has no impact |
| Low (1) | Hours of downtime acceptable; workarounds exist |
| Medium (2) | Minutes of downtime causes measurable business disruption |
| High (3) | Near-zero downtime required; SLA penalties if unavailable |
| Critical (4) | Any outage causes safety risk, irreversible financial loss, or regulatory breach |

#### Authenticity
Score based on *what happens if the identity or origin of this asset cannot be verified*.

| Score | When to apply |
|---|---|
| None (0) | Identity verification is not required for this asset |
| Low (1) | Impersonation is detectable and correctable |
| Medium (2) | Impersonation could cause incorrect decisions or financial loss |
| High (3) | Impersonation has regulatory or contractual implications |
| Critical (4) | Spoofing could cause direct fraud, safety failure, or unauthorised system access |

#### Authorization
Score based on *the impact of an unauthorized entity accessing or modifying the asset*.

| Score | When to apply |
|---|---|
| None (0) | Asset is public or unrestricted |
| Low (1) | Unauthorized access is detectable with low impact |
| Medium (2) | Unauthorized access causes data leakage or limited control hijacking |
| High (3) | Privilege escalation with significant business impact |
| Critical (4) | Full system or administrative compromise; financial fraud possible |

#### Non-repudiation
Score based on *the importance of being able to prove who performed an action*.

| Score | When to apply |
|---|---|
| None (0) | Audit trail not required |
| Low (1) | Useful but not required; disputes can be resolved other ways |
| Medium (2) | Audit trail is required for internal accountability |
| High (3) | Required for regulatory compliance or contractual proof |
| Critical (4) | Required for legal evidence or financial dispute resolution |

### Practical Examples

| Business Asset | Confidentiality | Integrity | Availability | Notes |
|---|---|---|---|---|
| Public marketing website content | None | Low | Medium | Publicly visible; tampering is embarrassing; downtime hurts marketing |
| Customer personal information (GDPR) | High | High | Medium | Subject to GDPR breach notification; integrity errors cause incorrect profiling |
| Payment card data (PCI-DSS) | Critical | Critical | High | Highest protection required; any breach requires notification and remediation |
| Internal audit logs | Low | Critical | Low | Logs need not be secret but must not be tampered with |
| Cryptographic signing keys | Critical | Critical | High | Disclosure or corruption has irreversible impact on all signed assets |

---

## 5. Likelihood Evaluation Guidelines

The **likelihood score** for a risk reflects how probable it is that the threat agent will successfully carry out the attack. It combines two dimensions: **threat agent capability and motivation**, and **supporting asset exposure**.

### Likelihood Score Scale

| Score | Level | Meaning |
|---|---|---|
| 0 | None | The attack scenario is theoretically possible but there is no realistic mechanism or motivation |
| 1 | Low | An advanced, well-resourced attacker with specific knowledge could succeed, but requires significant effort |
| 2 | Medium | A moderately skilled attacker with access to standard tools could succeed with some effort |
| 3 | High | A low-skill attacker using publicly available tools and techniques could succeed |
| 4 | Critical | Attack is trivially easy; requires almost no skill; automated exploitation tools exist |

### Dimension 1 – Threat Agent Profile

First, characterise the threat agent:

| Threat Agent | Typical Skill Level | Typical Motivation | Default Starting Likelihood |
|---|---|---|---|
| **Script kiddie / automated scanner** | Low | Opportunistic | High (3) |
| **External attacker (targeted)** | Medium–High | Financial, espionage | Medium–High (2–3) |
| **Malicious insider** | Medium (has access) | Financial, revenge, coercion | High (3) |
| **Nation-state / APT** | Very High | Strategic, espionage | Medium (2) — targeted but stealthy |
| **Competitor** | Medium–High | Intellectual property theft | Medium (2) |
| **Accidental insider** | None | Not malicious | Low (1) — probability of triggering unintentionally |
| **Third-party supplier** | Varies | Varies | Depends on access level |

> **Note:** Nation-state actors are technically very capable but tend to attack only high-value targets with stealth, so the likelihood of *any given system* being targeted by an APT is often Medium even though the attacker's skill is Critical.

### Dimension 2 – Attack Surface & Exposure

Adjust the likelihood based on how exposed the Supporting Asset is:

| Exposure Factor | Adjustment |
|---|---|
| Asset is internet-facing with no authentication | +1 |
| Asset is internet-facing with authentication | 0 |
| Asset is internal-network accessible (authenticated) | -1 |
| Asset is internal-network, requires physical access | -2 |
| Asset is air-gapped or offline | -2 (minimum 0) |
| Exploit requires a known public CVE with PoC | +1 |
| Exploit requires proprietary knowledge or reverse engineering | -1 |
| Attack requires social engineering (phishing, vishing) | 0 (human factor — do not reduce) |

### Dimension 3 – Existing Controls

If mitigating controls already exist (before this assessment's proposed mitigations), you may further reduce likelihood:

| Existing Control | Adjustment |
|---|---|
| WAF / IDS / IPS actively monitoring | -1 |
| MFA enforced on all access paths | -1 |
| Network segmentation isolates the asset | -1 |
| Security monitoring with alert response SLA | -1 (max total reduction from controls: -2) |

### Putting It Together — Worked Examples

**Example 1: SQL Injection on a public-facing login page**

| Factor | Value |
|---|---|
| Threat agent | External attacker (automated scanner) → Starting: 3 |
| Asset exposure | Internet-facing, no WAF → +1 |
| CVE / PoC available? | Yes (OWASP Top 10) → +1 |
| Existing controls | None |
| **Final Likelihood** | **min(4, 3+1+1) = Critical (4)** |

---

**Example 2: Privilege escalation on an internal admin console**

| Factor | Value |
|---|---|
| Threat agent | Malicious insider → Starting: 3 |
| Asset exposure | Internal network only → -1 |
| Exploit requires proprietary knowledge? | No → 0 |
| Existing controls | MFA enforced → -1 |
| **Final Likelihood** | **3 - 1 - 1 = Medium (1→ Low–Medium: use 1)** |

---

**Example 3: Private key extraction from an HSM**

| Factor | Value |
|---|---|
| Threat agent | Nation-state APT → Starting: 2 |
| Asset exposure | Air-gapped HSM → -2 |
| Physical access required | Already accounted for above |
| Existing controls | Physical security monitoring → -1 |
| **Final Likelihood** | **max(0, 2 - 2 - 1) = None (0)** |

---

### Documenting Likelihood Decisions

Always document your reasoning in the **Motivation** and **Risk Description** fields so that reviewers can validate and challenge your scores. A likelihood score without justification is not auditable.

---

## 6. Risk Treatment Decisions

Once a risk is scored, you must choose how to treat it:

| Decision | When to Use | Example |
|---|---|---|
| **Mitigate** | When a cost-effective control can reduce the risk to an acceptable level | Add input validation to eliminate SQL injection |
| **Accept** | When the residual risk is within tolerance and mitigation cost exceeds benefit | Accept a low-likelihood, low-impact risk with no cost-effective fix |
| **Avoid** | When the activity causing the risk can be stopped entirely | Remove a feature that processes sensitive data unnecessarily |
| **Transfer** | When the risk can be shifted to another party (insurance, outsourcing, SLA) | Shift liability for payment fraud to a certified payment processor |

> **Tip:** "Accept" must always be a conscious, documented decision — not a default. Document *who* accepted the risk and *why* in the risk description.

---

## 7. Saving & File Formats

### File Formats

| Extension | Format | When Used |
|---|---|---|
| `.sra` | JSON (primary format) | All new assessments |
| `.json` | JSON (legacy) | Imported from older versions |
| `.xml` | InfoPath XML (legacy) | Import only, cannot be saved back to XML |

### Save Behaviour

- Every **save** increments the iteration counter and adds a row to the audit trail (`ISRAtracking`) with the current date.
- The tool validates all fields on save. If required fields are missing or referential integrity is broken, a list of validation errors is displayed. **The file is still saved** but the errors should be resolved before the final review.

### Backup Recommendation

The `.sra` file is the single source of truth. Keep it under version control (e.g., Git) or in a shared drive with versioning enabled.

---

## 8. Frequently Asked Questions

**Q: I deleted a Supporting Asset but now see validation errors about missing references.**  
A: When you delete a Supporting Asset, any Vulnerabilities or Risks that referenced it now have dangling references. Navigate to the Vulnerabilities and Risks tabs and update or remove the invalid references before saving.

**Q: Can multiple engineers work on the same `.sra` file simultaneously?**  
A: No. ISRA is a single-user, offline desktop application. Coordinate with your team to avoid overwriting each other's changes. Consider using Git to manage concurrent edits.

**Q: The risk score seems too low / too high. How is it calculated?**  
A: The risk score combines the attack path vulnerability scores, the likelihood score, and the business asset impact scores. Review the Business Asset security characteristic scores (Section 4) and the likelihood score (Section 5) to ensure they are calibrated correctly.

**Q: When should I use AND vs. OR in an attack path?**  
A: Use **AND** when an attacker must exploit *all* vulnerabilities in a path to succeed (e.g., must bypass authentication AND exploit a code injection). Use **OR** (multiple attack paths) when there are *alternative* routes to achieve the same threat outcome.

**Q: How do I export a PDF report?**  
A: Navigate to the **Report** tab and click **Download PDF**. Ensure all tabs have been completed and saved before generating the final report.

**Q: The tool shows a blank page on macOS.**  
A: This is a known issue ([#299](https://github.com/ThalesGroup/security-risk-assessment-tool/issues/299)) affecting macOS x64 binaries. Check the releases page for a fix or build from source.

---

*This guide covers ISRA version 1.2.0 and later. For developer and architecture documentation, see the [docs/](.) folder.*
