import { IsOptional, IsString, IsEnum, IsInt } from 'class-validator';
import { PageOptionsDto } from '../../../common/pagination/page-options.dto';
import { UserStatus } from '.prisma/generated';

export class EmployeePageOptionsDto extends PageOptionsDto {
  @IsEnum(UserStatus)
  @IsOptional()
  readonly status?: UserStatus;

  @IsInt()
  @IsOptional()
  readonly roleId?: number;
}
