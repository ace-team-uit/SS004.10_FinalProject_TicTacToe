const Navigation = window.Navigation || window["Navigation"];
console.log("🎯 Game screen loaded");

document.getElementById("exit-btn")?.addEventListener("click", () => {
  Navigation.navigateTo("settings");
});

document.getElementById("to-result")?.addEventListener("click", () => {
  Navigation.navigateTo("result");
});
