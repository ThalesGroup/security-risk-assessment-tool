/*----------------------------------------------------------------------------
*
*     Copyright © 2022 THALES. All Rights Reserved.
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

const {
  dialog, ipcMain, Menu, BrowserWindow,
  // nativeTheme,
} = require('electron');
const os = require('os');

const {
  DataStore,
  XML2JSON,
  DataLoad,
  DataNew,
} = require('../../../lib/src/api/index');

const ISRAProject = require('../../../lib/src/model/classes/ISRAProject/isra-project');

/**
  * israProject: holds current class for project
*/
let israProject;

/**
  * every time you want the main window, call this function.
*/
const getMainWindow = () => {
  const ID = process.env.MAIN_WINDOW_ID * 1;
  return BrowserWindow.fromId(ID);
};

/**
  * Create new project
  * @param win Browser Window
  * @param app
*/
const newISRAProject = (win, app) => {
  try {
    if(!israProject) {
      israProject = new ISRAProject();
      DataNew(israProject);
    };
    win.webContents.send('project:load', israProject.toJSON());
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(null, { message: 'Failed to create new project' });
    app.quit();
  }
};

/**
  *
  *
  *
  *
  *
  * MENU ITEMS EVENT HANDLERS
  *
  *
  *
  *
  *
  *
  *
*/

/**
  * jsonFilePath: tracks if file opened is json file type (save/saveAs)
  * labelSelected: tracks if 'Save' or 'Save As' menu item is selected
*/
let jsonFilePath = '';

/**
  * save as new project in selected directory (save as)
*/
const saveAs = async () => {
  const options = {
  // Placeholders
    title: 'Save file - Electron ISRA Project',
    defaultPath: os.homedir(),
    buttonLabel: 'Save JSON File',
    filters: [
      { name: 'JSON', extensions: ['json'] },
    ],
  };
  const fileName = await dialog.showSaveDialog(options);
  if (!fileName.canceled) {
    const { filePath } = fileName;
    getMainWindow().webContents.send('validate:allTabs', filePath);
  }
};

/**
  * override data in existing json file (save)
*/
const save = () => {
  getMainWindow().webContents.send('validate:allTabs', jsonFilePath);
};

/**
  * save current project (save/save as)
*/
const saveProject = () => {
  if (jsonFilePath !== '') save();
  else saveAs();
};

/**
  *  @param {string} filePath path of current file
*/
ipcMain.on('validate:allTabs', async (event, filePath) => {
  if (jsonFilePath === '') {
    // save as new project in selected directory (save as)
    try {
      await DataStore(israProject, filePath);
      jsonFilePath = filePath;
      getMainWindow().title = filePath;
      dialog.showMessageBoxSync(null, { message: `Successfully saved form to ${filePath}` });
    } catch (err) {
      console.log(err);
      dialog.showMessageBoxSync(null, { message: `Error in saving form to ${filePath}` });
    }
  } else {
    // override data in existing json file (save)
    try {
      await DataStore(israProject, jsonFilePath);
      dialog.showMessageBoxSync(null, { message: 'Successfully saved form' });
    } catch (err) {
      console.log(err);
      dialog.showMessageBoxSync(null, { message: 'Error in saving form' });
    }
  }
});

/**
  * validation instantly fails when one of the validation methods fails
*/
const validateClasses = () => {
  const { ISRAmeta, SupportingAsset } = israProject.properties;

  const validateWelcomeTab = () =>{
    if (!ISRAmeta.projectOrganization) return false;
    return true;
  };

  const validateSupportingAssetsTab = () =>{
    for(let i=0; i<SupportingAsset.length; i++){
      const { businessAssetRef } = SupportingAsset[i];
      const uniqueRefs = new Set();
      for (let j = 0; j < businessAssetRef.length; j++){
        const ref = businessAssetRef[j];
        if (!ref || uniqueRefs.has(ref)) return false;
        uniqueRefs.add(ref);
      }
    }
    return true;
  };

  return validateWelcomeTab() && validateSupportingAssetsTab();
};

