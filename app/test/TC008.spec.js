const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

const TEST_URL = 'https://example.com/isra-test';

let electronApp;
let window;
let userDataDir;

test.beforeAll(async () => {
  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isra-tc008-'));

  electronApp = await electron.launch({
    args: [`--user-data-dir=${userDataDir}`, path.join(__dirname, '..')],
  });

  window = await electronApp.firstWindow();
  await window.locator('.tab-button[data-id="project-context"]').click();
  await window.waitForURL(/project-context\.html$/);
  await window.waitForSelector('#project-description__url--insert');

  await window.evaluate(() => {
    Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
  });

  const promptWindowPromise = electronApp.waitForEvent('window');
  await window.locator('#project-description__url--insert').click();
  const promptWindow = await promptWindowPromise;
  await promptWindow.waitForLoadState();
  await promptWindow.locator('#data').fill(TEST_URL);
  await promptWindow.locator('#ok').click();
  await expect(window.locator('#project-description__url--hyperlink')).toBeVisible();
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });
  await electronApp.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
});

test('TC008 - clicking the Project URL hyperlink opens it in the system browser', async () => {
  await electronApp.evaluate(({ shell }) => {
    global.__israOpenExternalCalls = [];
    shell.openExternal = (url) => {
      global.__israOpenExternalCalls.push(url);
      return Promise.resolve();
    };
  });

  await window.locator('#project-description__url--hyperlink').click();

  await expect
    .poll(() => electronApp.evaluate(() => global.__israOpenExternalCalls))
    .toEqual([TEST_URL]);
});