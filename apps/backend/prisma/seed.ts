import {
  ArticleStatus,
  MovieStatus,
  PrismaClient,
  SeatStatus,
  SeatType,
  UserStatus,
  UserType,
} from '.prisma/generated';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function buildSeedSeats(rowCount: number, colCount: number) {
  const seats: {
    rowLabel: string;
    number: number;
    code: string;
    gridRow: number;
    gridCol: number;
    type: SeatType;
    status: SeatStatus;
    couplePairId?: string;
  }[] = [];

  for (let row = 0; row < rowCount; row++) {
    const rowLabel = String.fromCharCode(65 + row);
    const isCoupleRow = row === rowCount - 1 && colCount >= 8;

    for (let col = 1; col <= colCount; col++) {
      if (!isCoupleRow && colCount >= 12 && (col === Math.ceil(colCount / 3) || col === Math.ceil((colCount / 3) * 2))) {
        continue;
      }

      const isVip = !isCoupleRow && row >= Math.max(rowCount - 3, 0);
      const couplePairId = isCoupleRow ? `couple-${rowLabel}-${Math.ceil(col / 2)}` : undefined;

      seats.push({
        rowLabel,
        number: col,
        code: `${rowLabel}${col}`,
        gridRow: row,
        gridCol: col,
        type: isCoupleRow ? SeatType.COUPLE : isVip ? SeatType.VIP : SeatType.STANDARD,
        status: SeatStatus.ACTIVE,
        couplePairId,
      });
    }
  }

  return seats;
}

async function seedPermissions() {
  const modules = [
    { code: 'dashboard', name: 'Dashboard' },
    { code: 'branch', name: 'Branch' },
    { code: 'employee', name: 'Employee' },
    { code: 'customer', name: 'Customer' },
    { code: 'role', name: 'Role' },
    { code: 'movie', name: 'Movie' },
    { code: 'showtime', name: 'Showtime' },
    { code: 'ticket', name: 'Ticket' },
    { code: 'config', name: 'Config' },
  ];

  const actions = [
    { code: 'read', name: 'Read' },
    { code: 'create', name: 'Create' },
    { code: 'update', name: 'Update' },
    { code: 'delete', name: 'Delete' },
  ];

  const permissions: { code: string; id: string }[] = [];

  for (const module of modules) {
    for (const action of actions) {
      const code = `${module.code}:${action.code}`;
      const permission = await prisma.permission.upsert({
        where: { name: code },
        update: {
          displayName: `${action.name} ${module.name}`,
          module: module.code,
          description: `${action.name} permission for ${module.name}`,
        },
        create: {
          name: code,
          displayName: `${action.name} ${module.name}`,
          module: module.code,
          description: `${action.name} permission for ${module.name}`,
        },
      });

      permissions.push({ code: permission.name, id: permission.id });
    }
  }

  return permissions;
}

async function seedRoles(allPermissions: { code: string; id: string }[]) {
  const rolesData = [
    { code: 'SUPER_ADMIN', name: 'Super Admin', desc: 'Full system access.' },
    { code: 'ADMIN', name: 'Admin', desc: 'System administrator.' },
    { code: 'MANAGER', name: 'Manager', desc: 'Branch operation manager.' },
    { code: 'EMPLOYEE', name: 'Employee', desc: 'Cinema staff.' },
    { code: 'CUSTOMER', name: 'Customer', desc: 'Cinema customer.' },
  ];

  const roles: Record<string, string> = {};

  for (const roleData of rolesData) {
    const role = await prisma.role.upsert({
      where: { code: roleData.code },
      update: {
        name: roleData.name,
        description: roleData.desc,
        isSystem: true,
      },
      create: {
        code: roleData.code,
        name: roleData.name,
        description: roleData.desc,
        isSystem: true,
      },
    });

    roles[role.code] = role.id;
  }

  const managerPermissions = allPermissions.filter((permission) => !permission.code.startsWith('role:') && !permission.code.startsWith('config:'));
  const staffPermissionCodes = ['dashboard:read', 'movie:read', 'showtime:read', 'ticket:read', 'ticket:create', 'ticket:update'];
  const staffPermissions = allPermissions.filter((permission) => staffPermissionCodes.includes(permission.code));

  const rolePermissionMap = {
    SUPER_ADMIN: allPermissions,
    ADMIN: allPermissions,
    MANAGER: managerPermissions,
    EMPLOYEE: staffPermissions,
  };

  for (const [roleCode, permissions] of Object.entries(rolePermissionMap)) {
    await prisma.rolePermission.deleteMany({ where: { roleId: roles[roleCode] } });
    await prisma.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId: roles[roleCode],
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });
  }

  return roles;
}

