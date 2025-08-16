console.log("🏠 Home screen loaded");

document.getElementById("play-btn")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("select");
});

document.getElementById("to-intro")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("intro");
});
