import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataInitializationService } from './init';
import { Category } from 'src/categories/entity/category.entity';
import { Product } from 'src/products/entity/product.entity';
import { Supplier } from 'src/suppliers/entity/supplier.entity';
import { User } from 'src/users/entity/user.entity';
import { AppConfigModule } from 'src/config/config.module';
import { DatabaseConfigService } from 'src/config/database-config.service';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: (databaseConfigService: DatabaseConfigService) => {
        return databaseConfigService.getTypeOrmConfig();
      },
      inject: [DatabaseConfigService],
    }),
    TypeOrmModule.forFeature([Category, Supplier, Product, User]),
  ],
  controllers: [],
  providers: [DataInitializationService, DatabaseConfigService],
})
export class DatabaseModule {}
