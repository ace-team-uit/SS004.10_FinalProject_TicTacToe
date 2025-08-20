# AI Core - Tic Tac Toe

## Tổng quan

AI Core cung cấp các thuật toán thông minh cho game Tic Tac Toe, bao gồm:

- **Minimax Algorithm** với Alpha-Beta Pruning
- **Board Evaluation** cho nhiều kích thước bàn cờ
- **Move Optimization** với cache và memoization

## Các hàm chính

### `findBestMove(board, player)`

Tìm nước đi tốt nhất cho AI

- **Parameters:**
  - `board`: Array đại diện bàn cờ (null = ô trống, 1 = X, 2 = O)
  - `player`: Người chơi hiện tại (mặc định: 2 - AI)
- **Returns:** Index của ô tốt nhất, -1 nếu không có nước đi

### `minimax(board, depth, alpha, beta, isMaximizing, player)`

Thuật toán Minimax với Alpha-Beta Pruning

- **Parameters:**
  - `board`: Bàn cờ hiện tại
  - `depth`: Độ sâu còn lại
  - `alpha`: Alpha value cho pruning
  - `beta`: Beta value cho pruning
  - `isMaximizing`: Có phải lượt tối đa hóa không
  - `player`: Người chơi hiện tại
- **Returns:** Điểm số tốt nhất

### `evaluateBoard(board, player)`

Đánh giá bàn cờ và trả về điểm số

- **Parameters:**
  - `board`: Bàn cờ cần đánh giá
  - `player`: Người chơi cần đánh giá
- **Returns:** Điểm số từ -1000 đến 1000

## Kích thước bàn cờ được hỗ trợ

- **3x3 (9 ô):** Độ sâu tối đa 9 (tìm kiếm toàn bộ)
- **4x4 (16 ô):** Độ sâu tối đa 6 (tối ưu thời gian)
- **5x5 (25 ô):** Độ sâu tối đa 4 (đảm bảo UX)

## Cách sử dụng

```javascript
// Khởi tạo bàn cờ 3x3
const board = new Array(9).fill(null);

// AI đi trước (player = 2)
const bestMove = TTT_AI.findBestMove(board, 2);

// Thực hiện nước đi
if (bestMove !== -1) {
  board[bestMove] = 2;
}

// Xóa cache khi cần
TTT_AI.clearCache();

// Xem thống kê cache
const stats = TTT_AI.getCacheStats();
console.log("Cache size:", stats.size);
```

## Tối ưu hóa

### Cache Management

- Tự động cache kết quả minimax
- Tự động xóa cache khi vượt quá 1000 entries
- Cache key bao gồm: board state, depth, isMaximizing, player

### Move Prioritization

- **Góc:** Ưu tiên cao nhất (chiến lược tốt nhất)
- **Cạnh:** Ưu tiên trung bình
- **Giữa:** Ưu tiên thấp
- **Các ô khác:** Ưu tiên cuối cùng

### Performance

- Alpha-Beta Pruning giảm đáng kể số node cần tính toán
- Độ sâu giới hạn phù hợp với từng kích thước bàn
- Cache tránh tính toán lại các trạng thái đã gặp

## Test Cases

File `test-ai.html` cung cấp các test case cơ bản:

1. **Win in 1:** AI phát hiện nước đi thắng ngay
2. **Block:** AI chặn nước đi thắng của đối thủ
3. **Fork:** AI xử lý tình huống fork
4. **4x4 Board:** Test với bàn cờ 4x4
5. **5x5 Board:** Test với bàn cờ 5x5
6. **Performance Test:** Đo thời gian xử lý
7. **Cache Management:** Quản lý cache

## Lưu ý

- AI mặc định chơi với player = 2 (O)
- Đảm bảo bàn cờ được khởi tạo đúng format
- Cache sẽ tự động được quản lý
- Độ sâu tối đa được tối ưu cho từng kích thước bàn