async function seedBranches() {
  const branches = [
    {
      name: 'Cinema Hung Vuong HQ',
      slug: 'cinema-hung-vuong-hq',
      address: '123 Hung Vuong, District 5, Ho Chi Minh City',
      city: 'Ho Chi Minh City',
      district: 'District 5',
      latitude: 10.754792,
      longitude: 106.663858,
      phone: '0281234567',
      coverUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba',
      mapUrl: 'https://maps.google.com/?q=10.754792,106.663858',
      openingHours: { weekdays: '09:00-23:00', weekend: '08:00-24:00' },
      amenities: { parking: true, imax: true, dolby: true, vip: true },
    },
    {
      name: 'CinePremium Landmark 81',
      slug: 'cinepremium-landmark-81',
      address: '720A Dien Bien Phu, Binh Thanh, Ho Chi Minh City',
      city: 'Ho Chi Minh City',
      district: 'Binh Thanh',
      latitude: 10.794837,
      longitude: 106.721851,
      phone: '0287654321',
      coverUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c',
      mapUrl: 'https://maps.google.com/?q=10.794837,106.721851',
      openingHours: { weekdays: '09:30-23:30', weekend: '08:30-24:00' },
      amenities: { parking: true, imax: false, dolby: true, vip: true },
    },
  ];

  const savedBranches: { id: string }[] = [];

  for (const branch of branches) {
    const savedBranch = await prisma.branch.upsert({
      where: { name: branch.name },
      update: branch,
      create: branch,
    });

    savedBranches.push(savedBranch);
  }

  return savedBranches;
}

async function seedAuditoriums(branchId: string) {
  const auditoriumSeeds = [
    { name: 'Room 01', format: 'IMAX Laser', layoutRows: 7, layoutCols: 14 },
    { name: 'Room 02', format: 'Dolby Cinema', layoutRows: 7, layoutCols: 12 },
    { name: 'Room 03', format: 'Standard 4K', layoutRows: 6, layoutCols: 12 },
    { name: 'Room 04', format: 'VIP Suites', layoutRows: 5, layoutCols: 10 },
    { name: 'Room 05', format: 'ScreenX', layoutRows: 8, layoutCols: 16 },
  ];

  for (const auditorium of auditoriumSeeds) {
    const seats = buildSeedSeats(auditorium.layoutRows, auditorium.layoutCols);
    const savedAuditorium = await prisma.auditorium.upsert({
      where: {
        branchId_name: {
          branchId,
          name: auditorium.name,
        },
      },
      update: {
        format: auditorium.format,
        capacity: seats.length,
        layoutRows: auditorium.layoutRows,
        layoutCols: auditorium.layoutCols,
        isActive: true,
      },
      create: {
        branchId,
        ...auditorium,
        capacity: seats.length,
        isActive: true,
      },
    });

    await prisma.seat.deleteMany({ where: { auditoriumId: savedAuditorium.id } });
    await prisma.seat.createMany({
      data: seats.map((seat) => ({
        ...seat,
        auditoriumId: savedAuditorium.id,
      })),
    });
  }
}

