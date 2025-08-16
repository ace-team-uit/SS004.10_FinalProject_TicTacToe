// Barrel file for common web components (HTML+CSS+JS modules)

(function () {
  function mountStyles(cssText) {
    const styleTag = document.createElement("style");
    styleTag.setAttribute("data-component-style", "true");
    styleTag.textContent = cssText;
    document.head.appendChild(styleTag);
  }

  // Button component
  const Button = {
    /**
     * @param {{label?: string, variant?: string, id?: string, onClick?: (e:Event)=>void}} opts
     */
    create({ label = "Button", variant = "primary", id, onClick } = {}) {
      const btn = document.createElement("button");
      if (id) btn.id = id;
      btn.className = `btn btn-${variant}`;
      btn.textContent = label;
      if (onClick) btn.addEventListener("click", onClick);
      return btn;
    },
  };

  // Header component
  const Header = {
    /**
     * @param {{title?: string, rightSlot?: HTMLElement}} opts
     */
    create({ title = "ACE Tic‑Tac‑Toe", rightSlot } = {}) {
      const el = document.createElement("div");
      el.className = "app-header container flex items-center justify-center p-4";
      el.innerHTML = `<h1 style="font-family: var(--font-display);" class="text-2xl">${title}</h1>`;
      if (rightSlot) el.appendChild(rightSlot);
      return el;
    },
  };

  // Loading component
  const Loading = {
    create() {
      const wrapper = document.createElement("div");
      wrapper.className = "flex items-center justify-center p-4";
      wrapper.innerHTML = '<div class="spinner" aria-label="Loading"></div>';
      return wrapper;
    },
  };

  // Component styles (small)
  mountStyles(`
    .spinner{width:56px;height:56px;border-radius:50%;border:6px solid rgba(255,255,255,.2);border-top-color:var(--brand-accent);animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
  `);

  /** @type {any} */ (window).UIComponents = { Button, Header, Loading };
})();
