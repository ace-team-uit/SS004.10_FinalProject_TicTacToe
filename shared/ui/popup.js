/**
 * Popup Manager Module
 * Quản lý các popup modal cho game Tic Tac Toe
 *
 * Module này xử lý:
 * - Hiển thị các popup modal với background images
 * - Quản lý trạng thái popup (hiển thị/ẩn)
 * - Xử lý các sự kiện click trên popup
 * - Tích hợp với audio system và game logic
 *
 * @author ACE Team
 * @version 1.0.0
 *
 * @example
 * // Hiển thị popup thắng
 * window.PopupManager.showWinPopup();
 *
 * // Hiển thị popup thua
 * window.PopupManager.showLosePopup();
 *
 * // Hiển thị popup hòa
 * window.PopupManager.showDrawPopup();
 *
 * // Hiển thị popup yêu cầu quyền âm thanh
 * window.PopupManager.showAccessAudioPopup();
 *
 * // Hiển thị popup thoát game
 * window.PopupManager.showExitPopup();
 */

class PopupManager {
  constructor() {
    this.currentPopup = null;
    this.popupContainer = null;
    this.isInitialized = false;
    
    // Mapping các loại popup với background images
    this.popupConfigs = {
      'access-audio': {
        image: 'assets/images/popup/access-audio-popup.png',
        buttons: [
          { id: 'deny-audio', text: 'Deny', action: 'deny', image: 'assets/images/common/deny-button.png' },
          { id: 'allow-audio', text: 'Allow', action: 'allow', image: 'assets/images/common/allow-button.png' },
        ]
      },
      'win': {
        image: 'assets/images/popup/win-popup.png',
        buttons: [
          { id: 'exit-game', text: 'Exit', action: 'exit', image: 'assets/images/common/exit-button.png' },
          { id: 'reset-game', text: 'Replay', action: 'reset', image: 'assets/images/common/reset-button.png' },
        ]
      },
      'lose': {
        image: 'assets/images/popup/lose-popup.png',
        buttons: [
          { id: 'exit-game', text: 'Exit', action: 'exit', image: 'assets/images/common/exit-button.png' },
          { id: 'reset-game', text: 'Replay', action: 'reset', image: 'assets/images/common/reset-button.png' },
        ]
      },
      'draw': {
        image: 'assets/images/popup/draw-popup.png',
        buttons: [
          { id: 'exit-game', text: 'Exit', action: 'exit', image: 'assets/images/common/exit-button.png' },
          { id: 'reset-game', text: 'Replay', action: 'reset', image: 'assets/images/common/reset-button.png' },
        ]
      },
      'exit': {
        image: 'assets/images/popup/exit-popup.png',
        buttons: [
          { id: 'cancel-exit', text: 'No', action: 'cancel', image: 'assets/images/common/deny-button.png' },
          { id: 'confirm-exit', text: 'Yes', action: 'confirm', image: 'assets/images/common/allow-button.png' },
        ]
      }
    };
  }

  /**
   * Khởi tạo popup system
   */
  init() {
    if (this.isInitialized) return;
    
    this.createPopupContainer();
    this.isInitialized = true;
    console.log('✅ Popup system initialized');
  }

