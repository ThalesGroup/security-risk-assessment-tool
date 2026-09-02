const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

let electronApp;
let window;
let userDataDir;

test.beforeAll(async () => {
  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isra-tc001-'));

  electronApp = await electron.launch({
    args: [
      `--user-data-dir=${userDataDir}`,
      path.join(__dirname, '..'),
    ],
  });

  window = await electronApp.firstWindow();
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });

  await electronApp.close();

  fs.rmSync(userDataDir, { recursive: true, force: true });
});

test('TC001 - application launches and displays the Welcome screen', async () => {
  await expect(window).toHaveURL(/welcome\.html$/);

  const welcomeTab = window.locator('.tab-button[data-id="welcome"]');
  await expect(welcomeTab).toHaveClass(/active/);

  await window.waitForSelector('#welcome__isra-meta');
  await expect(window.locator('#welcome__isra-meta')).toBeVisible();
});