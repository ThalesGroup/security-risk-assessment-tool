# Model Context Protocol (MCP) Server Recommendations

Model Context Protocol (MCP) allows Gemini CLI to connect to external databases, APIs, web browsers, and services directly, expanding its capabilities securely.

## Core MCP Server Integrations

### 1. context7 (Live Documentation Lookup)
* **Signal**: Uses popular web libraries, frameworks (React, Next.js, Express, FastAPI, Django, etc.)
* **Purpose**: Allows Gemini to fetch real-time up-to-date documentation and code patterns for libraries and APIs.
* **Gemini CLI Config Command**:
  ```bash
  gemini mcp add context7 npx -y @context7/mcp-server
  ```

### 2. Playwright (Web Browser Automation & UI Testing)
* **Signal**: Frontend web application, presence of `playwright.config.js`, or requests for automated end-to-end UI testing.
* **Purpose**: Grants the agent a sandboxed headless browser to interact with pages, take screenshots, click buttons, and run UI assertions.
* **Gemini CLI Config Command**:
  ```bash
  gemini mcp add playwright npx -y @modelcontextprotocol/server-playwright
  ```

### 3. GitHub (Git Operations, Issue/PR Management)
* **Signal**: Stored in a GitHub repository (`.git/config` containing github.com)
* **Purpose**: Automates creating issues, submitting PR reviews, editing files, or pulling repository-wide files in GitHub.
* **Gemini CLI Config Command**:
  ```bash
  gemini mcp add github npx -y @modelcontextprotocol/server-github
  ```
  *(Requires configuring `GITHUB_PERSONAL_ACCESS_TOKEN`)*

### 4. Database MCP (PostgreSQL / SQLite / MySQL)
* **Signal**: Presence of Prisma, Knex, raw SQL scripts, sqlite3 files, or PostgreSQL driver.
* **Purpose**: Lets Gemini directly read schema, run read-only queries, and help write precise database migrations.
* **Gemini CLI Config Command (Postgres)**:
  ```bash
  gemini mcp add postgres npx -y @modelcontextprotocol/server-postgres --connection-string "postgresql://user:pass@localhost:5432/dbname"
  ```
* **Gemini CLI Config Command (SQLite)**:
  ```bash
  gemini mcp add sqlite npx -y @modelcontextprotocol/server-sqlite --db-path "./database.sqlite"
  ```

### 5. Memory MCP (Cross-Session Persona Persistence)
* **Signal**: Requests for persistence, learning preferences across many conversations, or long-term recall.
* **Purpose**: Provides a graph database where Gemini can store and query structured long-term knowledge about your preferences.
* **Gemini CLI Config Command**:
  ```bash
  gemini mcp add memory npx -y @modelcontextprotocol/server-memory
  ```

---

## How to Suggest Installation

Always explain to the user:
1. What the recommended MCP server does and why it benefits their stack.
2. The exact CLI command to run to configure the MCP server.
3. Any required environment variables (e.g., API keys, database credentials) that must be set.
