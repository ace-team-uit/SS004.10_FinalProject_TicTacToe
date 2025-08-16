## Architecture Overview

- Entry: `index.html` loads `styles/global.css`, then runtime scripts.
- Screen loader in `main.js` injects `screens/<name>/*.html` into `div.phone-viewport` and attaches each screen's CSS/JS.
- Global UI foundation in `styles/*` provides variables, reset, utilities, components, and theming.
- Navigation API in `shared/logic/navigation.js` exposes `Navigation.navigateTo(route)`.
- Shared logic/modules live under `shared/` and common UI components in `components/`.
- Constants and asset paths are centralized in `constants/assets/index.js`.

### Screen Module Convention

- Each screen has three files: `*.html`, `*.css`, `*.screen.js`.
- The HTML root should fill available height and rely on utilities for layout.
- JS file wires events and may call shared logic.

### Theming & Responsiveness

- Mobile-first, 6:19 viewport via `.phone-viewport` wrapper.
- Theme toggled with `html[data-theme="dark|light"]`.
- Breakpoints: 768px (tablet), 1024px (desktop) for any overflow layouts.

### Data & Logic Separation

- Game logic modules: `shared/logic/*` (board, timer, ai).
- UI logic in screen `*.screen.js` files should call shared logic, not duplicate it.
