console.log("🏠 Home screen loaded");

// Home screen initialization function
function initHomeScreen() {
  // DOM elements
  const playButton = document.getElementById("play-btn");
  const loadingOverlay = document.getElementById("loading-overlay");
  const loadingVideo = document.getElementById("loading-video");

  // Loading state
  let isLoading = false;

  console.log("✅ Found required elements");

  // Ensure Home screen has BGM
  if (window["playBgm"]) {
    console.log("🎵 Starting home BGM");
    window["playBgm"]("bgm-home");
  }

  // Play button click handler
  if (playButton) {
    playButton.addEventListener("click", async () => {
      if (isLoading) return; // Prevent multiple clicks

      try {
        // Show loading overlay
        showLoading();

        // Play loading video
        await playLoadingVideo();

        // Navigate to select screen
        navigateToSelect();
      } catch (error) {
        console.error("Error during loading:", error);
        // Fallback: navigate directly if video fails
        hideLoading();
        navigateToSelect();
      }
    });
  }

  // Show loading overlay
  function showLoading() {
    isLoading = true;
    if (loadingOverlay) {
      loadingOverlay.classList.remove("hidden");
      loadingOverlay.classList.add("show");
    }
  }

  // Hide loading overlay
  function hideLoading() {
    isLoading = false;
    if (loadingOverlay) {
      loadingOverlay.classList.remove("show");
      loadingOverlay.classList.add("hidden");
    }
  }

  // Play loading video
  function playLoadingVideo() {
    return new Promise((resolve, reject) => {
      if (!loadingVideo) {
        reject(new Error("Loading video not found"));
        return;
      }

      // Reset video
      loadingVideo.currentTime = 0;

      // Play video
      const playPromise = loadingVideo.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Wait for video to finish or timeout after 3 seconds
            const timeout = setTimeout(() => {
              resolve();
            }, 3000);

            loadingVideo.addEventListener(
              "ended",
              () => {
                clearTimeout(timeout);
                resolve();
              },
              { once: true }
            );

            loadingVideo.addEventListener("error", () => {
              clearTimeout(timeout);
              reject(new Error("Video playback failed"));
            });
          })
          .catch(reject);
      } else {
        // Fallback for older browsers
        setTimeout(resolve, 2000);
      }
    });
  }

  // Navigate to select screen
  function navigateToSelect() {
    if (window.Navigation || window["Navigation"]) {
      (window.Navigation || window["Navigation"]).navigateTo("select");
    } else {
      console.warn("Navigation not available, redirecting manually");
      // Fallback navigation
      window.location.href = "#select";
    }
  }

  console.log("🏠 Home screen initialized");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomeScreen);
} else {
  initHomeScreen();
}
