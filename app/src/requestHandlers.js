const {
  ipcMain, nativeTheme,
} = require('electron');
const fs = require('fs');
const {
  DataStore,
  XML2JSON,
} = require('../../lib/src/api/index');
const ISRAProject = require('../../lib/src/model/classes/ISRAProject/isra-project');

let israProject;

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
  const newISRAProject = new ISRAProject();
  const xmlData = fs.readFileSync(filePath, 'utf8');
  XML2JSON(xmlData, newISRAProject);
  israProject = newISRAProject;
  return israProject.toJSON();
});

ipcMain.handle('save:project', () => {
  if (israProject === undefined) {
    israProject = new ISRAProject();
  }
  DataStore(israProject);
});
