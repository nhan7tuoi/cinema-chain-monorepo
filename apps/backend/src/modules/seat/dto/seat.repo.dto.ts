import { SeatStatus, SeatType } from ".prisma/generated";
import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

export class SeatLayoutItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  rowLabel: string;

  @IsInt()
  @Min(1)
  number: number;

  @IsString()
  code: string;

  @IsInt()
  @Min(0)
  gridRow: number;

  @IsInt()
  @Min(1)
  gridCol: number;

  @IsEnum(SeatType)
  type: SeatType;

  @IsEnum(SeatStatus)
  status: SeatStatus;

  @IsOptional()
  @IsString()
  couplePairId?: string | null;
}

export class SaveSeatLayoutDto {
  @IsInt()
  @Min(1)
  @Max(26)
  layoutRows: number;

  @IsInt()
  @Min(1)
  @Max(30)
  layoutCols: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SeatLayoutItemDto)
  seats: SeatLayoutItemDto[];
}

export class CreateSeatDto extends SeatLayoutItemDto {}

export class UpdateSeatDto {
  @IsOptional()
  @IsString()
  rowLabel?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  number?: number;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  gridRow?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  gridCol?: number;

  @IsOptional()
  @IsEnum(SeatType)
  type?: SeatType;

  @IsOptional()
  @IsEnum(SeatStatus)
  status?: SeatStatus;

  @IsOptional()
  @IsString()
  couplePairId?: string | null;
}
