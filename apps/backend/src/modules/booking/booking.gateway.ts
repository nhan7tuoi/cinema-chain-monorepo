import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BookingService } from './booking.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/booking',
})
export class BookingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly bookingService: BookingService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers['authorization']?.replace('Bearer ', '');
      if (!token) {
        throw new Error('No token provided');
      }
      const payload = this.jwtService.verify(token);
      client.data.userId = payload.sub; // Or payload.userId depending on JWT strategy
      
      // Since JwtStrategy returns { userId: payload.sub } but we are using jwtService directly, 
      // payload will be the raw JWT which contains 'sub' as the userId.
      console.log(`[Socket] Client connected: ${client.id} (User: ${client.data.userId})`);
    } catch (error) {
      console.log(`[Socket] Client rejected (Unauthorized): ${client.id}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`[Socket] Client disconnected: ${client.id}`);
    // In a real app, we might map client.id to userId to automatically release holds
  }

  @SubscribeMessage('join_showtime')
  async handleJoinShowtime(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: number },
  ) {
    const { showtimeId } = data;
    if (!showtimeId) return;

    client.join(showtimeId.toString());
    console.log(`[Socket] Client ${client.id} joined showtime ${showtimeId}`);

    // Send currently held seats in this showtime to the new client
    const heldSeats = await this.bookingService.getHeldSeats(showtimeId);
    client.emit('sync_held_seats', heldSeats);
  }

  @SubscribeMessage('leave_showtime')
  async handleLeaveShowtime(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: number },
  ) {
    const { showtimeId } = data;
    client.leave(showtimeId.toString());
  }

  @SubscribeMessage('hold_seat')
  async handleHoldSeat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: number; seatId: number },
  ) {
    try {
      const { showtimeId, seatId } = data;
      const userId = client.data.userId;
      if (!userId) return;

      const success = await this.bookingService.holdSeat(showtimeId, seatId, userId);
      
      if (success) {
        // Confirm to the requester
        client.emit('hold_success', { seatId, userId });
        
        // Broadcast to all clients in the showtime room
        this.server.to(showtimeId.toString()).emit('seat_held', { seatId, userId });
      } else {
        // Notify the client that it failed (e.g., already held)
        client.emit('hold_failed', { seatId, reason: 'ALREADY_HELD' });
      }
    } catch (error) {
      client.emit('hold_failed', { seatId: data.seatId, reason: 'ERROR' });
    }
  }

  @SubscribeMessage('release_seat')
  async handleReleaseSeat(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { showtimeId: number; seatId: number },
  ) {
    const { showtimeId, seatId } = data;
    const userId = client.data.userId;
    if (!userId) return;

    const released = await this.bookingService.releaseSeat(showtimeId, seatId, userId);
    
    if (released) {
      client.emit('release_success', { seatId });
      this.server.to(showtimeId.toString()).emit('seat_released', { seatId });
    }
  }

  @SubscribeMessage('join_order')
  async handleJoinOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderCode: string },
  ) {
    if (data.orderCode) {
      client.join(`order_${data.orderCode}`);
    }
  }

  @SubscribeMessage('leave_order')
  async handleLeaveOrder(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { orderCode: string },
  ) {
    if (data.orderCode) {
      client.leave(`order_${data.orderCode}`);
    }
  }
}
