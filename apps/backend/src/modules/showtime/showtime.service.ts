import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { CreateShowtimeDto, GenerateShowtimesDto, UpdateShowtimeDto } from "./dto/showtime.repo.dto";
import { Prisma, Showtime, ShowtimeStatus } from ".prisma/generated";

@Injectable()
export class ShowtimeService {
    constructor(private readonly prisma: PrismaService) { }
    private readonly defaultBufferMinutes = 15;

    /** Tu dong cap nhat cac suat chieu da qua gio ket thuc sang trang thai FINISHED. */
    private async markFinishedShowtimes() {
        await this.prisma.showtime.updateMany({
            where: {
                endsAt: { lt: new Date() },
                status: {
                    notIn: [ShowtimeStatus.FINISHED, ShowtimeStatus.CANCELLED],
                },
            },
            data: {
                status: ShowtimeStatus.FINISHED,
            },
        });
    }

    /** Cong hoac tru so phut tren mot moc thoi gian. */
    private addMinutes(date: Date, minutes: number) {
        return new Date(date.getTime() + minutes * 60 * 1000);
    }

    /** Parse Date/string thanh Date hop le, sai dinh dang thi nem BadRequestException. */
    private parseDateTime(value: Date | string) {
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) {
            throw new BadRequestException('Invalid date time.');
        }
        return date;
    }

    /** Ghep ngay va gio thanh Date, co ho tro gio 24:00 de dai dien dau ngay hom sau. */
    private parseDayTime(dateValue: string, timeValue: string) {
        if (timeValue === '24:00') {
            const nextDay = new Date(`${dateValue}T00:00:00`);
            nextDay.setDate(nextDay.getDate() + 1);
            return nextDay;
        }
        return this.parseDateTime(`${dateValue}T${timeValue}:00`);
    }

    /** Dam bao gio bat dau nam tren moc 5 phut: 10:00, 10:05, 10:10... */
    private ensureFiveMinuteBoundary(date: Date) {
        if (date.getMinutes() % 5 !== 0 || date.getSeconds() !== 0 || date.getMilliseconds() !== 0) {
            throw new BadRequestException('Showtime start time must be on a 5-minute boundary.');
        }
    }

    /** Lam tron thoi gian len moc 5 phut gan nhat de sinh slot dep va de chon. */
    private roundUpToFiveMinuteBoundary(date: Date) {
        const next = new Date(date);
        const minuteRemainder = next.getMinutes() % 5;

        if (minuteRemainder > 0 || next.getSeconds() > 0 || next.getMilliseconds() > 0) {
            next.setMinutes(next.getMinutes() + (minuteRemainder === 0 ? 5 : 5 - minuteRemainder));
        }

        next.setSeconds(0, 0);
        return next;
    }

    /** Format Date ve yyyy-MM-dd theo local time de lap qua tung ngay. */
    private formatDateLocal(date: Date) {
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /** Tao danh sach ngay tu dateFrom den dateTo, dong thoi chan dateTo nho hon dateFrom. */
    private getDateRange(dateFrom: string, dateTo: string) {
        const start = this.parseDateTime(`${dateFrom}T00:00:00`);
        const end = this.parseDateTime(`${dateTo}T00:00:00`);
        const dates: string[] = [];

        if (start > end) {
            throw new BadRequestException('dateFrom must be before or equal dateTo.');
        }

        for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 1)) {
            dates.push(this.formatDateLocal(cursor));
        }

        return dates;
    }

    /** Lay thoi luong phim tu database de tinh gio ket thuc suat chieu. */
    private async getMovieDuration(movieId: string) {
        const movie = await this.prisma.movie.findUnique({
            where: { id: movieId },
            select: { duration: true },
        });

        if (!movie) {
            throw new NotFoundException('Movie not found');
        }

        return movie.duration;
    }

    /** Kiem tra phong chieu co ton tai va thuoc dung rap dang thao tac hay khong. */
    private async ensureAuditoriumBelongsToBranch(branchId: string, auditoriumId: string) {
        const auditorium = await this.prisma.auditorium.findUnique({
            where: { id: auditoriumId },
            select: { branchId: true },
        });

        if (!auditorium) {
            throw new NotFoundException('Auditorium not found');
        }

        if (auditorium.branchId !== branchId) {
            throw new BadRequestException('Auditorium does not belong to selected branch.');
        }
    }

    /** Kiem tra trung lich trong cung phong, bao gom ca khoang cach toi thieu truoc/sau suat chieu. */
    private async hasTimeConflict(auditoriumId: string, startsAt: Date, endsAt: Date, bufferMinutes = this.defaultBufferMinutes, excludeId?: string) {
        const minGapMinutes = this.normalizeBuffer(bufferMinutes);
        const conflictStart = this.addMinutes(startsAt, -minGapMinutes);
        const conflictEnd = this.addMinutes(endsAt, minGapMinutes);

        const conflict = await this.prisma.showtime.findFirst({
            where: {
                auditoriumId,
                id: excludeId ? { not: excludeId } : undefined,
                status: { not: ShowtimeStatus.CANCELLED },
                startsAt: { lt: conflictEnd },
                endsAt: { gt: conflictStart },
            },
            select: { id: true },
        });

        return Boolean(conflict);
    }

    /** Chuan hoa buffer, luon dam bao toi thieu 15 phut giua hai suat chieu. */
    private normalizeBuffer(bufferMinutes?: number) {
        return Math.max(bufferMinutes ?? this.defaultBufferMinutes, this.defaultBufferMinutes);
    }

    /** Khong cho tao hoac doi suat chieu ve thoi diem da qua. */
    private ensureFutureStart(startsAt: Date) {
        if (startsAt <= new Date()) {
            throw new BadRequestException('Cannot create or move a showtime to a past time.');
        }
    }

    /** Build du lieu suat chieu hop le cho create/update: tinh endsAt, validate phong, gio, buffer va trung lich. */
    private async buildShowtimeData(data: CreateShowtimeDto | UpdateShowtimeDto, currentId?: string) {
        if (!data.branchId || !data.auditoriumId || !data.movieId || !data.startsAt) {
            throw new BadRequestException('branchId, auditoriumId, movieId and startsAt are required.');
        }

        await this.ensureAuditoriumBelongsToBranch(data.branchId, data.auditoriumId);

        const movieDuration = await this.getMovieDuration(data.movieId);
        const bufferMinutes = this.normalizeBuffer(data.bufferMinutes);
        const startsAt = this.parseDateTime(data.startsAt);
        this.ensureFiveMinuteBoundary(startsAt);
        this.ensureFutureStart(startsAt);
        const endsAt = this.addMinutes(startsAt, movieDuration);

        if (await this.hasTimeConflict(data.auditoriumId, startsAt, endsAt, bufferMinutes, currentId)) {
            throw new BadRequestException('Showtime overlaps or is less than 15 minutes from another showtime in this auditorium.');
        }

        return {
            branchId: data.branchId,
            auditoriumId: data.auditoriumId,
            movieId: data.movieId,
            startsAt,
            endsAt,
            status: data.status ?? ShowtimeStatus.SCHEDULED,
            basePrice: data.basePrice ?? 0,
            note: data.note,
        };
    }

    /** Lay danh sach suat chieu theo rap/ngay/khoang ngay va include thong tin rap, phong, phim. */
    async getAll(filters?: { branchId?: string; date?: string; dateFrom?: string; dateTo?: string }) {
        await this.markFinishedShowtimes();

        const where: Prisma.ShowtimeWhereInput = {};

        if (filters?.branchId) {
            where.branchId = filters.branchId;
        }

        if (filters?.dateFrom && filters?.dateTo) {
            const start = new Date(`${filters.dateFrom}T00:00:00.000Z`);
            const end = new Date(`${filters.dateTo}T23:59:59.999Z`);
            where.startsAt = {
                gte: start,
                lte: end,
            };
        } else if (filters?.date) {
            const start = new Date(`${filters.date}T00:00:00.000Z`);
            const end = new Date(`${filters.date}T23:59:59.999Z`);
            where.startsAt = {
                gte: start,
                lte: end,
            };
        }

        return this.prisma.showtime.findMany({
            where,
            include: {
                branch: true,
                auditorium: true,
                movie: true,
            },
            orderBy: {
                startsAt: 'asc',
            },
        });
    }

    /** Tao mot suat chieu nhap tay sau khi validate toan bo rule nghiep vu. */
    async create(data: CreateShowtimeDto) {
        const showtimeData = await this.buildShowtimeData(data);
        return this.prisma.showtime.create({ data: showtimeData });
    }

    /** Sinh danh sach slot de xuat theo ngay, gio hoat dong, thoi luong phim va buffer. */
    private async buildGeneratedSlots(data: GenerateShowtimesDto) {
        await this.ensureAuditoriumBelongsToBranch(data.branchId, data.auditoriumId);

        const movieDuration = await this.getMovieDuration(data.movieId);
        const bufferMinutes = this.normalizeBuffer(data.bufferMinutes);
        const slotMinutes = movieDuration + bufferMinutes;
        const slots: { startsAt: Date; endsAt: Date; selectable: boolean; reason?: string }[] = [];

        for (const dateValue of this.getDateRange(data.dateFrom, data.dateTo)) {
            let cursor = this.roundUpToFiveMinuteBoundary(this.parseDayTime(dateValue, data.operatingStartTime));
            const operatingEnd = this.parseDayTime(dateValue, data.operatingEndTime);

            while (this.addMinutes(cursor, movieDuration) <= operatingEnd) {
                const startsAt = new Date(cursor);
                const endsAt = this.addMinutes(startsAt, movieDuration);

                if (startsAt <= new Date()) {
                    slots.push({ startsAt, endsAt, selectable: false, reason: 'PAST' });
                } else if (await this.hasTimeConflict(data.auditoriumId, startsAt, endsAt, bufferMinutes)) {
                    slots.push({ startsAt, endsAt, selectable: false, reason: 'CONFLICT' });
                } else {
                    slots.push({ startsAt, endsAt, selectable: true });
                }

                cursor = this.roundUpToFiveMinuteBoundary(this.addMinutes(cursor, slotMinutes));
            }
        }

        return slots;
    }

    /** Tra ve danh sach slot de admin xem truoc va tick chon truoc khi tao that. */
    async preview(data: GenerateShowtimesDto) {
        const slots = await this.buildGeneratedSlots(data);
        return {
            slots,
            selectableCount: slots.filter((slot) => slot.selectable).length,
            blockedCount: slots.filter((slot) => !slot.selectable).length,
        };
    }

    /** Tao hang loat suat chieu tu cac slot da chon, re-check conflict truoc khi ghi database. */
    async generate(data: GenerateShowtimesDto) {
        const slots = await this.buildGeneratedSlots(data);
        const selected = new Set(data.selectedStartsAt || slots.filter((slot) => slot.selectable).map((slot) => slot.startsAt.toISOString()));
        const created: Showtime[] = [];
        const skipped: { startsAt: Date; endsAt: Date; reason: string }[] = [];

        for (const slot of slots) {
            if (!selected.has(slot.startsAt.toISOString())) continue;

            if (!slot.selectable) {
                skipped.push({ startsAt: slot.startsAt, endsAt: slot.endsAt, reason: slot.reason || 'BLOCKED' });
                continue;
            }

            if (slot.startsAt <= new Date()) {
                skipped.push({ startsAt: slot.startsAt, endsAt: slot.endsAt, reason: 'PAST' });
                continue;
            }

            if (await this.hasTimeConflict(data.auditoriumId, slot.startsAt, slot.endsAt, this.normalizeBuffer(data.bufferMinutes))) {
                skipped.push({ startsAt: slot.startsAt, endsAt: slot.endsAt, reason: 'CONFLICT' });
                continue;
            }

            const showtime = await this.prisma.showtime.create({
                data: {
                    branchId: data.branchId,
                    auditoriumId: data.auditoriumId,
                    movieId: data.movieId,
                    startsAt: slot.startsAt,
                    endsAt: slot.endsAt,
                    status: data.status ?? ShowtimeStatus.SCHEDULED,
                    basePrice: data.basePrice ?? 0,
                    note: data.note,
                },
            });
            created.push(showtime);
        }

        return {
            createdCount: created.length,
            skippedCount: skipped.length,
            created,
            skipped,
        };
    }

    /** Cap nhat suat chieu; neu da chieu xong thi chi cho sua ghi chu. */
    async update(id: string, data: UpdateShowtimeDto) {
        await this.markFinishedShowtimes();

        const showtime = await this.prisma.showtime.findUnique({ where: { id } });

        if (!showtime) {
            throw new NotFoundException('Showtime not found');
        }

        const isFinished = showtime.status === ShowtimeStatus.FINISHED || showtime.endsAt < new Date();

        if (isFinished) {
            const changedFields = Object.entries(data).filter(([, value]) => value !== undefined);
            const hasOnlyNote = changedFields.every(([key]) => key === 'note');

            if (!hasOnlyNote) {
                throw new BadRequestException('Showtime has finished. Only note can be updated.');
            }

            return this.prisma.showtime.update({
                where: { id },
                data: {
                    note: data.note,
                    status: ShowtimeStatus.FINISHED,
                },
            });
        }

        const nextData = await this.buildShowtimeData({
            ...data,
            branchId: data.branchId ?? showtime.branchId,
            auditoriumId: data.auditoriumId ?? showtime.auditoriumId,
            movieId: data.movieId ?? showtime.movieId,
            startsAt: data.startsAt ?? showtime.startsAt,
            basePrice: data.basePrice ?? Number(showtime.basePrice),
            status: data.status ?? showtime.status,
            note: data.note ?? showtime.note ?? undefined,
        }, id);

        return this.prisma.showtime.update({ where: { id }, data: nextData });
    }

    /** Xoa mot suat chieu theo id. */
    async delete(id: string) {
        return this.prisma.showtime.delete({ where: { id } });
    }
}
