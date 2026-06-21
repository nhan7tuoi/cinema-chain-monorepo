import { IsString, IsInt, IsOptional, IsDate, Min, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({ example: 'Spider-Man: No Way Home' })
  @IsString()
  title: string;

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

  @ApiPropertyOptional({ example: 'https://example.com/trailer.mp4' })
  @IsUrl()
  @IsOptional()
  trailerUrl?: string;
}
