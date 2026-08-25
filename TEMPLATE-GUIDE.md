# Hướng dẫn mô hình hoạt động của @templates

Tài liệu này giải thích chi tiết mô hình hoạt động của các template trong hệ thống, dựa trên hợp đồng cốt lõi [TEMPLATE-CONTRACT.md](./TEMPLATE-CONTRACT.md).

## 1. Kiến trúc tổng quan (Mô hình Host - Component)
Mô hình này không tạo ra nhiều ứng dụng Next.js độc lập cho mỗi mẫu thiết kế (template) mà sử dụng một ứng dụng duy nhất làm **"Host"** (ví dụ: `wedding-invite`) chạy trên **một port duy nhất**.

Mỗi template (như `wedding-basic`, `wedding-invite2`) đóng vai trò là một **npm package / Git repo độc lập**. Host sẽ đóng vai trò là một **Registry** để import các package này và quyết định sẽ render template (component) nào dựa vào `templateId`.

## 2. Cấu trúc bắt buộc của một Template
Một template repo hợp lệ **không được** chứa thư mục `app/`, file cấu hình `next.config.ts` hay các script để chạy Next (`dev`). Thay vào đó, nó phải tuân thủ "hợp đồng" (contract) với 4 file cốt lõi sau:

*   **`eventlab.template.json`**: Chứa trường `id` (ví dụ: `"floral-wedding"`). ID này phải khớp với `slug` trên database (NestJS) và là key để Host nhận diện.
*   **`src/index.tsx`**: File code chính, bắt buộc phải `export default` một component nhận vào prop `data`: `export default function Template({ data })`.
*   **`slots.schema.json`**: Định nghĩa cấu trúc dữ liệu (`event.eventData`) mà template này mong đợi (giúp validation hoặc render form nhập liệu trên admin).
*   **`package.json`**: Chứa tên package (ví dụ: `@eventlab/template-wedding-basic`) và cấu hình `exports["."]` trỏ về file `src/index.tsx`.

## 3. Quy trình tích hợp một Template mới
Khi bạn muốn thêm một thiết kế mới (ví dụ: `floral-wedding`), quy trình diễn ra ở ứng dụng Host như sau:

1.  **Clone code**: Tải code template mới vào chung thư mục `templates/`.
2.  **Khai báo Package**: Khai báo dependency trong `package.json` của thư mục Host trỏ tới template mới. Lúc dev sẽ trỏ qua file local (`"file:../floral-wedding"`), khi lên production có thể trỏ về Github repo.
3.  **Cấu hình Next.js**: Thêm tên package mới vào mảng `transpilePackages` trong file `next.config.ts` của Host để Next.js biên dịch được mã nguồn từ node_modules.
4.  **Đăng ký vào Registry**: Mở file `components/base/template-registry.tsx` của Host, import template mới và đưa vào object `TEMPLATE_REGISTRY` với **key chính là id trong file `eventlab.template.json`**.
    ```typescript
    import Floral from '@eventlab/template-floral-wedding';
    
    export const TEMPLATE_REGISTRY = {
      // ...các template cũ
      'wedding-basic': WeddingBasic,
      'wedding-invite2': WeddingInvite2,
      'floral-wedding': Floral, // id phải trùng với eventlab.template.json
    };
    ```

## 4. Luồng xử lý dữ liệu từ Backend (NestJS)
1.  Quản trị viên tạo một Event và gán template có `slug` (hoặc id) là `"floral-wedding"` cho sự kiện đó. Schema dữ liệu được lấy từ `slots.schema.json`.
2.  Khi người dùng truy cập link thiệp mời có dạng `/invite/:slug`.
3.  Ứng dụng Host gọi API `GET /public/events/:slug` để lấy dữ liệu.
4.  API trả về toàn bộ dữ liệu sự kiện cùng với `templateId: "floral-wedding"`.
5.  Ứng dụng Host tra cứu `templateId` này trong `TEMPLATE_REGISTRY`, lấy component `Floral` ra, truyền dữ liệu vào và render cho người dùng.

**Tóm lại:** Mô hình này rất linh hoạt và dễ scale. Các designer/developer có thể phát triển giao diện hoàn toàn độc lập dưới dạng package npm, không sợ ảnh hưởng chéo đến mã nguồn chính. Hệ thống core chỉ cần "cắm" các package đó vào registry là có thể phục vụ hàng ngàn thiết kế khác nhau qua một máy chủ Next.js duy nhất.
