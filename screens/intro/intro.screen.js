console.log("🚀 Intro screen loaded");

function initIntroScreen() {
  const video = document.getElementById("intro-video");
  const startButton = document.getElementById("start-video");

  if (!video || !startButton) return;

  // Stop BGM
  window["audioManager"]?.stopBgm();

  // Handle start button click
  startButton.addEventListener("click", () => {
    startButton.classList.add("hidden");
    const videoElement = /** @type {HTMLVideoElement} */ (video);
    videoElement.play();

    // Force navigate to home after 27s
    // setTimeout(() => {
    //   window["Navigation"]?.navigateTo("home");
    // }, 27000);

    videoElement.addEventListener("ended", () => {
      window["Navigation"]?.navigateFromIntro();
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initIntroScreen);
} else {
  initIntroScreen();
}
