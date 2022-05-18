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

/* global $ Tabulator */

let trackingtable;

(() => {
  try {
    const result = window.render.welcome();
    const welcomeForm = document.forms[0];
    welcomeForm.innerHTML += result[0];
    // create Tabulator on DOM element with id "example-table"
    trackingtable = new Tabulator('#welcome__isra-meta-tracking__table', result[1]);
  } catch (err) {
    alert('Failed to load welcome tab');
  }
})();

const appVersion = (value) => {
  $('#details__app-version').val(`App Version: ${value}`);
};

const projectName = (value) => {
  $('#welcome__isra-meta__project-name').val(value);
};

const projectVersion = (value) => {
  $('#welcome__isra-meta__project-version').val(value);
};

const organization = (value) => {
  $('#welcome__isra-meta__organization').val(value);
};

const addTrackingRow = (tracking) => {
  trackingtable.addData([tracking]);
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.value = `${tracking.trackingIteration}`;
  checkbox.id = `welcome__isra-meta-tracking__checkbox${tracking.trackingIteration}`;
  checkbox.name = 'welcome__isra-meta-tracking__checkbox';
  $('#welcome__isra-meta-tracking__checkboxes').append(checkbox);
};

const iterationsHistory = (arr) => {
  trackingtable.clearData();
  $('#welcome__isra-meta-tracking__checkboxes').empty();

  arr.forEach((tracking) => {
    addTrackingRow(tracking);
  });
};

const updateWelcomeFields = (fetchedData) => {
  appVersion(fetchedData.appVersion);
  projectName(fetchedData.projectName);
  projectVersion(fetchedData.projectVersion);
  organization(fetchedData.projectOrganization);
  iterationsHistory(fetchedData.ISRAtracking);
};

window.project.load(async (event, data) => {
  updateWelcomeFields(await JSON.parse(data).ISRAmeta);
});

// events

document.getElementById('welcome__isra-meta-tracking__add').addEventListener('click', async (e) => {
  e.preventDefault();
  const rowData = await window.welcome.addTrackingRow();
  addTrackingRow(rowData);
});

const deleteTrackingRow = async (checkboxes) => {
  const checkedRows = [];
  checkboxes.forEach((box) => {
    if (box.checked) {
      checkedRows.push(box.value);
    }
  });
  if (checkedRows.length > 0) {
    trackingtable.getRows().forEach((row) => {
      window.welcome.updateTrackingRow(row.getData());
    });

    $('#welcome__isra-meta-tracking__checkboxes').empty();
    trackingtable.clearData();

    const data = await window.welcome.deleteTrackingRow(checkedRows);
    data.forEach((row) => {
      addTrackingRow(row);
    });
  }
};

document.getElementById('welcome__isra-meta-tracking__delete').addEventListener('click', async (e) => {
  e.preventDefault();
  const checkboxes = document.getElementsByName('welcome__isra-meta-tracking__checkbox');
  deleteTrackingRow(checkboxes);
});
