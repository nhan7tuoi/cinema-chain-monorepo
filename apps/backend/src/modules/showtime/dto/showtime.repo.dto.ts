import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ShowtimeStatus } from ".prisma/generated";

export class CreateShowtimeDto {
    @IsNotEmpty()
    branchId: string;
    @IsNotEmpty()
    auditoriumId: string;
    @IsNotEmpty()
    movieId: string;
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
    branchId: string;

    @IsNotEmpty()
    auditoriumId: string;

    @IsNotEmpty()
    movieId: string;

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
    @IsString()
    @IsOptional()
    branchId: string;
    @IsString()
    @IsOptional()
    auditoriumId: string;
    @IsString()
    @IsOptional()
    movieId: string;
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
