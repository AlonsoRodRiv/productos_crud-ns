import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónicos',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Productos electrónicos y tecnología',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
