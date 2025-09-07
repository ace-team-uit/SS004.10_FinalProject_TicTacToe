console.log("⚙️ Settings screen loaded");

// Settings state
let currentSettings = {};

// Load settings from storage
function loadSettings() {
  // Load current settings from storage
  if (window["AppStorage"]) {
    currentSettings = window["AppStorage"].loadSettings();
    console.log("📱 Loaded settings:", currentSettings);
  } else {
    console.warn("⚠️ AppStorage not available, using defaults");
    currentSettings = {
      gameMusicEnabled: true,
      gameSoundEnabled: true,
      gameTheme: "dark",
      gameLanguage: "en",
    };
  }

  // Apply BGM settings to audio manager
  if (currentSettings.gameMusicEnabled) {
    // BGM should be enabled - play current screen's BGM
    if (window["playBgm"]) {
      window["playBgm"]("bgm-settings");
      console.log("🎵 BGM initialized: enabled - playing bgm-settings");
    }
  } else {
    // BGM should be disabled - stop current BGM
    if (window["audioManager"]) {
      window["audioManager"].stopBgm();
      console.log("🎵 BGM initialized: disabled");
    }
  }
}

// Update music toggle UI
function updateMusicToggle() {
  const musicToggleIcon = document.getElementById("music-toggle-icon");

  if (musicToggleIcon && musicToggleIcon instanceof HTMLImageElement) {
    const isEnabled = currentSettings.gameMusicEnabled;

    if (isEnabled) {
      musicToggleIcon.src = "../../assets/images/icons/on-icon.png";
    } else {
      musicToggleIcon.src = "../../assets/images/icons/off-icon.png";
    }
  }
}

// Toggle music setting
function toggleMusic() {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  console.log("Music toggle clicked, current state:", currentSettings.gameMusicEnabled);
  currentSettings.gameMusicEnabled = !currentSettings.gameMusicEnabled;
  console.log("Music toggle new state:", currentSettings.gameMusicEnabled);

  // Save to storage
  if (window["AppStorage"]) {
    window["AppStorage"].saveSettings({
      gameMusicEnabled: currentSettings.gameMusicEnabled,
    });
    console.log("💾 Saved music setting:", currentSettings.gameMusicEnabled);
  }

  // Actually toggle BGM (not sound effects)
  if (currentSettings.gameMusicEnabled) {
    // Enable BGM - play current screen's BGM
    if (window["playBgm"]) {
      // Determine current screen and play appropriate BGM
      const currentRoute = window["Navigation"]?.getCurrentRoute();
      let bgmType = "bgm-settings"; // default for settings screen

      if (currentRoute === "home") bgmType = "bgm-home";
      else if (currentRoute === "select") bgmType = "bgm-select";
      else if (currentRoute === "game") bgmType = "bgm-game";
      else if (currentRoute === "settings") bgmType = "bgm-settings";

      window["playBgm"](bgmType);
      console.log(`🎵 BGM enabled - playing ${bgmType}`);
    }
  } else {
    // Disable BGM - stop current BGM
    if (window["audioManager"]) {
      window["audioManager"].stopBgm();
      console.log("🎵 BGM disabled - stopped");
    }
  }

  // Update UI
  updateMusicToggle();
}

// Show info popup
function showInfoPopup(title, content) {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  // Create popup overlay
  const popupOverlay = document.createElement("div");
  popupOverlay.className = "popup-overlay";
  popupOverlay.innerHTML = `
    <div class="popup" style="position: relative;">
      <h3 style="color: var(--text-primary); margin-bottom: var(--space-4); text-align: center; font-family: var(--font-display);">${title}</h3>
      <div style="color: var(--text-secondary); line-height: 1.6; margin-bottom: var(--space-6);">${content}</div>
      <button id="close-popup" class="btn btn-primary" style="width: 80%; position: absolute; bottom: 5%; left: 50%; transform: translateX(-50%);">Close</button>
    </div>
  `;

  document.body.appendChild(popupOverlay);

  // Close popup handler
  const closeBtn = document.getElementById("close-popup");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(popupOverlay);
      if (window["playSound"]) {
        window["playSound"]("click");
      }
    });
  }

  // Close on overlay click
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      document.body.removeChild(popupOverlay);
    }
  });
}

