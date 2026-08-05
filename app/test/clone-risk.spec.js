const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

let electronApp;
let page;

test.beforeAll(async () => {
  electronApp = await electron.launch({
    args: [path.join(__dirname, '..')],
  });
  page = await electronApp.firstWindow();
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });
  await electronApp.close();
});

test('Risk clone creates a new selectable risk from checked checkbox', async () => {
  await page.click('.tab-button[data-id="risks"]');
  await page.waitForSelector('#risks__table .tabulator-row');

  const initialCount = await page.evaluate(() => Tabulator.findTable('#risks__table')[0].getData().length);
  const firstCheckbox = page.locator('#risks__table input[name="risks__table__checkboxes"]').first();
  const cloneButton = page.locator('#risks__clone__button');

  await expect(cloneButton).toBeVisible();
  await expect(firstCheckbox).toBeVisible();
  await firstCheckbox.check();
  await cloneButton.click();

  await page.waitForFunction((count) => {
    const table = Tabulator.findTable('#risks__table')[0];
    return table && table.getData().length === count + 1;
  }, initialCount);

  const result = await page.evaluate(() => {
    const table = Tabulator.findTable('#risks__table')[0];
    const data = table.getData();
    const newest = data[data.length - 1];
    const selected = table.getSelectedData()[0];
    return {
      rowCount: data.length,
      newestId: newest?.riskId,
      selectedId: selected?.riskId,
      newestName: newest?.riskName,
      originalName: data[0]?.riskName,
    };
  });

  expect(result.rowCount).toBe(initialCount + 1);
  expect(result.selectedId).toBe(result.newestId);
  expect(result.newestName).toBe(result.originalName);
});

test('Risk clone button does nothing without a checked checkbox', async () => {
  await page.click('.tab-button[data-id="risks"]');
  await page.waitForSelector('#risks__table .tabulator-row');

  const initialCount = await page.evaluate(() => Tabulator.findTable('#risks__table')[0].getData().length);
  const cloneButton = page.locator('#risks__clone__button');

  await expect(cloneButton).toBeVisible();
  await cloneButton.click();

  await page.waitForFunction((count) => {
    const table = Tabulator.findTable('#risks__table')[0];
    return table && table.getData().length === count;
  }, initialCount);

  const rowCount = await page.evaluate(() => Tabulator.findTable('#risks__table')[0].getData().length);
  expect(rowCount).toBe(initialCount);
});
