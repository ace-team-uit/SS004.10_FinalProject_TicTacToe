/**
 * Timer Management Module
 * Quản lý đồng hồ lượt chơi với tích hợp độ khó
 * Hỗ trợ start/stop, pause/resume và event system
 */

const TimerManager = {
  /**
   * Khởi tạo trạng thái timer mới
   * @param {string} difficulty - Độ khó ('easy', 'medium', 'hard')
   * @returns {Object} State mẫu cho timer
   */
  initTimerState(difficulty = "medium") {
    if (!["easy", "medium", "hard"].includes(difficulty)) {
      throw new Error("Difficulty must be 'easy', 'medium', or 'hard'");
    }

    return {
      difficulty: difficulty,
      isRunning: false,
      isPaused: false,
      currentTime: 0,
      maxTime: this.getTimeByDifficulty(difficulty),
      timerId: null,
      startTime: null,
      pauseTime: null,
      totalPausedTime: 0,
      onTimeout: null,
      onTick: null,
    };
  },

  /**
   * Lấy thời gian dựa trên độ khó
   * @param {string} difficulty - Độ khó
   * @returns {number} Thời gian tính bằng giây
   */
  getTimeByDifficulty(difficulty) {
    const timeMap = {
      easy: 15,
      medium: 10,
      hard: 5,
    };
    return timeMap[difficulty] || 10;
  },

  /**
   * Bắt đầu đếm thời gian cho lượt
   * @param {Object} timerState - Trạng thái timer hiện tại
   * @param {number} duration - Thời gian tùy chỉnh (tùy chọn)
   * @param {Function} onTimeout - Callback khi hết giờ
   * @param {Function} onTick - Callback mỗi giây (tùy chọn)
   * @returns {Object} State mới với timer đang chạy
   */
  startTurnTimer(timerState, duration, onTimeout, onTick = null) {
    if (!timerState) {
      throw new Error("Invalid timer state provided");
    }

    // Dừng timer cũ nếu đang chạy
    if (timerState.isRunning) {
      this.stopTurnTimer(timerState);
    }

    const newState = { ...timerState };
    const finalDuration = duration || this.getTimeByDifficulty(timerState.difficulty);

    newState.isRunning = true;
    newState.isPaused = false;
    newState.currentTime = finalDuration;
    newState.maxTime = finalDuration;
    newState.startTime = Date.now();
    newState.pauseTime = null;
    newState.totalPausedTime = 0;
    newState.onTimeout = onTimeout;
    newState.onTick = onTick;

    // Bắt đầu countdown
    // eslint-disable-next-line no-undef
    newState.timerId = setInterval(() => {
      this._tick(newState);
    }, 1000);

    return newState;
  },

  /**
   * Dừng đồng hồ
   * @param {Object} timerState - Trạng thái timer hiện tại
   * @returns {Object} State mới với timer đã dừng
   */
  stopTurnTimer(timerState) {
    if (!timerState) {
      throw new Error("Invalid timer state provided");
    }

    const newState = { ...timerState };

    if (newState.timerId) {
      // eslint-disable-next-line no-undef
      clearInterval(newState.timerId);
      newState.timerId = null;
    }

    newState.isRunning = false;
    newState.isPaused = false;
    newState.currentTime = 0;
    newState.startTime = null;
    newState.pauseTime = null;
    newState.totalPausedTime = 0;

    return newState;
  },

  /**
   * Tạm dừng timer
   * @param {Object} timerState - Trạng thái timer hiện tại
   * @returns {Object} State mới với timer đã tạm dừng
   */
  pause(timerState) {
    if (!timerState || !timerState.isRunning || timerState.isPaused) {
      return timerState;
    }

    const newState = { ...timerState };
    newState.isPaused = true;
    newState.pauseTime = Date.now();

    if (newState.timerId) {
      // eslint-disable-next-line no-undef
      clearInterval(newState.timerId);
      newState.timerId = null;
    }

    return newState;
  },

  /**
   * Tiếp tục timer
   * @param {Object} timerState - Trạng thái timer hiện tại
   * @returns {Object} State mới với timer đã tiếp tục
   */
  resume(timerState) {
    if (!timerState || !timerState.isRunning || !timerState.isPaused) {
      return timerState;
    }

    const newState = { ...timerState };
    const pauseDuration = Date.now() - newState.pauseTime;
    newState.totalPausedTime += pauseDuration;
    newState.isPaused = false;
    newState.pauseTime = null;

    // Tiếp tục countdown
    // eslint-disable-next-line no-undef
    newState.timerId = setInterval(() => {
      this._tick(newState);
    }, 1000);

    return newState;
  },

  /**
   * Thay đổi độ khó và cập nhật thời gian
   * @param {Object} timerState - Trạng thái timer hiện tại
   * @param {string} newDifficulty - Độ khó mới
   * @returns {Object} State mới với độ khó đã thay đổi
   */
  setDifficulty(timerState, newDifficulty) {
    if (!timerState) {
      throw new Error("Invalid timer state provided");
    }

    if (!["easy", "medium", "hard"].includes(newDifficulty)) {
      throw new Error("Difficulty must be 'easy', 'medium', or 'hard'");
    }

    const newState = { ...timerState };
    newState.difficulty = newDifficulty;
    newState.maxTime = this.getTimeByDifficulty(newDifficulty);

    // Nếu timer đang chạy, cập nhật thời gian hiện tại
    if (newState.isRunning && !newState.isPaused) {
      newState.currentTime = Math.min(newState.currentTime, newState.maxTime);
    }

    return newState;
  },

  /**
   * Lấy thông tin trạng thái hiện tại
   * @param {Object} timerState - Trạng thái timer
   * @returns {Object} Thông tin trạng thái hiện tại
   */
  getCurrentStatus(timerState) {
    if (!timerState) {
      throw new Error("Invalid timer state provided");
    }

    return {
      isRunning: timerState.isRunning,
      isPaused: timerState.isPaused,
      currentTime: timerState.currentTime,
      maxTime: timerState.maxTime,
      difficulty: timerState.difficulty,
      timeRemaining: Math.max(0, timerState.currentTime),
      progress: timerState.maxTime > 0 ? (timerState.currentTime / timerState.maxTime) * 100 : 0,
    };
  },

  /**
   * Kiểm tra xem timer đã hết giờ chưa
   * @param {Object} timerState - Trạng thái timer
   * @returns {boolean} True nếu timer đã hết giờ
   */
  isTimeUp(timerState) {
    if (!timerState) {
      return false;
    }
    return timerState.currentTime <= 0;
  },

  /**
   * Lấy thời gian còn lại
   * @param {Object} timerState - Trạng thái timer
   * @returns {number} Thời gian còn lại tính bằng giây
   */
  getTimeRemaining(timerState) {
    if (!timerState) {
      return 0;
    }
    return Math.max(0, timerState.currentTime);
  },

  /**
   * Xử lý tick mỗi giây (private method)
   * @param {Object} timerState - Trạng thái timer
   * @private
   */
  _tick(timerState) {
    if (!timerState.isRunning || timerState.isPaused) {
      return;
    }

    timerState.currentTime--;

    // Gọi callback onTick nếu có
    if (timerState.onTick && typeof timerState.onTick === "function") {
      timerState.onTick(timerState.currentTime);
    }

    // Kiểm tra hết giờ
    if (timerState.currentTime <= 0) {
      this._handleTimeout(timerState);
    }
  },

  /**
   * Xử lý khi hết giờ (private method)
   * @param {Object} timerState - Trạng thái timer
   * @private
   */
  _handleTimeout(timerState) {
    // Dừng timer
    if (timerState.timerId) {
      // eslint-disable-next-line no-undef
      clearInterval(timerState.timerId);
      timerState.timerId = null;
    }

    timerState.isRunning = false;
    timerState.currentTime = 0;

    // Gọi callback onTimeout nếu có
    if (timerState.onTimeout && typeof timerState.onTimeout === "function") {
      timerState.onTimeout();
    }
  },

  /**
   * Reset timer về trạng thái ban đầu
   * @param {Object} timerState - Trạng thái timer hiện tại
   * @returns {Object} State mới với timer đã reset
   */
  reset(timerState) {
    if (!timerState) {
      throw new Error("Invalid timer state provided");
    }

    // Dừng timer cũ nếu đang chạy
    if (timerState.timerId) {
      // eslint-disable-next-line no-undef
      clearInterval(timerState.timerId);
    }

    return this.initTimerState(timerState.difficulty);
  },
};

// Export module
if (typeof module !== "undefined" && module.exports) {
  module.exports = TimerManager;
} else if (typeof window !== "undefined") {
  window.TimerManager = TimerManager;
}
