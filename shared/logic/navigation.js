// Trợ giúp điều hướng (nguồn duy nhất của sự thật)
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
  let previousRoute = null; // Track previous route for back navigation

  function navigateFromIntro() {
    console.log("🏠 Đang điều hướng từ intro đến home");
    window["AppStorage"]?.saveSettings({ gameIntroShown: true });

    // Dừng BGM intro trước khi điều hướng
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
    console.log("🏠 Đang điều hướng đến", route);
    // Kiểm tra xem intro có cần hiển thị không
    const settings = window["AppStorage"]?.loadSettings();
    const target =
      !settings?.gameIntroShown && route !== "intro" ? "intro" : ROUTES[route] ? route : "home";

    if (current === target) return;

    // Lưu route hiện tại làm previous route (trừ khi là lần đầu tiên)
    if (current !== null) {
      previousRoute = current;
    }

    // Cập nhật route hiện tại
    current = target;

    // Cập nhật hash nếu cần
    if (!opts.silentHash) setHash(target);

    // Cập nhật tiêu đề tài liệu
    document.title = ROUTES[target].title;

    // Tải nội dung màn hình
    if (typeof window["loadScreen"] === "function") {
      window["loadScreen"](pathOf(target));
    } else {
      setTimeout(() => window["loadScreen"] && window["loadScreen"](pathOf(target)), 0);
    }

    // Phát sự kiện điều hướng
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

  function getPreviousRoute() {
    return previousRoute;
  }

  function navigateBack() {
    if (previousRoute) {
      console.log("🔄 Đang điều hướng quay lại từ", current, "đến", previousRoute);
      navigateTo(previousRoute);
    } else {
      console.log("⚠️ Không có route trước đó, chuyển về home");
      navigateTo("home");
    }
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
    getPreviousRoute,
    navigateBack,
    isValidRoute,
    getRouteFromHash,
    navigateFromIntro,
  };

  // Xử lý route ban đầu
  window.addEventListener("load", () => {
    // Kiểm tra xem intro đã được hiển thị chưa
    const settings = window["AppStorage"]?.loadSettings();

    // Bắt buộc hiển thị intro nếu chưa hiển thị, nếu không thì sử dụng route từ hash
    const route = !settings?.gameIntroShown ? "intro" : getRouteFromHash();
    navigateTo(route, { silentHash: true });
  });

  // Xử lý thay đổi hash
  window.addEventListener("hashchange", () => {
    const route = getRouteFromHash();
    if (route !== current) {
      navigateTo(route, { silentHash: true, from: current });
    }
  });

  // Xử lý popstate (nút back/forward của trình duyệt)
  window.addEventListener("popstate", () => {
    const route = getRouteFromHash();
    if (route !== current) {
      navigateTo(route, { silentHash: true, from: current });
    }
  });
})();
