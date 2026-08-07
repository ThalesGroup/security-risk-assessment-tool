const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

const XSS_PAYLOAD_FIXTURE = path.join(__dirname, '..', '..', 'doc', 'resources', 'xsspayloadTEST.sra');
const XSS_MARKER = 'Supporting Assets Matrix XSS!';

let electronApp;
let window;
let userDataDir;
let dialogEvents;

test.beforeAll(async () => {
  if (!fs.existsSync(XSS_PAYLOAD_FIXTURE)) {
    throw new Error(`Fixture not found at ${XSS_PAYLOAD_FIXTURE} - place xsspayloadTEST.sra in doc/resources first`);
  }

  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isra-xss-'));

  electronApp = await electron.launch({
    args: [
      `--user-data-dir=${userDataDir}`,
      path.join(__dirname, '..'),
    ],
  });

  window = await electronApp.firstWindow();

  dialogEvents = [];
  window.on('dialog', async (dialog) => {
    dialogEvents.push({ type: dialog.type(), message: dialog.message() });
    await dialog.dismiss().catch(() => {});
  });

  await window.waitForSelector('#welcome__isra-meta--project-name');

  await electronApp.evaluate(({ dialog }, filePath) => {
    dialog.showOpenDialogSync = () => [filePath];
  }, XSS_PAYLOAD_FIXTURE);

  await electronApp.evaluate(({ Menu }) => {
    const fileMenu = Menu.getApplicationMenu().items.find((item) => item.label === 'File');
    const openFileItem = fileMenu.submenu.items.find((item) => item.label === 'Open File');
    openFileItem.click();
  });

  await window.waitForFunction(
    (marker) => document.querySelector('#welcome__isra-meta--project-name')?.value.includes(marker),
    XSS_MARKER,
    { timeout: 15000 },
  );
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });
  await electronApp.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
});

test('Welcome tab: malicious project name and version render as inert text', async () => {
  const projectName = await window.locator('#welcome__isra-meta--project-name').inputValue();
  const projectVersion = await window.locator('#welcome__isra-meta--project-version').inputValue();

  expect(projectName).toContain(XSS_MARKER);
  expect(projectVersion).toContain(XSS_MARKER);
  expect(dialogEvents).toEqual([]);
});

test('Business Assets tab: malicious business asset name renders inert', async () => {
  await window.click('.tab-button[data-id="business-assets"]');
  await window.waitForURL(/business-assets\.html$/);
  await window.waitForSelector('#business-assets__section-table__1 .tabulator-row');

  const rowCount = await window.locator('#business-assets__section-table__1 .tabulator-row').count();
  expect(rowCount).toBeGreaterThan(0);

  const nameValue = await window
    .locator('#business-assets__section-table__1 textarea[name="businessAssetName"]')
    .first()
    .inputValue();
  expect(nameValue).toContain(XSS_MARKER);

  expect(dialogEvents).toEqual([]);
});

test('Supporting Assets tab: main table and business-asset matrix render malicious names inert', async () => {
  await window.click('.tab-button[data-id="supporting-assets"]');
  await window.waitForURL(/supporting-assets\.html$/);
  await window.waitForSelector('#supporting-assets__section-table .tabulator-row');
  await window.waitForSelector('#supporting-asset-business-assets__table tbody tr');

  const mainTableRowCount = await window.locator('#supporting-assets__section-table .tabulator-row').count();
  expect(mainTableRowCount).toBeGreaterThan(0);

  const mainTableText = await window.locator('#supporting-assets__section-table').innerText();
  expect(mainTableText).toContain(XSS_MARKER);

  const matrixText = await window.locator('#supporting-asset-business-assets__table').innerText();
  expect(matrixText).toContain(XSS_MARKER);

  expect(dialogEvents).toEqual([]);
});

test('Risks tab: risk name column and attack-path vulnerability dropdown render inert', async () => {
  await window.click('.tab-button[data-id="risks"]');
  await window.waitForURL(/risks\.html$/);
  await window.waitForSelector('#risks__table .tabulator-row');

  await window.waitForSelector('#risks__vulnerability__attack__path select');

  const riskTableText = await window.locator('#risks__table').innerText();
  expect(riskTableText).toContain(XSS_MARKER);

  const dropdownOptionTexts = await window.locator('#risks__vulnerability__attack__path select option').allInnerTexts();
  expect(dropdownOptionTexts.some((text) => text.includes(XSS_MARKER))).toBe(true);

  expect(dialogEvents).toEqual([]);
});

test('Vulnerabilities tab: vulnerability name renders inert', async () => {
  await window.click('.tab-button[data-id="vulnerabilities"]');
  await window.waitForURL(/vulnerabilities\.html$/);
  await window.waitForSelector('#vulnerabilties__table .tabulator-row');

  const tableText = await window.locator('#vulnerabilties__table').innerText();
  expect(tableText).toContain(XSS_MARKER);
  expect(dialogEvents).toEqual([]);
});

test('Report tab: risk and vulnerability tables render with malicious content inert, and are not empty', async () => {
  await window.click('.tab-button[data-id="isra-report"]');
  await window.waitForURL(/report\.html$/);

  await window.waitForSelector('#risks tbody tr');
  await window.waitForSelector('#vulnerabilities tbody tr');

  const risksRowCount = await window.locator('#risks tbody tr').count();
  const vulnRowCount = await window.locator('#vulnerabilities tbody tr').count();

  expect(risksRowCount).toBeGreaterThan(0);
  expect(vulnRowCount).toBeGreaterThan(0);

  const risksTableText = await window.locator('#risks tbody').innerText();
  const vulnTableText = await window.locator('#vulnerabilities tbody').innerText();
  expect(risksTableText).toContain(XSS_MARKER);
  expect(vulnTableText).toContain(XSS_MARKER);

  expect(dialogEvents).toEqual([]);
});

test('no XSS payload executed at any point across the entire session', async () => {
  expect(dialogEvents, `Unexpected dialog(s) fired: ${JSON.stringify(dialogEvents)}`).toEqual([]);
});