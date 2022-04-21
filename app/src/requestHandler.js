const {
  ipcMain, nativeTheme,
} = require('electron');
const fs = require('fs');
const { XML2JSON } = require('../../lib/src/api/index');
const ISRAProject = require('../../lib/src/model/classes/ISRAProject/isra-project');

const israProject = new ISRAProject();

ipcMain.handle('dark-mode:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light';
  } else {
    nativeTheme.themeSource = 'dark';
  }
  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('dark-mode:system', () => {
  nativeTheme.themeSource = 'system';
});

ipcMain.handle('parse:xml', (event, filePath) => {
  const xmlData = fs.readFileSync(filePath, 'utf8');
  XML2JSON(xmlData, israProject);
  return israProject.toJSON();
});
