/**
 * Board Management Module
 * Quản lý trạng thái bàn cờ và logic game Tic Tac Toe
 * Hỗ trợ các kích thước bàn 3x3, 4x4, 5x5
 */

const BoardManager = {
  /**
   * Khởi tạo trạng thái game mới
   * @param {number} size - Kích thước bàn (3, 4, hoặc 5)
   * @param {number} winLength - Số ô liên tiếp để thắng (mặc định = size)
   * @returns {Object} State mẫu với đầy đủ thông tin game
   */
  initState(size = 3, winLength) {
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
      round: 1,
      hearts: 3, // Số trái tim khi hòa
      scores: { player: 0, ai: 0 },
      gameStatus: "playing", // 'playing', 'won', 'draw', 'round_end'
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
  makeMove(state, index) {
    // Validate input
    if (!state || !Array.isArray(state.board)) {
      throw new Error("Invalid state provided");
    }

    if (typeof index !== "number" || index < 0 || index >= state.board.length) {
      throw new Error("Invalid index: out of bounds");
    }

    if (state.board[index] !== null) {
      throw new Error("Invalid move: cell already occupied");
    }

    if (state.gameStatus !== "playing") {
      throw new Error("Game is not in playing state");
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
  checkWinner(state) {
    const { board, size, winLength } = state;

    // Kiểm tra hàng ngang
    for (let row = 0; row < size; row++) {
      for (let col = 0; col <= size - winLength; col++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push(board[row * size + col + i]);
        }
        if (this._isWinningLine(line)) {
          return {
            winner: line[0],
            winningLine: this._getWinningLineIndices(row, col, winLength, size, "horizontal"),
          };
        }
      }
    }

    // Kiểm tra hàng dọc
    for (let col = 0; col < size; col++) {
      for (let row = 0; row <= size - winLength; row++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push(board[(row + i) * size + col]);
        }
        if (this._isWinningLine(line)) {
          return {
            winner: line[0],
            winningLine: this._getWinningLineIndices(row, col, winLength, size, "vertical"),
          };
        }
      }
    }

    // Kiểm tra đường chéo chính (từ trái trên xuống phải dưới)
    for (let row = 0; row <= size - winLength; row++) {
      for (let col = 0; col <= size - winLength; col++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push(board[(row + i) * size + (col + i)]);
        }
        if (this._isWinningLine(line)) {
          return {
            winner: line[0],
            winningLine: this._getWinningLineIndices(row, col, winLength, size, "diagonal-main"),
          };
        }
      }
    }

    // Kiểm tra đường chéo phụ (từ phải trên xuống trái dưới)
    for (let row = 0; row <= size - winLength; row++) {
      for (let col = winLength - 1; col < size; col++) {
        const line = [];
        for (let i = 0; i < winLength; i++) {
          line.push(board[(row + i) * size + (col - i)]);
        }
        if (this._isWinningLine(line)) {
          return {
            winner: line[0],
            winningLine: this._getWinningLineIndices(row, col, winLength, size, "diagonal-anti"),
          };
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
  isBoardFull(state) {
    return state.board.every((cell) => cell !== null);
  },

  /**
   * Đổi lượt chơi
   * @param {number} currentPlayer - Người chơi hiện tại
   * @returns {number} Người chơi tiếp theo
   */
  switchPlayer(currentPlayer) {
    return currentPlayer === 1 ? 2 : 1;
  },

  /**
   * Xử lý khi kết thúc vòng
   * @param {Object} state - Trạng thái game hiện tại
   * @param {number} winner - Người thắng (1, 2, hoặc 0 cho hòa)
   * @returns {Object} State mới sau khi xử lý vòng
   */
  handleRoundEnd(state, winner) {
    const newState = { ...state };

    if (winner === 0) {
      // Hòa - giảm trái tim
      newState.hearts = Math.max(0, state.hearts - 1);
      newState.gameStatus = "round_end";
    } else {
      // Có người thắng
      newState.gameStatus = "round_end";
    }

    return newState;
  },

  /**
   * Đặt lại trạng thái game cho vòng mới
   * @param {Object} state - Trạng thái game hiện tại
   * @returns {Object} State mới với bàn cờ trống
   */
  resetState(state) {
    return {
      ...state,
      board: new Array(state.size * state.size).fill(null),
      currentPlayer: 1,
      gameStatus: "playing",
      lastMove: null,
      winningLine: null,
    };
  },

  /**
   * Lấy thông tin ô tại vị trí (row, col)
   * @param {Object} state - Trạng thái game
   * @param {number} row - Hàng (0-based)
   * @param {number} col - Cột (0-based)
   * @returns {number|null} Giá trị ô (1, 2, hoặc null)
   */
  getCell(state, row, col) {
    if (row < 0 || row >= state.size || col < 0 || col >= state.size) {
      return null;
    }
    return state.board[row * state.size + col];
  },

  /**
   * Chuyển đổi index thành tọa độ (row, col)
   * @param {number} index - Index trong mảng board
   * @param {number} size - Kích thước bàn
   * @returns {Object} Tọa độ {row, col}
   */
  indexToCoords(index, size) {
    return {
      row: Math.floor(index / size),
      col: index % size,
    };
  },

  /**
   * Chuyển đổi tọa độ (row, col) thành index
   * @param {number} row - Hàng
   * @param {number} col - Cột
   * @param {number} size - Kích thước bàn
   * @returns {number} Index trong mảng board
   */
  coordsToIndex(row, col, size) {
    return row * size + col;
  },

  // ===== PRIVATE METHODS =====

  /**
   * Kiểm tra một dòng có thắng không
   * @private
   */
  _isWinningLine(line) {
    return line.every((cell) => cell !== null && cell === line[0]);
  },

  /**
   * Lấy các index của dòng thắng
   * @private
   */
  _getWinningLineIndices(startRow, startCol, length, size, direction) {
    const indices = [];

    switch (direction) {
      case "horizontal":
        for (let i = 0; i < length; i++) {
          indices.push(startRow * size + startCol + i);
        }
        break;
      case "vertical":
        for (let i = 0; i < length; i++) {
          indices.push((startRow + i) * size + startCol);
        }
        break;
      case "diagonal-main":
        for (let i = 0; i < length; i++) {
          indices.push((startRow + i) * size + (startCol + i));
        }
        break;
      case "diagonal-anti":
        for (let i = 0; i < length; i++) {
          indices.push((startRow + i) * size + (startCol - i));
        }
        break;
    }

    return indices;
  },

  /**
   * Cập nhật điểm số
   * @private
   */
  _updateScores(scores, winner) {
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
if (typeof module !== "undefined" && module.exports) {
  module.exports = BoardManager;
} else if (typeof window !== "undefined") {
  window.BoardManager = BoardManager;
}
