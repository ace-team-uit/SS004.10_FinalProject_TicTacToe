/**
 * Unit Tests cho Audio Manager
 * Chạy với Node.js hoặc browser
 */

// Mock Audio API cho testing
class MockAudio {
  constructor() {
    this.src = "";
    this.volume = 1.0;
    this.loop = false;
    this.preload = "auto";
    this.currentTime = 0;
    this.paused = true;
    this.onload = null;
    this.onerror = null;
    this.onended = null;
  }

  load() {
    return Promise.resolve();
  }

  play() {
    this.paused = false;
    return Promise.resolve();
  }

  pause() {
    this.paused = true;
  }

  cloneNode() {
    const clone = new MockAudio();
    clone.src = this.src;
    clone.volume = this.volume;
    clone.loop = this.loop;
    return clone;
  }
}

// Mock AudioContext
class MockAudioContext {
  constructor() {
    this.state = "running";
  }

  close() {
    this.state = "closed";
  }
}

// Setup mocks
if (typeof window === "undefined") {
  // Node.js environment
  global.Audio = MockAudio;
  global.AudioContext = MockAudioContext;
  global.webkitAudioContext = MockAudioContext;
} else {
  // Browser environment - override existing Audio
  window.Audio = MockAudio;
  window.AudioContext = MockAudioContext;
  window.webkitAudioContext = MockAudioContext;
}

// Test suite
function runAudioTests() {
  console.log("🧪 Running Audio Manager Tests...");

  let testsPassed = 0;
  let testsFailed = 0;

  function test(name, testFn) {
    try {
      testFn();
      console.log(`✅ ${name}`);
      testsPassed++;
    } catch (error) {
      console.error(`❌ ${name}: ${error.message}`);
      testsFailed++;
    }
  }

  function assert(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  function assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(`${message}: expected ${expected}, got ${actual}`);
    }
  }

  // Test 1: AudioManager constructor
  test("AudioManager constructor initializes correctly", () => {
    const manager = new AudioManager();
    assert(manager.sounds instanceof Map, "sounds should be a Map");
    assert(manager.bgm instanceof Map, "bgm should be a Map");
    assert(manager.isMuted === false, "should not be muted initially");
    assert(manager.volume === 1.0, "volume should be 1.0 initially");
    assert(manager.bgmVolume === 0.7, "bgmVolume should be 0.7 initially");
  });

  // Test 2: Sound mapping
  test("Sound mapping contains expected sounds", () => {
    const manager = new AudioManager();
    assert(manager.soundMap.click, "click sound should be mapped");
    assert(manager.soundMap.win, "win sound should be mapped");
    assert(manager.soundMap.lose, "lose sound should be mapped");
    assert(manager.soundMap.draw, "draw sound should be mapped");
  });

  // Test 3: BGM mapping
  test("BGM mapping contains expected BGM", () => {
    const manager = new AudioManager();
    assert(manager.bgmMap["bgm-home"], "bgm-home should be mapped");
    assert(manager.bgmMap["bgm-game"], "bgm-game should be mapped");
    assert(manager.bgmMap["bgm-select"], "bgm-select should be mapped");
  });

  // Test 4: Volume control
  test("Volume control works correctly", () => {
    const manager = new AudioManager();
    manager.setVolume(0.5);
    assertEqual(manager.volume, 0.5, "volume should be set to 0.5");

    manager.setVolume(2.0); // Should clamp to 1.0
    assertEqual(manager.volume, 1.0, "volume should clamp to 1.0");

    manager.setVolume(-1.0); // Should clamp to 0.0
    assertEqual(manager.volume, 0.0, "volume should clamp to 0.0");
  });

  // Test 5: BGM volume control
  test("BGM volume control works correctly", () => {
    const manager = new AudioManager();
    manager.setBgmVolume(0.3);
    assertEqual(manager.bgmVolume, 0.3, "bgmVolume should be set to 0.3");
  });

  // Test 6: Mute functionality
  test("Mute functionality works correctly", () => {
    const manager = new AudioManager();
    assert(manager.isMuted === false, "should not be muted initially");

    const muted = manager.toggleMute();
    assert(muted === true, "should be muted after toggle");
    assert(manager.isMuted === true, "isMuted should be true");

    const unmuted = manager.toggleMute();
    assert(unmuted === false, "should not be muted after second toggle");
    assert(manager.isMuted === false, "isMuted should be false");
  });

  // Test 7: Status reporting
  test("Status reporting works correctly", () => {
    const manager = new AudioManager();
    const status = manager.getStatus();

    assert(typeof status === "object", "status should be an object");
    assert(status.isMuted === false, "status should report correct mute state");
    assert(status.volume === 1.0, "status should report correct volume");
    assert(status.bgmVolume === 0.7, "status should report correct bgmVolume");
    assert(status.soundsLoaded === 0, "status should report correct sounds count");
    assert(status.bgmLoaded === 0, "status should report correct BGM count");
  });

  // Test 8: Error handling for missing sounds
  test("Error handling for missing sounds", () => {
    const manager = new AudioManager();
    // Should not throw error when playing non-existent sound
    manager.playSound("non-existent");
    // Should log warning (tested via console output)
  });

  // Test 9: BGM stop functionality
  test("BGM stop functionality works", () => {
    const manager = new AudioManager();
    manager.stopBgm(); // Should not throw error
    assert(manager.currentBgm === null, "currentBgm should be null after stop");
  });

  // Test 10: Cleanup functionality
  test("Cleanup functionality works", () => {
    const manager = new AudioManager();
    manager.destroy(); // Should not throw error
    assert(manager.sounds.size === 0, "sounds should be cleared after destroy");
    assert(manager.bgm.size === 0, "bgm should be cleared after destroy");
  });

  // Test results
  console.log(`\n📊 Test Results: ${testsPassed} passed, ${testsFailed} failed`);

  if (testsFailed === 0) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("⚠️ Some tests failed. Please check the implementation.");
  }

  return { passed: testsPassed, failed: testsFailed };
}

// Auto-run tests nếu được gọi trực tiếp
if (typeof window !== "undefined") {
  // Browser environment
  window.runAudioTests = runAudioTests;

  // Auto-run khi page load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runAudioTests);
  } else {
    runAudioTests();
  }
} else {
  // Node.js environment
  module.exports = { runAudioTests };

  // Auto-run nếu file được execute trực tiếp
  if (require.main === module) {
    runAudioTests();
  }
}
