// Trợ giúp lưu trữ (nguồn duy nhất của sự thật)
(function () {
  const NAMESPACE = "tictactoe";

  // Cài đặt mặc định
  const DEFAULTS = {
    gameTheme: "dark",
    gameLanguage: "en",
    gameMusicEnabled: true,
    gameSoundEnabled: true,
    gameDifficulty: "easy",
    gameGridSize: "3x3",
    gameIntroShown: false,
    gameAudioAlertShown: false,
  };

  // Ánh xạ khóa cũ để di chuyển
  const LEGACY_KEYS = {
    musicEnabled: "gameMusicEnabled",
    soundEnabled: "gameSoundEnabled",
    audioAlertShown: "gameAudioAlertShown",
    introShown: "gameIntroShown",
  };

  // Các hàm tiện ích
  function getKey(key) {
    return `${NAMESPACE}.${key}`;
  }

  function get(key, defaultValue = null) {
    const value = localStorage.getItem(getKey(key));
    if (value === null) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  function set(key, value) {
    const serialized = typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(getKey(key), serialized);
  }

  function remove(key) {
    localStorage.removeItem(getKey(key));
  }

  function clear() {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(NAMESPACE)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Quản lý cài đặt
  function loadSettings() {
    return {
      gameTheme: get("gameTheme") ?? DEFAULTS.gameTheme,
      gameLanguage: get("gameLanguage") ?? DEFAULTS.gameLanguage,
      gameMusicEnabled: get("gameMusicEnabled") ?? DEFAULTS.gameMusicEnabled,
      gameSoundEnabled: get("gameSoundEnabled") ?? DEFAULTS.gameSoundEnabled,
      gameDifficulty: get("gameDifficulty") ?? DEFAULTS.gameDifficulty,
      gameGridSize: get("gameGridSize") ?? DEFAULTS.gameGridSize,
      gameIntroShown: get("gameIntroShown") ?? DEFAULTS.gameIntroShown,
      gameAudioAlertShown: get("gameAudioAlertShown") ?? DEFAULTS.gameAudioAlertShown,
    };
  }

  function saveSettings(settings) {
    Object.entries(settings).forEach(([key, value]) => {
      if (value !== undefined) {
        set(key, value);
      }
    });
  }

  // Trợ giúp di chuyển
  function migrateLegacySettings() {
    // Di chuyển các khóa cũ
    Object.entries(LEGACY_KEYS).forEach(([oldKey, newKey]) => {
      const value = localStorage.getItem(oldKey);
      if (value !== null) {
        set(newKey, value);
        localStorage.removeItem(oldKey);
        console.log(`🔄 Đã di chuyển ${oldKey} -> ${getKey(newKey)}: ${value}`);
      }
    });

    // Di chuyển bất kỳ giá trị localStorage trực tiếp nào
    const settings = loadSettings();
    Object.keys(settings).forEach((key) => {
      const legacyValue = localStorage.getItem(key);
      if (legacyValue !== null) {
        set(key, legacyValue);
        localStorage.removeItem(key);
        console.log(`🔄 Đã di chuyển trực tiếp ${key} -> ${getKey(key)}: ${legacyValue}`);
      }
    });
  }

  // Chạy di chuyển khi khởi tạo
  migrateLegacySettings();

  // Xuất API
  /** @type {any} */ (window).AppStorage = {
    // Các thao tác lưu trữ cốt lõi
    get,
    set,
    remove,
    clear,

    // Quản lý cài đặt
    loadSettings,
    saveSettings,
    DEFAULTS,

    // Trợ giúp debug
    getKey,
  };
})();
