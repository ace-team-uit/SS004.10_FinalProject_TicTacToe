// Track loaded resources
let lastCSS = null;
let lastJS = null;

// App shell setup
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

// Screen loading
async function loadScreen(screenPath) {
  try {
    const html = await fetch(screenPath).then((res) => res.text());
    const viewport = ensureAppShell();
    viewport.innerHTML = html;

    const cssPath = screenPath.replace(/\.html$/, ".css");
    loadCSS(cssPath);

    const jsPath = screenPath.replace(/\.html$/, ".screen.js");
    loadScript(jsPath);

    // Auto BGM change
    autoChangeBGM(screenPath);

    // Apply settings
    applySettings();
  } catch (err) {
    console.error("Load screen error:", err);
  }
}

// Resource loading
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

// Audio module loading
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

// BGM management
function autoChangeBGM(screenPath) {
  if (!window["audioManager"]) return;

  try {
    const bgmMap = {
      "/intro/": null,
      "/home/": "bgm-home",
      "/select/": "bgm-select",
      "/mode1/": "bgm-select",
      "/mode2/": "bgm-select",
      "/game/": "bgm-game",
      "/settings/": "bgm-settings",
      "/result/": "bgm-result",
    };

    const bgmType = Object.entries(bgmMap).find(([path]) => screenPath.includes(path))?.[1];

    if (bgmType === null) {
      if (window["audioManager"].getStatus().currentBgm) {
        console.log("🎵 Stopping BGM for intro screen");
        window["audioManager"].stopBgm();
      }
      return;
    }

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

// Settings management
function applySettings() {
  if (!window["AppStorage"]) return;

  const settings = window["AppStorage"].loadSettings();

  // Apply theme
  document.documentElement.setAttribute("data-theme", settings.gameTheme);

  // Apply language
  document.documentElement.setAttribute("lang", settings.gameLanguage);

  // Apply audio settings
  if (settings.gameMusicEnabled !== undefined || settings.gameSoundEnabled !== undefined) {
    window["AppStorage"]?.saveSettings({
      gameMusicEnabled: settings.gameMusicEnabled,
      gameSoundEnabled: settings.gameSoundEnabled,
    });
  }

  console.log("⚙️ Applied settings:", settings);
}

function toggleTheme() {
  if (!window["AppStorage"]) return;

  const settings = window["AppStorage"].loadSettings();
  const newTheme = settings.theme === "dark" ? "light" : "dark";

  window["AppStorage"].saveSettings({ ...settings, theme: newTheme });
  applySettings();
}

// Audio initialization
async function initializeAudio() {
  try {
    await loadAudioModule();
    await window["initAudio"]();

    // Auto-play BGM based on settings
    const settings = window["AppStorage"]?.loadSettings();
    if (settings?.gameMusicEnabled && !settings?.gameIntroShown) {
      window["playBgm"]("bgm-home");
    }

    console.log("🎵 Audio system ready");
  } catch (error) {
    console.warn("⚠️ Audio initialization failed, continuing without audio:", error);
  }
}

// Global event handlers
document.addEventListener("click", function (event) {
  const target = event.target;
  // @ts-ignore
  if (target && target?.tagName === "BUTTON" && window["playSound"]) {
    window["playSound"]("click");
  }
});

// Navigation event handler
window.addEventListener("navigation", function (event) {
  const customEvent = /** @type {CustomEvent} */ (event);
  const { from, to } = customEvent.detail;
  console.log(`🚀 Navigation: ${from || "initial"} -> ${to}`);
});

// Expose global functions
window.loadScreen = loadScreen;
window.toggleTheme = toggleTheme;

// Initialize app
(async function init() {
  ensureAppShell();
  applySettings();

  try {
    await initializeAudio();
  } catch (error) {
    console.warn("⚠️ Audio initialization failed:", error);
  }

  // Load initial screen based on navigation
  const route = window["Navigation"]?.getRouteFromHash() || "intro";
  window["Navigation"]?.navigateTo(route);
})();
