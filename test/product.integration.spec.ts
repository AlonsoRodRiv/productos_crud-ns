import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../src/products/service/product.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../src/products/entity/product.entity';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../src/database/database.module';
import { NotFoundException } from '@nestjs/common';
import { Category } from '../src/categories/entity/category.entity';
import { Supplier } from '../src/suppliers/entity/supplier.entity';
import { CreateProductDto } from '../src/products/dto/create-product.dto';
import { CategoriesService } from '../src/categories/service/categories.service';
import { CategoriesRequestDto } from '../src/categories/dto/categoriesRequest.dto';
import { SupplierService } from '../src/suppliers/service/supplier.service';
import { CreateSupplierDto } from '../src/suppliers/dto/suppliersRequest.dto';

describe('ProductService Integration Test', () => {
  let productService: ProductService;
  let categoryService: CategoriesService;
  let supplierService: SupplierService;
  let testProductId: number;
  let testCategoryId: number;
  let testSupplierId: number;
  let uniqueSuffix: string;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        DatabaseModule,
        TypeOrmModule.forFeature([Product, Category, Supplier]),
      ],
      providers: [ProductService, CategoriesService, SupplierService],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    categoryService = module.get<CategoriesService>(CategoriesService);
    supplierService = module.get<SupplierService>(SupplierService);

    // Generamos un sufijo único para evitar conflictos
    uniqueSuffix = Date.now().toString();

    // Creamos primero una categoría y un proveedor para poder crear productos
    const categoryDto: CategoriesRequestDto = {
      name: `Test Category ${uniqueSuffix}`,
      description: 'Categoría de prueba para productos',
    };
    const category = await categoryService.create(categoryDto);
    testCategoryId = category.id;

    const supplierDto: CreateSupplierDto = {
      name: `Test Supplier ${uniqueSuffix}`,
      contactEmail: `supplier_${uniqueSuffix}@test.com`,
      phoneNumber: '123456789',
    };
    const supplier = await supplierService.create(supplierDto);
    testSupplierId = supplier.id;
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
    expect(categoryService).toBeDefined();
    expect(supplierService).toBeDefined();
  });

  it('should create a new product', async () => {
    const productDto: CreateProductDto = {
      name: `Test Product ${uniqueSuffix}`,
      price: 100,
      sku: `SKU-${uniqueSuffix}`,
      description: 'Product description',
      stock: 10,
      categoryId: testCategoryId,
      providerId: testSupplierId,
    };

    const product = await productService.create(productDto);
    expect(product).toBeDefined();
    expect(product.id).toBeDefined();
    expect(product.name).toBe(productDto.name);
    expect(product.price).toBe(productDto.price);
    expect(product.sku).toBe(productDto.sku);
    expect(product.stock).toBe(productDto.stock);

    // Guardamos el ID para usarlo en pruebas posteriores
    testProductId = product.id;
  });

  it('should find all products', async () => {
    const products = await productService.findAll();
    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);

    // Verificar que nuestro producto de prueba está en la lista
    const testProduct = products.find((prod) => prod.id === testProductId);
    expect(testProduct).toBeDefined();
  });

  it('should find one product by id', async () => {
    const product = await productService.findOne(testProductId);
    expect(product).toBeDefined();
    expect(product.id).toBe(testProductId);
    expect(product.name).toContain(uniqueSuffix);

    // Verificar las relaciones
    expect(product.category).toBeDefined();
    expect(product.category.id).toBe(testCategoryId);
    expect(product.suppliers).toBeDefined();
  });

  it('should throw error when finding non-existent product', async () => {
    await expect(productService.findOne(99999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should update a product', async () => {
    const updateDto = {
      name: `Updated Product ${uniqueSuffix}`,
      price: 150,
      description: 'Updated description',
    };

    const updatedProduct = await productService.update(
      testProductId,
      updateDto,
    );
    expect(updatedProduct).toBeDefined();
    expect(updatedProduct.id).toBe(testProductId);
    expect(updatedProduct.name).toBe(updateDto.name);
    expect(updatedProduct.price).toBe(updateDto.price);
    expect(updatedProduct.description).toBe(updateDto.description);

    // Verificar que los cambios se guardaron en la base de datos
    const foundProduct = await productService.findOne(testProductId);
    expect(foundProduct.name).toBe(updateDto.name);
  });

  it('should throw error when updating non-existent product', async () => {
    await expect(
      productService.update(99999, { name: 'Non-existent Product' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should remove a product', async () => {
    await productService.remove(testProductId);

    // Verificar que el producto fue eliminado
    await expect(productService.findOne(testProductId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw error when removing non-existent product', async () => {
    await expect(productService.remove(99999)).rejects.toThrow(
      NotFoundException,
    );
  });

  afterAll(async () => {
    // Limpiamos los datos creados para las pruebas
    try {
      await categoryService.remove(testCategoryId);
      await supplierService.remove(testSupplierId);
    } catch (error) {
      // Ignoramos errores de no encontrado
      console.log('Cleanup error:', error.message);
    }
  });
});
