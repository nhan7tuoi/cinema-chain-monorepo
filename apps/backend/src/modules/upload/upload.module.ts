import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { BullModule } from '@nestjs/bullmq';
import { UploadProcessor } from './upload.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'upload',
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService, UploadProcessor],
  exports: [UploadService, BullModule],
})
export class UploadModule {}
