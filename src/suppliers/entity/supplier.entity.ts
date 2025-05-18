import { Product } from '../../products/entity/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Supplier {
  @ApiProperty({ description: 'ID único del proveedor', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Dell Technologies',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Email de contacto del proveedor',
    example: 'contacto@dell.com',
  })
  @Column()
  contactEmail: string;

  @ApiProperty({
    description: 'Número de teléfono del proveedor',
    example: '+34912345678',
  })
  @Column()
  phoneNumber: string;

  @ApiProperty({
    description: 'Productos suministrados por este proveedor',
    type: () => [Product],
  })
  @ManyToMany(() => Product, (product) => product.suppliers)
  products: Product[];
}
