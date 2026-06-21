import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeePageOptionsDto } from './dto/employee-page-options.dto';
import { Prisma } from '.prisma/generated';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll(@Query() pageOptionsDto: EmployeePageOptionsDto) {
    return this.employeesService.findAll(pageOptionsDto);
  }

  @Post()
  create(@Body() data: any) {
    // In a real app we'd use DTOs and hash passwords. For now, simple Prisma create
    return this.employeesService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.employeesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }
}
