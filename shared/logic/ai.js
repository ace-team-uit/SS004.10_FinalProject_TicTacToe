/**
 * AI Core cho game Tic Tac Toe
 * Hỗ trợ minimax algorithm với alpha-beta pruning
 * Tối ưu hóa cho các kích thước bàn 3x3, 4x4, 5x5
 */

const TTT_AI = {
  // Cache để tránh tính toán lại
  _cache: new Map(),

  // Giới hạn độ sâu mặc định cho từng kích thước bàn
  _maxDepths: {
    9: 9, // 3x3: tìm kiếm toàn bộ
    16: 6, // 4x4: giới hạn độ sâu để tối ưu thời gian
    25: 4, // 5x5: giới hạn nghiêm ngặt để đảm bảo UX
  },

  /**
   * Tìm nước đi tốt nhất cho AI
   * @param {Array} board - Mảng đại diện bàn cờ (null = ô trống, 1 = X, 2 = O)
   * @param {number} player - Người chơi hiện tại (1 hoặc 2)
   * @returns {number} Index của ô tốt nhất, -1 nếu không có nước đi
   */
  findBestMove(board, player = 2) {
    if (!board || board.length === 0) return -1;

    const boardSize = board.length;
    const maxDepth = this._maxDepths[boardSize] || 4;

    // Xóa cache cũ nếu bàn cờ thay đổi quá nhiều
    if (this._cache.size > 1000) {
      this._cache.clear();
    }

    let bestScore = -Infinity;
    let bestMove = -1;
    let alpha = -Infinity;
    let beta = Infinity;

    // Tìm tất cả các ô trống
    const emptyCells = this._getEmptyCells(board);
    if (emptyCells.length === 0) return -1;

    // Sắp xếp các ô trống theo ưu tiên (góc, cạnh, giữa)
    const prioritizedMoves = this._prioritizeMoves(emptyCells, boardSize);

    for (const move of prioritizedMoves) {
      if (board[move] === null) {
        // Thử nước đi
        board[move] = player;

        // Tính điểm minimax
        const score = this.minimax(board, maxDepth - 1, alpha, beta, false, player);

        // Hoàn tác nước đi
        board[move] = null;

        // Cập nhật nước đi tốt nhất
        if (score > bestScore) {
          bestScore = score;
          bestMove = move;
        }
      }
    }

    return bestMove;
  },

  /**
   * Minimax algorithm với alpha-beta pruning
   * @param {Array} board - Bàn cờ hiện tại
   * @param {number} depth - Độ sâu còn lại
   * @param {number} alpha - Alpha value cho pruning
   * @param {number} beta - Beta value cho pruning
   * @param {boolean} isMaximizing - Có phải lượt tối đa hóa không
   * @param {number} player - Người chơi hiện tại
   * @returns {number} Điểm số tốt nhất
   */
  minimax(board, depth, alpha, beta, isMaximizing, player) {
    const boardSize = board.length;
    const cacheKey = this._generateCacheKey(board, depth, isMaximizing, player);

    // Kiểm tra cache
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    // Kiểm tra điều kiện dừng
    const winner = this._checkWinner(board, boardSize);
    if (winner !== null || depth === 0) {
      const score = this.evaluateBoard(board, player);
      this._cache.set(cacheKey, score);
      return score;
    }

    const opponent = player === 1 ? 2 : 1;
    let bestScore = isMaximizing ? -Infinity : Infinity;

    const emptyCells = this._getEmptyCells(board);

    for (const move of emptyCells) {
      if (board[move] === null) {
        // Thử nước đi
        board[move] = isMaximizing ? player : opponent;

        // Đệ quy
        const score = this.minimax(board, depth - 1, alpha, beta, !isMaximizing, player);

        // Hoàn tác
        board[move] = null;

        // Cập nhật điểm tốt nhất
        if (isMaximizing) {
          bestScore = Math.max(bestScore, score);
          alpha = Math.max(alpha, score);
        } else {
          bestScore = Math.min(bestScore, score);
          beta = Math.min(beta, score);
        }

        // Alpha-beta pruning
        if (beta <= alpha) break;
      }
    }

    // Lưu vào cache
    this._cache.set(cacheKey, bestScore);
    return bestScore;
  },

  /**
   * Đánh giá bàn cờ và trả về điểm số
   * @param {Array} board - Bàn cờ cần đánh giá
   * @param {number} player - Người chơi cần đánh giá (1 hoặc 2)
   * @returns {number} Điểm số (-1000 đến 1000)
   */
  evaluateBoard(board, player) {
    const boardSize = board.length;
    const gridSize = Math.sqrt(boardSize);
    const opponent = player === 1 ? 2 : 1;

    // Kiểm tra người thắng
    const winner = this._checkWinner(board, boardSize);
    if (winner === player) return 1000;
    if (winner === opponent) return -1000;
    if (winner === "draw") return 0;

    let score = 0;

    // Đánh giá theo hàng ngang
    for (let row = 0; row < gridSize; row++) {
      score += this._evaluateLine(board, row * gridSize, row * gridSize + gridSize - 1, 1, player);
    }

    // Đánh giá theo cột dọc
    for (let col = 0; col < gridSize; col++) {
      score += this._evaluateLine(board, col, col + (gridSize - 1) * gridSize, gridSize, player);
    }

    // Đánh giá đường chéo chính
    score += this._evaluateLine(board, 0, boardSize - 1, gridSize + 1, player);

    // Đánh giá đường chéo phụ
    score += this._evaluateLine(board, gridSize - 1, boardSize - gridSize, gridSize - 1, player);

    return score;
  },

  /**
   * Đánh giá một đường (hàng, cột hoặc đường chéo)
   * @param {Array} board - Bàn cờ
   * @param {number} start - Vị trí bắt đầu
   * @param {number} end - Vị trí kết thúc
   * @param {number} step - Bước nhảy
   * @param {number} player - Người chơi
   * @returns {number} Điểm số của đường
   */
  _evaluateLine(board, start, end, step, player) {
    const opponent = player === 1 ? 2 : 1;
    let playerCount = 0;
    let opponentCount = 0;
    let emptyCount = 0;

    for (let i = start; i <= end; i += step) {
      if (board[i] === player) playerCount++;
      else if (board[i] === opponent) opponentCount++;
      else emptyCount++;
    }

    // Tính điểm dựa trên số lượng quân cờ
    if (opponentCount === 0) {
      // Chỉ có quân của player
      return Math.pow(10, playerCount);
    } else if (playerCount === 0) {
      // Chỉ có quân của opponent
      return -Math.pow(10, opponentCount);
    }

    // Cả hai đều có quân (blocked)
    return 0;
  },

  /**
   * Kiểm tra người thắng
   * @param {Array} board - Bàn cờ
   * @param {number} boardSize - Kích thước bàn cờ
   * @returns {number|string|null} 1, 2, 'draw', hoặc null
   */
  _checkWinner(board, boardSize) {
    const gridSize = Math.sqrt(boardSize);

    // Kiểm tra hàng ngang
    for (let row = 0; row < gridSize; row++) {
      const start = row * gridSize;
      if (this._checkLine(board, start, start + gridSize - 1, 1)) {
        return board[start];
      }
    }

    // Kiểm tra cột dọc
    for (let col = 0; col < gridSize; col++) {
      if (this._checkLine(board, col, col + (gridSize - 1) * gridSize, gridSize)) {
        return board[col];
      }
    }

    // Kiểm tra đường chéo chính
    if (this._checkLine(board, 0, boardSize - 1, gridSize + 1)) {
      return board[0];
    }

    // Kiểm tra đường chéo phụ
    if (this._checkLine(board, gridSize - 1, boardSize - gridSize, gridSize - 1)) {
      return board[gridSize - 1];
    }

    // Kiểm tra hòa
    if (this._getEmptyCells(board).length === 0) {
      return "draw";
    }

    return null;
  },

  /**
   * Kiểm tra một đường có cùng giá trị không
   * @param {Array} board - Bàn cờ
   * @param {number} start - Vị trí bắt đầu
   * @param {number} end - Vị trí kết thúc
   * @param {number} step - Bước nhảy
   * @returns {boolean} True nếu đường có cùng giá trị
   */
  _checkLine(board, start, end, step) {
    const first = board[start];
    if (first === null) return false;

    for (let i = start + step; i <= end; i += step) {
      if (board[i] !== first) return false;
    }
    return true;
  },

  /**
   * Lấy danh sách các ô trống
   * @param {Array} board - Bàn cờ
   * @returns {Array} Mảng index của các ô trống
   */
  _getEmptyCells(board) {
    const empty = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null || board[i] === "") {
        empty.push(i);
      }
    }
    return empty;
  },

  /**
   * Ưu tiên các nước đi theo thứ tự: góc, cạnh, giữa
   * @param {Array} moves - Danh sách các nước đi
   * @param {number} boardSize - Kích thước bàn cờ
   * @returns {Array} Mảng các nước đi đã sắp xếp
   */
  _prioritizeMoves(moves, boardSize) {
    const gridSize = Math.sqrt(boardSize);
    const corners = [0, gridSize - 1, boardSize - gridSize, boardSize - 1];
    const edges = [];
    const center = Math.floor(boardSize / 2);

    // Tìm các ô cạnh
    for (let i = 0; i < gridSize; i++) {
      if (i !== 0 && i !== gridSize - 1) {
        edges.push(i); // Cạnh trên
        edges.push(i + (gridSize - 1) * gridSize); // Cạnh dưới
        edges.push(i * gridSize); // Cạnh trái
        edges.push(i * gridSize + gridSize - 1); // Cạnh phải
      }
    }

    const prioritized = [];

    // Thêm góc trước
    for (const move of moves) {
      if (corners.includes(move)) {
        prioritized.push(move);
      }
    }

    // Thêm cạnh
    for (const move of moves) {
      if (edges.includes(move) && !prioritized.includes(move)) {
        prioritized.push(move);
      }
    }

    // Thêm giữa
    for (const move of moves) {
      if (move === center && !prioritized.includes(move)) {
        prioritized.push(move);
      }
    }

    // Thêm các ô còn lại
    for (const move of moves) {
      if (!prioritized.includes(move)) {
        prioritized.push(move);
      }
    }

    return prioritized;
  },

  /**
   * Tạo key cho cache
   * @param {Array} board - Bàn cờ
   * @param {number} depth - Độ sâu
   * @param {boolean} isMaximizing - Có phải lượt tối đa hóa không
   * @param {number} player - Người chơi
   * @returns {string} Key cho cache
   */
  _generateCacheKey(board, depth, isMaximizing, player) {
    return `${board.join(",")}|${depth}|${isMaximizing}|${player}`;
  },

  /**
   * Xóa cache
   */
  clearCache() {
    this._cache.clear();
  },

  /**
   * Lấy thống kê cache
   * @returns {Object} Thống kê cache
   */
  getCacheStats() {
    return {
      size: this._cache.size,
      maxDepths: this._maxDepths,
    };
  },
};

// Export cho sử dụng global
if (typeof window !== "undefined") {
  // @ts-ignore
  window.TTT_AI = TTT_AI;
}
