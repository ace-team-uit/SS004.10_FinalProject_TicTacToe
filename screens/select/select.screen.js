console.log("🎮 Select Game screen loaded");

// Select Game screen initialization function
function initSelectGameScreen() {
  // DOM elements
  const singlePlayerBtn = document.getElementById("single-player-btn");
  const marketplaceBtn = document.getElementById("marketplace-btn");
  const homeBtn = document.getElementById("home-btn");
  const settingsBtn = document.getElementById("settings-btn");

  console.log("✅ Found required elements");

  // Ensure Select screen has appropriate BGM
  if (window["playBgm"]) {
    console.log("🎵 Starting select game BGM");
    window["playBgm"]("bgm-select");
  }

  // Single Player button click handler
  if (singlePlayerBtn) {
    singlePlayerBtn.addEventListener("click", () => {
      console.log("🎯 Single Player selected");

      // Play click sound if available
      if (window["playSound"]) {
        window["playSound"]("click");
      }

      // Navigate to Game Mode 1 (difficulty selection)
      navigateToGameMode1();
    });
  }

  // Marketplace button click handler
  if (marketplaceBtn) {
    marketplaceBtn.addEventListener("click", () => {
      console.log("🛒 Marketplace selected");

      // Play click sound if available
      if (window["playSound"]) {
        window["playSound"]("click");
      }

      // Navigate to Marketplace
      navigateToMarketplace();
    });
  }

  // Home button click handler
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      console.log("🏠 Home selected");

      // Play click sound if available
      if (window["playSound"]) {
        window["playSound"]("click");
      }

      // Navigate to Home
      navigateToHome();
    });
  }

  // Settings button click handler
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      console.log("⚙️ Settings selected");

      // Play click sound if available
      if (window["playSound"]) {
        window["playSound"]("click");
      }

      // Navigate to Settings
      navigateToSettings();
    });
  }

  // Navigation functions
  function navigateToGameMode1() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("mode1");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#mode1";
    }
  }

  function navigateToMarketplace() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("marketplace");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#marketplace";
    }
  }

  function navigateToHome() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("home");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#home";
    }
  }

  function navigateToSettings() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("settings");
    } else {
      console.warn("Navigation not available, redirecting manually");
      window.location.href = "#settings";
    }
  }

  // Add hover effects for better UX
  addHoverEffects();

  console.log("🎮 Select Game screen initialized");
}

// Add hover effects for interactive elements
function addHoverEffects() {
  const singlePlayerBtn = document.getElementById("single-player-btn");
  const navButtons = document.querySelectorAll(".nav-button");

  // Single player button hover effect
  if (singlePlayerBtn) {
    singlePlayerBtn.addEventListener("mouseenter", () => {
      singlePlayerBtn.style.transform = "translateY(-2px) scale(1.02)";
    });

    singlePlayerBtn.addEventListener("mouseleave", () => {
      singlePlayerBtn.style.transform = "translateY(0) scale(1)";
    });
  }

  // Navigation buttons hover effects
  navButtons.forEach((button) => {
    button.addEventListener("mouseenter", () => {
      button.style.transform = "translateY(-2px) scale(1.05)";
    });

    button.addEventListener("mouseleave", () => {
      button.style.transform = "translateY(0) scale(1)";
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSelectGameScreen);
} else {
  initSelectGameScreen();
}