async function seedMovies() {
  const movieSeeds = [
    {
      slug: 'mua-do',
      title: 'Mưa Đỏ',
      originalTitle: 'Mưa Đỏ',
      director: 'Đặng Thái Huyền',
      cast: 'Đỗ Nhật Hoàng, Nguyễn Hùng',
      genre: 'Drama, War',
      duration: 124,
      releaseDate: new Date('2026-07-10'),
      endDate: new Date('2026-09-10'),
      format: '2D',
      synopsis: 'Câu chuyện chiến tranh và tuổi trẻ được kể qua những khoảnh khắc đầy cảm xúc trên màn ảnh rộng.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753663/cinema/movies/mua-do.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783754598/cinema/movies/hero/hero-mua-do.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'T13',
      language: 'Tiếng Việt',
      subtitle: 'Phụ đề tiếng Anh',
      country: 'Việt Nam',
      averageRating: 8.7,
      ratingCount: 820,
      viewCount: 52000,
      isFeatured: true,
      featuredOrder: 1,
      status: MovieStatus.NOW_SHOWING,
    },
    {
      slug: 'dong-dao-ma-quai',
      title: 'Đông Đảo Ma Quái',
      originalTitle: 'Đông Đảo Ma Quái',
      director: 'Đặng Minh Quốc',
      cast: 'Tuấn Trần, Lê Khánh, Oanh Kiều',
      genre: 'Horror, Comedy',
      duration: 112,
      releaseDate: new Date('2026-07-03'),
      endDate: new Date('2026-08-20'),
      format: '2D',
      synopsis: 'Một nhóm bạn vô tình cuốn vào những bí mật kỳ quái trong chuyến đi đầy tiếng cười và sợ hãi.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753664/cinema/movies/dong-dao-ma-quai.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783754600/cinema/movies/hero/hero-dong-dao-ma-quai.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'T16',
      language: 'Tiếng Việt',
      subtitle: 'Phụ đề tiếng Anh',
      country: 'Việt Nam',
      averageRating: 8.2,
      ratingCount: 640,
      viewCount: 47000,
      isFeatured: true,
      featuredOrder: 2,
      status: MovieStatus.NOW_SHOWING,
    },
    {
      slug: 'den-la-sat',
      title: 'Đền Lạ Sắt',
      originalTitle: 'Đền Lạ Sắt',
      director: 'Kōji Shiraishi',
      cast: 'Kim Jae-joong, Kong Seong-ha, Ko Yoon-joon',
      genre: 'Horror, Thriller',
      duration: 108,
      releaseDate: new Date('2026-07-03'),
      endDate: new Date('2026-08-25'),
      format: '2D',
      synopsis: 'Sự giao thoa tín ngưỡng tâm linh Hàn - Nhật mở ra chuỗi ám ảnh khi kẻ phạm đền thiêng phải trả giá.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753665/cinema/movies/den-la-sat.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783754601/cinema/movies/hero/hero-den-la-sat.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'T18',
      language: 'Tiếng Hàn',
      subtitle: 'Phụ đề tiếng Việt',
      country: 'Hàn Quốc',
      averageRating: 8.0,
      ratingCount: 510,
      viewCount: 43000,
      isFeatured: true,
      featuredOrder: 3,
      status: MovieStatus.NOW_SHOWING,
    },
    {
      slug: 'hau-due-than-mat-troi',
      title: 'Ngày Xửa Ngày Xưa 36: Hậu Duệ Thần Mặt Trời',
      originalTitle: 'Ngày Xửa Ngày Xưa 36: Hậu Duệ Thần Mặt Trời',
      director: 'Đình Toàn',
      cast: 'Bạch Long, Thành Thủy, Hoàng Trinh',
      genre: 'Adventure, Family',
      duration: 105,
      releaseDate: new Date('2026-07-18'),
      endDate: new Date('2026-09-18'),
      format: '2D',
      synopsis: 'Câu chuyện thần thoại Hàn Quốc ly kỳ được đưa lên màn ảnh rộng với màu sắc sân khấu rực rỡ và giàu tính giải trí.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783754594/cinema/movies/hero/hero-trang-quynh-nhi.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783754594/cinema/movies/hero/hero-trang-quynh-nhi.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'P',
      language: 'Tiếng Việt',
      subtitle: 'Không phụ đề',
      country: 'Việt Nam',
      averageRating: 8.5,
      ratingCount: 690,
      viewCount: 64000,
      isFeatured: true,
      featuredOrder: 4,
      status: MovieStatus.NOW_SHOWING,
    },
    {
      slug: 'quy-bat-hon',
      title: 'Quỷ Bắt Hồn',
      originalTitle: 'Quỷ Bắt Hồn',
      director: 'Nguyễn Thanh Nam',
      cast: 'Tiểu Vy, Hữu Tiến, Lâm Thanh Nhã',
      genre: 'Horror, Mystery',
      duration: 111,
      releaseDate: new Date('2026-07-10'),
      endDate: new Date('2026-09-10'),
      format: '2D',
      synopsis: 'Một nghi lễ bí mật đánh thức những linh hồn không yên nghỉ, đẩy cả nhóm vào đêm kinh hoàng không lối thoát.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783754595/cinema/movies/hero/hero-quy-bat-hon.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783754595/cinema/movies/hero/hero-quy-bat-hon.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'T18',
      language: 'Tiếng Việt',
      subtitle: 'Phụ đề tiếng Anh',
      country: 'Việt Nam',
      averageRating: 8.1,
      ratingCount: 520,
      viewCount: 54000,
      isFeatured: true,
      featuredOrder: 5,
      status: MovieStatus.NOW_SHOWING,
    },
    {
      slug: 'minions-va-quai-vat',
      title: 'Minions & Quái Vật',
      originalTitle: 'Minions & Monsters',
      director: 'Pierre Coffin',
      cast: 'Tran Thanh, Steve Carell, Pierre Coffin',
      genre: 'Animation, Comedy',
      duration: 98,
      releaseDate: new Date('2026-07-25'),
      endDate: new Date('2026-09-30'),
      format: '2D',
      synopsis: 'Biệt đội Minions quay lại với một phiêu lưu hỗn loạn, hài hước và tràn ngập những quái vật đáng yêu.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783754596/cinema/movies/hero/hero-minions-va-quai-vat.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783754599/cinema/movies/hero/hero-minions-tran-thanh.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'P',
      language: 'Tiếng Anh',
      subtitle: 'Lồng tiếng Việt',
      country: 'Mỹ',
      averageRating: 8.4,
      ratingCount: 880,
      viewCount: 82000,
      isFeatured: true,
      featuredOrder: 6,
      status: MovieStatus.COMING_SOON,
    },
    {
      slug: 'bong-quy',
      title: 'Bóng Quỷ',
      originalTitle: 'Leviticus',
      director: 'Kim Tae Hyoung',
      cast: 'Lee Min Ki, Han Ji Hyun',
      genre: 'Horror, Thriller',
      duration: 105,
      releaseDate: new Date('2026-07-03'),
      endDate: new Date('2026-08-18'),
      format: '2D',
      synopsis: 'Dục vọng phải sám hối, quỷ dữ đến hỏi tội trong kiệt tác kinh dị được mong chờ.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753666/cinema/movies/bong-quy.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753666/cinema/movies/bong-quy.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'T18',
      language: 'Tiếng Anh',
      subtitle: 'Phụ đề tiếng Việt',
      country: 'Mỹ',
      averageRating: 8.1,
      ratingCount: 570,
      viewCount: 45000,
      isFeatured: false,
      featuredOrder: null,
      status: MovieStatus.NOW_SHOWING,
    },
    {
      slug: 'minh-hon-trong-long-buom',
      title: 'Minh Hôn Trong Lòng Bướm',
      originalTitle: 'Minh Hôn Trong Lòng Bướm',
      director: 'Vũ Ngọc Đãng',
      cast: 'Trần Nghĩa, Diệp Bảo Ngọc',
      genre: 'Horror, Mystery',
      duration: 110,
      releaseDate: new Date('2026-07-25'),
      endDate: new Date('2026-09-12'),
      format: '2D',
      synopsis: 'Lấy người âm binh, hồi sinh gia tộc: một nghi lễ tăm tối mở ra chuỗi bi kịch khó thoát.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753667/cinema/movies/minh-hon-trong-long-dat.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753667/cinema/movies/minh-hon-trong-long-dat.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'T18',
      language: 'Tiếng Việt',
      subtitle: 'Phụ đề tiếng Anh',
      country: 'Việt Nam',
      averageRating: 7.9,
      ratingCount: 430,
      viewCount: 39000,
      isFeatured: true,
      featuredOrder: 7,
      status: MovieStatus.COMING_SOON,
    },
    {
      slug: 'tung-hoanh-tu-hai',
      title: 'Tung Hoành Tứ Hải',
      originalTitle: 'Tung Hoành Tứ Hải',
      director: 'Võ Thanh Hòa',
      cast: 'Kiều Minh Tuấn, Thuận Nguyễn, Diệu Nhi',
      genre: 'Action, Comedy',
      duration: 116,
      releaseDate: new Date('2026-07-18'),
      endDate: new Date('2026-09-05'),
      format: '2D',
      synopsis: 'Một phi vụ bất ngờ đưa những con người trái ngược vào hành trình vừa nguy hiểm vừa đầy tiếng cười.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753668/cinema/movies/tung-hoanh-tu-hai.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753668/cinema/movies/tung-hoanh-tu-hai.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'T16',
      language: 'Tiếng Việt',
      subtitle: 'Phụ đề tiếng Anh',
      country: 'Việt Nam',
      averageRating: 8.3,
      ratingCount: 760,
      viewCount: 61000,
      isFeatured: false,
      featuredOrder: null,
      status: MovieStatus.NOW_SHOWING,
    },
    {
      slug: 'conan-tham-tu-lung-danh',
      title: 'Thám Tử Lừng Danh Conan',
      originalTitle: 'Detective Conan',
      director: 'Chika Nagaoka',
      cast: 'Minami Takayama, Wakana Yamazaki, Rikiya Koyama',
      genre: 'Animation, Mystery',
      duration: 111,
      releaseDate: new Date('2026-07-24'),
      endDate: new Date('2026-09-24'),
      format: '2D',
      synopsis: 'Conan và nhóm bạn đối mặt một vụ án mới với những màn suy luận căng thẳng và bất ngờ.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753669/cinema/movies/conan-tham-tu-lung-danh.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753669/cinema/movies/conan-tham-tu-lung-danh.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'P',
      language: 'Tiếng Nhật',
      subtitle: 'Phụ đề tiếng Việt',
      country: 'Nhật Bản',
      averageRating: 8.6,
      ratingCount: 920,
      viewCount: 73000,
      isFeatured: false,
      featuredOrder: null,
      status: MovieStatus.COMING_SOON,
    },
    {
      slug: 'lau-chua',
      title: 'Lầu Chứa',
      originalTitle: 'Lầu Chứa',
      director: 'Hùng Trần',
      cast: 'Quang Su, Jun Vu, Lam Thanh My',
      genre: 'Horror, Mystery',
      duration: 109,
      releaseDate: new Date('2026-08-01'),
      endDate: new Date('2026-09-20'),
      format: '2D',
      synopsis: 'Khai đàn gọi hồn, đánh thức ác linh trong căn nhà họ Hứa với lời nguyền chưa từng ngủ yên.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753670/cinema/movies/lau-chua.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753670/cinema/movies/lau-chua.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'T18',
      language: 'Tiếng Việt',
      subtitle: 'Phụ đề tiếng Anh',
      country: 'Việt Nam',
      averageRating: 8.0,
      ratingCount: 480,
      viewCount: 41000,
      isFeatured: false,
      featuredOrder: null,
      status: MovieStatus.COMING_SOON,
    },
    {
      slug: 'am-anh',
      title: 'Ám Ảnh',
      originalTitle: 'Ám Ảnh',
      director: 'Lê Bình Giang',
      cast: 'Trần Phong, Hồ Thu Anh',
      genre: 'Drama, Thriller',
      duration: 102,
      releaseDate: new Date('2026-07-26'),
      endDate: new Date('2026-09-10'),
      format: '2D',
      synopsis: 'Một biến cố trong quá khứ trở lại qua những đoạn ký ức đứt gãy, đẩy nhân vật chính vào nỗi sợ không lối thoát.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753670/cinema/movies/am-anh.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753670/cinema/movies/am-anh.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'T16',
      language: 'Tiếng Việt',
      subtitle: 'Phụ đề tiếng Anh',
      country: 'Việt Nam',
      averageRating: 7.8,
      ratingCount: 360,
      viewCount: 33000,
      isFeatured: false,
      featuredOrder: null,
      status: MovieStatus.NOW_SHOWING,
    },
    {
      slug: 'thanh-sac',
      title: 'Thanh Sắc',
      originalTitle: 'Thanh Sắc',
      director: 'Thắng Vũ',
      cast: 'Thanh Hằng, Hồng Ánh, Lương Thế Thành, Khả Ngân',
      genre: 'Comedy, Drama',
      duration: 113,
      releaseDate: new Date('2026-08-08'),
      endDate: new Date('2026-09-30'),
      format: '2D',
      synopsis: 'Phía đánh ghen chấn động nhất màn ảnh Việt trong không khí phòng trà rực rỡ, nhiều tham vọng và bí mật.',
      posterUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753671/cinema/movies/tranh-vac.png',
      backdropUrl: 'https://res.cloudinary.com/dvsuhb9cj/image/upload/v1783753671/cinema/movies/tranh-vac.png',
      trailerUrl: 'https://www.youtube.com',
      ageRating: 'T13',
      language: 'Tiếng Việt',
      subtitle: 'Phụ đề tiếng Anh',
      country: 'Việt Nam',
      averageRating: 8.4,
      ratingCount: 700,
      viewCount: 58000,
      isFeatured: false,
      featuredOrder: null,
      status: MovieStatus.COMING_SOON,
    },
  ];

  await prisma.movie.updateMany({
    where: {
      slug: {
        in: [
          'dune-part-two',
          'inside-out-2',
          'oppenheimer',
          'kung-fu-panda-4',
          'am-vang-neon',
          'me-oi-ve-nha',
          'trang-quynh-nhi',
          'minh-hon-trong-long-dat',
          'tranh-vac',
        ],
      },
    },
    data: {
      isFeatured: false,
      featuredOrder: null,
    },
  });

  for (const movie of movieSeeds) {
    await prisma.movie.upsert({
      where: { slug: movie.slug },
      update: movie,
      create: movie,
    });
  }
}