/**
  * check for validation errors in dom (save/save as)
  * @param {string} labelSelected either 'Save' or 'Save As' menu item is selected
*/
const validationErrors = (labelSelected) => {
  const saveOrSaveAs = () => {
    if (labelSelected === 'Save As') saveAs();
    else if (labelSelected === 'Save') saveProject();
  };

  if (validateClasses()) saveOrSaveAs();
  else {
    const result = dialog.showMessageBoxSync(null, {
      type: 'warning',
      message: 'The form contains validation errors. Errors are marked with red border/color (required fields/invalid values). Do you still want to save it?',
      title: 'Validation Errors',
      buttons: ['Yes', 'No'], // Yes returns 0, No returns 1
    });
    if (result === 0) saveOrSaveAs();
  }
  // labelSelected = label;
  // getMainWindow().webContents.send('project:validationErrors');
};

/** After checking for validation errors in dom,
  * prompt validation error dialog if needed (save/save as)
  *  @param {boolean} state checks if dom is valid or invalid
*/
// ipcMain.on('project:validationErrors', (event, state) => {
//   const saveOrSaveAs = () => {
//     if (labelSelected === 'Save As') saveAs();
//     else if (labelSelected === 'Save') saveProject();
//   };

//   if (state) saveOrSaveAs();
//   else {
//     const result = dialog.showMessageBoxSync(null, {
//       type: 'warning',
//       message: 'The form contains validation errors. Errors are marked with red border/color (required fields/invalid values). Do you still want to save it?',
//       title: 'Validation Errors',
//       buttons: ['Yes', 'No'], // Yes returns 0, No returns 1
//     });
//     if (result === 0) saveOrSaveAs();
//   }
// });

/**
  * Load JSON file
  * @param {string} win Browser window
  * @param {string} filePath path of selected json file
*/
const loadJSONFile = async (win, filePath) => {
  try {
    israProject = new ISRAProject();
    await DataLoad(israProject, filePath);
    win.webContents.send('project:load', israProject.toJSON());
    jsonFilePath = filePath;
    getMainWindow().title = `ISRA Risk Asessment - ${filePath}`;
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(null, { type: 'error', title: 'Invalid File Opened', message: 'Invalid JSON File' });
  }
};

/**
  * Load XML file
  * @param {string} win Browser window
  * @param {string} filePath path of selected xml file
*/
const loadXMLFile = (win, filePath) => {
  try {
    israProject = XML2JSON(filePath);
    win.webContents.send('project:load', israProject.toJSON());
    jsonFilePath = '';
    getMainWindow().title = `ISRA Risk Asessment - ${filePath}`;
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(null, { type: 'error', title: 'Invalid File Opened', message: 'Invalid XML File' });
  }
};

/**
  * Load either JSON or XML file
  * @module loadFile
  * @param {string} win Browser window
*/
const loadFile = (win) => {
  const options = {
    title: 'Open file - Electron ISRA Project',
    buttonLabel: 'Open File',
    filters: [
      { name: 'JSON/XML', extensions: ['json', 'xml'] },
    ],
  };
  const filePathArr = dialog.showOpenDialogSync(options);

  if (filePathArr !== undefined) {
    const filePath = filePathArr[0];
    const fileType = filePath.split('.').pop();

    if (fileType === 'json') loadJSONFile(win, filePath);
    else loadXMLFile(win, filePath);
  }
};

module.exports = {
  validationErrors,
  loadFile,
  newISRAProject,
};

/**
  *
  *
  *
  *
  *
  * TAB EVENT HANDLERS
  *
  *
  *
  *
  *
  *
  *
*/

const { 
  urlPrompt, 
  openUrl,
  attachFile,
  removeFile,
  saveAsFile,
  decodeFile, 
} = require('../../../lib/src/model/classes/utility');

