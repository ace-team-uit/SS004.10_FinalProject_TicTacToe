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
  makeMove(state, index) {
    // Validate
    if (!state || state.board[index] !== null || state.gameStatus !== "playing") {
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
  checkWinner(state) {
    const { board, size } = state;
    const boardSize = size * size;

    // Duyệt qua tất cả các ô trên bàn cờ
    for (let i = 0; i < boardSize; i++) {
      // Bỏ qua nếu ô trống
      if (board[i] === null) continue;

      const row = Math.floor(i / size);
      const col = i % size;

      // Các hướng kiểm tra: [hàng, cột]
      const directions = [
        [0, 1], // Ngang ->
        [1, 0], // Dọc  ↓
        [1, 1], // Chéo chính \
        [1, -1], // Chéo phụ /
      ];

      for (const [dr, dc] of directions) {
        const result = this._checkLine(state, row, col, dr, dc);
        if (result) {
          // Tìm thấy người thắng, trả về ngay lập tức
          return result;
        }
      }
    }

    // Không tìm thấy người thắng
    return null;
  },

  // ===== PRIVATE METHODS =====

  /**
   * [HÀM PHỤ TRỢ MỚI] Kiểm tra một đường thẳng bắt đầu từ (startRow, startCol)
   * theo hướng (dr, dc) có tạo thành chuỗi thắng không.
   * @private
   */
  _checkLine(state, startRow, startCol, dr, dc) {
    const { board, size } = state;
    const player = board[startRow * size + startCol];

    // Số quân cờ cần để thắng giờ đây chính bằng kích thước bàn cờ (winLength = size)
    const winLength = size;
    const lineIndices = [];

    // Vòng lặp để kiểm tra chính xác 'winLength' quân cờ liên tiếp
    for (let i = 0; i < winLength; i++) {
      const r = startRow + i * dr;
      const c = startCol + i * dc;

      // Kiểm tra 1: Ô có nằm ngoài bàn cờ không?
      if (r < 0 || r >= size || c < 0 || c >= size) {
        return null; // Đường thắng đi ra ngoài bàn cờ -> không hợp lệ
      }

      // Kiểm tra 2: Quân cờ tại ô này có phải của người chơi không?
      if (board[r * size + c] !== player) {
        return null; // Chuỗi bị phá vỡ -> không hợp lệ
      }

      // Nếu mọi thứ đều ổn, thêm chỉ số của ô này vào danh sách đường thắng
      lineIndices.push(r * size + c);
    }

    // Nếu vòng lặp chạy hết mà không bị `return null`, có nghĩa là đã tìm thấy người thắng
    return { winner: player, winningLine: lineIndices };
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
   * Đặt lại trạng thái game cho vòng mới, giữ nguyên điểm số và cài đặt
   * @param {Object} state - Trạng thái game hiện tại
   * @returns {Object} State mới với bàn cờ trống
   */
  resetForNewRound(state) {
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

  _isWinningLine(line) {
    if (line[0] === null) return false;
    return line.every((cell) => cell === line[0]);
  },

  _getWinningLineIndices(startRow, startCol, length, size, direction) {
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
if (typeof window !== "undefined") {
  window.BoardManager = BoardManager;
}
