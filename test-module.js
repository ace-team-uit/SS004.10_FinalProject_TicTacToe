// Import module
const RoundsManager = require("./shared/logic/rounds.js");

// Test 1: Khởi tạo state mặc định
console.log("Test 1: Default initialization");
const state1 = RoundsManager.initRoundsState();
console.log(state1);

// Test 2: Khởi tạo state với tham số tùy chỉnh
console.log("\nTest 2: Custom initialization");
const state2 = RoundsManager.initRoundsState(4, "hard");
console.log(state2);

// Test 3: Player thắng vòng đầu
console.log("\nTest 3: Player wins first round");
const state3 = RoundsManager.handleRoundEnd(state2, 1);
console.log(state3.scores); // Should show player: 1, ai: 0
console.log("Game status:", state3.gameStatus); // Should still be 'playing'

// Test 4: AI thắng vòng hai
console.log("\nTest 4: AI wins second round");
const state4 = RoundsManager.handleRoundEnd(state3, 2);
console.log(state4.scores); // Should show player: 1, ai: 1
console.log("Game status:", state4.gameStatus); // Should still be 'playing'

// Test 5: Hòa vòng ba - hiển thị 4 tim
console.log("\nTest 5: Draw in third round - show 4 hearts");
const state5 = RoundsManager.handleRoundEnd(state4, 0);
console.log("Hearts:", state5.hearts); // Should be 4
console.log("Consecutive draws:", state5.consecutiveDraws); // Should be 1

// Test 6: Hòa vòng bốn - trừ 1 tim
console.log("\nTest 6: Draw in fourth round - subtract 1 heart");
const state6 = RoundsManager.handleRoundEnd(state5, 0);
console.log("Hearts:", state6.hearts); // Should be 3
console.log("Consecutive draws:", state6.consecutiveDraws); // Should be 2

// Test 7: Player thắng vòng năm (thắng 2/3)
console.log("\nTest 7: Player wins fifth round (wins 2/3)");
const state7 = RoundsManager.handleRoundEnd(state6, 1);
console.log(state7.scores); // Should show player: 2, ai: 1
console.log("Game status:", state7.gameStatus); // Should be 'player_won'
console.log("Winner:", RoundsManager.getWinner(state7)); // Should be 'player'

// Test 8: Reset state giữ nguyên điểm
console.log("\nTest 8: Reset state keeping scores");
const state8 = RoundsManager.resetState(state7);
console.log("Scores after reset:", state8.scores); // Should keep previous scores
console.log("Hearts after reset:", state8.hearts); // Should keep previous hearts

// Test 9: Thay đổi kích thước bàn
console.log("\nTest 9: Change board size");
const state9 = RoundsManager.setBoardSize(state8, 5);
console.log("New board size:", state9.boardSize); // Should be 5

// Test 10: Thay đổi độ khó
console.log("\nTest 10: Change difficulty");
const state10 = RoundsManager.setDifficulty(state9, "easy");
console.log("New difficulty:", state10.difficulty); // Should be 'easy'

// Test 11: Reset toàn bộ game
console.log("\nTest 11: Full game reset");
const state11 = RoundsManager.resetGame(state10);
console.log("State after full reset:", state11); // Should be fresh state with same board size and difficulty
