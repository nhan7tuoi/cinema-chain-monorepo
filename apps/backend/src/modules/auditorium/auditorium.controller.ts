import { Controller, Delete, Get, Param, Post, Put, Body, Query } from "@nestjs/common";
import { AuditoriumService } from "./auditorium.service";
import { CreateAuditoriumDto, UpdateAuditoriumDto } from "./dto/auditorium.repo.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";

@Controller('admin/auditoriums')
@UseGuards(JwtAuthGuard)
export class AuditoriumController {
    constructor(private readonly auditoriumService: AuditoriumService) { }
    @Get()
    async getAll(@Query('branchId') branchId?: string) {
        return this.auditoriumService.getAll(branchId);
    }
    @Get(':id')
    async getById(@Param('id') id: string) {
        return this.auditoriumService.getById(id);
    }
    @Post()
    async create(@Body() data: CreateAuditoriumDto) {
        return this.auditoriumService.create(data);
    }
    @Put(':id')
    async update(@Param('id') id: string, @Body() data: UpdateAuditoriumDto) {
        return this.auditoriumService.update(id, data);
    }
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.auditoriumService.delete(id);
    }
}
