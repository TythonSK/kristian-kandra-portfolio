import { translate } from './language.js';

export function initContact() {
  const copyStatus = document.querySelector('#copy-status');
  document.addEventListener('portfolio-language-change', () => {
    copyStatus.textContent = '';
  });

  document.querySelector('.copy-email').addEventListener('click', async () => {
    const email = document.querySelector('.email-link').getAttribute('href').slice('mailto:'.length);

    try {
      await navigator.clipboard.writeText(email);
      copyStatus.textContent = translate('E-mail skopírovaný', 'Email copied');
    } catch {
      copyStatus.textContent = `${translate('Skopíruj adresu ručne:', 'Copy the address manually:')} ${email}`;
    }
  });
}
