import { IsString, IsArray, IsOptional, ValidateNested, IsNumber, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class ComboQuantityDto {
  @IsInt()
  comboId: number;

  @IsNumber()
  quantity: number;
}

export class CreateBookingDto {
  @IsInt()
  showtimeId: number;

  @IsArray()
  @IsInt({ each: true })
  seatIds: number[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ComboQuantityDto)
  combos?: ComboQuantityDto[];
}
