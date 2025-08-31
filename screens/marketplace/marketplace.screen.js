console.log("🛒 Marketplace screen loaded");

// Check if variables are already declared to avoid redeclaration errors
if (typeof window["marketplaceInitialized"] === "undefined") {
  // Board images array
  window["boardImages"] = [
    "assets/images/marketplace/board-01.png",
    "assets/images/marketplace/board-02.png",
    "assets/images/marketplace/board-03.png",
    "assets/images/marketplace/board-04.png",
    "assets/images/marketplace/board-05.png",
    "assets/images/marketplace/board-06.png",
    "assets/images/marketplace/board-07.png",
    "assets/images/marketplace/board-08.png",
    "assets/images/marketplace/board-09.png",
    "assets/images/marketplace/board-10.png",
    "assets/images/marketplace/board-11.png",
    "assets/images/marketplace/board-12.png",
    "assets/images/marketplace/board-13.png",
  ];

  window["currentBoardIndex"] = 0;
  window["marketplaceInitialized"] = true;
}

// Get DOM elements
function getElements() {
  return {
    boardImg: document.getElementById("board"),
    leftBtn: document.getElementById("left-btn"),
    rightBtn: document.getElementById("right-btn"),
    selectBtn: document.getElementById("select-btn"),
    backBtn: document.getElementById("back-btn"),
  };
}

// Initialize board display
function updateBoardDisplay() {
  const elements = getElements();
  if (elements.boardImg && elements.boardImg instanceof HTMLImageElement) {
    elements.boardImg.src = window["boardImages"][window["currentBoardIndex"]];
    elements.boardImg.alt = `Board ${window["currentBoardIndex"] + 1}`;
  }
}

// Navigate to previous board with animation
function showPreviousBoard() {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  const elements = getElements();
  if (!elements.boardImg) return;

  // Add slide out animation
  elements.boardImg.classList.add("slide-left");

  setTimeout(() => {
    window["currentBoardIndex"] =
      window["currentBoardIndex"] > 0
        ? window["currentBoardIndex"] - 1
        : window["boardImages"].length - 1;
    updateBoardDisplay();

    // Remove slide out and add slide in animation
    if (elements.boardImg) {
      elements.boardImg.classList.remove("slide-left");
      elements.boardImg.classList.add("slide-in-left");

      // Remove animation class after animation completes
      setTimeout(() => {
        if (elements.boardImg) {
          elements.boardImg.classList.remove("slide-in-left");
        }
      }, 300);
    }
  }, 150);
}

// Navigate to next board with animation
function showNextBoard() {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  const elements = getElements();
  if (!elements.boardImg) return;

  // Add slide out animation
  elements.boardImg.classList.add("slide-right");

  setTimeout(() => {
    window["currentBoardIndex"] =
      window["currentBoardIndex"] < window["boardImages"].length - 1
        ? window["currentBoardIndex"] + 1
        : 0;
    updateBoardDisplay();

    // Remove slide out and add slide in animation
    if (elements.boardImg) {
      elements.boardImg.classList.remove("slide-right");
      elements.boardImg.classList.add("slide-in-right");

      // Remove animation class after animation completes
      setTimeout(() => {
        if (elements.boardImg) {
          elements.boardImg.classList.remove("slide-in-right");
        }
      }, 300);
    }
  }, 150);
}

