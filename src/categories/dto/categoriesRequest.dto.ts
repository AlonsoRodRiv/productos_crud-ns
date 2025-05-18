import { ApiProperty } from '@nestjs/swagger';

export class CategoriesRequestDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Electrónicos',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción de la categoría',
    example: 'Productos electrónicos y tecnología',
    required: false,
  })
  description?: string;
}
