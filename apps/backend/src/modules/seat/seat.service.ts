import { PrismaService } from "@/prisma.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SeatStatus, SeatType } from ".prisma/generated";
import { CreateSeatDto, SaveSeatLayoutDto, SeatLayoutItemDto, UpdateSeatDto } from "./dto/seat.repo.dto";


@Injectable()
export class SeatService {
  constructor(private readonly prisma: PrismaService) {}

  async getByAuditorium(auditoriumId: string) {
    await this.ensureAuditoriumExists(auditoriumId);

    return this.prisma.seat.findMany({
      where: { auditoriumId },
      orderBy: [{ gridRow: "asc" }, { gridCol: "asc" }],
    });
  }

  async create(auditoriumId: string, dto: CreateSeatDto) {
    const auditorium = await this.ensureAuditoriumExists(auditoriumId);
    const layoutRows = Math.max(auditorium.layoutRows, dto.gridRow + 1);
    const layoutCols = Math.max(auditorium.layoutCols, dto.gridCol);
    this.validateSeatBounds(dto, layoutRows, layoutCols);

    const seat = await this.prisma.seat.create({
      data: {
        auditoriumId,
        rowLabel: dto.rowLabel,
        number: dto.number,
        code: dto.code,
        gridRow: dto.gridRow,
        gridCol: dto.gridCol,
        type: dto.type,
        status: dto.status,
        couplePairId: dto.couplePairId || null,
      },
    });

    await this.syncAuditoriumCapacity(auditoriumId);
    return seat;
  }

  async update(id: string, dto: UpdateSeatDto) {
    const current = await this.prisma.seat.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException("Seat not found");
    }

    const seat = await this.prisma.seat.update({
      where: { id },
      data: {
        rowLabel: dto.rowLabel,
        number: dto.number,
        code: dto.code,
        gridRow: dto.gridRow,
        gridCol: dto.gridCol,
        type: dto.type,
        status: dto.status,
        couplePairId: dto.couplePairId,
      },
    });

    await this.syncAuditoriumCapacity(current.auditoriumId);
    return seat;
  }

  async delete(id: string) {
    const current = await this.prisma.seat.findUnique({ where: { id } });
    if (!current) {
      throw new NotFoundException("Seat not found");
    }

    const seat = await this.prisma.seat.delete({ where: { id } });
    await this.syncAuditoriumCapacity(current.auditoriumId);
    return seat;
  }

  async saveLayout(auditoriumId: string, dto: SaveSeatLayoutDto) {
    this.validateLayout(dto);

    return this.prisma.$transaction(async (tx) => {
      const auditorium = await tx.auditorium.findUnique({
        where: { id: auditoriumId },
        select: { id: true },
      });

      if (!auditorium) {
        throw new NotFoundException("Auditorium not found");
      }

      await tx.seat.deleteMany({ where: { auditoriumId } });

      if (dto.seats.length > 0) {
        await tx.seat.createMany({
          data: dto.seats.map((seat) => ({
            auditoriumId,
            rowLabel: seat.rowLabel.trim(),
            number: seat.number,
            code: seat.code.trim(),
            gridRow: seat.gridRow,
            gridCol: seat.gridCol,
            type: seat.type,
            status: seat.status,
            couplePairId: seat.couplePairId || null,
          })),
        });
      }

      await tx.auditorium.update({
        where: { id: auditoriumId },
        data: {
          layoutRows: dto.layoutRows,
          layoutCols: dto.layoutCols,
          capacity: dto.seats.filter((seat) => seat.status === SeatStatus.ACTIVE).length,
        },
      });

      return tx.auditorium.findUnique({
        where: { id: auditoriumId },
        include: {
          branch: true,
          seats: {
            orderBy: [{ gridRow: "asc" }, { gridCol: "asc" }],
          },
        },
      });
    });
  }

  validateLayout(dto: SaveSeatLayoutDto) {
    const codeSet = new Set<string>();
    const gridSet = new Set<string>();
    const pairMap = new Map<string, SeatLayoutItemDto[]>();

    for (const seat of dto.seats) {
      this.validateSeatBounds(seat, dto.layoutRows, dto.layoutCols);

      const normalizedCode = seat.code.trim().toUpperCase();
      if (!normalizedCode) {
        throw new BadRequestException("Seat code is required");
      }

      if (codeSet.has(normalizedCode)) {
        throw new BadRequestException(`Duplicate seat code: ${seat.code}`);
      }
      codeSet.add(normalizedCode);

      const gridKey = `${seat.gridRow}:${seat.gridCol}`;
      if (gridSet.has(gridKey)) {
        throw new BadRequestException(`Duplicate seat position: row ${seat.gridRow}, col ${seat.gridCol}`);
      }
      gridSet.add(gridKey);

      if (seat.type === SeatType.COUPLE && !seat.couplePairId) {
        throw new BadRequestException(`Couple seat ${seat.code} must belong to a pair`);
      }

      if (seat.type !== SeatType.COUPLE && seat.couplePairId) {
        throw new BadRequestException(`Seat ${seat.code} has a couple pair but is not a couple seat`);
      }

      if (seat.type === SeatType.COUPLE && seat.couplePairId) {
        const pair = pairMap.get(seat.couplePairId) || [];
        pair.push(seat);
        pairMap.set(seat.couplePairId, pair);
      }
    }

    for (const [pairId, pair] of pairMap.entries()) {
      if (pair.length !== 2) {
        throw new BadRequestException(`Couple pair ${pairId} must contain exactly 2 seats`);
      }

      const [left, right] = pair;
      const sameRow = left.gridRow === right.gridRow;
      const nextToEachOther = Math.abs(left.gridCol - right.gridCol) === 1;
      if (!sameRow || !nextToEachOther) {
        throw new BadRequestException(`Couple pair ${pairId} must be adjacent seats in the same row`);
      }
    }
  }

  async syncAuditoriumCapacity(auditoriumId: string) {
    const activeSeatCount = await this.prisma.seat.count({
      where: { auditoriumId, status: SeatStatus.ACTIVE },
    });

    return this.prisma.auditorium.update({
      where: { id: auditoriumId },
      data: { capacity: activeSeatCount },
    });
  }

  private validateSeatBounds(seat: SeatLayoutItemDto, layoutRows: number, layoutCols: number) {
    if (seat.gridRow < 0 || seat.gridRow >= layoutRows) {
      throw new BadRequestException(`Seat ${seat.code} row is outside layout bounds`);
    }

    if (seat.gridCol < 1 || seat.gridCol > layoutCols) {
      throw new BadRequestException(`Seat ${seat.code} column is outside layout bounds`);
    }
  }

  private async ensureAuditoriumExists(auditoriumId: string) {
    const auditorium = await this.prisma.auditorium.findUnique({
      where: { id: auditoriumId },
      select: { id: true, layoutRows: true, layoutCols: true },
    });

    if (!auditorium) {
      throw new NotFoundException("Auditorium not found");
    }

    return auditorium;
  }
}
