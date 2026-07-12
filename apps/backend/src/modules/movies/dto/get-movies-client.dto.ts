import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsEnum, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MovieStatus } from '.prisma/generated';

export class GetMoviesClientDto {
  @ApiPropertyOptional({ description: 'Trang hiện tại', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng phim mỗi trang', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Trạng thái phim (ví dụ: NOW_SHOWING, COMING_SOON)', enum: MovieStatus })
  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;

  @ApiPropertyOptional({ description: 'Chi lay phim hot/noi bat', example: true })
  @IsOptional()
  @IsBooleanString()
  isFeatured?: string;
}

export class GetHotMoviesClientDto {
  @ApiPropertyOptional({ description: 'So luong phim hot can lay', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}
