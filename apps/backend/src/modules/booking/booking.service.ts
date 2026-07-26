import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../../prisma.service';
import { CreateBookingDto } from './dto/booking.dto';
import { BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BookingService {
  private readonly HOLD_TTL = 300; // 5 minutes

  constructor(
    private readonly redisService: RedisService,
    private readonly prisma: PrismaService,
  ) {}

  private getHoldKey(showtimeId: number, seatId: number): string {
    return `cinema:hold:showtime:${showtimeId}:seat:${seatId}`;
  }

  async holdSeat(showtimeId: number, seatId: number, userId: number): Promise<boolean> {
    const key = this.getHoldKey(showtimeId, seatId);
    
    // 1. Check if it's already sold/pending in Database
    const soldTicket = await this.prisma.ticket.findFirst({
      where: {
        seatId: seatId,
        booking: {
          showtimeId: showtimeId,
          status: { in: ['PAID', 'PENDING'] }
        }
      }
    });

    if (soldTicket) {
      return false; // Already booked
    }

    // 2. Check if held in Redis
    const existingHold = await this.redisService.get(key);
    if (existingHold && Number(existingHold) !== userId) {
      return false; // Held by someone else
    }

    // 3. Set hold in Redis with TTL
    await this.redisService.set(key, String(userId), this.HOLD_TTL);
    return true;
  }

  async releaseSeat(showtimeId: number, seatId: number, userId: number): Promise<boolean> {
    const key = this.getHoldKey(showtimeId, seatId);
    const existingHold = await this.redisService.get(key);
    
    // Only the user who holds the seat can release it
    if (existingHold === String(userId)) {
      await this.redisService.del(key);
      return true;
    }
    return false;
  }

  async getHeldSeats(showtimeId: number): Promise<{seatId: number, userId: number}[]> {
    const pattern = `cinema:hold:showtime:${showtimeId}:seat:*`;
    const keys = await this.redisService.keys(pattern);
    
    const results: {seatId: number, userId: number}[] = [];
    for (const key of keys) {
      const parts = key.split(':');
      const seatId = parts[parts.length - 1];
      const userIdStr = await this.redisService.get(key);
      if (userIdStr) {
        results.push({ seatId: Number(seatId), userId: Number(userIdStr) });
      }
    }
    return results;
  }

  async createBooking(dto: CreateBookingDto, userId: number) {
    const { showtimeId, seatIds, combos } = dto;

    const customer = await this.prisma.customer.findUnique({
      where: { userId }
    });

    if (!customer) {
      throw new BadRequestException('Không tìm thấy thông tin khách hàng');
    }

    if (seatIds.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất 1 ghế');
    }

    // Check if seats are already booked in DB
    const soldTickets = await this.prisma.ticket.findMany({
      where: {
        seatId: { in: seatIds },
        booking: {
          showtimeId: showtimeId,
          status: { in: ['PAID', 'PENDING'] }
        }
      }
    });

    if (soldTickets.length > 0) {
      throw new BadRequestException('Một hoặc nhiều ghế đã được đặt');
    }

    // Get seat prices
    const seats = await this.prisma.seat.findMany({
      where: { id: { in: seatIds } }
    });

    if (seats.length !== seatIds.length) {
      throw new BadRequestException('Ghế không hợp lệ');
    }

    let totalAmount = 0;
    const ticketData = seats.map(seat => {
      // Logic from frontend: vip 120k, couple 250k, standard 90k
      let price = 90000;
      if (seat.type === 'VIP') price = 120000;
      if (seat.type === 'COUPLE') price = 250000;
      totalAmount += price;
      
      return {
        seatId: seat.id,
        price
      };
    });

    const comboData: { comboId: number; quantity: number; price: number }[] = [];
    if (combos && combos.length > 0) {
      const comboIds = combos.map(c => c.comboId);
      const dbCombos = await this.prisma.combo.findMany({
        where: { id: { in: comboIds } }
      });

      for (const reqCombo of combos) {
        const dbCombo = dbCombos.find(c => c.id === reqCombo.comboId);
        if (dbCombo) {
          const comboPrice = Number(dbCombo.price);
          totalAmount += (comboPrice * reqCombo.quantity);
          comboData.push({
            comboId: dbCombo.id,
            quantity: reqCombo.quantity,
            price: comboPrice
          });
        }
      }
    }

    const orderCode = 'BK' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

    // Default to PENDING. Simulation will move it to PAID.
    const booking = await this.prisma.booking.create({
      data: {
        code: orderCode,
        showtimeId,
        customerId: customer.id,
        totalAmount,
        status: 'PENDING',
        tickets: {
          create: ticketData
        },
        bookingCombos: {
          create: comboData
        }
      },
      include: {
        tickets: true,
      }
    });

    return booking;
  }

  async processPaymentSuccess(orderCode: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { code: orderCode },
      include: { tickets: true }
    });

    if (!booking) {
      throw new BadRequestException('Đơn hàng không tồn tại');
    }

    if (booking.status === 'PAID') {
      return booking;
    }

    const updated = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: 'PAID',
        paymentMethod: 'VIETQR',
        paymentStatus: 'SUCCESS'
      },
      include: {
        tickets: true
      }
    });

    for (const ticket of updated.tickets) {
      const key = this.getHoldKey(updated.showtimeId, ticket.seatId);
      await this.redisService.del(key);
    }

    return updated;
  }

  async getMyTickets(userId: number) {
    const bookings = await this.prisma.booking.findMany({
      where: {
        customer: {
          userId: userId
        },
        status: { in: ['PAID', 'PENDING'] }
      },
      include: {
        showtime: {
          include: {
            movie: true,
            branch: true,
            auditorium: true,
          }
        },
        tickets: {
          include: {
            seat: true
          }
        },
        bookingCombos: {
          include: {
            combo: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    });

    return bookings;
  }

  async getCombos() {
    return this.prisma.combo.findMany({
      where: { isActive: true },
    });
  }
}
