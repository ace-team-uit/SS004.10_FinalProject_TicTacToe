(function () {
  function ensureInDOM() {
    let overlay = document.querySelector('[data-id="loading-overlay"]');
    if (!overlay) {
      const tpl = document.createElement("div");
      tpl.innerHTML = `<div class="popup-overlay" data-id="loading-overlay" hidden><div class="popup text-center"><div class="spinner" aria-label="Loading"></div><p class="mt-4">Loading...</p></div></div>`;
      overlay = tpl.firstChild;
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  const api = {
    show() {
      const el = ensureInDOM();
      el.hidden = false;
    },
    hide() {
      const el = ensureInDOM();
      el.hidden = true;
    },
  };
  /** @type {any} */ (window).Components.loading = api;
})();
