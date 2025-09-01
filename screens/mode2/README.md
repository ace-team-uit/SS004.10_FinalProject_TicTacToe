# Game Mode 2 - Grid Size Selection Screen

## Mô tả

Màn hình chọn kích thước lưới của game, cho phép người chơi chọn giữa 3 kích thước: 3x3, 4x4, 5x5.

## Cấu trúc file

- `mode2.html` - HTML structure của màn hình
- `mode2.css` - Styles và layout cơ bản
- `mode2.screen.js` - Logic xử lý và event handlers

## Chức năng chính

### UI Components

- **Logo**: Hiển thị logo ACE ở đầu màn hình
- **Grid Selection**: 3 hình ảnh buttons chọn kích thước lưới
  - 3x3: Hình ảnh button với text "3x3"
  - 4x4: Hình ảnh button với text "4x4"
  - 5x5: Hình ảnh button với text "5x5"
- **Back Button**: Hình ảnh nút quay lại màn hình Game Mode 1

### Design Approach

- **Image-based UI**: Sử dụng hình ảnh buttons trực tiếp từ `assets/images/mode2/`
- **No text overlays**: Tất cả text đã có sẵn trong hình ảnh
- **Mobile-first**: Layout cố định cho mobile app, không responsive
- **Simple interactions**: Hover effects với scale transform

### Interactions

- Click chọn kích thước lưới → Lưu vào game state → Chuyển sang Game screen
- Click nút back → Quay lại màn hình Game Mode 1
- Hover effects với scale animation
- Sound effects khi click (nếu có)

### State Management

- Lưu kích thước lưới đã chọn vào `window.gameState.gridSize`
- Fallback: Lưu vào `localStorage.gameGridSize`

## Navigation Flow

```
Select Game → Game Mode 1 (Difficulty) → Game Mode 2 (Grid Size) → Game
```

## Dependencies

- `styles/variables.css` - CSS variables và design tokens
- `styles/screens.css` - Base screen styles
- `assets/images/mode2/` - Grid size button images
- `assets/images/common/` - Back button image

## Technical Notes

- Sử dụng `<img>` elements thay vì `<button>` elements
- CSS đơn giản, tập trung vào layout và hover effects
- Không có responsive design - cố định cho mobile
- Hover effects sử dụng CSS transform scale
