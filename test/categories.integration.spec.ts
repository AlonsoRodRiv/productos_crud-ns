import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../src/categories/service/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../src/categories/entity/category.entity';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../src/database/database.module';
import { NotFoundException } from '@nestjs/common';
import { CategoriesRequestDto } from '../src/categories/dto/categoriesRequest.dto';
import { UpdateCategoryDto } from '../src/categories/dto/updateCategory.dto';

describe('CategoriesService Integration Test', () => {
  let service: CategoriesService;
  let testCategoryId: number;
  let uniqueSuffix: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
        TypeOrmModule.forFeature([Category]),
      ],
      providers: [CategoriesService],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);

    // Generamos un sufijo único para evitar conflictos en nombres de categorías
    uniqueSuffix = Date.now().toString();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new category', async () => {
    const categoryDto: CategoriesRequestDto = {
      name: `Test Category ${uniqueSuffix}`,
      description: 'Categoría de prueba para integración',
    };

    const category = await service.create(categoryDto);
    expect(category).toBeDefined();
    expect(category.id).toBeDefined();
    expect(category.name).toBe(categoryDto.name);
    expect(category.description).toBe(categoryDto.description);

    // Guardamos el ID para usarlo en pruebas posteriores
    testCategoryId = category.id;
  });

  it('should find all categories', async () => {
    const categories = await service.findAll();
    expect(categories).toBeDefined();
    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);

    // Verificar que nuestra categoría de prueba está en la lista
    const testCategory = categories.find((cat) => cat.id === testCategoryId);
    expect(testCategory).toBeDefined();
  });

  it('should find one category by id', async () => {
    const category = await service.findOne(testCategoryId);
    expect(category).toBeDefined();
    expect(category.id).toBe(testCategoryId);
    expect(category.name).toContain(uniqueSuffix);
  });

  it('should throw error when finding non-existent category', async () => {
    await expect(service.findOne(99999)).rejects.toThrow(NotFoundException);
  });

  it('should update a category', async () => {
    const updateDto: UpdateCategoryDto = {
      name: `Updated Category ${uniqueSuffix}`,
      description: 'Descripción actualizada',
    };

    const updatedCategory = await service.update(testCategoryId, updateDto);
    expect(updatedCategory).toBeDefined();
    expect(updatedCategory.id).toBe(testCategoryId);
    expect(updatedCategory.name).toBe(updateDto.name);
    expect(updatedCategory.description).toBe(updateDto.description);

    // Verificar que los cambios se guardaron en la base de datos
    const foundCategory = await service.findOne(testCategoryId);
    expect(foundCategory.name).toBe(updateDto.name);
  });

  it('should throw error when updating non-existent category', async () => {
    await expect(
      service.update(99999, { name: 'Non-existent Category' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a category', async () => {
    await service.remove(testCategoryId);

    // Verificar que la categoría fue eliminada
    await expect(service.findOne(testCategoryId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw error when removing non-existent category', async () => {
    await expect(service.remove(99999)).rejects.toThrow(NotFoundException);
  });
});
