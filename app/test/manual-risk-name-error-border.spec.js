const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

let electronApp;
let window;
let userDataDir;

test.beforeAll(async () => {
  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isra-manual-riskname-'));

  electronApp = await electron.launch({
    args: [
      `--user-data-dir=${userDataDir}`,
      path.join(__dirname, '..'),
    ],
  });

  window = await electronApp.firstWindow();

  await window.click('.tab-button[data-id="risks"]');
  await window.waitForURL(/risks\.html$/);
  await window.waitForSelector('#risks__table .tabulator-row');
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });
  await electronApp.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
});

test('switching to manual risk name with an empty value shows a red error border', async () => {
  await window.click('#riskName button');
  await window.waitForSelector('#risk__manual__riskName', { state: 'visible' });

  const manualInput = window.locator('#risk__manual__riskName input');
  await expect(manualInput).toHaveValue('');

  const borderStyle = await manualInput.evaluate((el) => getComputedStyle(el).borderStyle);
  expect(borderStyle).toBe('solid');
});

test('typing a non-empty manual risk name clears the red error border', async () => {
  const manualInput = window.locator('#risk__manual__riskName input');

  await manualInput.fill('a random risk');
  await manualInput.blur();
  await window.waitForFunction(() => {
    const input = document.querySelector('#risk__manual__riskName input');
    return input && getComputedStyle(input).borderStyle === 'none';
  });

  const borderStyle = await manualInput.evaluate((el) => getComputedStyle(el).borderStyle);
  expect(borderStyle).toBe('none');
});

test('clearing the manual risk name back to empty reinstates the red error border', async () => {
  const manualInput = window.locator('#risk__manual__riskName input');

  await manualInput.fill('');
  await manualInput.blur();
  await window.waitForFunction(() => {
    const input = document.querySelector('#risk__manual__riskName input');
    return input && getComputedStyle(input).borderStyle === 'solid';
  });

  const borderStyle = await manualInput.evaluate((el) => getComputedStyle(el).borderStyle);
  expect(borderStyle).toBe('solid');

  const borderColor = await manualInput.evaluate((el) => getComputedStyle(el).borderColor);
  expect(borderColor).toBe('rgb(255, 0, 0)');
});