import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { generateSlug } from '../../utils/slugify';
import * as bcrypt from 'bcrypt';
import { PageMetaDto } from '../../common/pagination/page-meta.dto';
import { PageDto } from '../../common/pagination/page.dto';
import { CustomerPageOptionsDto } from './dto/customer-page-options.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async findAll(pageOptionsDto: CustomerPageOptionsDto) {
    const { page = 1, limit = 10, search, status, rank } = pageOptionsDto;
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
    if (rank) {
      where.rank = rank;
    }

    const [data, itemCount] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              email: true,
              status: true,
              phone: true,
            }
          }
        },
        orderBy: { fullName: 'asc' }
      }),
      this.prisma.customer.count({ where })
    ]);

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(data, pageMetaDto);
  }

  async create(data: any) {
    const { email, phone, password, fullName, points, rank, birthDate } = data;
    
    const hashedPassword = await bcrypt.hash(password || '123456', 10);
    
    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          phone,
          password: hashedPassword, 
          userType: 'CUSTOMER',
          status: 'ACTIVE',
        }
      });

      const customer = await tx.customer.create({
        data: {
          userId: user.id,
          fullName,
          slug: generateSlug([fullName, email, phone].filter(Boolean).join(' ')),
          points: points || 0,
          rank: rank || 'MEMBER',
          birthDate: birthDate ? new Date(birthDate) : null,
        },
        include: {
          user: true,
        }
      });

      return customer;
    });
  }

  async update(id: string, data: any) {
    return this.prisma.customer.update({
      where: { id },
      data: {
        fullName: data.fullName,
        slug: generateSlug([data.fullName, data.email, data.phone].filter(Boolean).join(' ')),
        points: data.points,
        rank: data.rank,
        birthDate: data.birthDate ? new Date(data.birthDate) : undefined,
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
      }
    });
  }

  async remove(id: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (customer) {
      await this.prisma.user.delete({
        where: { id: customer.userId }
      });
    }
    return customer;
  }
}
