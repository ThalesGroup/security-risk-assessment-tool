---
feature_key: issue-314
stage: init
artifact: clarifications
last_updated: 2026-06-24
confidence: high
generator: skill-spec-driven-dev@0.2.0
---

# Clarifications — Provide a dedicated flow for risks transferred from a dependency

> Append-only log of questions, assumptions, and blockers. Every `Q-n`
> referenced anywhere else in the workspace MUST have an entry here.

## Q-1 (resolved)
- **Raised by:** init
- **Date:** 2026-06-24
- **Source:** 00-inputs/pm-requirements.md
- **Question:** What workflow, UI modifications, and any data model changes are required for 'risks transferred from a dependency'?
- **Impact:** Critical blocker for designing the flow.
- **Proposed assumption:** Introduce a new flow with simplified fields bypassing threat likelihood/impact computation.
- **Resolution:** "We should have a way to define a risk, transferred from a dependencies, with only its Description, Score and a comment for its origin. This will avoid to import a lot of individual elements." (Confirmed by user on 2026-06-24).
