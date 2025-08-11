let lastCSS = null;
let lastJS = null;

function loadScreen(screenPath) {
  fetch(screenPath)
    .then((res) => res.text())
    .then((html) => {
      const app = document.getElementById("app");
      if (!app) throw new Error("#app not found");
      app.innerHTML = html;

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

// Initial screen
loadScreen("screens/home/home.html");
