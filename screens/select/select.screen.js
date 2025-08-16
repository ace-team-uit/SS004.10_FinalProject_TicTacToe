console.log("🧭 Select screen loaded");

document.getElementById("select-next")?.addEventListener("click", () => {
  Navigation.navigateTo("settings");
});

document.getElementById("select-prev")?.addEventListener("click", () => {
  Navigation.navigateTo("home");
});
