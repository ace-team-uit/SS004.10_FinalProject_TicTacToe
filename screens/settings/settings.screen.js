// Wrap toàn bộ code trong IIFE để tránh global scope pollution
(function () {
  console.log("⚙️ Màn hình Cài đặt đã được tải");

  // Trạng thái cài đặt hiện tại
  let currentSettings = {};

  // Tải cài đặt từ bộ nhớ lưu trữ
  function loadSettings() {
    // Lấy cài đặt hiện tại từ AppStorage (nếu có)
    if (window["AppStorage"]) {
      currentSettings = window["AppStorage"].loadSettings();
      console.log("📱 Đã tải cài đặt:", currentSettings);
    } else {
      console.warn("⚠️ AppStorage không khả dụng, sử dụng giá trị mặc định");
      currentSettings = {
        gameMusicEnabled: true,
        gameSoundEnabled: true,
        gameTheme: "dark",
        gameLanguage: "en",
      };
    }

    // Áp dụng cài đặt BGM (nhạc nền) cho AudioManager
    if (currentSettings.gameMusicEnabled) {
      // Nếu bật BGM → phát nhạc của màn hình hiện tại
      if (window["playBgm"]) {
        window["playBgm"]("bgm-settings");
        console.log("🎵 Nhạc nền khởi tạo: đang phát bgm-settings");
      }
    } else {
      // Nếu tắt BGM → dừng nhạc nền
      if (window["audioManager"]) {
        window["audioManager"].stopBgm();
        console.log("🎵 Nhạc nền khởi tạo: đã tắt");
      }
    }
  }

  // Cập nhật giao diện toggle nhạc nền
  function updateMusicToggle() {
    const musicToggleIcon = document.getElementById("music-toggle-icon");

    if (musicToggleIcon && musicToggleIcon instanceof HTMLImageElement) {
      const isEnabled = currentSettings.gameMusicEnabled;

      if (isEnabled) {
        musicToggleIcon.src = "../../assets/images/icons/on-icon.png";
      } else {
        musicToggleIcon.src = "../../assets/images/icons/off-icon.png";
      }
    }
  }

  // Chức năng bật/tắt nhạc nền
  function toggleMusic() {
    if (window["playSound"]) {
      window["playSound"]("click");
    }

    console.log(
      "Người dùng bấm toggle nhạc nền, trạng thái hiện tại:",
      currentSettings.gameMusicEnabled
    );
    currentSettings.gameMusicEnabled = !currentSettings.gameMusicEnabled;
    console.log("Trạng thái mới của nhạc nền:", currentSettings.gameMusicEnabled);

    // Lưu thay đổi vào bộ nhớ
    if (window["AppStorage"]) {
      window["AppStorage"].saveSettings({
        gameMusicEnabled: currentSettings.gameMusicEnabled,
      });
      console.log("💾 Đã lưu cài đặt nhạc nền:", currentSettings.gameMusicEnabled);
    }

    // Xử lý bật/tắt nhạc nền thực tế
    if (currentSettings.gameMusicEnabled) {
      if (window["playBgm"]) {
        const currentRoute = window["Navigation"]?.getCurrentRoute();
        let bgmType = "bgm-settings"; // mặc định cho màn hình cài đặt

        if (currentRoute === "home") bgmType = "bgm-home";
        else if (currentRoute === "select") bgmType = "bgm-select";
        else if (currentRoute === "game") bgmType = "bgm-game";
        else if (currentRoute === "settings") bgmType = "bgm-settings";

        window["playBgm"](bgmType);
        console.log(`🎵 Đã bật nhạc nền - đang phát ${bgmType}`);
      }
    } else {
      if (window["audioManager"]) {
        window["audioManager"].stopBgm();
        console.log("🎵 Đã tắt nhạc nền - dừng phát");
      }
    }

    // Cập nhật giao diện
    updateMusicToggle();
  }

  // Hiển thị popup thông tin
  function showInfoPopup(title, content) {
    if (window["playSound"]) {
      window["playSound"]("click");
    }

    const popupOverlay = document.createElement("div");
    popupOverlay.className = "popup-overlay";
    popupOverlay.innerHTML = `
    <div class="popup" style="position: relative; max-height: 80vh; width: 90%; max-width: 375px; border-radius: var(--radius-lg); display: flex; flex-direction: column; overflow: hidden;">
      
      <!-- Header -->
      <h3 style="color: var(--text-primary); margin: var(--space-4); text-align: center; font-family: var(--font-display); flex-shrink: 0;">
        ${title}
      </h3>
      
      <!-- Body (scrollable) -->
      <div style="color: var(--text-secondary); line-height: 1.6; flex-grow: 1; overflow-y: auto; padding-right: var(--space-2);">
        ${content}
      </div>
      
      <!-- Footer -->
      <div style="padding: var(--space-4); padding-bottom: 0; flex-shrink: 0; text-align: center; border-top: 1px solid var(--border-color);">
        <button id="close-popup" class="btn btn-primary" style="width: 80%;">Close</button>
      </div>
    </div>
  `;

    document.body.appendChild(popupOverlay);

    const closeBtn = document.getElementById("close-popup");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        document.body.removeChild(popupOverlay);
        if (window["playSound"]) {
          window["playSound"]("click");
        }
      });
    }

    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        document.body.removeChild(popupOverlay);
      }
    });
  }

  // Điều hướng quay lại màn hình trước đó (smart navigation)
  function navigateBack() {
    console.log("🔙 Người dùng bấm nút Quay lại");

    if (window["playSound"]) {
      window["playSound"]("click");
    }

    if (window["Navigation"]) {
      console.log("🔙 Đang điều hướng về màn hình trước đó");
      window["Navigation"].navigateBack();
    } else {
      console.warn("⚠️ Navigation không khả dụng");
    }
  }

  // Lấy các phần tử DOM cần thiết
  function getElements() {
    return {
      musicToggle: document.getElementById("music-toggle"),
      musicToggleIcon: document.getElementById("music-toggle-icon"),
      backBtn: document.getElementById("back-btn"),
      termsBtn: document.getElementById("terms-privacy-btn"),
      supportBtn: document.getElementById("support-btn"),
      aboutBtn: document.getElementById("about-us-btn"),
    };
  }

  // Thiết lập tất cả các sự kiện lắng nghe
  function setupEventListeners() {
    const elements = getElements();

    // Nút toggle nhạc nền
    if (elements.musicToggle && elements.musicToggle.parentNode) {
      const newMusicToggle = elements.musicToggle.cloneNode(true);
      elements.musicToggle.parentNode.replaceChild(newMusicToggle, elements.musicToggle);
      newMusicToggle.addEventListener("click", toggleMusic);
    }

    // Nút quay lại
    if (elements.backBtn && elements.backBtn.parentNode) {
      console.log("🔙 Thiết lập sự kiện cho nút Quay lại");
      const newBackBtn = elements.backBtn.cloneNode(true);
      elements.backBtn.parentNode.replaceChild(newBackBtn, elements.backBtn);
      newBackBtn.addEventListener("click", navigateBack);
    } else {
      console.warn("⚠️ Không tìm thấy nút Quay lại hoặc không có parent node");
    }

    // Nút Terms & Privacy
    if (elements.termsBtn && elements.termsBtn.parentNode) {
      const newTermsBtn = elements.termsBtn.cloneNode(true);
      elements.termsBtn.parentNode.replaceChild(newTermsBtn, elements.termsBtn);
      newTermsBtn.addEventListener("click", () => {
        console.log("Terms & Privacy button clicked");
        showInfoPopup(
          "Terms & Privacy",
          "This game is developed primarily for educational and non-commercial purposes. We highly respect your privacy: no personal data is collected, stored, or shared. By continuing to use this game, you confirm that you understand and agree to our basic terms of service and privacy commitments."
        );
      });
    }

    // Nút Support
    if (elements.supportBtn && elements.supportBtn.parentNode) {
      const newSupportBtn = elements.supportBtn.cloneNode(true);
      elements.supportBtn.parentNode.replaceChild(newSupportBtn, elements.supportBtn);
      newSupportBtn.addEventListener("click", () => {
        console.log("Support button clicked");
        showInfoPopup(
          "Support - How to Play",
          "🎮 Game Rules:<br/>• The objective is to align three marks in a row, column, or diagonal to win.<br/>• Play against AI with multiple difficulty levels to test your skills.<br/>• Choose between different board sizes: 3x3, 4x4, or 5x5.<br/>• Matches follow a best-of-three format — first to 2 victories wins.<br/><br/>⚙️ Additional Features:<br/>• Audio: Toggle music and sound effects.<br/>• Theme: Customize your experience in the MarketPlace.<br/>• Progress is saved automatically for seamless play."
        );
      });
    }

    // Nút About Us
    if (elements.aboutBtn && elements.aboutBtn.parentNode) {
      const newAboutBtn = elements.aboutBtn.cloneNode(true);
      elements.aboutBtn.parentNode.replaceChild(newAboutBtn, elements.aboutBtn);
      newAboutBtn.addEventListener("click", () => {
        console.log("About Us button clicked");
        showInfoPopup(
          "About Us - ACE Team",
          "👥 ACE Team Members:<br/>• Đặng Chí Thanh (25730067)<br/>• Đào Vĩnh Bảo Phúc (25730053)<br/>• Phạm Lê Yến Nhi (25730049)<br/>• Tăng Phước Thịnh (25730071)<br/>• Hoàng Cao Sơn (25730061)<br/><br/>🎓 UIT - University of Information Technology<br/>📚 Final Project - SS004.10 Professional Skills<br/>💻 Built using HTML, CSS, and JavaScript with focus on clean design and user experience."
        );
      });
    }
  }

  // Khởi tạo màn hình cài đặt
  function initializeSettingsScreen() {
    setupEventListeners();
    loadSettings();
    updateMusicToggle();
    console.log("⚙️ Khởi tạo màn hình Cài đặt thành công");
  }

  // Khởi tạo khi DOM đã sẵn sàng
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSettingsScreen);
  } else {
    initializeSettingsScreen();
  }

  // Xuất hàm để có thể gọi từ bên ngoài
  window["SettingsManager"] = {
    initializeSettings: initializeSettingsScreen,
    toggleMusic,
    navigateBack,
    getCurrentSettings: () => currentSettings,
  };
})(); // Đóng IIFE
