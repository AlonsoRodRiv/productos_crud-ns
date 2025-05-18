import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
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

describe('ProductService', () => {
  let service: ProductService;
  let productRepository: MockRepository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Laptop',
        price: 1200,
        sku: 'LAP123',
        description: 'Potente laptop',
        stock: 10,
        categoryId: 1,
        providerId: 1,
      };

      const product = {
        id: 1,
        ...createProductDto,
        category: { id: 1, name: 'Electrónicos' },
        suppliers: [{ id: 1, name: 'Proveedor Electrónicos' }],
      };

      productRepository.create.mockReturnValue(product);
      productRepository.save.mockResolvedValue(product);

      const result = await service.create(createProductDto);
      expect(result).toEqual(product);
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(product);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const expectedProducts = [
        {
          id: 1,
          name: 'Laptop',
          price: 1200,
          sku: 'LAP123',
          description: 'Potente laptop',
          stock: 10,
          category: { id: 1, name: 'Electrónicos' },
          suppliers: [{ id: 1, name: 'Proveedor Electrónicos' }],
        },
        {
          id: 2,
          name: 'Smartphone',
          price: 800,
          sku: 'SP456',
          description: 'Smartphone avanzado',
          stock: 20,
          category: { id: 1, name: 'Electrónicos' },
          suppliers: [{ id: 1, name: 'Proveedor Electrónicos' }],
        },
      ];

      productRepository.find.mockResolvedValue(expectedProducts);

      const result = await service.findAll();
      expect(result).toEqual(expectedProducts);
      expect(productRepository.find).toHaveBeenCalledWith({
        relations: ['category', 'suppliers'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a product when it exists', async () => {
      const expectedProduct = {
        id: 1,
        name: 'Laptop',
        price: 1200,
        sku: 'LAP123',
        description: 'Potente laptop',
        stock: 10,
        category: { id: 1, name: 'Electrónicos' },
        suppliers: [{ id: 1, name: 'Proveedor Electrónicos' }],
      };

      productRepository.findOne.mockResolvedValue(expectedProduct);

      const result = await service.findOne(1);
      expect(result).toEqual(expectedProduct);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['category', 'suppliers'],
      });
    });

    it('should throw NotFoundException when product does not exist', async () => {
      productRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['category', 'suppliers'],
      });
    });
  });

  describe('update', () => {
    it('should update and return a product', async () => {
      const id = 1;
      const updateDto = {
        name: 'Laptop Actualizado',
        price: 1300,
      };

      const existingProduct = {
        id: 1,
        name: 'Laptop',
        price: 1200,
        sku: 'LAP123',
        description: 'Potente laptop',
        stock: 10,
        category: { id: 1, name: 'Electrónicos' },
        suppliers: [{ id: 1, name: 'Proveedor Electrónicos' }],
      };

      // Crear una copia para los mocks
      const mergedProduct = {
        ...existingProduct,
        name: updateDto.name,
        price: updateDto.price,
      };

      // Mock para findOne (verificar que existe)
      productRepository.findOne.mockResolvedValue(existingProduct);

      // Mock para merge (combinar los datos)
      productRepository.merge.mockImplementation((obj, update) => {
        // Simular el comportamiento real de merge aplicando los cambios al objeto
        // y devolviendo el mismo objeto (no una copia)
        Object.assign(obj, update);
        return obj;
      });

      // Mock para save (guardar en la base de datos)
      productRepository.save.mockImplementation((entity) =>
        Promise.resolve(mergedProduct),
      );

      const result = await service.update(id, updateDto);

      // Verificar el resultado
      expect(result).toEqual(mergedProduct);

      // Verificar que se llamó correctamente a findOne
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['category', 'suppliers'],
      });

      // Verificar que se llamó a merge con los argumentos correctos
      expect(productRepository.merge).toHaveBeenCalledWith(
        existingProduct,
        updateDto,
      );

      // Verificar que save fue llamado (sin verificar el argumento exacto)
      expect(productRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException when trying to update non-existent product', async () => {
      productRepository.findOne.mockResolvedValue(undefined);

      await expect(
        service.update(999, { name: 'Nuevo Producto' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      const id = 1;
      const product = {
        id,
        name: 'Laptop',
        price: 1200,
        sku: 'LAP123',
        description: 'Potente laptop',
        stock: 10,
        category: { id: 1, name: 'Electrónicos' },
        suppliers: [{ id: 1, name: 'Proveedor Electrónicos' }],
      };

      productRepository.findOne.mockResolvedValue(product);
      productRepository.remove.mockResolvedValue(product);

      const result = await service.remove(id);
      expect(result).toEqual(product);
      expect(productRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['category', 'suppliers'],
      });
      expect(productRepository.remove).toHaveBeenCalledWith(product);
    });

    it('should throw NotFoundException when trying to remove non-existent product', async () => {
      productRepository.findOne.mockResolvedValue(undefined);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
