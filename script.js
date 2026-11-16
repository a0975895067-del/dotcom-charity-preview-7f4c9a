const contentDialog = document.querySelector('#content-dialog');
const dialogContent = document.querySelector('#dialog-content');
const closeDialogButton = document.querySelector('.dialog-close');
const contentTriggers = document.querySelectorAll('.clickable-card, .resource-grid > a, .mini-list > a');
const sourcePanels = document.querySelectorAll('.library-panel');

function openContentById(targetId) {
  const source = document.getElementById(targetId);
  if (!source) return;

  const copy = source.cloneNode(true);
  copy.removeAttribute('id');
  copy.querySelectorAll('a[href="#programs"], a[href="#stories"], a[href="#resources"]').forEach((link) => link.remove());
  dialogContent.replaceChildren(copy);
  history.replaceState(null, '', `#${targetId}`);
  contentDialog.showModal();
  closeDialogButton.focus();
}

function openContentDialog(trigger) {
  openContentById(new URL(trigger.href).hash.slice(1));
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
  const nestedLink = event.target.closest('a[href^="#"]');
  if (!nestedLink) return;
  event.preventDefault();
  openContentById(new URL(nestedLink.href).hash.slice(1));
});

closeDialogButton.addEventListener('click', () => contentDialog.close());
contentDialog.addEventListener('click', (event) => {
  if (event.target === contentDialog) contentDialog.close();
});
