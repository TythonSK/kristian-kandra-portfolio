# Repository maintenance

## Project

This is a static Slovak/English personal portfolio built with HTML, CSS and vanilla JavaScript. There is no package manager, framework, backend or compilation step. Do not introduce dependencies or a toolchain without a task that requires them.

## Scope and content

- Preserve the existing design, behaviour and personal content unless the task explicitly requests changes.
- Read `README.md` for the file map, preview commands and deployment process.
- Page content and its English translations live in `index.html` (`data-en` and `data-en-*`). Projects and their `en` translations live in `js/data/projects.js`.
- Keep Slovak and English versions consistent and preserve UTF-8 encoding and diacritics.
- Keep asset paths relative. If the public domain changes, review `canonical`, `og:url` and `og:image` in `index.html`.
- `js/app.js` is the single ES module entry point. It initializes language first, then projects, navigation, contact, motion and skills. Keep dependencies explicit with imports; do not add shared globals or auto-initializing UI modules.
- Each feature module owns its DOM queries, state and event listeners inside its `init...()` function. Call each initializer once from the entry point. Subscribe translated UI to `portfolio-language-change` inside the owning module.
- Keep project data separate from rendering and interaction code. Asset URLs in that data resolve relative to the HTML document, not to the JavaScript file.

## Assets and licensing

- Before removing an asset, check all HTML, CSS and JavaScript references, including galleries, video sources, PDF downloads, preloads, font declarations and social metadata. Do not infer usage from file names alone.
- Keep third-party license notices with the fonts and icons they cover, even though the notices are not rendered on the page.
- The MIT license covers only website source code. Photographs, the CV, personal text and other media are excluded; third-party materials retain their own licenses. See `LICENSE` and the README.
- Do not replace personal media or rewrite personal claims without an explicit request.

## Verification and delivery

- Preview from the repository root with `py -3 -m http.server 8000 --bind 127.0.0.1` (or `python3` on macOS/Linux).
- For UI changes, check desktop/mobile layouts, both languages, navigation, filters, project dialogs, galleries, media, downloads and motion controls as relevant to the change.
- For asset cleanup, verify that every retained local reference resolves and that unrelated source files remain unchanged.
- Build with `powershell -NoProfile -ExecutionPolicy Bypass -File .\build.ps1`. The script replaces only generated `dist/` and `portfolio-hosting.zip`; do not edit or commit these outputs.
- The build must preserve runtime files byte for byte, include asset license notices and place `index.html` at the archive root.
- There is no automated test suite. Use targeted checks appropriate to the task; do not add a test framework for routine content or documentation changes.
