console.log("🛒 Marketplace screen loaded");

// Kiểm tra xem các biến đã được khai báo chưa để tránh lỗi khai báo lại
if (typeof window["marketplaceInitialized"] === "undefined") {
  // Mảng hình ảnh bàn cờ
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

// Lấy các phần tử DOM
function getElements() {
  return {
    boardImg: document.getElementById("board"),
    leftBtn: document.getElementById("left-btn"),
    rightBtn: document.getElementById("right-btn"),
    selectBtn: document.getElementById("select-btn"),
    backBtn: document.getElementById("back-btn"),
  };
}

// Khởi tạo hiển thị bàn cờ
function updateBoardDisplay() {
  const elements = getElements();
  if (elements.boardImg && elements.boardImg instanceof HTMLImageElement) {
    elements.boardImg.src = window["boardImages"][window["currentBoardIndex"]];
    elements.boardImg.alt = `Board ${window["currentBoardIndex"] + 1}`;
  }
}

// Điều hướng đến bàn cờ trước đó với hiệu ứng
function showPreviousBoard() {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  const elements = getElements();
  if (!elements.boardImg) return;

  // Thêm hiệu ứng trượt ra
  elements.boardImg.classList.add("slide-left");

  setTimeout(() => {
    window["currentBoardIndex"] =
      window["currentBoardIndex"] > 0
        ? window["currentBoardIndex"] - 1
        : window["boardImages"].length - 1;
    updateBoardDisplay();

    // Xóa hiệu ứng trượt ra và thêm hiệu ứng trượt vào
    if (elements.boardImg) {
      elements.boardImg.classList.remove("slide-left");
      elements.boardImg.classList.add("slide-in-left");

      // Xóa class hiệu ứng sau khi hoàn thành
      setTimeout(() => {
        if (elements.boardImg) {
          elements.boardImg.classList.remove("slide-in-left");
        }
      }, 300);
    }
  }, 150);
}

// Điều hướng đến bàn cờ tiếp theo với hiệu ứng
function showNextBoard() {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  const elements = getElements();
  if (!elements.boardImg) return;

  // Thêm hiệu ứng trượt ra
  elements.boardImg.classList.add("slide-right");

  setTimeout(() => {
    window["currentBoardIndex"] =
      window["currentBoardIndex"] < window["boardImages"].length - 1
        ? window["currentBoardIndex"] + 1
        : 0;
    updateBoardDisplay();

    // Xóa hiệu ứng trượt ra và thêm hiệu ứng trượt vào
    if (elements.boardImg) {
      elements.boardImg.classList.remove("slide-right");
      elements.boardImg.classList.add("slide-in-right");

      // Xóa class hiệu ứng sau khi hoàn thành
      setTimeout(() => {
        if (elements.boardImg) {
          elements.boardImg.classList.remove("slide-in-right");
        }
      }, 300);
    }
  }, 150);
}

// Chọn bàn cờ hiện tại và lưu vào localStorage
function selectBoard() {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  // Các cặp màu được định nghĩa sẵn cho từng bàn cờ
  const boardColorPairs = [
    // Bàn cờ 1 - Xanh dương & Đỏ cổ điển
    {
      x: "linear-gradient(45deg, #2196F3, #1976D2)",
      o: "linear-gradient(45deg, #F44336, #D32F2F)",
    },
    // Bàn cờ 2 - Tím & Vàng
    {
      x: "linear-gradient(45deg, #9C27B0, #7B1FA2)",
      o: "linear-gradient(45deg, #FFC107, #FFA000)",
    },
    // Bàn cờ 3 - Xanh lá & Cam
    {
      x: "linear-gradient(45deg, #4CAF50, #388E3C)",
      o: "linear-gradient(45deg, #FF9800, #F57C00)",
    },
    // Bàn cờ 4 - Hồng & Xanh ngọc
    {
      x: "linear-gradient(45deg, #E91E63, #C2185B)",
      o: "linear-gradient(45deg, #009688, #00796B)",
    },
    // Bàn cờ 5 - Tím đậm & Hổ phách
    {
      x: "linear-gradient(45deg, #673AB7, #512DA8)",
      o: "linear-gradient(45deg, #FFC107, #FFA000)",
    },
    // Bàn cờ 6 - Chàm & Cam đậm
    {
      x: "linear-gradient(45deg, #3F51B5, #303F9F)",
      o: "linear-gradient(45deg, #FF5722, #E64A19)",
    },
    // Bàn cờ 7 - Xanh dương nhạt & Đỏ
    {
      x: "linear-gradient(45deg, #03A9F4, #0288D1)",
      o: "linear-gradient(45deg, #F44336, #D32F2F)",
    },
    // Bàn cờ 8 - Xanh lơ & Hồng
    {
      x: "linear-gradient(45deg, #00BCD4, #0097A7)",
      o: "linear-gradient(45deg, #E91E63, #C2185B)",
    },
    // Bàn cờ 9 - Xanh ngọc & Cam
    {
      x: "linear-gradient(45deg, #009688, #00796B)",
      o: "linear-gradient(45deg, #FF9800, #F57C00)",
    },
    // Bàn cờ 10 - Xanh lá & Tím
    {
      x: "linear-gradient(45deg, #4CAF50, #388E3C)",
      o: "linear-gradient(45deg, #9C27B0, #7B1FA2)",
    },
    // Bàn cờ 11 - Xanh dương & Vàng
    {
      x: "linear-gradient(45deg, #2196F3, #1976D2)",
      o: "linear-gradient(45deg, #FFEB3B, #FBC02D)",
    },
    // Bàn cờ 12 - Tím đậm & Xanh lá nhạt
    {
      x: "linear-gradient(45deg, #673AB7, #512DA8)",
      o: "linear-gradient(45deg, #8BC34A, #689F38)",
    },
    // Bàn cờ 13 - Nâu & Xanh xám
    {
      x: "linear-gradient(45deg, #795548, #5D4037)",
      o: "linear-gradient(45deg, #607D8B, #455A64)",
    },
  ];

  // Lưu bàn cờ được chọn và màu sắc được định nghĩa sẵn vào localStorage
  const selectedBoard = {
    index: window["currentBoardIndex"],
    image: window["boardImages"][window["currentBoardIndex"]],
    name: `Board ${window["currentBoardIndex"] + 1}`,
    colors: boardColorPairs[window["currentBoardIndex"]],
  };

  window["AppStorage"]?.set("selectedBoard", selectedBoard);
  console.log(
    `🎯 Đã chọn bàn cờ: ${window["currentBoardIndex"] + 1} với màu sắc - Đã lưu vào bộ nhớ`
  );

  // Điều hướng về màn hình chọn
  window["Navigation"]?.navigateTo("select");
}

// Chức năng nút quay lại
function handleBackButton() {
  if (window["playSound"]) {
    window["playSound"]("click");
  }

  window["Navigation"]?.navigateTo("select");
}

// Thiết lập tất cả các trình lắng nghe sự kiện
function setupEventListeners() {
  const elements = getElements();

  // Xóa các trình lắng nghe hiện có bằng cách sao chép phần tử (điều này xóa tất cả các trình lắng nghe sự kiện)
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

// Khởi tạo tất cả
function initializeMarketplace() {
  setupEventListeners();
  updateBoardDisplay();
  console.log("🎮 Marketplace initialized successfully");
}

// Khởi tạo khi DOM sẵn sàng
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMarketplace);
} else {
  initializeMarketplace();
}
