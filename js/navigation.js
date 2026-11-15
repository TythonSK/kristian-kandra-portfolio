import { translate } from './language.js';

export function initNavigation() {
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');

  function setMenuOpen(open) {
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? translate('Zavrieť menu', 'Close menu') : translate('Otvoriť menu', 'Open menu'));
    navigation.classList.toggle('open', open);
  }

  menu.addEventListener('click', () => setMenuOpen(menu.getAttribute('aria-expanded') !== 'true'));
  setMenuOpen(false);

  for (const link of navigation.querySelectorAll('a')) {
    link.addEventListener('click', () => setMenuOpen(false));
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      setMenuOpen(false);
      menu.focus();
    }
  });

  document.addEventListener('click', event => {
    if (navigation.classList.contains('open') && !event.target.closest('.header')) {
      setMenuOpen(false);
    }
  });

  document.addEventListener('portfolio-language-change', () => {
    setMenuOpen(menu.getAttribute('aria-expanded') === 'true');
  });
}
