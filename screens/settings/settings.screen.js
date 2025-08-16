console.log("⚙️ Settings screen loaded");

document.getElementById("toggle-theme")?.addEventListener("click", () => {
  window.toggleTheme?.();
});

document.getElementById("settings-next")?.addEventListener("click", () => {
  Navigation.navigateTo("game");
});

document.getElementById("settings-prev")?.addEventListener("click", () => {
  Navigation.navigateTo("select");
});
