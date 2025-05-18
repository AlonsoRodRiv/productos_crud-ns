import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from 'src/categories/entity/category.entity';
import { Product } from 'src/products/entity/product.entity';
import { Supplier } from 'src/suppliers/entity/supplier.entity';
import { User } from 'src/users/entity/user.entity';
import * as path from 'path';

@Injectable()
export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}
  getTypeOrmConfig(): TypeOrmModuleOptions {
    const dbType = this.configService.get<string>('DB_TYPE');

    // Configuración base común para ambos tipos de bases de datos
    const baseConfig = {
      entities: [Category, Supplier, Product, User],
      synchronize: true,
      autoLoadEntities: true,
    };

    // Configuración específica para MySQL
    if (dbType === 'mysql') {
      return {
        ...baseConfig,
        type: 'mysql' as const,
        host: this.configService.get<string>('DB_HOST'),
        port: this.configService.get<number>('DB_PORT'),
        username: this.configService.get<string>('DB_USERNAME'),
        password: this.configService.get<string>('DB_PASSWORD'),
        database: this.configService.get<string>('DB_NAME'),
      } as TypeOrmModuleOptions;
    } // Configuración específica para SQLite
    const dbName = this.configService.get<string>('DB_NAME');
    const dbPath = path.resolve(process.cwd(), dbName || 'database.sqlite');

    return {
      ...baseConfig,
      type: 'sqlite' as const,
      database: dbPath,
    } as TypeOrmModuleOptions;
  }
}
