import { Injectable, type OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/Categories/entity/category.entity';
import { Product } from 'src/products/entity/product.entity';
import { Supplier } from 'src/suppliers/entity/supplier.entity';
import { User } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DataInitializationService implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.initializeDatabase();
  }
  private async initializeDatabase() {
    const categoryCount = await this.categoryRepository.count();
    const supplierCount = await this.supplierRepository.count();
    const productCount = await this.productRepository.count();
    const userCount = await this.userRepository.count();

    if (categoryCount === 0) {
      await this.categoryRepository.save([
        {
          name: 'Electrónica',
          description: 'Productos electrónicos y tecnológicos',
        },
        {
          name: 'Ropa',
          description: 'Prendas de vestir para todas las edades',
        },
        { name: 'Hogar', description: 'Artículos para el hogar y decoración' },
      ]);
      console.log('Categorías iniciales insertadas');
    }

    if (supplierCount === 0) {
      await this.supplierRepository.save([
        {
          name: 'Tecnología Global',
          contactEmail: 'contacto@tecnologiaglobal.com',
          phoneNumber: '+54 11 1234 5678',
        },
        {
          name: 'Moda Trends',
          contactEmail: 'ventas@modatrends.com',
          phoneNumber: '+54 11 8765 4321',
        },
        {
          name: 'Hogar Diseño',
          contactEmail: 'info@hogardiseno.com',
          phoneNumber: '+54 11 5555 7777',
        },
      ]);
      console.log('Proveedores iniciales insertados');
    }

    if (productCount === 0) {
      const categories = await this.categoryRepository.find();
      const suppliers = await this.supplierRepository.find();

      await this.productRepository.save([
        {
          name: 'Smartphone X2000',
          price: 599.99,
          sku: 'TECH-001',
          description: 'Smartphone de última generación',
          stock: 50,
          category: categories.find((c) => c.name === 'Electrónica'),
          suppliers: [suppliers.find((s) => s.name === 'Tecnología Global')],
        },
        {
          name: 'Camisa Casual',
          price: 79.99,
          sku: 'CLOTH-001',
          description: 'Camisa de algodón para hombre',
          stock: 100,
          category: categories.find((c) => c.name === 'Ropa'),
          suppliers: [suppliers.find((s) => s.name === 'Moda Trends')],
        },
        {
          name: 'Lámpara de Mesa Moderna',
          price: 129.99,
          sku: 'HOME-001',
          description: 'Lámpara decorativa para sala',
          stock: 30,
          category: categories.find((c) => c.name === 'Hogar'),
          suppliers: [suppliers.find((s) => s.name === 'Hogar Diseño')],
        },
      ]);
      console.log('Productos iniciales insertados');
    }    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await this.userRepository.save([
        {
          username: 'admin',
          password: hashedPassword,
          email: 'admin@example.com',
          roles: ['admin'],
        },
        {
          username: 'user',
          password: await bcrypt.hash('user123', 10),
          email: 'user@example.com',
          roles: ['user'],
        },
      ]);
      console.log('Usuarios iniciales insertados');
    }
  }
}
