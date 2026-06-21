import { Controller, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  fullName?: string;
  
  @ApiProperty({ required: false })
  avatarUrl?: string;
}

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile (fullName, avatar)' })
  async updateProfile(
    @CurrentUser('userId') userId: string,
    @Body() body: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, body);
  }
}
