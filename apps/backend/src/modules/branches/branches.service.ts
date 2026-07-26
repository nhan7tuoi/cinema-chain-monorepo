import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async create(createBranchDto: CreateBranchDto) {
    return this.prisma.branch.create({
      data: createBranchDto,
    });
  }

  async findAll() {
    return this.prisma.branch.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        name: true,
        address: true,
        city: true,
        district: true,
        latitude: true,
        longitude: true,
        phone: true,
        coverUrl: true,
        mapUrl: true,
        openingHours: true,
        amenities: true,
        isActive: true,
        createdAt: true,
      }
    });
  }

  async findAllClient(limit = 4) {
    const safeLimit = Math.max(1, Math.min(limit, 12));

    const branches = await this.prisma.branch.findMany({
      where: { isActive: true },
      take: safeLimit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        name: true,
        address: true,
        city: true,
        district: true,
        mapUrl: true,
      },
    });

    return branches.map((branch) => ({
      id: branch.slug ?? branch.id,
      name: branch.name,
      address: [branch.address, branch.district, branch.city].filter(Boolean).join(', '),
      distance: 'Xem bản đồ',
      mapUrl: branch.mapUrl,
    }));
  }

  async findOne(id: number) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
    });
    if (!branch) {
      throw new NotFoundException(`Chi nhánh với ID ${id} không tồn tại`);
    }
    return branch;
  }

  async update(id: number, updateBranchDto: UpdateBranchDto) {
    await this.findOne(id); // Ensure exists
    return this.prisma.branch.update({
      where: { id },
      data: updateBranchDto,
    });
  }

  async toggleStatus(id: number) {
    const branch = await this.findOne(id);
    return this.prisma.branch.update({
      where: { id },
      data: { isActive: !branch.isActive },
    });
  }
}
