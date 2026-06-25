import { Controller, Get, Post, Put, Delete, Body, Param, Query } from "@nestjs/common";
import { ShowtimeService } from "./showtime.service";
import { CreateShowtimeDto, GenerateShowtimesDto, UpdateShowtimeDto } from "./dto/showtime.repo.dto";

@Controller('admin/showtimes')
export class ShowtimeController {
    constructor(private readonly showtimeService: ShowtimeService) { }

    @Get()
    async getAll(
        @Query('branchId') branchId?: string,
        @Query('date') date?: string,
        @Query('dateFrom') dateFrom?: string,
        @Query('dateTo') dateTo?: string,
    ) {
        return this.showtimeService.getAll({ branchId, date, dateFrom, dateTo });
    }
    @Post()
    async create(@Body() data: CreateShowtimeDto) {
        return this.showtimeService.create(data);
    }
    @Post('generate')
    async generate(@Body() data: GenerateShowtimesDto) {
        return this.showtimeService.generate(data);
    }
    @Post('preview')
    async preview(@Body() data: GenerateShowtimesDto) {
        return this.showtimeService.preview(data);
    }
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: UpdateShowtimeDto) {
        return this.showtimeService.update(id, data);
    }
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.showtimeService.delete(id);
    }
}
