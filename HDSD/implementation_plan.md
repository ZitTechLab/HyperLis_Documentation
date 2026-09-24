# Kế hoạch Tích hợp Keystatic vào HyperLis Docs

Mục tiêu của chúng ta là thêm trình quản trị nội dung (CMS) **Keystatic** vào dự án Astro Starlight này để bạn có thể thêm/sửa bài viết qua Form giao diện trực quan thay vì phải code file Markdown/MDX. Cuối cùng, cấu hình để deploy trực tiếp lên **GitHub Pages**.

> [!IMPORTANT]  
> Xin vui lòng đọc kỹ các bước dưới đây và bấm **Proceed** (hoặc trả lời đồng ý) nếu bạn muốn tôi bắt đầu tự động cài đặt.

## Open Questions
> [!WARNING]  
> 1. Hiện tại thư mục `src/content/docs` của bạn có nhiều thư mục con (getting-started, windows, dashboard...). Trong Keystatic, chúng ta sẽ cần khai báo collection tương ứng. Bạn muốn Keystatic quản lý **tất cả** bài viết trong `src/content/docs` hay chỉ một số thư mục cụ thể? (Tạm thời tôi sẽ cấu hình quản lý chung toàn bộ thư mục `docs`).
> 2. Bạn đã đẩy (push) source code hiện tại lên một Repository nào trên GitHub chưa? Nếu có, xin hãy cung cấp `username/repo` (ví dụ: `ZitTechLab/HyperLis_Documentation`) để tôi cấu hình sẵn.

## Proposed Changes

### 1. Cài đặt thư viện
Tôi sẽ chạy lệnh cài đặt các package cần thiết:
```bash
npm install @keystatic/core @keystatic/astro @astrojs/react react react-dom
```

---
### Cấu hình Hệ thống (Astro & Keystatic)

#### [MODIFY] [astro.config.mjs](file:///e:/GGAI/HyperLis_Documentation-main/astro.config.mjs)
Tôi sẽ thêm integration của React và Keystatic vào file cấu hình Astro.
- Thêm `import react from '@astrojs/react';`
- Thêm `import keystatic from '@keystatic/astro';`
- Đưa vào mảng `integrations: [...]`

#### [NEW] [keystatic.config.ts](file:///e:/GGAI/HyperLis_Documentation-main/keystatic.config.ts)
Tôi sẽ tạo file này để định nghĩa giao diện Form. Form này sẽ bao gồm:
- **Title**: Tiêu đề bài viết
- **Description**: Mô tả ngắn
- **Content**: Nội dung bài viết (trình soạn thảo Markdown/MDX)

Tài liệu sẽ được cấu hình lưu thành file `.mdx` vào thư mục `src/content/docs/`.
Chế độ lưu trữ (Storage):
- Môi trường Dev (khi bạn chạy ở máy): `kind: 'local'` (Lưu trực tiếp vào máy tính).
- Môi trường Build (khi đưa lên GitHub Pages): `kind: 'github'` (Kết nối API của GitHub).

## Verification Plan

### Manual Verification
1. Sau khi cài đặt xong, tôi sẽ chạy lại lệnh `npm run dev`.
2. Hướng dẫn bạn truy cập vào `http://localhost:4321/keystatic` để xem giao diện Admin và thử tạo 1 bài viết mẫu.
3. Tôi sẽ hướng dẫn bạn các bước tiếp theo trên trình duyệt của bạn (Tạo GitHub App) để kết nối Keystatic với GitHub Pages.
