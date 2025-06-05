import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PartidoService } from './partido.service';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateResultadoDto } from '../resultado/dto/create-resultado.dto';
import { Authen } from '../auth/decorators/auth.decorator';
import { RoleType } from '../common/tiporole.enum';
import { PermisoType } from '../common/permiso.enum';

@Controller('partido')
export class PartidoController {
  constructor(private readonly partidoService: PartidoService) {}

  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo partido' })
  @ApiResponse({ status: 201, description: 'Partido creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Evento, club o árbitro no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto con otro partido o clubs no válidos' })
  create(@Body() createPartidoDto: CreatePartidoDto) {
    return this.partidoService.create(createPartidoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los partidos' })
  @ApiResponse({ status: 200, description: 'Lista de partidos' })
  @ApiQuery({ name: 'evento', required: false, description: 'Filtrar por ID de evento' })
  @ApiQuery({ name: 'club', required: false, description: 'Filtrar por ID de club' }) // Cambiado de equipo a club
  @ApiQuery({ name: 'fechaInicio', required: false, description: 'Fecha de inicio para rango (YYYY-MM-DD)' })
  @ApiQuery({ name: 'fechaFin', required: false, description: 'Fecha de fin para rango (YYYY-MM-DD)' })
  async findAll(
    @Query('evento') eventoId?: number,
    @Query('club') clubId?: number, // Cambiado de equipoId a clubId
    @Query('fechaInicio') fechaInicio?: string,
    @Query('fechaFin') fechaFin?: string,
  ) {
    if (eventoId) {
      return this.partidoService.getPartidosByEvento(eventoId);
    }
    if (clubId) {
      return this.partidoService.getPartidosByClub(clubId); // Cambiado de getPartidosByEquipo a getPartidosByClub
    }
    if (fechaInicio && fechaFin) {
      return this.partidoService.getPartidosByFecha(fechaInicio, fechaFin);
    }
    return this.partidoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un partido por ID' })
  @ApiResponse({ status: 200, description: 'Partido encontrado' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  findOne(@Param('id') id: string) {
    return this.partidoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un partido programado' })
  @ApiResponse({ status: 200, description: 'Partido actualizado' })
  @ApiResponse({ status: 404, description: 'Partido, equipo o árbitro no encontrado' })
  @ApiResponse({ status: 409, description: 'Partido no programado o conflicto con otro partido' })
  update(@Param('id') id: string, @Body() updatePartidoDto: UpdatePartidoDto) {
    return this.partidoService.update(+id, updatePartidoDto);
  }

  @Post(':id/cambiar-estado')
  @ApiOperation({ summary: 'Cambiar el estado de un partido' })
  @ApiResponse({ status: 200, description: 'Estado del partido actualizado' })
  @ApiResponse({ status: 400, description: 'Transición de estado no permitida' })
  @ApiResponse({ status: 404, description: 'Partido no encontrado' })
  @ApiQuery({ name: 'estado', description: 'Nuevo estado (en_juego, finalizado, suspendido, programado)' })
  cambiarEstado(
    @Param('id') id: string,
    @Query('estado') estado: string,
  ) {
    return this.partidoService.cambiarEstado(+id, estado);
  }

  @Post(':id/resultado')
  @ApiOperation({ summary: 'Registrar resultado de un partido' })
  @ApiResponse({ status: 201, description: 'Resultado registrado' })
  @ApiResponse({ status: 404, description: 'Partido o usuario no encontrado' })
  @ApiResponse({ status: 409, description: 'Partido no finalizado o ya tiene resultado' })
  @ApiQuery({ name: 'idUsuario', description: 'ID del usuario que registra el resultado' })
  registrarResultado(
    @Param('id') id: string,
    @Body() createResultadoDto: CreateResultadoDto,
    @Query('idUsuario') idUsuario: string,
  ) {
    return this.partidoService.registrarResultado(+id, createResultadoDto, +idUsuario);
  }
}
