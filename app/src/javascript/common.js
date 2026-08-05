function disableAllTabs() {
  const dashboardBtn = document.querySelector('button.tab-button[data-id="dashboard"]');
  if (dashboardBtn) dashboardBtn.disabled = true;
  document.querySelector('button.tab-button[data-id="welcome"]').disabled = true;
  document.querySelector('button.tab-button[data-id="project-context"]').disabled = true;
  document.querySelector('button.tab-button[data-id="business-assets"]').disabled = true;
  document.querySelector('button.tab-button[data-id="supporting-assets"]').disabled = true;
  document.querySelector('button.tab-button[data-id="risks"]').disabled = true;
  document.querySelector('button.tab-button[data-id="vulnerabilities"]').disabled = true;
  document.querySelector('button.tab-button[data-id="isra-report"]').disabled = true;
}

function enableAllTabs() {
  const dashboardBtn = document.querySelector('button.tab-button[data-id="dashboard"]');
  if (dashboardBtn) dashboardBtn.disabled = false;
  document.querySelector('button.tab-button[data-id="welcome"]').disabled = false;
  document.querySelector('button.tab-button[data-id="project-context"]').disabled = false;
  document.querySelector('button.tab-button[data-id="business-assets"]').disabled = false;
  document.querySelector('button.tab-button[data-id="supporting-assets"]').disabled = false;
  document.querySelector('button.tab-button[data-id="risks"]').disabled = false;
  document.querySelector('button.tab-button[data-id="vulnerabilities"]').disabled = false;
  document.querySelector('button.tab-button[data-id="isra-report"]').disabled = false;
}