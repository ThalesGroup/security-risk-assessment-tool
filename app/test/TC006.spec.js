const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

const FIELDS = [
  { editorId: 'project-description__text', text: 'Project description rich text.' },
  { editorId: 'project-objectives__text', text: 'Security project objectives rich text.' },
  { editorId: 'officer-objectives__text', text: 'Security officer objectives rich text.' },
  { editorId: 'assumptions__text', text: 'Assumptions rich text.' },
];

let electronApp;
let window;
let userDataDir;

test.beforeAll(async () => {
  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isra-tc006-'));

  electronApp = await electron.launch({
    args: [`--user-data-dir=${userDataDir}`, path.join(__dirname, '..')],
  });

  window = await electronApp.firstWindow();
  await window.locator('.tab-button[data-id="project-context"]').click();
  await window.waitForURL(/project-context\.html$/);
  await window.waitForSelector('#project-description__text_ifr');
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });
  await electronApp.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
});

test('TC006 - rich text entered in all four fields is displayed', async () => {
  for (const field of FIELDS) {
    const editorBody = window.frameLocator(`#${field.editorId}_ifr`).locator('body');
    await editorBody.fill(field.text);
    await expect(editorBody).toHaveText(field.text);
  }
});