import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BranchesService } from './branches.service';

@ApiTags('Client - Branches')
@Controller('client/branches')
export class BranchesClientController {
  constructor(private readonly branchesService: BranchesService) {}

  @ApiOperation({ summary: 'Lay danh sach rap dang hoat dong cho Web/App' })
  @ApiResponse({ status: 200, description: 'Danh sach rap dang hoat dong' })
  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.branchesService.findAllClient(Number(limit) || 4);
  }
}
