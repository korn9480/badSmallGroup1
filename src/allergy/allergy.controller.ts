import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { AllergyService } from './allergy.service';
import { CreateAllergyDto } from './dto/create-allergy.dto';

@Controller('allergy')
export class AllergyController {
  constructor(private readonly allergyService: AllergyService) {}

  @Post()
  create(@Body() createAllergyDto: CreateAllergyDto) {
    return this.allergyService.create(createAllergyDto);
  }

  @Get()
  findAll() {
    return this.allergyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.allergyService.findOne(+id);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.allergyService.remove(+id);
  }
}
