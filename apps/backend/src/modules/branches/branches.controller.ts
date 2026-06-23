import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto, UpdateBranchDto } from './dto/branch.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

@ApiTags('Branches')
@ApiBearerAuth()
@Controller('admin/branches')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @RequirePermissions('branch:write')
  @ApiOperation({ summary: 'Tạo chi nhánh mới' })
  create(@Body() createBranchDto: CreateBranchDto) {
    return this.branchesService.create(createBranchDto);
  }

  @Get()
  @RequirePermissions('branch:read')
  @ApiOperation({ summary: 'Lấy danh sách tất cả chi nhánh' })
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  @RequirePermissions('branch:read')
  @ApiOperation({ summary: 'Lấy chi tiết một chi nhánh' })
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @RequirePermissions('branch:write')
  @ApiOperation({ summary: 'Cập nhật thông tin chi nhánh' })
  update(@Param('id') id: string, @Body() updateBranchDto: UpdateBranchDto) {
    return this.branchesService.update(id, updateBranchDto);
  }

  @Patch(':id/toggle-status')
  @RequirePermissions('branch:write')
  @ApiOperation({ summary: 'Bật/Tắt trạng thái hoạt động của chi nhánh' })
  toggleStatus(@Param('id') id: string) {
    return this.branchesService.toggleStatus(id);
  }
}
