import {ParseIntPipe,  Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeePageOptionsDto } from './dto/employee-page-options.dto';
import { Prisma } from '.prisma/generated';

@Controller('admin/employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Get()
  findAll(@Query() pageOptionsDto: EmployeePageOptionsDto) {
    return this.employeesService.findAll(pageOptionsDto);
  }

  @Post()
  create(@Body() data: any) {
    return this.employeesService.create(data);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.employeesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.remove(id);
  }
}
