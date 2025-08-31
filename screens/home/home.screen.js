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
        window["Navigation"]?.navigateTo("select");
      } catch (error) {
        console.error("Error during loading:", error);
        // Fallback: navigate directly if video fails
        hideLoading();
        window["Navigation"]?.navigateTo("select");
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
  /**
   * Plays the loading video and waits for completion or timeout
   * @returns {Promise<void>} Resolves when video ends or times out
   */
  function playLoadingVideo() {
    return new Promise((resolve, reject) => {
      if (!loadingVideo) {
        reject(new Error("Loading video not found"));
        return;
      }

      // Type check for HTMLVideoElement
      if (!loadingVideo || loadingVideo.tagName !== "VIDEO") {
        reject(new Error("Loading video element is not a video element"));
        return;
      }

      // Cast to HTMLVideoElement
      const videoElement = /** @type {HTMLVideoElement} */ (loadingVideo);

      // Reset video
      videoElement.currentTime = 0;

      // Play video
      const playPromise = videoElement.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Wait for video to finish or timeout after 3 seconds
            const timeout = window.setTimeout(() => {
              resolve();
            }, 3000);

            videoElement.addEventListener(
              "ended",
              () => {
                window.clearTimeout(timeout);
                resolve();
              },
              { once: true }
            );

            videoElement.addEventListener("error", () => {
              window.clearTimeout(timeout);
              reject(new Error("Video playback failed"));
            });
          })
          .catch(reject);
      } else {
        // Fallback for older browsers
        window.setTimeout(() => resolve(), 2000);
      }
    });
  }

  console.log("🏠 Home screen initialized");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initHomeScreen);
} else {
  initHomeScreen();
}
