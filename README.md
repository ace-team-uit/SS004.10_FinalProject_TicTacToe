# Đồ án cuối kỳ – Môn Kỹ năng Nghề nghiệp [SS004.10]

## Thông tin nhóm
- **Tên nhóm**: ACE Team
- **Số thành viên**: 5
- **Công nghệ sử dụng**: HTML, CSS, JavaScript (DOM, Animation)
- **Công cụ hỗ trợ làm việc nhóm**:
  - Quản lý công việc: [Github Projects](https://github.com/orgs/ace-team-uit/projects/1)
  - Giao tiếp nhóm: Discord (nội bộ)
  - Viết báo cáo: [Overleaf (LaTeX)](https://www.overleaf.com/project/6888ec4c20ea092cf579c59a)
  - Lưu trữ mã nguồn: [GitHub](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe)

## Thành viên nhóm
| Họ và tên              | MSSV      | GitHub cá nhân                                                        |
|------------------------|-----------|-----------------------------------------------------------------------|
| Đặng Chí Thanh         | 25730067  | [uit-25730067-chithanh](https://github.com/uit-25730067-chithanh)     |
| Đào Vĩnh Bảo Phúc      | 25730053  | [uit-25730053-baophuc](https://github.com/uit-25730053-baophuc)       |
| Phạm Lê Yến Nhi        | 25730049  | [uit-25730049-yennhi](https://github.com/uit-25730049-yennhi)         |
| Tăng Phước Thịnh       | 25730071  | [uit-25730071-phuocthinh](https://github.com/uit-25730071-phuocthinh) |
| Hoàng Cao Sơn          | 25730061  | [uit-25730061-caoson](https://github.com/uit-25730061-caoson)         |

## Giảng viên hướng dẫn
- **Họ tên**: Nguyễn Văn Toàn  
- **Mã cán bộ**: UIT.19529999  
- **Email**: toannv@uit.edu.vn  
- **GitHub**: [toannv-uit](https://github.com/toannv-uit)

## Tên dự án
Trò chơi Cờ Caro – Tic Tac Toe (phiên bản Web)

## Giới thiệu
Đây là sản phẩm của đồ án cuối kỳ môn học Kỹ năng Nghề nghiệp [SS004.10], được phát triển theo nhóm nhằm thể hiện kỹ năng làm việc nhóm, lập kế hoạch, giao tiếp và sử dụng công cụ chuyên nghiệp trong quy trình phát triển phần mềm.

Trò chơi được xây dựng hoàn toàn bằng HTML, CSS và JavaScript, với giao diện đơn giản, dễ sử dụng và có yếu tố tương tác thông qua animation và hiệu ứng hiển thị. Người chơi có thể trải nghiệm từ trang giới thiệu đến giao diện chơi chính, có các popup tương tác khi thắng/thua.

## Hướng dẫn sử dụng (đang cập nhật...)
1. Mở tệp `index.html` bằng trình duyệt web hiện đại (Chrome, Firefox,...).
2. Chọn màu sắc hoặc biểu tượng tại màn hình chọn người chơi.
3. Bắt đầu trò chơi và lần lượt đánh dấu vào các ô trên bàn cờ.
4. Khi một người chơi thắng hoặc hòa, hệ thống sẽ hiển thị thông báo popup.
5. Có thể chọn chơi lại hoặc quay về trang chủ.

## Cấu trúc thư mục
- `/assets/`: Thư mục chứa hình ảnh, biểu tượng, âm thanh (nếu có).
- `/pages/`: Chứa các tệp giao diện cho từng màn hình.
  - `home.html`: Trang giới thiệu ban đầu.
  - `select.html`: Trang chọn màu sắc, biểu tượng người chơi.
  - `game.html`: Giao diện chính để chơi cờ.
- `/scripts/`: Các tệp JavaScript xử lý logic và animation.
  - `game.js`: Logic xử lý lượt đi, xác định thắng/thua.
  - `ui.js`: Quản lý giao diện, popup, hiệu ứng.
- `/styles/`: Các tệp CSS thiết kế giao diện người dùng.
  - `main.css`: Định dạng chung toàn bộ trò chơi.
- `README.md`: Tài liệu mô tả dự án.

## Các màn hình giao diện chính
1. **Home Page**: Trang giới thiệu trò chơi, có nút bắt đầu.
2. **Select Page**: Chọn biểu tượng, màu sắc hoặc tên người chơi.
3. **Game Page**: Giao diện chơi chính với bàn cờ và lượt đi xen kẽ.
4. **Popup**: Xuất hiện khi người chơi thắng, thua, hòa hoặc khi đang tải.

## Ghi chú triển khai
- Trò chơi hỗ trợ chơi 2 người trên cùng một máy.
- Mỗi lượt đi có hiệu ứng animation mượt mà.
- Người chơi có thể chơi lại nhiều lần mà không cần tải lại trang.

## Tài liệu nội bộ
[Truy cập Wiki của nhóm tại đây](https://github.com/ace-team-uit/ace-wiki)

## Đóng góp và bản quyền
Dự án được thực hiện bởi nhóm sinh viên lớp CN1.K2025.1.TTNT – Trường Đại học Công nghệ Thông tin – ĐHQG-HCM.  
Mục đích sử dụng: học tập và trình bày kết quả môn học.  
Vui lòng không sao chép với mục đích thương mại hoặc học vụ khác mà không được sự cho phép của nhóm.
