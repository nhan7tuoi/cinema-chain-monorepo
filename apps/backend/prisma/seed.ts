import { PrismaClient, UserType, UserStatus } from '.prisma/generated';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Khởi động tiến trình nạp dữ liệu mẫu RBAC nâng cao...');

  // =========================================================================
  // 1. TỰ ĐỘNG SINH MA TRẬN QUYỀN (PERMISSIONS)
  // =========================================================================
  const modules = [
    { code: 'dashboard', name: 'Bảng Điều Khiển Tổng' },
    { code: 'branch', name: 'Quản Lý Chi Nhánh' },
    { code: 'employee', name: 'Quản Lý Nhân Viên' },
    { code: 'customer', name: 'Quản Lý Khách Hàng' },
    { code: 'role', name: 'Cấu Hình Nhóm Quyền' },
    { code: 'movie', name: 'Quản Lý Phim' },
    { code: 'showtime', name: 'Quản Lý Lịch Chiếu' },
    { code: 'ticket', name: 'Quản Lý Bán Vé' },
    { code: 'config', name: 'Cấu Hình Hệ Thống' },
  ];

  const actions = [
    { code: 'read', name: 'Xem' },
    { code: 'create', name: 'Thêm' },
    { code: 'update', name: 'Sửa' },
    { code: 'delete', name: 'Xóa' },
  ];

  console.log('👉 Đang gieo ma trận quyền chi tiết vào database...');
  
  // Dùng mảng tạm để lưu thông tin quyền phục vụ cho việc map vào Role phía dưới
  const allPermissions: { code: string; id: string }[] = [];

  for (const mod of modules) {
    for (const act of actions) {
      const pCode = `${mod.code}:${act.code}`;
      const pName = `${act.name} ${mod.name.toLowerCase()}`;

      const perm = await prisma.permission.upsert({
        where: { name: pCode },
        update: {},
        create: {
          name: pCode,
          displayName: pName,
          module: mod.code,
          description: `Cho phép thực hiện hành động ${act.name.toLowerCase()} tại phân hệ ${mod.name}`,
        },
      });
      allPermissions.push({ code: perm.name, id: perm.id });
    }
  }

  // =========================================================================
  // 2. KHỞI TẠO CÁC VAI TRÒ HỆ THỐNG (ROLES) & GÁN QUYỀN MẶC ĐỊNH
  // =========================================================================
  console.log('👉 Khởi tạo danh sách các vai trò (Roles)...');

  // Định nghĩa các Role cốt lõi
  const rolesData = [
    { code: 'SUPER_ADMIN', name: 'Super Admin', desc: 'Toàn quyền tối cao.' },
    { code: 'ADMIN', name: 'Quản Trị Viên', desc: 'Quản trị hệ thống.' },
    { code: 'MANAGER', name: 'Quản Lý', desc: 'Quản lý vận hành chi nhánh.' },
    { code: 'EMPLOYEE', name: 'Nhân Viên', desc: 'Thực hiện nghiệp vụ cơ bản.' },
    { code: 'CUSTOMER', name: 'Khách Hàng', desc: 'Khách hàng đặt vé.' },
  ];

  const createdRoles: Record<string, string> = {};

  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { code: r.code },
      update: {},
      create: {
        code: r.code,
        name: r.name,
        description: r.desc,
        isSystem: true,
      },
    });
    createdRoles[role.code] = role.id;
  }

  // ---- Tiến hành Map quyền cho từng Role ----
  console.log('👉 Đang gán ma trận quyền chi tiết cho từng Role...');

  // 2a. Role: Quản lý (MANAGER)
  const managerPerms = allPermissions.filter((p) => !p.code.startsWith('role:') && !p.code.startsWith('config:'));
  await prisma.rolePermission.deleteMany({ where: { roleId: createdRoles['MANAGER'] } }); 
  await prisma.rolePermission.createMany({
    data: managerPerms.map((p) => ({
      roleId: createdRoles['MANAGER'],
      permissionId: p.id,
    })),
    skipDuplicates: true,
  });

  // 2b. Role: Nhân viên (EMPLOYEE)
  const staffPermCodes = [
    'dashboard:read',
    'movie:read',
    'showtime:read',
    'ticket:read',
    'ticket:create',
    'ticket:update',
  ];
  const staffPerms = allPermissions.filter((p) => staffPermCodes.includes(p.code));
  await prisma.rolePermission.deleteMany({ where: { roleId: createdRoles['EMPLOYEE'] } });
  await prisma.rolePermission.createMany({
    data: staffPerms.map((p) => ({
      roleId: createdRoles['EMPLOYEE'],
      permissionId: p.id,
    })),
    skipDuplicates: true,
  });

  // 2c. Role: SUPER_ADMIN & ADMIN
  for (const r of ['SUPER_ADMIN', 'ADMIN']) {
    await prisma.rolePermission.deleteMany({ where: { roleId: createdRoles[r] } });
    await prisma.rolePermission.createMany({
      data: allPermissions.map((p) => ({
        roleId: createdRoles[r],
        permissionId: p.id,
      })),
      skipDuplicates: true,
    });
  }

  // =========================================================================
  // 3. ĐIỀU KIỆN TIÊN QUYẾT: CHI NHÁNH & MẬT KHẨU
  // =========================================================================
  const defaultBranch = await prisma.branch.upsert({
    where: { name: 'Cinema Hùng Vương HQ' },
    update: {},
    create: {
      name: 'Cinema Hùng Vương HQ',
      address: '123 Hùng Vương, Quận 5, TP. Hồ Chí Minh',
      phone: '0281234567',
    },
  });

  const hashPassword = await bcrypt.hash('Admin@2026', 10);

  // =========================================================================
  // 4. TẠO TÀI KHOẢN KÈM GÁN ROLE THỰC TẾ
  // =========================================================================
  
  // 4a. Super Admin tối cao (Bỏ qua kiểm tra RBAC thông thường vì check bằng loại UserType)
  const superAdminEmail = 'superadmin@cinema.com';
  await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      password: hashPassword,
      userType: UserType.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  // 4b. Tài khoản Quản Lý Chi Nhánh (Ví dụ: Nguyễn Văn Quản Lý)
  const managerEmail = 'manager.hungvuong@cinema.com';
  const managerUser = await prisma.user.upsert({
    where: { email: managerEmail },
    update: {
      userType: UserType.MANAGER,
    },
    create: {
      email: managerEmail,
      phone: '0909999999',
      password: hashPassword,
      userType: UserType.MANAGER,
      status: UserStatus.ACTIVE,
    },
  });

  const managerEmployee = await prisma.employee.upsert({
    where: { userId: managerUser.id },
    update: {
      roleId: createdRoles['MANAGER'],
    },
    create: {
      userId: managerUser.id,
      fullName: 'Nguyễn Văn Quản Lý',
      code: 'QL001',
      branchId: defaultBranch.id,
      roleId: createdRoles['MANAGER'],
    },
  });




  // 4c. Tài khoản Nhân Viên Bán Vé (Ví dụ: Nguyễn Văn A)
  const employeeEmail = 'staff.nguyenva@cinema.com';
  const employeeUser = await prisma.user.upsert({
    where: { email: employeeEmail },
    update: {
      userType: UserType.EMPLOYEE,
    },
    create: {
      email: employeeEmail,
      phone: '0909123456',
      password: hashPassword,
      userType: UserType.EMPLOYEE,
      status: UserStatus.ACTIVE,
    },
  });

  const staffEmployee = await prisma.employee.upsert({
    where: { userId: employeeUser.id },
    update: {
      roleId: createdRoles['EMPLOYEE'],
    },
    create: {
      userId: employeeUser.id,
      fullName: 'Nguyễn Văn A',
      code: 'NV001',
      branchId: defaultBranch.id,
      roleId: createdRoles['EMPLOYEE'],
    },
  });



  console.log('🏁 Hoàn thành! Hệ thống phân quyền cấu trúc mới đã sẵn sàng.');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });