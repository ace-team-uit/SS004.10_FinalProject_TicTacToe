/**
 * Audio Manager Module
 * Quản lý âm thanh và BGM cho game Tic Tac Toe
 *
 * Module này xử lý:
 * - Load và preload các file âm thanh
 * - Phát sound effects và BGM
 * - Xử lý fade in/out cho BGM
 * - Điều khiển volume và mute
 * - Tự động thay đổi BGM theo màn hình
 * - Xử lý autoplay policy của browser
 *
 * @author ACE Team
 * @version 1.1.0
 *
 * @example
 * // Initialize audio system
 * await window.initAudio();
 *
 * // Play a sound effect
 * window.playSound("click");
 *
 * // Play background music
 * window.playBgm("bgm-game");
 *
 * // Get audio manager instance
 * const manager = window.audioManager;
 *
 * // Control volume
 * manager.setVolume(0.8);
 * manager.setBgmVolume(0.5);
 *
 * // Toggle mute
 * manager.toggleMute();
 */

class AudioManager {
  constructor() {
    this.audioContext = null;
    this.sounds = new Map();
    this.bgm = new Map();
    this.currentBgm = null;
    this.isMuted = false;
    this.volume = 1.0;
    this.bgmVolume = 0.7;
    this.autoplayAlertShown = false;

    // Ánh xạ âm thanh
    this.soundMap = {
      click: "assets/sounds/click.mp3",
      win: "assets/sounds/win.mp3",
      lose: "assets/sounds/lose.mp3",
      draw: "assets/sounds/draw.mp3",
    };

    // Ánh xạ BGM
    this.bgmMap = {
      "bgm-home": "assets/sounds/bgm/Elevator.mp3",
      "bgm-game": "assets/sounds/bgm/Run-Amok.mp3",
      "bgm-select": "assets/sounds/bgm/Fluffing-a-Duck.mp3",
      "bgm-intro": "assets/sounds/bgm/Elevator.mp3",
      "bgm-settings": "assets/sounds/bgm/Elevator.mp3",
      "bgm-result": "assets/sounds/bgm/Elevator.mp3",
    };
  }

  /**
   * Khởi tạo audio context và preload các sound assets
   */
  async initAudio() {
    try {
      // Tạo audio context nếu browser hỗ trợ
      if (
        typeof AudioContext !== "undefined" ||
        typeof window["webkitAudioContext"] !== "undefined"
      ) {
        this.audioContext = new (AudioContext || window["webkitAudioContext"])();
      }

      // Tải trước tất cả âm thanh
      await this.preloadSounds();

      // Tải trước tất cả BGM
      await this.preloadBGM();

      // Kiểm tra chính sách tự động phát và hiển thị cảnh báo nếu cần
      await this.checkAutoplayPolicy();

      console.log("🎵 Audio system initialized successfully");
      return true;
    } catch (error) {
      console.warn("⚠️ Audio initialization failed:", error);
      return false;
    }
  }

  /**
   * Preload tất cả sound effects
   */
  async preloadSounds() {
    const promises = Object.entries(this.soundMap).map(([name, path]) =>
      this.loadSound(name, path)
    );

    try {
      await Promise.all(promises);
      console.log("🔊 All sound effects preloaded");
    } catch (error) {
      console.warn("⚠️ Some sound effects failed to load:", error);
    }
  }

  /**
   * Preload tất cả BGM
   */
  async preloadBGM() {
    const promises = Object.entries(this.bgmMap).map(([name, path]) => this.loadBGM(name, path));

    try {
      await Promise.all(promises);
      console.log("🎶 All BGM preloaded");
    } catch (error) {
      console.warn("⚠️ Some BGM failed to load:", error);
    }
  }

  /**
   * Load một sound effect và lưu vào cache
   * @param {string} name - Tên của sound effect
   * @param {string} path - Đường dẫn đến file âm thanh
   * @returns {Promise<HTMLAudioElement|null>} Audio element hoặc null nếu load thất bại
   * @throws {Error} Nếu path không hợp lệ hoặc file không tồn tại
   */
  async loadSound(name, path) {
    try {
      const audio = new Audio();
      audio.preload = "auto";

      // Xử lý lỗi 404
      audio.onerror = () => {
        console.warn(`⚠️ Không thể tải âm thanh: ${path}`);
        this.sounds.set(name, null);
      };

      audio.src = path;
      await audio.load();

      this.sounds.set(name, audio);
      return audio;
    } catch (error) {
      console.warn(`⚠️ Error loading sound ${name}:`, error);
      this.sounds.set(name, null);
      return null;
    }
  }

  /**
   * Load một BGM và lưu vào cache
   * @param {string} name - Tên của BGM track
   * @param {string} path - Đường dẫn đến file âm thanh
   * @returns {Promise<HTMLAudioElement|null>} Audio element hoặc null nếu load thất bại
   * @throws {Error} Nếu path không hợp lệ hoặc file không tồn tại
   */
  async loadBGM(name, path) {
    try {
      const audio = new Audio();
      audio.preload = "auto";
      audio.loop = true;

      // Xử lý lỗi 404
      audio.onerror = () => {
        console.warn(`⚠️ Không thể tải BGM: ${path}`);
        this.bgm.set(name, null);
      };

      audio.src = path;
      await audio.load();

      this.bgm.set(name, audio);
      return audio;
    } catch (error) {
      console.warn(`⚠️ Error loading BGM ${name}:`, error);
      this.bgm.set(name, null);
      return null;
    }
  }

  /**
   * Kiểm tra autoplay policy và hiển thị alert nếu cần
   */
  async checkAutoplayPolicy() {
    try {
      // Kiểm tra xem đã hiển thị alert chưa
      const settings = window["AppStorage"]?.loadSettings();
      if (settings?.gameAudioAlertShown) {
        console.log("✅ Audio alert already shown, skipping");
        return;
      }

      // Kiểm tra tự động phát với một âm thanh ngắn
      const testSound = this.sounds.get("click");
      if (testSound) {
        // Tạm thời đặt volume = 0 để kiểm tra mà không phát âm thanh
        const originalVolume = testSound.volume;
        testSound.volume = 0;

        try {
          await testSound.play();
          testSound.pause();
          testSound.currentTime = 0;
          console.log("✅ Autoplay policy: Allowed");
        } catch {
          console.warn("⚠️ Autoplay policy: Blocked");
          this.showAutoplayAlert();
        } finally {
          testSound.volume = originalVolume;
        }
      }
    } catch (error) {
      console.warn("⚠️ Error checking autoplay policy:", error);
    }
  }

  /**
   * Hiển thị popup yêu cầu user cho phép âm thanh
   */
  showAutoplayAlert() {
    // Chỉ hiển thị popup một lần
    if (this.autoplayAlertShown) return;
    this.autoplayAlertShown = true;

    // Lưu vào storage để không hiển thị lại
    window["AppStorage"]?.saveSettings({ gameAudioAlertShown: true });

    // Sử dụng popup system thay vì alert
    if (window["PopupManager"]) {
      console.log("🎵 Showing access audio popup");
      window["PopupManager"].showAccessAudioPopup();
    } else {
      // Fallback về alert nếu popup system chưa sẵn sàng
      console.warn("⚠️ PopupManager not available, falling back to alert");
      const alertMessage = `
🎵 Để có trải nghiệm âm thanh tốt nhất, vui lòng:

1. Click vào bất kỳ đâu trên trang để cho phép âm thanh
2. Hoặc click vào nút "Play" để test âm thanh
3. Nếu vẫn không có âm thanh, hãy kiểm tra:
   - Browser settings (cho phép autoplay)
   - Volume của thiết bị
   - Không có extension nào chặn âm thanh

Click OK để tiếp tục.
      `;
      alert(alertMessage);
    }
  }

