# Development Hooks Patterns

Hooks are event-triggered actions executed either before or after a tool runs (such as file modifications or edits). They reside inside `.claude/settings.json` or `.gemini/settings.json`.

## Supported Hook Types

* **`PreToolUse`**: Triggers BEFORE a tool executes. Best used for validation, restriction, blocking sensitive file edits, or requiring user confirmation.
* **`PostToolUse`**: Triggers AFTER a tool executes. Best used for automated formatting, compilation checks, linting, or running affected unit tests.

---

## High-Value Hook Templates

### 1. Auto-Lint with ESLint/Prettier (PostToolUse)
* **Signal**: Project has a linting/formatting config (e.g., `.eslintrc`, `eslint.config.js`, `.prettierrc`, `ruff.toml`).
* **Purpose**: Automatically cleans and standardizes code files immediately after an edit/write action so the AI never produces unformatted or lint-broken code.
* **JSON Pattern (`.gemini/settings.json` or `.claude/settings.json`)**:
  ```json
  {
    "hooks": {
      "PostToolUse": [
        {
          "matcher": "Edit|Write|Replace",
          "hooks": [
            {
              "type": "command",
              "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);const f=(j.tool_input||{}).file_path||'';if(f.endsWith('.js') || f.endsWith('.ts')){const s=require('child_process').spawnSync('npx',['eslint','--fix',f],{shell:true,encoding:'utf8'});if(s.stdout)process.stdout.write(s.stdout);}}catch(e){}});\"",
              "description": "Run ESLint autofix on updated JS/TS files"
            }
          ]
        }
      ]
    }
  }
  ```

### 2. Guard Sensitive Environment Files (PreToolUse)
* **Signal**: Existence of `.env`, `.env.local`, `.env.production` files.
* **Purpose**: Prevent the AI model from reading or writing sensitive credentials or keys.
* **JSON Pattern**:
  ```json
  {
    "hooks": {
      "PreToolUse": [
        {
          "matcher": "Edit|Write|Replace|Read",
          "hooks": [
            {
              "type": "command",
              "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);const f=(j.tool_input||{}).file_path||'';if(f.includes('.env')){process.stderr.write('BLOCKED: Reading/writing env files is prohibited to protect credentials.\\n');process.exit(2);}}catch(e){}});\"",
              "description": "Block all tool actions on sensitive .env files"
            }
          ]
        }
      ]
    }
  }
  ```

### 3. Guard Package Lock Files (PreToolUse)
* **Signal**: Existence of `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock`.
* **Purpose**: Prevent the AI from making raw string replacements in giant lock files which breaks package checksums. Instructs the agent to run proper package managers instead.
* **JSON Pattern**:
  ```json
  {
    "hooks": {
      "PreToolUse": [
        {
          "matcher": "Edit|Write|Replace",
          "hooks": [
            {
              "type": "command",
              "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const j=JSON.parse(d);const f=(j.tool_input||{}).file_path||'';if(f.endsWith('package-lock.json')){process.stderr.write('BLOCKED: Do not edit package-lock.json directly. Run npm install instead.\\n');process.exit(2);}}catch(e){}});\"",
              "description": "Prevent direct edits to package lock files"
            }
          ]
        }
      ]
    }
  }
  ```

---

## Suggesting Hooks
Suggest standardizing hook configurations under `.claude/settings.json` or `.gemini/settings.json` in the root of the project to enforce guardrails and styling automatons seamlessly.
