import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingGateway } from './booking.gateway';
import { RedisModule } from '../redis/redis.module';
import { PrismaModule } from '../../prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { BookingController } from './booking.controller';

@Module({
  imports: [
    RedisModule, 
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'FALLBACK_KEY',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [BookingController],
  providers: [BookingService, BookingGateway],
  exports: [BookingService],
})
export class BookingModule {}
