console.log("🎮 Game Mode 2 (Grid Size Selection) screen loaded");

// Game Mode 2 screen initialization function
function initGameMode2Screen() {
  // DOM elements
  const grid3x3Btn = document.getElementById("grid-3x3-btn");
  const grid4x4Btn = document.getElementById("grid-4x4-btn");
  const grid5x5Btn = document.getElementById("grid-5x5-btn");
  const backBtn = document.getElementById("back-btn");

  console.log("✅ Found required elements");

  // Ensure Mode 2 screen has appropriate BGM
  if (window["playBgm"]) {
    console.log("🎵 Starting grid size selection BGM");
    window["playBgm"]("bgm-select");
  }

  // 3x3 Grid button click handler
  if (grid3x3Btn) {
    grid3x3Btn.addEventListener("click", () => {
      console.log("🎯 3x3 Grid selected");
      selectGridSize("3x3");
    });
  }

  // 4x4 Grid button click handler
  if (grid4x4Btn) {
    grid4x4Btn.addEventListener("click", () => {
      console.log("🎯 4x4 Grid selected");
      selectGridSize("4x4");
    });
  }

  // 5x5 Grid button click handler
  if (grid5x5Btn) {
    grid5x5Btn.addEventListener("click", () => {
      console.log("🎯 5x5 Grid selected");
      selectGridSize("5x5");
    });
  }

  // Back button click handler
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      console.log("⬅️ Back button clicked");

      // Play click sound if available
      if (window["playSound"]) {
        window["playSound"]("click");
      }

      // Navigate back to Game Mode 1 screen
      navigateBack();
    });
  }

  // Grid size selection function
  function selectGridSize(size) {
    console.log(`🎯 Grid size selected: ${size}`);

    // Play click sound if available
    if (window["playSound"]) {
      window["playSound"]("click");
    }

    // Store grid size in game state
    if (window["gameState"]) {
      window["gameState"].gridSize = size;
      console.log(`💾 Grid size saved to game state: ${size}`);
    } else {
      // Fallback: store in localStorage
      localStorage.setItem("gameGridSize", size);
      console.log(`💾 Grid size saved to localStorage: ${size}`);
    }

    // Navigate to Game screen
    navigateToGame();
  }

  // Navigation functions
  function navigateToGame() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("game");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#game";
    }
  }

  function navigateBack() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("mode1");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#mode1";
    }
  }

  // Add hover effects for better UX
  addHoverEffects();

  console.log("🎮 Game Mode 2 screen initialized");
}

// Add hover effects for interactive elements
function addHoverEffects() {
  const gridBtns = document.querySelectorAll(".grid-btn");
  const backBtn = document.getElementById("back-btn");

  // Grid buttons hover effects
  gridBtns.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "scale(1.05)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "scale(1)";
    });
  });

  // Back button hover effect
  if (backBtn) {
    backBtn.addEventListener("mouseenter", () => {
      backBtn.style.transform = "scale(1.1)";
    });

    backBtn.addEventListener("mouseleave", () => {
      backBtn.style.transform = "scale(1)";
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGameMode2Screen);
} else {
  initGameMode2Screen();
}
