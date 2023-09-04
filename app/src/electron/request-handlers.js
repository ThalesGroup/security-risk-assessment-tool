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
  dialog, ipcMain, Menu, BrowserWindow
  // nativeTheme,
} = require('electron');


const os = require('os');
const path = require('path');
const fs = require('fs');


const parser = require('../../../lib/src/api/xml-json/parser');
const alterISRA = require('../../../lib/src/api/xml-json/alter-isra/alter-isra');
const validateJsonSchema = require('../../../lib/src/api/xml-json/validate-json-schema');

const errorMessages = require('./validation')



const {
  DataStore,
  XML2JSON,
  DataLoad,
  DataNew,
} = require('../../../lib/src/api/index');

const ISRAProject = require('../../../lib/src/model/classes/ISRAProject/isra-project');
const config = require('../../../lib/src/config')



/**
  * israProject: holds current class for project
*/
let israProject, browserTitle = 'ISRA Risk Assessment', oldIsraProject;

let oldImport = null;

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
      oldIsraProject = israProject.toJSON();
    };
    getMainWindow().title = browserTitle;
    win.webContents.send('project:load', israProject.toJSON());
  } catch (err) {
    console.log(err);
    dialog.showMessageBoxSync(getMainWindow(), { message: 'Failed to create new project' });
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
let jsonFilePath = '', electronApp = null;

const savetoPath = async (filePath, saveAs = false) => {
  if (jsonFilePath === '' || saveAs) {
    // save as new project in selected directory (save as)
    try {
      await DataStore(israProject, filePath);
      jsonFilePath = filePath;
      browserTitle = `ISRA Risk Assessment - ${filePath}`;
      getMainWindow().title = browserTitle;
      oldIsraProject = israProject.toJSON();
      dialog.showMessageBoxSync(getMainWindow(), { message: `Successfully saved form to ${filePath}` });
      if (electronApp) electronApp.exit([0]);
    } catch (err) {
      console.log(err);
      dialog.showMessageBoxSync(getMainWindow(), { message: `Error in saving form to ${filePath}` });
    }
  } else {
    // override data in existing json file (save)
    try {
      await DataStore(israProject, jsonFilePath);
      oldIsraProject = israProject.toJSON();
      dialog.showMessageBoxSync(getMainWindow(), { message: 'Successfully saved form' });
      if (electronApp) electronApp.exit([0]);
    } catch (err) {
      console.log(err);
      dialog.showMessageBoxSync(getMainWindow(), { message: 'Error in saving form' });
    }
  }
}

/**
  * save as new project in selected directory (save as)
*/
const saveAs = async () => {
  const options = {
  // Placeholders
    title: 'Save file - Electron ISRA Project',
    defaultPath: os.homedir(),
    buttonLabel: 'Save ISRA File',
    filters: [
      { name: 'ISRA file type', extensions: ['sra'] },
    ],
  };
  const fileName = await dialog.showSaveDialog(options);
  if (!fileName.canceled) {
    const { filePath } = fileName;
    savetoPath(filePath, true);
    // getMainWindow().webContents.send('validate:allTabs', filePath);
  }
};

/**
  * override data in existing json file (save)
*/
const save = () => {
  if (israProject.toJSON() !== oldIsraProject){
    israProject.iteration += 1;
    getMainWindow().webContents.send('project:iteration', israProject.iteration);
    savetoPath(jsonFilePath);
    // getMainWindow().webContents.send('validate:allTabs', jsonFilePath);
  }
};

/**
  * save current project (save/save as)
*/
const saveProject = () => {
  if (jsonFilePath !== '') save();
  else saveAs();
};

/**
  * validation instantly fails when one of the validation methods fails
*/
const validateClasses = () => {
  //console.log(israProject.properties)
  const { ISRAmeta, SupportingAsset, Vulnerability, Risk} = israProject.properties;

  const validateWelcomeTab = () =>{
    let message = '';
    let invalidCount = 0;
    const noProjectOrganization = !ISRAmeta.projectOrganization;

    if (noProjectOrganization) {
      message += `${errorMessages['welcomeHeader']}${errorMessages['noProjectOrganization']}`;
      invalidCount++
    } 

    return {status: invalidCount, error: message};
  };

  const validateSupportingAssetsTab = () =>{
    let message = '';
    let invalidCount = 0;
    const invalidSAs = new Set() //Need to use set
    for(let i=0; i<SupportingAsset.length; i++){
      const { businessAssetRef, supportingAssetId } = SupportingAsset[i];
      const uniqueRefs = new Set();
      for (let j = 0; j < businessAssetRef.length; j++){
        const ref = businessAssetRef[j];
        const nullBusinessAssetRef = !ref
        const duplicateBusinessAssetRef = uniqueRefs.has(ref)
        if (nullBusinessAssetRef || duplicateBusinessAssetRef) {
          invalidCount++
          invalidSAs.add(supportingAssetId)
        } 

        uniqueRefs.add(ref);
      }
      if (invalidCount) {
        message += `${errorMessages['supportingAssetsHeader']}${errorMessages['supportingAssets']}${invalidCount}\n
        ${errorMessages['supportingAssetsIDs']}${[...invalidSAs].join(',')}\n\n`
      }
      
    }


    return {status: invalidCount, error: message};
  };

  const validateRisksTab = () => {
    let message = '';
    const invalidRisks = [];
    const invalidRisksMitigations = [];
    for (let i = 0; i < Risk.length; i++) {

      
      const { riskName, riskMitigation, riskId, threatAgent, threatVerb, businessAssetRef, supportingAssetRef, motivation } = Risk[i];
      const noThreatAgent = !threatAgent;
      const noThreatVerb = !threatVerb;
      const noBusinessAssetRef = !businessAssetRef;
      const noSupportingAssetRef = !supportingAssetRef;
      const noMotivation = !motivation;
      if (noThreatAgent || noThreatVerb || noBusinessAssetRef || noSupportingAssetRef || noMotivation) {
        invalidRisks.push(riskId);
      }
      
     
     for(let i=0; i<riskMitigation.length; i++){
       if (riskMitigation[i].cost != null && !Number.isInteger(riskMitigation[i].cost)) {
        invalidRisksMitigations.push(riskId );
       }
     }
    }
    if (invalidRisks.length || invalidRisksMitigations.length) {
      message += errorMessages['risksHeader']
      if (invalidRisks.length) {
        message += `${errorMessages['riskDescription']}${invalidRisks.length}\n
        ${errorMessages['riskDescriptionIDs']}${invalidRisks.join(',')}\n\n`
      }
      
      if (invalidRisksMitigations.length) {
        message += `${errorMessages['riskMitigation']}${invalidRisksMitigations.length}\n
        ${errorMessages['riskMitigationIDs']}${invalidRisksMitigations.join(',')}\n\n`
      }
    }
    
    return {status: invalidRisks.length + invalidRisksMitigations.length, error: message};
  };

  const validateVulnerabilitiesTab = () => {
    const invalidVuls = [];
    let message = '';
    for(let i=0; i<Vulnerability.length; i++) {
    
      const { cveScore, supportingAssetRef, vulnerabilityDescription, vulnerabilityName, vulnerabilityId } = Vulnerability[i];
      const invalidCVEScore = cveScore < 0 || cveScore > 10;
      const noCVEScore = cveScore === null;
      const noSupportingAssetRef = supportingAssetRef.length === 0;
      const noVulnerabilityDescription =  !vulnerabilityDescription;
      const noVulnerabilityName = !vulnerabilityName;
      if (invalidCVEScore || noCVEScore || noSupportingAssetRef || noVulnerabilityDescription || noVulnerabilityName) {
        invalidVuls.push(vulnerabilityId);
      }
    }

    if (invalidVuls.length) {
      message += `${errorMessages['vulnerabilitiesHeader']}${errorMessages['vulnerabilities']}${invalidVuls.length}\n${errorMessages['vulnerabilityIDs']}${invalidVuls.join(',')}\n\n`
    }

    return {status: invalidVuls.length, error: message};
  };

  const {status: welcomeInvalid, error: welcomeError} = validateWelcomeTab();
  const {status: saInvalid, error: saError} = validateSupportingAssetsTab();
  const {status: riskInvalid, error: riskError} = validateRisksTab();
  const {status: vulInvalid, error: vulError} = validateVulnerabilitiesTab();
  let valid = true;
  if (welcomeInvalid + saInvalid + riskInvalid + vulInvalid) {
    valid = false;

  }
  const message = `${welcomeError}${saError}${riskError}${vulError}`;
  return {status: valid, error: message}
};

/**
  *  @param {string} filePath path of current file
*/
ipcMain.on('validate:allTabs', async (event, labelSelected) => {
  const saveChangesDialog = () => {
    return dialog.showMessageBoxSync(getMainWindow(), {
      type: 'warning',
      message: 'Do you want to save the changes?',
      title: 'Save project?',
      buttons: ['Yes', 'No', 'Cancel'], // Yes returns 0, No returns 1, Cancel returns 2
    });
  };

  const openFileDialog = () => {
    const options = {
      title: 'Open file - Electron ISRA Project',
      buttonLabel: 'Open File',
      filters: [
        { name: 'SRA/JSON/XML', extensions: ['sra','json', 'xml'] },
      ],
    };
    const filePathArr = dialog.showOpenDialogSync(options);

    if (filePathArr !== undefined) {
      const filePath = filePathArr[0];
      const fileType = filePath.split('.').pop();

      if (fileType === 'json' || fileType === 'sra') loadJSONFile(getMainWindow(), filePath);
      else loadXMLFile(getMainWindow(), filePath);
    }
  };

  const validation = () => {
    const saveOrSaveAs = () => {
      if (labelSelected === 'Save As') saveAs();
      else if (labelSelected === 'Save') saveProject();
    };
    const {status, error} = validateClasses();
    if (status) saveOrSaveAs();
    else {
      const result = dialog.showMessageBoxSync(getMainWindow(), {
        type: 'warning',
        message: `The form contains validation errors. Errors are marked with red border/color (required fields/invalid values).\n\n${error} \nDo you still want to save it?`,
        title: 'Validation Errors',
        buttons: ['Yes', 'No'], // Yes returns 0, No returns 1
      });
      if (result === 0) saveOrSaveAs();
    }
    // labelSelected = label;
    // getMainWindow().webContents.send('project:validationErrors');
  };

  if (labelSelected === 'Load File') {
    /**
      *  loading/opening xml/json file
    */
    let result;
    if (israProject.toJSON() !== oldIsraProject) result = saveChangesDialog();

    if (result === 0) validationErrors('Save');
    else if (result === 1 || !result) openFileDialog();
  } else if (electronApp) {
    /**
      *  exit button pressed
    */
    if (israProject.toJSON() !== oldIsraProject){
      /**
        *  changes are made to current project
      */
      const result = saveChangesDialog();

      if (result === 0) {
        validation();
      } else if (result === 1) electronApp.exit([0]);
      else if (result === 2) electronApp = null;
    } else electronApp.exit([0]);
  } else {
    /**
      *  save/saveAs button pressed
    */
    validation();
  };
});

/**
  * check for validation errors in dom (save/save as)
  * @param {string} labelSelected either 'Save' or 'Save As' menu item is selected
*/
const validationErrors = (labelSelected) => {
  getMainWindow().webContents.send('validate:allTabs', labelSelected);
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
function getError(err) {
  let message = ""
    const JSON_START_INDEX = 42;
    if (err.message.slice(0,JSON_START_INDEX) === "Failed to validate json against schema at:") {
      
      const errorJSON = JSON.parse(err.message.slice("Failed to validate json against schema at:".length, ));
      const affectedField = errorJSON[0]['instancePath'].split("/").filter(element => isNaN(element));

      message += "Invalid data input in " + affectedField[0] + " Tab, \n`"
      for (const subCategory in affectedField) {
        if (subCategory > 0) {
          message +=  " " + affectedField[subCategory]
        }
      }
      message += "` field: " + errorJSON[0]['message']
    } else {
      message = err.message;
    }

  return message
}


/**
  * Exit button is pressed
*/
const exit = (e, app) => {
  e.preventDefault();
  validationErrors('Save');
  electronApp = app;
};

/**
  * Load JSON file
  * @param {string} win Browser window
  * @param {string} filePath path of selected json file
*/
const loadJSONFile = async (win, filePath) => {
  try {
    
    israProject = DataLoad(filePath);
    win.webContents.send('project:load', israProject.toJSON());
    jsonFilePath = filePath;
    browserTitle = `ISRA Risk Assessment - ${filePath}`;
    getMainWindow().title = browserTitle;
    oldIsraProject = israProject.toJSON();
  } catch (err) {
    console.log(err);
    const errorMessage = getError(err)
    dialog.showMessageBoxSync(getMainWindow(), { type: 'error', title: 'Invalid File Opened', message: `Invalid JSON File \n\n${errorMessage}` });
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
    browserTitle = `ISRA Risk Assessment - ${filePath}`;
    getMainWindow().title = browserTitle;
  } catch (err) {
    console.log(err);
    const errorMessage = getError(err)
    dialog.showMessageBoxSync(getMainWindow(), { type: 'error', title: 'Invalid File Opened', message: `Invalid XML File: \n\n${errorMessage}` });
  }
};

/**
  * Load either JSON or XML file
  * @module loadFile
  * @param {string} win Browser window
*/
const loadFile = (win) => {
  validationErrors('Load File');
};



function getJSON(filePath){
  const data =fs.readFileSync(filePath, 'utf8') 
    

    try {
      const jsonData = JSON.parse(data);

      if (!jsonData.ISRAmeta.schemaVersion) {
        const risks = jsonData.Risk
        risks.forEach((risk) => {
          const riskNameObject = risk.riskName
          delete risk.riskName
          Object.keys(riskNameObject).forEach((field) => {
            risk[field] = riskNameObject[field]
          });
        });

        const vulnerabilities = jsonData.Vulnerability;
        const vulIdMap = {};
        vulnerabilities.forEach((vulnerability) => {
          vulIdMap[vulnerability.vulnerabilityName] = vulnerability.vulnerabilityId;
        });

        jsonData.Risk.forEach((risk) => {
          
          const riskAttackPaths = risk.riskAttackPaths;
          riskAttackPaths.forEach((riskAttackPath)=> {
              
              const vulnerabilityRef = riskAttackPath.vulnerabilityRef;
              const validRefs = []
               vulnerabilityRef.forEach((ref)=> {
                if (!(ref.name === '')) {
                  delete ref.rowId  

                  ref.vulnerabilityId = vulIdMap[ref.name];
                  validRefs.push(ref)
                }
                
              });
              
              riskAttackPath.vulnerabilityRef = validRefs
             
          });
      });


      } else if (jsonData.ISRAmeta.schemaVersion > 3) {
        throw Error(`Unable to load schema version ${jsonData.ISRAmeta.schemaVersion}, this version only supports 3 and below`)
      }


      const iterations = jsonData.ISRAmeta.ISRAtracking
      const dateFormat = new RegExp('(^\\d\\d\\d\\d-[0-1]\\d-[0-3]\\d$)' 
      + '|(^$)')
      for (var index = 0; index < iterations.length; index++) {
        const currentDate = iterations[index].trackingDate
        const validFormat = dateFormat.test(currentDate)
        const isValidDate = !isNaN(new Date(currentDate));
        if (!validFormat) {
          if (isValidDate) {
            // convert to correct format
            const date = new Date(currentDate);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const newDate = year + '-' + month + '-' + day;
            jsonData.ISRAmeta.ISRAtracking[index].trackingDate = newDate;
          } else {
            jsonData.ISRAmeta.ISRAtracking[index].trackingDate = '';
          }
        }
      }

      const importedISRA = validateJsonSchema(jsonData);
      return importedISRA
    } catch (error) {
      console.log(error);
      const errorMessage = getError(error)
      dialog.showMessageBoxSync(getMainWindow(), { type: 'error', title: 'Invalid File Opened', message: `Invalid JSON File \n\n${errorMessage}` });
    }
 
}

function getXML(filePath) {
  try {

    const xmlData = fs.readFileSync(filePath, 'utf8');
      const resultJSON = parser(xmlData);

      // writeFile(resultJSON);

      const israJSONData = alterISRA(resultJSON.ISRA, xmlData);
      const iterations = israJSONData.ISRAmeta.ISRAtracking
      const dateFormat = new RegExp('(^\\d\\d\\d\\d-[0-1]\\d-[0-3]\\d$)' 
      + '|(^$)')

      for (var index = 0; index < iterations.length; index++) {
        const currentDate = iterations[index].trackingDate
        const validFormat = dateFormat.test(currentDate)
        const isValidDate = !isNaN(new Date(currentDate));
        if (!validFormat) {
          if (isValidDate) {
            // convert to correct format
            const date = new Date(currentDate);
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const newDate = year + '-' + month + '-' + day;
            israJSONData.ISRAmeta.ISRAtracking[index].trackingDate = newDate;
          } else {
            israJSONData.ISRAmeta.ISRAtracking[index].trackingDate = '';
          }
        }
      }
    
      const importedISRA = validateJsonSchema(israJSONData);
      return importedISRA

  } catch {
    console.log(error);
    const errorMessage = getError(error)
    dialog.showMessageBoxSync(getMainWindow(), { type: 'error', title: 'Invalid File Opened', message: `Invalid XML File \n\n${errorMessage}` });
  }
  

}

const openFileDialog = () => {
  const options = {
    title: 'Open file - Electron ISRA Project',
    buttonLabel: 'Open File',
    filters: [
      { name: 'JSON/XML', extensions: ['json', 'xml', 'sra'] },
    ],
  };
  const filePathArr = dialog.showOpenDialogSync(options);
  return filePathArr
}

function getISRA(filePathArr) {

  if (filePathArr !== undefined) {

    const filePath = filePathArr[0];
    const fileType = filePath.split('.').pop();

    if (fileType === 'json' || fileType === 'sra') {
      const importedISRA = getJSON(filePath)
      return importedISRA
      
    } else if (fileType == 'xml') {
      return getXML(filePath)
    }
  }
};


let importedISRA;

let dialogWindow;

const loadData = async (win) => {

  const filePathArr = openFileDialog();

  importedISRA = await getISRA(filePathArr);
  
    function activateImportDialog() {
      dialogWindow = new BrowserWindow({
        width: 500,
        height: 500,
        autoHideMenuBar: true,
        icon: path.join(__dirname, '../asset/isra-app-icon-512.png'),
        menuBarVisibility: 'hidden',
        parent: getMainWindow(),
        modal: true,
        show: false,
        webPreferences: {
          preload: path.join(__dirname, './preload.js'),
          
        },
      });
      dialogWindow.loadFile(path.join(__dirname,'../tabs/Import/import_dialog.html'));

      
      dialogWindow.webContents.on('dom-ready', () => {
        dialogWindow.show()
        dialogWindow.webContents.send('import:load', importedISRA)
      });
    }

    if (importedISRA) {
      activateImportDialog(importedISRA)
    }
    

    

  }

  


/**
  * Download pdf file to selected path
  * @module downloadReport
  * @param {App} app Current Application
*/
const downloadReport = async (app) => {
  try{
    const options = {
      title: 'Save ISRA report - Electron ISRA Project',
      defaultPath: 'ISRA_ISRA report.pdf',
      buttonLabel: 'Save ISRA report',
      filters: [
        { name: 'PDF', extensions: ['pdf'] },
      ],
    };

    const fileName = await dialog.showSaveDialog(options);
    if (!fileName.canceled) {
      const { filePath } = fileName;

      const cssHeader = [], cssFooter = [];
      cssHeader.push('<style>');
      cssHeader.push('div { margin: 0px; padding: 0px; display: flex; justify-content: center; }');
      cssHeader.push('header { font-size:11px; font-weight:normal; font-family: Arial, Helvetica, sans-serif; }');
      cssHeader.push('</style>');
      const cssH = cssHeader.join('');

      cssFooter.push('<style>');
      cssFooter.push('h1 { font-weight: bold; font-size: 11px; color:rgb(255, 141, 0); text-align: center; margin: 0px; font-family: Arial, Helvetica, sans-serif; }');
      cssFooter.push('h2 { font-size:11px; font-weight:normal; margin: 0px; font-family: Arial, Helvetica, sans-serif; }');
      cssFooter.push('</style>');
      const cssF = cssFooter.join('');
      
      let name = '';
      const { projectName } = israProject;
      const classification = israProject.properties.ISRAmeta.classification;



      if (projectName === '') name = 'Project';
      else name = projectName;

      const pdfOptions = {
        pageSize: 'A4',
        printBackground: true,
        printSelectionOnly: true,
        landscape: false,
        displayHeaderFooter: true,
        headerTemplate: cssH + `<div><header>ISRA Report - ${projectName === '' ? '[Project Name]' : projectName}<header/></div>`,
        footerTemplate: cssF + 
        `<div>
            <h1>${classification.substring(0, classification.indexOf('{') + 1) + name + classification[classification.length - 1]}</h1><br>
            <h2 style="position: absolute; left: 10px; "><span class="pageNumber"></span>/<span class="totalPages"></span></h2>
        </div>
       `, 
       // in inches (1 inch = 2.54 cm)
        margins: {
          top: 0.5,
          bottom: 0.5,
          // right: 0,
          // left: 0
        } 
      };

      let win = new BrowserWindow({
        show: false,
        webPreferences: {
          preload: path.join(__dirname, './preload.js'),
        },
      });
      win.loadFile(path.join(__dirname, '../tabs/Report/report.html'));
      win.webContents.on('dom-ready', () => {
        newISRAProject(win, app);
      });

      win.webContents.on('did-finish-load', () => { 
        win.webContents.printToPDF(pdfOptions).then(data => {
          fs.writeFile(filePath, data, function (err) {
            if (err) {
              throw err; 
            } else {
              dialog.showMessageBoxSync(getMainWindow(), { message: `Successfully saved current ISRA report to ${filePath}.` });
            }
          });
        }).catch((err) => {
          console.log(err);
          dialog.showMessageBoxSync(getMainWindow(), { type: 'error', title: 'Invalid report', message: 'Failed to save current ISRA report.' });      
        });
      });
    }
  } catch(err){
    console.log(err);
    dialog.showMessageBoxSync(getMainWindow(), { type: 'error', title: 'Invalid report', message: 'Failed to save current ISRA report.' });
  }
};

module.exports = {
  validationErrors,
  loadFile,
  loadData,
  newISRAProject,
  downloadReport,
  exit,
  loadJSONFile,
  loadXMLFile
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
  useNewDecodeFileMethod,
  downloadFile
} = require('../../../lib/src/api/utility');

// Utility APIs (Common Functions)

ipcMain.on('utility:openURL', (event, url, userStatus) => {
  openUrl(url, userStatus);
});

// Welcome Tab
const {
  addTrackingRow,
  deleteTrackingRow,
  updateTrackingRow,
  updateProjectNameAndVersionRef,
  validateISRAmeta,
  getConfig,
  updateConfigOrg,
} = require('../../../lib/src/api/ISRAProject/handler-event');
const { renderWelcome } = require('../../../lib/src/api/ISRAProject/render-welcome');
const { importData } = require('./import')
ipcMain.on('import:sendImports', (event, data) => {

  importData(data,israProject,importedISRA)
  dialogWindow.close()
  getMainWindow().webContents.send('project:load', israProject.toJSON());
})
ipcMain.handle('render:welcome', () => renderWelcome());
ipcMain.handle('welcome:addTrackingRow', () => addTrackingRow(israProject));
ipcMain.handle('welcome:getConfig', () => getConfig());
ipcMain.handle('welcome:updateConfigOrg', (event, data) => updateConfigOrg(data));
ipcMain.handle('welcome:deleteTrackingRow', (event, iterations) => deleteTrackingRow(israProject, iterations));
ipcMain.on('welcome:updateTrackingRow', (event, rowData) => {
  updateTrackingRow(israProject, rowData);
});
ipcMain.on('welcome:updateProjectNameAndVersionRef', (event, field, value) => {
  updateProjectNameAndVersionRef(israProject, field, value);
});
ipcMain.on('validate:welcome', (event, arr) => {
  validateISRAmeta(israProject, arr);
});

// Project Context Tab
const {
  validateProjectContext,
} = require('../../../lib/src/api/ISRAProjectContext/handler-event');
const { renderProjectContext } = require('../../../lib/src/api/ISRAProjectContext/render-project-context');

/**
  * projectContextFileName: holds name of project descriptive document
*/
let projectContextFileName;

ipcMain.handle('render:projectContext', () => renderProjectContext());
ipcMain.on('projectContext:openURL', (event, url, userStatus) => {
  openUrl(url, userStatus);
});
ipcMain.handle('projectContext:urlPrompt', async (event, currentURL) => {
  const url = await urlPrompt(currentURL);
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
        israProject.israProjectContext.projectDescriptionAttachment = '';
        dialog.showMessageBoxSync(getMainWindow(), { type: 'error', title: 'Invalid Attachment', message: 'Invalid Project Descriptive Document' });
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
    const [fileName, base64data] = decodeFile(base64);
    projectContextFileName = fileName;
    israProject.israProjectContext.projectDescriptionAttachment = base64data;
    return projectContextFileName;
  } catch (err) {
    console.log(err);
    israProject.israProjectContext.projectDescriptionAttachment = '';
    dialog.showMessageBoxSync(getMainWindow(), { type: 'error', title: 'Invalid Attachment', message: 'Invalid Project Descriptive Document' });
    return 'Click here to attach a file';
  }
});

ipcMain.on('validate:projectContext', (event, arr) => {
  validateProjectContext(israProject, arr);
});

// Business Assets Tab
const {
  addBusinessAsset, deleteBusinessAsset, validateBusinessAsset, updateBusinessAsset,
} = require('../../../lib/src/api/Business Asset/handler-event');
const { renderBusinessAssets } = require('../../../lib/src/api/Business Asset/render-business-assets');

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
} = require('../../../lib/src/api/Supporting Asset/handler-event');
const { renderSupportingAssets } = require('../../../lib/src/api/Supporting Asset/render-supporting-assets');

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
ipcMain.on('supportingAssets:deleteBusinessAssetRef', (event, id, indexes) => deleteBusinessAssetRef(israProject, id, indexes, getMainWindow()));
ipcMain.handle('supportingAssets:updateBusinessAssetRef', (event, id, value, index) => updateBusinessAssetRef(israProject, id, value, index, getMainWindow()));

