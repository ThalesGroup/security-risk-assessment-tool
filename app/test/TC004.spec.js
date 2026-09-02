const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

const TRACKING_TABLE = '#welcome__isra-meta-tracking-table';
const ADD_BUTTON = '#welcome__isra-meta-tracking--add';
const DELETE_BUTTON = '#welcome__isra-meta-tracking--delete';
const CHECKBOX_NAME = 'welcome__isra-meta-tracking-checkbox';
const RICH_TEXT_MODAL = '#global-rich-text-modal';
const RICH_TEXT_MODAL_CONFIRM = '#global-rich-text-modal__confirm';
const RICH_TEXT_EDITOR_FRAME = '#global-rich-text-modal__editor_ifr';

const SECURITY_OFFICER = 'J. Tan';
const TRACKING_DATE = '2026-01-15';
const DESCRIPTION = 'Initial iteration description';

let electronApp;
let window;
let userDataDir;

test.beforeAll(async () => {
  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isra-tc004-'));

  electronApp = await electron.launch({
    args: [
      `--user-data-dir=${userDataDir}`,
      path.join(__dirname, '..'),
    ],
  });

  window = await electronApp.firstWindow();
  await window.waitForSelector(`${TRACKING_TABLE} .tabulator-row`);
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });

  await electronApp.close();

  fs.rmSync(userDataDir, { recursive: true, force: true });
});

test('TC004 - Description, Security Officer and Date can be entered on the first row', async () => {
  const officerCell = window
    .locator(`${TRACKING_TABLE} .tabulator-cell[tabulator-field="trackingSecurityOfficer"]`)
    .first();
  await officerCell.click();
  await officerCell.locator('input').fill(SECURITY_OFFICER);
  await officerCell.locator('input').press('Enter');
  await expect(officerCell).toHaveText(SECURITY_OFFICER);

  const dateCell = window
    .locator(`${TRACKING_TABLE} .tabulator-cell[tabulator-field="trackingDate"]`)
    .first();
  await dateCell.click();
  await dateCell.locator('input').fill(TRACKING_DATE);
  await dateCell.locator('input').press('Enter');
  await expect(dateCell).toHaveText(TRACKING_DATE);

  const commentPreview = window
    .locator(`${TRACKING_TABLE} .tabulator-cell[tabulator-field="trackingComment"] .rich-text-cell-preview`)
    .first();
  await commentPreview.click();

  await expect(window.locator(RICH_TEXT_MODAL)).toBeVisible();

  const editorBody = window.frameLocator(RICH_TEXT_EDITOR_FRAME).locator('body');
  await editorBody.fill(DESCRIPTION);
  await window.locator(RICH_TEXT_MODAL_CONFIRM).click();

  await expect(window.locator(RICH_TEXT_MODAL)).toBeHidden();
  await expect(commentPreview).toHaveText(DESCRIPTION);
});

test('TC004 - Add creates a second row with Iteration 2', async () => {
  await window.locator(ADD_BUTTON).click();

  await expect(window.locator(`${TRACKING_TABLE} .tabulator-row`)).toHaveCount(2);

  const rowData = await window.evaluate(
    () => Tabulator.findTable('#welcome__isra-meta-tracking-table')[0].getData()
  );
  expect(rowData).toHaveLength(2);
  expect(rowData[1].trackingIteration).toBe(2);

  await expect(window.locator(`input[name="${CHECKBOX_NAME}"]`)).toHaveCount(2);
});

test('TC004 - Delete removes the checked second row and keeps the first', async () => {
  await window.locator(`input[name="${CHECKBOX_NAME}"]`).last().check();
  await window.locator(DELETE_BUTTON).click();

  await expect(window.locator(`${TRACKING_TABLE} .tabulator-row`)).toHaveCount(1);

  const rowData = await window.evaluate(
    () => Tabulator.findTable('#welcome__isra-meta-tracking-table')[0].getData()
  );
  expect(rowData).toHaveLength(1);
  expect(rowData[0].trackingIteration).toBe(1);
  expect(rowData[0].trackingSecurityOfficer).toBe(SECURITY_OFFICER);
});