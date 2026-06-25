import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { SeatService } from "./seat.service";
import { CreateSeatDto, SaveSeatLayoutDto, UpdateSeatDto } from "./dto/seat.repo.dto";

@Controller("admin")
@UseGuards(JwtAuthGuard)
export class SeatController {
    constructor(private readonly seatService: SeatService) {}

    @Get("auditoriums/:auditoriumId/seats")
    getByAuditorium(@Param("auditoriumId") auditoriumId: string) {
        return this.seatService.getByAuditorium(auditoriumId);
    }

    @Post("auditoriums/:auditoriumId/seats")
    create(@Param("auditoriumId") auditoriumId: string, @Body() dto: CreateSeatDto) {
        return this.seatService.create(auditoriumId, dto);
    }

    @Put("seats/:id")
    update(@Param("id") id: string, @Body() dto: UpdateSeatDto) {
        return this.seatService.update(id, dto);
    }

    @Delete("seats/:id")
    delete(@Param("id") id: string) {
        return this.seatService.delete(id);
    }

    @Put("auditoriums/:auditoriumId/seats/layout")
    saveLayout(@Param("auditoriumId") auditoriumId: string, @Body() dto: SaveSeatLayoutDto) {
        return this.seatService.saveLayout(auditoriumId, dto);
    }
}
