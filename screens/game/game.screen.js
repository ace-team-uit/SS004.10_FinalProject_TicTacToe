console.log("🎮 Game screen loaded");

// ===== GAME DATA STRUCTURE =====
// Cấu trúc dữ liệu đơn giản để các bạn khác dễ dàng nhúng logic vào
// Kiểm tra xem GameData đã tồn tại chưa, nếu chưa thì tạo mới
if (typeof window["GameData"] === "undefined") {
  window["GameData"] = {
    // Kích thước bàn cờ (3x3, 4x4, 5x5)
    gridSize: 3,

    // Mảng 2D lưu trạng thái bàn cờ
    // null = ô trống, 1 = X (player1), 2 = O (player2)
    /** @type {Array<Array<number|null>>} */
    board: [],

    // Người chơi hiện tại
    currentPlayer: 1, // 1 = X, 2 = O

    // Trạng thái game
    gameStatus: "playing", // "playing", "won", "draw"

    // Người thắng
    winner: null,

    // Khởi tạo bàn cờ mới
    initBoard(size = 3) {
      this.gridSize = size;
      /** @type {Array<Array<number|null>>} */
      this.board = [];

      // Tạo mảng 2D rỗng
      for (let i = 0; i < size; i++) {
        this.board[i] = [];
        for (let j = 0; j < size; j++) {
          this.board[i][j] = null;
        }
      }

      this.currentPlayer = 1;
      this.gameStatus = "playing";
      this.winner = null;

      console.log(`✅ Khởi tạo bàn cờ ${size}x${size}`);
    },

    // Lấy giá trị ô tại vị trí (row, col)
    getCell(row, col) {
      if (this.isValidPosition(row, col)) {
        return this.board[row][col];
      }
      return null;
    },

    // Đặt giá trị ô tại vị trí (row, col)
    setCell(row, col, value) {
      if (this.isValidPosition(row, col) && this.board[row][col] === null) {
        this.board[row][col] = value;
        return true;
      }
      return false;
    },

    // Kiểm tra vị trí hợp lệ
    isValidPosition(row, col) {
      return row >= 0 && row < this.gridSize && col >= 0 && col < this.gridSize;
    },

    // Kiểm tra ô trống
    isCellEmpty(row, col) {
      return this.getCell(row, col) === null;
    },

    // Chuyển đổi index thành tọa độ (row, col)
    indexToCoordinates(index) {
      const row = Math.floor(index / this.gridSize);
      const col = index % this.gridSize;
      return { row, col };
    },

    // Chuyển đổi tọa độ (row, col) thành index
    coordinatesToIndex(row, col) {
      return row * this.gridSize + col;
    },

    // Lấy bàn cờ dạng mảng phẳng (để dễ xử lý)
    getFlatBoard() {
      const flatBoard = [];
      for (let i = 0; i < this.gridSize; i++) {
        for (let j = 0; j < this.gridSize; j++) {
          flatBoard.push({
            index: this.coordinatesToIndex(i, j),
            row: i,
            col: j,
            value: this.board[i][j],
          });
        }
      }
      return flatBoard;
    },

    // Reset bàn cờ
    reset() {
      this.initBoard(this.gridSize);
    },
  };
  console.log("✅ Tạo GameData mới");
} else {
  console.log("🔄 Sử dụng GameData đã tồn tại");
}

// KHÔNG tạo reference local để tránh lỗi duplicate declaration

