/**
 * Logic Module Index
 * Export tất cả các module logic để sử dụng trong game
 */

// Load other modules as global objects for browser compatibility
if (typeof window !== "undefined") {
  // Load BoardManager if not already loaded
  if (!window.BoardManager) {
    const script = document.createElement("script");
    script.src = "./shared/logic/board.js";
    document.head.appendChild(script);
  }

  // Load RoundsManager if not already loaded
  if (!window.RoundsManager) {
    const script = document.createElement("script");
    script.src = "./shared/logic/rounds.js";
    document.head.appendChild(script);
  }

  // Load other modules as global objects
  if (!window.TTT_AI) {
    const script = document.createElement("script");
    script.src = "./shared/logic/ai.js";
    document.head.appendChild(script);
  }

  if (!window.Navigation) {
    const script = document.createElement("script");
    script.src = "./shared/logic/navigation.js";
    document.head.appendChild(script);
  }

  if (!window.Timer) {
    const script = document.createElement("script");
    script.src = "./shared/logic/timer.js";
    document.head.appendChild(script);
  }

  // Load GameHUD if not already loaded
  if (!(/** @type {any} */ (window).GameHUD)) {
    const script = document.createElement("script");
    script.src = "../../ui/header.js";
    script.onload = () => console.log("✅ GameHUD script loaded successfully");
    script.onerror = () => console.error("❌ Failed to load GameHUD script");
    document.head.appendChild(script);
  }
}
