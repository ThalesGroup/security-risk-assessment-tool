/*----------------------------------------------------------------------------
*
*     Copyright © 2022-2025 THALES. All Rights Reserved.
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

/* global $ Chart */
const { SEVERITY_COLORS = {}, SEVERITY_CONTRAST_COLORS = {} } = window.COLOR_CONSTANTS || {};

const LEVELS = ['Critical', 'High', 'Medium', 'Low'];
const LEVEL_COLOR = {
  Critical: SEVERITY_COLORS.CRITICAL,
  High: SEVERITY_COLORS.HIGH,
  Medium: SEVERITY_COLORS.MEDIUM,
  Low: SEVERITY_COLORS.LOW,
};
const LEVEL_CONTRAST = {
  Critical: SEVERITY_CONTRAST_COLORS.CRITICAL,
  High: SEVERITY_CONTRAST_COLORS.HIGH,
  Medium: SEVERITY_CONTRAST_COLORS.MEDIUM,
  Low: SEVERITY_CONTRAST_COLORS.LOW,
};

// Mirror of lib calculateResidualRiskLevel thresholds (0-20 scale).
const scoreToLevel = (score) => {
  if (score === null || score === undefined) return null;
  if (score <= 5) return 'Low';
  if (score <= 10) return 'Medium';
  if (score <= 15) return 'High';
  return 'Critical';
};

// Chart.js instances kept so we can destroy before re-rendering on reload/iteration.
const charts = {};
const drawChart = (id, config) => {
  if (charts[id]) charts[id].destroy();
  const el = document.getElementById(id);
  if (el) charts[id] = new Chart(el, config);
};

const noAnim = { animation: { duration: 0 }, responsive: true, maintainAspectRatio: false };

const renderDashboard = (data) => {
  const {
    BusinessAsset = [],
    SupportingAsset = [],
    Vulnerability = [],
    Risk = [],
    ISRAmeta = {},
  } = data;
  const { projectName = '', projectVersion = '', iteration = '', ISRAtracking = [] } = ISRAmeta;

  $('#db-name').text(projectName === '' ? '[Project Name]' : projectName);
  $('#db-version').text(projectVersion);
  $('#db-iteration').text(ISRAtracking.length);
  $('#db-revision').text(iteration);

  // Empty state: nothing meaningful to visualise yet.
  const isEmpty = Risk.length === 0 && BusinessAsset.length === 0
    && SupportingAsset.length === 0 && Vulnerability.length === 0;
  $('#db-empty').toggle(isEmpty);
  $('#db-body').toggle(!isEmpty);
  if (isEmpty) return;

  // ---- KPI cards ----
  let untreated = 0;
  let totalCost = 0;
  Risk.forEach((risk) => {
    if (!risk.riskManagementDecision) untreated += 1;
    (risk.riskMitigation || []).forEach((m) => {
      if (m.decision === 'Accepted' && m.cost !== null) totalCost += m.cost;
    });
  });

  $('#kpi-business-assets').text(BusinessAsset.length);
  $('#kpi-supporting-assets').text(SupportingAsset.length);
  $('#kpi-vulnerabilities').text(Vulnerability.length);
  $('#kpi-risks').text(Risk.length);
  $('#kpi-untreated').text(untreated);
  $('#kpi-cost').text(totalCost);

  // ---- aggregations ----
  const residualByLevel = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  const inherentByLevel = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  const treatment = {};
  Risk.forEach((risk) => {
    const resLevel = risk.residualRiskLevel || scoreToLevel(risk.residualRiskScore);
    if (residualByLevel[resLevel] !== undefined) residualByLevel[resLevel] += 1;

    const inhLevel = scoreToLevel(risk.inherentRiskScore);
    if (inherentByLevel[inhLevel] !== undefined) inherentByLevel[inhLevel] += 1;

    const decision = risk.riskManagementDecision || 'Untreated';
    treatment[decision] = (treatment[decision] || 0) + 1;
  });

  // ---- severity doughnut ----
  drawChart('severityChart', {
    type: 'doughnut',
    data: {
      labels: LEVELS,
      datasets: [{
        data: LEVELS.map((l) => residualByLevel[l]),
        backgroundColor: LEVELS.map((l) => LEVEL_COLOR[l]),
      }],
    },
    options: { ...noAnim, plugins: { legend: { position: 'right' } } },
  });

  // ---- inherent vs residual (risk reduction) ----
  drawChart('reductionChart', {
    type: 'bar',
    data: {
      labels: LEVELS,
      datasets: [
        {
          label: 'Inherent',
          data: LEVELS.map((l) => inherentByLevel[l]),
          backgroundColor: '#8a8a8a',
        },
        {
          label: 'Residual',
          data: LEVELS.map((l) => residualByLevel[l]),
          backgroundColor: LEVELS.map((l) => LEVEL_COLOR[l]),
        },
      ],
    },
    options: {
      ...noAnim,
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });

  // ---- treatment decisions ----
  const treatmentLabels = Object.keys(treatment);
  drawChart('treatmentChart', {
    type: 'bar',
    data: {
      labels: treatmentLabels,
      datasets: [{
        label: 'Risks',
        data: treatmentLabels.map((k) => treatment[k]),
        backgroundColor: '#4f7bc0',
      }],
    },
    options: {
      ...noAnim,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });

  // ---- top 5 residual risks ----
  const $tbody = $('#db-top-risks tbody');
  $tbody.empty();
  const ranked = Risk
    .filter((r) => r.residualRiskScore !== null && r.residualRiskScore !== undefined)
    .sort((a, b) => b.residualRiskScore - a.residualRiskScore)
    .slice(0, 5);

  if (ranked.length === 0) {
    $tbody.append('<tr><td colspan="4" style="text-align:center;">No scored risks yet.</td></tr>');
  } else {
    ranked.forEach((risk) => {
      const level = risk.residualRiskLevel || scoreToLevel(risk.residualRiskScore);
      const bg = LEVEL_COLOR[level] || '#999';
      const fg = LEVEL_CONTRAST[level] || '#fff';
      $tbody.append(`<tr>
        <td>${risk.riskId}</td>
        <td class="text-wrap">${risk.riskName || ''}</td>
        <td>${risk.residualRiskScore}/20</td>
        <td><span class="level-chip" style="background:${bg}; color:${fg};">${level}</span></td>
      </tr>`);
    });
  }
};

(() => {
  try {
    // Prevent Ctrl+R reload (consistent with other tabs).
    const handleReload = (event) => {
      if (event.ctrlKey && event.key === 'r') event.preventDefault();
    };
    window.addEventListener('keydown', handleReload);
    disableAllTabs();

    $(document).ready(() => {
      window.project.load(async (event, data) => {
        const parsed = await JSON.parse(data);
        renderDashboard(parsed);
      });
      enableAllTabs();
    });
  } catch (err) {
    alert('Failed to load dashboard tab');
  }
})();
