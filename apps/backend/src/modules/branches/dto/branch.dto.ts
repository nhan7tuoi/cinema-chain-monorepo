import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export class CreateBranchDto {
  @ApiProperty({ example: 'Chi nhánh 1', description: 'Tên chi nhánh' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Đường ABC, Quận X, TP Y', description: 'Địa chỉ chi nhánh' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: '0123456789', description: 'Số điện thoại liên hệ', required: false })
  @IsString()
  @IsOptional()
  phone?: string;
}

export class UpdateBranchDto extends PartialType(CreateBranchDto) {}
