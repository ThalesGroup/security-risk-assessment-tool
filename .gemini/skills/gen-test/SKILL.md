---
name: gen-test
description: Generates Jest tests for ISRA model classes or api handlers following local mock conventions.
---

# Jest Test Generation Guideline

When asked to generate a test:
1. **Unit tests** go to `lib/test/unit/<topic>/<name>.test.js`.
2. **Integration tests** go to `lib/test/integration/<test-N>/<name>.test.js`.
3. Require model files using relative paths (e.g., `../../../src/model/classes/...`).
4. Mock Electron or IPC modules when testing handler endpoints.
