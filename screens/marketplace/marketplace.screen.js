console.log("🛒 Marketplace screen loaded");

document.getElementById("back-btn")?.addEventListener("click", () => {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  if (window.Navigation || window["Navigation"]) {
    (window.Navigation || window["Navigation"]).navigateTo("select");
  } else {
    window.location.href = "#select";
  }
});
