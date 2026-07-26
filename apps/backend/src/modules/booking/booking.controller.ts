import { Controller, Post, Get, Body, Param, Req, UseGuards } from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking.dto';
import { BookingGateway } from './booking.gateway';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(
    private readonly bookingService: BookingService,
    private readonly bookingGateway: BookingGateway,
  ) {}

  @Post()
  async createBooking(@Body() dto: CreateBookingDto, @Req() req: any) {
    const userId = req.user?.userId;
    return this.bookingService.createBooking(dto, userId);
  }

  @Post(':orderCode/simulate-payment')
  async simulatePayment(@Param('orderCode') orderCode: string) {
    const booking = await this.bookingService.processPaymentSuccess(orderCode);
    
    // Emit payment_success to the specific order room
    this.bookingGateway.server.to(`order_${orderCode}`).emit('payment_success', { orderCode });
    
    // Emit seat_sold to the showtime room to lock seats for other users
    const seatIds = booking.tickets.map(t => t.seatId);
    this.bookingGateway.server.to(booking.showtimeId.toString()).emit('seat_sold', { seatIds });

    return { success: true, booking };
  }

  @Get('my-tickets')
  async getMyTickets(@Req() req: any) {
    const userId = req.user?.userId;
    return this.bookingService.getMyTickets(userId);
  }

  @Get('combos')
  async getCombos() {
    return this.bookingService.getCombos();
  }
}