// Select current board and save to localStorage
function selectBoard() {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  // Predefined color pairs for each board
  const boardColorPairs = [
    // Board 1 - Classic Blue & Red
    {
      x: "linear-gradient(45deg, #2196F3, #1976D2)",
      o: "linear-gradient(45deg, #F44336, #D32F2F)"
    },
    // Board 2 - Purple & Gold
    {
      x: "linear-gradient(45deg, #9C27B0, #7B1FA2)",
      o: "linear-gradient(45deg, #FFC107, #FFA000)"
    },
    // Board 3 - Green & Orange
    {
      x: "linear-gradient(45deg, #4CAF50, #388E3C)",
      o: "linear-gradient(45deg, #FF9800, #F57C00)"
    },
    // Board 4 - Pink & Teal
    {
      x: "linear-gradient(45deg, #E91E63, #C2185B)",
      o: "linear-gradient(45deg, #009688, #00796B)"
    },
    // Board 5 - Deep Purple & Amber
    {
      x: "linear-gradient(45deg, #673AB7, #512DA8)",
      o: "linear-gradient(45deg, #FFC107, #FFA000)"
    },
    // Board 6 - Indigo & Deep Orange
    {
      x: "linear-gradient(45deg, #3F51B5, #303F9F)",
      o: "linear-gradient(45deg, #FF5722, #E64A19)"
    },
    // Board 7 - Light Blue & Red
    {
      x: "linear-gradient(45deg, #03A9F4, #0288D1)",
      o: "linear-gradient(45deg, #F44336, #D32F2F)"
    },
    // Board 8 - Cyan & Pink
    {
      x: "linear-gradient(45deg, #00BCD4, #0097A7)",
      o: "linear-gradient(45deg, #E91E63, #C2185B)"
    },
    // Board 9 - Teal & Orange
    {
      x: "linear-gradient(45deg, #009688, #00796B)",
      o: "linear-gradient(45deg, #FF9800, #F57C00)"
    },
    // Board 10 - Green & Purple
    {
      x: "linear-gradient(45deg, #4CAF50, #388E3C)",
      o: "linear-gradient(45deg, #9C27B0, #7B1FA2)"
    },
    // Board 11 - Blue & Yellow
    {
      x: "linear-gradient(45deg, #2196F3, #1976D2)",
      o: "linear-gradient(45deg, #FFEB3B, #FBC02D)"
    },
    // Board 12 - Deep Purple & Light Green
    {
      x: "linear-gradient(45deg, #673AB7, #512DA8)",
      o: "linear-gradient(45deg, #8BC34A, #689F38)"
    },
    // Board 13 - Brown & Blue Grey
    {
      x: "linear-gradient(45deg, #795548, #5D4037)",
      o: "linear-gradient(45deg, #607D8B, #455A64)"
    }
  ];

  // Save selected board and its predefined colors to localStorage
  const selectedBoard = {
    index: window["currentBoardIndex"],
    image: window["boardImages"][window["currentBoardIndex"]],
    name: `Board ${window["currentBoardIndex"] + 1}`,
    colors: boardColorPairs[window["currentBoardIndex"]],
  };

  window["AppStorage"]?.set("selectedBoard", selectedBoard);
  console.log(
    `🎯 Selected board: ${window["currentBoardIndex"] + 1} with colors - Saved to storage`
  );

  // Navigate back to select screen
  window["Navigation"]?.navigateTo("select");
}

// Back button functionality
function handleBackButton() {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  window["Navigation"]?.navigateTo("select");
}

// Setup all event listeners
function setupEventListeners() {
  const elements = getElements();

  // Remove existing listeners by cloning elements (this removes all event listeners)
  if (elements.leftBtn && elements.leftBtn.parentNode) {
    const newLeftBtn = elements.leftBtn.cloneNode(true);
    elements.leftBtn.parentNode.replaceChild(newLeftBtn, elements.leftBtn);
    newLeftBtn.addEventListener("click", showPreviousBoard);
  }

  if (elements.rightBtn && elements.rightBtn.parentNode) {
    const newRightBtn = elements.rightBtn.cloneNode(true);
    elements.rightBtn.parentNode.replaceChild(newRightBtn, elements.rightBtn);
    newRightBtn.addEventListener("click", showNextBoard);
  }

  if (elements.selectBtn && elements.selectBtn.parentNode) {
    const newSelectBtn = elements.selectBtn.cloneNode(true);
    elements.selectBtn.parentNode.replaceChild(newSelectBtn, elements.selectBtn);
    newSelectBtn.addEventListener("click", selectBoard);
  }

  if (elements.backBtn && elements.backBtn.parentNode) {
    const newBackBtn = elements.backBtn.cloneNode(true);
    elements.backBtn.parentNode.replaceChild(newBackBtn, elements.backBtn);
    newBackBtn.addEventListener("click", handleBackButton);
  }
}

// Initialize everything
function initializeMarketplace() {
  setupEventListeners();
  updateBoardDisplay();
  console.log("🎮 Marketplace initialized successfully");
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMarketplace);
} else {
  initializeMarketplace();
}
