import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TransferenciaService } from './transferencia.service';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from './dto/update-transferencia.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PermisoType } from '../common/permiso.enum';
import { RoleType } from '../common/tiporole.enum';
import { Authen } from '../auth/decorators/auth.decorator';
import { Transferencia } from './entities/transferencia.entity';

@Controller('transferencia')
export class TransferenciaController {
  constructor(private readonly transferenciaService: TransferenciaService) {}

  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva solicitud de transferencia' })
  @ApiResponse({ status: 201, description: 'Transferencia creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Deportista, club o usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El deportista ya tiene una transferencia pendiente o no pertenece al club de origen' })
  create(@Body() createTransferenciaDto: CreateTransferenciaDto) {
    return this.transferenciaService.create(createTransferenciaDto);
  }

  @ApiBearerAuth('mi secreto1')
  // transferencia.controller.ts
@Get()
@ApiOperation({ summary: 'Obtener todas las transferencias' })
@ApiResponse({ 
  status: 200, 
  description: 'Lista de transferencias',
  type: [Transferencia ] // Asegúrate de tener el tipo correcto
})
async findAll() {
  return this.transferenciaService.findAll();
}

@ApiBearerAuth('mi secreto1')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una transferencia por ID' })
  @ApiResponse({ status: 200, description: 'Transferencia encontrada' })
  @ApiResponse({ status: 404, description: 'Transferencia no encontrada' })
  findOne(@Param('id') id: string) {
    return this.transferenciaService.findOne(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una transferencia pendiente' })
  @ApiResponse({ status: 200, description: 'Transferencia actualizada' })
  @ApiResponse({ status: 403, description: 'No se puede actualizar una transferencia no pendiente' })
  @ApiResponse({ status: 404, description: 'Transferencia o club no encontrado' })
  update(@Param('id') id: string, @Body() updateTransferenciaDto: UpdateTransferenciaDto) {
    return this.transferenciaService.update(+id, updateTransferenciaDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Post(':id/aprobar')
  @ApiOperation({ summary: 'Aprobar una transferencia pendiente' })
  @ApiResponse({ status: 200, description: 'Transferencia aprobada' })
  @ApiResponse({ status: 403, description: 'No se puede aprobar una transferencia no pendiente' })
  @ApiResponse({ status: 404, description: 'Transferencia o usuario no encontrado' })
  @ApiQuery({ name: 'idUsuario', description: 'ID del usuario que aprueba la transferencia' })
  aprobarTransferencia(
    @Param('id') id: string,
    @Query('idUsuario') idUsuario: string,
  ) {
    return this.transferenciaService.aprobarTransferencia(+id, +idUsuario);
  }

  @ApiBearerAuth('mi secreto1')
  @Post(':id/rechazar')
  @ApiOperation({ summary: 'Rechazar una transferencia pendiente' })
  @ApiResponse({ status: 200, description: 'Transferencia rechazada' })
  @ApiResponse({ status: 403, description: 'No se puede rechazar una transferencia no pendiente' })
  @ApiResponse({ status: 404, description: 'Transferencia o usuario no encontrado' })
  @ApiQuery({ name: 'idUsuario', description: 'ID del usuario que rechaza la transferencia' })
  rechazarTransferencia(
    @Param('id') id: string,
    @Query('idUsuario') idUsuario: string,
  ) {
    return this.transferenciaService.rechazarTransferencia(+id, +idUsuario);
  }

}
