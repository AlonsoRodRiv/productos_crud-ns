import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { Category } from 'src/categories/entity/category.entity';
import { Supplier } from 'src/suppliers/entity/supplier.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    // Create a new product instance
    const product = this.productRepository.create({
      name: createProductDto.name,
      price: createProductDto.price,
      sku: createProductDto.sku,
      description: createProductDto.description,
      stock: createProductDto.stock,
    });

    // Find and set the category
    if (createProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: createProductDto.categoryId },
      });

      if (!category) {
        throw new NotFoundException(
          `Category with ID ${createProductDto.categoryId} not found`,
        );
      }

      product.category = category;
    }

    if (createProductDto.providerId) {
      const supplier = await this.supplierRepository.findOne({
        where: { id: createProductDto.providerId },
      });

      if (!supplier) {
        throw new NotFoundException(
          `Supplier with ID ${createProductDto.providerId} not found`,
        );
      }

      product.suppliers = [supplier];
    }

    // Save the product with its relationships
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['category', 'suppliers'],
    });
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'suppliers'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, updateProductDto: any) {
    // First find the existing product
    const product = await this.findOne(id);

    // Update primitive fields using merge
    this.productRepository.merge(product, {
      name: updateProductDto.name,
      price: updateProductDto.price,
      sku: updateProductDto.sku,
      description: updateProductDto.description,
      stock: updateProductDto.stock,
    });

    // Handle category update if provided
    if (updateProductDto.categoryId !== undefined) {
      if (updateProductDto.categoryId === null) {
        // Remove category relationship
        product.category = null;
      } else {
        // Find and update category
        const category = await this.categoryRepository.findOne({
          where: { id: updateProductDto.categoryId },
        });

        if (!category) {
          throw new NotFoundException(
            `Category with ID ${updateProductDto.categoryId} not found`,
          );
        }

        product.category = category;
      }
    }

    // Handle supplier update if provided
    if (updateProductDto.providerId !== undefined) {
      if (updateProductDto.providerId === null) {
        // Remove all suppliers
        product.suppliers = [];
      } else {
        // Find and update supplier
        const supplier = await this.supplierRepository.findOne({
          where: { id: updateProductDto.providerId },
        });

        if (!supplier) {
          throw new NotFoundException(
            `Supplier with ID ${updateProductDto.providerId} not found`,
          );
        }

        product.suppliers = [supplier];
      }
    }

    // Save the updated product with its relationships
    return await this.productRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
  }
}
