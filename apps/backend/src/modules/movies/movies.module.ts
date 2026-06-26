import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { MoviesClientController } from './movies-client.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [UploadModule],
  controllers: [MoviesController, MoviesClientController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
