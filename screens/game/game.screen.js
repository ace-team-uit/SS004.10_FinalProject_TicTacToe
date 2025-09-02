console.log("🎮 Game screen loaded");

// ===== AI THINKING TIME CONSTANTS =====
if (typeof window["AI_THINKING_TIME"] === "undefined") {
  window["AI_THINKING_TIME"] = {
    // Thời gian suy nghĩ tối thiểu (ms)
    MIN_DELAY: 500,
    // Thời gian suy nghĩ tối đa cho từng độ khó (ms)
    MAX_DELAY: {
      easy: 3000, // 3s - dưới timeout 15s
      medium: 2000, // 2s - dưới timeout 10s
      hard: 1000, // 1s - dưới timeout 5s
    },
  };
}

/**
 * Tính toán thời gian AI suy nghĩ dựa trên độ khó
 * @param {string} difficulty - Độ khó game ('easy', 'medium', 'hard')
 * @returns {number} Thời gian delay ngẫu nhiên (ms)
 */
function calculateAIThinkingTime(difficulty = "easy") {
  const maxDelay =
    window["AI_THINKING_TIME"].MAX_DELAY[difficulty] || window["AI_THINKING_TIME"].MAX_DELAY.easy;
  const minDelay = window["AI_THINKING_TIME"].MIN_DELAY;

  // Random time từ minDelay đến maxDelay
  return Math.random() * (maxDelay - minDelay) + minDelay;
}

// ===== SỬ DỤNG BoardManager =====
if (typeof window["GameData"] === "undefined") {
  // Khởi tạo GameData sử dụng BoardManager
  window["GameData"] = {
    // State của BoardManager
    state: null,
    // Khởi tạo bàn cờ mới
    initBoard(size = 3) {
      this.state = window.BoardManager.initState(size);
      if (size === 3) {
        console.log("✅ Luật thắng: 3 liên tiếp là thắng (không cần block)");
      } else {
        console.log(
          "✅ Luật thắng: 4 liên tiếp không bị chặn hoặc 5 liên tiếp có thể bị chặn là thắng"
        );
      }
      console.log(`✅ Khởi tạo bàn cờ ${size}x${size} (BoardManager)`);
    },
    // Đặt giá trị ô tại index
    setCellByIndex(index, value) {
      if (!this.state || this.state.board[index] !== null) return false;
      this.state.board[index] = value;
      return true;
    },
    // Lấy giá trị ô tại index
    getCellByIndex(index) {
      if (!this.state) return null;
      return this.state.board[index];
    },
    // Chuyển đổi index thành tọa độ (hàng, cột)
    indexToCoordinates(index) {
      const size = this.state?.size || 3;
      const row = Math.floor(index / size);
      const col = index % size;
      return { row, col };
    },
    // Chuyển đổi tọa độ (hàng, cột) thành index
    coordinatesToIndex(row, col) {
      const size = this.state?.size || 3;
      return row * size + col;
    },
    // Lấy bàn cờ dạng mảng phẳng
    getFlatBoard() {
      if (!this.state) return [];
      return this.state.board.map((value, index) => {
        const { row, col } = this.indexToCoordinates(index);
        return { index, row, col, value };
      });
    },
    // Reset bàn cờ
    reset() {
      if (this.state) {
        this.state = window.BoardManager.resetForNewRound(this.state);
      }
    },
    // Truy cập các thuộc tính chính
    get gridSize() {
      return this.state?.size || 3;
    },
    get currentPlayer() {
      return this.state?.currentPlayer || 1;
    },
    set currentPlayer(val) {
      if (this.state) this.state.currentPlayer = val;
    },
    get gameStatus() {
      return this.state?.gameStatus || "playing";
    },
    set gameStatus(val) {
      if (this.state) this.state.gameStatus = val;
    },
    get winner() {
      // Lấy winner từ state nếu có
      if (this.state?.gameStatus === "won") {
        const winnerResult = window.BoardManager.checkWinner(this.state);
        return winnerResult?.winner || null;
      }
      return null;
    },
  };
  console.log("✅ Tạo GameData mới (BoardManager)");
} else {
  console.log("🔄 Sử dụng GameData đã tồn tại");
}

// KHÔNG tạo reference local để tránh lỗi duplicate declaration