  /**
   * Tạo container chứa popup
   */
  createPopupContainer() {
    // Tạo container chính
    this.popupContainer = document.createElement('div');
    this.popupContainer.id = 'popup-container';
    this.popupContainer.className = 'popup-container';
    this.popupContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      backdrop-filter: blur(5px);
    `;

    // Tạo popup content
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    popupContent.style.cssText = `
      position: relative;
      max-width: 90%;
      max-height: 90%;
      display: flex;
      flex-direction: column;
      align-items: center;
    `;

    // Tạo popup background
    const popupBackground = document.createElement('div');
    popupBackground.className = 'popup-background';
    popupBackground.style.cssText = `
      position: relative;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      width: 100%;
      height: 100%;
      min-width: 300px;
      min-height: 364px;
    `;

    // Tạo button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'popup-buttons';
    buttonContainer.style.cssText = `
      position: absolute;
      width: 100%;
      bottom: -10%;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 20px;
      justify-content: center;
      align-items: center;
    `;

    popupBackground.appendChild(buttonContainer);
    popupContent.appendChild(popupBackground);
    this.popupContainer.appendChild(popupContent);

    // Thêm vào body
    document.body.appendChild(this.popupContainer);

    // Xử lý click outside để đóng popup
    this.popupContainer.addEventListener('click', (e) => {
      if (e.target === this.popupContainer) {
        this.hidePopup();
      }
    });
  }

  /**
   * Hiển thị popup theo loại
   * @param {string} type - Loại popup ('access-audio', 'win', 'lose', 'draw', 'exit')
   * @param {Object} options - Tùy chọn bổ sung
   */
  showPopup(type, options = {}) {
    if (!this.isInitialized) {
      this.init();
    }

    const config = this.popupConfigs[type];
    if (!config) {
      console.error(`❌ Unknown popup type: ${type}`);
      return;
    }

    // Ẩn popup hiện tại nếu có
    this.hidePopup();

    // Cập nhật background image
    if (this.popupContainer) {
      const popupBackground = this.popupContainer.querySelector('.popup-background');
      if (popupBackground) {
        /** @type {HTMLElement} */ (popupBackground).style.backgroundImage = `url(${config.image})`;
      }
    }

    // Tạo buttons
    this.createButtons(config.buttons, type, options);

    // Hiển thị popup
    if (this.popupContainer) {
      this.popupContainer.style.display = 'flex';
    }
    this.currentPopup = type;

    // Phát âm thanh click nếu có
    if (window['playSound']) {
      window['playSound']('click');
    }

    console.log(`✅ Showing popup: ${type}`);
  }

  /**
   * Tạo các button cho popup
   * @param {Array} buttons - Danh sách button configs
   * @param {string} popupType - Loại popup
   * @param {Object} options - Tùy chọn bổ sung
   */
  createButtons(buttons, popupType, options) {
    if (!this.popupContainer) return;
    const buttonContainer = this.popupContainer.querySelector('.popup-buttons');
    if (!buttonContainer) return;
    
    buttonContainer.innerHTML = '';

    buttons.forEach((buttonConfig, index) => {
      const button = document.createElement('button');
      button.id = buttonConfig.id;
      button.textContent = buttonConfig.text;
      button.className = 'popup-button';
      
      // Style cho button với background image
      if (buttonConfig.image) {
        button.style.cssText = `
          width: 120px;
          height: 54px;
          border: none;
          cursor: pointer;
          background: url(${buttonConfig.image}) no-repeat center center;
          background-size: contain;
          transition: all 0.3s ease;
          color: white;
          font-size: 20px;
          font-weight: bold;
          font-family: var(--font-display);
          padding-bottom: 8px;
        `;
      } else {
        // Fallback style nếu không có image
        button.style.cssText = `
          padding: 12px 24px;
          font-size: 16px;
          font-weight: bold;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 100px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        `;
      }

      // Hover effects
      button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.1)';
        button.style.filter = 'brightness(1.2)';
      });

      button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.filter = 'brightness(1)';
      });

      // Xử lý click
      button.addEventListener('click', () => {
        this.handleButtonClick(buttonConfig.action, popupType, options);
      });

      buttonContainer.appendChild(button);
    });
  }

  /**
   * Xử lý click button
   * @param {string} action - Hành động của button
   * @param {string} popupType - Loại popup
   * @param {Object} options - Tùy chọn bổ sung
   */
  handleButtonClick(action, popupType, options) {
    // Phát âm thanh click
    if (window['playSound']) {
      window['playSound']('click');
    }

    switch (action) {
      case 'allow':
        this.handleAllowAudio();
        break;
      case 'deny':
        this.handleDenyAudio();
        break;
      case 'reset':
        this.handleResetGame();
        break;
      case 'exit':
        this.handleExitGame();
        // Không ẩn popup hiện tại vì handleExitGame sẽ hiển thị popup mới
        return;
      case 'confirm':
        this.handleConfirmExit();
        break;
      case 'cancel':
        this.handleCancelExit();
        break;
      default:
        console.warn(`⚠️ Unknown button action: ${action}`);
    }

    // Ẩn popup hiện tại (trừ trường hợp 'exit')
    this.hidePopup();
  }

  /**
   * Xử lý cho phép âm thanh
   */
  handleAllowAudio() {
    console.log('✅ User allowed audio access');
    
    // Lưu cài đặt cho phép âm thanh
    if (window['AppStorage']) {
      window['AppStorage'].saveSettings({ 
        gameMusicEnabled: true,
        gameAudioAlertShown: true 
      });
    }

    // Khởi tạo lại audio system
    if (window['audioManager']) {
      window['audioManager'].toggleMute(false);
    }
  }

  /**
   * Xử lý từ chối âm thanh
   */
  handleDenyAudio() {
    console.log('❌ User denied audio access');
    
    // Lưu cài đặt tắt âm thanh
    if (window['AppStorage']) {
      window['AppStorage'].saveSettings({ 
        gameMusicEnabled: false,
        gameAudioAlertShown: true 
      });
    }

    // Tắt âm thanh
    if (window['audioManager']) {
      window['audioManager'].toggleMute(true);
    }
  }

  /**
   * Xử lý reset game
   */
  handleResetGame() {
    console.log('🔄 Resetting game');
    
    // Reset game data sử dụng hàm reset() có sẵn
    if (window['GameData'] && window['GameData'].state) {
      window['GameData'].reset();
    }

    // Reset UI bàn cờ
    this.resetGameBoardUI();

    // Reset HUD nếu có
    if (window['GameHUD']) {
      window['GameHUD'].resetTimer();
    }

    // Phát âm thanh reset nếu có
    if (window['playSound']) {
      window['playSound']('click');
    }
  }

  /**
   * Reset UI bàn cờ
   */
  resetGameBoardUI() {
    const gameBoard = document.getElementById('game-board');
    if (!gameBoard) return;

    // Xóa tất cả marks trên bàn cờ
    const cells = gameBoard.querySelectorAll('.board-cell');
    cells.forEach(cell => {
      cell.setAttribute('data-value', '');
      const cellText = cell.querySelector('.cell-text');
      if (cellText) {
        cellText.textContent = '';
      }
      
      // Enable lại cell
      const cellElement = /** @type {HTMLElement} */ (cell);
      cellElement.style.cursor = 'pointer';
      cellElement.style.pointerEvents = 'auto';
      cellElement.style.opacity = '1';
      cellElement.style.backgroundColor = '';
    });

    console.log('✅ Game board UI reset');
  }

  /**
   * Xử lý thoát game
   */
  handleExitGame() {
    console.log('🚪 Showing exit confirmation');
    
    // Phát âm thanh click
    if (window['playSound']) {
      window['playSound']('click');
    }
    
    // Hiển thị popup exit confirmation
    this.showExitPopup();
  }

  /**
   * Xử lý xác nhận thoát
   */
  handleConfirmExit() {
    console.log('✅ User confirmed exit');
    
    // Phát âm thanh thoát nếu có
    if (window['playSound']) {
      window['playSound']('click');
    }

    // Điều hướng về mode2
    if (window['Navigation']) {
      window['Navigation'].navigateTo('mode2');
    } else {
      window.location.href = '#mode2';
    }
  }

  /**
   * Xử lý hủy thoát
   */
  handleCancelExit() {
    console.log('❌ User cancelled exit');
    
    // Phát âm thanh click
    if (window['playSound']) {
      window['playSound']('click');
    }

    // Quay lại game (tương tự reset)
    this.handleResetGame();
  }



  /**
   * Ẩn popup hiện tại
   */
  hidePopup() {
    if (this.popupContainer) {
      this.popupContainer.style.display = 'none';
      this.currentPopup = null;
    }
  }

  /**
   * Kiểm tra popup có đang hiển thị không
   */
  isPopupVisible() {
    return this.currentPopup !== null;
  }

  /**
   * Lấy loại popup hiện tại
   */
  getCurrentPopup() {
    return this.currentPopup;
  }

  // ===== PUBLIC API METHODS =====

  /**
   * Hiển thị popup yêu cầu quyền âm thanh
   */
  showAccessAudioPopup() {
    this.showPopup('access-audio');
  }

  /**
   * Hiển thị popup thắng
   */
  showWinPopup() {
    this.showPopup('win');
  }

  /**
   * Hiển thị popup thua
   */
  showLosePopup() {
    this.showPopup('lose');
  }

  /**
   * Hiển thị popup hòa
   */
  showDrawPopup() {
    this.showPopup('draw');
  }

  /**
   * Hiển thị popup thoát game
   */
  showExitPopup() {
    this.showPopup('exit');
  }

  /**
   * Ẩn tất cả popup
   */
  hideAllPopups() {
    this.hidePopup();
  }
}

// Tạo instance toàn cục
const popupManager = new PopupManager();

// Xuất API toàn cục
window['PopupManager'] = popupManager;

// Xuất cho việc kiểm thử
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PopupManager, popupManager };
}

console.log('✅ Popup Manager loaded');