// Welcome Tab
const {
  addTrackingRow,
  deleteTrackingRow,
  updateTrackingRow,
  validateISRAmeta,
} = require('../../../lib/src/model/classes/ISRAProject/handler-event');
const { renderWelcome } = require('../../../lib/src/model/classes/ISRAProject/render-welcome');

ipcMain.handle('render:welcome', () => renderWelcome());
ipcMain.handle('welcome:addTrackingRow', () => addTrackingRow(israProject));
ipcMain.handle('welcome:deleteTrackingRow', (event, iterations) => deleteTrackingRow(israProject, iterations));
ipcMain.on('welcome:updateTrackingRow', (event, rowData) => {
  updateTrackingRow(israProject, rowData);
});
ipcMain.on('validate:welcome', (event, arr) => {
  validateISRAmeta(israProject, arr);
});

// Project Context Tab
const {
  validateProjectContext,
} = require('../../../lib/src/model/classes/ISRAProjectContext/handler-event');
const { renderProjectContext } = require('../../../lib/src/model/classes/ISRAProjectContext/render-project-context');

/**
  * projectContextFileName: holds name of project descriptive document
*/
let projectContextFileName;

ipcMain.handle('render:projectContext', () => renderProjectContext());
ipcMain.on('projectContext:openURL', (event, url, userStatus) => {
  openUrl(url, userStatus);
});
ipcMain.handle('projectContext:urlPrompt', async () => {
  const url = await urlPrompt();
  if (url !== 'cancelled') israProject.israProjectContext.projectURL = url;
  return url;
});

const projectContextAttachmentOptions = () => {
  const attachLabel = {
    label: 'Attach',
    click: () => {
      try {
        const [fileName, base64data] = attachFile();
        if (fileName !== '') {
          projectContextFileName = fileName;
          israProject.israProjectContext.projectDescriptionAttachment = base64data;
          getMainWindow().webContents.send('projectContext:fileName', projectContextFileName);
        }
      } catch (err) {
        console.log(err);
        dialog.showMessageBoxSync(null, { type: 'error', title: 'Invalid Attachment', message: 'Invalid Project Descriptive Document' });
        getMainWindow().webContents.send('projectContext:fileName', 'Click here to attach a file');
      }
    },
  };

  if (israProject.israProjectContext.projectDescriptionAttachment !== '') {
    return [
      attachLabel,
      {
        label: 'Save as',
        click: () => saveAsFile(
          israProject.israProjectContext.projectDescriptionAttachment,
          projectContextFileName,
        ),
      },
      {
        label: 'Remove',
        click: () => {
          const [fileName, base64data] = removeFile();
          projectContextFileName = fileName;
          israProject.israProjectContext.projectDescriptionAttachment = base64data;
          getMainWindow().webContents.send('projectContext:fileName', projectContextFileName);
        },
      },
    ];
  }
  return [
    attachLabel,
  ];
};

ipcMain.on('projectContext:attachment', () => {
  const contextMenu = Menu.buildFromTemplate(projectContextAttachmentOptions());
  contextMenu.popup();
});

ipcMain.handle('projectContext:decodeAttachment', async (event, base64) => {
  try {
    const [fileName, base64data] = decodeFile(base64, israProject.israProjectContext);
    projectContextFileName = fileName;
    israProject.israProjectContext.projectDescriptionAttachment = base64data;
    return projectContextFileName;
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(null, { type: 'error', title: 'Invalid Attachment', message: 'Invalid Project Descriptive Document' });
    return 'Click here to attach a file';
  }
});

ipcMain.on('validate:projectContext', (event, arr) => {
  validateProjectContext(israProject, arr);
});

// Business Assets Tab
const {
  addBusinessAsset, deleteBusinessAsset, validateBusinessAsset, updateBusinessAsset,
} = require('../../../lib/src/model/classes/BusinessAsset/handler-event');
const { renderBusinessAssets } = require('../../../lib/src/model/classes/BusinessAsset/render-business-assets');

