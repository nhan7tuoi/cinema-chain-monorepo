import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PageOptionsDto } from '../../../common/pagination/page-options.dto';
import { UserStatus } from '.prisma/generated';

export class EmployeePageOptionsDto extends PageOptionsDto {
  @IsEnum(UserStatus)
  @IsOptional()
  readonly status?: UserStatus;

  @IsString()
  @IsOptional()
  readonly roleId?: string;
}