// ===== KHỞI TẠO MÀN HÌNH GAME =====
function initGameScreen() {
  // Các phần tử DOM
  const gameBoard = document.getElementById("game-board");
  const musicBtn = document.getElementById("music-btn");
  const backBtn = document.getElementById("back-btn");
  const settingsBtn = document.getElementById("settings-btn");

  console.log("✅ Đã tìm thấy các phần tử cần thiết");

  // Khởi tạo BGM nếu có
  if (window["playBgm"]) {
    console.log("🎵 Bắt đầu BGM game");
    window["playBgm"]("bgm-game");
  }

  // Khởi tạo dữ liệu game
  initializeGameData();

  // Khởi tạo HUD với độ khó
  initializeHUD();

  // Khởi tạo UI bàn cờ
  initializeGameBoard();

  // Căn chỉnh kích thước font cho các ô
  resizeCellTextFontSize();

  // Quan sát thay đổi kích thước bàn cờ
  /* global ResizeObserver */
  if (typeof ResizeObserver !== "undefined" && gameBoard) {
    const resizeObserver = new ResizeObserver(() => {
      resizeCellTextFontSize();
    });
    resizeObserver.observe(gameBoard);
  }

  // ===== XỬ LÝ SỰ KIỆN =====

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
      
      // Phát âm thanh click
      if (window["playSound"]) {
        window["playSound"]("click");
      }
      
      // Hiển thị popup xác nhận thoát
      if (window["PopupManager"]) {
        window["PopupManager"].showExitPopup();
      } else {
        // Fallback về điều hướng trực tiếp nếu popup system chưa sẵn sàng
        navigateToGameMode2();
      }
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

  // ===== KHỞI TẠO GAME =====

  function initializeGameData() {
    // Lấy cài đặt từ storage hoặc dùng mặc định
    const settings = window["AppStorage"]?.loadSettings() || window["AppStorage"]?.DEFAULTS;
    if (!settings) {
      console.error("❌ Không thể lấy cài đặt từ storage");
      return;
    }

    // Phân tích kích thước lưới từ cài đặt
    let gridSize = 3; // Giá trị mặc định dự phòng
    try {
      if (settings.gameGridSize) {
        // Xử lý cả trường hợp "5" và "5x5"
        const sizeStr = settings.gameGridSize.toString();
        const parsed = parseInt(sizeStr.includes("x") ? sizeStr.split("x")[0] : sizeStr);
        console.log("🔄 Đã phân tích kích thước lưới:", parsed, "từ", sizeStr);

        if (!isNaN(parsed) && parsed >= 3 && parsed <= 5) {
          gridSize = parsed;
          // Đảm bảo định dạng nhất quán trong storage
          const formattedSize = `${gridSize}x${gridSize}`;
          if (settings.gameGridSize !== formattedSize) {
            window["AppStorage"]?.saveSettings({ gameGridSize: formattedSize });
            console.log("🔄 Đã chuẩn hóa định dạng kích thước lưới trong storage:", formattedSize);
          }
          console.log(`✅ Sử dụng kích thước lưới: ${gridSize}x${gridSize}`);
        } else {
          console.warn("⚠️ Kích thước lưới không hợp lệ:", parsed, "sử dụng mặc định:", gridSize);
          window["AppStorage"]?.saveSettings({ gameGridSize: `${gridSize}x${gridSize}` });
        }
      } else {
        console.warn("⚠️ Không tìm thấy cài đặt kích thước lưới, sử dụng mặc định:", gridSize);
        window["AppStorage"]?.saveSettings({ gameGridSize: `${gridSize}x${gridSize}` });
      }
    } catch (error) {
      console.error("❌ Lỗi phân tích kích thước lưới:", error);
      window["AppStorage"]?.saveSettings({ gameGridSize: `${gridSize}x${gridSize}` });
    }

    console.log("⚙️ Cài đặt game:", {
      gridSize: `${gridSize}x${gridSize}`,
      difficulty: settings.difficulty,
      theme: settings.theme,
      language: settings.language,
    });

    // Khởi tạo hoặc cập nhật bàn cờ
    const needsReset =
      !window["GameData"] ||
      !window["GameData"].board ||
      window["GameData"].board.length === 0 ||
      window["GameData"].gridSize !== gridSize;

    if (needsReset) {
      console.log(`🔄 Khởi tạo bàn cờ mới ${gridSize}x${gridSize}`);
      window["GameData"].initBoard(gridSize);
    } else {
      console.log(`✅ Sử dụng bàn cờ hiện tại ${gridSize}x${gridSize}`);
    }

    // Áp dụng cài đặt game
    document.documentElement.setAttribute("data-theme", settings.gameTheme);
    document.documentElement.setAttribute("lang", settings.gameLanguage);

    // Áp dụng màu gradient cho dấu người chơi
    const selectedBoard = window["AppStorage"]?.get("selectedBoard");
    if (selectedBoard?.colors) {
      const markTexts = document.querySelectorAll(".mark-text");
      markTexts.forEach((text) => {
        const isX = text.textContent === "X";
        const gradient = isX ? selectedBoard.colors.x : selectedBoard.colors.o;
        const markTextElement = /** @type {HTMLElement} */ (text);
        markTextElement.style.background = gradient;
        markTextElement.style.webkitBackgroundClip = "text";
        markTextElement.style.webkitTextFillColor = "transparent";
        markTextElement.style.backgroundClip = "text";
        markTextElement.style.filter = "brightness(1.2)";
      });
    }

    // Cập nhật trạng thái nút âm nhạc
    updateMusicButton(settings.gameMusicEnabled);

    console.log("✅ Dữ liệu game đã được khởi tạo thành công");
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

    // Thêm trình xử lý sự kiện cho các ô
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

      // Gắn ResizeObserver để căn chỉnh kích thước font
      observeCellTextResize(cell);

      gameBoard.appendChild(cell);
    }

    console.log(`✅ Tạo ${totalCells} ô cho bàn cờ ${gridSize}x${gridSize}`);
  }

  // Thay đổi kích thước font của text trong ô
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

  // Căn chỉnh kích thước font cho tất cả các ô
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

  // Thêm trình xử lý sự kiện click cho các ô
  function addCellClickHandlers() {
    if (!gameBoard) return;

    const cells = gameBoard.querySelectorAll(".board-cell");

    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        const indexAttr = cell.getAttribute("data-index");
        if (!indexAttr) return;

        const index = parseInt(indexAttr);
        const value = window["GameData"].getCellByIndex(index);

        if (value !== null) {
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
    // Sau khi người chơi đi, disable toàn bộ bàn cờ
    const gameBoardEl = document.getElementById("game-board");
    if (gameBoardEl) {
      const allCells = gameBoardEl.querySelectorAll(".board-cell");
      allCells.forEach(disableCell);
    }

    // Phát âm thanh click nếu có
    if (window["playSound"]) {
      window["playSound"]("click");
    }

    // Sử dụng BoardManager để xử lý nước đi
    const gameData = window["GameData"];
    if (!gameData.state) return;

    // Chỉ cho phép đánh khi game đang chơi
    if (gameData.state.gameStatus !== "playing") {
      console.log("🚫 Game đã kết thúc");
      return;
    }

    // Sử dụng BoardManager.makeMove
    const newState = window.BoardManager.makeMove(gameData.state, index);
    if (newState !== gameData.state) {
      gameData.state = newState;

      // Cập nhật hiển thị ô
      const playerMark = newState.board[index] === 1 ? "X" : "O";
      cell.setAttribute("data-value", playerMark);

      let cellText = cell.querySelector(".cell-text");
      if (!cellText) {
        cellText = document.createElement("div");
        cellText.className = "cell-text";
        cell.appendChild(cellText);
      }

      // Áp dụng màu gradient từ bàn cờ được chọn
      const selectedBoard = window["AppStorage"]?.get("selectedBoard");
      if (selectedBoard?.colors) {
        const gradient = playerMark === "X" ? selectedBoard.colors.x : selectedBoard.colors.o;
        const cellTextElement = /** @type {HTMLElement} */ (cellText);
        cellTextElement.style.background = gradient;
        cellTextElement.style.webkitBackgroundClip = "text";
        cellTextElement.style.backgroundClip = "text";
        cellTextElement.style.webkitTextFillColor = "transparent";
      }

      cellText.textContent = playerMark;

      console.log(`✅ Ô ${index} được đánh dấu với ${playerMark}`);

      // Đặt lại timer cho lượt mới
      if (window["GameHUD"]) {
        window["GameHUD"].resetTimer();
      }

      // Cập nhật hiển thị bàn cờ
      updateBoardDisplay();

      // Hiển thị popup khi có người thắng hoặc hòa
      if (gameData.state.gameStatus === "won") {
        const winner = gameData.state.currentPlayer === 1 ? 1 : 2;
        setTimeout(() => {
          if (window["PopupManager"]) {
            if (winner === 1) {
              // Người chơi thắng
              window["PopupManager"].showWinPopup();
              // Phát âm thanh thắng
              if (window["playSound"]) {
                window["playSound"]("win");
              }
            } else {
              // AI thắng
              window["PopupManager"].showLosePopup();
              // Phát âm thanh thua
              if (window["playSound"]) {
                window["playSound"]("lose");
              }
            }
          } else {
            // Fallback về alert nếu popup system chưa sẵn sàng
            const winnerText = winner === 1 ? "Người chơi X" : "Người chơi O (AI)";
            alert(winnerText + " thắng!");
          }
        }, 100);
      } else if (gameData.state.gameStatus === "draw") {
        setTimeout(() => {
          if (window["PopupManager"]) {
            window["PopupManager"].showDrawPopup();
            // Phát âm thanh hòa
            if (window["playSound"]) {
              window["playSound"]("draw");
            }
          } else {
            // Fallback về alert nếu popup system chưa sẵn sàng
            alert("Hòa!");
          }
        }, 100);
      }

      // Nếu đến lượt AI (O), gọi AI tự động đánh
      if (
        window["GameData"].state.currentPlayer === 2 &&
        window["GameData"].state.gameStatus === "playing"
      ) {
        // Lấy độ khó từ settings để tính thời gian AI suy nghĩ
        const settings = window["AppStorage"]?.loadSettings() || window["AppStorage"]?.DEFAULTS;
        const difficulty = settings?.gameDifficulty || "easy";
        const thinkingTime = calculateAIThinkingTime(difficulty);

        console.log(`🤖 AI suy nghĩ ${thinkingTime.toFixed(0)}ms (độ khó: ${difficulty})`);

        setTimeout(() => {
          autoAIMove();
        }, thinkingTime);
      } else {
        // Nếu không phải lượt AI, enable lại các ô chưa đánh cho người chơi
        if (gameBoardEl) {
          const allCells = gameBoardEl.querySelectorAll(".board-cell");
          const flatBoard = window["GameData"].getFlatBoard();
          allCells.forEach((cell, idx) => {
            if (flatBoard[idx] && flatBoard[idx].value === null) {
              enableCell(cell);
            }
          });
        }
      }
    } else {
      console.log(`❌ Không thể đánh dấu ô ${index}`);
    }
  }

  // Hàm cho AI tự động đánh nếu đến lượt O
  function autoAIMove() {
    const gameData = window["GameData"];
    if (!gameData.state) return;
    if (gameData.state.gameStatus !== "playing") return;
    if (gameData.state.currentPlayer !== 2) return; // O là AI

    // Lấy độ khó
    let difficulty = "easy";
    if (window["gameState"] && window["gameState"].difficulty) {
      difficulty = window["gameState"].difficulty;
    } else {
      difficulty = localStorage.getItem("gameDifficulty") || "easy";
    }

    // Tìm nước đi cho AI dựa trên độ khó
    const aiMove = window.TTT_AI.getAIMove(gameData.state, difficulty);
    if (aiMove === -1) return;

    // Tìm ô tương ứng và gọi handleCellClick cho ô đó
    const gameBoard = document.getElementById("game-board");
    if (!gameBoard) return;
    const cell = gameBoard.querySelector(`.board-cell[data-index='${aiMove}']`);
    if (cell) {
      handleCellClick(cell, aiMove);
    }
  }

  // Khởi tạo
  initializeMusicState();
  console.log("🎮 Màn hình game đã được khởi tạo");
}