// ===== GAME SCREEN INITIALIZATION =====
function initGameScreen() {
  // DOM elements
  const gameBoard = document.getElementById("game-board");
  const musicBtn = document.getElementById("music-btn");
  const backBtn = document.getElementById("back-btn");
  const settingsBtn = document.getElementById("settings-btn");

  console.log("✅ Found required elements");

  // Khởi tạo BGM nếu có
  if (window["playBgm"]) {
    console.log("🎵 Starting game BGM");
    window["playBgm"]("bgm-game");
  }

  // Khởi tạo dữ liệu game
  initializeGameData();

  // Initialize HUD with difficulty
  initializeHUD();

  // Khởi tạo bàn cờ UI
  initializeGameBoard();

  // Căn chỉnh font size cho các ô
  resizeCellTextFontSize();

  // Quan sát thay đổi kích thước bàn cờ
  /* global ResizeObserver */
  if (typeof ResizeObserver !== "undefined" && gameBoard) {
    const resizeObserver = new ResizeObserver(() => {
      resizeCellTextFontSize();
    });
    resizeObserver.observe(gameBoard);
  }

  // ===== EVENT HANDLERS =====

  // Music button
  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      console.log("🎵 Music button clicked");
      toggleMusic();
    });
  }

  // Back button
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      console.log("🔄 Back button clicked");
      navigateToGameMode2();
    });
  }

  // Settings button
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      console.log("⚙️ Settings button clicked");
      if (window["playSound"]) {
        window["playSound"]("click");
      }
      navigateToSettings();
    });
  }

  // ===== GAME INITIALIZATION =====

  function initializeGameData() {
    // Lấy kích thước bàn cờ từ localStorage hoặc game state
    let gridSize = 3; // Mặc định 3x3

    if (window["gameState"] && window["gameState"].gridSize) {
      gridSize = parseInt(window["gameState"].gridSize.split("x")[0]);
    } else {
      const storedSize = localStorage.getItem("gameGridSize");
      if (storedSize) {
        gridSize = parseInt(storedSize.split("x")[0]);
      }
    }

    console.log(`🎯 Khởi tạo game với kích thước: ${gridSize}x${gridSize}`);

    // Kiểm tra xem có cần khởi tạo lại bàn cờ không
    if (window["GameData"].gridSize !== gridSize) {
      console.log(
        `🔄 Kích thước bàn cờ thay đổi từ ${window["GameData"].gridSize}x${window["GameData"].gridSize} sang ${gridSize}x${gridSize}`
      );
      window["GameData"].initBoard(gridSize);
    } else if (window["GameData"].board.length === 0) {
      // Nếu bàn cờ chưa được khởi tạo
      window["GameData"].initBoard(gridSize);
    } else {
      console.log(`✅ Bàn cờ ${gridSize}x${gridSize} đã được khởi tạo`);
    }

    console.log("✅ Game data initialized successfully");
  }

  function initializeGameBoard() {
    if (!gameBoard) return;

    const gridSize = window["GameData"].gridSize;
    const gridSizeClass = `${gridSize}x${gridSize}`;

    console.log(`🎯 Khởi tạo UI bàn cờ với kích thước: ${gridSizeClass}`);

    // Cập nhật class của bàn cờ
    gameBoard.className = `game-board board-${gridSizeClass}`;

    // Tạo các ô trong bàn cờ
    generateBoardCells(gridSize);

    // Thêm event handlers cho các ô
    addCellClickHandlers();

    // Cập nhật hiển thị bàn cờ
    updateBoardDisplay();
  }

  // Tạo các ô trong bàn cờ
  function generateBoardCells(gridSize) {
    if (!gameBoard) return;

    gameBoard.innerHTML = "";
    const totalCells = gridSize * gridSize;

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");
      cell.className = "board-cell";
      cell.setAttribute("data-index", i.toString());
      cell.setAttribute("data-value", "");

      const cellText = document.createElement("div");
      cellText.className = "cell-text";

      cell.appendChild(cellText);

      // Gắn ResizeObserver để căn chỉnh font size
      observeCellTextResize(cell);

      gameBoard.appendChild(cell);
    }

    console.log(`✅ Tạo ${totalCells} ô cho bàn cờ ${gridSize}x${gridSize}`);
  }

  // Resize cell text font size
  /* global ResizeObserver */
  function observeCellTextResize(cell) {
    const text = cell.querySelector(".cell-text");
    if (!text) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        const fontSize = width * 0.75; // tùy chỉnh tỷ lệ
        text.style.fontSize = `${fontSize}px`;
      }
    });

    resizeObserver.observe(cell);
  }

  // Căn chỉnh font size cho tất cả các ô
  function resizeCellTextFontSize() {
    const cells = document.querySelectorAll(".board-cell");
    cells.forEach((cell) => {
      const cellText = cell.querySelector(".cell-text");
      if (cellText) {
        const cellSize = /** @type {HTMLElement} */ (cell).offsetWidth;
        const fontSize = Math.floor(cellSize * 0.6); // 60% của kích thước ô
        /** @type {HTMLElement} */ (cellText).style.fontSize = `${fontSize}px`;
      }
    });
  }

  // Thêm event handlers cho các ô
  function addCellClickHandlers() {
    if (!gameBoard) return;

    const cells = gameBoard.querySelectorAll(".board-cell");

    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        const indexAttr = cell.getAttribute("data-index");
        if (!indexAttr) return;

        const index = parseInt(indexAttr);
        const value = cell.getAttribute("data-value");

        if (value) {
          console.log(`🚫 Ô ${index} đã có giá trị: ${value}`);
          return;
        }

        console.log(`🎯 Ô ${index} được click`);
        handleCellClick(cell, index);
      });
    });
  }

  // Xử lý khi click vào ô
  function handleCellClick(cell, index) {
    // Phát âm thanh click nếu có
    if (window["playSound"]) {
      window["playSound"]("click");
    }

    // Chuyển đổi index thành tọa độ (row, col)
    const { row, col } = window["GameData"].indexToCoordinates(index);

    // Đặt giá trị vào dữ liệu game
    const success = window["GameData"].setCell(row, col, window["GameData"].currentPlayer);

    if (success) {
      // Cập nhật hiển thị ô
      const playerMark = window["GameData"].currentPlayer === 1 ? "X" : "O";
      cell.setAttribute("data-value", playerMark);

      let cellText = cell.querySelector(".cell-text");
      if (!cellText) {
        cellText = document.createElement("div");
        cellText.className = "cell-text";
        cell.appendChild(cellText);
      }

      cellText.textContent = playerMark;

      // Vô hiệu hóa ô sau khi đánh dấu
      disableCell(cell);

      console.log(`✅ Ô ${index} được đánh dấu với ${playerMark}`);

      // TODO: Các bạn khác sẽ thêm logic kiểm tra thắng/thua ở đây
      // TODO: Các bạn khác sẽ thêm logic AI ở đây

      // Reset timer cho lượt mới
      if (window["GameHUD"]) {
        window["GameHUD"].resetTimer();
      }

      // Chuyển lượt chơi
      window["GameData"].currentPlayer = window["GameData"].currentPlayer === 1 ? 2 : 1;
      console.log(`🔄 Chuyển lượt cho người chơi: ${window["GameData"].currentPlayer}`);

      // Cập nhật hiển thị bàn cờ
      updateBoardDisplay();
    } else {
      console.log(`❌ Không thể đánh dấu ô ${index}`);
    }
  }

  // Cập nhật hiển thị bàn cờ
  function updateBoardDisplay() {
    if (!gameBoard) return;

    const cells = gameBoard.querySelectorAll(".board-cell");
    const flatBoard = window["GameData"].getFlatBoard();

    cells.forEach((cell, index) => {
      const cellData = flatBoard[index];
      if (cellData) {
        const currentValue = cell.getAttribute("data-value");
        const newValue = cellData.value;

        if (currentValue !== String(newValue || "")) {
          cell.setAttribute("data-value", String(newValue || ""));

          let cellText = cell.querySelector(".cell-text");
          if (!cellText) {
            cellText = document.createElement("div");
            cellText.className = "cell-text";
            cell.appendChild(cellText);
          }

          cellText.textContent = newValue === 1 ? "X" : newValue === 2 ? "O" : "";

          // Cập nhật trạng thái ô
          if (newValue !== null) {
            disableCell(cell);
          } else {
            enableCell(cell);
          }
        }
      }
    });
  }

  // ===== UTILITY FUNCTIONS =====

  // Vô hiệu hóa ô (không cho click nữa)
  function disableCell(cell) {
    if (!cell) return;
    cell.style.cursor = "not-allowed";
    cell.style.pointerEvents = "none";
    cell.style.opacity = "0.8";
    cell.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
    console.log("🔒 Ô đã bị vô hiệu hóa");
  }

  // Kích hoạt ô (cho phép click)
  function enableCell(cell) {
    if (!cell) return;
    cell.style.cursor = "pointer";
    cell.style.pointerEvents = "auto";
    cell.style.opacity = "1";
    cell.style.backgroundColor = "";
    console.log("🔓 Ô đã được kích hoạt");
  }

  // Toggle music
  function toggleMusic() {
    console.log("🎵 Toggling music");
    const musicEnabled = localStorage.getItem("musicEnabled") !== "false";
    const newState = !musicEnabled;
    localStorage.setItem("musicEnabled", newState.toString());
    updateMusicButton(newState);

    if (window["playSound"]) {
      window["playSound"]("click");
    }
    console.log(`🎵 Music ${newState ? "enabled" : "disabled"}`);
  }

  // Cập nhật trạng thái nút music
  function updateMusicButton(enabled) {
    if (!musicBtn) return;
    if (enabled) {
      musicBtn.style.opacity = "1";
      musicBtn.style.filter = "none";
    } else {
      musicBtn.style.opacity = "0.5";
      musicBtn.style.filter = "grayscale(100%)";
    }
  }

  // Navigation functions
  function navigateToGameMode2() {
    if (window["Navigation"]) {
      window["Navigation"].navigateTo("mode2");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#mode2";
    }
  }

  function navigateToSettings() {
    if (window["Navigation"]) {
      window["Navigation"].navigateTo("settings");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#settings";
    }
  }

  // Khởi tạo trạng thái music
  function initializeMusicState() {
    const musicEnabled = localStorage.getItem("musicEnabled") !== "false";
    updateMusicButton(musicEnabled);
  }

  // Khởi tạo
  initializeMusicState();
  console.log("🎮 Game screen initialized");
}

// ===== HUD INTEGRATION =====
function initializeHUD() {
  // Get difficulty from gameState or localStorage
  let difficulty = "easy";

  if (window["gameState"] && window["gameState"].difficulty) {
    difficulty = window["gameState"].difficulty;
  } else {
    difficulty = localStorage.getItem("gameDifficulty") || "easy";
  }

  console.log("🎮 Starting HUD initialization with difficulty:", difficulty);

  // Initialize GameHUD if available
  if (window["GameHUD"]) {
    console.log("✅ GameHUD found, initializing game...");
    window["GameHUD"].init();
    window["GameHUD"].initializeGame(difficulty);
  } else {
    console.error("❌ GameHUD not found! Make sure header.js is loaded.");
  }
}

// Khởi tạo khi DOM ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGameScreen);
} else {
  initGameScreen();
}
