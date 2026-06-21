import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export enum UploadType {
  AVATAR = 'avatar',
  POSTER = 'poster',
  TRAILER = 'trailer',
}

@Injectable()
export class UploadService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET') || '';
    
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') || 'ap-southeast-1',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') || '',
      },
    });
  }

  async generatePresignedPost(
    uploadType: UploadType,
    fileName: string,
    contentType: string,
  ) {
    try {
      const ext = path.extname(fileName);
      const uniqueFileName = `${uuidv4()}${ext}`;
      const objectKey = `${uploadType}s/${uniqueFileName}`;

      let maxSize = 0;
      let conditions: any[] = [];

      switch (uploadType) {
        case UploadType.AVATAR:
          maxSize = 2 * 1024 * 1024; // 2MB
          conditions.push(['starts-with', '$Content-Type', 'image/']);
          break;
        case UploadType.POSTER:
          maxSize = 5 * 1024 * 1024; // 5MB
          conditions.push(['starts-with', '$Content-Type', 'image/']);
          break;
        case UploadType.TRAILER:
          maxSize = 50 * 1024 * 1024; // 50MB
          conditions.push(['starts-with', '$Content-Type', 'video/']);
          break;
      }

      conditions.push(['content-length-range', 0, maxSize]);

      const presignedPost = await createPresignedPost(this.s3Client, {
        Bucket: this.bucketName,
        Key: objectKey,
        Conditions: conditions,
        Fields: {
          'Content-Type': contentType,
        },
        Expires: 3600, // URL expires in 1 hour
      });

      const baseUrl = presignedPost.url.endsWith('/') ? presignedPost.url.slice(0, -1) : presignedPost.url;

      return {
        url: presignedPost.url,
        fields: presignedPost.fields,
        fileUrl: `${baseUrl}/${objectKey}`,
      };
    } catch (error) {
      console.error('Error generating presigned POST URL:', error);
      throw new InternalServerErrorException('Could not generate upload URL');
    }
  }

  async deleteFile(fileUrl: string) {
    if (!fileUrl) return;
    try {
      // Ví dụ fileUrl: https://cinema-chain.s3.ap-southeast-1.amazonaws.com/avatars/123.png
      // Cần lấy ra key là: avatars/123.png
      const urlObject = new URL(fileUrl);
      const objectKey = urlObject.pathname.substring(1); // bỏ dấu / ở đầu

      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error(`Failed to delete old file from S3: ${fileUrl}`, error);
      // Không ném lỗi ra để tránh làm hỏng luồng update profile chính
    }
  }
}
