const contentDialog = document.querySelector('#content-dialog');
const dialogContent = document.querySelector('#dialog-content');
const closeDialogButton = document.querySelector('.dialog-close');
const contentTriggers = document.querySelectorAll('.clickable-card, .resource-grid > a');

function openContentDialog(trigger) {
  const targetId = new URL(trigger.href).hash.slice(1);
  const source = document.getElementById(targetId);
  if (!source) return;

  const copy = source.cloneNode(true);
  copy.removeAttribute('id');
  copy.querySelectorAll('a[href^="#"]').forEach((link) => link.remove());
  dialogContent.replaceChildren(copy);
  history.replaceState(null, '', `#${targetId}`);
  contentDialog.showModal();
  closeDialogButton.focus();
}

contentTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    openContentDialog(trigger);
  });
});

closeDialogButton.addEventListener('click', () => contentDialog.close());
contentDialog.addEventListener('click', (event) => {
  if (event.target === contentDialog) contentDialog.close();
});
