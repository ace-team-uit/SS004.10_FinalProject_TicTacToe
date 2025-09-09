# 📊 Bảng Minh Chứng Chi Tiết Theo Rubric - ACE Team

## 📌 Bảng đánh giá thành viên nhóm (theo rubric)

| STT | Họ và tên             | Tiến độ (40%)                                                                | Chất lượng (30%)                                   | Họp nhóm (10%)                      | Cập nhật (10%)                                                    | Hợp tác (10%)                                     |
| --- | --------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------- |
| 1   | **Đặng Chí Thanh**    | 3.8 – Hoàn thành hầu hết task đúng hạn, chỉ 1 lần delay nhỏ khi chờ merge PR | 3.9 – Code đáp ứng yêu cầu, chỉ cần chỉnh nhẹ UI   | 4.0 – Tham gia đầy đủ 100% họp nhóm | 3.9 – Thường xuyên cập nhật trên GitHub/Slack, 1–2 lần trễ update | 3.9 – Chủ động hỗ trợ conflict code, review PR    |
| 2   | **Đào Vĩnh Bảo Phúc** | 3.9 – Đa số hoàn thành đúng hạn, có 1–2 task AI chậm nhẹ                     | 4.0 – Đúng yêu cầu, AI logic chạy ổn định, ít sửa  | 3.8 – Vắng 1 buổi có lý do hợp lý   | 3.8 – Cập nhật tiến độ khá đầy đủ, nhưng đôi lúc thiếu chi tiết   | 3.9 – Hỗ trợ khi được nhờ, tham gia review AI     |
| 3   | **Phạm Lê Yến Nhi**   | 3.9 – Luôn giữ đúng tiến độ, hoàn tất module UI đúng hạn                     | 4.0 – Chất lượng code tốt, hầu như không cần chỉnh | 4.0 – Tham gia đầy đủ, đúng giờ     | 3.9 – Cập nhật kịp thời trên GitHub và Slack                      | 3.9 – Hợp tác tích cực, phản hồi nhanh trên Slack |
| 4   | **Tăng Phước Thịnh**  | 4.0 – Hoàn thành trước hạn nhiều task (Board component, Setting Page)        | 3.9 – Đúng yêu cầu, có chỉnh nhẹ về logic          | 3.8 – Vắng 1 buổi do bận lịch       | 4.0 – Luôn cập nhật đầy đủ tiến độ                                | 3.9 – Thường xuyên hỗ trợ xử lý conflict code     |
| 5   | **Hoàng Cao Sơn**     | 3.9 – Hoàn thành task giao diện đúng hạn                                     | 3.8 – Có vài lỗi nhỏ về UI cần sửa                 | 3.9 – Tham gia hầu hết các buổi họp | 3.8 – Thỉnh thoảng quên cập nhật tiến độ                          | 4.0 – Hỗ trợ tốt khi review và fix bug UI         |

---

## 📌 Các Conflict Tiêu Biểu & Minh Chứng GitHub

### **Hôm qua (07/09):**
* **Task**: *Setting Page* vốn của anh Thanh, nhưng vì bận nên nhờ Thịnh làm.
* **Quy trình**: Thịnh code trước → tạo PR → nhờ anh Sơn xử lý phần *Navigate*.
* **Vấn đề**: Anh Sơn quên pull code mới nhất từ branch của Thịnh về trước khi tiếp tục.
* **Kết quả**: Dẫn đến conflict ở branch của anh Sơn.

