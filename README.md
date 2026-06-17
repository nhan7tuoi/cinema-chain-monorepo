# 🎬 Cinema Chain Management System (Monorepo)

Hệ thống quản lý chuỗi rạp chiếu phim toàn diện bao gồm: Backend dịch vụ cốt lõi, Web đặt vé trực tuyến cho khách hàng, Web POS & Quản trị dành cho nhân viên/chi nhánh. Dự án được tổ chức theo mô hình **Monorepo** giúp tối ưu hóa hiệu năng phát triển và đồng bộ hóa dữ liệu tuyệt đối.

---

## 🏗️ Kiến Trúc Hệ Thống & Cấu Trúc Thư Mục

Dự án sử dụng **Turborepo** kết hợp với **PNPM Workspaces** để quản lý các ứng dụng con (`apps`) và các gói thư viện dùng chung (`packages`).

```text
cinema-chain-monorepo/
├── apps/
│   ├── backend/          # NestJS Framework - Xử lý API, Realtime Socket.io, DB, Queue Worker
│   ├── frontend-web/     # Next.js (Port 3001) - Giao diện đặt vé trực tuyến cho Khách hàng
│   └── frontend-admin/   # Next.js (Port 3002) - Giao diện Quản trị (Admin) & POS bán vé tại quầy
├── packages/
│   └── shared-types/     # TypeScript Types/Interfaces/Enums dùng chung cho toàn hệ thống
├── .husky/               # Git Hooks (Husky) tự động kiểm tra Clean Code trước khi commit
├── turbo.json            # Cấu hình bộ nhớ đệm (Caching) và pipeline chạy của Turborepo
├── pnpm-workspace.yaml   # Khai báo không gian làm việc của các Workspace
└── package.json          # Cấu hình script tổng của Monorepo