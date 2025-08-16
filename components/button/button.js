(function () {
  const api = {
    create({ label = "Button", variant = "primary", id, onClick } = {}) {
      const btn = document.createElement("button");
      if (id) btn.id = id;
      btn.className = `btn btn-${variant}`;
      btn.textContent = label;
      if (onClick) btn.addEventListener("click", onClick);
      return btn;
    },
  };
  /** @type {any} */ (window).Components.button = api;
})();
