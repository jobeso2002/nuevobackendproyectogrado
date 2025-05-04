import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RoleType } from '../common/tiporole.enum';
import { Authen } from '../auth/decorators/auth.decorator';
import { PermisoType } from '../common/permiso.enum';

@Controller('inscripcion')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @ApiOperation({ summary: 'Crear una nueva inscripción' })
  @ApiResponse({ status: 201, description: 'Inscripción creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Evento, equipo o usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El equipo ya está inscrito en este evento' })
  @ApiResponse({ status: 403, description: 'No se pueden inscribir equipos en eventos no planificados' })
  create(@Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionService.create(createInscripcionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las inscripciones' })
  @ApiResponse({ status: 200, description: 'Lista de inscripciones' })
  @ApiQuery({ name: 'evento', required: false, description: 'Filtrar por ID de evento' })
  @ApiQuery({ name: 'equipo', required: false, description: 'Filtrar por ID de equipo' })
  @ApiQuery({ name: 'estado', required: false, description: 'Filtrar por estado (pendiente, aprobada, rechazada)' })
  async findAll(
    @Query('evento') eventoId?: number,
    @Query('equipo') equipoId?: number,
    @Query('estado') estado?: string,
  ) {
    if (eventoId) {
      return this.inscripcionService.getInscripcionesByEvento(eventoId, estado);
    }
    if (equipoId) {
      return this.inscripcionService.getInscripcionesByEquipo(equipoId);
    }
    return this.inscripcionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una inscripción por ID' })
  @ApiResponse({ status: 200, description: 'Inscripción encontrada' })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  findOne(@Param('id') id: string) {
    return this.inscripcionService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una inscripción pendiente' })
  @ApiResponse({ status: 200, description: 'Inscripción actualizada' })
  @ApiResponse({ status: 404, description: 'Inscripción o equipo no encontrado' })
  @ApiResponse({ status: 409, description: 'El equipo ya está inscrito en este evento' })
  @ApiResponse({ status: 403, description: 'No se pueden actualizar inscripciones no pendientes' })
  update(@Param('id') id: string, @Body() updateInscripcionDto: UpdateInscripcionDto) {
    return this.inscripcionService.update(+id, updateInscripcionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una inscripción pendiente' })
  @ApiResponse({ status: 200, description: 'Inscripción eliminada' })
  @ApiResponse({ status: 404, description: 'Inscripción no encontrada' })
  @ApiResponse({ status: 403, description: 'No se pueden eliminar inscripciones no pendientes' })
  remove(@Param('id') id: string) {
    return this.inscripcionService.remove(+id);
  }

  @Post(':id/aprobar')
  @ApiOperation({ summary: 'Aprobar una inscripción pendiente' })
  @ApiResponse({ status: 200, description: 'Inscripción aprobada' })
  @ApiResponse({ status: 404, description: 'Inscripción o usuario no encontrado' })
  @ApiResponse({ status: 403, description: 'No se pueden aprobar inscripciones no pendientes' })
  @ApiQuery({ name: 'idUsuario', description: 'ID del usuario que aprueba la inscripción' })
  aprobarInscripcion(
    @Param('id') id: string,
    @Query('idUsuario') idUsuario: string,
  ) {
    return this.inscripcionService.aprobarInscripcion(+id, +idUsuario);
  }

  @Post(':id/rechazar')
  @ApiOperation({ summary: 'Rechazar una inscripción pendiente' })
  @ApiResponse({ status: 200, description: 'Inscripción rechazada' })
  @ApiResponse({ status: 404, description: 'Inscripción o usuario no encontrado' })
  @ApiResponse({ status: 403, description: 'No se pueden rechazar inscripciones no pendientes' })
  @ApiQuery({ name: 'idUsuario', description: 'ID del usuario que rechaza la inscripción' })
  rechazarInscripcion(
    @Param('id') id: string,
    @Query('idUsuario') idUsuario: string,
  ) {
    return this.inscripcionService.rechazarInscripcion(+id, +idUsuario);
  }

  @Get('evento/:idEvento/aprobadas')
  @ApiOperation({ summary: 'Obtener inscripciones aprobadas de un evento' })
  @ApiResponse({ status: 200, description: 'Lista de inscripciones aprobadas' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  getInscripcionesAprobadasByEvento(@Param('idEvento') idEvento: string) {
    return this.inscripcionService.getInscripcionesAprobadasByEvento(+idEvento);
  }
}
