import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';

@ApiTags('Client - Promotions')
@Controller('client/promotions')
export class PromotionsClientController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @ApiOperation({ summary: 'Lay danh sach khuyen mai dang hoat dong cho Web/App' })
  @ApiResponse({ status: 200, description: 'Danh sach khuyen mai dang hoat dong' })
  @Get()
  findActive(@Query('limit') limit?: string) {
    return this.promotionsService.findActiveClient(Number(limit) || 3);
  }
}
