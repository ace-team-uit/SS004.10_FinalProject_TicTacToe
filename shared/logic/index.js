/**
 * Logic Module Index
 * Export tất cả các module logic để sử dụng trong game
 */

// Export BoardManager
export { default as BoardManager } from "./board.js";

// Load other modules as global objects for browser compatibility
if (typeof window !== "undefined") {
  // Load BoardManager if not already loaded
  if (!window.BoardManager) {
    const script = document.createElement("script");
    script.src = "./shared/logic/board.js";
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
}