async function seedPromotions() {
  const promotionSeeds = [
    {
      slug: 'weekend-combo',
      title: 'Weekend Combo',
      summary: 'Save 25% on popcorn and drinks for weekend showtimes.',
      content: 'Applies every Saturday and Sunday for online ticket purchases.',
      imageUrl: 'https://images.unsplash.com/photo-1585647347483-22b66260dfff',
      badge: 'Save 25%',
      startsAt: new Date('2026-07-01'),
      endsAt: new Date('2026-08-31'),
      terms: 'Valid while supplies last. Cannot be combined with other promotions.',
      isActive: true,
    },
    {
      slug: 'member-day',
      title: 'Member Day',
      summary: 'Members get special ticket prices every Wednesday.',
      content: 'Sign in with a customer account to unlock member prices.',
      imageUrl: 'https://images.unsplash.com/photo-1608170825938-a8ea0305d46c',
      badge: 'Members only',
      startsAt: new Date('2026-07-01'),
      endsAt: new Date('2026-12-31'),
      terms: 'Only applies to standard seats and selected showtimes.',
      isActive: true,
    },
  ];

  for (const promotion of promotionSeeds) {
    await prisma.promotion.upsert({
      where: { slug: promotion.slug },
      update: promotion,
      create: promotion,
    });
  }
}

