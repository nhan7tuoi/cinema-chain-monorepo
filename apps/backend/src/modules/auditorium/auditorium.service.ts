import { PrismaService } from "@/prisma.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateAuditoriumDto, UpdateAuditoriumDto } from "./dto/auditorium.repo.dto";

@Injectable()
export class AuditoriumService {
    constructor(private readonly prisma: PrismaService) { }

    async getAll(branchId?: string) {
        return this.prisma.auditorium.findMany({
            where: branchId ? { branchId } : undefined,
            include: {
                branch: true,
                _count: {
                    select: { seats: true, showtimes: true },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async getById(id: string) {
        const auditorium = await this.prisma.auditorium.findUnique({
            where: { id },
            include: {
                branch: true,
                seats: {
                    orderBy: [{ gridRow: 'asc' }, { gridCol: 'asc' }],
                },
            },
        });

        if (!auditorium) {
            throw new NotFoundException('Auditorium not found');
        }

        return auditorium;
    }

    async create(data: CreateAuditoriumDto) {
        return this.prisma.auditorium.create({
            data: {
                branchId: data.branchId,
                name: data.name,
                format: data.format || '2D',
                capacity: data.capacity || 0,
                layoutRows: data.layoutRows || 0,
                layoutCols: data.layoutCols || 0,
                isActive: data.isActive ?? true,
            },
            include: { branch: true },
        });
    }

    async update(id: string, data: UpdateAuditoriumDto) {
        await this.getById(id);

        return this.prisma.auditorium.update({
            where: { id },
            data,
            include: { branch: true },
        });
    }

    async delete(id: string) {
        await this.getById(id);

        const futureShowtimes = await this.prisma.showtime.count({
            where: {
                auditoriumId: id,
                startsAt: { gte: new Date() },
            },
        });

        if (futureShowtimes > 0) {
            throw new BadRequestException('Cannot delete auditorium with future showtimes');
        }

        return this.prisma.auditorium.delete({ where: { id } });
    }
}
