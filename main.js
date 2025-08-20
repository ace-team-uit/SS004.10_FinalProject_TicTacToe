let lastCSS = null;
let lastJS = null;

function ensureAppShell() {
  const app = document.getElementById("app");
  if (!app) throw new Error("#app not found");
  app.classList.add("app-root");

  let viewport = app.querySelector(".phone-viewport");
  if (!viewport) {
    viewport = document.createElement("div");
    viewport.className = "phone-viewport";
    app.appendChild(viewport);
  }
  return viewport;
}

function loadScreen(screenPath) {
  fetch(screenPath)
    .then((res) => res.text())
    .then((html) => {
      const viewport = ensureAppShell();
      viewport.innerHTML = html;

      const cssPath = screenPath.replace(/\.html$/, ".css");
      loadCSS(cssPath);

      const jsPath = screenPath.replace(/\.html$/, ".screen.js");
      loadScript(jsPath);
    })
    .catch((err) => console.error("Load screen error:", err));
}

function loadCSS(path) {
  if (lastCSS !== path) {
    const existing = document.querySelector("link[data-screen-css]");
    if (existing) existing.remove();

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = path;
    link.setAttribute("data-screen-css", "true");
    document.head.appendChild(link);

    lastCSS = path;
  }
}

function loadScript(path) {
  if (lastJS !== path) {
    const existing = document.querySelector("script[data-screen-js]");
    if (existing) existing.remove();

    const script = document.createElement("script");
    script.src = path;
    script.type = "text/javascript";
    script.setAttribute("data-screen-js", "true");
    document.body.appendChild(script);

    lastJS = path;
  }
}

// Expose globally
window.loadScreen = loadScreen;

// Theme helpers
function applyTheme(theme) {
  const next = theme || localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  applyTheme(current === "dark" ? "light" : "dark");
}

window.toggleTheme = toggleTheme;

// Initial screen
ensureAppShell();
applyTheme();

// Check if intro has been shown
const introShown = localStorage.getItem("intro_shown") === "true";
const initialScreen = introShown ? "screens/home/home.html" : "screens/intro/intro.html";
loadScreen(initialScreen);
