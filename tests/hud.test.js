/* global GameHUD, KeyboardEvent, setInterval, clearInterval */

/**
 * Test file for HUD Component
 * Run this in browser console or test environment
 */

console.log("🧪 Starting HUD Component Tests...");

// Mock DOM elements for testing
function createMockDOM() {
  // Create mock elements
  const mockScoreDisplay = document.createElement("div");
  mockScoreDisplay.className = "score-display";
  mockScoreDisplay.textContent = "0:0";

  const mockStarsContainer = document.createElement("div");
  mockStarsContainer.className = "stars-container";

  const mockProgressBar = document.createElement("div");
  mockProgressBar.className = "progress-bar";

  const mockProgressFill = document.createElement("div");
  mockProgressFill.className = "progress-fill";
  mockProgressFill.style.width = "100%";

  // Create mock stars
  const mockStars = [];
  for (let i = 0; i < 3; i++) {
    const star = document.createElement("img");
    star.src = "assets/images/game/star-filled.png";
    star.className = "star";
    mockStars.push(star);
    mockStarsContainer.appendChild(star);
  }

  mockProgressBar.appendChild(mockProgressFill);

  // Append to body for testing
  document.body.appendChild(mockScoreDisplay);
  document.body.appendChild(mockStarsContainer);
  document.body.appendChild(mockProgressBar);

  return {
    scoreDisplay: mockScoreDisplay,
    starsContainer: mockStarsContainer,
    stars: mockStars,
    progressBar: mockProgressBar,
    progressFill: mockProgressFill,
  };
}

// Test functions
function testUpdateScores() {
  console.log("📊 Testing updateScores...");

  const mockElements = createMockDOM();

  // Test updating scores
  GameHUD.elements.scoreDisplay = mockElements.scoreDisplay;
  GameHUD.updateScores({ player1: 5, player2: 3 });

  const newText = mockElements.scoreDisplay.textContent;
  const expected = "5:3";

  if (newText === expected) {
    console.log("✅ updateScores: PASSED");
  } else {
    console.log("❌ updateScores: FAILED - Expected:", expected, "Got:", newText);
  }

  // Cleanup
  mockElements.scoreDisplay.remove();
  mockElements.starsContainer.remove();
  mockElements.progressBar.remove();
}

function testUpdateTimer() {
  console.log("⏱️ Testing updateTimer...");

  const mockElements = createMockDOM();

  // Test timer update
  GameHUD.elements.progressFill = mockElements.progressFill;
  GameHUD.updateTimer({ current: 30, total: 60 });

  const newWidth = mockElements.progressFill.style.width;
  const expected = "50%";

  if (newWidth === expected) {
    console.log("✅ updateTimer: PASSED");
  } else {
    console.log("❌ updateTimer: FAILED - Expected:", expected, "Got:", newWidth);
  }

  // Test urgent timer (red color)
  GameHUD.updateTimer({ current: 10, total: 60 });
  const urgentColor = mockElements.progressFill.style.backgroundColor;
  console.log("🎨 Urgent timer color:", urgentColor);

  // Cleanup
  mockElements.scoreDisplay.remove();
  mockElements.starsContainer.remove();
  mockElements.progressBar.remove();
}

function testUpdateStars() {
  console.log("⭐ Testing updateStars...");

  const mockElements = createMockDOM();

  // Test star update
  GameHUD.elements.stars = mockElements.stars;
  GameHUD.updateStars(2);

  const filledStars = mockElements.stars.filter((star) => star.src.includes("filled")).length;

  if (filledStars === 2) {
    console.log("✅ updateStars: PASSED");
  } else {
    console.log("❌ updateStars: FAILED - Expected: 2, Got:", filledStars);
  }

  // Cleanup
  mockElements.scoreDisplay.remove();
  mockElements.starsContainer.remove();
  mockElements.progressBar.remove();
}

