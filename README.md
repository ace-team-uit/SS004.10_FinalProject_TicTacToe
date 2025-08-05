# Đồ án cuối kỳ – Môn Kỹ năng Nghề Nghiệp [SS004.10]

## Thông tin nhóm

- **Tên nhóm**: Nhóm số 11 (ACE Team)
- **Số thành viên**: 5
- **Công nghệ sử dụng**: HTML, CSS, JavaScript (DOM, Animation)
- **Công cụ hỗ trợ làm việc nhóm**:
  - Quản lý công việc: [Github Projects](https://github.com/orgs/ace-team-uit/projects/1)
  - Giao tiếp nhóm: [Slack channel](https://ss004e31.slack.com/archives/C098L65A0Q5) hoặc Discord (nội bộ)
  - Biên bản họp: [Meeting minutes](https://ss004e31.slack.com/archives/C098L65A0Q5)
  - Viết báo cáo: [Overleaf (LaTeX)](https://www.overleaf.com/read/yvjnrzvvnfxr#a8c167)
  - Lưu trữ mã nguồn: [GitHub repo](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe)

## Thành viên nhóm

| Họ và tên         | MSSV     | GitHub cá nhân                                                        |
| ----------------- | -------- | --------------------------------------------------------------------- |
| Đặng Chí Thanh    | 25730067 | [uit-25730067-chithanh](https://github.com/uit-25730067-chithanh)     |
| Đào Vĩnh Bảo Phúc | 25730053 | [uit-25730053-baophuc](https://github.com/uit-25730053-baophuc)       |
| Phạm Lê Yến Nhi   | 25730049 | [uit-25730049-yennhi](https://github.com/uit-25730049-yennhi)         |
| Tăng Phước Thịnh  | 25730071 | [uit-25730071-phuocthinh](https://github.com/uit-25730071-phuocthinh) |
| Hoàng Cao Sơn     | 25730061 | [uit-25730061-caoson](https://github.com/uit-25730061-caoson)         |

## Giảng viên hướng dẫn

- **Họ tên**: Nguyễn Văn Toàn
- **Mã cán bộ**: UIT.19529999
- **Email**: toannv@uit.edu.vn
- **GitHub**: [toannv-uit](https://github.com/toannv-uit)

## Tên dự án

Trò chơi Cờ Caro – Tic Tac Toe (phiên bản Web)

## Giới thiệu

Đây là sản phẩm của đồ án cuối kỳ môn học Kỹ năng Nghề Nghiệp [SS004.10], được phát triển theo nhóm nhằm thể hiện kỹ năng làm việc nhóm, lập kế hoạch, giao tiếp và sử dụng công cụ chuyên nghiệp trong quy trình phát triển phần mềm.

Trò chơi được xây dựng hoàn toàn bằng HTML, CSS và JavaScript, với giao diện đơn giản, dễ sử dụng và có yếu tố tương tác thông qua animation và hiệu ứng hiển thị. Người chơi có thể trải nghiệm từ trang giới thiệu đến giao diện chơi chính, có các popup tương tác khi thắng/thua.

Game hỗ trợ:

- Chế độ Người vs Máy
- Tùy chọn kích thước lưới (3x3, 4x4, 5x5)
- Tính điểm theo trận: thắng 2/3 để chiến thắng chung cuộc
- Hệ thống trái tim nếu hoà, popup thông báo kết quả
- Tùy chỉnh âm thanh, độ khó, theme trong phần Settings
- Giao diện thân thiện, hỗ trợ cả tiếng Anh và tiếng Việt

## Hướng dẫn sử dụng (đang cập nhật...)

1. Mở tệp `index.html` bằng trình duyệt web hiện đại (Chrome, Firefox,...).
2. Xem phần giới thiệu, chọn chế độ chơi trong màn hình Select.
3. Tuỳ chỉnh Theme, Challenge Mode, Âm thanh trong Settings.
4. Chọn kiểu lưới (3x3, 4x4, 5x5), bắt đầu trò chơi.
5. Mỗi lượt có giới hạn thời gian. Người chơi thắng 2/3 trận sẽ thắng chung cuộc.
6. Có thể chọn chơi lại hoặc quay về màn hình chính sau mỗi ván.

## Cấu trúc thư mục

- `/assets/`: Thư mục chứa hình ảnh, biểu tượng, âm thanh (nếu có).
- `/pages/`: Chứa các tệp giao diện cho từng màn hình.
  - `intro.html`: Trang giới thiệu, credit nhóm
  - `home.html`: Trang chính với nút "Let's Play"
  - `select.html`: Trang chọn chế độ chơi
  - `settings.html`: Giao diện cài đặt
  - `game.html`: Giao diện chính để chơi cờ
- `/scripts/`: Các tệp JavaScript xử lý logic và animation.
  - `game.js`: Logic xử lý lượt đi, xác định thắng/thua.
  - `ui.js`: Quản lý giao diện, popup, hiệu ứng.
- `/styles/`: Các tệp CSS thiết kế giao diện người dùng.
  - `main.css`: Định dạng chung toàn bộ trò chơi.
- `README.md`: Tài liệu mô tả dự án.

## Các màn hình giao diện chính

1. **Intro Page**: Hiện tên nhóm, logo, hiệu ứng giới thiệu sản phẩm
2. **Home Page**: Trang chính với nút “Let's Play”
3. **Select Game Page**: Chọn chế độ chơi, chọn biểu tượng nhân vật
4. **Settings Page**: Cập nhật độ khó, theme, ngôn ngữ, bật/tắt âm thanh, về chúng tôi
5. **Game Page**: Giao diện chơi chính, hiển thị lưới, thời gian, popup khi kết thúc
6. **Popup & Loading**: Thông báo kết quả, chuyển màn hình, Draw/Win/Lose

## Ghi chú triển khai

- Game sẽ chỉ hỗ trợ chế độ Người vs Máy
- Logic tách biệt thành các hàm độc lập (renderGridBoard, renderRound, renderResult, resetGame)
- Giao diện đơn giản, dễ mở rộng, dễ kiểm thử
- Có hệ thống âm thanh và cài đặt tương tác qua Settings

<!-- ## Tài liệu nội bộ

🔒 Tài liệu nội bộ của nhóm được quản lý riêng thông qua hệ thống Wiki trên GitHub (private).
Nếu là giảng viên, bạn có thể liên hệ nhóm qua Slack để được chia sẻ quyền truy cập nếu cần. -->

## Đóng góp và bản quyền

Dự án được thực hiện bởi nhóm sinh viên lớp CN1.K2025.1.TTNT – Trường Đại học Công nghệ Thông tin – ĐHQG-HCM.  
Mục đích sử dụng: học tập và trình bày kết quả môn học.  
Vui lòng không sao chép với mục đích thương mại hoặc học vụ khác mà không được sự cho phép của nhóm.
