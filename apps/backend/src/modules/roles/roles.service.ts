import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userType?: string) {
    let excludes: string[] = ['CUSTOMER'];

    if (userType === 'ADMIN') {
      excludes.push('SUPER_ADMIN');
    } else if (userType === 'MANAGER') {
      excludes.push('SUPER_ADMIN', 'ADMIN');
    } else if (userType === 'EMPLOYEE' || !userType) {
      excludes.push('SUPER_ADMIN', 'ADMIN', 'MANAGER');
    }

    return this.prisma.role.findMany({
      where: {
        code: {
          notIn: excludes,
        }
      },
      orderBy: { code: 'asc' },
    });
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany({
      orderBy: { module: 'asc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: {
          include: { permission: true },
        },
      },
    });
  }

  async updateRolePermissions(id: string, permissionIds: string[]) {
    await this.prisma.rolePermission.deleteMany({
      where: { roleId: id },
    });

    if (permissionIds && permissionIds.length > 0) {
      await this.prisma.rolePermission.createMany({
        data: permissionIds.map((permId) => ({
          roleId: id,
          permissionId: permId,
        })),
        skipDuplicates: true,
      });
    }

    return this.findOne(id);
  }
}
