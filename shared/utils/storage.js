// Storage helper (single source of truth)
(function () {
  const NAMESPACE = "tictactoe";

  // Default settings
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

  // Legacy key mapping for migration
  const LEGACY_KEYS = {
    musicEnabled: "gameMusicEnabled",
    soundEnabled: "gameSoundEnabled",
    audioAlertShown: "gameAudioAlertShown",
    introShown: "gameIntroShown",
  };

  // Utility functions
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

  // Settings management
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

  // Migration helper
  function migrateLegacySettings() {
    // Migrate legacy keys
    Object.entries(LEGACY_KEYS).forEach(([oldKey, newKey]) => {
      const value = localStorage.getItem(oldKey);
      if (value !== null) {
        set(newKey, value);
        localStorage.removeItem(oldKey);
        console.log(`🔄 Migrated ${oldKey} -> ${getKey(newKey)}: ${value}`);
      }
    });

    // Migrate any direct localStorage values
    const settings = loadSettings();
    Object.keys(settings).forEach((key) => {
      const legacyValue = localStorage.getItem(key);
      if (legacyValue !== null) {
        set(key, legacyValue);
        localStorage.removeItem(key);
        console.log(`🔄 Migrated direct ${key} -> ${getKey(key)}: ${legacyValue}`);
      }
    });
  }

  // Run migration on init
  migrateLegacySettings();

  // Export API
  /** @type {any} */ (window).AppStorage = {
    // Core storage operations
    get,
    set,
    remove,
    clear,

    // Settings management
    loadSettings,
    saveSettings,
    DEFAULTS,

    // Debug helpers
    getKey,
  };
})();
