// Navigation helper (single source of truth)
(function () {
  const ROUTES = {
    intro: {
      path: "screens/intro/intro.html",
      title: "Intro",
    },
    home: {
      path: "screens/home/home.html",
      title: "Home",
    },
    select: {
      path: "screens/select/select.html",
      title: "Select Game",
    },
    mode1: {
      path: "screens/mode1/mode1.html",
      title: "Game Mode 1",
    },
    mode2: {
      path: "screens/mode2/mode2.html",
      title: "Game Mode 2",
    },
    settings: {
      path: "screens/settings/settings.html",
      title: "Settings",
    },
    marketplace: {
      path: "screens/marketplace/marketplace.html",
      title: "Marketplace",
    },
    game: {
      path: "screens/game/game.html",
      title: "Game",
    },
    result: {
      path: "screens/result/result.html",
      title: "Result",
    },
  };

  const ORDER = [
    "intro",
    "home",
    "select",
    "mode1",
    "mode2",
    "settings",
    "marketplace",
    "game",
    "result",
  ];

  let current = null;

  function navigateFromIntro() {
    console.log("🏠 Navigating from intro to home");
    window["AppStorage"]?.saveSettings({ gameIntroShown: true });

    // Stop intro BGM before navigating
    if (window["audioManager"]) {
      window["audioManager"].stopBgm();
    }

    const introScreen = document.querySelector(".intro-screen");
    if (introScreen) {
      introScreen.classList.add("fade-out");
      setTimeout(() => {
        navigateTo("home");
      }, 500);
    } else {
      navigateTo("home");
    }
  }

  function pathOf(route) {
    return ROUTES[route]?.path || ROUTES.home.path;
  }

  function setHash(route) {
    if (location.hash.replace("#", "") !== route) {
      location.hash = "#" + route;
    }
  }

  function getRouteFromHash() {
    const h = location.hash.replace("#", "").trim();

    // Check if intro needs to be shown
    const settings = window["AppStorage"]?.loadSettings();
    if (!settings?.gameIntroShown && h !== "intro") {
      return "intro";
    }

    return ROUTES[h] ? h : "home";
  }

  function navigateTo(route, opts = {}) {
    console.log("🏠 Navigating to", route);
    // Check if intro needs to be shown
    const settings = window["AppStorage"]?.loadSettings();
    const target =
      !settings?.gameIntroShown && route !== "intro" ? "intro" : ROUTES[route] ? route : "home";

    if (current === target) return;

    // Update current route
    current = target;

    // Update hash if needed
    if (!opts.silentHash) setHash(target);

    // Update document title
    document.title = ROUTES[target].title;

    // Load screen content
    if (typeof window["loadScreen"] === "function") {
      window["loadScreen"](pathOf(target));
    } else {
      setTimeout(() => window["loadScreen"] && window["loadScreen"](pathOf(target)), 0);
    }

    // Dispatch navigation event
    window.dispatchEvent(
      new window.CustomEvent("navigation", {
        detail: {
          from: opts.from || null,
          to: target,
          path: pathOf(target),
        },
      })
    );
  }

  function next() {
    const idx = ORDER.indexOf(current || getRouteFromHash());
    navigateTo(ORDER[(idx + 1) % ORDER.length]);
  }

  function prev() {
    const idx = ORDER.indexOf(current || getRouteFromHash());
    navigateTo(ORDER[(idx - 1 + ORDER.length) % ORDER.length]);
  }

  function getCurrentRoute() {
    return current;
  }

  function isValidRoute(route) {
    return !!ROUTES[route];
  }

  /** @type {any} */ (window).Navigation = {
    ROUTES,
    ORDER,
    navigateTo,
    next,
    prev,
    getCurrentRoute,
    isValidRoute,
    getRouteFromHash,
    navigateFromIntro,
  };

  // Handle initial route
  window.addEventListener("load", () => {
    // Check if intro was shown
    const settings = window["AppStorage"]?.loadSettings();

    // Force intro if not shown, otherwise use hash route
    const route = !settings?.gameIntroShown ? "intro" : getRouteFromHash();
    navigateTo(route, { silentHash: true });
  });

  // Handle hash changes
  window.addEventListener("hashchange", () => {
    const route = getRouteFromHash();
    if (route !== current) {
      navigateTo(route, { silentHash: true, from: current });
    }
  });

  // Handle popstate (browser back/forward)
  window.addEventListener("popstate", () => {
    const route = getRouteFromHash();
    if (route !== current) {
      navigateTo(route, { silentHash: true, from: current });
    }
  });
})();