// Navigation back to select page
function navigateBack() {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  if (window["Navigation"]) {
    window["Navigation"].navigateTo("select");
  } else {
    console.warn("⚠️ Navigation not available");
  }
}

// Lấy các phần tử DOM
function getElements() {
  return {
    musicToggle: document.getElementById("music-toggle"),
    musicToggleIcon: document.getElementById("music-toggle-icon"),
    backBtn: document.getElementById("settings-back-btn"),
    termsBtn: document.getElementById("terms-privacy-btn"),
    supportBtn: document.getElementById("support-btn"),
    aboutBtn: document.getElementById("about-us-btn"),
  };
}

// Thiết lập tất cả các trình lắng nghe sự kiện
function setupEventListeners() {
  const elements = getElements();

  // Music toggle
  if (elements.musicToggle && elements.musicToggle.parentNode) {
    const newMusicToggle = elements.musicToggle.cloneNode(true);
    elements.musicToggle.parentNode.replaceChild(newMusicToggle, elements.musicToggle);
    newMusicToggle.addEventListener("click", toggleMusic);
  }

  // Back button
  if (elements.backBtn && elements.backBtn.parentNode) {
    const newBackBtn = elements.backBtn.cloneNode(true);
    elements.backBtn.parentNode.replaceChild(newBackBtn, elements.backBtn);
    newBackBtn.addEventListener("click", navigateBack);
  }

  // Info buttons
  if (elements.termsBtn && elements.termsBtn.parentNode) {
    const newTermsBtn = elements.termsBtn.cloneNode(true);
    elements.termsBtn.parentNode.replaceChild(newTermsBtn, elements.termsBtn);
    newTermsBtn.addEventListener("click", () => {
      console.log("Terms & Privacy button clicked");
      showInfoPopup(
        "Terms & Privacy",
        "This game is developed for educational purposes. We respect your privacy and do not collect personal data. By using this game, you agree to our terms of service."
      );
    });
  }

  if (elements.supportBtn && elements.supportBtn.parentNode) {
    const newSupportBtn = elements.supportBtn.cloneNode(true);
    elements.supportBtn.parentNode.replaceChild(newSupportBtn, elements.supportBtn);
    newSupportBtn.addEventListener("click", () => {
      console.log("Support button clicked");
      showInfoPopup(
        "Support - How to Play",
        "🎮 Game Rules:<br/>• Get 3 in a row to win<br/>• Play against AI in different difficulties<br/>• Choose grid sizes: 3x3, 4x4, or 5x5<br/>• Win 2 out of 3 rounds to win the match<br/><br/>🎵 Audio: Toggle music and sound effects<br/>🎨 Theme: Switch theme in MarketPlace"
      );
    });
  }

  if (elements.aboutBtn && elements.aboutBtn.parentNode) {
    const newAboutBtn = elements.aboutBtn.cloneNode(true);
    elements.aboutBtn.parentNode.replaceChild(newAboutBtn, elements.aboutBtn);
    newAboutBtn.addEventListener("click", () => {
      console.log("About Us button clicked");
      showInfoPopup(
        "About Us - ACE Team",
        "👥 ACE Team Members:<br/>• Đặng Chí Thanh (25730067)<br/>• Đào Vĩnh Bảo Phúc (25730053)<br/>• Phạm Lê Yến Nhi (25730049)<br/>• Tăng Phước Thịnh (25730071)<br/>• Hoàng Cao Sơn (25730061)<br/><br/>🎓 UIT - University of Information Technology<br/>📚 Final Project - SS004.10 Professional Skills<br/>💻 Built with HTML, CSS, JavaScript"
      );
    });
  }
}

// Khởi tạo tất cả
function initializeSettingsScreen() {
  setupEventListeners();
  loadSettings();
  updateMusicToggle();
  console.log("⚙️ Settings initialized successfully");
}

// Khởi tạo khi DOM sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeSettingsScreen);
} else {
  initializeSettingsScreen();
}

// Export functions for external access
window["SettingsManager"] = {
  initializeSettings: initializeSettingsScreen,
  toggleMusic,
  navigateBack,
  getCurrentSettings: () => currentSettings,
};
