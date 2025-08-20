# Board Component Documentation

## Tổng quan

Board Component là một UI component responsive được thiết kế để hiển thị và tương tác với bàn cờ Tic Tac Toe. Component này hỗ trợ các kích thước 3x3, 4x4, 5x5 và có thể hoạt động trên cả desktop và mobile.

## Tính năng chính

- ✅ Responsive design cho mobile/tablet/desktop
- ✅ Hỗ trợ touch events và click events
- ✅ Keyboard navigation (Tab + Enter/Space)
- ✅ ARIA accessibility support
- ✅ Event-driven architecture
- ✅ Animation support
- ✅ Theme support
- ✅ Cleanup và memory management

## Cài đặt

```javascript
import { BoardComponent } from "./shared/ui/board.js";
```

## Sử dụng cơ bản

### 1. Khởi tạo component

```javascript
const board = new BoardComponent();
```

### 2. Tạo bàn cờ

```javascript
// Tạo bàn cờ 3x3
const boardElement = board.createBoard(3, document.getElementById("board-container"));

// Tạo bàn cờ 4x4
const boardElement = board.createBoard(4, document.getElementById("board-container"));

// Tạo bàn cờ 5x5
const boardElement = board.createBoard(5, document.getElementById("board-container"));
```

### 3. Cập nhật trạng thái bàn cờ

```javascript
// Mảng trạng thái: null = trống, 1 = X, 2 = O
const boardState = [1, null, 2, null, 1, null, null, null, null];

// Cập nhật với animation
board.updateBoard(boardState, {
  animate: true,
  lastMove: 0, // Index của nước đi cuối cùng
});

// Cập nhật không có animation
board.updateBoard(boardState, { animate: false });
```

### 4. Lắng nghe sự kiện

```javascript
// Lắng nghe sự kiện click vào ô
board.on("cell:click", (data) => {
  console.log("Cell clicked:", data.index);
  console.log("Event type:", data.type); // 'click', 'touch', 'keyboard'
  console.log("Timestamp:", data.timestamp);

  // Xử lý logic game ở đây
  handlePlayerMove(data.index);
});
```

### 5. Cleanup

```javascript
// Xóa component và giải phóng memory
board.destroy();
```

## API Reference

### Constructor

```javascript
new BoardComponent();
```

### Methods

#### `createBoard(size, target)`

Tạo bàn cờ mới với kích thước được chỉ định.

**Parameters:**

- `size` (number): Kích thước bàn cờ (3, 4, hoặc 5)
- `target` (HTMLElement): Element cha để chèn bàn cờ

**Returns:** HTMLElement - Element bàn cờ đã tạo

**Throws:** Error nếu size không hợp lệ

#### `updateBoard(board, options)`

Cập nhật trạng thái bàn cờ.

**Parameters:**

- `board` (Array): Mảng trạng thái các ô
- `options` (Object): Tùy chọn cập nhật
  - `animate` (boolean): Có animation không (mặc định: true)
  - `lastMove` (number|null): Index của nước đi cuối cùng

#### `on(event, callback)`

Đăng ký event listener.

**Parameters:**

- `event` (string): Tên sự kiện (ví dụ: 'cell:click')
- `callback` (Function): Hàm xử lý sự kiện

#### `off(event, callback)`

Hủy đăng ký event listener.

**Parameters:**

- `event` (string): Tên sự kiện
- `callback` (Function): Hàm xử lý sự kiện cần hủy

#### `destroy()`

Xóa component và cleanup.

### Events

#### `cell:click`

Phát ra khi người dùng click/touch vào ô trống.

**Event Data:**

```javascript
{
  index: number,        // Index của ô (0-based)
  type: string,         // Loại tương tác: 'click', 'touch', 'keyboard'
  cell: HTMLElement,    // Element của ô
  timestamp: number     // Thời gian tương tác
}
```

## CSS Classes

### Container

- `.board-container`: Container chính của bàn cờ
- `.board-grid`: Grid chứa các ô
- `.board-3x3`, `.board-4x4`, `.board-5x5`: Kích thước grid

### Cells

