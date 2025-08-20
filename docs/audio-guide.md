# Audio Module Guide

## Tổng quan

Module `shared/utils/audio.js` cung cấp hệ thống quản lý âm thanh hoàn chỉnh cho game Tic Tac Toe, bao gồm:

- **Sound Effects**: Hiệu ứng âm thanh ngắn (click, win, lose, draw)
- **Background Music (BGM)**: Nhạc nền với fade effect
- **Volume Control**: Điều chỉnh âm lượng riêng biệt cho sound và BGM
- **Mute System**: Tắt/bật toàn bộ âm thanh

## Cách sử dụng

### 1. Khởi tạo Audio System

```javascript
// Trong main.js hoặc screen script
await initAudio(); // Khởi tạo và preload tất cả assets
```

### 2. Phát Sound Effects

```javascript
// Phát âm thanh click
playSound("click");

// Phát âm thanh win/lose/draw
playSound("win");
playSound("lose");
playSound("draw");
```

### 3. Phát Background Music

```javascript
// Phát BGM cho trang home
playBgm("bgm-home");

// Chuyển sang BGM game
playBgm("bgm-game");

// Chuyển sang BGM select
playBgm("bgm-select");

// Dừng BGM hiện tại
audioManager.stopBgm();
```

### 4. Điều chỉnh Volume

```javascript
// Điều chỉnh volume sound effects (0.0 - 1.0)
audioManager.setVolume(0.8);

// Điều chỉnh volume BGM (0.0 - 1.0)
audioManager.setBgmVolume(0.6);

// Tắt/bật âm thanh
const isMuted = audioManager.toggleMute();
```

### 5. Lấy trạng thái Audio

```javascript
const status = audioManager.getStatus();
console.log("Audio status:", status);
// Output:
// {
//   isMuted: false,
//   volume: 1.0,
//   bgmVolume: 0.7,
//   currentBGM: "assets/sounds/bgm/Elevator.mp3",
//   soundsLoaded: 4,
//   bgmLoaded: 3
// }
```

## Thêm Sound Mới

### 1. Thêm Sound Effect

```javascript
// Trong audio.js, thêm vào soundMap
this.soundMap = {
  click: "assets/sounds/common/click.mp3",
  win: "assets/sounds/common/win.mp3",
  lose: "assets/sounds/common/lose.mp3",
  draw: "assets/sounds/common/draw.mp3",
  // Thêm sound mới
  newSound: "assets/sounds/common/new-sound.mp3",
};
```

### 2. Thêm BGM Mới

```javascript
// Trong audio.js, thêm vào bgmMap
this.bgmMap = {
  "bgm-home": "assets/sounds/bgm/Elevator.mp3",
  "bgm-game": "assets/sounds/bgm/Run-Amok.mp3",
  "bgm-select": "assets/sounds/bgm/Fluffing-a-Duck.mp3",
  // Thêm BGM mới
  "bgm-new": "assets/sounds/bgm/new-bgm.mp3",
};
```

### 3. Sử dụng trong code

```javascript
// Phát sound mới
playSound("newSound");

// Phát BGM mới
playBgm("bgm-new");
```

## Cấu trúc File Âm thanh

```
assets/sounds/
├── common/           # Sound effects
│   ├── click.mp3    # Âm thanh click
│   ├── win.mp3      # Âm thanh thắng
│   ├── lose.mp3     # Âm thanh thua
│   └── draw.mp3     # Âm thanh hòa
└── bgm/             # Background music
    ├── Elevator.mp3      # BGM trang home
    ├── Run-Amok.mp3      # BGM game
    └── Fluffing-a-Duck.mp3 # BGM select
```

## Quy ước đặt tên

### Sound Effects

- Sử dụng tên ngắn gọn, mô tả rõ mục đích
- Ví dụ: `click`, `win`, `lose`, `draw`, `hover`, `select`

### Background Music

- Prefix `bgm-` + tên trang/màn hình
- Ví dụ: `bgm-home`, `bgm-game`, `bgm-select`, `bgm-settings`

## Tính năng nâng cao

### 1. Fade Effect

BGM tự động fade in/out khi chuyển đổi:

- Fade in: 1 giây
- Fade out: 0.5 giây

### 2. Sound Overlapping

Sound effects có thể phát đồng thời:

```javascript
// Có thể click nhiều lần liên tiếp
playSound("click");
playSound("click");
playSound("click");
```

### 3. Error Handling

- Tự động xử lý lỗi 404 cho assets
- Fallback graceful khi audio không khả dụng
- Log warnings cho debugging

### 4. Performance

- Preload tất cả assets khi khởi tạo
- Sử dụng cloneNode() để tránh tạo nhiều Audio objects
- Cleanup resources tự động

## Testing

### 1. Chạy Unit Tests

```javascript
// Trong browser console
runAudioTests();
```

### 2. Demo Page

Mở `demo-audio.html` để test tương tác:

- Test tất cả sound effects
- Test BGM switching
- Test volume controls
- Test mute functionality

### 3. Console Logs

Theo dõi console để debug:

```
🎵 Audio system initialized successfully
🔊 All sound effects preloaded
🎶 All BGM preloaded
🎶 Playing BGM: bgm-home
🔊 Sound volume set to: 0.8
```

## Troubleshooting

### 1. Âm thanh không phát

- Kiểm tra browser autoplay policy
- Đảm bảo user đã tương tác với page
- Kiểm tra console errors

### 2. BGM không chuyển đổi

- Kiểm tra file BGM có tồn tại không
- Đảm bảo BGM đã được preload
- Kiểm tra volume settings

### 3. Performance issues

- Kiểm tra file audio có quá lớn không
- Sử dụng compressed audio format (MP3)
- Optimize audio quality cho web

## Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support (có thể cần user interaction)
- **Edge**: Full support
- **Mobile browsers**: Limited autoplay, cần user interaction

## Best Practices

1. **User Experience**

   - Không autoplay BGM quá to
   - Cung cấp controls để user tắt âm thanh
   - Sử dụng fade effects mượt mà

2. **Performance**

   - Preload assets cần thiết
   - Sử dụng appropriate audio quality
   - Cleanup resources khi không cần

3. **Accessibility**

   - Cung cấp visual feedback song song với audio
   - Không phụ thuộc hoàn toàn vào âm thanh
   - Hỗ trợ screen readers

4. **Mobile**
   - Test trên thiết bị thật
   - Xử lý autoplay restrictions
   - Optimize cho mobile bandwidth
