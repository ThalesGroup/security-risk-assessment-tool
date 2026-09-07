const path = require('path');
const fs = require('fs');
const { app } = require('electron');
const log = require('electron-log/main');

const MAX_RETAINED_SESSIONS = 20;
const MAX_LOG_FILE_BYTES = 5 * 1024 * 1024;

let enabled = false;
let sessionLogPath = null;

function pad(n) { return String(n).padStart(2, '0'); }

function sessionFileName() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
    + `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `sratool-${stamp}-${process.pid}.log`;
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
    files.slice(MAX_RETAINED_SESSIONS).forEach((file) => fs.unlinkSync(file.fullPath));
  } catch (err) { }
}

function initLogger(loggingEnabled) {
  enabled = !!loggingEnabled;
  const logsDir = path.join(app.getPath('userData'), 'logs');

  if (enabled) {
    try {
      fs.mkdirSync(logsDir, { recursive: true });
      pruneOldSessions(logsDir);
    } catch (err) { }
    sessionLogPath = path.join(logsDir, sessionFileName());
  }

  log.transports.file.setAppName(app.getName ? app.getName() : 'sratool');
  log.transports.console.level = false;
  log.transports.file.level = enabled ? 'info' : false;
  log.transports.file.maxSize = MAX_LOG_FILE_BYTES;
  log.transports.file.format = '[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}';
  if (enabled) log.transports.file.resolvePathFn = () => sessionLogPath;

  log.initialize();

  if (enabled) {
    log.info('[MAIN] Diagnostic logging enabled (--enable-logging)');
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

module.exports = {
  initLogger,
  isLoggingEnabled: () => enabled,
  getLogFilePath: () => sessionLogPath,
  log,
};