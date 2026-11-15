import { projects } from './data/projects.js';
import { getLanguage, translate } from './language.js';

export function initProjects() {
  const projectGrid = document.querySelector('#project-grid');
  const projectCount = document.querySelector('#project-count');
  const filters = document.querySelectorAll('.filter');
  const dialog = document.querySelector('#project-dialog');
  const dialogContent = document.querySelector('#dialog-content');
  let activeTrigger;

  function localiseProject(project) {
    return getLanguage() === 'en' ? { ...project, ...project.en } : project;
  }

  function createProjectCard(project) {
    const article = document.createElement('article');
    article.classList.add('project-card');
    article.classList.toggle('project-featured', Boolean(project.featured));
    article.dataset.category = project.category;

    const posterClass = project.featured ? ' project-poster' : '';
    const actionLabel = project.featured ? translate('Detail projektu ', 'Project details ') : '';
    const technologies = project.tech.slice(0, 3).map(technology => `<span>${technology}</span>`).join('');

    article.innerHTML = `
      <button class="project-open" data-project="${project.id}" aria-label="${translate('Otvoriť detail projektu', 'Open project details for')} ${project.name}">
        <span class="project-visual${posterClass}">
          <img src="${project.cover}" alt="${project.coverAlt ?? ''}" loading="lazy" decoding="async">
        </span>
        <span class="project-card-copy">
          <span class="project-meta"><span>${project.type}</span><span>${project.date}</span></span>
          <span class="project-title">${project.name}</span>
          <span class="project-summary">${project.summary}</span>
          <span class="project-tags">${technologies}</span>
          <span class="project-action" aria-hidden="true">${actionLabel}<span>↗</span></span>
        </span>
      </button>`;

    return article;
  }

  function renderProjects() {
    projectGrid.replaceChildren(...projects.map(project => createProjectCard(localiseProject(project))));
    updateProjects(document.querySelector('.filter[aria-pressed="true"]'));
  }

  function updateProjects(selectedFilter) {
    for (const filter of filters) {
      const selected = filter === selectedFilter;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    }

    let count = 0;
    for (const card of projectGrid.children) {
      card.hidden = selectedFilter.dataset.filter !== 'all' && card.dataset.category !== selectedFilter.dataset.filter;
      if (!card.hidden) count += 1;
    }

    const nouns = translate(
      { one: 'projekt', few: 'projekty', other: 'projektov' },
      { one: 'project', other: 'projects' },
    );
    const noun = nouns[new Intl.PluralRules(getLanguage()).select(count)];
    projectCount.textContent = `${count} ${noun}`;
  }

  renderProjects();

  for (const filter of filters) {
    filter.addEventListener('click', () => updateProjects(filter));
  }

  function projectMedia(project) {
    if (project.video) {
      return `
        <div class="dialog-media">
          <button class="video-load" type="button">${translate('Prehrať video na YouTube', 'Play video on YouTube')} <span aria-hidden="true">▶</span></button>
        </div>
        <p class="media-note">${translate('Video sa načíta z YouTube po kliknutí.', 'The video loads from YouTube when you click play.')}</p>`;
    }

    if (project.localVideo) {
      return `
        <div class="dialog-media">
          <video controls playsinline preload="none" aria-label="${translate('Videoukážka rekonštrukcie dynamickej scény', 'Video demo of dynamic scene reconstruction')}">
            <source src="${project.localVideo}" type="video/mp4">
            <a href="${project.localVideo}">${translate('Stiahnuť video', 'Download video')}</a>
          </video>
        </div>`;
    }

    if (!project.gallery) return '';

    const [[source, slovak, english]] = project.gallery;
    const caption = translate(slovak, english);
    const controls = project.gallery.length > 1 ? `
      <div class="gallery-controls">
        <button type="button" data-direction="-1" aria-label="${translate('Predchádzajúci obrázok', 'Previous image')}">←</button>
        <span id="gallery-count" aria-live="polite">1 / ${project.gallery.length}</span>
        <button type="button" data-direction="1" aria-label="${translate('Nasledujúci obrázok', 'Next image')}">→</button>
      </div>` : '';

    return `
      <div class="dialog-media"><img id="gallery-image" src="${source}" alt="${caption}"></div>
      <p class="media-caption" id="gallery-caption">${caption}</p>
      ${controls}`;
  }

  function openProject(project, trigger) {
    activeTrigger = trigger;
    const technologies = project.tech.map(technology => `<span>${technology}</span>`).join('');
    const result = project.result ? `<p class="dialog-result">${project.result}</p>` : '';
    const posterLink = project.poster ? `
      <div class="dialog-links">
        <a class="text-link" href="${project.poster}" target="_blank" rel="noopener noreferrer">${translate('Poster projektu (PDF)', 'Project poster (PDF)')} ↗</a>
      </div>` : '';

    dialogContent.innerHTML = `
      <div class="dialog-inner">
        <p class="dialog-meta"><span>${project.type}</span> · <span>${project.date}</span></p>
        <h2 id="dialog-title">${project.name}</h2>
        <p>${project.description}</p>
        <p class="dialog-result">${project.context}</p>
        ${result}
        <h3>${translate('Moja rola', 'My role')}</h3>
        <p>${project.role}</p>
        <div class="tags">${technologies}</div>
        ${projectMedia(project)}
        ${posterLink}
      </div>`;

    const videoButton = dialogContent.querySelector('.video-load');
    videoButton?.addEventListener('click', () => {
      const frame = document.createElement('iframe');
      frame.src = `https://www.youtube-nocookie.com/embed/${project.video}?autoplay=1`;
      frame.title = `${translate('Videoukážka projektu', 'Video demo for')} ${project.name}`;
      frame.allow = 'autoplay; encrypted-media; picture-in-picture';
      frame.allowFullscreen = true;
      videoButton.replaceWith(frame);
    });

    let galleryIndex = 0;
    for (const button of dialogContent.querySelectorAll('[data-direction]')) {
      button.addEventListener('click', () => {
        const total = project.gallery.length;
        galleryIndex = (galleryIndex + Number(button.dataset.direction) + total) % total;
        const [source, slovak, english] = project.gallery[galleryIndex];
        const caption = translate(slovak, english);
        const image = dialogContent.querySelector('#gallery-image');
        image.src = source;
        image.alt = caption;
        dialogContent.querySelector('#gallery-caption').textContent = caption;
        dialogContent.querySelector('#gallery-count').textContent = `${galleryIndex + 1} / ${total}`;
      });
    }

    dialog.showModal();
    document.body.classList.add('modal-open');
    dialog.scrollTop = 0;
  }

  projectGrid.addEventListener('click', event => {
    const trigger = event.target.closest('[data-project]');
    if (!trigger) return;

    const project = projects.find(item => item.id === trigger.dataset.project);
    if (project) openProject(localiseProject(project), trigger);
  });

  document.querySelector('.dialog-close').addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;

    const bounds = dialog.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    dialog.querySelector('video')?.pause();
    dialog.querySelector('iframe')?.remove();
    activeTrigger?.focus({ preventScroll: true });
  });

  document.addEventListener('portfolio-language-change', renderProjects);
}
