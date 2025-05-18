import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoriesService } from '../service/categories.service';
import { Category } from '../entity/category.entity';
import { CategoriesRequestDto } from '../dto/categoriesRequest.dto';
import { UpdateCategoryDto } from '../dto/updateCategory.dto';
import type { CategoriesIDDto } from '../dto/categoriesSingleId.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createCategoryDto: CategoriesRequestDto): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param() params: CategoriesIDDto): Promise<Category> {
    return this.categoriesService.findOne(parseInt(params.id));
  }

  @Put(':id')
  async update(
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Param() params: CategoriesIDDto,
  ): Promise<Category> {
    return this.categoriesService.update(
      parseInt(params.id),
      updateCategoryDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.categoriesService.remove(id);
  }
}
