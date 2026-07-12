import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsDate, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiPropertyOptional({ example: 'spider-man-no-way-home' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ example: 'Spider-Man: No Way Home' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Spider-Man: No Way Home' })
  @IsString()
  @IsOptional()
  originalTitle?: string;

  @ApiPropertyOptional({ example: 'Jon Watts' })
  @IsString()
  @IsOptional()
  director?: string;

  @ApiPropertyOptional({ example: 'Tom Holland, Zendaya' })
  @IsString()
  @IsOptional()
  cast?: string;

  @ApiPropertyOptional({ example: 'Action, Sci-Fi' })
  @IsString()
  @IsOptional()
  genre?: string;

  @ApiProperty({ example: 148, description: 'Duration in minutes' })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: '2021-12-17' })
  @Type(() => Date)
  @IsDate()
  releaseDate: Date;

  @ApiPropertyOptional({ example: '2022-02-17' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({ example: '2D', default: '2D' })
  @IsString()
  @IsOptional()
  format?: string;

  @ApiPropertyOptional({ example: 'Peter Parker is unmasked...' })
  @IsString()
  @IsOptional()
  synopsis?: string;

  @ApiPropertyOptional({ example: 'https://example.com/poster.jpg' })
  @IsUrl()
  @IsOptional()
  posterUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/backdrop.jpg' })
  @IsUrl()
  @IsOptional()
  backdropUrl?: string;

  @ApiPropertyOptional({ example: 'https://example.com/trailer.mp4' })
  @IsUrl()
  @IsOptional()
  trailerUrl?: string;

  @ApiPropertyOptional({ example: 'T13' })
  @IsString()
  @IsOptional()
  ageRating?: string;

  @ApiPropertyOptional({ example: 'English' })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiPropertyOptional({ example: 'Vietnamese subtitles' })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiPropertyOptional({ example: 'USA' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 8.7 })
  @IsNumber()
  @IsOptional()
  averageRating?: number;

  @ApiPropertyOptional({ example: 1250 })
  @IsInt()
  @Min(0)
  @IsOptional()
  ratingCount?: number;

  @ApiPropertyOptional({ example: 54000 })
  @IsInt()
  @Min(0)
  @IsOptional()
  viewCount?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @Min(0)
  @IsOptional()
  featuredOrder?: number;
}
