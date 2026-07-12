import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetHotMoviesClientDto, GetMoviesClientDto } from './dto/get-movies-client.dto';
import { MoviesService } from './movies.service';

@ApiTags('Client - Movies')
@Controller('client/movies')
export class MoviesClientController {
  constructor(private readonly moviesService: MoviesService) { }

  @ApiOperation({ summary: 'Lay danh sach phim cho Web/App' })
  @ApiResponse({ status: 200, description: 'Danh sach phim co phan trang' })
  @Get()
  findAll(@Query() query: GetMoviesClientDto) {
    return this.moviesService.findAllClient(query);
  }

  @ApiOperation({ summary: 'Lay danh sach phim hot/noi bat cho trang chu' })
  @ApiResponse({ status: 200, description: 'Danh sach phim hot' })
  @Get('trending')
  findHot(@Query() query: GetHotMoviesClientDto) {
    return this.moviesService.findHotClient(query.limit);
  }

  @ApiOperation({ summary: 'Lay thong tin chi tiet mot phim' })
  @ApiResponse({ status: 200, description: 'Thong tin chi tiet phim' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }
}
