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
  app, BrowserWindow, Menu,
} = require('electron');
const path = require('path');
const {
  validationErrors,
  loadFile,
  loadData,
  newISRAProject,
  downloadReport,
  exit,
  loadJSONFile,
  loadXMLFile,
  setPreferencesWindow
} = require('./request-handlers');

const JWKEncryptionMapping = require('../../../lib/src/api/check-encryption/encryption-mapping');

// Set every option of Key generator for preferences
let algOptions = []
JWKEncryptionMapping.alg.values.map((algorithm) => (
  algOptions.push({
    label: algorithm.name,
    value: algorithm.name
  })
))

// Set every option of encryption algorithm for preferences
let encOptions = []
JWKEncryptionMapping.enc.values.map((algorithm) => (
  encOptions.push({
    label: algorithm.name,
    value: algorithm.name
  })
))

app.disableHardwareAcceleration();

let preferencesWindow
const ElectronPreferences = require('electron-preferences');

function createPreferencesWindow() {
  const preferences = new ElectronPreferences({
	  // Override default preference BrowserWindow values
    browserWindowOverrides: { /* ... */ },
	
	  // Create an optional menu bar
	  menu: Menu.buildFromTemplate([
      {
        label: 'Window',
        role: 'window',
        submenu: [
          {
            label: 'Close',
            accelerator: 'CmdOrCtrl+W',
            role: 'close',
          },
        ],
      },
    ]),
  
	  // Provide a custom CSS file, relative to your appPath.
	  //css: 'preference-styles.css',

	  // Preference file path
	  dataStore: 'data/preferences.json', // defaults to <userData>/preferences.json

	  // Preference default values
	  defaults: { 
	  	encryption: {
	  		alg: 'PBES2-HS256+A128KW',
        p2c: 600000,
        enc: 'A128GCM',
	  	},
	   },

	  // Preference sections visible to the UI
	  sections: [
	  	{
	  		id: 'encryption',
	  		label: 'Encryption',
	  		icon: 'single-01', // See the list of available icons below
	  		form: {
	  			groups: [
	  				{
	  					'label': 'Key Generation', // optional
	  					'fields': [
	  						{
	  							label: 'Key Generator Algorithm',
	  							key: 'alg',
	  							type: 'radio',
	  							help: 'Algorithm that will create an encryption key wrapper for esra file',
                  options: algOptions
	  						},
                {
	  							label: 'Iteration Count',
	  							key: 'p2c',
	  							type: 'number',
	  							help: 'Number of encryptions for the key',
                  hideFunction: (preferences) => {
                    // hide when sectionsEnabler.group2 preference is false  
                    return !(['PBES2-HS256+A128KW','PBES2-HS384+A192KW','PBES2-HS512+A256KW'].includes(preferences.encryption?.alg));
                  }
	  						},
	  					]
	  				},
            {
	  					'label': 'Encryption Algorithm', // optional
	  					'fields': [
                {
	  							label: 'Encryption Algorithm',
	  							key: 'enc',
	  							type: 'radio',
	  							help: 'Algorithm that will encrypt an esra file',
                  options: encOptions
	  						},
	  					]
	  				},
	  			]
	  		}
	  	},
	  ],
  })

  // Subscribing to preference changes.
  preferences.on('save', (preferences) => {
    console.log(`Preferences were saved.`, JSON.stringify(preferences, null, 4));
  });

  // Using a button field with `channel: 'reset'`
  preferences.on('click', (key) => {
    if (key === 'resetButton') {
      resetApp();
    }
  });

  preferences.on('close', (e) => {
    e.preventDefault()
    preferences.hide()
  });
  setPreferencesWindow(preferences)
  return preferences
}

function createWindow() {
  const win = new BrowserWindow({
    // width: 850,
    // height: 600,
    minWidth: 850,
    icon: path.join(__dirname, '../asset/isra-app-icon-512.png'),
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
    },
  });

  win.maximize();
  win.loadFile(path.join(__dirname, '../tabs/Welcome/welcome.html'));

  // send data to populate into dom fields
  win.webContents.on('dom-ready', () => {
    newISRAProject(win, app);
  });

  win.on('close', (e) => {
    exit(e, app);
  });

  // save current window at runtime
  process.env.MAIN_WINDOW_ID = win.id;

  // header menu
  const mainMenuTemplate = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Save',
          click: () => validationErrors('Save'),
          accelerator: 'CmdOrCtrl+S',
        },
        {
          label: 'Save As',
          click: () => validationErrors('Save As'),
        },
        {
          label: 'Encrypt As',
          click: () => validationErrors('Encrypt As'),
        },
        {
          label: 'Open File',
          click: () => loadFile(win),
        },
        {
          label: 'Import Data',
          click: () => loadData(win),
        },
        {
          label: 'Print',
          click: () => downloadReport(app),
        },
        {
          role: 'quit',
          accelerator: 'CmdOrCtrl+Q',
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
      ],
    },

    // for development
    {
      label: 'Window',
      submenu: [
        { role: 'toggleDevTools' },
        { role: 'togglefullscreen' },
        { role: 'reload' },
      ],
    },
    {
      label: 'Settings',
      submenu: [
        {
          label: 'Preferences',
          click: () => preferencesWindow.show(),
        },
      ],
    },
  ];

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

let filePath = '';


app.on('open-file', function(event, path) {
  event.preventDefault();
  filePath = path;

  
  
})

if (process.argv.length >= 2) { 
  filePath = process.argv[1];

}



app.whenReady().then(() => {

  createWindow();
  preferencesWindow = createPreferencesWindow();
  const getMainWindow = () => {
    const ID = process.env.MAIN_WINDOW_ID * 1;
    return BrowserWindow.fromId(ID);
  };

  if (filePath !== '.') {
    const fileType = filePath.split('.').pop();
    if (fileType === 'json' || fileType === 'sra') loadJSONFile(getMainWindow(), filePath);
    else if (fileType === 'xml') loadXMLFile(getMainWindow(), filePath);

    
  }


  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
