const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

let electronApp;
let window;
let userDataDir;

test.beforeAll(async () => {
  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isra-tlot-'));

  electronApp = await electron.launch({
    args: [
      `--user-data-dir=${userDataDir}`,
      path.join(__dirname, '..'),
    ],
  });

  window = await electronApp.firstWindow();

  await window.waitForSelector(
    '#welcome__isra-meta--targeted-level-of-trust'
  );
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });

  await electronApp.close();

  fs.rmSync(userDataDir, { recursive: true, force: true });
});

test('Targeted Level of Trust dropdown is rendered with the configured options', async () => {
  const dropdown = window.locator(
    '#welcome__isra-meta--targeted-level-of-trust'
  );

  await expect(dropdown.locator('option')).toHaveText([
    'Select...',
    '1',
    '2',
    '3',
    '4',
  ]);
});

test('Targeted Level of Trust is empty by default on a new project', async () => {
  const dropdown = window.locator(
    '#welcome__isra-meta--targeted-level-of-trust'
  );

  await expect(dropdown).toHaveValue('');
});

test('selecting a Targeted Level of Trust value persists when navigating away and back', async () => {
  const dropdown = window.locator(
    '#welcome__isra-meta--targeted-level-of-trust'
  );

  await dropdown.selectOption('2');

  await window.locator(
    '.tab-button[data-id="project-context"]'
  ).click();

  await window.waitForURL(/project-context\.html$/);

  await window.locator(
    '.tab-button[data-id="welcome"]'
  ).click();

  await window.waitForURL(/welcome\.html$/);

  const restoredDropdown = window.locator(
    '#welcome__isra-meta--targeted-level-of-trust'
  );

  await expect(restoredDropdown).toHaveValue('2');
});