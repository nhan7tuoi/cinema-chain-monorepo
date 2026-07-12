import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { BranchesClientController } from './branches-client.controller';
import { PrismaModule } from '../../prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BranchesService],
  controllers: [BranchesController, BranchesClientController]
})
export class BranchesModule {}
