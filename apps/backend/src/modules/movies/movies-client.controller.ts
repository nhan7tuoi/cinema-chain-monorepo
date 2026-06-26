import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MoviesService } from './movies.service';
import { GetMoviesClientDto } from './dto/get-movies-client.dto';

@ApiTags('Client - Movies')
@Controller('client/movies')
export class MoviesClientController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOperation({ summary: 'Lấy danh sách tất cả các phim cho Web/App (có phân trang)' })
  @ApiResponse({ status: 200, description: 'Danh sách phim có phân trang' })
  @Get()
  findAll(@Query() query: GetMoviesClientDto) {
    return this.moviesService.findAllClient(query);
  }

  @ApiOperation({ summary: 'Lấy thông tin chi tiết một bộ phim' })
  @ApiResponse({ status: 200, description: 'Thông tin chi tiết phim' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }
}
