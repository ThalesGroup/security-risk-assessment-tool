/*----------------------------------------------------------------------------
*
*     Copyright © 2025 THALES. All Rights Reserved.
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

jest.mock('electron', () => {
  const browserWindowStub = { webContents: { send: jest.fn() }, title: '' };
  const dialog = { showMessageBoxSync: jest.fn() };
  const ipcStub = {
    handle: jest.fn(),
    on: jest.fn(),
    once: jest.fn(),
    removeHandler: jest.fn(),
  };
  const menuStub = {
    buildFromTemplate: jest.fn(() => ({ popup: jest.fn(), getMenuItemById: jest.fn(() => ({ submenu: { getMenuItemById: jest.fn(() => ({ submenu: { items: [] } })) } })) })),
    setApplicationMenu: jest.fn(),
  };
  return {
    dialog,
    ipcMain: ipcStub,
    Menu: menuStub,
    BrowserWindow: { fromId: jest.fn(() => browserWindowStub) },
  };
}, { virtual: true });

process.env.MAIN_WINDOW_ID = '1';

jest.mock('../../../src/api/index', () => ({
  DataStore: jest.fn(),
  DataLoad: jest.fn(),
  DataNew: jest.fn(),
  XML2JSON: jest.fn(() => {
    throw new Error('Failed to validate json against schema at:[{"instancePath":"/Vulnerability/11/supportingAssetRef","message":"must be integer"}]');
  }),
}));

const { dialog } = require('electron');
const { loadXMLFile } = require('../../../../app/src/electron/request-handlers');

describe('loadXMLFile error handling', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  beforeEach(() => {
    dialog.showMessageBoxSync.mockClear();
  });

  test('displays validation error when XML import fails', () => {
    const win = { webContents: { send: jest.fn() } };

    loadXMLFile(win, '/fake/path.xml');
    const [, options] = dialog.showMessageBoxSync.mock.calls[0];

    expect(options).toEqual(expect.objectContaining({
      title: 'Invalid File Opened',
      message: expect.stringContaining('supportingAssetRef'),
    }));
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });
});
