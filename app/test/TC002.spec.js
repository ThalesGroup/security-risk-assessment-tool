const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

const EXPECTED_TABS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'project-context', label: 'Project Context' },
  { id: 'business-assets', label: 'Business Assets' },
  { id: 'supporting-assets', label: 'Supporting Assets' },
  { id: 'risks', label: 'Risks' },
  { id: 'vulnerabilities', label: 'Vulnerabilities' },
  { id: 'isra-report', label: 'ISRA Report' },
];

let electronApp;
let window;
let userDataDir;
let config;

test.beforeAll(async () => {
  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isra-tc002-'));

  electronApp = await electron.launch({
    args: [
      `--user-data-dir=${userDataDir}`,
      path.join(__dirname, '..'),
    ],
  });

  window = await electronApp.firstWindow();
  await window.waitForSelector('#welcome__isra-meta');

  config = await window.evaluate(() => window.welcome.getConfig());
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });

  await electronApp.close();

  fs.rmSync(userDataDir, { recursive: true, force: true });
});

test('TC002 - all panel buttons are displayed, Welcome is active, and the app version is shown', async () => {
  const tabButtons = window.locator('.tab-button');
  await expect(tabButtons).toHaveText(EXPECTED_TABS.map((t) => t.label));

  for (const tab of EXPECTED_TABS) {
    await expect(window.locator(`.tab-button[data-id="${tab.id}"]`)).toHaveCount(1);
  }

  const welcomeTab = window.locator('.tab-button[data-id="welcome"]');
  await expect(welcomeTab).toHaveClass(/active/);
  await expect(welcomeTab).toHaveCSS('border-bottom-color', 'rgb(0, 0, 0)');

  await expect(window.locator('#details__app-version')).toHaveText(`App Version: ${config.appVersion}`);
});

test('TC002 - Organization dropdown has a red border when unselected', async () => {
  const orgDropdown = window.locator('#welcome__isra-meta--organization');

  await expect(orgDropdown).toHaveValue('');

  const isInvalid = await orgDropdown.evaluate((el) => el.matches(':invalid'));
  expect(isInvalid).toBe(true);

  await expect(orgDropdown).toHaveCSS('border-top-color', 'rgb(255, 0, 0)');
});

test('TC002 - Iteration History table starts with one row for the current user and date', async () => {
  await window.waitForSelector('#welcome__isra-meta-tracking-table .tabulator-row');

  await expect(window.locator('#welcome__isra-meta-tracking-table .tabulator-row')).toHaveCount(1);
  await expect(window.locator('#welcome__isra-meta-tracking-checkbox1')).toBeVisible();

  const today = new Date();
  const expectedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const expectedOfficer = os.userInfo().username;

  const rowData = await window.evaluate(
    () => Tabulator.findTable('#welcome__isra-meta-tracking-table')[0].getData()
  );

  expect(rowData).toHaveLength(1);
  expect(rowData[0].trackingIteration).toBe(1);
  expect(rowData[0].trackingSecurityOfficer).toBe(expectedOfficer);
  expect(rowData[0].trackingDate).toBe(expectedDate);
});

test('TC002 - Purpose and scope, Terminology, and Methodology sections are displayed', async () => {
  const headers = window.locator('#welcome__isra-meta-info > header');
  await expect(headers).toHaveText(['Purpose and scope', 'Terminology', 'Methodology']);
});

test('TC002 - configured classification is displayed at the bottom of the screen', async () => {
  await expect(window.locator('footer')).toHaveText(config.classification);
});