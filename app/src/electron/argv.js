function getUserArgs(argv, isPackaged) {
  const userArgs = isPackaged ? argv.slice(1) : argv.slice(2);

  let logging = false;
  let filePath = null;

  userArgs.forEach((arg) => {
    if (arg === '--enable-logging') {
      logging = true;
    } else if (arg.startsWith('--')) {
    } else if (filePath === null) {
      filePath = arg;
    }
  });

  return { logging, filePath };
}

module.exports = { getUserArgs };