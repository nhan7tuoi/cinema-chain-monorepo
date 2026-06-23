# Cinema Chain - Frontend Admin Documentation

Tài liệu này cung cấp cái nhìn tổng quan về cấu trúc thư mục và cách tổ chức code của phần Frontend Admin (Next.js). Tài liệu này giúp các developer mới dễ dàng nắm bắt kiến trúc và tiếp tục phát triển giao diện quản trị.

## Tổng quan kiến trúc
Frontend Admin được xây dựng dựa trên framework **Next.js** (sử dụng **App Router**), kết hợp với **Tailwind CSS** để styling và **shadcn/ui** cho các component giao diện cơ bản.

## Cấu trúc thư mục chính

Toàn bộ source code giao diện nằm trong thư mục `src/`. Dưới đây là giải thích chi tiết:

### `src/app/`
Đây là thư mục core của Next.js App Router, chứa các page và routing của ứng dụng.
- **`(auth)/`**: Route group cho các trang liên quan đến xác thực (Login, Forgot Password). Việc dùng ngoặc đơn `()` giúp nhóm các route lại mà không làm thay đổi URL trên trình duyệt.
- **`(dashboard)/`**: Route group cho giao diện chính sau khi đăng nhập. Bao gồm các trang quản lý:
  - **`cinemas/`**: Quản lý chi nhánh rạp chiếu phim.
  - **`movies/`**: Quản lý danh sách phim.
  - **`users/`**: Quản lý người dùng/nhân viên.
  - **`settings/`**: Cài đặt hệ thống.
  - **`dashboard/`**: Trang chủ thống kê (Dashboard).
- **`layout.tsx` / `page.tsx`**: Các layout và page chính của toàn bộ ứng dụng (ví dụ: cấu hình RootLayout).
- **`globals.css`**: File CSS toàn cục, chứa các biến màu Tailwind và style cấu hình cho shadcn/ui.

### `src/components/`
Chứa các React Components có thể tái sử dụng.
- **`ui/`**: Chứa các component giao diện nguyên thủy (button, input, dialog, table...) thường được sinh ra bởi `shadcn/ui`. Không nên chứa logic nghiệp vụ ở đây.
- **`layout/`**: Các component dùng để xây dựng bố cục trang (Sidebar, Header, Navigation...).
- Các thư mục domain (ví dụ: **`auth/`**, **`cinemas/`**, **`movies/`**): Chứa các component phức tạp, gắn liền với một nghiệp vụ cụ thể (ví dụ: Form tạo phim, Bảng danh sách rạp).

### `src/hooks/`
Chứa các Custom React Hooks (ví dụ: `useAuth`, `useFetch`, `useDebounce`). Giúp tách biệt logic ra khỏi component để dễ dàng tái sử dụng và testing.

### `src/lib/`
Chứa các utility functions, cấu hình thư viện và helper (ví dụ: `utils.ts` của Tailwind/clsx, các hàm gọi API axios/fetch, format date, format tiền tệ).

### `src/config/`
Chứa các cấu hình hằng số của hệ thống (Constants, Menu links, Navigation config).

## Hướng dẫn phát triển thêm
1. **Thêm trang mới**: Tạo thư mục mới trong `src/app/(dashboard)/` (nếu là trang quản trị) kèm file `page.tsx`.
2. **Tạo Component**: 
   - Nếu là component cơ bản dùng chung (UI primitive), hãy đặt ở `src/components/ui/`.
   - Nếu là component logic riêng cho một màn hình, hãy đặt ở thư mục domain tương ứng trong `src/components/`.
3. **Data Fetching**: Ưu tiên sử dụng React Server Components trong App Router để fetch dữ liệu nếu không cần tính tương tác (Client hooks). Dùng Client Components (thêm `"use client"`) khi cần quản lý state hoặc các sự kiện người dùng (onClick, onChange).
