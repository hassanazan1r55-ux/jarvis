# Azan.dev — personal website

Hand-written static site: HTML, CSS and JS. No build step, no dependencies.
Works on Vercel and GitHub Pages as it is.

## Folder
```
├── index.html            main page
├── 404.html              error page
├── css/style.css         all styles and the four colour themes
├── js/main.js            behaviour + the CONFIG block at the top
├── assets/favicon.svg
├── manifest.webmanifest
├── sitemap.xml, robots.txt
└── projects/aria/        ARIA Jarvis HUD (separate page)
```

## Edit your details
Everything personal lives in the `CONFIG` block at the top of `js/main.js`:

- `email`: your email. Enables the mail link and the contact form.
- `formEndpoint`: optional Formspree URL, so messages are sent without opening a mail app.
- `social.github` / `social.instagram`: profile links.
- `projects`: one link per project card. A card with an empty link shows "Coming soon".

Anything left empty is hidden, so visitors never see placeholder text.
If both `email` and `formEndpoint` are empty, the contact form is hidden.

## What is on the page
- Interactive terminal in the hero (`help`, `whoami`, `skills`, `projects`, `now`, `contact`, `theme`, `clear`). Press `/` anywhere to jump to it.
- Four colour themes, remembered between visits.
- Filterable project cards, scroll progress bar, active nav link.
- Respects reduced-motion settings, keyboard friendly, mobile ready.

## Deploy
- **Vercel:** import the repo, no settings needed.
- **GitHub Pages:** Settings → Pages → Deploy from branch → `main` / root.
- If you change the site URL, update it in `index.html` (canonical, og:url, JSON-LD), `sitemap.xml` and `robots.txt`.
