(function () {
  const api = {
    create({ title = "ACE Tic‑Tac‑Toe" } = {}) {
      const container = document.createElement("div");
      container.className = "app-header container text-center p-4";
      container.innerHTML = `<h1 class="text-2xl" style="font-family: var(--font-display);">${title}</h1>`;
      return container;
    },
  };
  /** @type {any} */ (window).Components.header = api;
})();
