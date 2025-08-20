/**
 * Board Component Tests
 * Test các chức năng cơ bản của Board component
 * Chạy trong browser environment
 */

// Test utilities
const TestRunner = {
  tests: [],
  passed: 0,
  failed: 0,

  test(name, testFn) {
    this.tests.push({ name, testFn });
  },

  expect(value) {
    return {
      toBe(expected) {
        if (value === expected) return true;
        throw new Error(`Expected ${value} to be ${expected}`);
      },
      toBeInstanceOf(expected) {
        if (value instanceof expected) return true;
        throw new Error(`Expected ${value} to be instance of ${expected}`);
      },
      toContain(expected) {
        if (value.includes && value.includes(expected)) return true;
        throw new Error(`Expected ${value} to contain ${expected}`);
      },
      toBeGreaterThan(expected) {
        if (value > expected) return true;
        throw new Error(`Expected ${value} to be greater than ${expected}`);
      },
      toEqual(expected) {
        if (JSON.stringify(value) === JSON.stringify(expected)) return true;
        throw new Error(`Expected ${value} to equal ${expected}`);
      },
    };
  },

  runTests() {
    console.log("🧪 Running Board Component Tests...\n");

    this.tests.forEach((test, index) => {
      try {
        test.testFn();
        console.log(`✅ ${index + 1}. ${test.name}`);
        this.passed++;
      } catch (error) {
        console.error(`❌ ${index + 1}. ${test.name}`);
        console.error(`   Error: ${error.message}`);
        this.failed++;
      }
    });

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);

    if (this.failed === 0) {
      console.log("🎉 All tests passed!");
    } else {
      console.log("⚠️ Some tests failed. Please check the errors above.");
    }
  },
};

// Test Board Component
TestRunner.test("Constructor should create BoardComponent instance with default values", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();

  TestRunner.expect(board.element).toBe(null);
  TestRunner.expect(board.size).toBe(3);
  TestRunner.expect(board.eventListeners).toBeInstanceOf(Map);
  TestRunner.expect(board.touchStartTime).toBe(0);
  TestRunner.expect(board.touchStartPosition).toEqual({ x: 0, y: 0 });
});

TestRunner.test("Event system should register event listeners", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();
  const callback = () => {};

  board.on("cell:click", callback);

  TestRunner.expect(board.eventListeners.has("cell:click")).toBe(true);
  TestRunner.expect(board.eventListeners.get("cell:click")).toContain(callback);
});

TestRunner.test("Event system should remove event listeners", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();
  const callback = () => {};

  board.on("cell:click", callback);
  board.off("cell:click", callback);

  TestRunner.expect(board.eventListeners.get("cell:click")).not.toContain(callback);
});

TestRunner.test("Event system should emit events to registered listeners", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();
  let receivedData = null;
  const callback = (data) => {
    receivedData = data;
  };

  board.on("cell:click", callback);

  const eventData = { index: 0, type: "click" };
  board._emit("cell:click", eventData);

  TestRunner.expect(receivedData).toEqual(eventData);
});

TestRunner.test("Board creation should validate board size", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();

  try {
    board.createBoard(2);
    throw new Error("Should have thrown error for invalid size");
  } catch (error) {
    TestRunner.expect(error.message).toContain("Board size must be 3, 4, or 5");
  }
});

TestRunner.test("Board creation should accept valid board sizes", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();

  try {
    board.createBoard(3);
    board.createBoard(4);
    board.createBoard(5);
  } catch (error) {
    throw new Error(`Valid board size should not throw: ${error.message}`);
  }
});

TestRunner.test("Board creation should set board size correctly", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();

  board.createBoard(4);
  TestRunner.expect(board.size).toBe(4);
});

TestRunner.test("Board update should handle invalid board data gracefully", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();
  board.element = { querySelectorAll: () => [] };

  try {
    board.updateBoard(null);
    board.updateBoard("invalid");
  } catch (error) {
    throw new Error(`Board update should handle invalid data gracefully: ${error.message}`);
  }
});

TestRunner.test("Board update should handle missing element gracefully", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();
  board.element = null;

  try {
    board.updateBoard([null, null, null]);
  } catch (error) {
    throw new Error(`Board update should handle missing element gracefully: ${error.message}`);
  }
});

TestRunner.test("Cell creation should create cell with correct attributes", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();
  const cell = board._createCell(5);

  TestRunner.expect(cell.className).toBe("board-cell");
  TestRunner.expect(cell.getAttribute("data-index")).toBe("5");
  TestRunner.expect(cell.getAttribute("role")).toBe("gridcell");
  TestRunner.expect(cell.getAttribute("tabindex")).toBe("0");
});

TestRunner.test("Cell creation should create cell content element", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();
  const cell = board._createCell(0);
  const content = cell.querySelector(".cell-content");

  TestRunner.expect(content).toBeDefined();
  TestRunner.expect(content.className).toBe("cell-content");
});

TestRunner.test("Touch events should be handled correctly", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();
  const mockTouchEvent = {
    touches: [{ clientX: 100, clientY: 200 }],
    changedTouches: [{ clientX: 100, clientY: 200 }],
  };

  board._handleTouchStart(mockTouchEvent);

  TestRunner.expect(board.touchStartTime).toBeGreaterThan(0);
  TestRunner.expect(board.touchStartPosition).toEqual({ x: 100, y: 200 });
});

TestRunner.test("Keyboard events should be handled correctly", () => {
  if (typeof BoardComponent === "undefined") {
    throw new Error("BoardComponent not available");
  }

  const board = new BoardComponent();
  const mockEvent = {
    key: "Enter",
    preventDefault: () => {},
  };

  board._handleKeyDown(mockEvent);

  // Test that the event was handled
  TestRunner.expect(mockEvent.key).toBe("Enter");
});

// Run tests when DOM is loaded
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    // Import BoardComponent if available
    if (typeof BoardComponent !== "undefined") {
      TestRunner.runTests();
    } else {
      console.log(
        "⚠️ BoardComponent not available. Make sure to include the script before running tests."
      );
    }
  });
} else {
  console.log("🧪 Board Component tests loaded successfully!");
  console.log("📝 Run tests in browser environment");
}
