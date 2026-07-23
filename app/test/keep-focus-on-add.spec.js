const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');

test.describe('Issue #275 - focus moves to newly added item', () => {
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

  test('Risks tab: clicking Add selects the newest risk', async () => {
    await page.click('.tab-button[data-id="risks"]');
    await page.waitForSelector('#risks__table .tabulator-row');

    const addButton = page.locator('#risks .add-delete-container button').first();

    await addButton.click();
    await page.waitForFunction(() => Tabulator.findTable('#risks__table')[0].getData().length === 2);

    await addButton.click();
    await page.waitForFunction(() => Tabulator.findTable('#risks__table')[0].getData().length === 3);

    const result = await page.evaluate(() => {
      const table = Tabulator.findTable('#risks__table')[0];
      const allData = table.getData();
      const newest = allData[allData.length - 1];
      const selectedData = table.getSelectedData()[0];
      const selectedRow = table.getSelectedRows()[0];
      return {
        newestId: newest && newest.riskId,
        selectedId: selectedData && selectedData.riskId,
        selectedRowHasHighlightClass: !!selectedRow && selectedRow.getElement().classList.contains('tabulator-selected'),
      };
    });

    expect(result.selectedId).toBe(result.newestId);
    expect(result.selectedRowHasHighlightClass).toBe(true);
  });

  test('Vulnerabilities tab: clicking Add selects the newest vulnerability', async () => {
    await page.click('.tab-button[data-id="vulnerabilities"]');
    await page.waitForSelector('#vulnerabilties__table .tabulator-row');

    const addButton = page.locator('#vulnerabilities .add-delete-container button').first();

    await addButton.click();
    await page.waitForFunction(() => Tabulator.findTable('#vulnerabilties__table')[0].getData().length === 2);

    await addButton.click();
    await page.waitForFunction(() => Tabulator.findTable('#vulnerabilties__table')[0].getData().length === 3);

    const result = await page.evaluate(() => {
      const table = Tabulator.findTable('#vulnerabilties__table')[0];
      const allData = table.getData();
      const newest = allData[allData.length - 1];
      const selectedData = table.getSelectedData()[0];
      const selectedRow = table.getSelectedRows()[0];
      const headerEl = document.querySelector('#vulnerabilityId');
      return {
        newestId: newest && newest.vulnerabilityId,
        selectedId: selectedData && selectedData.vulnerabilityId,
        selectedRowHasHighlightClass: !!selectedRow && selectedRow.getElement().classList.contains('tabulator-selected'),
      };
    });

    expect(result.selectedId).toBe(result.newestId);
    expect(result.selectedRowHasHighlightClass).toBe(true);
  });
});