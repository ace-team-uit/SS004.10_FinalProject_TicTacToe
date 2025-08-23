# Game Mode 1 - Difficulty Selection Screen

## Mô tả

Màn hình chọn độ khó của game, cho phép người chơi chọn giữa 3 mức độ: Easy, Medium, Hard.

## Cấu trúc file

- `mode1.html` - HTML structure của màn hình
- `mode1.css` - Styles và responsive design
- `mode1.screen.js` - Logic xử lý và event handlers

## Chức năng chính

### UI Components

- **Logo**: Hiển thị logo ACE ở đầu màn hình
- **Difficulty Selection**: 3 hình ảnh buttons chọn độ khó
  - Easy: Hình ảnh button với text "EASY" và icon xanh lá
  - Medium: Hình ảnh button với text "MEDIUM" và icon tím
  - Hard: Hình ảnh button với text "HARD" và icon cam/đỏ
- **Back Button**: Hình ảnh nút quay lại màn hình Select Game

### Interactions

- Click chọn độ khó → Lưu vào game state → Chuyển sang Game Mode 2
- Click nút back → Quay lại màn hình Select Game
- Hover effects với scale animation
- Sound effects khi click (nếu có)

### Design Approach

- **Image-based UI**: Sử dụng hình ảnh buttons trực tiếp từ `assets/images/game-mode-1/`
- **No text overlays**: Tất cả text đã có sẵn trong hình ảnh
- **Mobile-first**: Layout cố định cho mobile app, không responsive
- **Simple interactions**: Hover effects với scale transform

## State Management

- Lưu độ khó đã chọn vào `window.gameState.difficulty`
- Fallback: Lưu vào `localStorage.gameDifficulty`

## Navigation Flow

```
Select Game → Game Mode 1 (Difficulty) → Game Mode 2 (Grid Size)
```

## Dependencies

- `styles/variables.css` - CSS variables và design tokens
- `styles/screens.css` - Base screen styles
- `assets/images/game-mode-1/` - Difficulty icons
- `assets/images/common/` - Back button icon

## Technical Notes

- Sử dụng `<img>` elements thay vì `<button>` elements
- CSS đơn giản, tập trung vào layout và hover effects
- Không có responsive design - cố định cho mobile
- Hover effects sử dụng CSS transform scale
