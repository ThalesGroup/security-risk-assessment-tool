const { test, expect, _electron: electron } = require('@playwright/test');
const path = require('path');
const os = require('os');
const fs = require('fs');

const projectContextSchema = require('../../lib/src/model/schema/json-schema')
  .properties.ProjectContext.properties;

const EXPECTED_TABS = [
  { id: 'welcome', label: 'Welcome' },
  { id: 'project-context', label: 'Project Context' },
  { id: 'business-assets', label: 'Business Assets' },
  { id: 'supporting-assets', label: 'Supporting Assets' },
  { id: 'risks', label: 'Risks' },
  { id: 'vulnerabilities', label: 'Vulnerabilities' },
  { id: 'isra-report', label: 'ISRA Report' },
];

const TOOLTIP_TEXT = 'Add your formatted rich text and your pictures.';

let electronApp;
let window;
let userDataDir;

test.beforeAll(async () => {
  userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isra-tc005-'));

  electronApp = await electron.launch({
    args: [`--user-data-dir=${userDataDir}`, path.join(__dirname, '..')],
  });

  window = await electronApp.firstWindow();
  await window.locator('.tab-button[data-id="project-context"]').click();
  await window.waitForURL(/project-context\.html$/);
  await window.waitForSelector('#project-description');
});

test.afterAll(async () => {
  await electronApp.evaluate(({ dialog }) => {
    dialog.showMessageBoxSync = () => 1;
  });
  await electronApp.close();
  fs.rmSync(userDataDir, { recursive: true, force: true });
});

test('TC005 - all panel buttons are displayed with Project Context active', async () => {
  const tabButtons = window.locator('.tab-button');
  await expect(tabButtons).toHaveText(EXPECTED_TABS.map((t) => t.label));

  const projectContextTab = window.locator('.tab-button[data-id="project-context"]');
  await expect(projectContextTab).toHaveClass(/active/);
  await expect(projectContextTab).toHaveCSS('border-bottom-color', 'rgb(104, 167, 171)');
});

test('TC005 - screen is divided into 4 sections, each with a rich text box and a tooltip', async () => {
  const sections = [
    { id: '#project-description', title: projectContextSchema.projectDescription.title },
    { id: '#project-objectives', title: projectContextSchema.securityProjectObjectives.title },
    { id: '#officer-objectives', title: projectContextSchema.securityOfficerObjectives.title },
    { id: '#assumptions', title: projectContextSchema.securityAssumptions.title },
  ];

  for (const section of sections) {
    await expect(window.locator(`${section.id} p.subheading`)).toHaveText(section.title);
    await expect(window.locator(`${section.id} textarea.rich-text`)).toHaveCount(1);

    const tooltipText = window.locator(`${section.id} .tooltip .top`);
    await expect(tooltipText).toHaveCount(1);
    await expect(tooltipText).toContainText(TOOLTIP_TEXT);
  }
});

test('TC005 - Project Description allows inserting a hyperlink and attaching a file', async () => {
  await expect(window.locator('#project-description__url-image')).toBeVisible();
  await expect(window.locator('#project-description__url--insert')).toHaveText(
    projectContextSchema.projectURL.description
  );

  await expect(window.locator('#project-description__file-image')).toBeVisible();
  await expect(window.locator('#project-description__file--insert')).toHaveText(
    projectContextSchema.projectDescriptionAttachment.description
  );
});