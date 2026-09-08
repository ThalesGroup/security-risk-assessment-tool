/*----------------------------------------------------------------------------
*
*     Copyright © 2026 THALES. All Rights Reserved.
*
* -----------------------------------------------------------------------------
* THALES MAKES NO REPRESENTATIONS OR WARRANTIES ABOUT THE SUITABILITY OF
* THE SOFTWARE, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
* TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
* PARTICULAR PURPOSE, OR NON-INFRINGEMENT. THALES SHALL NOT BE
* LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF USING,
* MODIFYING OR DISTRIBUTING THIS SOFTWARE OR ITS DERIVATIVES.
*
* THIS SOFTWARE IS NOT DESIGNED OR INTENDED FOR USE OR RESALE AS ON-LINE
* CONTROL EQUIPMENT IN HAZARDOUS ENVIRONMENTS REQUIRING FAIL-SAFE
* PERFORMANCE, SUCH AS IN THE OPERATION OF NUCLEAR FACILITIES, AIRCRAFT
* NAVIGATION OR COMMUNICATION SYSTEMS, AIR TRAFFIC CONTROL, DIRECT LIFE
* SUPPORT MACHINES, OR WEAPONS SYSTEMS, IN WHICH THE FAILURE OF THE
* SOFTWARE COULD LEAD DIRECTLY TO DEATH, PERSONAL INJURY, OR SEVERE
* PHYSICAL OR ENVIRONMENTAL DAMAGE ("HIGH RISK ACTIVITIES"). THALES
* SPECIFICALLY DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTY OF FITNESS FOR
* HIGH RISK ACTIVITIES.
* -----------------------------------------------------------------------------
*/

const path = require('path');
const fs = require('fs');
const { app, ipcMain } = require('electron');
const log = require('electron-log/main');

const MAX_RETAINED_SESSIONS = 20;
const MAX_LOG_FILE_BYTES = 5 * 1024 * 1024; 

let enabled = false;
let sessionLogPath = null;

function pad(n) {
  return String(n).padStart(2, '0');
}

function sessionFileName() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
    + `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const mode = app.isPackaged ? 'packaged' : 'dev';
  return `sratool-${mode}-${stamp}-${process.pid}.log`;
}

function pruneOldSessions(logsDir) {
  try {
    const files = fs.readdirSync(logsDir)
      .filter((name) => name.startsWith('sratool-') && name.endsWith('.log'))
      .map((name) => {
        const fullPath = path.join(logsDir, name);
        return { fullPath, mtime: fs.statSync(fullPath).mtimeMs };
      })
      .sort((a, b) => b.mtime - a.mtime);

    files.slice(MAX_RETAINED_SESSIONS).forEach((file) => {
      fs.unlinkSync(file.fullPath);
    });
  } catch (err) {
  }
}

/**
 * Initialises electron-log for the main process (and, via log.initialize(),
 * wires up the IPC transport so the renderer/preload logger can reach it).
 *
 * @param {boolean} loggingEnabled value of the --logging CLI flag
 * @returns {import('electron-log').MainLogger} the configured logger
 */
function initLogger(loggingEnabled) {
  enabled = !!loggingEnabled;

  const logsDir = path.join(app.getPath('userData'), 'logs');

  if (enabled) {
    try {
      fs.mkdirSync(logsDir, { recursive: true });
      pruneOldSessions(logsDir);
    } catch (err) {
    }
    sessionLogPath = path.join(logsDir, sessionFileName());
    console.log(`[sratool] Diagnostic logging enabled. Log file: ${sessionLogPath}`);
  }

  log.transports.file.setAppName(app.getName ? app.getName() : 'sratool');

  log.transports.console.level = false;
  log.transports.file.level = enabled ? 'info' : false;
  log.transports.file.maxSize = MAX_LOG_FILE_BYTES;
  log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
  if (enabled) {
    log.transports.file.resolvePathFn = () => sessionLogPath;
  }

log.initialize({ includeFutureSession: false });

  if (enabled) {
    log.info('[MAIN] Diagnostic logging enabled (--logging)');
    log.info(`[MAIN] Log file: ${sessionLogPath}`);
    log.info(`[MAIN] App version: ${app.getVersion()}`);
    log.info(`[MAIN] Electron version: ${process.versions.electron}`);
    log.info(`[MAIN] Chrome version: ${process.versions.chrome}`);
    log.info(`[MAIN] Node version: ${process.versions.node}`);
    log.info(`[MAIN] Platform: ${process.platform} / ${process.arch}`);
    log.info(`[MAIN] Packaged: ${app.isPackaged}`);
    log.info(`[MAIN] userData path: ${app.getPath('userData')}`);
  }

  return log;
}

function isLoggingEnabled() {
  return enabled;
}

function getLogFilePath() {
  return sessionLogPath;
}

let callSeq = 0;

function loggedHandle(channel, listener) {
  ipcMain.handle(channel, async (event, ...args) => {
    if (!enabled) return listener(event, ...args);
    const callId = ++callSeq;
    const start = Date.now();
    log.info(`[IPC#${callId}] handle ${channel} start`);
    try {
      const result = await listener(event, ...args);
      log.info(`[IPC#${callId}] handle ${channel} done in ${Date.now() - start}ms`);
      return result;
    } catch (err) {
      log.error(`[IPC#${callId}] handle ${channel} threw after ${Date.now() - start}ms`, err.name, err.message, err.stack);
      throw err;
    }
  });
}

function loggedOn(channel, listener) {
  ipcMain.on(channel, (event, ...args) => {
    if (!enabled) return listener(event, ...args);
    const callId = ++callSeq;
    const start = Date.now();
    log.info(`[IPC#${callId}] on ${channel} start`);
    try {
      listener(event, ...args);
      log.info(`[IPC#${callId}] on ${channel} done in ${Date.now() - start}ms`);
    } catch (err) {
      log.error(`[IPC#${callId}] on ${channel} threw after ${Date.now() - start}ms`, err.name, err.message, err.stack);
      throw err;
    }
  });
}

function instrumentWindow(win, label) {
  if (!enabled) return;
  let start = Date.now();
  win.on('unresponsive', () => log.error(`[MAIN] BrowserWindow (${label}) became unresponsive`));
  win.on('responsive', () => log.info(`[MAIN] BrowserWindow (${label}) became responsive again`));
  win.on('closed', () => log.info(`[MAIN] BrowserWindow (${label}) closed`));
  win.webContents.on('did-start-loading', () => {
    start = Date.now();
  });
  win.webContents.on('render-process-gone', (event, details) => {
    log.error(`[MAIN] render-process-gone (${label})`, `reason=${details.reason}`, `exitCode=${details.exitCode}`);
  });
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log.error(`[MAIN] did-fail-load (${label})`, `errorCode=${errorCode}`, errorDescription);
  });
  win.webContents.on('did-finish-load', () => {
    log.info(`[MAIN] did-finish-load (${label}) in ${Date.now() - start}ms`);
  });
}

module.exports = {
  initLogger,
  isLoggingEnabled,
  getLogFilePath,
  loggedHandle,
  loggedOn,
  instrumentWindow,
  log,
};