ipcMain.handle('render:businessAssets', () => renderBusinessAssets());
ipcMain.handle('businessAssets:addBusinessAsset', () => addBusinessAsset(israProject, getMainWindow()));
ipcMain.on('businessAssets:deleteBusinessAsset', (event, ids) => {
  deleteBusinessAsset(israProject, ids, getMainWindow());
});
ipcMain.on('businessAssets:updateBusinessAsset', (event, id, field, value) => {
  updateBusinessAsset(israProject, getMainWindow(), id, field, value);
});
ipcMain.on('validate:businessAssets', (event, arr) => {
  validateBusinessAsset(israProject, arr);
});

// Supporting Assets Tab
const {
  addSupportingAsset, deleteSupportingAsset, updateSupportingAsset, validateSupportingAssets, addBusinessAssetRef, deleteBusinessAssetRef, updateBusinessAssetRef
} = require('../../../lib/src/model/classes/SupportingAsset/handler-event');
const { renderSupportingAssets } = require('../../../lib/src/model/classes/SupportingAsset/render-supporting-assets');

ipcMain.handle('render:supportingAssets', () => renderSupportingAssets());
ipcMain.handle('supportingAssets:addSupportingAsset', () => addSupportingAsset(israProject));
ipcMain.on('supportingAssets:deleteSupportingAsset', (event, ids) => {
  deleteSupportingAsset(israProject, ids, getMainWindow());
});
ipcMain.on('supportingAssets:updateSupportingAsset', (event, id, field, value) => {
  updateSupportingAsset(israProject, getMainWindow(), id, field, value);
});
ipcMain.on('validate:supportingAssets', (event, arr, desc) => {
  validateSupportingAssets(israProject, arr, desc);
});
ipcMain.on('supportingAssets:addBusinessAssetRef', (event, id, value) => addBusinessAssetRef(israProject, id, value));
ipcMain.on('supportingAssets:deleteBusinessAssetRef', (event, id, indexes) => deleteBusinessAssetRef(israProject, id, indexes));
ipcMain.handle('supportingAssets:updateBusinessAssetRef', (event, id, value, index) => updateBusinessAssetRef(israProject, id, value, index));

// Risks Tab
const { addRisk, deleteRisk, updateRiskName, updateRiskLikelihood, updateRiskImpact, addRiskAttackPath, deleteRiskAttackPath, addVulnerabilityRef, deleteVulnerabilityRef } = require('../../../lib/src/model/classes/Risk/handler-event');
const { renderRisks } = require('../../../lib/src/model/classes/Risk/render-risks');

ipcMain.handle('render:risks', () => renderRisks());
ipcMain.handle('risks:addRisk', () => addRisk(israProject));
ipcMain.on('risks:deleteRisk', (event, ids) => deleteRisk(israProject, ids));
ipcMain.on('risks:updateRiskName', (event, id, field, value) => {
  updateRiskName(israProject, getMainWindow(), id, field, value);
});
ipcMain.handle('risks:updateRiskLikelihood', (event, id, field, value) => updateRiskLikelihood(israProject, id, field, value));
ipcMain.handle('risks:updateRiskImpact', (event, id, field, value) => updateRiskImpact(israProject, id, field, value));
ipcMain.handle('risks:addRiskAttackPath', (event, riskId) => addRiskAttackPath(israProject, riskId));
ipcMain.handle('risks:deleteRiskAttackPath', (event, riskId, ids) => deleteRiskAttackPath(israProject, riskId, ids));
ipcMain.handle('risks:addRiskVulnerabilityRef', (event, riskId, riskAttackPathId) => addVulnerabilityRef(israProject, riskId, riskAttackPathId));
ipcMain.handle('risks:deleteRiskVulnerabilityRef', (event, riskId, riskAttackPathId, ids) => deleteVulnerabilityRef(israProject, riskId, riskAttackPathId, ids));