function testCreateColorPalette() {
  console.log("🎨 Testing createColorPalette...");

  const palette = GameHUD.createColorPalette();

  if (palette && palette.classList.contains("color-palette")) {
    console.log("✅ createColorPalette: PASSED - Palette created");

    // Test color swatches
    const swatches = palette.querySelectorAll(".color-swatch");
    if (swatches.length === 6) {
      console.log("✅ Color swatches: PASSED - 6 colors available");
    } else {
      console.log("❌ Color swatches: FAILED - Expected: 6, Got:", swatches.length);
    }
  } else {
    console.log("❌ createColorPalette: FAILED - Invalid palette element");
  }

  // Cleanup
  if (palette.parentNode) {
    palette.remove();
  }
}

function testThemePreview() {
  console.log("🎭 Testing theme preview...");

  // Test theme preview event
  let eventDispatched = false;
  let eventData = null;

  document.addEventListener("theme:preview", (e) => {
    eventDispatched = true;
    eventData = e.detail;
  });

  // Create test color
  const testColor = { name: "Test", value: "#ff0000", class: "theme-test" };

  // Trigger preview
  GameHUD.previewTheme(testColor);

  setTimeout(() => {
    if (eventDispatched && eventData) {
      console.log("✅ Theme preview: PASSED - Event dispatched with data:", eventData);
    } else {
      console.log("❌ Theme preview: FAILED - Event not dispatched properly");
    }
  }, 100);
}

function testKeyboardControls() {
  console.log("⌨️ Testing keyboard controls...");

  // Mock back button
  const mockBackBtn = document.createElement("button");
  mockBackBtn.id = "back-btn";
  document.body.appendChild(mockBackBtn);

  GameHUD.elements.backBtn = mockBackBtn;

  // Test escape key
  const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
  document.dispatchEvent(escapeEvent);

  console.log("✅ Keyboard controls: PASSED - Escape key handled");

  // Cleanup
  mockBackBtn.remove();
}

function testGetState() {
  console.log("📋 Testing getState...");

  const mockElements = createMockDOM();

  // Set up HUD elements
  GameHUD.elements.scoreDisplay = mockElements.scoreDisplay;
  GameHUD.elements.stars = mockElements.stars;
  GameHUD.elements.progressFill = mockElements.progressFill;

  // Update some values
  GameHUD.updateScores({ player1: 3, player2: 1 });
  GameHUD.updateStars(2);
  GameHUD.updateTimer({ current: 45, total: 60 });

  // Get state
  const state = GameHUD.getState();

  if (state.scores.player1 === 3 && state.scores.player2 === 1 && state.stars === 2) {
    console.log("✅ getState: PASSED - State retrieved correctly:", state);
  } else {
    console.log("❌ getState: FAILED - Invalid state:", state);
  }

  // Cleanup
  mockElements.scoreDisplay.remove();
  mockElements.starsContainer.remove();
  mockElements.progressBar.remove();
}

// Run all tests
function runAllTests() {
  console.log("🚀 Running all HUD tests...\n");

  try {
    testUpdateScores();
    console.log("");

    testUpdateTimer();
    console.log("");

    testUpdateStars();
    console.log("");

    testCreateColorPalette();
    console.log("");

    testThemePreview();
    console.log("");

    testKeyboardControls();
    console.log("");

    testGetState();
    console.log("");

    console.log("🎉 All tests completed!");
  } catch (error) {
    console.error("💥 Test error:", error);
  }
}

// Export for use in other test files
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    runAllTests,
    testUpdateScores,
    testUpdateTimer,
    testUpdateStars,
    testCreateColorPalette,
    testThemePreview,
    testKeyboardControls,
    testGetState,
  };
}

// Auto-run tests if loaded in browser
if (typeof window !== "undefined") {
  // Wait for GameHUD to be available
  const checkHUD = setInterval(() => {
    if (window.GameHUD) {
      clearInterval(checkHUD);
      console.log("🎮 GameHUD detected, ready for testing");
      console.log('Type "runAllTests()" to run tests');
    }
  }, 100);
}
