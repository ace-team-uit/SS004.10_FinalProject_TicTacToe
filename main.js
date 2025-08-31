// Theo dõi tài nguyên đã tải
let lastCSS = null;
let lastJS = null;

// Thiết lập app shell
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

// Tải màn hình
async function loadScreen(screenPath) {
  try {
    const html = await fetch(screenPath).then((res) => res.text());
    const viewport = ensureAppShell();
    viewport.innerHTML = html;

    const cssPath = screenPath.replace(/\.html$/, ".css");
    loadCSS(cssPath);

    const jsPath = screenPath.replace(/\.html$/, ".screen.js");
    loadScript(jsPath);

    // Tự động thay đổi BGM
    autoChangeBGM(screenPath);

    // Áp dụng cài đặt
    applySettings();
  } catch (err) {
    console.error("Load screen error:", err);
  }
}

// Tải tài nguyên
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

// Tải module âm thanh
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

// Quản lý BGM
function autoChangeBGM(screenPath) {
  if (!window["audioManager"]) return;

  try {
    // Ủy quyền cho phương thức autoChangeBGM của audio manager
    window["audioManager"].autoChangeBGM(screenPath);
  } catch (error) {
    console.warn("⚠️ Error auto-changing BGM:", error);
  }
}

// Quản lý cài đặt
function applySettings() {
  if (!window["AppStorage"]) return;

  const settings = window["AppStorage"].loadSettings();

  // Áp dụng theme
  document.documentElement.setAttribute("data-theme", settings.gameTheme);

  // Áp dụng ngôn ngữ
  document.documentElement.setAttribute("lang", settings.gameLanguage);

  // Áp dụng cài đặt âm thanh
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

// Khởi tạo âm thanh
async function initializeAudio() {
  try {
    await loadAudioModule();
    await window["initAudio"]();

    // Tự động phát BGM dựa trên cài đặt
    const settings = window["AppStorage"]?.loadSettings();
    if (settings?.gameMusicEnabled && !settings?.gameIntroShown) {
      window["playBgm"]("bgm-home");
    }

    console.log("🎵 Audio system ready");
  } catch (error) {
    console.warn("⚠️ Audio initialization failed, continuing without audio:", error);
  }
}

// Xử lý sự kiện toàn cục
document.addEventListener("click", function (event) {
  const target = event.target;
  // @ts-ignore
  if (target && target?.tagName === "BUTTON" && window["playSound"]) {
    window["playSound"]("click");
  }
});

// Xử lý sự kiện điều hướng
window.addEventListener("navigation", function (event) {
  const customEvent = /** @type {CustomEvent} */ (event);
  const { from, to } = customEvent.detail;
  console.log(`🚀 Navigation: ${from || "initial"} -> ${to}`);
});

// Xuất các hàm toàn cục
window.loadScreen = loadScreen;
window.toggleTheme = toggleTheme;

// Khởi tạo ứng dụng
(async function init() {
  ensureAppShell();
  applySettings();

  try {
    await initializeAudio();
  } catch (error) {
    console.warn("⚠️ Audio initialization failed:", error);
  }

  // Tải màn hình ban đầu dựa trên điều hướng
  const route = window["Navigation"]?.getRouteFromHash() || "intro";
  window["Navigation"]?.navigateTo(route);
})();
