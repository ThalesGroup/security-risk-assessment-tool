---
feature_key: issue-314
stage: implement
artifact: readme
last_updated: 2026-06-24
confidence: high
generator: skill-spec-driven-dev@0.2.0
---

# issue-314 — Provide a dedicated flow for risks transferred from a dependency

Workspace for the skill-spec-driven-dev skill. This directory is the single source of
truth for this feature's specs, tests, and implementation record.

## Quick links

- [Inputs manifest](00-inputs/inputs.yaml)
- [Context manifest](00-inputs/context-manifest.md)
- [Low-level design](01-design/lld.md) ✅
- [Acceptance criteria](01-design/acceptance.md) ✅
- [Implementation plan](01-design/plan.md) ✅
- [Risks](01-design/risks.md) ✅
- [Test spec](02-tests/tests.md) ✅ · [Test matrix (CSV)](02-tests/test-matrix.csv) ✅
- [Implementation log](03-impl/impl-log.md) ✅ · [Verify report](03-impl/verify-report.md) ✅
- [Traceability matrix](traceability.md) ✅
- [Clarifications](clarifications.md) ✅
- [Machine state (status.json)](status.json)

## Summary

This feature provides a dedicated flow for risks transferred from a dependency. Rather than requiring full mappings to assets, threat agents, and likelihood/impact metrics, users can define these risks with only a Description, direct Score, and Comment for its origin (dependency origin).

## Current state

- **Stage:** implement-complete ✅
- **Open clarifications (blockers):** 0
- **Open clarifications (advisory):** 0
- **Open risks:** 2 (Both mitigated!)

## How to continue

- To progress to the next stage, run the matching capability from the
  `skill-spec-driven-dev` skill (`init` → `design` → `tests` → `implement`), or run
  `pipeline` to chain them with human checkpoints.
- To check traceability health at any time, run `lint`.
- Working tree changes produced by `implement` are NEVER auto-committed.
  Review the diff before committing.
