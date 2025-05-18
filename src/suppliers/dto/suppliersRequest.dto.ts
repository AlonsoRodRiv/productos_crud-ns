import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierDto {
  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Dell Technologies',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email de contacto del proveedor',
    example: 'contacto@dell.com',
  })
  @IsNotEmpty()
  @IsEmail()
  contactEmail: string;

  @ApiProperty({
    description: 'Número de teléfono del proveedor',
    example: '+34912345678',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
