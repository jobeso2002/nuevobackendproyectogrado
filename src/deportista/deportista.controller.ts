import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DeportistaService } from './deportista.service';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateTransferenciaDto } from '../transferencia/dto/create-transferencia.dto';
import { CreateContactoDto } from '../contacto/dto/create-contacto.dto';
import { Authen } from '../auth/decorators/auth.decorator';
import { RoleType } from '../common/tiporole.enum';
import { PermisoType } from '../common/permiso.enum';

@Controller('deportista')
export class DeportistaController {
  constructor(private readonly deportistaService: DeportistaService) {}

  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo deportista' })
  @ApiResponse({ status: 201, description: 'Deportista creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un deportista con este documento' })
  create(@Body() createDeportistaDto: CreateDeportistaDto) {
    return this.deportistaService.create(createDeportistaDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los deportistas activos' })
  @ApiResponse({ status: 200, description: 'Lista de deportistas' })
  @ApiQuery({ name: 'equipo', required: false, description: 'Filtrar por ID de equipo' })
  @ApiQuery({ name: 'club', required: false, description: 'Filtrar por ID de club' })
  @ApiQuery({ name: 'genero', required: false, description: 'Filtrar por género (masculino, femenino)' })
  async findAll(
    @Query('equipo') equipoId?: number,
    @Query('club') clubId?: number,
    @Query('genero') genero?: string,
  ) {
    return this.deportistaService.findAll(equipoId, clubId, genero);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un deportista por ID' })
  @ApiResponse({ status: 200, description: 'Deportista encontrado' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  findOne(@Param('id') id: string) {
    return this.deportistaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un deportista' })
  @ApiResponse({ status: 200, description: 'Deportista actualizado' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un deportista con este documento' })
  update(@Param('id') id: string, @Body() updateDeportistaDto: UpdateDeportistaDto) {
    return this.deportistaService.update(+id, updateDeportistaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un deportista (borrado lógico)' })
  @ApiResponse({ status: 200, description: 'Deportista desactivado' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  remove(@Param('id') id: string) {
    return this.deportistaService.remove(+id);
  }

  @Post(':id/contactos')
  @ApiOperation({ summary: 'Agregar un contacto al deportista' })
  @ApiResponse({ status: 201, description: 'Contacto agregado' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  addContacto(@Param('id') id: string, @Body() createContactoDto: CreateContactoDto) {
    return this.deportistaService.addContacto(+id, createContactoDto);
  }

  @Delete(':id/contactos/:idContacto')
  @ApiOperation({ summary: 'Eliminar un contacto del deportista' })
  @ApiResponse({ status: 200, description: 'Contacto eliminado' })
  @ApiResponse({ status: 404, description: 'Contacto o deportista no encontrado' })
  removeContacto(
    @Param('id') id: string,
    @Param('idContacto') idContacto: string,
  ) {
    return this.deportistaService.removeContacto(+id, +idContacto);
  }

  @Post(':id/transferencias')
  @ApiOperation({ summary: 'Crear una transferencia para el deportista' })
  @ApiResponse({ status: 201, description: 'Transferencia creada' })
  @ApiResponse({ status: 404, description: 'Deportista o club no encontrado' })
  createTransferencia(
    @Param('id') id: string,
    @Body() createTransferenciaDto: CreateTransferenciaDto,
  ) {
    return this.deportistaService.createTransferencia(+id, createTransferenciaDto);
  }

  @Get(':id/equipos')
  @ApiOperation({ summary: 'Obtener equipos del deportista' })
  @ApiResponse({ status: 200, description: 'Lista de equipos' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  getEquipos(@Param('id') id: string) {
    return this.deportistaService.getEquipos(+id);
  }

  @Get(':id/transferencias')
  @ApiOperation({ summary: 'Obtener transferencias del deportista' })
  @ApiResponse({ status: 200, description: 'Lista de transferencias' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  getTransferencias(@Param('id') id: string) {
    return this.deportistaService.getTransferencias(+id);
  }

  @Get(':id/estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas del deportista' })
  @ApiResponse({ status: 200, description: 'Estadísticas del deportista' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  getEstadisticas(@Param('id') id: string) {
    return this.deportistaService.getEstadisticas(+id);
  }
}
