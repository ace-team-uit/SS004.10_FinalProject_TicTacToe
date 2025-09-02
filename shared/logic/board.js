/**
 * Board Management Module (board.js)
 * Quản lý trạng thái bàn cờ và logic game Tic Tac Toe.
 * Hoạt động độc lập, không phụ thuộc vào DOM.
 */

const BoardManager = {
  /**
   * Khởi tạo trạng thái game mới
   * @param {number} size - Kích thước bàn (3, 4, hoặc 5)
   * @param {number} [winLength] - Số ô liên tiếp để thắng (mặc định = size)
   * @returns {Object} State mẫu với đầy đủ thông tin game
   */
  initState (size = 3, winLength) {
    if (![3, 4, 5].includes(size)) {
      throw new Error("Size must be 3, 4, or 5");
    }

    const boardSize = size * size;
    const finalWinLength = winLength || size;

    return {
      board: new Array(boardSize).fill(null),
      size: size,
      winLength: finalWinLength,
      currentPlayer: 1, // 1 = X (người chơi), 2 = O (AI)
      scores: { player: 0, ai: 0 },
      gameStatus: "playing", // 'playing', 'won', 'draw'
      lastMove: null,
      winningLine: null,
    };
  },

  /**
   * Xử lý nước đi của người chơi
   * @param {Object} state - Trạng thái game hiện tại
   * @param {number} index - Index của ô được chọn (0-based)
   * @returns {Object} State mới sau khi thực hiện nước đi
   */
  makeMove (state, index) {
    // Validate
    if (
      !state ||
      state.board[index] !== null ||
      state.gameStatus !== "playing"
    ) {
      console.warn("Invalid move attempted.");
      return state; // Trả về state cũ nếu nước đi không hợp lệ
    }

    // Tạo state mới (immutable)
    const newState = {
      ...state,
      board: [...state.board],
      lastMove: index,
    };

    // Đánh dấu ô
    newState.board[index] = state.currentPlayer;

    // Kiểm tra người thắng
    const winnerResult = this.checkWinner(newState);
    if (winnerResult) {
      newState.gameStatus = "won";
      newState.winningLine = winnerResult.winningLine;
      newState.scores = this._updateScores(state.scores, winnerResult.winner);
      return newState;
    }

    // Kiểm tra bàn đầy (hòa)
    if (this.isBoardFull(newState)) {
      newState.gameStatus = "draw";
      return newState;
    }

    // Đổi lượt chơi
    newState.currentPlayer = this.switchPlayer(state.currentPlayer);

    return newState;
  },

  /**
   * Kiểm tra người thắng
   * @param {Object} state - Trạng thái game
   * @returns {Object|null} Thông tin người thắng hoặc null
   */
  checkWinner (state) {
    const { board, size } = state;
    // Helper kiểm tra 1 dòng với các luật đặc biệt
    function checkLineSpecial (getCell, length, size) {
      let count = 0;
      let last = null;
      let block = 0;
      for (let i = 0; i < length; i++) {
        const cell = getCell(i);
        if (cell === last && cell !== null) {
          count++;
        } else {
          count = 1;
          last = cell;
        }
        if (cell === null) block++;
        // 3x3: 3 liên tiếp là thắng
        if (size === 3 && count === 3 && last !== null) return { winner: last, length: 3 };
        // 4x4, 5x5: 4 liên tiếp chỉ thắng nếu không có block (không có ô trống)
        if ((size === 4 || size === 5) && count === 4 && block === 0 && last !== null) return { winner: last, length: 4 };
        // 4x4, 5x5: 5 liên tiếp thắng nếu có tối đa 1 block
        if ((size === 4 || size === 5) && count === 5 && block <= 1 && last !== null) return { winner: last, length: 5 };
      }
      return null;
    }

    // Hàng ngang
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - 3; col++) {
        const maxLen = size - col;
        for (let len = 3; len <= Math.min(5, maxLen); len++) {
          const getCell = (i) => board[row * size + col + i];
          const result = checkLineSpecial(getCell, len, size);
          if (result) {
            return {
              winner: result.winner,
              winningLine: this._getWinningLineIndices(row, col, result.length, size, "horizontal"),
            };
          }
        }
      }
    }
    // Hàng dọc
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - 3; row++) {
        const maxLen = size - row;
        for (let len = 3; len <= Math.min(5, maxLen); len++) {
          const getCell = (i) => board[(row + i) * size + col];
          const result = checkLineSpecial(getCell, len, size);
          if (result) {
            return {
              winner: result.winner,
              winningLine: this._getWinningLineIndices(row, col, result.length, size, "vertical"),
            };
          }
        }
      }
    }
    // Đường chéo chính
    for (let row = 0; row <= size - 3; row++) {
      for (let col = 0; col <= size - 3; col++) {
        const maxLen = Math.min(size - row, size - col);
        for (let len = 3; len <= Math.min(5, maxLen); len++) {
          const getCell = (i) => board[(row + i) * size + (col + i)];
          const result = checkLineSpecial(getCell, len, size);
          if (result) {
            return {
              winner: result.winner,
              winningLine: this._getWinningLineIndices(row, col, result.length, size, "diagonal-main"),
            };
          }
        }
      }
    }
    // Đường chéo phụ
    for (let row = 0; row <= size - 3; row++) {
      for (let col = 2; col < size; col++) {
        const maxLen = Math.min(size - row, col + 1);
        for (let len = 3; len <= Math.min(5, maxLen); len++) {
          const getCell = (i) => board[(row + i) * size + (col - i)];
          const result = checkLineSpecial(getCell, len, size);
          if (result) {
            return {
              winner: result.winner,
              winningLine: this._getWinningLineIndices(row, col, result.length, size, "diagonal-anti"),
            };
          }
        }
      }
    }
    return null;
  },

  /**
   * Kiểm tra bàn cờ đã đầy chưa
   * @param {Object} state - Trạng thái game
   * @returns {boolean} True nếu bàn đầy
   */
  isBoardFull (state) {
    return state.board.every((cell) => cell !== null);
  },

  /**
   * Đổi lượt chơi
   * @param {number} currentPlayer - Người chơi hiện tại
   * @returns {number} Người chơi tiếp theo
   */
  switchPlayer (currentPlayer) {
    return currentPlayer === 1 ? 2 : 1;
  },

  /**
   * Đặt lại trạng thái game cho vòng mới, giữ nguyên điểm số và cài đặt
   * @param {Object} state - Trạng thái game hiện tại
   * @returns {Object} State mới với bàn cờ trống
   */
  resetForNewRound (state) {
    return {
      ...state,
      board: new Array(state.size * state.size).fill(null),
      currentPlayer: 1, // Người chơi luôn đi trước ở vòng mới
      gameStatus: "playing",
      lastMove: null,
      winningLine: null,
    };
  },

  // ===== PRIVATE METHODS =====

  _isWinningLine (line) {
    if (line[0] === null) return false;
    return line.every((cell) => cell === line[0]);
  },

  _getWinningLineIndices (startRow, startCol, length, size, direction) {
    const indices = [];
    for (let i = 0; i < length; i++) {
      switch (direction) {
        case "horizontal":
          indices.push(startRow * size + startCol + i);
          break;
        case "vertical":
          indices.push((startRow + i) * size + startCol);
          break;
        case "diagonal-main":
          indices.push((startRow + i) * size + (startCol + i));
          break;
        case "diagonal-anti":
          indices.push((startRow + i) * size + (startCol - i));
          break;
      }
    }
    return indices;
  },

  _updateScores (scores, winner) {
    const newScores = { ...scores };
    if (winner === 1) {
      newScores.player += 1;
    } else if (winner === 2) {
      newScores.ai += 1;
    }
    return newScores;
  },
};

// Export module
if (typeof window !== "undefined") {
  window.BoardManager = BoardManager;
}