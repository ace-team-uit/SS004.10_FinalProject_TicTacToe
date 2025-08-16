console.log("🏁 Result screen loaded");

document.getElementById("result-home")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("home");
});

document.getElementById("result-retry")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("game");
});

document.getElementById("result-prev")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).prev?.("result");
});
