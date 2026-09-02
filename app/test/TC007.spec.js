const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

const TEST_URL = 'https://example.com/isra-test';

let electronApp;
let window;
let userDataDir;

test.beforeAll(async () => {
  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isra-tc007-'));

  electronApp = await electron.launch({
    args: [`--user-data-dir=${userDataDir}`, path.join(__dirname, '..')],
  });

  window = await electronApp.firstWindow();
  await window.locator('.tab-button[data-id="project-context"]').click();
  await window.waitForURL(/project-context\.html$/);
  await window.waitForSelector('#project-description__url--insert');
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });
  await electronApp.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
});

test('TC007 - inserting a URL through the modal displays it as the Project URL hyperlink', async () => {
  const promptWindowPromise = electronApp.waitForEvent('window');
  await window.locator('#project-description__url--insert').click();
  const promptWindow = await promptWindowPromise;
  await promptWindow.waitForLoadState();

  await promptWindow.locator('#data').fill(TEST_URL);
  await promptWindow.locator('#ok').click();

  const hyperlink = window.locator('#project-description__url--hyperlink');
  await expect(hyperlink).toBeVisible();
  await expect(hyperlink).toHaveText(TEST_URL);
  await expect(hyperlink).toHaveAttribute('href', TEST_URL);
  await expect(window.locator('#project-description__url--insert')).toBeHidden();
});