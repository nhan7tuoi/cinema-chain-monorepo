import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, IsInt } from "class-validator";
import { ShowtimeStatus } from ".prisma/generated";

export class CreateShowtimeDto {
    @IsNotEmpty()
    branchId: number;
    @IsNotEmpty()
    auditoriumId: number;
    @IsNotEmpty()
    movieId: number;
    @IsNotEmpty()
    startsAt: Date;
    @IsOptional()
    endsAt: Date;
    @IsOptional()
    @IsNumber()
    @Min(15)
    bufferMinutes?: number;
    @IsOptional()
    status: ShowtimeStatus;
    @IsOptional()
    basePrice: number;
    @IsOptional()
    note: string;
}

export class GenerateShowtimesDto {
    @IsNotEmpty()
    branchId: number;

    @IsNotEmpty()
    auditoriumId: number;

    @IsNotEmpty()
    movieId: number;

    @IsNotEmpty()
    dateFrom: string;

    @IsNotEmpty()
    dateTo: string;

    @IsNotEmpty()
    operatingStartTime: string;

    @IsNotEmpty()
    operatingEndTime: string;

    @IsOptional()
    @IsNumber()
    @Min(15)
    bufferMinutes?: number;

    @IsOptional()
    @IsArray()
    selectedStartsAt?: string[];

    @IsOptional()
    status?: ShowtimeStatus;

    @IsOptional()
    basePrice?: number;

    @IsOptional()
    note?: string;
}

export class UpdateShowtimeDto {
    @IsInt()
    @IsOptional()
    branchId: number;
    @IsInt()
    @IsOptional()
    auditoriumId: number;
    @IsInt()
    @IsOptional()
    movieId: number;
    @IsOptional()
    startsAt: Date;
    @IsOptional()
    endsAt: Date;
    @IsOptional()
    @IsNumber()
    @Min(15)
    bufferMinutes?: number;
    @IsOptional()
    status: ShowtimeStatus;
    @IsOptional()
    basePrice: number;
    @IsOptional()
    note: string;
}
