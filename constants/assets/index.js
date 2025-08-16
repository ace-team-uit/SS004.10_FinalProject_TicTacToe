// Centralized asset paths

const ASSETS = {
  images: {
    logo: "assets/images/logo.png",
    backgrounds: {
      common1: "assets/images/common/background-01.png",
      logoBg: "assets/images/common/logo-background.png",
    },
    icons: {
      back: "assets/images/common/back-button.png",
      menu: "assets/images/icons/menu-icon.png",
      close: "assets/images/icons/close-icon.png",
      on: "assets/images/icons/on-icon.png",
      off: "assets/images/icons/off-icon.png",
    },
    gameModes: {
      x3: "assets/images/game-mode-2/3x3.png",
      x4: "assets/images/game-mode-2/4x4.png",
      x5: "assets/images/game-mode-2/5x5.png",
    },
    market: {
      board: "assets/images/market-place/board.png",
      ground: "assets/images/market-place/ground.png",
    },
    options: {
      about: "assets/images/option-menu/about-us-background.png",
      board: "assets/images/option-menu/board-background.png",
      language: "assets/images/option-menu/language-background.png",
      support: "assets/images/option-menu/support-background.png",
      terms: "assets/images/option-menu/terms-background.png",
    },
  },
  sounds: {
    // example placeholders; add real files when available
    click: "assets/sounds/click.mp3",
    win: "assets/sounds/win.mp3",
    lose: "assets/sounds/lose.mp3",
  },
  video: {
    intro: "assets/video/intro.mp4",
  },
  fonts: {
    roleyPoley: "assets/fonts/ROLEY POLEY.TTF",
  },
};

/** @type {any} */ (window).ASSETS = ASSETS;
