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

function escapeHTML(value) {
  const entityMap = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;',
    "'": '&#39;', '/': '&#x2F;', '`': '&#x60;', '=': '&#x3D;',
  };
  return String(value == null ? '' : value).replace(/[&<>"'`=/]/g, (s) => entityMap[s]);
}

const RICH_TEXT_EDITOR_DEFAULTS = {
  showToolbar: true,
  toolbar: 'undo redo',
  menubar: false,
  statusbar: false,
  allowImages: false,
  allowLinks: false,
  height: 300,
  cellMaxHeight: 300,
};

const RICH_TEXT_MODAL_ID = 'global-rich-text-modal';
const RICH_TEXT_EDITOR_ID = 'global-rich-text-modal__editor';

let richTextEditorConfigKey = null;
let richTextEditorReady = null;

function getOrCreateRichTextModal() {
  let modal = document.getElementById(RICH_TEXT_MODAL_ID);

  if (!modal) {
    modal = document.createElement('div');
    modal.id = RICH_TEXT_MODAL_ID;
    modal.className = 'rich-text-modal';
    modal.hidden = true;

    modal.innerHTML = `
      <div class="rich-text-modal__backdrop"></div>
      <div class="rich-text-modal__box">
        <textarea id="${RICH_TEXT_EDITOR_ID}"></textarea>
        <div class="rich-text-modal__actions">
         <button type="button" id="${RICH_TEXT_MODAL_ID}__confirm">
            Confirm
          </button>
          <button type="button" id="${RICH_TEXT_MODAL_ID}__cancel">
            Cancel
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  return modal;
}

function cleanRichTextContent(html, opts) {
  const container = document.createElement('div');

  container.innerHTML = html || '';

  if (!opts.allowImages) {
    container
      .querySelectorAll('img, picture, source')
      .forEach((element) => {
        element.remove();
      });
  }

  if (!opts.allowLinks) {
    container
      .querySelectorAll('a')
      .forEach((link) => {
        link.replaceWith(...link.childNodes);
      });
  }

  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT
  );

  let textNode;

  while ((textNode = walker.nextNode())) {
    textNode.nodeValue = textNode.nodeValue.replace(/\u00A0/g, ' ');
  }

  return container.innerHTML;
}

function richTextToPlainText(html) {
  let value = String(html || '');

  value = value
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '');

  const decoder = document.createElement('textarea');

  decoder.innerHTML = value;

  value = decoder.value;

  value = value
    .replace(/\u00A0/g, ' ')
    .replace(/\n{3,}/g, '\n\n');

  return value.trim();
}

function openRichTextCellEditor(cell, options) {
  const opts = Object.assign(
    {},
    RICH_TEXT_EDITOR_DEFAULTS,
    options || {}
  );

  const modal = getOrCreateRichTextModal();

  const showModalWithContent = () => {
    const editor = hugerte.get(RICH_TEXT_EDITOR_ID);

    const cleanedContent = cleanRichTextContent(
      cell.getValue() || '',
      opts
    );

    editor.setContent(cleanedContent);

    modal.hidden = false;
  };

  document.getElementById(
    `${RICH_TEXT_MODAL_ID}__confirm`
  ).onclick = () => {
    const editor = hugerte.get(RICH_TEXT_EDITOR_ID);

    const cleanedContent = cleanRichTextContent(
      editor.getContent(),
      opts
    );

    cell.setValue(cleanedContent, true);

    modal.hidden = true;

    cell.getRow().normalizeHeight();
  };

  document.getElementById(
    `${RICH_TEXT_MODAL_ID}__cancel`
  ).onclick = () => {
    modal.hidden = true;
  };

  const configKey = JSON.stringify(opts);

  if (
    richTextEditorConfigKey === configKey &&
    richTextEditorReady
  ) {
    richTextEditorReady.then(showModalWithContent);
    return;
  }

  const reinit = () => {
    richTextEditorConfigKey = configKey;

    richTextEditorReady = hugerte.init({
      selector: `#${RICH_TEXT_EDITOR_ID}`,
      height: opts.height,
      resize: false,
      toolbar: opts.showToolbar
        ? opts.toolbar
        : false,
      menubar: opts.menubar,
      statusbar: opts.statusbar,
      pad_empty_with_br: true,
      newline_behavior: 'linebreak',
      paste_data_images: opts.allowImages,

      content_style: `
        html,
        body {
          height: auto;
        }
        body {
          margin: 8px;
          line-height: 1.15;
          overflow-wrap: anywhere;
          word-break: break-word;
          overflow-y: auto;
          overflow-x: hidden;
        }
        p,
        div {
          margin-top: 0;
          margin-bottom: 0;
        }
      `,

      setup: (editor) => {
        editor.on('PastePreProcess', (e) => {
          e.content = cleanRichTextContent(
            e.content,
            opts
          );
        });
      },
    });

    richTextEditorReady.then(showModalWithContent);
  };

  if (richTextEditorReady) {
    const existingEditor = hugerte.get(
      RICH_TEXT_EDITOR_ID
    );

    if (existingEditor) {
      existingEditor.remove();
    }
  }

  reinit();
}

function createRichTextCellFormatter(cell, options) {
  const opts = Object.assign(
    {},
    RICH_TEXT_EDITOR_DEFAULTS,
    options || {}
  );

  const preview = document.createElement('div');

  preview.className = 'rich-text-cell-preview';
  preview.title = 'Click to edit';

  preview.style.whiteSpace = 'pre-wrap';
  preview.style.overflowWrap = 'anywhere';
  preview.style.wordBreak = 'break-word';
  preview.style.width = '100%';
  preview.style.maxWidth = '100%';
  preview.style.minWidth = '0';
  preview.style.boxSizing = 'border-box';
  preview.style.lineHeight = '1.15';

  preview.style.height = 'auto';
  preview.style.maxHeight = `${opts.cellMaxHeight || 100}px`;
  preview.style.overflowY = 'auto';
  preview.style.overflowX = 'hidden';

  preview.textContent = richTextToPlainText(
    cell.getValue()
  );

  preview.addEventListener('click', (e) => {
    e.stopPropagation();

    openRichTextCellEditor(
      cell,
      options
    );
  });

  return preview;
}