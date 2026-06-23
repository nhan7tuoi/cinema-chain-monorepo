import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomerPageOptionsDto } from './dto/customer-page-options.dto';

@Controller('admin/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll(@Query() pageOptionsDto: CustomerPageOptionsDto) {
    return this.customersService.findAll(pageOptionsDto);
  }

  @Post()
  create(@Body() data: any) {
    return this.customersService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.customersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(id);
  }
}