**🔗 Minh chứng GitHub:**
- **PR Settings Page**: [#93](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/93) - [1.4][CODING][UI] | Settings Page
- **PR Settings Navigation**: [#94](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/94) - [1.4][CODING][FUNCTION] | Settings Navigation Tracking
- **Commit conflict fix**: `1ae35d2` - fix(merge): resolve conflict in settings.screen.js
- **Commit restore**: `d8fa8b6` - fix(settings): restore smart navigation for back button
- **Commit fix newline**: `a30c24b` - fix(settings): fix newline at end of file in settings.screen.js

### **Ngày 20/08:**
* **Task**: *Âm thanh và Nhạc nền* do anh Sơn phụ trách.
* **Quy trình**: Anh Sơn code trước → tạo PR → Thanh merge code của anh Sơn vào `develop`.
* **Vấn đề**: Trong lúc đó, Thịnh cũng đang làm task *Board component* trong *Game Page*. Thịnh pull code từ `develop` (đã có code của anh Sơn).
* **Kết quả**: Dẫn đến conflict ở branch của Thịnh.

**🔗 Minh chứng GitHub:**
- **PR Audio Module**: [#75](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/75) - [1.4][CODING] | Cell Color Form Marketplace & Audio Module Refactor
- **PR Popup Audio**: [#82](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/82) - [1.4][CODING][UI] | Popup (Access audio + Win - Lose - Draw + Exit)
- **Commit audio fix**: `08df291` - fix(music/disableCell): Fix toggle music to enable/disable sound and disable cell after completing a move
- **Commit audio fix 2**: `36c329a` - fix(music/disableCell): Fix toggle music to enable/disable sound and disable cell after completing a move

---

## 📌 Minh Chứng Hoạt Động Cá Nhân

### **Đặng Chí Thanh** (MSSV: 25730067)
**🔗 GitHub Profile**: [uit-25730067-chithanh](https://github.com/uit-25730067-chithanh)

**Các PR/Commit chính:**
- [#82](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/82) - [1.4][CODING][UI] | Popup (Access audio + Win - Lose - Draw + Exit) - **Merged last week**
- [#70](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/70) - [1.4][CODING][UI] | Marketplace Page - **Merged 2 weeks ago**
- [#69](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/69) - [1.4][CODING][UI] | Style check (New logo, background and resize application frame) - **Merged 2 weeks ago**
- [#68](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/68) - [1.4][CODING][UI] | Game Page - **Merged 2 weeks ago** • **Approved**
- [#65](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/65) - [1.4][CODING][UI] | Game Mode 2 (Chọn kích thước bàn) - **Merged 2 weeks ago**
- [#64](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/64) - [1.4][CODING][UI] | Game Mode 1 (Chọn độ khó) - **Merged 2 weeks ago**
- [#63](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/63) - [1.4][CODING][UI] | Select Game Page - **Merged 2 weeks ago**
- [#62](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/62) - [1.3][CODING][UI] | Home Page - **Merged 3 weeks ago**
- [#57](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/57) - [1.3][CODING][UI] | Intro Page - **Merged 3 weeks ago**
- [#55](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/55) - [1.3][CODING][UI] | Global UI Styles & Config - **Merged 3 weeks ago**

### **Đào Vĩnh Bảo Phúc** (MSSV: 25730053)
**🔗 GitHub Profile**: [uit-25730053-baophuc](https://github.com/uit-25730053-baophuc)

**Các PR/Commit chính:**
- [#77](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/77) - [1.4][CODING] | Làm cho AI mất nhiều thời gian hơn để suy nghĩ - **Merged last week** • **Changes requested**
- [#76](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/76) - [1.4][CODING] | AI chiến lược: Easy & Medium & Hard - **Merged last week** • **Changes requested**
- [#58](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/58) - [1.3][CODING] | AI core: Minimax & Đánh giá bàn cờ - **Merged 3 weeks ago**
- [#27](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/27) - [CODING] | Codebase structure - **Merged last month**

### **Phạm Lê Yến Nhi** (MSSV: 25730049)
**🔗 GitHub Profile**: [uit-25730049-yennhi](https://github.com/uit-25730049-yennhi)

**Các PR/Commit chính:**
- [#96](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/96) - [1.5][DOCS] | Update Project Overview And Architecture Details - **Merged 2 days ago**
- [#95](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/95) - [1.5][DOCS] | Viết phụ lục Test case + Performance Log - **Merged 2 days ago**
- [#67](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/67) - [1.4][CODING] | Quản lý đồng hồ lượt chơi - **Merged 2 weeks ago**
- [#66](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/66) - [1.4][CODING] | Quản lý vòng đấu & điểm số - **Merged 2 weeks ago**
- [#59](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/59) - [1.3][CODING] | Quản lý trạng thái bàn cờ - **Merged 3 weeks ago**

### **Tăng Phước Thịnh** (MSSV: 25730071)
**🔗 GitHub Profile**: [uit-25730071-phuocthinh](https://github.com/uit-25730071-phuocthinh)

**Các PR/Commit chính:**
- [#93](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/93) - [1.4][CODING][UI] | Settings Page - **Merged 2 days ago**
- [#73](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/73) - [1.4][CODING][UI] | HUD / Header component - **Merged last week**
- [#61](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/61) - [1.3][CODING][UI] | Board component (responsive) - **Merged 3 weeks ago**

### **Hoàng Cao Sơn** (MSSV: 25730061)
**🔗 GitHub Profile**: [uit-25730061-caoson](https://github.com/uit-25730061-caoson)

**Các PR/Commit chính:**
- [#94](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/94) - [1.4][CODING][FUNCTION] | Settings Navigation Tracking - **Merged 2 days ago** • **Changes requested**
- [#75](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/75) - [1.4][CODING] | Cập nhật màu của người chơi dựa trên setting đã lưu trong màn hình Marketplace - **Merged last week** • **Changes requested**
- [#74](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/74) - [1.4][CODING] | Điều hướng & Lưu các Settings vào trong bộ nhớ - **Merged last week**
- [#60](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe/pull/60) - [1.3][CODING] | Khởi tạo âm thanh & Nhạc nền - **Merged 3 weeks ago**

---

## 📌 Tổng Kết Đánh Giá

### **Điểm Trung Bình Nhóm:**
- **Tiến độ**: 3.9/4.0 (97.5%)
- **Chất lượng**: 3.9/4.0 (97.5%)
- **Họp nhóm**: 3.9/4.0 (97.5%)
- **Cập nhật**: 3.9/4.0 (97.5%)
- **Hợp tác**: 3.9/4.0 (97.5%)

### **Điểm Tổng Kết: 19.5/20.0 (97.5%)**

### **Nhận Xét Chung:**
- Nhóm hoạt động rất tích cực và hiệu quả
- Có sự hỗ trợ lẫn nhau tốt khi gặp conflict
- Code quality đạt chuẩn, ít lỗi cần sửa
- Tham gia họp nhóm đầy đủ và đúng giờ
- Cập nhật tiến độ thường xuyên trên GitHub và Slack

---

## 📌 Thông Tin Dự Án

- **Repository**: [SS004.10_FinalProject_TicTacToe](https://github.com/ace-team-uit/SS004.10_FinalProject_TicTacToe)
- **GitHub Projects**: [Project Management](https://github.com/orgs/ace-team-uit/projects/1)
- **Slack Channel**: [ss004e31.slack.com](https://ss004e31.slack.com/archives/C098L65A0Q5)
- **Báo cáo Overleaf**: [LaTeX Report](https://www.overleaf.com/read/yvjnrzvvnfxr#a8c167)

---

*Tài liệu này được tạo tự động dựa trên lịch sử commit và pull request từ GitHub repository của dự án.*
