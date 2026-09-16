import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';

// Read-only for now: create/update/delete come later
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }
}
