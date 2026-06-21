import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { generateSlug } from '../../utils/slugify';
import { Prisma } from '.prisma/generated';
import * as bcrypt from 'bcrypt';
import { PageMetaDto } from '../../common/pagination/page-meta.dto';
import { PageDto } from '../../common/pagination/page.dto';
import { EmployeePageOptionsDto } from './dto/employee-page-options.dto';

@Injectable()
export class EmployeesService {
  constructor(private prisma: PrismaService) {}

  async findAll(pageOptionsDto: EmployeePageOptionsDto) {
    const { page = 1, limit = 10, search, status, roleId, branchId } = pageOptionsDto;
    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);
    const searchSlug = search ? generateSlug(search) : undefined;
    
    const where: any = {};
    if (searchSlug) {
      where.slug = {
        contains: searchSlug,
        mode: 'insensitive'
      };
    }
    if (status) {
      where.user = { status };
    }
    if (roleId) {
      where.roleId = roleId;
    }
    if (branchId) {
      where.branchId = branchId;
    }

    const [data, itemCount] = await Promise.all([
      this.prisma.employee.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              email: true,
              phone: true,
              status: true,
            }
          },
          role: {
            select: {
              name: true,
            }
          },
          branch: {
            select: {
              name: true,
            }
          }
        },
        orderBy: { code: 'asc' }
      }),
      this.prisma.employee.count({ where })
    ]);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  async create(data: any) {
    const { email, password, fullName, roleId, branchId } = data;
    
    // Auto-generate employee code (NV00001)
    let maxNumber = 0;
    
    return this.prisma.$transaction(async (tx) => {
      // Lấy tất cả mã nhân viên để tìm số lớn nhất
      const employees = await tx.employee.findMany({
        select: { code: true }
      });

      for (const emp of employees) {
        if (emp.code.startsWith('NV')) {
          const num = parseInt(emp.code.replace('NV', ''), 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      }

      let code = '';
      let isUnique = false;
      let currentNumber = maxNumber + 1;

      // Đảm bảo không trùng lặp do race condition cơ bản
      while (!isUnique) {
        code = `NV${String(currentNumber).padStart(5, '0')}`;
        const existing = await tx.employee.findUnique({ where: { code } });
        if (!existing) {
          isUnique = true;
        } else {
          currentNumber++;
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password || '123456', 10);

      const user = await tx.user.create({
        data: {
          email,
          phone: data.phone || null,
          password: hashedPassword,
          userType: 'EMPLOYEE',
          status: 'ACTIVE',
        }
      });

      const employee = await tx.employee.create({
        data: {
          userId: user.id,
          fullName,
          code,
          slug: generateSlug([fullName, code, email, data.phone].filter(Boolean).join(' ')),
          roleId: roleId || null,
          branchId: branchId || null,
        },
        include: {
          user: true,
          role: true,
          branch: true,
        }
      });

      return employee;
    });
  }

  async update(id: string, data: any) {
    return this.prisma.employee.update({
      where: { id },
      data: {
        fullName: data.fullName,
        code: data.code,
        slug: generateSlug([data.fullName, data.code, data.email, data.phone].filter(Boolean).join(' ')),
        roleId: data.roleId,
        branchId: data.branchId,
        user: data.email || data.phone || data.status !== undefined ? {
          update: {
            email: data.email,
            phone: data.phone,
            status: data.status,
          }
        } : undefined
      },
      include: {
        user: true,
        role: true,
        branch: true,
      }
    });
  }

  async remove(id: string) {
    // Delete Employee and their User account
    const employee = await this.prisma.employee.findUnique({ where: { id } });
    if (employee) {
      await this.prisma.user.delete({
        where: { id: employee.userId }
      });
    }
    return employee;
  }
}
