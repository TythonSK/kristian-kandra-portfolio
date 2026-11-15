# Kristián Kandra · Personal Portfolio

A bilingual personal portfolio presenting my work in web development, cloud services, AI and 3D graphics. It brings together selected projects, technical skills, education, work experience and contact information.

**[View portfolio](https://kristian.kandra.website.tuke.sk/)** · **[Run locally](#run-locally)** · **[Build for hosting](#build-for-hosting)** · **[License](#license-and-content-rights)**

> The MIT license covers the website source code only. Photographs, the CV and personal texts are excluded. See [License and content rights](#license-and-content-rights) before reusing this repository.

## Overview

- Slovak and English content, with the selected language saved locally in the browser.
- Six projects with category filters, detail dialogs, image galleries, PDF material and video demonstrations.
- Sections for an introduction, interests, technologies, education, work experience and contact links.
- Downloadable CV in Slovak and a project poster in PDF format.
- Responsive layouts, mobile navigation, keyboard controls and a skip link.
- Canvas particle animations and an animated technology rail, with motion controls and support for reduced motion preferences.
- Locally hosted fonts, images and media. YouTube embeds load only after the visitor presses play.

## Technology stack

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure, metadata, semantic sections and native project dialogs |
| CSS3 | Responsive layout, typography, visual styling and transitions |
| Vanilla JavaScript (ES modules) | Project rendering and filtering, galleries, language switching, navigation and clipboard interaction |
| Canvas 2D and browser APIs | Particle effects, visibility tracking and motion preferences |
| WebP, SVG and WOFF2 | Local images, technology icons and fonts |
| Python 3, optional | Local development and preview server |
| PowerShell 5.1 or later, optional | Packaging the static website for hosting |

The portfolio has no application framework, package manager dependencies, backend, database or API keys. There is no `npm install` or compilation step. Technologies listed inside individual project descriptions describe those projects; they are not dependencies of this portfolio.

## Repository structure

```text
.
├── index.html              # Page content, bilingual text and SEO/social metadata
├── style.css               # Layout, colours, responsive styles and transitions
├── fonts.css               # Local font declarations and character subsets
├── js/
│   ├── app.js              # Single entry point; initializes each feature once
│   ├── data/projects.js    # Project content, translations and media paths
│   ├── projects.js         # Project cards, filters, dialogs and galleries
│   ├── language.js         # SK/EN switching, translation helpers and storage
│   ├── navigation.js       # Mobile navigation and its keyboard controls
│   ├── contact.js          # Email copying and its status messages
│   ├── motion.js           # Canvas effects, motion controls and technology rail
│   └── skills.js           # Responsive skill disclosure behaviour
├── assets/
│   ├── covers/             # Project card artwork
│   ├── tech/               # Technology SVG icons and their license notice
│   └── ...                 # Images, fonts, font licenses, PDFs and local video
├── spustit-localhost.cmd    # Windows shortcut for the local Python server
├── build.ps1               # Creates dist/ and a ZIP archive for hosting
├── .nojekyll               # Serves the site as static files on GitHub Pages
├── AGENTS.md               # Maintenance instructions for coding agents
├── LICENSE                 # MIT text and explicit licensing scope notice
└── README.md
```

## Run locally

You need a modern browser and Python 3 for the commands below. Open a terminal in the repository directory, alongside `index.html`.

### Windows

Check Python and start the server:

```powershell
py -3 --version
py -3 -m http.server 8000 --bind 127.0.0.1
```

Alternatively, double-click `spustit-localhost.cmd`. This shortcut requires the Windows Python launcher (`py`).

### macOS or Linux

```sh
python3 --version
python3 -m http.server 8000 --bind 127.0.0.1
```

If your Python 3 installation uses the `python` command, substitute it for `py -3` or `python3`.

Open **[http://localhost:8000/](http://localhost:8000/)**. Keep the terminal running and stop the server with **Ctrl+C**. Refresh the page after editing files; no build or watcher is needed.

Serve the site over HTTP instead of opening `index.html` directly. The local server is for development and preview only.

JavaScript uses native ES modules, which load automatically from `js/app.js`. Serve `.js` files with a JavaScript MIME type, as the Python server does. No bundler is needed.

## Build for hosting

This is a static website, so the source files are already browser-ready. The build script packages those files without changing or minifying the HTML, CSS, JavaScript or assets.

From the repository directory on Windows, run:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\build.ps1
```

`-ExecutionPolicy Bypass` applies to this PowerShell process only. If you use PowerShell 7, you can run `pwsh -NoProfile -File ./build.ps1` instead.

The script creates:

| Output | Use |
| --- | --- |
| `dist/` | Upload its contents to your hosting provider's public directory |
| `portfolio-hosting.zip` | Upload and extract it if your hosting control panel accepts ZIP archives |

**Each run replaces `dist/` and `portfolio-hosting.zip`.** Keep source edits in the repository files; edits made directly in `dist/` are discarded on the next build. Generated output is excluded from Git.

The package contains `index.html`, both stylesheets, `js/`, `assets/`, `.nojekyll` and `LICENSE`. It includes the original third-party license files. It excludes Git history, development helpers and repository documentation.

### Preview the packaged site

After the build, serve the output directory:

```powershell
py -3 -m http.server 8080 --bind 127.0.0.1 --directory dist
```

Open **[http://localhost:8080/](http://localhost:8080/)** and check the page before uploading it.

### Manual packaging on any operating system

If you do not use PowerShell, copy the following into an empty deployment directory:

```text
index.html
style.css
fonts.css
js/            (the entire directory, including data/)
assets/        (the entire directory, including license notices)
.nojekyll
LICENSE
```

These files are the complete deployable website. No compilation is required.

## Deploy to a static host

The current deployment target is `https://kristian.kandra.website.tuke.sk/`, with the website files placed directly inside the hosting account's `httpdocs/` directory. The canonical and Open Graph URLs in `index.html` are configured for this address.

1. Build the package, or prepare the files using the manual list above.
2. Upload the **contents** of `dist/` into the host's public directory, such as `public_html/` or `www/`. `index.html` must be directly inside the directory served at your intended site URL.
3. Keep file names, letter case and the `assets/` directory structure unchanged.
4. Enable HTTPS through the host and verify the deployed site.

No Node.js server, server-side runtime, environment variables or SPA fallback rules are required. Any host that serves static HTML, CSS, JavaScript and media files can serve this site. On platforms that request build settings, use no build command when deploying the source directly, and select the directory containing `index.html` as the publish directory.

For GitHub Pages, the repository root already contains the static website and `.nojekyll`; use the root directory as the publishing source. There is no need to commit `dist/`.

### When changing the public domain

In `index.html`, update the absolute URLs in `canonical`, `og:url` and `og:image` to the final public address. The image URL must point to an accessible image on that domain. Internal asset links are relative and can also work under a repository subdirectory.

### Deployment checklist

- Open the site at desktop and mobile widths.
- Switch between Slovak and English and reload the page.
- Exercise each project filter, dialog, gallery and video.
- Download the CV and open the project poster.
- Check navigation, contact links, email copying and motion controls.
- Check the browser console and Network panel for errors or missing files.

External links and YouTube playback require an internet connection. The portrait, fonts, PDFs and thesis video are served from the local package.

## Maintain the content

| What to update | Where |
| --- | --- |
| Intro, biography, skills, education, experience and contact details | `index.html` |
| English page translations | `data-en` and `data-en-*` attributes in `index.html` |
| Project descriptions, technologies, covers, galleries and video IDs | The `projects` array in `js/data/projects.js`; English text is in each project's `en` object |
| Project cards, filtering, dialogs and galleries | `js/projects.js` |
| Layout, colours and typography choices | `style.css` |
| Font files and character subsets | `fonts.css` and the matching files in `assets/` |
| Language switching and saved preference | `js/language.js` |
| Mobile navigation | `js/navigation.js` |
| Email copying | `js/contact.js` |
| Particle effects and motion controls | `js/motion.js` |
| Responsive skill disclosures | `js/skills.js` |
| CV, poster, images and local video | `assets/`; preserve file names or update every reference |

Keep both language versions in sync. Personal text remains excluded from MIT even when it is embedded in HTML or JavaScript. When removing assets, check HTML, CSS and JavaScript references, including project galleries, downloads, preloads and social metadata. License notices must stay with the third-party assets they cover.

### JavaScript organization

`index.html` loads one module, `js/app.js`. That entry point initializes the language before the other features. Each feature exports an initializer and keeps its DOM references, state and listeners together. Shared translation helpers and project data are imported explicitly; features do not depend on global variables or the order of separate script tags.

The language module emits `portfolio-language-change` after a language switch. Projects, navigation, contact messages and motion controls subscribe independently. To add a feature, give it a focused module and initialize it once from `js/app.js`.

The existing styles remain in `style.css`, with font declarations in `fonts.css`. Keeping their rule order intact avoids changing the cascade or responsive behaviour.

## Troubleshooting

| Symptom | Solution |
| --- | --- |
| `py`, `python` or `python3` is not found | Install Python 3, reopen the terminal and use the command available on your system |
| The server shows a directory listing | Start it in the directory containing `index.html`, or set `--directory` to that directory |
| Port 8000 is already in use | Choose another port, such as 8080, in both the command and browser URL |
| Images or fonts are missing after deployment | Check upload completeness, exact file name case and the `assets/` paths in the Network panel |
| Changes do not appear | Refresh without cache; rebuild and upload the new output if you deploy from `dist/` |
| Email copying fails on the hosted site | Use HTTPS; the interface also displays a manual-copy fallback |

## License and content rights

Copyright © 2026 Bc. Kristián Kandra.

**The MIT license applies only to the website source code (HTML, CSS and JavaScript). Photographs, including the portrait, the CV and personal texts are not covered by the MIT license, even when embedded in source files. Third-party fonts and logos are governed by their own licenses.**

No permission to reuse personal content or other project media is granted by the MIT license. Obtain permission from the respective rights holders where required. See [LICENSE](LICENSE) for the full MIT text and the repository licensing scope notice.

### Third-party notices

Keep these notices with the corresponding assets when distributing the website:

| Material | License / notice |
| --- | --- |
| Host Grotesk | [SIL Open Font License 1.1](assets/host-grotesk-LICENSE.txt) |
| DM Sans | [SIL Open Font License 1.1](assets/dm-sans-OFL.txt) |
| Manrope | [SIL Open Font License 1.1](assets/manrope-OFL.txt) |
| Barlow Semi Condensed | [SIL Open Font License 1.1](assets/barlow-OFL.txt) |
| Technology icons supplied from Simple Icons 11.15.0 | [CC0 1.0 Universal notice](assets/tech/simple-icons-LICENSE.md) |

Third-party names and logos remain the property of their respective owners. Including a logo does not imply endorsement or grant trademark rights.
