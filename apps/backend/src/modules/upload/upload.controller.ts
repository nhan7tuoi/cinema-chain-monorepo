import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadService, UploadType } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GeneratePresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('presigned-url/avatar')
  @ApiOperation({ summary: 'Generate presigned URL for Avatar upload (Max 2MB)' })
  @ApiBody({ type: GeneratePresignedUrlDto })
  async getAvatarUploadUrl(@Body() body: GeneratePresignedUrlDto) {
    return this.uploadService.generatePresignedPost(
      UploadType.AVATAR,
      body.fileName,
      body.contentType,
    );
  }

  @Post('presigned-url/poster')
  @ApiOperation({ summary: 'Generate presigned URL for Movie Poster upload (Max 5MB)' })
  @ApiBody({ type: GeneratePresignedUrlDto })
  async getPosterUploadUrl(@Body() body: GeneratePresignedUrlDto) {
    return this.uploadService.generatePresignedPost(
      UploadType.POSTER,
      body.fileName,
      body.contentType,
    );
  }

  @Post('presigned-url/trailer')
  @ApiOperation({ summary: 'Generate presigned URL for Movie Trailer upload (Max 50MB)' })
  @ApiBody({ type: GeneratePresignedUrlDto })
  async getTrailerUploadUrl(@Body() body: GeneratePresignedUrlDto) {
    return this.uploadService.generatePresignedPost(
      UploadType.TRAILER,
      body.fileName,
      body.contentType,
    );
  }
}
