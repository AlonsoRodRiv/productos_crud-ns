import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entity/supplier.entity';
import { SupplierController } from './controller/supplier.controller';
import { SupplierService } from './service/supplier.service';
import { Product } from 'src/products/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier, Product])],
  controllers: [SupplierController],
  providers: [SupplierService],
  exports: [SupplierService],
})
export class SupplierModule {}
