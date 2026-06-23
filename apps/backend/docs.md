# Cinema Chain - Backend Documentation

Tài liệu này cung cấp cái nhìn tổng quan về cấu trúc thư mục và cách tổ chức code của phần backend (NestJS). Tài liệu này giúp các developer mới dễ dàng nắm bắt kiến trúc và tiếp tục phát triển dự án.

## Tổng quan kiến trúc
Backend được xây dựng dựa trên framework **NestJS**, sử dụng **Prisma** làm ORM để tương tác với cơ sở dữ liệu.

## Cấu trúc thư mục chính

Dưới đây là cấu trúc của thư mục `src` - nơi chứa toàn bộ logic ứng dụng:

### `src/modules/`
Đây là thư mục quan trọng nhất, chứa các module chức năng (Domain/Feature modules) của ứng dụng. Mỗi thư mục con bên trong đại diện cho một module và thường bao gồm Controller, Service, Module, DTOs, và Entities.
- **`auth/`**: Xử lý xác thực (Authentication) và phân quyền (Authorization), đăng nhập, cấp phát JWT.
- **`users/`**, **`customers/`**, **`employees/`**: Quản lý các đối tượng người dùng khác nhau trong hệ thống (nhân viên, khách hàng, admin).
- **`branches/`** (Cinemas): Quản lý các chi nhánh rạp phim.
- **`movies/`**: Quản lý thông tin phim.
- **`roles/`**: Quản lý vai trò và quyền hạn của nhân viên/admin.
- **`redis/`**: Module tích hợp Redis dùng để caching hoặc quản lý session/queue.
- **`upload/`**: Xử lý việc upload file (ví dụ: ảnh đại diện, poster phim).

### `src/common/`
Chứa các thành phần dùng chung cho toàn bộ ứng dụng:
- **`decorators/`**: Các custom decorators của NestJS (ví dụ: `@CurrentUser()`, `@Roles()`).
- **`guards/`**: Các guards dùng để bảo vệ route (ví dụ: `JwtAuthGuard`, `RolesGuard`, bảo vệ dựa trên `branch_id`).
- **`interceptors/`**: Các interceptors để format response hoặc xử lý logic trước/sau khi request (ví dụ: format API response chuẩn).
- **`pagination/`**: Các utility hoặc DTO liên quan đến việc phân trang dữ liệu trả về.

### `src/utils/`
Chứa các hàm tiện ích (utility functions) không phụ thuộc vào framework, ví dụ như xử lý chuỗi, thời gian, mã hóa mật khẩu, v.v.

### `src/generated/`
Chứa các file code được tự động sinh ra (ví dụ: các type/interface từ Prisma hoặc các công cụ sinh code khác). Thường không nên sửa trực tiếp code trong thư mục này.

### Các file cấu hình cấp cao trong `src/`
- **`main.ts`**: Entry point của ứng dụng NestJS. Nơi khởi tạo app, cấu hình CORS, global validation pipes, v.v.
- **`app.module.ts`**: Root module, nơi import tất cả các feature modules và cấu hình database, config.
- **`app.controller.ts` / `app.service.ts`**: Thường dùng cho các route cơ bản như Health check.
- **`prisma.service.ts` & `prisma.module.ts`**: Service để kết nối và tương tác với database thông qua Prisma.

## Hướng dẫn chạy dự án (Run Code)

1. **Cài đặt thư viện**:
   Tại thư mục gốc của monorepo (hoặc thư mục backend), chạy lệnh:
   ```bash
   pnpm install
   ```

2. **Cấu hình môi trường**:
   - Copy file `.env.dist` thành file `.env`.
   - Cập nhật các thông tin kết nối Database (PostgreSQL), Redis, JWT Secret, v.v. trong file `.env`.

3. **Khởi tạo Database (Prisma)**:
   - Chạy migration để tạo các bảng trong database:
     ```bash
     pnpm dlx prisma migrate dev
     ```
   - Sinh code cho Prisma Client:
     ```bash
     pnpm dlx prisma generate
     ```

4. **Chạy ứng dụng**:
   - Chạy ở chế độ phát triển (Development):
     ```bash
     pnpm run start:dev
     ```
   - Build ứng dụng:
     ```bash
     pnpm run build
     ```
   - Chạy ứng dụng đã build (Production):
     ```bash
     pnpm run start:prod
     ```

## Hướng dẫn phát triển thêm
1. **Tạo module mới**: Khi có tính năng mới (ví dụ: `tickets` - vé), hãy tạo một thư mục mới trong `src/modules/tickets`.
2. **Tuân thủ quy tắc**: 
   - Đặt logic nghiệp vụ trong Service (`*.service.ts`).
   - Xử lý request/response trong Controller (`*.controller.ts`).
   - Mọi API cần được bảo vệ bằng Guard nếu yêu cầu đăng nhập.
   - Khi query dữ liệu cho một chi nhánh (Branch), hãy chú ý kiểm tra quyền `branch_id` của user đang thao tác để đảm bảo tính Multi-tenancy.
