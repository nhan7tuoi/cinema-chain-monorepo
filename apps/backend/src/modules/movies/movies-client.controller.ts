import {ParseIntPipe,  Controller, Get, Param, Query, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GetHotMoviesClientDto, GetMoviesClientDto } from './dto/get-movies-client.dto';
import { MoviesService } from './movies.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

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

  @ApiOperation({ summary: 'Lấy danh sách đánh giá của phim' })
  @Get(':id/reviews')
  getReviews(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.moviesService.getReviews(
      id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 10,
    );
  }

  @ApiOperation({ summary: 'Viết đánh giá phim' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/reviews')
  createReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateReviewDto,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    return this.moviesService.createReview(id, userId, dto);
  }

  @ApiOperation({ summary: 'Lay thong tin chi tiet mot phim' })
  @ApiResponse({ status: 200, description: 'Thong tin chi tiet phim' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.moviesService.findOne(id);
  }
}
