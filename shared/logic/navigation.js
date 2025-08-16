// Navigation helper (single source of truth)
(function () {
  const ROUTES = {
    intro: "screens/intro/intro.html",
    home: "screens/home/home.html",
    select: "screens/select/select.html",
    settings: "screens/settings/settings.html",
    game: "screens/game/game.html",
    result: "screens/result/result.html",
  };

  let current = null;

  function pathOf(route) {
    return ROUTES[route] || ROUTES.home;
  }

  function setHash(route) {
    if (location.hash.replace("#", "") !== route) location.hash = "#" + route;
  }

  function getRouteFromHash() {
    const h = location.hash.replace("#", "").trim();
    return ROUTES[h] ? h : "home";
  }

  function navigateTo(route, opts) {
    const target = ROUTES[route] ? route : "home";
    if (current === target) return;
    current = target;
    if (!opts || !opts.silentHash) setHash(target);
    if (typeof window.loadScreen === "function") {
      window.loadScreen(pathOf(target));
    } else {
      setTimeout(() => window.loadScreen && window.loadScreen(pathOf(target)), 0);
    }
  }

  function next() {
    const ORDER = ["intro", "home", "select", "settings", "game", "result"];
    const idx = ORDER.indexOf(current || getRouteFromHash());
    navigateTo(ORDER[(idx + 1) % ORDER.length]);
  }

  function prev() {
    const ORDER = ["intro", "home", "select", "settings", "game", "result"];
    const idx = ORDER.indexOf(current || getRouteFromHash());
    navigateTo(ORDER[(idx - 1 + ORDER.length) % ORDER.length]);
  }

  /** @type {any} */ (window).Navigation = {
    ROUTES,
    navigateTo,
    next,
    prev,
    getRouteFromHash,
  };

  window.addEventListener("hashchange", () => {
    const r = getRouteFromHash();
    if (r !== current) navigateTo(r, { silentHash: true });
  });
})();
