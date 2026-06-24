# Custom Skills Recommendations

Skills are packaged workflows, specialized domain expertise, and reusable scripts loaded directly by Gemini CLI. Creating a project-specific skill under `.gemini/skills/<name>/SKILL.md` makes Gemini highly expert at your codebase's patterns.

## Recommended Custom Skills

### 1. `project-conventions` (Gemini-only)
* **Signal**: Multi-module or monorepo project structures, unique architecture rules, strict file naming rules, or specific libraries.
* **Objective**: Maintain a clear structural blueprint so any AI subagent or interactive prompt adheres strictly to your architecture.
* **Implementation Pattern**:
  ```markdown
  ---
  name: project-conventions
  description: Coding guidelines, monorepo boundaries, naming conventions, and file structures. Loaded automatically during development.
  user-invocable: false
  ---
  # Project Conventions
  - Code organization: All business logic in `lib/`, only Electron UI in `app/`.
  - Naming conventions: CamelCase for classes, kebab-case for directories.
  ```

### 2. `gen-test` (User-only)
* **Signal**: Extensive test folder (`tests/`, `test/`, `__tests__/`), specific framework (Jest, Pytest, Cypress, Vitest).
* **Objective**: Speed up writing high-quality tests by packaging template boilerplates and required imports/mocks.
* **Implementation Pattern**:
  ```markdown
  ---
  name: gen-test
  description: Generates Jest tests for model and handler classes following local mock conventions.
  ---
  # Jest Test Generation Workflow
  When asked to generate a test, use this baseline template:
  ...
  ```

### 3. `api-doc` (Both Invocations)
* **Signal**: Express routes, FastAPI handlers, Django views, controllers directory.
* **Objective**: Automate writing OpenAPI/Swagger specs or markdown endpoint documentation by reading route signatures.
* **Implementation Pattern**:
  ```markdown
  ---
  name: api-doc
  description: Generates or updates OpenAPI/Swagger specs from route controller files.
  ---
  # API Spec Drafting Guideline
  ...
  ```

### 4. `new-component` (User-only)
* **Signal**: Component directories (`components/`, `views/`, `ui/`), React/Vue/Svelte libraries.
* **Objective**: Automate boilerplate component generation along with matching unit test and storybook templates.
* **Implementation Pattern**:
  ```markdown
  ---
  name: new-component
  description: Generates boilerplate frontend components (JSX/TSX, CSS, and storybook files).
  ---
  # Component Boilerplate Workflow
  ...
  ```

---

## How to Suggest Custom Skills

For each recommendation:
1. Explain **why** the skill is high-value for their particular codebase structure.
2. Provide a concrete **SKILL.md boilerplate template** (with YAML frontmatter and key headings).
3. Inform the user they can ask Gemini to automatically write and install the `.skill` or create the `.gemini/skills/` directory.
