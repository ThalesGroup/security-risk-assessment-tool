const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const FIXTURE_PATH = path.join(__dirname, '../../doc/resources/sample_overflow.sra');
const fixture = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));
const FIXTURE_PROJECT_NAME = fixture.ISRAmeta.projectName;

test.describe('ISRA report PDF header/footer overflow (#342)', () => {
  let electronApp;

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: [path.join(__dirname, '..')] });
    await electronApp.firstWindow();

    await electronApp.evaluate(({ BrowserWindow }) => {
      const proto = Object.getPrototypeOf(BrowserWindow.getAllWindows()[0].webContents);
      const original = proto.printToPDF;
      global.__capturedPdfOptions = null;
      proto.printToPDF = function (opts) {
        global.__capturedPdfOptions = opts;
        return original.call(this, opts);
      };
    });

    await electronApp.evaluate(({ app, dialog }) => {
      dialog.showSaveDialog = () => Promise.resolve({
        canceled: false,
        filePath: app.getPath('temp') + '/issue-342-test-report.pdf',
      });
      dialog.showMessageBoxSync = () => 0;
    });
  });

  test.afterAll(async () => {
    if (!electronApp) return;
    await Promise.race([
      electronApp.close(),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]).catch(() => {});
    try {
      const proc = electronApp.process();
      if (proc && !proc.killed) proc.kill();
    } catch {
    }
  });

  test('long project name from sample_overflow.sra wraps instead of overflowing the header and footer', async () => {
    const reportWindowPromise = electronApp.waitForEvent('window');

    await electronApp.evaluate(async ({ app, BrowserWindow }, fixturePath) => {
      const handlers = process.mainModule.require(app.getAppPath() + '/src/electron/request-handlers');
      const win = BrowserWindow.getAllWindows()[0];
      await handlers.loadJSONFile(win, fixturePath);
      await handlers.downloadReport(app);
    }, FIXTURE_PATH);

    const reportPage = await reportWindowPromise;
    await reportPage.waitForLoadState('domcontentloaded');
    await electronApp.evaluate(({ app, BrowserWindow }) => {
      const handlers = process.mainModule.require(app.getAppPath() + '/src/electron/request-handlers');
      const reportWin = BrowserWindow.getAllWindows().find((w) => w.webContents.getURL().includes('Report/report.html'));
      handlers.newISRAProject(reportWin, app);
    });

    await expect.poll(async () => {
      return electronApp.evaluate(() => global.__capturedPdfOptions !== null);
    }, { timeout: 15000 }).toBe(true);

    const { headerTemplate, footerTemplate } = await electronApp.evaluate(() => global.__capturedPdfOptions);

    const windowPromise = electronApp.waitForEvent('window');
    await electronApp.evaluate(({ BrowserWindow }) => {
      const win = new BrowserWindow({ show: false });
      win.loadURL('about:blank');
    });
    const page = await windowPromise;

    try {
      await page.setContent(headerTemplate);
      const header = page.locator('header').filter({ hasText: 'ISRA Report' });
      await expect(header).toBeVisible();
      await expect(header).toContainText(FIXTURE_PROJECT_NAME);
      const headerBox = await header.boundingBox();
      const headerContainerBox = await page.locator('div').first().boundingBox();
      expect(headerBox.x).toBeGreaterThanOrEqual(headerContainerBox.x - 1);
      expect(headerBox.x + headerBox.width).toBeLessThanOrEqual(headerContainerBox.x + headerContainerBox.width + 1);
      await expect(header).toHaveCSS('white-space', 'normal');
      await expect(header).toHaveCSS('overflow-wrap', 'anywhere');

      await page.setContent(footerTemplate);
      const footerHeading = page.locator('h1');
      await expect(footerHeading).toBeVisible();
      await expect(footerHeading).toContainText(FIXTURE_PROJECT_NAME);
      const footerBox = await footerHeading.boundingBox();
      const footerContainerBox = await page.locator('div').first().boundingBox();
      expect(footerBox.x).toBeGreaterThanOrEqual(footerContainerBox.x - 1);
      expect(footerBox.x + footerBox.width).toBeLessThanOrEqual(footerContainerBox.x + footerContainerBox.width + 1);
      await expect(footerHeading).toHaveCSS('white-space', 'normal');
      await expect(footerHeading).toHaveCSS('overflow-wrap', 'anywhere');
    } finally {
      if (!page.isClosed()) await page.close();
    }
  });
});