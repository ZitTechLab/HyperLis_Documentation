# Tài liệu Kiến trúc Hệ thống Custom CMS (HyperLis Docs)

Tài liệu này giải thích chi tiết cách thức hoạt động của công cụ CMS tự xây dựng (Mini CMS), dùng để chỉnh sửa tài liệu, tải ảnh và đồng bộ mã nguồn cho dự án **HyperLis Documentation**.

---

## 1. Tổng quan Kiến trúc (Architecture)

Hệ thống CMS là một ứng dụng **Node.js (Express)** chạy độc lập (cổng `3001`), hoạt động song song với môi trường phát triển của **Astro** (cổng `4321`). 
Mục tiêu là cung cấp cho đội ngũ Content một giao diện trực quan (không cần gõ lệnh) để viết bài và xuất bản trực tiếp lên Github.

**Cấu trúc thư mục lõi:**
```text
cms/
 ├── server.js          # (Backend) Logic điều khiển chính bằng Node.js & Express
 └── public/
     ├── index.html     # (Frontend) Giao diện chính của CMS (chia đôi màn hình)
     ├── style.css      # CSS cho giao diện CMS
     └── app.js         # Script điều khiển, giao tiếp với Editor và Backend API
```

---

## 2. Chi tiết các luồng xử lý (Workflow)

### A. Đọc và Ghi nội dung bài viết (.mdx)
* **Luồng Load cây thư mục:** Khi CMS khởi chạy, Frontend (`app.js`) gọi API `/api/docs/tree`. Backend (`server.js`) dùng thư viện `fs` (File System) quét qua thư mục `src/content/docs`, loại bỏ các file không cần thiết và trả về cấu trúc cây thư mục JSON.
* **Luồng Load bài viết:** Khi user click vào bài viết ở thanh Sidebar, Frontend gọi API `/api/docs/file?path=...`. Backend đọc file `.mdx` tương ứng và trả nội dung text. Frontend đổ text này vào bộ trình soạn thảo cao cấp **Monaco Editor** (lõi của VS Code).
* **Luồng Lưu bài viết:** Bấm `Ctrl + S` hoặc nút Lưu, Frontend lấy nội dung hiện tại trong Monaco và gửi POST lên `/api/docs/file`. Backend nhận data và ghi đè thẳng vào file `.mdx` tương ứng trong ổ cứng.
* **Live Preview:** Tính năng Live Preview thực chất là một thẻ `<iframe>` được nhúng vào bên phải giao diện, tải trang web Astro (`localhost:4321`). Nhờ tính năng HMR (Hot Module Replacement) có sẵn của Astro, mỗi khi backend ghi đè file `.mdx`, iframe tự động cập nhật ngay lập tức mà không cần reload cả trang CMS.

### B. Upload Ảnh (Kéo & Thả)
Thay vì bắt Content Creator phải copy ảnh vào thư mục source code và tự copy đường dẫn dài dòng, CMS hỗ trợ kéo thả ảnh trực tiếp:
1. **Bắt sự kiện (Frontend):** Bắt sự kiện `drop` (thả chuột) trên vùng màn hình của Monaco Editor. Nếu không ngăn chặn sự kiện này, trình duyệt sẽ tự mở ảnh sang 1 tab mới.
2. **Tính toán tọa độ:** Khi thả ảnh, hệ thống gọi hàm `editor.getTargetAtClientPoint(e.clientX, e.clientY)` của Monaco để quy đổi vị trí con trỏ chuột sang số thứ tự dòng và cột trong đoạn code. (Nếu không có hàm này, ảnh sẽ bị chèn lên trên đỉnh bài viết vì con trỏ Monaco không tự động đi theo chuột khi kéo thả).
3. **Upload (Backend):** Ảnh được đóng gói bằng `FormData` gửi lên API `/api/upload`. Backend dùng thư viện **`multer`** để nhận file ảnh.
   * Để ảnh được gọn gàng, backend tự động trích xuất tên chuyên mục từ tên bài viết (ví dụ: đang sửa `cleaning/cleaning.mdx` thì thư mục upload sẽ là `/images/hyperlis/cleaning/`).
   * Tên ảnh được đổi thành định dạng: `[Timestamp]-[Tên_gốc]` để triệt tiêu vĩnh viễn lỗi trùng tên file.
4. **Hiển thị:** Backend trả về đường dẫn URL của ảnh. Frontend ngay lập tức chèn đoạn thẻ Component `<Screenshot src="..." />` vào đúng tọa độ dòng/cột đã tính toán lúc thả chuột.

### C. Publish Lên Web (Đẩy lên Github)
1. User bấm nút **"Publish Lên Web"**.
2. Frontend tự động kích hoạt hàm Lưu file để đảm bảo bài viết không bị thiếu cập nhật.
3. Frontend gửi lệnh sang API `/api/publish`.
4. Backend nhận lệnh và khởi chạy Terminal ngầm (dùng `child_process.exec`). Cụm lệnh được thực thi gồm:
   ```bash
   git add .
   git commit -m "docs: Cập nhật bài viết [tên file]"
   git push
   ```
5. Github tiếp nhận code, tự động kích hoạt Github Actions chạy kịch bản Deploy Astro để đưa bài lên website Live (`zittechlab.com`). Mất khoảng 2-3 phút cho toàn bộ quy trình.

---

## 3. Những lỗi hóc búa đã xử lý (Ghi chú cho Maintainer)

### Lỗi 1: Caching Frontend (`app.js`)
* **Triệu chứng:** Cập nhật code `app.js` cho nút Publish nhưng bấm vào nút không có phản hồi.
* **Nguyên nhân:** Trình duyệt lưu cache (bộ nhớ đệm) rất mạnh file `app.js` để tải trang nhanh.
* **Khắc phục:** Áp dụng phương pháp Cache Busting. Đổi đường dẫn khai báo thẻ script ở `index.html` thành `app.js?v=4`. Khi đổi phiên bản, trình duyệt buộc phải kéo file mới từ server.

### Lỗi 2: Lỗi ảnh "tự động nhảy lên đầu" trên Web thật
* **Triệu chứng:** Ở Local (CMS) và Localhost Astro xem trước thì ảnh nằm đúng chỗ. Nhưng khi ấn Publish xong ra xem Web Live thì ảnh lại bị gom nhóm nhảy lên ngay dưới đoạn tiêu đề `## 1. Hình ảnh giao diện`, kèm theo Caption tự phát sinh `Ảnh 1`, `Ảnh 2`.
* **Nguyên nhân:** Hệ thống cũ tồn tại một script tên là **`fix.cjs`**. Script này được cấu hình tự động chạy (`prebuild`) ngay trước khi Github biên dịch web. Chức năng cũ của nó là quét qua các file `.mdx`, xóa toàn bộ thẻ `<Screenshot>` do user tự viết tay, đọc tất cả ảnh trong thư mục chuyên mục, sau đó tự động sắp xếp lại thành bộ sưu tập ở trên đầu trang (phục vụ mục đích dọn dẹp hệ thống cũ).
* **Khắc phục:** Vì team đã có hệ thống CMS để tự chủ việc chèn ảnh tại bất kỳ dòng nào, nên đã vô hiệu hóa thành phần "Ghi đè file MDX" của đoạn script `fix.cjs`. Qua đó, bài viết CMS tạo ra sao, lên web sẽ giữ nguyên vị trí 100%.

---
*Tài liệu nội bộ HyperLis Docs - Kiến trúc Hệ thống CMS Backend*
