/**
 * Rounds Management Module
 * Quản lý vòng đấu, điểm số và trái tim trong game Tic Tac Toe
 * Hỗ trợ cơ chế thắng 2/3 vòng và hệ thống trái tim khi hòa
 */

const RoundsManager = {
  /**
   * Khởi tạo trạng thái vòng đấu mới
   * @param {number} boardSize - Kích thước bàn (3, 4, hoặc 5)
   * @param {string} difficulty - Độ khó ('easy', 'medium', 'hard')
   * @returns {Object} State mẫu cho vòng đấu
   */
  initRoundsState(boardSize = 3, difficulty = "medium") {
    if (![3, 4, 5].includes(boardSize)) {
      throw new Error("Board size must be 3, 4, or 5");
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
      throw new Error("Difficulty must be 'easy', 'medium', or 'hard'");
    }

    return {
      boardSize: boardSize,
      difficulty: difficulty,
      currentRound: 1,
      maxRounds: 3,
      scores: { player: 0, ai: 0 },
      hearts: 4, // Số trái tim ban đầu
      maxHearts: 4, // Số trái tim tối đa
      roundHistory: [], // Lịch sử các vòng đã chơi
      gameStatus: "playing", // 'playing', 'player_won', 'ai_won', 'draw'
      consecutiveDraws: 0, // Số lần hòa liên tiếp
    };
  },

  /**
   * Xử lý khi kết thúc một vòng
   * @param {Object} roundsState - Trạng thái vòng đấu hiện tại
   * @param {number} winner - Người thắng (1 = player, 2 = ai, 0 = hòa)
   * @returns {Object} State mới sau khi xử lý vòng
   */
  handleRoundEnd(roundsState, winner) {
    if (!roundsState || typeof winner !== "number") {
      throw new Error("Invalid parameters provided");
    }

    const newState = { ...roundsState };
    const roundResult = {
      round: newState.currentRound,
      winner: winner,
      timestamp: Date.now(),
    };

    // Thêm kết quả vòng vào lịch sử
    newState.roundHistory.push(roundResult);

    if (winner === 0) {
      // Hòa - xử lý trái tim
      newState.consecutiveDraws += 1;

      if (newState.consecutiveDraws === 1) {
        // Lần hòa đầu tiên: hiển thị 4 tim
        newState.hearts = newState.maxHearts;
      } else {
        // Các lần hòa tiếp theo: trừ 1 tim
        newState.hearts = Math.max(0, newState.hearts - 1);
      }
    } else {
      // Có người thắng - reset số lần hòa liên tiếp
      newState.consecutiveDraws = 0;

      // Cập nhật điểm số
      if (winner === 1) {
        newState.scores.player += 1;
      } else if (winner === 2) {
        newState.scores.ai += 1;
      }
    }

    // Tăng số vòng đã chơi
    newState.currentRound += 1;

    // Kiểm tra xem có ai thắng loạt trận không (2/3)
    if (newState.scores.player >= 2) {
      newState.gameStatus = "player_won";
    } else if (newState.scores.ai >= 2) {
      newState.gameStatus = "ai_won";
    } else if (newState.currentRound > newState.maxRounds) {
      // Hết vòng nhưng chưa ai thắng 2/3
      if (newState.scores.player > newState.scores.ai) {
        newState.gameStatus = "player_won";
      } else if (newState.scores.ai > newState.scores.player) {
        newState.gameStatus = "ai_won";
      } else {
        newState.gameStatus = "draw";
      }
    }

    return newState;
  },

  /**
   * Đặt lại trạng thái cho vòng tiếp theo (giữ nguyên điểm và tim)
   * @param {Object} roundsState - Trạng thái vòng đấu hiện tại
   * @returns {Object} State mới với bàn cờ trống nhưng giữ điểm và tim
   */
  resetState(roundsState) {
    if (!roundsState) {
      throw new Error("Invalid rounds state provided");
    }

    // Giữ nguyên điểm số, tim, và lịch sử vòng
    return {
      ...roundsState,
      // Không reset scores, hearts, roundHistory
      // currentRound sẽ được giữ nguyên để tiếp tục vòng tiếp theo
    };
  },

  /**
   * Thay đổi kích thước bàn
   * @param {Object} roundsState - Trạng thái vòng đấu hiện tại
   * @param {number} newSize - Kích thước bàn mới (3, 4, hoặc 5)
   * @returns {Object} State mới với kích thước bàn đã thay đổi
   */
  setBoardSize(roundsState, newSize) {
    if (!roundsState) {
      throw new Error("Invalid rounds state provided");
    }

    if (![3, 4, 5].includes(newSize)) {
      throw new Error("Board size must be 3, 4, or 5");
    }

    return {
      ...roundsState,
      boardSize: newSize,
    };
  },

  /**
   * Thay đổi độ khó
   * @param {Object} roundsState - Trạng thái vòng đấu hiện tại
   * @param {string} newDifficulty - Độ khó mới ('easy', 'medium', 'hard')
   * @returns {Object} State mới với độ khó đã thay đổi
   */
  setDifficulty(roundsState, newDifficulty) {
    if (!roundsState) {
      throw new Error("Invalid rounds state provided");
    }

    if (!["easy", "medium", "hard"].includes(newDifficulty)) {
      throw new Error("Difficulty must be 'easy', 'medium', or 'hard'");
    }

    return {
      ...roundsState,
      difficulty: newDifficulty,
    };
  },

  /**
   * Lấy thông tin trạng thái hiện tại
   * @param {Object} roundsState - Trạng thái vòng đấu
   * @returns {Object} Thông tin trạng thái hiện tại
   */
  getCurrentStatus(roundsState) {
    if (!roundsState) {
      throw new Error("Invalid rounds state provided");
    }

    return {
      currentRound: roundsState.currentRound,
      maxRounds: roundsState.maxRounds,
      scores: { ...roundsState.scores },
      hearts: roundsState.hearts,
      maxHearts: roundsState.maxHearts,
      gameStatus: roundsState.gameStatus,
      consecutiveDraws: roundsState.consecutiveDraws,
      difficulty: roundsState.difficulty,
      boardSize: roundsState.boardSize,
    };
  },

  /**
   * Kiểm tra xem game đã kết thúc chưa
   * @param {Object} roundsState - Trạng thái vòng đấu
   * @returns {boolean} True nếu game đã kết thúc
   */
  isGameOver(roundsState) {
    if (!roundsState) {
      return false;
    }

    return roundsState.gameStatus !== "playing";
  },

  /**
   * Lấy người thắng cuộc
   * @param {Object} roundsState - Trạng thái vòng đấu
   * @returns {string|null} 'player', 'ai', 'draw', hoặc null nếu chưa kết thúc
   */
  getWinner(roundsState) {
    if (!roundsState) {
      return null;
    }

    switch (roundsState.gameStatus) {
      case "player_won":
        return "player";
      case "ai_won":
        return "ai";
      case "draw":
        return "draw";
      default:
        return null;
    }
  },

  /**
   * Reset toàn bộ game về trạng thái ban đầu
   * @param {Object} roundsState - Trạng thái vòng đấu hiện tại
   * @returns {Object} State mới với tất cả đã reset
   */
  resetGame(roundsState) {
    if (!roundsState) {
      throw new Error("Invalid rounds state provided");
    }

    return this.initRoundsState(roundsState.boardSize, roundsState.difficulty);
  },
};

// Export module
if (typeof module !== "undefined" && module.exports) {
  module.exports = RoundsManager;
} else if (typeof window !== "undefined") {
  window.RoundsManager = RoundsManager;
}
