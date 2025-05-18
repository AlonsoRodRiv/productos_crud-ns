import { Module } from '@nestjs/common';
import { ProductController } from './controller/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity/product.entity';
import { Category } from 'src/categories/entity/category.entity';
import { Supplier } from 'src/suppliers/entity/supplier.entity';
import { ProductService } from './service/product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Supplier])],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
