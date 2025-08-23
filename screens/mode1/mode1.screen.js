console.log("🎮 Game Mode 1 (Difficulty Selection) screen loaded");

// Game Mode 1 screen initialization function
function initGameMode1Screen() {
  // DOM elements
  const easyBtn = document.getElementById("easy-btn");
  const mediumBtn = document.getElementById("medium-btn");
  const hardBtn = document.getElementById("hard-btn");
  const backBtn = document.getElementById("back-btn");

  console.log("✅ Found required elements");

  // Ensure Mode 1 screen has appropriate BGM
  if (window["playBgm"]) {
    console.log("🎵 Starting difficulty selection BGM");
    window["playBgm"]("bgm-select");
  }

  // Easy difficulty button click handler
  if (easyBtn) {
    easyBtn.addEventListener("click", () => {
      console.log("🎯 Easy difficulty selected");
      selectDifficulty("easy");
    });
  }

  // Medium difficulty button click handler
  if (mediumBtn) {
    mediumBtn.addEventListener("click", () => {
      console.log("🎯 Medium difficulty selected");
      selectDifficulty("medium");
    });
  }

  // Hard difficulty button click handler
  if (hardBtn) {
    hardBtn.addEventListener("click", () => {
      console.log("🎯 Hard difficulty selected");
      selectDifficulty("hard");
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

      // Navigate back to Select Game screen
      navigateBack();
    });
  }

  // Difficulty selection function
  function selectDifficulty(level) {
    console.log(`🎯 Difficulty level selected: ${level}`);

    // Play click sound if available
    if (window["playSound"]) {
      window["playSound"]("click");
    }

    // Store difficulty level in game state
    if (window["gameState"]) {
      window["gameState"].difficulty = level;
      console.log(`💾 Difficulty saved to game state: ${level}`);
    } else {
      // Fallback: store in localStorage
      localStorage.setItem("gameDifficulty", level);
      console.log(`💾 Difficulty saved to localStorage: ${level}`);
    }

    // Navigate to Game Mode 2 (grid size selection)
    navigateToGameMode2();
  }

  // Navigation functions
  function navigateToGameMode2() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("mode2");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#mode2";
    }
  }

  function navigateBack() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("select");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#select";
    }
  }

  // Add hover effects for better UX
  addHoverEffects();

  console.log("🎮 Game Mode 1 screen initialized");
}

// Add hover effects for interactive elements
function addHoverEffects() {
  const difficultyBtns = document.querySelectorAll(".difficulty-btn");
  const backBtn = document.getElementById("back-btn");

  // Difficulty buttons hover effects
  difficultyBtns.forEach((button) => {
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
  document.addEventListener("DOMContentLoaded", initGameMode1Screen);
} else {
  initGameMode1Screen();
}
