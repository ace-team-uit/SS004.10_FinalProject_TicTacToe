console.log("🚀 Intro screen loaded");

document.getElementById("intro-next")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("home");
});

document.getElementById("start-btn")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("home");
});
