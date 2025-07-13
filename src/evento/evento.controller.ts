import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Authen } from '../auth/decorators/auth.decorator';
import { RoleType } from '../common/tiporole.enum';
import { PermisoType } from '../common/permiso.enum';
import { CambiarEstadoDto } from './dto/cambiarestado_evento';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo evento' })
  @ApiResponse({ status: 201, description: 'Evento creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Organizador no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto de fechas y ubicación' })
  create(@Body() createEventoDto: CreateEventoDto) {
    return this.eventoService.create(createEventoDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los eventos' })
  @ApiResponse({ status: 200, description: 'Lista de eventos' })
  @ApiQuery({ name: 'tipo', required: false, description: 'Filtrar por tipo de evento' })
  @ApiQuery({ name: 'estado', required: false, description: 'Filtrar por estado' })
  @ApiQuery({ name: 'proximos', required: false, description: 'Obtener próximos eventos', type: Boolean })
  @ApiQuery({ name: 'activos', required: false, description: 'Obtener eventos activos', type: Boolean })
  async findAll(
    @Query('tipo') tipo?: string,
    @Query('estado') estado?: string,
    @Query('proximos') proximos?: boolean,
    @Query('activos') activos?: boolean,
  ) {
    if (proximos) {
      return this.eventoService.getProximosEventos();
    }
    if (activos) {
      return this.eventoService.getEventosActivos();
    }
    if (tipo) {
      return this.eventoService.getEventosPorTipo(tipo);
    }
    return this.eventoService.findAll();
  }

  @ApiBearerAuth('mi secreto1')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento por ID' })
  @ApiResponse({ status: 200, description: 'Evento encontrado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  findOne(@Param('id') id: string) {
    return this.eventoService.findOne(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un evento' })
  @ApiResponse({ status: 200, description: 'Evento actualizado' })
  @ApiResponse({ status: 404, description: 'Evento u organizador no encontrado' })
  @ApiResponse({ status: 409, description: 'Evento no planificado o conflicto de fechas' })
  update(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventoService.update(+id, updateEventoDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar un evento (borrado lógico)' })
  @ApiResponse({ status: 200, description: 'Evento cancelado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiResponse({ status: 409, description: 'Evento no planificado' })
  remove(@Param('id') id: string) {
    return this.eventoService.remove(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Post(':idEvento/inscribir/:idClub')
  @ApiOperation({ summary: 'Inscribir un club en un evento' })
  @ApiResponse({ status: 201, description: 'Inscripción creada' })
  @ApiResponse({ status: 404, description: 'Evento, club o usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El club ya está inscrito' })
  @ApiQuery({ name: 'idUsuario', description: 'ID del usuario que registra la inscripción' })
  inscribirClub(
    @Param('idEvento') idEvento: string,
    @Param('idClub') idClub: string,
    @Query('idUsuario') idUsuario: string,
  ) {
    return this.eventoService.inscribirClub(+idEvento, +idClub, +idUsuario);
  }

  @ApiBearerAuth('mi secreto1')
  @Post('inscripciones/:idInscripcion/aprobar')
  @ApiOperation({ summary: 'Aprobar una inscripción pendiente' })
  @ApiResponse({ status: 200, description: 'Inscripción aprobada' })
  @ApiResponse({ status: 404, description: 'Inscripción o usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'Inscripción no pendiente' })
  @ApiQuery({ name: 'idUsuario', description: 'ID del usuario que aprueba la inscripción' })
  aprobarInscripcion(
    @Param('idInscripcion') idInscripcion: string,
    @Query('idUsuario') idUsuario: string,
  ) {
    return this.eventoService.aprobarInscripcion(+idInscripcion, +idUsuario);
  }

  @ApiBearerAuth('mi secreto1')
  @Post('inscripciones/:idInscripcion/rechazar')
  @ApiOperation({ summary: 'Rechazar una inscripción pendiente' })
  @ApiResponse({ status: 200, description: 'Inscripción rechazada' })
  @ApiResponse({ status: 404, description: 'Inscripción o usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'Inscripción no pendiente' })
  @ApiQuery({ name: 'idUsuario', description: 'ID del usuario que rechaza la inscripción' })
  rechazarInscripcion(
    @Param('idInscripcion') idInscripcion: string,
    @Query('idUsuario') idUsuario: string,
  ) {
    return this.eventoService.rechazarInscripcion(+idInscripcion, +idUsuario);
  }

  @ApiBearerAuth('mi secreto1')
  @Get(':id/inscripciones')
  @ApiOperation({ summary: 'Obtener inscripciones de un evento' })
  @ApiResponse({ status: 200, description: 'Lista de inscripciones' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiQuery({ name: 'estado', required: false, description: 'Filtrar por estado de inscripción' })
  getInscripcionesByEvento(
    @Param('id') id: string,
    @Query('estado') estado?: string,
  ) {
    return this.eventoService.getInscripcionesByEvento(+id, estado);
  }

  @ApiBearerAuth('mi secreto1')
@Post(':id/cambiar-estado')
@ApiOperation({ summary: 'Cambiar el estado de un evento' })
@ApiResponse({ status: 200, description: 'Estado cambiado' })
@ApiResponse({ status: 404, description: 'Evento o usuario no encontrado' })
@ApiResponse({ status: 409, description: 'Transición de estado no permitida' })
cambiarEstadoEvento(
  @Param('id') id: string,
  @Body() cambiarEstadoDto: CambiarEstadoDto,
) {
  return this.eventoService.cambiarEstadoEvento(+id, cambiarEstadoDto.estado, cambiarEstadoDto.idUsuario);
}
}
