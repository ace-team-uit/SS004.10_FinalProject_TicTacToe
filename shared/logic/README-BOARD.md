# Board Manager Module

## Tổng quan

Module `BoardManager` quản lý trạng thái bàn cờ và logic game Tic Tac Toe. Module này cung cấp API rõ ràng để quản lý game state theo hướng bất biến (immutable).

## Tính năng

- ✅ Hỗ trợ bàn cờ 3x3, 4x4, 5x5
- ✅ Kiểm tra thắng thua theo nhiều hướng (ngang, dọc, chéo)
- ✅ Quản lý lượt chơi và điểm số
- ✅ Hệ thống trái tim khi hòa
- ✅ API immutable state
- ✅ Validation đầy đủ

## API Reference

### `initState(size, winLength)`

Khởi tạo trạng thái game mới.

**Parameters:**

- `size` (number): Kích thước bàn (3, 4, hoặc 5)
- `winLength` (number, optional): Số ô liên tiếp để thắng (mặc định = size)

**Returns:**

```javascript
{
  board: Array,           // Mảng 1 chiều đại diện bàn cờ
  size: number,           // Kích thước bàn
  winLength: number,      // Điều kiện thắng
  currentPlayer: number,  // Người chơi hiện tại (1 = X, 2 = O)
  round: number,          // Số vòng hiện tại
  hearts: number,         // Số trái tim còn lại
  scores: Object,         // Điểm số { player: number, ai: number }
  gameStatus: string,     // Trạng thái game
  lastMove: number|null,  // Index nước đi cuối
  winningLine: Array|null // Dòng thắng (nếu có)
}
```

**Example:**

```javascript
const state = BoardManager.initState(3); // 3x3, thắng 3 ô
const state4x4 = BoardManager.initState(4, 3); // 4x4, thắng 3 ô
```

### `makeMove(state, index)`

Thực hiện nước đi tại vị trí index.

**Parameters:**

- `state` (Object): Trạng thái game hiện tại
- `index` (number): Index của ô được chọn (0-based)

**Returns:** Trạng thái game mới (immutable)

**Validation:**

- Index phải trong phạm vi bàn cờ
- Ô phải trống
- Game phải đang ở trạng thái 'playing'

**Example:**

```javascript
const newState = BoardManager.makeMove(state, 4);
// newState.board[4] = currentPlayer
// newState.currentPlayer = nextPlayer
```

### `checkWinner(state)`

Kiểm tra người thắng.

**Parameters:**

- `state` (Object): Trạng thái game

**Returns:**

```javascript
{
  winner: number,         // 1 hoặc 2
  winningLine: Array     // Các index của dòng thắng
}
```

hoặc `null` nếu chưa có người thắng.

**Example:**

```javascript
const result = BoardManager.checkWinner(state);
if (result) {
  console.log(`Người chơi ${result.winner} thắng!`);
  console.log("Dòng thắng:", result.winningLine);
}
```

### `isBoardFull(state)`

Kiểm tra bàn cờ đã đầy chưa.

**Returns:** `boolean`

**Example:**

```javascript
if (BoardManager.isBoardFull(state)) {
  console.log("Hòa! Bàn cờ đã đầy");
}
```

### `switchPlayer(currentPlayer)`

Đổi lượt chơi.

**Parameters:**

- `currentPlayer` (number): Người chơi hiện tại

**Returns:** Người chơi tiếp theo (1 hoặc 2)

**Example:**

```javascript
const nextPlayer = BoardManager.switchPlayer(1); // Returns 2
```

### `handleRoundEnd(state, winner)`

Xử lý khi kết thúc vòng.

**Parameters:**

- `state` (Object): Trạng thái game
- `winner` (number): 0 = hòa, 1 hoặc 2 = người thắng

**Returns:** Trạng thái game mới

**Example:**

```javascript
if (winner === 0) {
  // Hòa - giảm trái tim
  state = BoardManager.handleRoundEnd(state, 0);
} else {
  // Có người thắng
  state = BoardManager.handleRoundEnd(state, winner);
}
```

### `resetState(state)`

Đặt lại trạng thái game cho vòng mới.

**Returns:** Trạng thái game mới với bàn cờ trống

**Example:**

```javascript
state = BoardManager.resetState(state);
// Bàn cờ trống, currentPlayer = 1, gameStatus = 'playing'
```

### Utility Functions

#### `getCell(state, row, col)`

Lấy giá trị ô tại tọa độ (row, col).

#### `indexToCoords(index, size)`

Chuyển đổi index thành tọa độ {row, col}.

#### `coordsToIndex(row, col, size)`

Chuyển đổi tọa độ thành index.

## Sử dụng trong Game

### Khởi tạo Game

```javascript
// Khởi tạo game 3x3
let gameState = BoardManager.initState(3);

// Khởi tạo game 4x4 với điều kiện thắng 3 ô
let gameState4x4 = BoardManager.initState(4, 3);
```

### Game Loop

```javascript
function gameLoop() {
  // Người chơi thực hiện nước đi
  gameState = BoardManager.makeMove(gameState, selectedIndex);

  // Kiểm tra thắng thua
  const winner = BoardManager.checkWinner(gameState);
  if (winner) {
    // Xử lý thắng
    handleGameEnd(winner);
    return;
  }

  // Kiểm tra hòa
  if (BoardManager.isBoardFull(gameState)) {
    // Xử lý hòa
    handleDraw();
    return;
  }

  // Đổi lượt chơi
  gameState.currentPlayer = BoardManager.switchPlayer(gameState.currentPlayer);
}
```

### Xử lý Kết thúc Vòng

```javascript
function handleGameEnd(winner) {
  if (winner.winner === 1) {
    gameState.scores.player += 1;
  } else {
    gameState.scores.ai += 1;
  }

  // Kiểm tra thắng chung cuộc
  if (gameState.scores.player >= 2 || gameState.scores.ai >= 2) {
    endGame();
  } else {
    // Bắt đầu vòng mới
    gameState = BoardManager.resetState(gameState);
  }
}
```

## Mapping Index ↔ Tọa độ

### 3x3 Board

```
Index:  0  1  2
        3  4  5
        6  7  8

Tọa độ: (0,0) (0,1) (0,2)
        (1,0) (1,1) (1,2)
        (2,0) (2,1) (2,2)
```

### 4x4 Board

```
Index:  0  1  2  3
        4  5  6  7
        8  9  10 11
        12 13 14 15
```

### 5x5 Board

```
Index:  0  1  2  3  4
        5  6  7  8  9
        10 11 12 13 14
        15 16 17 18 19
        20 21 22 23 24
```

## Trạng thái Game

- `'playing'`: Đang chơi
- `'won'`: Có người thắng
- `'draw'`: Hòa
- `'round_end'`: Kết thúc vòng

## Lưu ý

1. **Immutable State**: Tất cả hàm đều trả về state mới, không thay đổi state cũ
2. **Validation**: Module có validation đầy đủ cho input
3. **Performance**: Sử dụng mảng 1 chiều để tối ưu hiệu suất
4. **Flexibility**: Hỗ trợ điều kiện thắng tùy chỉnh

## Testing

Chạy test để kiểm tra module:

```bash
# Mở demo trong browser
open demo-board.html

# Hoặc chạy server local
python3 -m http.server 8000
# Mở http://localhost:8000/demo-board.html
```

## Tích hợp với AI Module

Module này tương thích với `TTT_AI` module:

```javascript
// AI thực hiện nước đi
const aiMove = TTT_AI.findBestMove(gameState.board, 2);
if (aiMove !== -1) {
  gameState = BoardManager.makeMove(gameState, aiMove);
}
```
