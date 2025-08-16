console.log("🏁 Result screen loaded");

document.getElementById("result-home")?.addEventListener("click", () => {
  Navigation.navigateTo("home");
});

document.getElementById("result-retry")?.addEventListener("click", () => {
  Navigation.navigateTo("game");
});

document.getElementById("result-prev")?.addEventListener("click", () => {
  Navigation.previous("result");
});
