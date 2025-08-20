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

      // Tự động thay đổi BGM dựa trên màn hình
      autoChangeBGM(screenPath);
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

// Global click sound handler
document.addEventListener("click", function (event) {
  // Chỉ phát sound cho button clicks
  const target = event.target;
  // @ts-ignore
  if (target && target?.tagName === "BUTTON") {
    if (window["playSound"]) {
      window["playSound"]("click");
    }
  }
});

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

// Load audio module
function loadAudioModule() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "shared/utils/audio.js";
    // @ts-ignore
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load audio module"));
    document.head.appendChild(script);
  });
}

// Tự động thay đổi BGM dựa trên màn hình
function autoChangeBGM(screenPath) {
  if (!window["audioManager"]) return;

  try {
    let bgmType = "bgm-home"; // default

    if (screenPath.includes("/intro/")) {
      bgmType = "bgm-intro";
    } else if (screenPath.includes("/home/")) {
      bgmType = "bgm-home";
    } else if (screenPath.includes("/select/")) {
      bgmType = "bgm-select";
    } else if (screenPath.includes("/game/")) {
      bgmType = "bgm-game";
    } else if (screenPath.includes("/settings/")) {
      bgmType = "bgm-settings";
    } else if (screenPath.includes("/result/")) {
      bgmType = "bgm-result";
    }

    // Chỉ thay đổi BGM nếu khác với BGM hiện tại
    const currentBgm = window["audioManager"].getStatus().currentBgm;
    const newBgmPath = window["audioManager"].bgmMap[bgmType];

    if (currentBgm !== newBgmPath) {
      console.log(`🎵 Auto-changing BGM to: ${bgmType}`);
      window["playBgm"](bgmType);
    }
  } catch (error) {
    console.warn("⚠️ Error auto-changing BGM:", error);
  }
}

// Initialize audio system
async function initializeAudio() {
  try {
    await loadAudioModule();
    await window["initAudio"]();

    // Auto-play BGM cho trang đầu tiên
    const introShown = localStorage.getItem("intro_shown") === "true";
    if (introShown) {
      window["playBgm"]("bgm-home");
    }

    console.log("🎵 Audio system ready");
  } catch (error) {
    console.warn("⚠️ Audio initialization failed, continuing without audio:", error);
  }
}

// Initial screen
ensureAppShell();
applyTheme();

// Initialize audio and load initial screen
initializeAudio()
  .then(() => {
    // Check if intro has been shown
    const introShown = localStorage.getItem("intro_shown") === "true";
    const initialScreen = introShown ? "screens/home/home.html" : "screens/intro/intro.html";
    loadScreen(initialScreen);
  })
  .catch(() => {
    // Fallback nếu audio fail
    const introShown = localStorage.getItem("intro_shown") === "true";
    const initialScreen = introShown ? "screens/home/home.html" : "screens/intro/intro.html";
    loadScreen(initialScreen);
  });
