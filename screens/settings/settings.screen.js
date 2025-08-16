console.log("⚙️ Settings screen loaded");

document.getElementById("toggle-theme")?.addEventListener("click", () => {
  window.toggleTheme?.();
});

document.getElementById("settings-next")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("game");
});

document.getElementById("settings-prev")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("select");
});
