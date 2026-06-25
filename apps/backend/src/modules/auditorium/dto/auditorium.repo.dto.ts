import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateAuditoriumDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    format: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    capacity?: number;

    @IsNotEmpty()
    @IsString()
    branchId: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(26)
    layoutRows?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(30)
    layoutCols?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class UpdateAuditoriumDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    format?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    capacity?: number;

    @IsOptional()
    @IsString()
    branchId?: string;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(26)
    layoutRows?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Max(30)
    layoutCols?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}
