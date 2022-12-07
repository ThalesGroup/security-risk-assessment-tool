const { _electron: electron } = require('playwright');
const { test, expect } = require('@playwright/test');

test('load all pages', async () => {
    const electronApp = await electron.launch({ args: ["main.js"] });
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
        // This runs in Electron's main process, parameter here is always
        // the result of the require('electron') in the main app script.
        return app.isPackaged;
    });

    expect(isPackaged).toBe(false);

    const windowState = await electronApp.evaluate(async ({ BrowserWindow }) => {
        const mainWindow = BrowserWindow.getAllWindows()[0];

        const getState = () => ({
            isVisible: mainWindow.isVisible(),
            isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
            isCrashed: mainWindow.webContents.isCrashed(),
        });

        return new Promise((resolve) => {
            if (mainWindow.isVisible()) {
                resolve(getState());
            } else {
                mainWindow.once("ready-to-show", () =>
                    setTimeout(() => resolve(getState()), 0)
                );
            }
        });
    });

    expect(windowState.isVisible).toBeTruthy();
    expect(windowState.isDevToolsOpened).toBeFalsy();
    expect(windowState.isCrashed).toBeFalsy();

    // Wait for the first BrowserWindow to open
    // and return its Page object
    //const window = await electronApp.firstWindow();
    // console.log(await window.title());

    // close app
    await electronApp.close();
});