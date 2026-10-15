# Portfolio

Hand-written static site in HTML, CSS and JavaScript. No framework, no build step.
Works on Vercel and GitHub Pages as it is.

## Structure
```
├── index.html            main page
├── 404.html              error page
├── css/style.css         styles and animations
├── js/main.js            behaviour; contact email is set in CONFIG at the top
├── assets/favicon.svg
├── manifest.webmanifest
├── sitemap.xml, robots.txt
└── projects/aria/        ARIA neural interface (separate page)
```

## Editing
- **Contact email:** `CONFIG.email` in `js/main.js`, plus the mail link in the Contact section of `index.html`.
- **Projects:** each project is one `<article class="card">` in `index.html`. Copy a card to add a new one.
- **Skills:** the lists in the Skills section of `index.html`.
- **Site URL:** if the address changes, update it in `index.html` (canonical, og:url, JSON-LD), `sitemap.xml` and `robots.txt`.

## Highlights
- Staggered headline reveal, animated aurora background and orbiting hero graphic.
- Cursor spotlight, card glow and tilt, magnetic buttons, scroll-triggered reveals.
- Responsive, keyboard accessible, and respects the reduced-motion setting.

## Deploy
- **Vercel:** import the repository, no settings needed.
- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.
