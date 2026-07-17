// XSS guards. Every user-controlled string reaching an HTML sink (jQuery
// .append/.html, element.innerHTML, Tabulator formatter return values that
// Tabulator renders as innerHTML) must pass through one of these:
//   - escapeHtml: plain-text fields (names, levels, decisions). Renders the
//     value as literal characters.
//   - sanitizeHtml: htmlString-format fields (rich text from the editor —
//     riskManagementDetail, mitigation description/decisionDetail). Strips
//     <script>, on* handlers, javascript: URLs while keeping safe formatting
//     tags. Falls back to escape if DOMPurify isn't loaded on the page.
function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[c];
  });
}
function sanitizeHtml(html) {
  if (typeof DOMPurify !== 'undefined' && DOMPurify && typeof DOMPurify.sanitize === 'function') {
    return DOMPurify.sanitize(String(html == null ? '' : html));
  }
  return escapeHtml(html);
}

function disableAllTabs() {
  document.querySelector('button.tab-button[data-id="welcome"]').disabled = true;
  document.querySelector('button.tab-button[data-id="project-context"]').disabled = true;
  document.querySelector('button.tab-button[data-id="business-assets"]').disabled = true;
  document.querySelector('button.tab-button[data-id="supporting-assets"]').disabled = true;
  document.querySelector('button.tab-button[data-id="risks"]').disabled = true;
  document.querySelector('button.tab-button[data-id="vulnerabilities"]').disabled = true;
  document.querySelector('button.tab-button[data-id="isra-report"]').disabled = true;
}

function enableAllTabs() {
  document.querySelector('button.tab-button[data-id="welcome"]').disabled = false;
  document.querySelector('button.tab-button[data-id="project-context"]').disabled = false;
  document.querySelector('button.tab-button[data-id="business-assets"]').disabled = false;
  document.querySelector('button.tab-button[data-id="supporting-assets"]').disabled = false;
  document.querySelector('button.tab-button[data-id="risks"]').disabled = false;
  document.querySelector('button.tab-button[data-id="vulnerabilities"]').disabled = false;
  document.querySelector('button.tab-button[data-id="isra-report"]').disabled = false;
}