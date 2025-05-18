import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from './supplier.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from '../entity/supplier.entity';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from '../dto/suppliersRequest.dto';
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

describe('SupplierService', () => {
  let service: SupplierService;
  let supplierRepository: MockRepository<Supplier>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupplierService,
        {
          provide: getRepositoryToken(Supplier),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<SupplierService>(SupplierService);
    supplierRepository = module.get(getRepositoryToken(Supplier));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new supplier', async () => {
      const dto: CreateSupplierDto = {
        name: 'Proveedor Test',
        contactEmail: 'proveedor@test.com',
        phoneNumber: '123456789',
      };

      const supplier = {
        id: 1,
        ...dto,
        products: [],
      };

      supplierRepository.create.mockReturnValue(supplier);
      supplierRepository.save.mockResolvedValue(supplier);

      const result = await service.create(dto);
      expect(result).toEqual(supplier);
      expect(supplierRepository.create).toHaveBeenCalledWith(dto);
      expect(supplierRepository.save).toHaveBeenCalledWith(supplier);
    });
  });

  describe('findAll', () => {
    it('should return an array of suppliers', async () => {
      const expectedSuppliers = [
        {
          id: 1,
          name: 'Proveedor 1',
          contactEmail: 'proveedor1@test.com',
          phoneNumber: '123456789',
          products: [],
        },
        {
          id: 2,
          name: 'Proveedor 2',
          contactEmail: 'proveedor2@test.com',
          phoneNumber: '987654321',
          products: [],
        },
      ];

      supplierRepository.find.mockResolvedValue(expectedSuppliers);

      const result = await service.findAll();
      expect(result).toEqual(expectedSuppliers);
      expect(supplierRepository.find).toHaveBeenCalledWith({
        relations: ['products'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a supplier when it exists', async () => {
      const expectedSupplier = {
        id: 1,
        name: 'Proveedor 1',
        contactEmail: 'proveedor1@test.com',
        phoneNumber: '123456789',
        products: [],
      };

      supplierRepository.findOne.mockResolvedValue(expectedSupplier);

      const result = await service.findOne(1);
      expect(result).toEqual(expectedSupplier);
      expect(supplierRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['products'],
      });
    });

    it('should throw NotFoundException when supplier does not exist', async () => {
      supplierRepository.findOne.mockResolvedValue(undefined);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(supplierRepository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['products'],
      });
    });
  });

  describe('update', () => {
    it('should update and return a supplier', async () => {
      const id = 1;
      const updateDto = {
        name: 'Proveedor Actualizado',
        contactEmail: 'actualizado@test.com',
      };

      const existingSupplier = {
        id: 1,
        name: 'Proveedor 1',
        contactEmail: 'proveedor1@test.com',
        phoneNumber: '123456789',
        products: [],
      };

      const updatedSupplier = {
        ...existingSupplier,
        name: 'Proveedor Actualizado',
        contactEmail: 'actualizado@test.com',
      };

      // Mock para findOne (verificar que existe)
      supplierRepository.findOne.mockResolvedValue(existingSupplier);

      // Mock para merge (combinar con los nuevos datos)
      supplierRepository.merge.mockReturnValue(updatedSupplier);

      // Mock para save (guardar en la base de datos)
      supplierRepository.save.mockResolvedValue(updatedSupplier);

      const result = await service.update(id, updateDto);
      expect(result).toEqual(updatedSupplier);
      expect(supplierRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['products'],
      });
      expect(supplierRepository.merge).toHaveBeenCalledWith(
        existingSupplier,
        updateDto,
      );
      expect(supplierRepository.save).toHaveBeenCalledWith(updatedSupplier);
    });

    it('should throw NotFoundException when trying to update non-existent supplier', async () => {
      supplierRepository.findOne.mockResolvedValue(undefined);

      await expect(
        service.update(999, { name: 'Nuevo Proveedor' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a supplier successfully', async () => {
      const id = 1;
      const supplier = {
        id,
        name: 'Proveedor 1',
        contactEmail: 'proveedor1@test.com',
        phoneNumber: '123456789',
        products: [],
      };

      supplierRepository.findOne.mockResolvedValue(supplier);
      supplierRepository.remove.mockResolvedValue(undefined);

      await service.remove(id);
      expect(supplierRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['products'],
      });
      expect(supplierRepository.remove).toHaveBeenCalledWith(supplier);
    });

    it('should throw NotFoundException when trying to remove non-existent supplier', async () => {
      supplierRepository.findOne.mockResolvedValue(undefined);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
