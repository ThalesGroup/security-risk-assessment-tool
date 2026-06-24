---
name: run-tests
description: Run the Jest test suite for the lib module with coverage report. Use this to check that all unit and integration tests pass after making changes to lib/src/.
disable-model-invocation: true
---

Run the Jest test suite with coverage for the `lib` module:

```bash
cd lib && npm run test
```

This runs all tests in `lib/test/unit/` and `lib/test/integration/` with coverage output.
