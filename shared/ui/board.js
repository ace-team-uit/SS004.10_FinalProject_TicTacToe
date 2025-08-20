/**
 * Board Component - Responsive Game Board UI
 * Tạo và cập nhật bàn cờ Tic Tac Toe với hỗ trợ responsive
 * Hỗ trợ các kích thước 3x3, 4x4, 5x5 và cả touch/click events
 */

export class BoardComponent {
  constructor() {
    this.element = null;
    this.size = 3;
    this.eventListeners = new Map();
    this.touchStartTime = 0;
    this.touchStartPosition = { x: 0, y: 0 };
  }

  /**
   * Tạo bàn cờ mới với kích thước được chỉ định
   * @param {number} size - Kích thước bàn (3, 4, hoặc 5)
   * @param {HTMLElement} target - Element cha để chèn bàn cờ
   * @returns {HTMLElement} Element bàn cờ đã tạo
   */
  createBoard(size = 3, target = document.body) {
    if (![3, 4, 5].includes(size)) {
      throw new Error("Board size must be 3, 4, or 5");
    }

    this.size = size;

    // Tạo container bàn cờ
    const boardContainer = document.createElement("div");
    boardContainer.className = "board-container";
    boardContainer.setAttribute("role", "grid");
    boardContainer.setAttribute("aria-label", `Tic Tac Toe board ${size}x${size}`);

    // Tạo grid bàn cờ
    const boardGrid = document.createElement("div");
    boardGrid.className = `board-grid board-${size}x${size}`;
    boardGrid.style.setProperty("--board-size", size);

    // Tạo các ô trong bàn cờ
    for (let i = 0; i < size * size; i++) {
      const cell = this._createCell(i);
      boardGrid.appendChild(cell);
    }

    boardContainer.appendChild(boardGrid);

    // Lưu reference và chèn vào target
    this.element = boardContainer;
    if (target) {
      target.appendChild(boardContainer);
    }

    // Gắn event listeners
    this._attachEventListeners();

    return boardContainer;
  }

  /**
   * Cập nhật trạng thái bàn cờ
   * @param {Array} board - Mảng trạng thái các ô (null, 1, hoặc 2)
   * @param {Object} options - Tùy chọn cập nhật
   * @param {boolean} options.animate - Có animation khi cập nhật không
   * @param {number|null} options.lastMove - Index của nước đi cuối cùng
   */
  updateBoard(board, options = {}) {
    if (!this.element || !Array.isArray(board)) {
      console.warn("Board element not found or invalid board data");
      return;
    }

    const { animate = true, lastMove = null } = options;
    const cells = this.element.querySelectorAll(".board-cell");

    cells.forEach((cell, index) => {
      const value = board[index];
      const currentValue = cell.getAttribute("data-value");

      // Chỉ cập nhật nếu có thay đổi
      if (currentValue !== String(value)) {
        this._updateCell(cell, value, animate && index === lastMove);
      }
    });
  }

