import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import type { Prisma } from '.prisma/generated';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateBranchDto {
  @ApiPropertyOptional({ example: 'cinepremium-hung-vuong' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'CinePremium Hung Vuong', description: 'Branch name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Hung Vuong, District 5, Ho Chi Minh City', description: 'Branch address' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ example: 'Ho Chi Minh City' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'District 5' })
  @IsString()
  @IsOptional()
  district?: string;

  @ApiPropertyOptional({ example: 10.754792 })
  @IsNumber()
  @IsOptional()
  latitude?: number;

  @ApiPropertyOptional({ example: 106.663858 })
  @IsNumber()
  @IsOptional()
  longitude?: number;

  @ApiPropertyOptional({ example: '0281234567', description: 'Contact phone' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'https://example.com/cinema.jpg' })
  @IsUrl()
  @IsOptional()
  coverUrl?: string;

  @ApiPropertyOptional({ example: 'https://maps.google.com/?q=10.754792,106.663858' })
  @IsUrl()
  @IsOptional()
  mapUrl?: string;

  @ApiPropertyOptional({ example: { weekdays: '09:00-23:00', weekend: '08:00-24:00' } })
  @IsObject()
  @IsOptional()
  openingHours?: Prisma.InputJsonValue;

  @ApiPropertyOptional({ example: { parking: true, imax: true, vip: true } })
  @IsObject()
  @IsOptional()
  amenities?: Prisma.InputJsonValue;
}

export class UpdateBranchDto extends PartialType(CreateBranchDto) {}
