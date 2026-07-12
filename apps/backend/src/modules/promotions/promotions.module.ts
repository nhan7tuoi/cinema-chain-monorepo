import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma.module';
import { PromotionsClientController } from './promotions-client.controller';
import { PromotionsService } from './promotions.service';

@Module({
  imports: [PrismaModule],
  controllers: [PromotionsClientController],
  providers: [PromotionsService],
})
export class PromotionsModule {}
