console.log("🎮 Select Game screen loaded");

// Select Game screen initialization function
function initSelectGameScreen() {
  // DOM elements
  const singlePlayerBtn = document.getElementById("single-player-btn");
  const marketplaceBtn = document.getElementById("marketplace-btn");
  const homeBtn = document.getElementById("home-btn");
  const settingsBtn = document.getElementById("settings-btn");

  console.log("✅ Found required elements");

  // Single Player button click handler
  if (singlePlayerBtn) {
    singlePlayerBtn.addEventListener("click", () => {
      console.log("🎯 Single Player selected");
      window["Navigation"]?.navigateTo("mode1");
    });
  }

  // Marketplace button click handler
  if (marketplaceBtn) {
    marketplaceBtn.addEventListener("click", () => {
      console.log("🛒 Marketplace selected");
      window["Navigation"]?.navigateTo("marketplace");
    });
  }

  // Home button click handler
  if (homeBtn) {
    homeBtn.addEventListener("click", () => {
      console.log("🏠 Home selected");
      window["Navigation"]?.navigateTo("home");
    });
  }

  // Settings button click handler
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      console.log("⚙️ Settings selected");
      window["Navigation"]?.navigateTo("settings");
    });
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
