import {ParseIntPipe,  Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ShowtimeService } from './showtime.service';

@ApiTags('Client - Showtimes')
@Controller('client/showtimes')
export class ShowtimeClientController {
  constructor(private readonly showtimeService: ShowtimeService) {}

  @ApiOperation({ summary: 'Lay danh sach suat chieu theo phim va ngay cho App/Web' })
  @ApiResponse({ status: 200, description: 'Danh sach suat chieu gom nhom theo rap' })
  @Get('movie/:movieId')
  getShowtimesByMovie(
    @Param('movieId') movieId: number,
    @Query('date') date: string,
    @Query('latitude') latitude?: number,
    @Query('longitude') longitude?: number,
  ) {
    return this.showtimeService.getClientShowtimesByMovie(movieId, date, latitude, longitude);
  }

  @ApiOperation({ summary: 'Lay thong tin chi tiet suat chieu (bao gom phong, ghe)' })
  @ApiResponse({ status: 200, description: 'Chi tiet suat chieu' })
  @Get(':id')
  getShowtimeDetails(@Param('id', ParseIntPipe) id: number) {
    return this.showtimeService.getClientShowtimeDetails(id);
  }
}