// Cập nhật trạng thái nút âm nhạc
function updateMusicButton(enabled) {
  const musicBtn = document.getElementById("music-btn");
  if (!musicBtn) return;
  if (enabled) {
    musicBtn.style.opacity = "1";
    musicBtn.style.filter = "none";
  } else {
    musicBtn.style.opacity = "0.5";
    musicBtn.style.filter = "grayscale(100%)";
  }
}

// Cập nhật hiển thị bàn cờ
function updateBoardDisplay() {
  // Lấy lại phần tử gameBoard trong hàm để tránh lỗi scope
  const gameBoard = document.getElementById("game-board");
  if (!gameBoard) return;

  const cells = gameBoard.querySelectorAll(".board-cell");
  const flatBoard = window["GameData"].getFlatBoard();

  cells.forEach((cell, index) => {
    const cellData = flatBoard[index];
    if (cellData) {
      const currentValue = cell.getAttribute("data-value");
      const newValue = cellData.value;

      const playerMark = newValue === 1 ? "X" : newValue === 2 ? "O" : "";

      if (currentValue !== playerMark) {
        cell.setAttribute("data-value", playerMark);

        let cellText = cell.querySelector(".cell-text");
        if (!cellText) {
          cellText = document.createElement("div");
          cellText.className = "cell-text";
          cell.appendChild(cellText);
        }

        cellText.textContent = playerMark;

        // Áp dụng màu gradient từ bàn cờ được chọn
        const selectedBoard = window["AppStorage"]?.get("selectedBoard");
        if (selectedBoard?.colors && playerMark) {
          const gradient = playerMark === "X" ? selectedBoard.colors.x : selectedBoard.colors.o;
          const cellTextElement = /** @type {HTMLElement} */ (cellText);
          cellTextElement.style.background = gradient;
          cellTextElement.style.webkitBackgroundClip = "text";
          cellTextElement.style.webkitTextFillColor = "transparent";
          cellTextElement.style.backgroundClip = "text";
        }
      }
    }
  });
}

