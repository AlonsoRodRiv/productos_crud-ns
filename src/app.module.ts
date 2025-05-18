import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { ProductModule } from './products/product.module';
import { CategoriesModule } from './categories/categories.module';
import { SupplierModule } from './suppliers/supplier.module';
import { AppConfigModule } from './config/config.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    ProductModule,
    CategoriesModule,
    SupplierModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
