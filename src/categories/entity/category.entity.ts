import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entity/product.entity';

@Entity()
export class Category {
  @ApiProperty({ description: 'ID único de la categoría', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónicos',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Productos electrónicos y tecnología',
    nullable: true,
  })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({
    description: 'Productos que pertenecen a esta categoría',
    type: () => [Product],
  })
  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
