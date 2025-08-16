## Setup Guide

### Requirements

- Modern browser (Chrome/Firefox/Safari/Edge)
- Local HTTP server (optional). Static open via file:// works but recommended to use a server.

### Run locally

1. Open `index.html` in a browser, or
2. Serve the folder with any static server, e.g. VS Code Live Server, `python3 -m http.server`, or `npx serve`.

### Development

- Main entry: `index.html` → `main.js`.
- Global styles in `styles/*`.
- Screens in `screens/<name>/` with `*.html`, `*.css`, `*.screen.js`.
- Navigation API: `Navigation.navigateTo('home')` etc.
- Theme toggle: call `window.toggleTheme()`.

### Conventions

- Mobile-first. Content sits inside `.phone-viewport` (6:19).
- Use variables from `styles/variables.css` and utilities from `styles/utilities.css`.
- Keep each file under ~250 lines for readability.
