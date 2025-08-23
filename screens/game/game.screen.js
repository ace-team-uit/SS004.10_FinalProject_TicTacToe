console.log("🎮 Game screen loaded");

// Game screen initialization function
function initGameScreen() {
  // DOM elements
  const gameBoard = document.getElementById("game-board");
  const musicBtn = document.getElementById("music-btn");
  const backBtn = document.getElementById("back-btn");
  const settingsBtn = document.getElementById("settings-btn");

  console.log("✅ Found required elements");

  // Ensure Game screen has appropriate BGM
  if (window["playBgm"]) {
    console.log("🎵 Starting game BGM");
    window["playBgm"]("bgm-game");
  }

  // Initialize game board based on selected grid size
  initializeGameBoard();

  // Function to resize cell text font size based on cell size
  function resizeCellTextFontSize() {
    const cells = document.querySelectorAll(".board-cell");
    cells.forEach((cell) => {
      const cellText = cell.querySelector(".cell-text");
      if (cellText) {
        const cellSize = cell.offsetWidth;
        const fontSize = Math.floor(cellSize * 0.6); // 60% of cell size
        cellText.style.fontSize = `${fontSize}px`;
      }
    });
  }

  // Observe board size changes
  /* global ResizeObserver */
  if (typeof ResizeObserver !== "undefined") {
    const resizeObserver = new ResizeObserver(() => {
      resizeCellTextFontSize();
    });
    if (gameBoard) {
      resizeObserver.observe(gameBoard);
    }
  }

  // Music button click handler
  if (musicBtn) {
    musicBtn.addEventListener("click", () => {
      console.log("🎵 Music button clicked");
      toggleMusic();
    });
  }

  // Reset button click handler
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      console.log("🔄 Back button clicked");
      navigateToGameMode2();
    });
  }

  // Settings button click handler
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      console.log("⚙️ Settings button clicked");

      // Play click sound if available
      if (window["playSound"]) {
        window["playSound"]("click");
      }

      // Navigate to Settings page
      navigateToSettings();
    });
  }

  // Initialize game board
  function initializeGameBoard() {
    if (!gameBoard) return;

    // Get grid size from game state or localStorage
    let gridSize = "3x3"; // Default
    if (window["gameState"] && window["gameState"].gridSize) {
      gridSize = window["gameState"].gridSize;
    } else {
      gridSize = localStorage.getItem("gameGridSize") || "3x3";
    }

    console.log(`🎯 Initializing game board with size: ${gridSize}`);

    // Update board class
    gameBoard.className = `game-board board-${gridSize}`;

    // Generate board cells
    generateBoardCells(gridSize);

    // Add click handlers to cells
    addCellClickHandlers();
  }

  // Resize cell text font size
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

  // Generate board cells based on grid size
  function generateBoardCells(gridSize) {
    if (!gameBoard) return;

    gameBoard.innerHTML = "";

    const size = parseInt(gridSize.split("x")[0]);
    const totalCells = size * size;

    for (let i = 0; i < totalCells; i++) {
      const cell = document.createElement("div");
      cell.className = "board-cell";
      cell.setAttribute("data-index", i);
      cell.setAttribute("data-value", "");

      const cellText = document.createElement("div");
      cellText.className = "cell-text";

      // Thêm mark mẫu (chỉ để test, có thể xóa sau)
      if (i === 1 || i === 3) {
        cell.setAttribute("data-value", "X");
        cellText.textContent = "X";
        disableCell(cell);
      } else if (i === 4) {
        cell.setAttribute("data-value", "O");
        cellText.textContent = "O";
        disableCell(cell);
      }

      cell.appendChild(cellText);
      observeCellTextResize(cell); // Gắn ResizeObserver 1 lần duy nhất
      gameBoard.appendChild(cell);
    }

    console.log(`✅ Generated ${totalCells} cells for ${gridSize} board`);
  }

  // Add click handlers to board cells
  function addCellClickHandlers() {
    const cells = gameBoard.querySelectorAll(".board-cell");

    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        const index = cell.getAttribute("data-index");
        const value = cell.getAttribute("data-value");

        if (value) {
          console.log(`🚫 Cell ${index} already has value: ${value}`);
          return;
        }

        console.log(`🎯 Cell ${index} clicked`);
        handleCellClick(cell, index);
      });
    });
  }

  // Handle cell click
  function handleCellClick(cell, index) {
    if (window["playSound"]) {
      window["playSound"]("click");
    }

    const currentPlayer = getCurrentPlayer();
    const mark = currentPlayer === "player1" ? "O" : "X";

    cell.setAttribute("data-value", mark);

    let cellText = cell.querySelector(".cell-text");
    if (!cellText) {
      cellText = document.createElement("div");
      cellText.className = "cell-text";
      cell.appendChild(cellText);
      observeCellTextResize(cell); // Gắn observer nếu cell-text mới
    }

    cellText.textContent = mark;

    // Disable the cell after marking
    disableCell(cell);

    console.log(`✅ Cell ${index} marked with ${mark}`);
    updateGameState();
  }

  // Get current player (mock function for UI testing)
  function getCurrentPlayer() {
    // This would normally come from game logic
    return Math.random() > 0.5 ? "player1" : "player2";
  }

  // Update game state (mock function for UI testing)
  function updateGameState() {
    // TODO: This would normally update game state
    console.log("🔄 Game state updated");
  }

  // Toggle music
  function toggleMusic() {
    console.log("🎵 Toggling music");

    // Get current music state from localStorage
    const musicEnabled = localStorage.getItem("musicEnabled") !== "false";
    const newState = !musicEnabled;

    // Update localStorage
    localStorage.setItem("musicEnabled", newState.toString());

    // Update UI
    updateMusicButton(newState);

    // Play click sound if available
    if (window["playSound"]) {
      window["playSound"]("click");
    }

    console.log(`🎵 Music ${newState ? "enabled" : "disabled"}`);
  }

  // Update music button appearance
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

  // Disable cell (remove cursor pointer and make it non-interactive)
  function disableCell(cell) {
    if (!cell) return;

    cell.style.cursor = "not-allowed";
    cell.style.pointerEvents = "none";
    cell.style.opacity = "0.8";

    // Add visual feedback that cell is disabled
    cell.style.backgroundColor = "rgba(0, 0, 0, 0.1)";

    console.log("🔒 Cell disabled");
  }

  function navigateToGameMode2() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("mode2");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#mode2";
    }
  }

  // Reset game
  // function resetGame() {
  //   console.log("🔄 Resetting game");

  //   // Play click sound if available
  //   if (window["playSound"]) {
  //     window["playSound"]("click");
  //   }

  //   // Reinitialize board
  //   initializeGameBoard();

  //   // Reset score (mock)
  //   const scoreDisplay = document.querySelector(".score-display");
  //   if (scoreDisplay) {
  //     scoreDisplay.textContent = "0:0";
  //   }

  //   console.log("✅ Game reset complete");
  // }

  // Navigation functions
  function navigateToSettings() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("settings");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#settings";
    }
  }

  // Initialize music button state
  function initializeMusicState() {
    const musicEnabled = localStorage.getItem("musicEnabled") !== "false";
    updateMusicButton(musicEnabled);
  }

  // Initialize music state on load
  initializeMusicState();

  // Resize cell text font size
  resizeCellTextFontSize();

  console.log("🎮 Game screen initialized");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGameScreen);
} else {
  initGameScreen();
}
