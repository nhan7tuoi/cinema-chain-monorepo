// apps/backend/prisma/seed.ts

import { PrismaClient, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Khởi động tiến trình nạp dữ liệu mẫu (Auth & RBAC)...');

  // =========================================================================
  // 1. TỰ ĐỘNG SINH MA TRẬN QUYỀN (CRUD) CHO CÁC MENU FRONTEND
  // =========================================================================
  const modules = [
    { code: 'dashboard', name: 'Bảng Điều Khiển Tổng' },
    { code: 'branch', name: 'Quản Lý Chi Nhánh' },
    { code: 'employee', name: 'Quản Lý Nhân Viên' },
    { code: 'role', name: 'Cấu Hình Nhóm Quyền' },
    { code: 'movie', name: 'Quản Lý Phim' },
    { code: 'showtime', name: 'Quản Lý Lịch Chiếu' },
  ];

  const actions = [
    { code: 'read', name: 'Xem' },
    { code: 'create', name: 'Thêm' },
    { code: 'update', name: 'Sửa' },
    { code: 'delete', name: 'Xóa' },
  ];

  console.log('👉 Đang gieo ma trận quyền chi tiết vào bảng [permissions]...');
  for (const mod of modules) {
    for (const act of actions) {
      const permissionName = `${mod.code}:${act.code}`; // Ví dụ: "employee:create", "movie:read"
      const permissionDesc = `${act.name} tại trang ${mod.name}`;

      await prisma.permission.upsert({
        where: { name: permissionName },
        update: {},
        create: {
          name: permissionName,
          description: permissionDesc,
          module: mod.name,
        },
      });
    }
  }

  // =========================================================================
  // 2. KHỞI TẠO CƠ SỞ HẠ TẦNG MẪU (BRANCH)
  // =========================================================================
  console.log('👉 Đang tạo chi nhánh mẫu đầu tiên...');
  const defaultBranch = await prisma.branch.upsert({
    where: { name: 'Cinema Hùng Vương HQ' },
    update: {},
    create: {
      name: 'Cinema Hùng Vương HQ',
      address: '123 Hùng Vương, Quận 5, TP. Hồ Chí Minh',
      phone: '0281234567',
    },
  });

  // Mật khẩu mã hóa dùng chung cho các tài khoản test hệ thống: Admin@2026
  const saltRounds = 10;
  const hashPassword = await bcrypt.hash('Admin@2026', saltRounds);

  // =========================================================================
  // 3. TẠO TÀI KHOẢN SUPER ADMIN TỐI CAO (Hệ thống tổng)
  // =========================================================================
  const superAdminEmail = 'superadmin@cinema.com';
  console.log(`👉 Đang tạo tài khoản Super Admin mặc định: ${superAdminEmail}`);
  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      password: hashPassword,
      userType: UserType.SUPER_ADMIN,
      isActive: true,
    },
  });

  // =========================================================================
  // 4. TẠO TÀI KHOẢN NHÂN VIÊN MẪU (Gán thuộc chi nhánh vừa tạo)
  // =========================================================================
  const employeeEmail = 'staff.nguyenva@cinema.com';
  console.log(`👉 Đang tạo tài khoản Nhân Viên mẫu: ${employeeEmail}`);
  
  const employeeUser = await prisma.user.upsert({
    where: { email: employeeEmail },
    update: {},
    create: {
      email: employeeEmail,
      password: hashPassword,
      userType: UserType.EMPLOYEE,
      isActive: true,
    },
  });

  // Liên kết thông tin danh tính chi tiết sang bảng Employee
  await prisma.employee.upsert({
    where: { userId: employeeUser.id },
    update: {},
    create: {
      userId: employeeUser.id,
      fullName: 'Nguyễn Văn A',
      phone: '0909123456',
      code: 'NV001',
      branchId: defaultBranch.id, // Nhân viên thuộc rạp Hùng Vương
    },
  });

  console.log('🏁 Hoàn thành! Dữ liệu phân quyền và tài khoản core đã sẵn sàng 100%.');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi trong quá trình seed dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });