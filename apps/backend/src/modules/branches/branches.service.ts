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
        name: true,
        address: true,
        phone: true,
        isActive: true,
        createdAt: true,
      }
    });
  }

  async findOne(id: string) {
    const branch = await this.prisma.branch.findUnique({
      where: { id },
    });
    if (!branch) {
      throw new NotFoundException(`Chi nhánh với ID ${id} không tồn tại`);
    }
    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto) {
    await this.findOne(id); // Ensure exists
    return this.prisma.branch.update({
      where: { id },
      data: updateBranchDto,
    });
  }

  async toggleStatus(id: string) {
    const branch = await this.findOne(id);
    return this.prisma.branch.update({
      where: { id },
      data: { isActive: !branch.isActive },
    });
  }
}