// ===== CÁC HÀM TIỆN ÍCH =====

// Vô hiệu hóa ô (không cho click nữa)
function disableCell(cell) {
  if (!cell) return;
  cell.style.cursor = "not-allowed";
  cell.style.pointerEvents = "none";
  cell.style.opacity = "0.8";
  cell.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
}

// Kích hoạt ô (cho phép click)
function enableCell(cell) {
  if (!cell) return;
  cell.style.cursor = "pointer";
  cell.style.pointerEvents = "auto";
  cell.style.opacity = "1";
  cell.style.backgroundColor = "";
}

// Toggle music
function toggleMusic() {
  console.log("🎵 Toggling music");
  const settings = window["AppStorage"]?.loadSettings();
  if (!settings) return;

  const newState = !settings.gameMusicEnabled;
  window["AppStorage"]?.saveSettings({ gameMusicEnabled: newState });
  updateMusicButton(newState);

  if (window["playSound"]) {
    window["playSound"]("click");
  }

  window["audioManager"].toggleMute(!newState);
  console.log(`🎵 Music ${newState ? "enabled" : "disabled"}`);
}

// Khởi tạo trạng thái âm nhạc
function initializeMusicState() {
  const settings = window["AppStorage"]?.loadSettings();
  if (settings) {
    updateMusicButton(settings.gameMusicEnabled);
    window["audioManager"].toggleMute(!settings.gameMusicEnabled);
  }
}

