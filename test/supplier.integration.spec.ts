import { Test, TestingModule } from '@nestjs/testing';
import { SupplierService } from '../src/suppliers/service/supplier.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from '../src/suppliers/entity/supplier.entity';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../src/database/database.module';
import { NotFoundException } from '@nestjs/common';
import { CreateSupplierDto } from '../src/suppliers/dto/suppliersRequest.dto';

describe('SupplierService Integration Test', () => {
  let service: SupplierService;
  let testSupplierId: number;
  let uniqueSuffix: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
        TypeOrmModule.forFeature([Supplier]),
      ],
      providers: [SupplierService],
    }).compile();

    service = module.get<SupplierService>(SupplierService);

    // Generamos un sufijo único para evitar conflictos en nombres de proveedores
    uniqueSuffix = Date.now().toString();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new supplier', async () => {
    const supplierDto: CreateSupplierDto = {
      name: `Test Supplier ${uniqueSuffix}`,
      contactEmail: `supplier_${uniqueSuffix}@test.com`,
      phoneNumber: '123456789',
    };

    const supplier = await service.create(supplierDto);
    expect(supplier).toBeDefined();
    expect(supplier.id).toBeDefined();
    expect(supplier.name).toBe(supplierDto.name);
    expect(supplier.contactEmail).toBe(supplierDto.contactEmail);
    expect(supplier.phoneNumber).toBe(supplierDto.phoneNumber);

    // Guardamos el ID para usarlo en pruebas posteriores
    testSupplierId = supplier.id;
  });

  it('should find all suppliers', async () => {
    const suppliers = await service.findAll();
    expect(suppliers).toBeDefined();
    expect(Array.isArray(suppliers)).toBe(true);
    expect(suppliers.length).toBeGreaterThan(0);

    // Verificar que nuestro proveedor de prueba está en la lista
    const testSupplier = suppliers.find((sup) => sup.id === testSupplierId);
    expect(testSupplier).toBeDefined();
  });

  it('should find one supplier by id', async () => {
    const supplier = await service.findOne(testSupplierId);
    expect(supplier).toBeDefined();
    expect(supplier.id).toBe(testSupplierId);
    expect(supplier.name).toContain(uniqueSuffix);
  });

  it('should throw error when finding non-existent supplier', async () => {
    await expect(service.findOne(99999)).rejects.toThrow(NotFoundException);
  });

  it('should update a supplier', async () => {
    const updateDto = {
      name: `Updated Supplier ${uniqueSuffix}`,
      contactEmail: `updated_${uniqueSuffix}@test.com`,
    };

    const updatedSupplier = await service.update(testSupplierId, updateDto);
    expect(updatedSupplier).toBeDefined();
    expect(updatedSupplier.id).toBe(testSupplierId);
    expect(updatedSupplier.name).toBe(updateDto.name);
    expect(updatedSupplier.contactEmail).toBe(updateDto.contactEmail);

    // Verificar que los cambios se guardaron en la base de datos
    const foundSupplier = await service.findOne(testSupplierId);
    expect(foundSupplier.name).toBe(updateDto.name);
  });

  it('should throw error when updating non-existent supplier', async () => {
    await expect(
      service.update(99999, { name: 'Non-existent Supplier' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a supplier', async () => {
    await service.remove(testSupplierId);

    // Verificar que el proveedor fue eliminado
    await expect(service.findOne(testSupplierId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw error when removing non-existent supplier', async () => {
    await expect(service.remove(99999)).rejects.toThrow(NotFoundException);
  });
});