// Vulnerability Tab
const { addVulnerability, deleteVulnerability, updateVulnerability } = require('../../../lib/src/model/classes/Vulnerability/handler-event')
const { renderVulnerabilities } = require('../../../lib/src/model/classes/Vulnerability/render-vulnerabilities');
ipcMain.handle('render:vulnerabilities', () => renderVulnerabilities());
ipcMain.handle('vulnerabilities:addVulnerability', () => addVulnerability(israProject));
ipcMain.on('vulnerabilities:deleteVulnerability', (event, ids) => deleteVulnerability(israProject, ids));
ipcMain.handle('vulnerabilities:updateVulnerability', (event, id, field, value) => {
  return updateVulnerability(israProject, getMainWindow(), id, field, value);
});
ipcMain.handle('vulnerabilities:urlPrompt', async (event, id) => {
  const url = await urlPrompt();
  if (url !== 'cancelled') israProject.getVulnerability(id).vulnerabilityTrackingURI = url;
  return url;
});
ipcMain.on('vulnerabilities:openURL', (event, url, userStatus) => {
  openUrl(url, userStatus);
});

/**
  * vulnerabilitiesFileNames: holds names of each vulnerability file attachments
*/

const vulnerabilitiesAttachmentOptions = (id) => {
  const attachLabel = {
    label: 'Attach',
    click: () => {
      try {
        const [fileName, base64data] = attachFile();
        if (fileName !== '') {
          israProject.getVulnerability(id).vulnerabilityDescriptionAttachment = base64data;
          getMainWindow().webContents.send('vulnerabilities:fileName', { fileName, base64: base64data});
        }
      } catch (err) {
        console.log(err);
        dialog.showMessageBoxSync(null, { type: 'error', title: 'Invalid Attachment', message: `Vulnerability ${id}: Invalid Vulnerability Document` });
        getMainWindow().webContents.send('vulnerabilities:fileName', { fileName:'Click here to attach a file', base64: ''});
      }
    },
  };

  if (israProject.getVulnerability(id).vulnerabilityDescriptionAttachment !== '') {
    return [
      attachLabel,
      {
        label: 'Save as',
        click: () => saveAsFile(
          israProject.getVulnerability(id).vulnerabilityDescriptionAttachment,
          fileName,
        ),
      },
      {
        label: 'Remove',
        click: () => {
          const [fileName, base64data] = removeFile();
          israProject.getVulnerability(id).vulnerabilityDescriptionAttachment = base64data;
          getMainWindow().webContents.send('vulnerabilities:fileName', { fileName, base64: ''});
        },
      },
    ];
  }
  return [
    attachLabel,
  ];
};

ipcMain.on('vulnerabilities:attachment', (event, id) => {
  const contextMenu = Menu.buildFromTemplate(vulnerabilitiesAttachmentOptions(id));
  contextMenu.popup();
});

ipcMain.handle('vulnerabilities:decodeAttachment', async (event, id, base64) => {
  try {
    const vulnerability = israProject.getVulnerability(id);
    const [fileName, base64data] = decodeFile(base64, vulnerability);
    vulnerability.vulnerabilityDescriptionAttachment = base64data;
    return { fileName, vulnerabilities: israProject.properties.Vulnerability };
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(null, { type: 'error', title: 'Invalid Attachment', message: `Vulnerability ${id}: Invalid Vulnerability Document` });
    return 'Click here to attach a file';
  }
});

// ipcMain.handle('dark-mode:toggle', () => {
//   if (nativeTheme.shouldUseDarkColors) {
//     nativeTheme.themeSource = 'light';
//   } else {
//     nativeTheme.themeSource = 'dark';
//   }
//   return nativeTheme.shouldUseDarkColors;
// });

// ipcMain.handle('dark-mode:system', () => {
//   nativeTheme.themeSource = 'system';
// });
