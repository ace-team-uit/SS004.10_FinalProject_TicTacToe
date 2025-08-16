console.log("🎯 Game screen loaded");

document.getElementById("exit-btn")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("settings");
});

document.getElementById("to-result")?.addEventListener("click", () => {
  (window.Navigation || window["Navigation"]).navigateTo("result");
});
