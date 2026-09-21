# HƯỚNG DẪN CHỈNH SỬA & CẬP NHẬT TÀI LIỆU HYPERLIS

---

## 1. THÊM HOẶC THAY THẾ HÌNH ẢNH

1. Mở thư mục chứa ảnh trên GitHub:
   `public/images/hyperlis/[tên_tab]/`
   *(Ví dụ: `dashboard`, `windows`, `cleanup`, `downloads`...)*
2. Bấm **Add file** -> **Upload files** -> Kéo thả ảnh từ máy tính lên.
3. Đặt tên ảnh theo chuẩn: `[tên_tab]-01.png`, `[tên_tab]-02.png` (Ví dụ: `dashboard-01.png`, `windows-02.png`).
4. Nhấn **Commit changes...** để lưu.

---

## 2. CHỈNH SỬA BÀI VIẾT CÓ SẴN

1. Mở file bài viết cần sửa:
   `src/content/docs/[tên_tab]/[tên_bài].mdx`
   *(Ví dụ: `src/content/docs/dashboard/safety-policy.mdx`)*
2. Nhấn biểu tượng cây bút **Edit this file** (hoặc mở sửa trong VS Code).
3. Chỉnh sửa nội dung văn bản.
4. Chèn ảnh bằng thẻ:
   ```mdx
   <Screenshot 
     src="/images/hyperlis/[tên_tab]/[tên_ảnh].png" 
     alt="Mô tả hình ảnh" 
   />
   ```
5. Nhấn **Commit changes...** để lưu.

---

## 3. THÊM BÀI VIẾT MỚI

1. Mở thư mục tab tương ứng:
   `src/content/docs/[tên_tab]/`
2. Bấm **Add file** -> **Create new file**.
3. Đặt tên file có đuôi `.mdx` (Ví dụ: `toi-uu-ram.mdx`).
4. Copy toàn bộ nội dung mẫu từ file `src/templates/bai-viet-mau.mdx`, dán vào file mới và điền nội dung.
5. **Khai báo bài viết lên Sidebar menu:**
   - Mở file `astro.config.mjs`.
   - Tìm đến mục `sidebar` tại nhóm tab tương ứng, thêm 1 dòng:
     ```javascript
     { label: 'Tên hiển thị bài viết', slug: '[tên_tab]/[tên_file_không_đuôi]' },
     ```
     *(Ví dụ: `{ label: 'Tối ưu RAM', slug: 'general/toi-uu-ram' },`)*
6. Nhấn **Commit changes...** để lưu.

---

## 4. CẬP NHẬT NHẬT KÝ PHIÊN BẢN (CHANGELOG)

1. Mở file `src/data/changelog.json`.
2. Thêm khối phiên bản mới lên đầu danh sách:
   ```json
   "v1.0.8 Chính thức": {
       "title": "HYPERLIS - Nhật ký thay đổi v1.0.8 Chính thức",
       "summary_title": "TÓM TẮT PHÁT HÀNH",
       "content": [
           "Tính năng tối ưu mới.",
           "Sửa lỗi kết nối máy in mạng LAN."
       ],
       "version_label": "THÔNG TIN PHIÊN BẢN",
       "version_value": "v1.0.8 Chính thức"
   }
   ```
3. Nhấn **Commit changes...** để lưu.

---

## 5. THAO TÁC QUA GIT TRÊN MÁY TÍNH (CHO DEV)

```bash
# 1. Clone repo về máy
git clone https://github.com/tuanhaii26/HyperLis_Documentation.git
cd HyperLis_Documentation

# 2. Cài đặt thư viện
npm install

# 3. Chạy xem trước trực tiếp (Live Preview)
npm run dev
# Mở trình duyệt: http://localhost:4321

# 4. Commit và đẩy lên GitHub
git add .
git commit -m "docs: cập nhật tài liệu"
git push origin main
```

---

## 6. CƠ CHẾ TỰ ĐỘNG TRIỂN KHAI (CI/CD)

- Sau khi Commit / Push lên nhánh `main`, GitHub Actions (`deploy.yml`) sẽ tự động biên dịch và cập nhật website tại:
  `https://tuanhaii26.github.io/HyperLis_Documentation/`
- Quá trình diễn ra tự động hoàn toàn trong vòng **1 - 2 phút**.
