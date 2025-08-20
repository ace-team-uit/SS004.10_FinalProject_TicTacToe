console.log("🚀 Intro screen loaded");

// Constants
const INTRO_SHOWN_KEY = "intro_shown";
const VIDEO_DURATION = 27; // seconds

// Initialize when DOM is ready
function initIntroScreen() {
  console.log("🎮 Initializing intro screen");

  const video = document.getElementById("intro-video");
  const startButton = document.getElementById("start-video");

  if (!video || !startButton) {
    console.error("❌ Required elements not found:", {
      video: !!video,
      startButton: !!startButton,
    });
    return;
  }

  console.log("✅ Found required elements");

  // Check if intro was already shown
  const introShown = localStorage.getItem(INTRO_SHOWN_KEY);
  if (introShown === "true") {
    console.log("🔄 Intro already shown, navigating to home");
    navigateToHome();
    return;
  }

  // Handle start button click
  function handleStart() {
    console.log("🎯 Start button clicked");
    startButton.classList.add("hidden");

    video
      .play()
      .then(() => {
        console.log("🎥 Video started playing successfully");
        // Start timer for navigation
        setTimeout(navigateToHome, VIDEO_DURATION * 1000);
      })
      .catch((error) => {
        console.error("❌ Error playing video:", error);
        startButton.classList.remove("hidden");
      });
  }

  // Handle video end
  function handleVideoEnd() {
    console.log("🏁 Video ended naturally");
    navigateToHome();
  }

  // Navigation with animation
  function navigateToHome() {
    console.log("🏠 Navigating to home");
    localStorage.setItem(INTRO_SHOWN_KEY, "true");

    const introScreen = document.querySelector(".intro-screen");
    if (introScreen) {
      introScreen.classList.add("fade-out");
      setTimeout(() => {
        (window.Navigation || window["Navigation"]).navigateTo("home");
      }, 500);
    } else {
      (window.Navigation || window["Navigation"]).navigateTo("home");
    }
  }

  // Add event listeners
  startButton.addEventListener("click", handleStart);
  video.addEventListener("ended", handleVideoEnd);

  console.log("🎮 Intro screen initialized and ready");
}

// Ensure the script runs after DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIntroScreen);
} else {
  initIntroScreen();
}
