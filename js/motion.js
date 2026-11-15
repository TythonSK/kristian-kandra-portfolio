import { translate } from './language.js';

// Small projected point fields: no 3D runtime, textures, or continuous offscreen work.
export function initMotion() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const toggle = document.querySelector('.motion-toggle');
  const techRail = document.querySelector('.tech-rail');
  const techToggle = techRail.querySelector('.tech-motion-toggle');
  const techLogos = techRail.querySelector('.tech-logos');
  const repeatedLogos = techLogos.cloneNode(true);
  repeatedLogos.setAttribute('aria-hidden', 'true');
  repeatedLogos.removeAttribute('aria-label');
  repeatedLogos.removeAttribute('data-en-aria-label');
  techLogos.after(repeatedLogos);

  let paused = false;
  try { paused = sessionStorage.getItem('portfolio-motion-paused') === 'true'; } catch {}
  if (!paused && !reducedMotion.matches) document.querySelector('.hero').classList.add('hero-enter');
  let techVisible = false;
  let frame = 0;
  let lastTime = 0;
  let time = 0;

  const fields = [...document.querySelectorAll('[data-particles]')].map(canvas => {
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return null;
    return { canvas, context, wave: canvas.dataset.particles === 'wave', visible: false,
      width: 0, height: 0, pointer: 0, target: 0 };
  }).filter(Boolean);
  const canMove = () => !paused && !reducedMotion.matches && !document.hidden;

  function draw(field) {
    const { context: ctx, width: w, height: h, wave } = field;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);
    const t = time * .00016;
    field.pointer += (field.target - field.pointer) * .05;
    if (wave) {
      const columns = w < 600 ? 28 : 44;
      for (let z = 0; z < 17; z++) {
        for (let x = 0; x < columns; x++) {
          const nx = x / (columns - 1);
          const nz = z / 16;
          const px = w * (.05 + nx * .9) + (nz - .5) * 36;
          const py = h * (.25 + nz * .58) + Math.sin(nx * 8 + t + nz * 3 + field.pointer) * 12;
          const fade = Math.sin(nx * Math.PI) * Math.sin(nz * Math.PI);
          ctx.fillStyle = (x % 11 === 0 && z === 9) ? `rgba(255,127,12,${fade * .8})` : `rgba(255,255,255,${fade * .36})`;
          ctx.beginPath();
          ctx.arc(px, py, .75 + nz * .35, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return;
    }

    // Three orthogonal planes recall the coordinate space used in the 3D projects.
    const yaw = -.45 + Math.sin(t * .6) * .22 + field.pointer * .2;
    const tilt = -.38;
    const scale = Math.min(w, h) * .32;
    const points = [];
    for (let plane = 0; plane < 3; plane++) {
      for (let i = -6; i <= 6; i++) {
        for (let j = -6; j <= 6; j++) {
          const a = i / 6, b = j / 6;
          let [x, y, z] = plane === 0 ? [a, b, 0] : plane === 1 ? [a, 0, b] : [0, a, b];
          const rx = x * Math.cos(yaw) - z * Math.sin(yaw);
          const rz = x * Math.sin(yaw) + z * Math.cos(yaw);
          const ry = y * Math.cos(tilt) - rz * Math.sin(tilt);
          const depth = y * Math.sin(tilt) + rz * Math.cos(tilt);
          const perspective = 3 / (3 + depth * .4);
          points.push({ x: w / 2 + rx * scale * perspective, y: h / 2 + ry * scale * perspective,
            depth, accent: plane === 0 && (i === 0 || j === 0) });
        }
      }
    }
    points.sort((a, b) => b.depth - a.depth);
    for (const point of points) {
      ctx.fillStyle = point.accent ? '#FF7F0C' : `rgba(255,255,255,${.3 - point.depth * .12})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, point.accent ? 1.7 : 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop(now) {
    frame = 0;
    if (!canMove() || !fields.some(f => f.visible)) return;
    if (now - lastTime >= 1000 / 30) {
      time += Math.min(now - lastTime, 50);
      lastTime = now;
      fields.filter(f => f.visible).forEach(draw);
    }
    frame = requestAnimationFrame(loop);
  }

  function sync() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    toggle.hidden = reducedMotion.matches;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.textContent = paused ? translate('Zapnúť pohyb', 'Resume motion') : translate('Pozastaviť pohyb', 'Pause motion');
    techRail.classList.toggle('is-looping', !reducedMotion.matches);
    techRail.classList.toggle('is-running', canMove() && techVisible);
    techToggle.hidden = reducedMotion.matches;
    techToggle.toggleAttribute('data-paused', paused);
    techToggle.setAttribute('aria-label', toggle.textContent);
    techToggle.title = toggle.textContent;
    if (canMove() && fields.some(f => f.visible)) {
      lastTime = performance.now();
      frame = requestAnimationFrame(loop);
    } else {
      fields.forEach(draw);
    }
  }

  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.target === techRail) {
        techVisible = entry.isIntersecting;
        continue;
      }
      const field = fields.find(f => f.canvas === entry.target);
      field.visible = entry.isIntersecting && field.width > 0;
    }
    sync();
  });
  visibility.observe(techRail);
  const resize = new ResizeObserver(entries => {
    for (const entry of entries) {
      const field = fields.find(f => f.canvas === entry.target);
      field.width = entry.contentRect.width;
      field.height = entry.contentRect.height;
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      field.canvas.width = Math.round(field.width * dpr);
      field.canvas.height = Math.round(field.height * dpr);
      field.context.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(field);
    }
  });
  fields.forEach(field => {
    resize.observe(field.canvas);
    visibility.observe(field.canvas);
    const container = field.canvas.parentElement;
    container.addEventListener('pointermove', event => {
      if (!finePointer.matches || !canMove()) return;
      const rect = container.getBoundingClientRect();
      field.target = (event.clientX - rect.left) / rect.width - .5;
    }, { passive: true });
    container.addEventListener('pointerleave', () => { field.target = 0; });
  });
  function toggleMotion() {
    paused = !paused;
    try { sessionStorage.setItem('portfolio-motion-paused', String(paused)); } catch {}
    sync();
  }
  toggle.addEventListener('click', toggleMotion);
  techToggle.addEventListener('click', toggleMotion);
  document.addEventListener('visibilitychange', sync);
  document.addEventListener('portfolio-language-change', sync);
  reducedMotion.addEventListener('change', sync);
  sync();
}
