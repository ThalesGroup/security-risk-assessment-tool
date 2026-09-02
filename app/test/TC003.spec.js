const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

const WELCOME_TAB = '.tab-button[data-id="welcome"]';
const RISKS_TAB = '.tab-button[data-id="risks"]';
const VULNERABILITIES_TAB = '.tab-button[data-id="vulnerabilities"]';
const REPORT_TAB = '.tab-button[data-id="isra-report"]';
const PROJECT_NAME_INPUT = '#welcome__isra-meta--project-name';
const PROJECT_VERSION_INPUT = '#welcome__isra-meta--project-version';
const ORG_SELECT = '#welcome__isra-meta--organization';

const launchIsolatedApp = async (prefix) => {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  const electronApp = await electron.launch({
    args: [`--user-data-dir=${userDataDir}`, path.join(__dirname, '..')],
  });
  const window = await electronApp.firstWindow();
  return { electronApp, window, userDataDir };
};

const closeApp = async (electronApp, userDataDir) => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });
  await electronApp.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
};

test.describe('TC003 - Project Name and Project Version retain entered values', () => {
  let electronApp;
  let window;
  let userDataDir;

  test.beforeAll(async () => {
    ({ electronApp, window, userDataDir } = await launchIsolatedApp('isra-tc003-retain-'));
    await window.waitForSelector(PROJECT_NAME_INPUT);
  });

  test.afterAll(async () => {
    await closeApp(electronApp, userDataDir);
  });

  test('TC003 - typed Project Name and Project Version are shown in their fields', async () => {
    const nameInput = window.locator(PROJECT_NAME_INPUT);
    const versionInput = window.locator(PROJECT_VERSION_INPUT);

    await nameInput.fill('Overflow Test Project');
    await nameInput.press('Tab');
    await versionInput.fill('3.1.4');
    await versionInput.press('Tab');

    await expect(nameInput).toHaveValue('Overflow Test Project');
    await expect(versionInput).toHaveValue('3.1.4');
  });

  test('TC003 - Project Name and Project Version persist when navigating away and back', async () => {
    await window.locator(RISKS_TAB).click();
    await window.waitForURL(/risks\.html$/);
    await window.locator(WELCOME_TAB).click();
    await window.waitForURL(/welcome\.html$/);

    await expect(window.locator(PROJECT_NAME_INPUT)).toHaveValue('Overflow Test Project');
    await expect(window.locator(PROJECT_VERSION_INPUT)).toHaveValue('3.1.4');
  });
});

test.describe('TC003 - Project Version updates the Risks and Vulnerabilities tables', () => {
  let electronApp;
  let window;
  let userDataDir;
  const NEW_VERSION = '2.0.0';

  test.beforeAll(async () => {
    ({ electronApp, window, userDataDir } = await launchIsolatedApp('isra-tc003-version-'));
    await window.waitForSelector(PROJECT_VERSION_INPUT);

    const versionInput = window.locator(PROJECT_VERSION_INPUT);
    await versionInput.fill(NEW_VERSION);
    await versionInput.press('Tab');
  });

  test.afterAll(async () => {
    await closeApp(electronApp, userDataDir);
  });

  test('TC003 - Risks table reflects the updated Project Version', async () => {
    await window.locator(RISKS_TAB).click();
    await window.waitForSelector('#risks__table .tabulator-row');

    await window.waitForFunction((value) => {
      const table = Tabulator.findTable('#risks__table')[0];
      const data = table && table.getData();
      return !!data?.[0] && data[0].projectVersion === value;
    }, NEW_VERSION);
  });

  test('TC003 - Vulnerabilities table reflects the updated Project Version', async () => {
    await window.locator(VULNERABILITIES_TAB).click();
    await window.waitForSelector('#vulnerabilties__table .tabulator-row');

    await window.waitForFunction((value) => {
      const table = Tabulator.findTable('#vulnerabilties__table')[0];
      const data = table && table.getData();
      return !!data?.[0] && data[0].projectVersion === value;
    }, NEW_VERSION);
  });
});

test.describe('TC003 - Project Name updates the footer and ISRA Report', () => {
  let electronApp;
  let window;
  let userDataDir;
  let config;
  const PROJECT_NAME = 'Overflow Test Project';

  test.beforeAll(async () => {
    ({ electronApp, window, userDataDir } = await launchIsolatedApp('isra-tc003-name-'));
    await window.waitForSelector(PROJECT_NAME_INPUT);

    config = await window.evaluate(() => window.welcome.getConfig());

    const nameInput = window.locator(PROJECT_NAME_INPUT);
    await nameInput.fill(PROJECT_NAME);
    await nameInput.press('Tab');
  });

  test.afterAll(async () => {
    await closeApp(electronApp, userDataDir);
  });

  test('TC003 - footer classification label includes the Project Name', async () => {
    const expectedFooter = config.classification.substring(0, config.classification.indexOf('{') + 1)
      + PROJECT_NAME
      + config.classification[config.classification.length - 1];

    await expect(window.locator('footer')).toHaveText(expectedFooter);
  });

  test('TC003 - ISRA Report shows the updated Project Name', async () => {
    await window.locator(REPORT_TAB).click();
    await window.waitForURL(/report\.html$/);

    await expect(window.locator('#name')).toHaveText(PROJECT_NAME);
  });
});

test.describe('TC003 - Organization dropdown and read-only Iteration column', () => {
  let electronApp;
  let window;
  let userDataDir;
  let config;

  test.beforeAll(async () => {
    ({ electronApp, window, userDataDir } = await launchIsolatedApp('isra-tc003-org-'));
    await window.waitForSelector(ORG_SELECT);

    config = await window.evaluate(() => window.welcome.getConfig());
  });

  test.afterAll(async () => {
    await closeApp(electronApp, userDataDir);
  });

  test('TC003 - Organization dropdown lists the configured organizations', async () => {
    const options = window.locator(`${ORG_SELECT} option`);
    await expect(options).toHaveText(['Select...', ...config.organizations]);
  });

  test('TC003 - selecting an Organization removes the invalid red border', async () => {
    const orgDropdown = window.locator(ORG_SELECT);
    await orgDropdown.selectOption(config.organizations[0]);

    await expect(orgDropdown).toHaveValue(config.organizations[0]);

    const isInvalid = await orgDropdown.evaluate((el) => el.matches(':invalid'));
    expect(isInvalid).toBe(false);
  });

  test('TC003 - Iteration cell in the Iteration History table cannot be edited', async () => {
    await window.waitForSelector('#welcome__isra-meta-tracking-table .tabulator-row');

    const iterationCell = window
      .locator('#welcome__isra-meta-tracking-table [tabulator-field="trackingIteration"]')
      .first();

    await expect(iterationCell).toHaveText('1');

    await iterationCell.click();

    await expect(iterationCell).not.toHaveClass(/tabulator-editing/);
    await expect(iterationCell.locator('input')).toHaveCount(0);
    await expect(iterationCell).toHaveText('1');
  });
});