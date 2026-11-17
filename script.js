const contentDialog = document.querySelector('#content-dialog');
const dialogContent = document.querySelector('#dialog-content');
const closeDialogButton = document.querySelector('.dialog-close');
const externalConfirmDialog = document.querySelector('#external-confirm-dialog');
const externalConfirmMessage = document.querySelector('#external-confirm-message');
const externalConfirmCancel = document.querySelector('#external-confirm-cancel');
const externalConfirmProceed = document.querySelector('#external-confirm-proceed');
const contentTriggers = document.querySelectorAll('a[href*="?content="]');
const sourcePanels = document.querySelectorAll('.library-panel');

function contentIdFromLink(link) {
  const url = new URL(link.href);
  return url.searchParams.get('content') || url.hash.slice(1);
}

function contentUrl(targetId) {
  const url = new URL(window.location.href);
  url.searchParams.set('content', targetId);
  url.hash = '';
  return url;
}

function listUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete('content');
  url.hash = '';
  return url;
}

function openContentById(targetId, options = {}) {
  const source = document.getElementById(targetId);
  if (!source) return false;

  const copy = source.cloneNode(true);
  copy.removeAttribute('id');
  copy.querySelectorAll('a[href="#programs"], a[href="#stories"], a[href="#resources"]').forEach((link) => link.remove());
  dialogContent.replaceChildren(copy);
  if (options.updateHistory !== false) {
    history.pushState({ content: targetId }, '', contentUrl(targetId));
  }
  if (!contentDialog.open) contentDialog.showModal();
  closeDialogButton.focus();
  return true;
}

function openContentDialog(trigger) {
  openContentById(contentIdFromLink(trigger));
}

function closeContent(options = {}) {
  if (contentDialog.open) contentDialog.close();
  if (options.updateHistory !== false) {
    history.pushState({}, '', listUrl());
  }
}

contentTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openContentDialog(trigger);
  });
});

sourcePanels.forEach((panel) => {
  panel.tabIndex = 0;
  panel.setAttribute('role', 'button');
  panel.setAttribute('aria-label', `查看內容：${panel.querySelector('h3')?.textContent || '詳細資料'}`);
  panel.addEventListener('click', (event) => {
    if (event.target.closest('a, button, iframe')) return;
    openContentById(panel.id);
  });
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openContentById(panel.id);
    }
  });
});

dialogContent.addEventListener('click', (event) => {
  const nestedLink = event.target.closest('a[href*="content="], a[href^="#"]');
  if (!nestedLink) return;
  event.preventDefault();
  openContentById(contentIdFromLink(nestedLink));
});

document.addEventListener('click', (event) => {
  const externalArticleLink = event.target.closest('a.confirm-external');
  if (!externalArticleLink) return;

  event.preventDefault();
  externalConfirmMessage.textContent = externalArticleLink.dataset.confirm || '您即將離開本站並開啟外部內容。';
  externalConfirmProceed.href = externalArticleLink.href;
  externalConfirmDialog.showModal();
  externalConfirmCancel.focus();
});

externalConfirmCancel.addEventListener('click', () => externalConfirmDialog.close());
externalConfirmProceed.addEventListener('click', () => externalConfirmDialog.close());
externalConfirmDialog.addEventListener('click', (event) => {
  if (event.target === externalConfirmDialog) externalConfirmDialog.close();
});

closeDialogButton.addEventListener('click', () => closeContent());
contentDialog.addEventListener('click', (event) => {
  if (event.target === contentDialog) closeContent();
});
contentDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeContent();
});

window.addEventListener('popstate', () => {
  const targetId = new URL(window.location.href).searchParams.get('content');
  if (targetId) openContentById(targetId, { updateHistory: false });
  else closeContent({ updateHistory: false });
});

const initialContentId = new URL(window.location.href).searchParams.get('content');
if (initialContentId && !openContentById(initialContentId, { updateHistory: false })) {
  history.replaceState({}, '', listUrl());
}
