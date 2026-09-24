# Kế Hoạch Xây Dựng Backend Của Riêng ZitTechLab (Custom CMS)

Dựa trên yêu cầu của bạn, chúng ta sẽ không dùng phần mềm có sẵn nữa mà sẽ **tự code một hệ thống CMS Local** (chạy trên máy tính cá nhân của bạn). Điểm ưu việt của cách này là có thể can thiệp sâu để **Preview chính xác 100%** và tự động sinh ra format chuẩn như file `bai-viet-mau.mdx`.

Dưới đây là thiết kế kiến trúc và tính năng:

## 1. Kiến trúc Hệ Thống (Bí quyết cho Live Preview 100% chính xác)

Vì dự án của bạn dùng Astro Starlight kết hợp các thẻ MDX (như `<Screenshot>`, `<Aside>`), không có bất kỳ thư viện soạn thảo Text thông thường nào preview chuẩn được các thẻ này ngoài chính bộ máy của Astro.

**👉 Giải pháp:** 
- Giao diện Admin sẽ được chia làm 2 nửa (Split-Pane): Nửa trái là **Khung Editor**, nửa phải là **Khung Preview (dưới dạng iFrame)**.
- Khi bạn gõ vào Editor, Backend Node.js sẽ ngay lập tức ghi đè vào file `.mdx`.
- Astro Dev Server (`npm run dev`) đang chạy sẽ lập tức kích hoạt tính năng **Hot Module Replacement (HMR)** và làm mới Iframe chưa tới `0.1s`. Nhờ đó bạn thấy bài viết thay đổi ngay lập tức với CSS và layout y hệt web thật!

## 2. Các Tính Năng Core Cần Phát Triển

### 📋 A. Quản lý thư mục & Bài viết
- Một thanh Sidebar bên trái load trực tiếp thư mục `src/content/docs`.
- Nút tạo bài viết mới: Tự động copy form chuẩn từ `bai-viet-mau.mdx` tạo ra file mới.

### ✍️ B. Khung soạn thảo MDX Thông Minh (Editor)
- Dùng bộ code editor (VD: Monaco Editor giống VS Code) chuyên dụng cho Markdown.
- **Thanh công cụ Component (Snippet Toolbar):** Các nút chèn nhanh tính năng:
  - Nút **[Chèn Ảnh Screenshot]**: Tự sinh code `<Screenshot src="..." alt="..." caption="..." title="..." />`.
  - Nút **[Chèn Lưu Ý]**: Tự sinh code `<Aside type="caution">...</Aside>`.
  - Nút **[Chèn Before/After]**: Tự sinh code component `<BeforeAfter>`.

### 🖼️ C. Trình Quản Lý Ảnh Kéo-Thả (Media Manager)
- Bạn chỉ cần kéo thả ảnh vào khung soạn thảo.
- Backend Node.js sẽ tự động lấy ảnh đó, lưu vào đúng thư mục `public/images/hyperlis/...` dựa trên tên thư mục bài viết.
- Tự động điền đường dẫn ảnh `src` vào thẻ `<Screenshot>`. Bạn không cần copy-paste file thủ công nữa.

### 🚀 D. Hệ Thống Đồng Bộ GitHub (Publish)
- Một nút to màu xanh **[Publish Lên Web]** nằm góc trên.
- Khi bấm, Backend sẽ thực thi chuỗi lệnh ngầm: `git add .`, `git commit -m "Cập nhật bài viết [Tên bài]"`, và `git push`. 
- Giao diện báo thành công, và tự động tắt.

---

## 3. Lộ Trình Triển Khai (Roadmap)

> Chúng ta sẽ code từng phần và test kỹ trước khi qua phần sau.

- **Bước 1: Khởi tạo Backend Server (Node.js/Express):** Viết API đọc/ghi file `.mdx` và xử lý upload ảnh.
- **Bước 2: Xây dựng Giao diện Web Admin:** Viết file HTML/JS thuần (hoặc React/Vue tùy chọn) chia bố cục Split-Pane. Nhúng Iframe của Astro vào nửa phải.
- **Bước 3: Tích hợp Trình Soạn Thảo & Snippet:** Ghép Monaco Editor vào, viết script cho các nút chèn MDX tự động. Tích hợp API lưu file real-time.
- **Bước 4: Tính năng Kéo/Thả Ảnh:** Xử lý sự kiện kéo thả, gọi API upload ảnh và sinh code `<Screenshot>`.
- **Bước 5: Hoàn thiện tính năng Publish Git:** Ghép script tự động gõ lệnh Git và làm đẹp giao diện.

Bạn xem kế hoạch và tính năng bên trên đã đúng với ý tưởng và giải quyết được triệt để nhu cầu quy chuẩn ảnh/form mẫu của bạn chưa? Nếu đồng ý, chúng ta sẽ bắt đầu **Bước 1** ngay bây giờ!
