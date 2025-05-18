import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../categories/entity/category.entity';
import { Supplier } from '../../suppliers/entity/supplier.entity';

@Entity()
export class Product {
  @ApiProperty({ description: 'ID único del producto', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell XPS 13',
  })
  @Column()
  name: string;

  @ApiProperty({ description: 'Precio del producto', example: 1299.99 })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Código SKU único del producto',
    example: 'DELL-XPS13-2024',
  })
  @Column()
  sku: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Laptop con procesador i7, 16GB RAM y 512GB SSD',
    nullable: true,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 25,
  })
  @Column()
  stock: number;

  @ApiProperty({
    description: 'Categoría a la que pertenece el producto',
    type: () => Category,
  })
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ApiProperty({
    description: 'Proveedores que suministran el producto',
    type: () => [Supplier],
  })
  @ManyToMany(() => Supplier, (supplier) => supplier.products)
  @JoinTable({
    name: 'product_suppliers',
    joinColumn: {
      name: 'product_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'supplier_id',
      referencedColumnName: 'id',
    },
  })
  suppliers: Supplier[];
}
