const TTT_AI = {
  // Cache để tránh tính toán lại các thế cờ đã gặp
  _cache: new Map(),

  // Giới hạn độ sâu mặc định cho thuật toán Minimax theo kích thước bàn cờ
  _maxDepths: {
    9: 9, // 3x3: tìm kiếm toàn bộ cây trạng thái
    16: 6, // 4x4: giới hạn độ sâu để tối ưu thời gian
    25: 4, // 5x5: giới hạn nghiêm ngặt hơn để đảm bảo trải nghiệm người dùng
  },

  /**
   * Lấy nước đi cho AI dựa trên độ khó được chọn.
   * @param {Object} state - Trạng thái game (từ BoardManager).
   * @param {string} difficulty - 'easy' | 'medium' | 'hard'.
   * @returns {number} Index của nước đi tối ưu.
   */
  getAIMove: function (state, difficulty = "easy") {
    if (!state || state.gameStatus !== "playing") return -1;

    const board = [...state.board];
    const player = 2; // AI luôn là người chơi 2 (O)
    const emptyCells = this._getEmptyCells(board);
    if (emptyCells.length === 0) return -1;

    // EASY: chỉ random, không ưu tiên thắng/chặn
    if (difficulty === "easy") {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    // MEDIUM/HARD: ưu tiên thắng/chặn trước
    const immediateMove = this._findImmediateWinOrBlock(board, player);
    if (immediateMove !== -1) {
      return immediateMove;
    }

    // MEDIUM: 80% minimax, 20% random
    if (difficulty === "medium") {
      if (Math.random() < 0.8) {
        return this.findBestMove(board, player, 2);
      } else {
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }
    }

    // HARD: luôn minimax tối đa
    return this.findBestMove(board, player);
  },

  /**
   * Tìm nước đi có thể thắng ngay hoặc chặn đối thủ thắng ngay.
   * @param {Array} board - Mảng bàn cờ.
   * @param {number} player - Người chơi hiện tại (AI).
   * @returns {number} Index của nước đi, hoặc -1 nếu không có.
   */
  _findImmediateWinOrBlock: function (board, player) {
    const opponent = player === 1 ? 2 : 1;
    const emptyCells = this._getEmptyCells(board);

    // 1. Kiểm tra xem AI có thể thắng ngay không.
    for (const move of emptyCells) {
      board[move] = player;
      if (this._checkWinner(board)) {
        board[move] = null; // Hoàn tác
        return move;
      }
      board[move] = null; // Hoàn tác
    }

    // 2. Kiểm tra xem đối thủ có thể thắng ở lượt tiếp theo không (để chặn).
    for (const move of emptyCells) {
      board[move] = opponent;
      if (this._checkWinner(board)) {
        board[move] = null; // Hoàn tác
        return move;
      }
      board[move] = null; // Hoàn tác
    }

    return -1; // Không có nước đi nào cần ưu tiên ngay.
  },

  /**
   * Tìm nước đi tốt nhất cho AI sử dụng Minimax với Alpha-Beta Pruning.
   * @param {Array} board - Mảng bàn cờ.
   * @param {number} player - Người chơi hiện tại (AI).
   * @param {number} [customMaxDepth] - Tùy chọn độ sâu tối đa (dùng cho độ khó Medium).
   * @returns {number} Index của nước đi tốt nhất.
   */
  findBestMove(board, player = 2, customMaxDepth) {
    if (!board || board.length === 0) return -1;

    // Xóa cache nếu quá lớn để tránh tốn bộ nhớ.
    if (this._cache.size > 5000) this._cache.clear();

    const boardSize = board.length;
    const maxDepth = customMaxDepth || this._maxDepths[boardSize] || 4;

    let bestScore = -Infinity;
    let bestMove = -1;
    let alpha = -Infinity;
    let beta = Infinity;

    const emptyCells = this._getEmptyCells(board);
    if (emptyCells.length === 0) return -1;

    // Ưu tiên duyệt các nước đi ở trung tâm để tăng hiệu quả cắt tỉa alpha-beta.
    const prioritizedMoves = this._prioritizeMoves(emptyCells, boardSize);

    for (const move of prioritizedMoves) {
      board[move] = player; // Thử nước đi
      const score = this.minimax(board, maxDepth - 1, alpha, beta, false, player);
      board[move] = null; // Hoàn tác

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, score); // Cập nhật alpha
    }

    // Nếu không tìm thấy nước đi nào (trường hợp hiếm), trả về một nước đi ngẫu nhiên.
    return bestMove !== -1 ? bestMove : emptyCells[0];
  },

  /**
   * Thuật toán Minimax với cắt tỉa Alpha-Beta.
   * @param {Array} board - Bàn cờ.
   * @param {number} depth - Độ sâu còn lại.
   * @param {number} alpha - Giá trị Alpha.
   * @param {number} beta - Giá trị Beta.
   * @param {boolean} isMaximizing - Lượt của người chơi tối đa hóa (AI) hay không.
   * @param {number} player - Người chơi AI.
   * @returns {number} Điểm số tốt nhất.
   */
  minimax(board, depth, alpha, beta, isMaximizing, player) {
    const cacheKey = this._generateCacheKey(board, depth, isMaximizing);
    if (this._cache.has(cacheKey)) {
      return this._cache.get(cacheKey);
    }

    const winnerInfo = this._checkWinner(board);
    if (winnerInfo || depth === 0) {
      const score = this.evaluateBoard(board, player, depth);
      this._cache.set(cacheKey, score);
      return score;
    }

    const opponent = player === 1 ? 2 : 1;
    const emptyCells = this._getEmptyCells(board);

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (const move of emptyCells) {
        board[move] = player;
        const score = this.minimax(board, depth - 1, alpha, beta, false, player);
        board[move] = null;
        bestScore = Math.max(bestScore, score);
        alpha = Math.max(alpha, score);
        if (beta <= alpha) break; // Cắt tỉa Beta
      }
      this._cache.set(cacheKey, bestScore);
      return bestScore;
    } else {
      // isMinimizing
      let bestScore = Infinity;
      for (const move of emptyCells) {
        board[move] = opponent;
        const score = this.minimax(board, depth - 1, alpha, beta, true, player);
        board[move] = null;
        bestScore = Math.min(bestScore, score);
        beta = Math.min(beta, score);
        if (beta <= alpha) break; // Cắt tỉa Alpha
      }
      this._cache.set(cacheKey, bestScore);
      return bestScore;
    }
  },

  /**
   * Hàm đánh giá điểm số của bàn cờ (Heuristic function).
   * @param {Array} board - Bàn cờ.
   * @param {number} player - Người chơi AI.
   * @param {number} depth - Độ sâu còn lại (để ưu tiên thắng nhanh).
   * @returns {number} Điểm số.
   */
  evaluateBoard(board, player, depth) {
    const winnerInfo = this._checkWinner(board);
    if (winnerInfo) {
      if (winnerInfo.winner === player) return 100000 + depth * 100; // Thắng, cộng thêm điểm nếu thắng nhanh
      if (winnerInfo.winner === (player === 1 ? 2 : 1)) return -100000 - depth * 100; // Thua
      if (winnerInfo.winner === "draw") return 0; // Hòa
    }

    // Nếu chưa kết thúc, tính điểm tiềm năng
    let score = 0;
    const allLines = this._getAllLines(board);
    const winCondition = this._getWinCondition(board.length);

    for (const line of allLines) {
      score += this._evaluateLine(line, player, winCondition);
    }
    return score;
  },

  /**
   * Đánh giá điểm cho một đường (hàng, cột, chéo).
   * @param {Array} line - Mảng các ô trên một đường.
   * @param {number} player - Người chơi AI.
   * @param {number} winCondition - Số quân liên tiếp để thắng.
   * @returns {number} Điểm của đường đó.
   */
  _evaluateLine(line, player, winCondition) {
    const opponent = player === 1 ? 2 : 1;
    let score = 0;

    // Đếm số chuỗi 2, 3, 4... của AI và đối thủ
    for (let i = 2; i < winCondition; i++) {
      score += this._countConsecutive(line, player, i) * Math.pow(10, i);
      score -= this._countConsecutive(line, opponent, i) * Math.pow(10, i) * 1.5; // Điểm chặn đối thủ cao hơn 1 chút
    }

    return score;
  },

  /**
   * Đếm số chuỗi N quân liên tiếp có đầu mở.
   */
  _countConsecutive(line, player, count) {
    let sequences = 0;
    for (let i = 0; i <= line.length - count; i++) {
      const slice = line.slice(i, i + count);
      if (slice.every((cell) => cell === player)) {
        // Kiểm tra 2 đầu có trống không (đầu mở)
        const before = i > 0 ? line[i - 1] : null;
        const after = i + count < line.length ? line[i + count] : null;
        if (before === null && after === null) {
          sequences += 10; // 2 đầu mở là rất mạnh
        } else if (before === null || after === null) {
          sequences += 1; // 1 đầu mở
        }
      }
    }
    return sequences;
  },

  /**
   * Lấy điều kiện thắng dựa trên kích thước bàn cờ.
   */
  _getWinCondition: function (boardSize) {
    if (boardSize === 9) return 3; // 3x3
    return 4; // 4x4 và 5x5
  },

  /**
   * Kiểm tra người thắng dựa trên luật chơi (3-in-a-row hoặc 4-in-a-row).
   * @param {Array} board - Bàn cờ.
   * @returns {Object|null} Trả về { winner, line } nếu có người thắng, 'draw' hoặc null.
   */
  _checkWinner(board) {
    const boardSize = board.length;
    const winCondition = this._getWinCondition(boardSize);
    const allLines = this._getAllLines(board, true); // Lấy cả index

    for (const lineInfo of allLines) {
      const line = lineInfo.line;
      const indices = lineInfo.indices;
      for (let i = 0; i <= line.length - winCondition; i++) {
        const first = line[i];
        if (first !== null) {
          const segment = line.slice(i, i + winCondition);
          if (segment.every((cell) => cell === first)) {
            return {
              winner: first,
              line: indices.slice(i, i + winCondition),
            };
          }
        }
      }
    }

    if (this._getEmptyCells(board).length === 0) {
      return { winner: "draw", line: [] };
    }

    return null;
  },

  /**
   * Lấy tất cả các đường (hàng, cột, chéo) trên bàn cờ.
   * @param {Array} board - Bàn cờ.
   * @param {boolean} withIndices - Có trả về index của các ô không.
   * @returns {Array} Mảng các đường.
   */
  _getAllLines(board, withIndices = false) {
    const size = Math.sqrt(board.length);
    const lines = [];

    // Hàng và Cột
    for (let i = 0; i < size; i++) {
      const row = [];
      const col = [];
      const rowIndex = [];
      const colIndex = [];
      for (let j = 0; j < size; j++) {
        row.push(board[i * size + j]);
        col.push(board[j * size + i]);
        if (withIndices) {
          rowIndex.push(i * size + j);
          colIndex.push(j * size + i);
        }
      }
      lines.push(withIndices ? { line: row, indices: rowIndex } : row);
      lines.push(withIndices ? { line: col, indices: colIndex } : col);
    }

    // Đường chéo
    for (let i = 0; i <= 2 * (size - 1); i++) {
      const diag1 = [];
      const diag2 = [];
      const diag1Index = [];
      const diag2Index = [];
      for (let j = 0; j <= i; j++) {
        const k = i - j;
        if (j < size && k < size) {
          diag1.push(board[j * size + k]);
          diag2.push(board[(size - 1 - j) * size + k]);
          if (withIndices) {
            diag1Index.push(j * size + k);
            diag2Index.push((size - 1 - j) * size + k);
          }
        }
      }
      if (diag1.length > 0) lines.push(withIndices ? { line: diag1, indices: diag1Index } : diag1);
      if (diag2.length > 0) lines.push(withIndices ? { line: diag2, indices: diag2Index } : diag2);
    }

    return lines;
  },

  /**
   * Lấy danh sách các ô còn trống.
   */
  _getEmptyCells(board) {
    const cells = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        cells.push(i);
      }
    }
    return cells;
  },

  /**
   * Ưu tiên các nước đi ở trung tâm để tăng hiệu quả tìm kiếm.
   */
  _prioritizeMoves(moves, boardSize) {
    const center = Math.floor(boardSize / 2);
    moves.sort((a, b) => {
      const distA = Math.abs(a - center);
      const distB = Math.abs(b - center);
      return distA - distB;
    });
    return moves;
  },

  /**
   * Tạo key cho cache.
   */
  _generateCacheKey(board, depth, isMaximizing) {
    return `${board.join("")}|${depth}|${isMaximizing}`;
  },

  /**
   * Xóa cache.
   */
  clearCache() {
    this._cache.clear();
  },

  /**
   * Lấy thống kê cache.
   */
  getCacheStats() {
    return {
      size: this._cache.size,
      maxDepths: this._maxDepths,
    };
  },
};

// Export cho môi trường trình duyệt
if (typeof window !== "undefined") {
  // @ts-ignore
  window.TTT_AI = TTT_AI;
}
