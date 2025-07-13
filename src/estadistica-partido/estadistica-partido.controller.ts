import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EstadisticaPartidoService } from './estadistica-partido.service';
import { CreateEstadisticaPartidoDto } from './dto/create-estadistica-partido.dto';
import { UpdateEstadisticaPartidoDto } from './dto/update-estadistica-partido.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Authen } from '../auth/decorators/auth.decorator';
import { RoleType } from '../common/tiporole.enum';
import { PermisoType } from '../common/permiso.enum';

@Controller('estadistica-partido')
export class EstadisticaPartidoController {
  constructor(private readonly estadisticaService: EstadisticaPartidoService) {}

  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @ApiOperation({ summary: 'Crear nuevas estadísticas de partido' })
  @ApiResponse({ status: 201, description: 'Estadísticas creadas exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Partido o deportista no encontrado' })
  create(@Body() createEstadisticaDto: CreateEstadisticaPartidoDto) {
    return this.estadisticaService.create(createEstadisticaDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Get()
  @ApiOperation({ summary: 'Obtener todas las estadísticas de partidos' })
  @ApiResponse({ status: 200, description: 'Lista de estadísticas' })
  findAll() {
    return this.estadisticaService.findAll();
  }

  @ApiBearerAuth('mi secreto1')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener estadísticas por ID' })
  @ApiResponse({ status: 200, description: 'Estadísticas encontradas' })
  @ApiResponse({ status: 404, description: 'Estadísticas no encontradas' })
  findOne(@Param('id') id: string) {
    return this.estadisticaService.findOne(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Get('partido/:partidoId')
  @ApiOperation({ summary: 'Obtener estadísticas por ID de partido' })
  @ApiResponse({ status: 200, description: 'Estadísticas del partido' })
  findByPartido(@Param('partidoId') partidoId: string) {
    return this.estadisticaService.findByPartido(+partidoId);
  }

  @ApiBearerAuth('mi secreto1')
  @Get('deportista/:deportistaId')
  @ApiOperation({ summary: 'Obtener estadísticas por ID de deportista' })
  @ApiResponse({ status: 200, description: 'Estadísticas del deportista' })
  findByDeportista(@Param('deportistaId') deportistaId: string) {
    return this.estadisticaService.findByDeportista(+deportistaId);
  }

  @ApiBearerAuth('mi secreto1')
  @Get('deportista/:deportistaId/agregadas')
  @ApiOperation({ summary: 'Obtener estadísticas agregadas de un deportista' })
  @ApiResponse({ status: 200, description: 'Estadísticas agregadas' })
  getEstadisticasAgregadas(@Param('deportistaId') deportistaId: string) {
    return this.estadisticaService.getEstadisticasAgregadasPorDeportista(+deportistaId);
  }

  @ApiBearerAuth('mi secreto1')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar estadísticas' })
  @ApiResponse({ status: 200, description: 'Estadísticas actualizadas' })
  @ApiResponse({ status: 404, description: 'Estadísticas no encontradas' })
  update(
    @Param('id') id: string,
    @Body() updateEstadisticaDto: UpdateEstadisticaPartidoDto,
  ) {
    return this.estadisticaService.update(+id, updateEstadisticaDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar estadísticas' })
  @ApiResponse({ status: 200, description: 'Estadísticas eliminadas' })
  @ApiResponse({ status: 404, description: 'Estadísticas no encontradas' })
  remove(@Param('id') id: string) {
    return this.estadisticaService.remove(+id);
  }
}