// Các hàm điều hướng
function navigateToGameMode2() {
  if (window["Navigation"]) {
    window["Navigation"].navigateTo("mode2");
  } else {
    console.warn("Điều hướng không khả dụng, chuyển hướng thủ công");
    window.location.href = "#mode2";
  }
}

function navigateToSettings() {
  if (window["Navigation"]) {
    window["Navigation"].navigateTo("settings");
  } else {
    console.warn("Điều hướng không khả dụng, chuyển hướng thủ công");
    window.location.href = "#settings";
  }
}

// ===== TÍCH HỢP HUD =====
function initializeHUD() {
  // Lấy độ khó từ gameState hoặc localStorage
  let difficulty = "easy";

  if (window["gameState"] && window["gameState"].difficulty) {
    difficulty = window["gameState"].difficulty;
  } else {
    difficulty = localStorage.getItem("gameDifficulty") || "easy";
  }

  console.log("🎮 Bắt đầu khởi tạo HUD với độ khó:", difficulty);

  // Khởi tạo GameHUD nếu có sẵn
  if (window["GameHUD"]) {
    console.log("✅ Đã tìm thấy GameHUD, đang khởi tạo game...");
    window["GameHUD"].init();
    window["GameHUD"].initializeGame(difficulty);
  } else {
    console.error("❌ Không tìm thấy GameHUD! Hãy đảm bảo header.js được tải.");
  }
}

// Khởi tạo khi DOM sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGameScreen);
} else {
  initGameScreen();
}
