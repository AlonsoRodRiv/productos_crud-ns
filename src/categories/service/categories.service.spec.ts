import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entity/category.entity';
import { Repository } from 'typeorm';
import { CategoriesRequestDto } from '../dto/categoriesRequest.dto';
import { UpdateCategoryDto } from '../dto/updateCategory.dto';
import { NotFoundException } from '@nestjs/common';

// Tipo para el repositorio mockeado
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

// Función para crear un repositorio mockeado
const createMockRepository = <T = any>(): MockRepository<T> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  merge: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepository: MockRepository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    categoryRepository = module.get(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const dto: CategoriesRequestDto = {
        name: 'Electrónicos',
        description: 'Productos electrónicos',
      };

      const category = { id: 1, ...dto, products: [] };

      categoryRepository.create.mockReturnValue(category);
      categoryRepository.save.mockResolvedValue(category);

      const result = await service.create(dto);
      expect(result).toEqual(category);
      expect(categoryRepository.create).toHaveBeenCalledWith(dto);
      expect(categoryRepository.save).toHaveBeenCalledWith(category);
    });
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const expectedCategories = [
        {
          id: 1,
          name: 'Electrónicos',
          description: 'Productos electrónicos',
          products: [],
        },
        { id: 2, name: 'Ropa', description: 'Todo tipo de ropa', products: [] },
      ];

      categoryRepository.find.mockResolvedValue(expectedCategories);

      const result = await service.findAll();
      expect(result).toEqual(expectedCategories);
      expect(categoryRepository.find).toHaveBeenCalledWith({
        relations: ['products'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a category when it exists', async () => {
      const expectedCategory = {
        id: 1,
        name: 'Electrónicos',
        description: 'Productos electrónicos',
        products: [],
      };

      categoryRepository.findOne.mockResolvedValue(expectedCategory);

      const result = await service.findOne(1);
      expect(result).toEqual(expectedCategory);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['products'],
      });
    });

    it('should throw NotFoundException when category does not exist', async () => {
      categoryRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['products'],
      });
    });
  });

  describe('update', () => {
    it('should update and return a category', async () => {
      const id = 1;
      const updateDto: UpdateCategoryDto = {
        name: 'Electrónicos Actualizados',
      };

      const existingCategory = {
        id: 1,
        name: 'Electrónicos',
        description: 'Productos electrónicos',
        products: [],
      };

      const updatedCategory = {
        ...existingCategory,
        name: 'Electrónicos Actualizados',
      };

      // Mock para findOne (verificar que existe)
      categoryRepository.findOne.mockResolvedValue(existingCategory);

      // Mock para merge (combinar con los nuevos datos)
      categoryRepository.merge.mockReturnValue(updatedCategory);

      // Mock para save (guardar en la base de datos)
      categoryRepository.save.mockResolvedValue(updatedCategory);

      const result = await service.update(id, updateDto);
      expect(result).toEqual(updatedCategory);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['products'],
      });
      expect(categoryRepository.merge).toHaveBeenCalledWith(
        existingCategory,
        updateDto,
      );
      expect(categoryRepository.save).toHaveBeenCalledWith(updatedCategory);
    });

    it('should throw NotFoundException when trying to update non-existent category', async () => {
      categoryRepository.findOne.mockResolvedValue(undefined);

      await expect(
        service.update(999, { name: 'Nueva Categoría' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a category successfully', async () => {
      const id = 1;
      const category = {
        id,
        name: 'Electrónicos',
        description: 'Productos electrónicos',
        products: [],
      };

      categoryRepository.findOne.mockResolvedValue(category);
      categoryRepository.remove.mockResolvedValue(undefined);

      await service.remove(id);
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['products'],
      });
      expect(categoryRepository.remove).toHaveBeenCalledWith(category);
    });

    it('should throw NotFoundException when trying to remove non-existent category', async () => {
      categoryRepository.findOne.mockResolvedValue(undefined);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
