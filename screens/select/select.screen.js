console.log("🧭 Select screen loaded");

document.getElementById("select-next")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("settings");
});

document.getElementById("select-prev")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("home");
});
