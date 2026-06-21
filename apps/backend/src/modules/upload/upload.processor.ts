import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { UploadService } from './upload.service';

@Processor('upload')
export class UploadProcessor extends WorkerHost {
  private readonly logger = new Logger(UploadProcessor.name);

  constructor(private readonly uploadService: UploadService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing job ${job.id} of type ${job.name}`);
    if (job.name === 'deleteFile') {
      const { url } = job.data;
      if (url) {
        await this.uploadService.deleteFile(url);
        this.logger.log(`Successfully deleted old S3 file via BullMQ: ${url}`);
      }
    }
  }
}