  /**
   * Tự động thay đổi BGM dựa trên màn hình
   */
  autoChangeBGM(screenPath) {
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
      const currentBgm = this.getStatus().currentBgm;
      const newBgmPath = this.bgmMap[bgmType];

      if (currentBgm !== newBgmPath) {
        console.log(`🎵 Auto-changing BGM to: ${bgmType}`);
        this.playBgm(bgmType);
      }
    } catch (error) {
      console.warn("⚠️ Error auto-changing BGM:", error);
    }
  }

  /**
   * Phát sound effect (hỗ trợ overlapping)
   * @param {string} soundName - Tên của sound effect cần phát
   * @returns {void}
   * @throws {Error} Nếu sound không tồn tại hoặc không thể phát
   * @example
   * audioManager.playSound("click");
   * audioManager.playSound("win");
   */
  playSound(soundName) {
    if (this.isMuted) return;

    const sound = this.sounds.get(soundName);
    if (!sound) {
      console.warn(`⚠️ Sound not found: ${soundName}`);
      return;
    }

    try {
      // Sao chép audio để có thể phát nhiều lần cùng lúc
      const soundClone = sound.cloneNode();
      soundClone.volume = this.volume;

      soundClone.play().catch((error) => {
        console.warn(`⚠️ Failed to play sound ${soundName}:`, error);
      });

      // Dọn dẹp sau khi phát xong
      soundClone.onended = () => {
        soundClone.remove();
      };
    } catch (error) {
      console.warn(`⚠️ Error playing sound ${soundName}:`, error);
    }
  }

  /**
   * Phát BGM với fade effect
   * @param {string} type - Loại BGM cần phát (bgm-home, bgm-game, etc.)
   * @returns {Promise<void>}
   * @throws {Error} Nếu BGM không tồn tại hoặc không thể phát
   * @example
   * await audioManager.playBgm("bgm-game");
   * await audioManager.playBgm("bgm-home");
   */
  async playBgm(type) {
    if (this.isMuted) return;

    const bgm = this.bgm.get(type);
    if (!bgm) {
      console.warn(`⚠️ BGM not found: ${type}`);
      return;
    }

    try {
      // Làm mờ dần BGM hiện tại nếu có
      if (this.currentBgm && this.currentBgm !== bgm) {
        await this.fadeOutBGM(this.currentBgm);
        this.currentBgm.pause();
        this.currentBgm.currentTime = 0;
      }

      // Làm rõ dần BGM mới
      this.currentBgm = bgm;
      bgm.volume = 0;
      bgm?.play?.();
      await this.fadeInBGM(bgm);

      console.log(`🎶 Playing BGM: ${type}`);
    } catch (error) {
      console.warn(`⚠️ Error playing BGM ${type}:`, error);
    }
  }

  /**
   * Fade in BGM với hiệu ứng mượt mà
   * @param {HTMLAudioElement} audio - Audio element cần fade in
   * @param {number} [duration=1000] - Thời gian fade in (ms)
   * @returns {Promise<void>}
   */
  async fadeInBGM(audio, duration = 1000) {
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = this.bgmVolume / steps;

    for (let i = 0; i < steps; i++) {
      audio.volume = volumeStep * (i + 1);
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }
    audio.volume = this.bgmVolume;
  }

  /**
   * Fade out BGM với hiệu ứng mượt mà
   * @param {HTMLAudioElement} audio - Audio element cần fade out
   * @param {number} [duration=500] - Thời gian fade out (ms)
   * @returns {Promise<void>}
   */
  async fadeOutBGM(audio, duration = 500) {
    const steps = 10;
    const stepDuration = duration / steps;
    const currentVolume = audio.volume;
    const volumeStep = currentVolume / steps;

    for (let i = 0; i < steps; i++) {
      audio.volume = currentVolume - volumeStep * i;
      await new Promise((resolve) => setTimeout(resolve, stepDuration));
    }
    audio.volume = 0;
  }

  /**
   * Dừng BGM hiện tại
   */
  stopBgm() {
    if (this.currentBgm) {
      this.currentBgm.pause();
      this.currentBgm.currentTime = 0;
      this.currentBgm = null;
    }
  }

  /**
   * Tắt/bật âm thanh
   */
  toggleMute(isMuted = !this.isMuted) {
    this.isMuted = isMuted;

    if (this.isMuted) {
      this.stopBgm();
    }

    console.log(`🔇 Audio ${this.isMuted ? "muted" : "unmuted"}`);
    return this.isMuted;
  }

  /**
   * Điều chỉnh volume cho sound effects
   * @param {number} volume - Giá trị volume (0.0 - 1.0)
   * @returns {void}
   * @throws {Error} Nếu volume không hợp lệ
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    console.log(`🔊 Sound volume set to: ${this.volume}`);
  }

  /**
   * Điều chỉnh volume cho BGM
   * @param {number} volume - Giá trị volume (0.0 - 1.0)
   * @returns {void}
   * @throws {Error} Nếu volume không hợp lệ
   */
  setBgmVolume(volume) {
    this.bgmVolume = Math.max(0, Math.min(1, volume));

    if (this.currentBgm) {
      this.currentBgm.volume = this.bgmVolume;
    }

    console.log(`🎶 BGM volume set to: ${this.bgmVolume}`);
  }

  /**
   * Lấy trạng thái hiện tại của audio system
   * @returns {{
   *   isMuted: boolean,
   *   volume: number,
   *   bgmVolume: number,
   *   currentBgm: string|null,
   *   soundsLoaded: number,
   *   bgmLoaded: number
   * }} Trạng thái audio system
   */
  getStatus() {
    return {
      isMuted: this.isMuted,
      volume: this.volume,
      bgmVolume: this.bgmVolume,
      currentBgm: this.currentBgm ? this.currentBgm.src : null,
      soundsLoaded: this.sounds.size,
      bgmLoaded: this.bgm.size,
    };
  }

  /**
   * Cleanup resources
   */
  destroy() {
    this.stopBgm();
    this.sounds.clear();
    this.bgm.clear();

    if (this.audioContext) {
      this.audioContext.close();
    }

    console.log("🗑️ Audio manager destroyed");
  }
}

// Tạo instance toàn cục
const audioManager = new AudioManager();

// Xuất các hàm để main.js sử dụng
window["audioManager"] = audioManager;
window["initAudio"] = () => audioManager.initAudio();
window["playSound"] = (soundName) => audioManager.playSound(soundName);
window["playBgm"] = (type) => audioManager.playBgm(type);

// Xuất cho việc kiểm thử
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AudioManager, audioManager };
}
