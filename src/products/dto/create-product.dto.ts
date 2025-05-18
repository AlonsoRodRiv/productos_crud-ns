import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Laptop Dell XPS 13',
  })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Precio del producto', example: 1299.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({
    description: 'Código SKU único del producto',
    example: 'DELL-XPS13-2024',
  })
  @IsString()
  sku: string;

  @ApiProperty({
    description: 'Descripción detallada del producto',
    example: 'Laptop con procesador i7, 16GB RAM y 512GB SSD',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Cantidad disponible en inventario',
    example: 25,
  })
  @IsNumber()
  @IsPositive()
  stock: number;

  @ApiProperty({ description: 'ID de la categoría del producto', example: 1 })
  @IsNumber()
  categoryId: number;

  @ApiProperty({ description: 'ID del proveedor principal', example: 1 })
  @IsNumber()
  providerId: number;
}
