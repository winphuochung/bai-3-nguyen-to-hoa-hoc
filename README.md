# HƯỚNG DẪN TRIỂN KHAI VÀ SỬ DỤNG ỨNG DỤNG HỌC TẬP KHTN 7
## BÀI 3: NGUYÊN TỐ HÓA HỌC (BỘ KẾT NỐI TRI THỨC VỚI CUỘC SỐNG)

---

### 1. Cấu trúc mã nguồn dự án

```
d:/APP-HOC-TAP/Bai3-nguyen-to-hoa-hoc/
├── app/                          # Toàn bộ mã nguồn ứng dụng web
│   ├── index.html                # Giao diện chính phân khu Học sinh & Giáo viên
│   ├── css/
│   │   └── styles.css            # Hệ thống màu và giao diện hiện đại (Modern EdTech UI)
│   ├── js/
│   │   ├── data.js               # Cơ sở dữ liệu 20 nguyên tố, câu hỏi trắc nghiệm, tự luận, triệu phú
│   │   └── app.js                # Logic điều hướng, tính điểm, game show và gửi dữ liệu real-time
│   └── assets/
│       └── logo.png              # Logo của ứng dụng
├── gas-backend/
│   └── Code.gs                   # Mã nguồn Google Apps Script đồng bộ Google Sheets
└── README.md                     # Tài liệu hướng dẫn sử dụng
```

---

### 2. Hướng dẫn Mở và Trải nghiệm Ứng dụng ngay lập tức
1. Mở thư mục `app/` và bấm đúp chuột vào tệp [index.html](file:///d:/APP-HOC-TAP/Bai3-nguyen-to-hoa-hoc/app/index.html) để chạy trực tiếp trên bất kỳ trình duyệt nào (Chrome, Edge, Cốc Cốc, Firefox...).
2. Các chức năng có sẵn:
   - **Bảng 3.1 Tương tác:** Tìm kiếm theo tên/kí hiệu/số Z, lọc theo loại nguyên tố (Kim loại, Phi kim, Á kim, Khí hiếm) và bấm vào thẻ để xem ứng dụng chi tiết.
   - **Hình 3.2 Cơ thể người:** Tỉ lệ phần trăm nguyên tố được trực quan hóa, phân tích lý do Oxygen chiếm 65% khối lượng cơ thể.
   - **Đa phương tiện & Thí nghiệm Ảo:** Tích hợp mô phỏng thí nghiệm **PhET Build an Atom** (kéo thả proton, electron) và video bài giảng YouTube tóm tắt.
   - **Luyện tập Trắc nghiệm & Tự luận:** 10 câu trắc nghiệm tự động chấm kèm giải thích chi tiết, 3 câu tự luận sâu.
   - **Ai là triệu phú Hóa học:** 15 mốc thưởng kịch tính kèm 2 quyền trợ giúp (50/50, Hỏi ý kiến khán giả).

---

### 3. Phân quyền và Mật mã Giáo viên
- **Dành cho Học sinh:**
  - Nhấp vào biểu tượng tên học sinh ở góc trên bên phải thanh navbar để đổi Họ & Tên / Mã số học sinh.
  - Không cần mật khẩu đăng nhập.
- **Dành cho Giáo viên:**
  - Nhấp vào nút **🔐 Giáo viên** ở góc trên cùng bên phải.
  - Mật khẩu đăng nhập mặc định: **`123456`**.
  - Vào Bảng điều khiển Giáo viên để xem bảng điểm thời gian thực, chi tiết bài làm tự luận của từng học sinh và quản lý kết nối Google Sheets.

---

### 4. Kết nối Real-time với Google Sheets (Backend)
1. Tạo 1 file Google Sheets mới trên Google Drive cá nhân của thầy/cô.
2. Trên thanh menu Google Sheets, chọn **Tiện ích mở rộng (Extensions) > Apps Script**.
3. Sao chép nội dung tệp [Code.gs](file:///d:/APP-HOC-TAP/Bai3-nguyen-to-hoa-hoc/gas-backend/Code.gs) dán vào cửa sổ biên tập Apps Script.
4. Bấm **Triển khai (Deploy) > Tùy chọn triển khai mới (New deployment)**.
5. Thiết lập:
   - **Loại:** Ứng dụng web (Web app).
   - **Thực thi dưới dạng (Execute as):** Tôi (Me).
   - **Ai có quyền truy cập (Who has access):** Bất kỳ ai (Anyone).
6. Bấm Triển khai và sao chép đường link **Web App URL**.
7. Mở ứng dụng, vào tab **Bảng Giáo viên**, dán link Web App URL vào ô **Cấu hình Real-time Webhook** rồi bấm **Lưu kết nối**.
8. Kể từ lúc này, mọi bài nộp của học sinh (Trắc nghiệm, Tự luận, Game Triệu Phú) sẽ tự động thêm 1 dòng mới vào Google Sheet của thầy/cô ngay lập tức!