async function seedArticles() {
  const articleSeeds = [
    {
      slug: 'imax-laser-experience',
      title: 'Why IMAX Laser changes the cinema experience',
      excerpt: 'Sharper projection, richer contrast, and bigger sound for blockbuster nights.',
      content: 'IMAX Laser combines high brightness projection with precise audio tuning for premium auditoriums.',
      coverUrl: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4',
      category: 'Technology',
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date('2026-07-05'),
    },
    {
      slug: 'summer-movie-guide-2026',
      title: 'Summer movie guide 2026',
      excerpt: 'A quick look at the biggest releases arriving this summer.',
      content: 'From animation to sci-fi and thrillers, this summer lineup brings something for every movie fan.',
      coverUrl: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26',
      category: 'Movies',
      status: ArticleStatus.PUBLISHED,
      publishedAt: new Date('2026-07-08'),
    },
  ];

  for (const article of articleSeeds) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: article,
      create: article,
    });
  }
}

async function seedUsers(roles: Record<string, string>, branchId: string) {
  const hashPassword = await bcrypt.hash('Admin@2026', 10);

  await prisma.user.upsert({
    where: { email: 'superadmin@cinema.com' },
    update: {
      userType: UserType.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'superadmin@cinema.com',
      password: hashPassword,
      userType: UserType.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager.hungvuong@cinema.com' },
    update: {
      userType: UserType.MANAGER,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'manager.hungvuong@cinema.com',
      phone: '0909999999',
      password: hashPassword,
      userType: UserType.MANAGER,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.employee.upsert({
    where: { userId: managerUser.id },
    update: {
      fullName: 'Branch Manager',
      branchId,
      roleId: roles.MANAGER,
    },
    create: {
      userId: managerUser.id,
      fullName: 'Branch Manager',
      code: 'QL001',
      branchId,
      roleId: roles.MANAGER,
    },
  });

  const employeeUser = await prisma.user.upsert({
    where: { email: 'staff.nguyenva@cinema.com' },
    update: {
      userType: UserType.EMPLOYEE,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'staff.nguyenva@cinema.com',
      phone: '0909123456',
      password: hashPassword,
      userType: UserType.EMPLOYEE,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.employee.upsert({
    where: { userId: employeeUser.id },
    update: {
      fullName: 'Ticket Staff',
      branchId,
      roleId: roles.EMPLOYEE,
    },
    create: {
      userId: employeeUser.id,
      fullName: 'Ticket Staff',
      code: 'NV001',
      branchId,
      roleId: roles.EMPLOYEE,
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: 'customer.demo@cinema.com' },
    update: {
      userType: UserType.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
    create: {
      email: 'customer.demo@cinema.com',
      phone: '0909888777',
      password: hashPassword,
      userType: UserType.CUSTOMER,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.customer.upsert({
    where: { userId: customerUser.id },
    update: {
      fullName: 'Demo Customer',
      points: 1280,
      rank: 'VIP',
      slug: 'demo-customer',
    },
    create: {
      userId: customerUser.id,
      fullName: 'Demo Customer',
      points: 1280,
      rank: 'VIP',
      slug: 'demo-customer',
    },
  });
}

async function main() {
  console.log('Starting cinema seed...');

  const permissions = await seedPermissions();
  const roles = await seedRoles(permissions);
  const branches = await seedBranches();

  await seedAuditoriums(branches[0].id);
  await seedMovies();
  await seedPromotions();
  await seedArticles();
  await seedUsers(roles, branches[0].id);

  console.log('Cinema seed completed.');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