// Risks Tab
const { 
  addRisk,
  deleteRisk,
  updateRiskName,
  updateRiskLikelihood,
  updateRiskImpact,
  addRiskAttackPath,
  deleteRiskAttackPath,
  addVulnerabilityRef,
  deleteVulnerabilityRef,
  isRiskExist,
  validateRisks,
  updateRiskAttackPath,
  addRiskMitigation,
  deleteRiskMitigation,
  updateRiskMitigation,
  updateRiskManagement
} = require('../../../lib/src/api/Risk/handler-event');
const { renderRisks } = require('../../../lib/src/api/Risk/render-risks');
const jsonSchema = require('../../../lib/src/model/schema/json-schema');
const riskMitigationSchema = jsonSchema.properties.Risk.items.properties.riskMitigation.items.properties;

ipcMain.handle('render:risks', () => renderRisks());
ipcMain.handle('risks:addRisk', () => addRisk(israProject));
ipcMain.on('risks:deleteRisk', (event, ids) => deleteRisk(israProject, ids));
ipcMain.handle('risks:updateRiskName', (event, id, field, value) => {
  return updateRiskName(israProject, getMainWindow(), id, field, value);
});
ipcMain.handle('risks:updateRiskLikelihood', (event, id, field, value) => updateRiskLikelihood(israProject, id, field, value));
ipcMain.handle('risks:updateRiskImpact', (event, id, field, value) => updateRiskImpact(israProject, id, field, value));
ipcMain.handle('risks:addRiskAttackPath', (event, riskId) => addRiskAttackPath(israProject, riskId));
ipcMain.handle('risks:deleteRiskAttackPath', (event, riskId, ids) => deleteRiskAttackPath(israProject, riskId, ids));
ipcMain.handle('risks:updateRiskAttackPath', (event, riskId, riskAttackPathId, rowid, field, value) => updateRiskAttackPath(israProject, riskId, riskAttackPathId, rowid, field, value));
ipcMain.handle('risks:addRiskVulnerabilityRef', (event, riskId, riskAttackPathId, vulnerabilityId) => addVulnerabilityRef(israProject, riskId, riskAttackPathId, vulnerabilityId));
ipcMain.handle('risks:deleteRiskVulnerabilityRef', (event, riskId, riskAttackPathId, ids) => deleteVulnerabilityRef(israProject, riskId, riskAttackPathId, ids));
ipcMain.handle('risks:addRiskMitigation', (event, riskId) => addRiskMitigation(israProject, riskId));
ipcMain.handle('risks:deleteRiskMitigation', (event, riskId, ids) => deleteRiskMitigation(israProject, riskId, ids));
ipcMain.handle('risks:updateRiskMitigation', (event, riskId, riskMitigationId, field, value) => updateRiskMitigation(israProject, riskId, riskMitigationId, field, value));
ipcMain.handle('risks:updateRiskManagement', (event, riskId, field, value) => updateRiskManagement(israProject, riskId, field, value));
ipcMain.handle('risks:isRiskExist', (event, id) => isRiskExist(israProject, id));
ipcMain.handle('validate:risks', (event, currentRisk) => validateRisks(israProject, currentRisk));
ipcMain.handle('risks:expectedBenefitsOptions', () => riskMitigationSchema.benefits.anyOf);
ipcMain.handle('risks:mitigationDecisionOptions', () => riskMitigationSchema.decision.anyOf);


