import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma.module';
import { RedisModule } from './modules/redis/redis.module';
import { RolesModule } from './modules/roles/roles.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { CustomersModule } from './modules/customers/customers.module';
import { BranchesModule } from './modules/branches/branches.module';
import { UploadModule } from './modules/upload/upload.module';
import { MoviesModule } from './modules/movies/movies.module';
import { BullModule } from '@nestjs/bullmq';
import { AuditoriumModule } from './modules/auditorium/auditorium.module';
import { ShowtimeModule } from './modules/showtime/showtime.module';
import { SeatModule } from './modules/seat/seat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get('REDIS_HOST') || '127.0.0.1',
          port: configService.get('REDIS_PORT') || 6379,
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    RolesModule,
    EmployeesModule,
    CustomersModule,
    BranchesModule,
    UploadModule,
    MoviesModule,
    AuditoriumModule,
    SeatModule,
    ShowtimeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
