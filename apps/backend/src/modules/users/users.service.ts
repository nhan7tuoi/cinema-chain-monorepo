import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, User } from '.prisma/generated';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private uploadService: UploadService,
  ) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        customer: true,
        employee: true,
      },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateProfile(userId: string, data: { fullName?: string; avatarUrl?: string }) {
    const user = await this.findByEmail(
      (await this.findById(userId))?.email || ''
    );
    if (!user) throw new Error('User not found');

    const oldAvatarUrl = user.userType === 'CUSTOMER' ? user.customer?.avatarUrl : user.employee?.avatarUrl;

    if (data.avatarUrl && data.avatarUrl !== oldAvatarUrl && oldAvatarUrl) {
      await this.uploadService.deleteFile(oldAvatarUrl);
    }

    if (user.userType === 'CUSTOMER') {
      return this.prisma.customer.update({
        where: { userId },
        data: {
          fullName: data.fullName,
          avatarUrl: data.avatarUrl,
        },
      });
    } else {
      return this.prisma.employee.update({
        where: { userId },
        data: {
          fullName: data.fullName,
          avatarUrl: data.avatarUrl,
        },
      });
    }
  }
}
