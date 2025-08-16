(function () {
  const api = {
    create() {
      const nav = document.createElement("nav");
      nav.className = "navbar panel p-4 flex items-center justify-center gap-4";
      nav.innerHTML = `
        <button data-nav="home" class="btn btn-secondary">Home</button>
        <button data-nav="select" class="btn btn-secondary">Select</button>
        <button data-nav="settings" class="btn btn-secondary">Settings</button>
      `;
      nav.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.matches("button[data-nav]")) {
          const r = target.getAttribute("data-nav");
          (window.Navigation || window["Navigation"]).navigateTo(r);
        }
      });
      return nav;
    },
  };
  /** @type {any} */ (window).Components.navbar = api;
})();