- `.board-cell`: Ô trong bàn cờ
- `.cell-content`: Nội dung của ô
- `.cell-x`: Ô chứa X
- `.cell-o`: Ô chứa O
- `.cell-hover`: Trạng thái hover
- `.cell-pop`: Animation khi điền

## Responsive Design

Component tự động responsive với các breakpoint:

- **Mobile** (≤480px): Ô nhỏ, padding thấp
- **Tablet** (481px-768px): Ô trung bình
- **Desktop** (≥769px): Ô lớn, padding cao

## Accessibility

- **ARIA roles**: `grid`, `gridcell`
- **Keyboard navigation**: Tab để di chuyển, Enter/Space để chọn
- **Screen reader support**: Labels mô tả trạng thái ô
- **High contrast support**: Tự động điều chỉnh theo user preference
- **Reduced motion support**: Tắt animation nếu user yêu cầu

## Theme Support

Component sử dụng CSS variables từ theme system:

```css
:root {
  --panel-bg: rgba(15, 23, 42, 0.6);
  --panel-border: rgba(255, 255, 255, 0.12);
  --brand-primary: #8b5cf6;
  --brand-accent: #3b82f6;
  --text-primary: #f8fafc;
}
```

## Ví dụ hoàn chỉnh

```javascript
import { BoardComponent } from "./shared/ui/board.js";

class GameManager {
  constructor() {
    this.board = new BoardComponent();
    this.gameState = null;

    this.init();
  }

  init() {
    // Lắng nghe sự kiện click
    this.board.on("cell:click", (data) => {
      this.handlePlayerMove(data.index);
    });

    // Tạo bàn cờ mặc định
    this.createNewGame(3);
  }

  createNewGame(size) {
    // Khởi tạo trạng thái game
    this.gameState = {
      board: new Array(size * size).fill(null),
      currentPlayer: 1,
      gameStatus: "playing",
    };

    // Tạo UI
    this.board.createBoard(size, document.getElementById("game-board"));

    // Cập nhật hiển thị
    this.updateDisplay();
  }

  handlePlayerMove(index) {
    if (this.gameState.gameStatus !== "playing") return;
    if (this.gameState.board[index] !== null) return;

    // Thực hiện nước đi
    this.gameState.board[index] = this.gameState.currentPlayer;

    // Cập nhật UI với animation
    this.board.updateBoard(this.gameState.board, {
      animate: true,
      lastMove: index,
    });

    // Kiểm tra kết quả
    this.checkGameResult();

    // Đổi lượt chơi
    this.gameState.currentPlayer = this.gameState.currentPlayer === 1 ? 2 : 1;
  }

  updateDisplay() {
    this.board.updateBoard(this.gameState.board, { animate: false });
  }

  checkGameResult() {
    // Logic kiểm tra thắng/thua
    // ...
  }

  destroy() {
    this.board.destroy();
  }
}

// Sử dụng
const game = new GameManager();
```

## Testing

### Demo files

- `demo-board-simple.html`: Demo đơn giản để test component
- `tests/board.test.js`: Unit tests cho component

### Chạy demo

1. Mở `demo-board-simple.html` trong browser
2. Chọn kích thước bàn cờ
3. Click "Create Board"
4. Test các tính năng: click, touch, keyboard, responsive

## Troubleshooting

### Lỗi thường gặp

1. **"BoardComponent not available"**

   - Đảm bảo import đúng file
   - Kiểm tra đường dẫn file

2. **Board không hiển thị**

   - Kiểm tra target element có tồn tại không
   - Kiểm tra CSS có được load không

3. **Events không hoạt động**
   - Đảm bảo đã gọi `createBoard()` trước khi lắng nghe events
   - Kiểm tra callback function có đúng syntax không

### Debug

```javascript
// Log tất cả events
board.on("cell:click", (data) => {
  console.log("Board event:", data);
});

// Kiểm tra trạng thái component
console.log("Board element:", board.element);
console.log("Board size:", board.size);
console.log("Event listeners:", board.eventListeners);
```

## Performance

- Component sử dụng event delegation để tối ưu memory
- Chỉ cập nhật DOM khi cần thiết
- Cleanup tự động khi destroy
- Touch events được debounce để tránh spam

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

Component này là một phần của dự án Tic Tac Toe, được phát triển bởi ACE Team.
