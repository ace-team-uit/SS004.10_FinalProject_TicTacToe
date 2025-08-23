# Game Page - Main Game Screen

## Mô tả

Màn hình chơi chính của game Tic-Tac-Toe, hiển thị bàn cờ, thông tin người chơi, và các controls.

## Cấu trúc file

- `game.html` - HTML structure của màn hình game
- `game.css` - Styles và layout cho game UI
- `game.screen.js` - Logic xử lý UI và interactions

## Chức năng chính

### UI Components

#### **Game Header:**

- **Left Player Profile**: Avatar với crown icon, mark "O" màu xanh
- **Game Status Center**:
  - 3 stars (2 filled, 1 empty) để hiển thị progress
  - Progress bar màu xanh lá
  - Score display "1:0"
- **Right Player Profile**: Avatar alien, mark "X" màu tím

#### **Game Board:**

- **Dynamic Grid**: 3x3, 4x4, hoặc 5x5 tùy theo selection từ Mode 2
- **Interactive Cells**: Click vào ô trống để đánh X/O
- **Visual Effects**: Hover effects, gradient text cho X/O
- **Responsive Layout**: Tự động điều chỉnh theo grid size

#### **Control Buttons:**

- **Music Button**: Bật/tắt âm thanh, lưu state vào localStorage
- **Reset Button**: Reset game và board
- **Settings Button**: Chuyển sang Settings page

### Design Approach

- **Space Theme**: Background cosmic từ `background-01.png`
- **Player Avatars**: Sử dụng `player1-avatar.png` và `player2-avatar.png`
- **Game Elements**: Sử dụng `icon-display-board.png` cho cells và marks
- **Stars**: Sử dụng `star-filled.png` và `star-empty.png`
- **Control Buttons**: Sử dụng assets từ thư mục `common`
- **Mobile-First**: Layout cố định cho mobile app

### Interactions

- **Board Interaction**: Click vào ô trống → đánh X/O
- **Music Control**: Toggle music state, lưu vào localStorage
- **Game Reset**: Reset board và score
- **Navigation**: Chuyển sang Settings page
- **Sound Effects**: Click sounds cho tất cả interactions

### State Management

- **Grid Size**: Lấy từ `window.gameState.gridSize` hoặc `localStorage.gameGridSize`
- **Music State**: Lưu vào `localStorage.musicEnabled`
- **Game State**: Mock data cho UI testing (sẽ được thay thế bởi game logic)

## Technical Implementation

### **Dynamic Board Generation:**

```javascript
function generateBoardCells(gridSize) {
  const size = parseInt(gridSize.split("x")[0]);
  const totalCells = size * size;
  // Generate cells dynamically
}
```

### **Grid Size Support:**

- **3x3**: 9 cells, default size
- **4x4**: 16 cells, medium size
- **5x5**: 25 cells, large size

### **CSS Grid Classes:**

```css
.board-3x3 {
  grid-template-columns: repeat(3, 1fr);
}
.board-4x4 {
  grid-template-columns: repeat(4, 1fr);
}
.board-5x5 {
  grid-template-columns: repeat(5, 1fr);
}
```

### **Cell Styling:**

- **Empty**: Transparent background, hover effects
- **X Mark**: Pink-purple gradient với glow effect
- **O Mark**: Blue gradient với glow effect
- **Interactive**: Cursor pointer, hover animations

## Dependencies

- `styles/variables.css` - CSS variables và design tokens
- `styles/screens.css` - Base screen styles
- `styles/components.css` - Board component styles
- `assets/images/game/` - Player avatars và control icons
- `assets/images/common/` - Background images

## Mock Data

### **Sample Board State:**

- Cell 1: X (top-middle)
- Cell 3: X (middle-left)
- Cell 4: O (center)
- Other cells: Empty

### **UI Testing Features:**

- Click cells để đánh X/O
- Toggle music button
- Reset game button
- Navigation to settings

## Notes

- **No Game Logic**: Chỉ xử lý UI và interactions
- **Mock Data**: Sử dụng sample data để test UI
- **Responsive Grid**: Tự động điều chỉnh theo grid size
- **Local Storage**: Lưu music state và grid size
- **Sound Integration**: Hỗ trợ click sounds và BGM
