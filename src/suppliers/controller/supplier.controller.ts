import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { SupplierService } from '../service/supplier.service';
import { Supplier } from '../entity/supplier.entity';
import { UpdateSupplierDto } from '../dto/updateSupplier.dto';
import { CreateSupplierDto } from '../dto/suppliersRequest.dto';

@ApiTags('suppliers')
@ApiBearerAuth()
@Controller('suppliers')
@UseGuards(JwtAuthGuard) // Protege todas las rutas del controlador
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Crear un nuevo proveedor' })
  @ApiResponse({
    status: 201,
    description: 'El proveedor ha sido creado exitosamente',
    type: Supplier,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(@Body() createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los proveedores' })
  @ApiResponse({
    status: 200,
    description: 'Listado de proveedores',
    type: [Supplier],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(): Promise<Supplier[]> {
    return this.supplierService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un proveedor por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor encontrado',
    type: Supplier,
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findOne(@Param('id') id: number): Promise<Supplier> {
    return this.supplierService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un proveedor por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor actualizado exitosamente',
    type: Supplier,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  update(
    @Param('id') id: number,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ): Promise<Supplier> {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un proveedor por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Proveedor eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Proveedor no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  remove(@Param('id') id: number): Promise<void> {
    return this.supplierService.remove(id);
  }
}
