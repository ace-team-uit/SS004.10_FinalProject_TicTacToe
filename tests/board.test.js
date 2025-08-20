/**
 * Unit Tests cho BoardManager Module
 * Kiểm tra tất cả các hàm public và logic game
 */

// Mock DOM environment nếu cần
if (typeof window === 'undefined') {
  global.window = {};
}

// Import module (cần load board.js trước)
// const BoardManager = require('../shared/logic/board.js');

describe('BoardManager Tests', () => {
  let BoardManager;
  
  beforeAll(() => {
    // Load module
    const script = document.createElement('script');
    script.src = '../shared/logic/board.js';
    document.head.appendChild(script);
    
    // Wait for module to load
    return new Promise(resolve => {
      script.onload = () => {
        BoardManager = window.BoardManager;
        resolve();
      };
    });
  });

  describe('initState', () => {
    test('should initialize 3x3 board correctly', () => {
      const state = BoardManager.initState(3);
      
      expect(state.board).toHaveLength(9);
      expect(state.board.every(cell => cell === null)).toBe(true);
      expect(state.size).toBe(3);
      expect(state.winLength).toBe(3);
      expect(state.currentPlayer).toBe(1);
      expect(state.round).toBe(1);
      expect(state.hearts).toBe(3);
      expect(state.scores).toEqual({ player: 0, ai: 0 });
      expect(state.gameStatus).toBe('playing');
    });

    test('should initialize 4x4 board correctly', () => {
      const state = BoardManager.initState(4);
      
      expect(state.board).toHaveLength(16);
      expect(state.size).toBe(4);
      expect(state.winLength).toBe(4);
    });

    test('should initialize 5x5 board correctly', () => {
      const state = BoardManager.initState(5);
      
      expect(state.board).toHaveLength(25);
      expect(state.size).toBe(5);
      expect(state.winLength).toBe(5);
    });

    test('should throw error for invalid size', () => {
      expect(() => BoardManager.initState(2)).toThrow('Size must be 3, 4, or 5');
      expect(() => BoardManager.initState(6)).toThrow('Size must be 3, 4, or 5');
    });

    test('should accept custom winLength', () => {
      const state = BoardManager.initState(4, 3);
      expect(state.winLength).toBe(3);
    });
  });

  describe('makeMove', () => {
    let state;

    beforeEach(() => {
      state = BoardManager.initState(3);
    });

    test('should make valid move', () => {
      const newState = BoardManager.makeMove(state, 4);
      
      expect(newState.board[4]).toBe(1);
      expect(newState.currentPlayer).toBe(2);
      expect(newState.lastMove).toBe(4);
    });

    test('should throw error for invalid index', () => {
      expect(() => BoardManager.makeMove(state, -1)).toThrow('Invalid index: out of bounds');
      expect(() => BoardManager.makeMove(state, 9)).toThrow('Invalid index: out of bounds');
    });

    test('should throw error for occupied cell', () => {
      state.board[4] = 1;
      expect(() => BoardManager.makeMove(state, 4)).toThrow('Invalid move: cell already occupied');
    });

    test('should throw error for non-playing state', () => {
      state.gameStatus = 'won';
      expect(() => BoardManager.makeMove(state, 4)).toThrow('Game is not in playing state');
    });
  });

  describe('checkWinner', () => {
    test('should detect horizontal win in 3x3', () => {
      const state = BoardManager.initState(3);
      state.board[0] = 1;
      state.board[1] = 1;
      state.board[2] = 1;
      
      const result = BoardManager.checkWinner(state);
      
      expect(result.winner).toBe(1);
      expect(result.winningLine).toEqual([0, 1, 2]);
    });

    test('should detect vertical win in 3x3', () => {
      const state = BoardManager.initState(3);
      state.board[0] = 2;
      state.board[3] = 2;
      state.board[6] = 2;
      
      const result = BoardManager.checkWinner(state);
      
      expect(result.winner).toBe(2);
      expect(result.winningLine).toEqual([0, 3, 6]);
    });

    test('should detect diagonal win in 3x3', () => {
      const state = BoardManager.initState(3);
      state.board[0] = 1;
      state.board[4] = 1;
      state.board[8] = 1;
      
      const result = BoardManager.checkWinner(state);
      
      expect(result.winner).toBe(1);
      expect(result.winningLine).toEqual([0, 4, 8]);
    });

    test('should detect win in 4x4 with custom winLength', () => {
      const state = BoardManager.initState(4, 3);
      state.board[0] = 1;
      state.board[1] = 1;
      state.board[2] = 1;
      
      const result = BoardManager.checkWinner(state);
      
      expect(result.winner).toBe(1);
      expect(result.winningLine).toEqual([0, 1, 2]);
    });

    test('should return null when no winner', () => {
      const state = BoardManager.initState(3);
      state.board[0] = 1;
      state.board[1] = 2;
      
      const result = BoardManager.checkWinner(state);
      
      expect(result).toBeNull();
    });
  });

  describe('isBoardFull', () => {
    test('should return false for empty board', () => {
      const state = BoardManager.initState(3);
      expect(BoardManager.isBoardFull(state)).toBe(false);
    });

    test('should return true for full board', () => {
      const state = BoardManager.initState(3);
      state.board.fill(1);
      expect(BoardManager.isBoardFull(state)).toBe(true);
    });

    test('should work for different board sizes', () => {
      const state4x4 = BoardManager.initState(4);
      state4x4.board.fill(1);
      expect(BoardManager.isBoardFull(state4x4)).toBe(true);
      
      const state5x5 = BoardManager.initState(5);
      state5x5.board.fill(2);
      expect(BoardManager.isBoardFull(state5x5)).toBe(true);
    });
  });

  describe('switchPlayer', () => {
    test('should switch from player 1 to 2', () => {
      expect(BoardManager.switchPlayer(1)).toBe(2);
    });

    test('should switch from player 2 to 1', () => {
      expect(BoardManager.switchPlayer(2)).toBe(1);
    });
  });

  describe('handleRoundEnd', () => {
    let state;

    beforeEach(() => {
      state = BoardManager.initState(3);
    });

    test('should handle draw correctly', () => {
      const newState = BoardManager.handleRoundEnd(state, 0);
      
      expect(newState.hearts).toBe(2);
      expect(newState.gameStatus).toBe('round_end');
    });

    test('should handle winner correctly', () => {
      const newState = BoardManager.handleRoundEnd(state, 1);
      
      expect(newState.hearts).toBe(3);
      expect(newState.gameStatus).toBe('round_end');
    });

    test('should not go below 0 hearts', () => {
      state.hearts = 0;
      const newState = BoardManager.handleRoundEnd(state, 0);
      
      expect(newState.hearts).toBe(0);
    });
  });

  describe('resetState', () => {
    test('should reset board to empty', () => {
      const state = BoardManager.initState(3);
      state.board[0] = 1;
      state.board[4] = 2;
      state.currentPlayer = 2;
      state.gameStatus = 'won';
      
      const newState = BoardManager.resetState(state);
      
      expect(newState.board.every(cell => cell === null)).toBe(true);
      expect(newState.currentPlayer).toBe(1);
      expect(newState.gameStatus).toBe('playing');
      expect(newState.lastMove).toBeNull();
      expect(newState.winningLine).toBeNull();
    });
  });

  describe('Utility functions', () => {
    test('getCell should return correct value', () => {
      const state = BoardManager.initState(3);
      state.board[4] = 1;
      
      expect(BoardManager.getCell(state, 1, 1)).toBe(1);
      expect(BoardManager.getCell(state, 0, 0)).toBeNull();
    });

    test('indexToCoords should convert correctly', () => {
      expect(BoardManager.indexToCoords(4, 3)).toEqual({ row: 1, col: 1 });
      expect(BoardManager.indexToCoords(8, 3)).toEqual({ row: 2, col: 2 });
    });

    test('coordsToIndex should convert correctly', () => {
      expect(BoardManager.coordsToIndex(1, 1, 3)).toBe(4);
      expect(BoardManager.coordsToIndex(2, 2, 3)).toBe(8);
    });
  });

  describe('Game flow integration', () => {
    test('should handle complete game flow', () => {
      let state = BoardManager.initState(3);
      
      // Player 1 moves
      state = BoardManager.makeMove(state, 0);
      expect(state.board[0]).toBe(1);
      expect(state.currentPlayer).toBe(2);
      
      // AI moves
      state = BoardManager.makeMove(state, 4);
      expect(state.board[4]).toBe(2);
      expect(state.currentPlayer).toBe(1);
      
      // Player 1 wins
      state = BoardManager.makeMove(state, 1);
      state = BoardManager.makeMove(state, 8);
      state = BoardManager.makeMove(state, 2);
      
      const winner = BoardManager.checkWinner(state);
      expect(winner.winner).toBe(1);
      expect(winner.winningLine).toEqual([0, 1, 2]);
    });
  });
});
