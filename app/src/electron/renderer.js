const { ipcRenderer } = require('electron');

document.getElementById('send').addEventListener('click', () => {
    let checkboxes = document.querySelectorAll('input[type=checkbox]');
    let values = [];
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        values.push(checkbox.value)
      }
    });
    
    ipcRenderer.send('checkmate', values);

  });

