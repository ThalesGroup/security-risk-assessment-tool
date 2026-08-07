const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

const WELCOME_TAB = '.tab-button[data-id="welcome"]';
const RISKS_TAB = '.tab-button[data-id="risks"]';
const PROJECT_VERSION_INPUT = '#welcome__isra-meta--project-version';
const SORT_SELECT = '#sort-risk';

const CHECKBOX_SELECTOR = '#risks__table input[name="risks__table__checkboxes"]';
const CLONE_BUTTON = '#risks__clone__button';

const launchIsolatedApp = async (prefix) => {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const electronApp = await electron.launch({
    args: [`--user-data-dir=${userDataDir}`, path.join(__dirname, '..')],
  });
  const page = await electronApp.firstWindow();
  return { electronApp, page, userDataDir };
};

const closeApp = async (electronApp, userDataDir) => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });
  await electronApp.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
};

const cloneFirstRow = async (page) => {
  const initialCount = await page.evaluate(() => Tabulator.findTable('#risks__table')[0].getData().length);
  const firstCheckbox = page.locator(CHECKBOX_SELECTOR).first();
  const cloneButton = page.locator(CLONE_BUTTON);
  await expect(cloneButton).toBeVisible();
  await expect(firstCheckbox).toBeVisible();
  await firstCheckbox.check();
  await cloneButton.click();
  await page.waitForFunction((count) => {
    const table = Tabulator.findTable('#risks__table')[0];
    return table && table.getData().length === count + 1;
  }, initialCount);
  return initialCount;
};

test.describe('Risk clone - checkbox gating', () => {
  let electronApp;
  let page;
  let userDataDir;

  test.beforeAll(async () => {
    ({ electronApp, page, userDataDir } = await launchIsolatedApp('isra-clone-'));
    await page.click(RISKS_TAB);
    await page.waitForSelector('#risks__table .tabulator-row');
  });

  test.afterAll(async () => {
    await closeApp(electronApp, userDataDir);
  });

  test('Risk clone creates a new selectable risk from checked checkbox', async () => {
    const initialCount = await cloneFirstRow(page);
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
    const initialCount = await page.evaluate(() => Tabulator.findTable('#risks__table')[0].getData().length);
    const cloneButton = page.locator(CLONE_BUTTON);
    await expect(cloneButton).toBeVisible();
    await cloneButton.click();
    await page.waitForFunction((count) => {
      const table = Tabulator.findTable('#risks__table')[0];
      return table && table.getData().length === count;
    }, initialCount);
    const rowCount = await page.evaluate(() => Tabulator.findTable('#risks__table')[0].getData().length);
    expect(rowCount).toBe(initialCount);
  });
});

test.describe('Risk clone - project version', () => {
  let electronApp;
  let page;
  let userDataDir;

  test.beforeAll(async () => {
    ({ electronApp, page, userDataDir } = await launchIsolatedApp('isra-version-'));
  });

  test.afterAll(async () => {
    await closeApp(electronApp, userDataDir);
  });

  test('Cloned risk reflects the current project version, not the stale value it inherited', async () => {
    const firstVersion = '1.0.0';
    const currentVersion = '2.0.0';

    await page.click(WELCOME_TAB);
    await page.waitForSelector(PROJECT_VERSION_INPUT);
    const versionInput = page.locator(PROJECT_VERSION_INPUT);

    await versionInput.fill(firstVersion);
    await versionInput.press('Tab');

    await page.click(RISKS_TAB);
    await page.waitForSelector('#risks__table .tabulator-row');
    await page.waitForFunction((value) => {
      const table = Tabulator.findTable('#risks__table')[0];
      const data = table && table.getData();
      return !!data?.[0] && data[0].projectVersion === value;
    }, firstVersion);

    await page.click(WELCOME_TAB);
    await page.waitForSelector(PROJECT_VERSION_INPUT);
    await versionInput.fill(currentVersion);
    await versionInput.press('Tab');

    await page.click(RISKS_TAB);
    await page.waitForSelector('#risks__table .tabulator-row');

    const beforeClone = await page.evaluate(() => {
      const table = Tabulator.findTable('#risks__table')[0];
      const data = table.getData();
      return { sourceVersion: data[0]?.projectVersion };
    });

    expect(beforeClone.sourceVersion).toBe(firstVersion);

    await cloneFirstRow(page);

    const clonedVersion = await page.evaluate(() => {
      const table = Tabulator.findTable('#risks__table')[0];
      const data = table.getData();
      return data[data.length - 1]?.projectVersion;
    });

    expect(clonedVersion).toBe(currentVersion);
  });
});

test.describe('Risk clone - sort setting', () => {
  let electronApp;
  let page;
  let userDataDir;

  test.beforeAll(async () => {
    ({ electronApp, page, userDataDir } = await launchIsolatedApp('isra-sort-'));
    await page.click(RISKS_TAB);
    await page.waitForSelector('#risks__table .tabulator-row');
  });

  test.afterAll(async () => {
    await closeApp(electronApp, userDataDir);
  });

  test('Risk clone does not change the active sort setting', async () => {
    await page.locator(SORT_SELECT).selectOption('id-desc');
    await page.waitForFunction(() => sessionStorage.getItem('risksSort') === 'id-desc');

    const readSortState = () => page.evaluate(() => {
      const table = Tabulator.findTable('#risks__table')[0];
      return {
        sortSelectValue: document.getElementById('sort-risk').value,
        storedSort: sessionStorage.getItem('risksSort'),
        sorters: table.getSorters().map(({ field, dir }) => ({ field, dir })),
      };
    });

    const before = await readSortState();
    expect(before).toEqual({
      sortSelectValue: 'id-desc',
      storedSort: 'id-desc',
      sorters: [{ field: 'riskId', dir: 'desc' }],
    });

    await cloneFirstRow(page);

    const after = await readSortState();
    expect(after).toEqual(before);
  });
});