// Vulnerability Tab
const { addVulnerability, deleteVulnerability, updateVulnerability, validateVulnerabilities, isVulnerabilityExist } = require('../../../lib/src/api/Vulnerability/handler-event')
const { renderVulnerabilities } = require('../../../lib/src/api/Vulnerability/render-vulnerabilities');
const BusinessAssetProperties = require('../../../lib/src/model/classes/BusinessAsset/business-asset-properties');
ipcMain.handle('render:vulnerabilities', () => renderVulnerabilities());
ipcMain.handle('vulnerabilities:addVulnerability', () => addVulnerability(israProject));
ipcMain.on('vulnerabilities:deleteVulnerability', (event, ids) => deleteVulnerability(israProject, ids, getMainWindow()));
ipcMain.handle('vulnerabilities:updateVulnerability', (event, id, field, value) => {
  return updateVulnerability(israProject, id, field, value);
});
ipcMain.handle('vulnerabilities:urlPrompt', async (event, id, currentURL) => {
  const url = await urlPrompt(currentURL);
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
          vulnerabilityFileName = fileName;
          israProject.getVulnerability(id).vulnerabilityDescriptionAttachment = base64data;
          getMainWindow().webContents.send('vulnerabilities:fileName', fileName);
        }
      } catch (err) {
        console.log(err);
        const fileName = 'Click here to attach a file';
        israProject.getVulnerability(id).vulnerabilityDescriptionAttachment = '';
        dialog.showMessageBoxSync(getMainWindow(), { type: 'error', title: 'Invalid Attachment', message: `Vulnerability ${id}: Invalid Vulnerability Document` });
        getMainWindow().webContents.send('vulnerabilities:fileName', fileName);
      }
    },
  };

  if (israProject.getVulnerability(id).vulnerabilityDescriptionAttachment !== '') {
    return [
      attachLabel,
      {
        label: 'Save as',
        click: () => {
          const attachmentData = israProject.getVulnerability(id).vulnerabilityDescriptionAttachment;
          const fileName = useNewDecodeFileMethod(attachmentData);
          return saveAsFile(
            attachmentData,
            fileName,
          );
        },
      },
      {
        label: 'Remove',
        click: () => {
          const [fileName, base64data] = removeFile();
          israProject.getVulnerability(id).vulnerabilityDescriptionAttachment = base64data;
          getMainWindow().webContents.send('vulnerabilities:fileName', fileName);
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
    const [fileName, base64data] = decodeFile(base64);
    vulnerability.vulnerabilityDescriptionAttachment = base64data;
    return fileName;
  } catch (err) {
    console.log(err);
    israProject.getVulnerability(id).vulnerabilityDescriptionAttachment = '';
    dialog.showMessageBoxSync(getMainWindow(), { type: 'error', title: 'Invalid Attachment', message: `Vulnerability ${id}: Invalid Vulnerability Document` });
    return 'Click here to attach a file';
  }
});

ipcMain.handle('validate:vulnerabilities', (event, currentVulnerability) => validateVulnerabilities(israProject, currentVulnerability));
ipcMain.handle('vulnerabilities:isVulnerabilityExist', (event, id) => isVulnerabilityExist(israProject, id));
ipcMain.on('israreport:saveGraph',  (event,graph) => {

  const contextMenu = Menu.buildFromTemplate([{
    label: 'Save chart as image',
    click: () => downloadFile(
      graph
    ),
  }]);
  contextMenu.popup();

  

  
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
