const languageKey = 'portfolio-language';
let portfolioLanguage = 'sk';
try {
  if (localStorage.getItem(languageKey) === 'en') portfolioLanguage = 'en';
} catch {
  // The switch still works when browser storage is unavailable.
}

export function translate(slovak, english) {
  return portfolioLanguage === 'en' ? english : slovak;
}

export function getLanguage() {
  return portfolioLanguage;
}

export function initLanguage() {
  const languageToggle = document.querySelector('.language-toggle');
  const translations = [];
  for (const attribute of ['text', 'aria-label', 'alt', 'title', 'content']) {
    const selector = attribute === 'text' ? 'data-en' : `data-en-${attribute}`;
    for (const element of document.querySelectorAll(`[${selector}]`)) {
      const slovak = attribute === 'text' ? element.textContent : element.getAttribute(attribute);
      translations.push({ element, attribute, slovak, english: element.getAttribute(selector) });
    }
  }

  function applyPortfolioLanguage() {
    document.documentElement.lang = portfolioLanguage;
    for (const { element, attribute, slovak, english } of translations) {
      const value = translate(slovak, english);
      if (attribute === 'text') element.textContent = value;
      else element.setAttribute(attribute, value);
    }
    languageToggle.textContent = translate('EN', 'SK');
    languageToggle.setAttribute('aria-label', translate('Prepnúť na angličtinu', 'Switch to Slovak'));
    document.dispatchEvent(new Event('portfolio-language-change'));
  }

  languageToggle.addEventListener('click', () => {
    portfolioLanguage = translate('en', 'sk');
    try {
      localStorage.setItem(languageKey, portfolioLanguage);
    } catch {
      // The selected language remains active for the current page.
    }
    applyPortfolioLanguage();
  });

  applyPortfolioLanguage();
  languageToggle.hidden = false;
}
