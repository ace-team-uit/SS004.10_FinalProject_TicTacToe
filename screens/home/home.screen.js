console.log("🏠 Home screen loaded");

document.getElementById("play-btn")?.addEventListener("click", () => {
  Navigation.navigateTo("select");
});

document.getElementById("to-intro")?.addEventListener("click", () => {
  Navigation.navigateTo("intro");
});