  /**
   * Đăng ký event listener cho sự kiện cell click
   * @param {string} event - Tên sự kiện (ví dụ: 'cell:click')
   * @param {Function} callback - Hàm xử lý sự kiện
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Hủy đăng ký event listener
   * @param {string} event - Tên sự kiện
   * @param {Function} callback - Hàm xử lý sự kiện cần hủy
   */
  off(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Phát sự kiện
   * @param {string} event - Tên sự kiện
   * @param {Object} data - Dữ liệu sự kiện
   */
  _emit(event, data) {
    if (this.eventListeners.has(event)) {
      this.eventListeners.get(event).forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Tạo một ô trong bàn cờ
   * @param {number} index - Index của ô
   * @returns {HTMLElement} Element ô đã tạo
   */
  _createCell(index) {
    const cell = document.createElement("div");
    cell.className = "board-cell";
    cell.setAttribute("role", "gridcell");
    cell.setAttribute("data-index", index);
    cell.setAttribute("data-value", "");
    cell.setAttribute("tabindex", "0");
    cell.setAttribute("aria-label", `Cell ${index + 1}`);

    // Thêm nội dung ô
    const cellContent = document.createElement("div");
    cellContent.className = "cell-content";
    cell.appendChild(cellContent);

    return cell;
  }

  /**
   * Cập nhật trạng thái một ô
   * @param {HTMLElement} cell - Element ô cần cập nhật
   * @param {number|null} value - Giá trị mới (1 = X, 2 = O, null = trống)
   * @param {boolean} animate - Có animation không
   */
  _updateCell(cell, value, animate = false) {
    const cellContent = cell.querySelector(".cell-content");
    const oldValue = cell.getAttribute("data-value");

    // Cập nhật data attribute
    cell.setAttribute("data-value", value || "");

    // Cập nhật nội dung
    if (value === 1) {
      cellContent.textContent = "X";
      cellContent.className = "cell-content cell-x";
      cell.setAttribute("aria-label", "X mark");
    } else if (value === 2) {
      cellContent.textContent = "O";
      cellContent.className = "cell-content cell-o";
      cell.setAttribute("aria-label", "O mark");
    } else {
      cellContent.textContent = "";
      cellContent.className = "cell-content";
      cell.setAttribute("aria-label", "Empty cell");
    }

    // Animation nếu cần
    if (animate && value !== null) {
      this._animateCell(cell);
    }
  }

  /**
   * Animation cho ô khi được điền
   * @param {HTMLElement} cell - Element ô cần animation
   */
  _animateCell(cell) {
    cell.classList.add("cell-pop");

    // Xóa class animation sau khi hoàn thành
    setTimeout(() => {
      cell.classList.remove("cell-pop");
    }, 300);
  }

  /**
   * Gắn event listeners cho bàn cờ
   */
  _attachEventListeners() {
    if (!this.element) return;

    const cells = this.element.querySelectorAll(".board-cell");

    cells.forEach((cell) => {
      // Click event
      cell.addEventListener("click", (e) => this._handleCellInteraction(e, "click"));

      // Touch events
      cell.addEventListener("touchstart", (e) => this._handleTouchStart(e), { passive: true });
      cell.addEventListener("touchend", (e) => this._handleTouchEnd(e), { passive: true });

      // Keyboard events
      cell.addEventListener("keydown", (e) => this._handleKeyDown(e));

      // Hover effects (desktop only)
      cell.addEventListener("mouseenter", () => this._handleMouseEnter(cell));
      cell.addEventListener("mouseleave", () => this._handleMouseLeave(cell));
    });
  }

  /**
   * Xử lý tương tác với ô (click/touch)
   * @param {Event} event - Event object
   * @param {string} type - Loại tương tác
   */
  _handleCellInteraction(event, type) {
    event.preventDefault();

    const cell = event.currentTarget;
    const index = parseInt(cell.getAttribute("data-index"));
    const value = cell.getAttribute("data-value");

    // Chỉ cho phép click vào ô trống
    if (value !== "") {
      return;
    }

    // Phát sự kiện cell:click
    this._emit("cell:click", {
      index,
      type,
      cell,
      timestamp: Date.now(),
    });
  }

  /**
   * Xử lý touch start
   * @param {TouchEvent} event - Touch event
   */
  _handleTouchStart(event) {
    const touch = event.touches[0];
    this.touchStartTime = Date.now();
    this.touchStartPosition = { x: touch.clientX, y: touch.clientY };
  }

  /**
   * Xử lý touch end
   * @param {TouchEvent} event - Touch event
   */
  _handleTouchEnd(event) {
    const touch = event.changedTouches[0];
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - this.touchStartTime;

    // Tính khoảng cách di chuyển
    const deltaX = Math.abs(touch.clientX - this.touchStartPosition.x);
    const deltaY = Math.abs(touch.clientY - this.touchStartPosition.y);
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Chỉ xử lý nếu là tap (không phải swipe)
    if (touchDuration < 300 && distance < 10) {
      const cell = event.target.closest(".board-cell");
      if (cell) {
        this._handleCellInteraction(event, "touch");
      }
    }
  }

  /**
   * Xử lý key down (accessibility)
   * @param {KeyboardEvent} event - Keyboard event
   */
  _handleKeyDown(event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this._handleCellInteraction(event, "keyboard");
    }
  }

  /**
   * Xử lý mouse enter (hover effect)
   * @param {HTMLElement} cell - Element ô
   */
  _handleMouseEnter(cell) {
    if (cell.getAttribute("data-value") === "") {
      cell.classList.add("cell-hover");
    }
  }

  /**
   * Xử lý mouse leave (hover effect)
   * @param {HTMLElement} cell - Element ô
   */
  _handleMouseLeave(cell) {
    cell.classList.remove("cell-hover");
  }

  /**
   * Xóa bàn cờ và cleanup
   */
  destroy() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    this.eventListeners.clear();
  }
}

// Export instance mặc định
export const boardComponent = new BoardComponent();
