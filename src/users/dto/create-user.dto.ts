import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nombre de usuario', example: 'usuario1' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario1@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario (mínimo 6 caracteres)',
    example: 'Password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
