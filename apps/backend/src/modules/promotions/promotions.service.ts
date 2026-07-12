import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findActiveClient(limit = 3) {
    const safeLimit = Math.max(1, Math.min(limit, 12));
    const now = new Date();

    const promotions = await this.prisma.promotion.findMany({
      where: {
        isActive: true,
        OR: [{ startsAt: null }, { startsAt: { lte: now } }],
        AND: [{ OR: [{ endsAt: null }, { endsAt: { gte: now } }] }],
      },
      take: safeLimit,
      orderBy: [{ startsAt: 'desc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        slug: true,
        title: true,
        summary: true,
        content: true,
        imageUrl: true,
        badge: true,
      },
    });

    return promotions.map((promotion) => ({
      id: promotion.slug ?? promotion.id,
      title: promotion.title,
      description: promotion.summary ?? promotion.content ?? '',
      imageUrl: promotion.imageUrl ?? '/window.svg',
      badge: promotion.badge,
    }));
  }
}
