---
name: codebase-simplification-analysis
description: Performs a comprehensive codebase analysis to identify and refine overly complex, redundant, or poorly structured files using parallel background agents. Use when the user requests codebase simplification, refactoring analysis, code complexity auditing, or general code cleanup.
---

# Codebase Simplification Analysis (ultrathink)

You are a code simplification specialist performing a comprehensive codebase complexity analysis. Your task is to identify ALL files that could benefit from simplification, rate their complexity, queue them, and refine them systematically using parallel background agents.

## Core Rules & Constraints
* **Functionality Preservation**: **NEVER** change the external behavior or functionality of the code. All original features, public signatures, side effects, and behaviors must remain exactly intact.
* **Scope Limits**: Skip generated files, compiled/build outputs, vendored external dependencies, and configuration files.
* **Uncertainty**: If you are uncertain about whether a simplification might break something (such as complex async logic, reflection, prototype manipulation), **skip it**. Clarity is valued over brevity, but safety is valued above all.

---

## Execution Workflow

### Phase 1: Codebase Discovery
Fetch every source file in the codebase. Run multiple parallel glob search patterns to ensure complete coverage across all potential languages:

#### Parallel Glob Patterns to Run:
* `**/*.ts` — TypeScript files
* `**/*.tsx` — React TypeScript components
* `**/*.js` — JavaScript files
* `**/*.jsx` — React JavaScript components
* `**/*.py` — Python files
* `**/*.go` — Go files
* `**/*.rs` — Rust source files
* `**/*.vue` — Vue components
* `**/*.svelte` — Svelte components

#### Standard Excludes:
`node_modules/**`, `dist/**`, `build/**`, `.next/**`, `coverage/**`, `*.min.*`, `*.d.ts`, `_generated/**`, `.git/**`

---

### Phase 2: Deep Analysis (ultrathink)

#### Guards and Thresholds:
* **0 files found**: Report `"No source files found"` and terminate the workflow.
* **>200 files found**: Report the exact file count to the user and request confirmation before proceeding to prevent context exhaustion.
* **>500 files found**: Advise the user to scope the analysis to a specific subdirectory instead (e.g. `src/` or `lib/`).

For every allowed source file discovered, read its contents and perform an **extended thinking** analysis against the following **Simplification Criteria**:

| Criterion | What to Look For |
|-----------|------------------|
| **Unnecessary Complexity** | Deep nesting (>3 levels), overly clever/convoluted solutions, manual implementations of native standard library functions. |
| **Redundant Code** | Duplicate logic, unused variables/imports, dead code, unreachable paths. |
| **Poor Clarity** | Unclear, single-letter, or confusing variable names, missing essential comments or excessive/outdated commentary, dense one-liners. |
| **Anti-patterns** | Nested ternary operators, callback hell, massive "god" functions (>50 lines), excessive global state. |
| **Inconsistent Style** | Mixed syntax conventions (arrow vs traditional function, var vs let), inconsistent import styles, irregular formatting. |
| **Over-abstraction** | Premature optimization, excessive indirection, unnecessary wrapper classes or interfaces. |

#### Scoring Potential:
Rate each file from **0 to 10** on simplification potential:
* **10**: Extremely complex/redundant, critical candidate for refactoring.
* **5**: Moderate candidate, could benefit from style cleaning or flattening.
* **0**: Pristine, simple, and clean code needing no changes.

---

### Phase 3: Create Work Queue & Present Plan
Use the task-creation mechanisms (e.g. `TaskCreate` or equivalent system workflow) to build a prioritized work queue of files needing simplification (score >= 5).

Format each task entry as follows:
* **Subject**: `Simplify {filepath}`
* **Description**: `Score: {N}/10 | Reason: {brief reason detailing criteria matched}`
* **Active Form**: `Simplifying {filename}`

#### Plan Presentation & Confirmation (Mandatory Checkpoint)
Before starting Phase 4 (Parallel Simplification), you **MUST** present the prioritized work queue to the user as a clear, formatted table/list (the Plan).
* Detail each candidate file, its simplification score, and the specific reasons/areas for improvement.
* **Stop and ask the user for explicit approval** to proceed with execution using the `ask_user` tool or a direct confirmation question.
* Do **NOT** start any subagents or make any code modifications until the user explicitly confirms and approves the plan.
* Allow the user to remove specific files or customize the scope of the simplification before proceeding.

---

### Phase 4: Parallel Simplification (After User Approval)
Once (and only after) the user has explicitly confirmed and approved the plan, proceed with simplification. For each file in the approved work queue, launch a background subagent (such as `generalist`) concurrently:

```markdown
Launch background subagent:
- type: "generalist" (or "general-purpose")
- prompt: "Simplify the file at {filepath}.

Read the file first, then apply these refinements:
- Reduce nesting and complexity (flatten nested if-statements).
- Eliminate redundant code, dead paths, and unused imports.
- Improve naming clarity of variables, parameters, and helper routines.
- Remove nested ternary operators (convert to clean if-else or switch structures).
- Strictly follow local project conventions and styling.
- Prioritize code readability and structural clarity over extreme brevity.

Preserve ALL public-facing functionality, API contracts, and tests.
Use the most targeted, surgical edit tool available (like 'replace') to apply modifications.

Report: [detailed list of changes made] or [no changes needed]"
```

#### Concurrency Limit:
* Launch up to **5 agents in parallel**.
* Poll agent statuses. As background agents complete and slots free up, launch the next tasks from the queue.

---

### Phase 5: Verification & Report
After all background subagents have fully executed, perform the final reporting:

1. **Verify**: Run the local test suites and linters to verify that no refactoring introduced regressions.
2. **Task Completion**: Update all task statuses in the queue to completed.
3. **Summary Report**: Output a clean markdown summary covering:
   * Total number of files analyzed.
   * Total number of files simplified.
   * Key structural and stylistic changes made across the project.
   * Any files that were skipped or failed to simplify, along with the reasoning (e.g., complexity risk, functionality preservation).
