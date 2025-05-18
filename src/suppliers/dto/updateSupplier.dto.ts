import { IsString, IsEmail, IsPhoneNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSupplierDto {
  @ApiProperty({
    description: 'Nombre del proveedor',
    example: 'Dell Technologies',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Email de contacto del proveedor',
    example: 'contacto@dell.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiProperty({
    description: 'Número de teléfono del proveedor',
    example: '+34912345678',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(null)
  phoneNumber?: string;
}
