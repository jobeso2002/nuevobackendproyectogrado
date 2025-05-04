import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Authen } from '../auth/decorators/auth.decorator';
import { RoleType } from '../common/tiporole.enum';
import { PermisoType } from '../common/permiso.enum';

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

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un evento por ID' })
  @ApiResponse({ status: 200, description: 'Evento encontrado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  findOne(@Param('id') id: string) {
    return this.eventoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un evento' })
  @ApiResponse({ status: 200, description: 'Evento actualizado' })
  @ApiResponse({ status: 404, description: 'Evento u organizador no encontrado' })
  @ApiResponse({ status: 409, description: 'Evento no planificado o conflicto de fechas' })
  update(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {
    return this.eventoService.update(+id, updateEventoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancelar un evento (borrado lógico)' })
  @ApiResponse({ status: 200, description: 'Evento cancelado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiResponse({ status: 409, description: 'Evento no planificado' })
  remove(@Param('id') id: string) {
    return this.eventoService.remove(+id);
  }

  @Post(':idEvento/inscribir/:idEquipo')
  @ApiOperation({ summary: 'Inscribir un equipo en un evento' })
  @ApiResponse({ status: 201, description: 'Inscripción creada' })
  @ApiResponse({ status: 404, description: 'Evento, equipo o usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'El equipo ya está inscrito' })
  @ApiQuery({ name: 'idUsuario', description: 'ID del usuario que registra la inscripción' })
  inscribirEquipo(
    @Param('idEvento') idEvento: string,
    @Param('idEquipo') idEquipo: string,
    @Query('idUsuario') idUsuario: string,
  ) {
    return this.eventoService.inscribirEquipo(+idEvento, +idEquipo, +idUsuario);
  }

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

  @Post(':id/cambiar-estado')
  @ApiOperation({ summary: 'Cambiar el estado de un evento' })
  @ApiResponse({ status: 200, description: 'Estado cambiado' })
  @ApiResponse({ status: 404, description: 'Evento o usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'Transición de estado no permitida' })
  @ApiQuery({ name: 'estado', description: 'Nuevo estado (en_curso, finalizado, cancelado)' })
  @ApiQuery({ name: 'idUsuario', description: 'ID del usuario que realiza el cambio' })
  cambiarEstadoEvento(
    @Param('id') id: string,
    @Query('estado') estado: string,
    @Query('idUsuario') idUsuario: string,
  ) {
    return this.eventoService.cambiarEstadoEvento(+id, estado, +idUsuario);
  }
}
