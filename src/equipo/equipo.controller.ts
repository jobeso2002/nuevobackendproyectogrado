import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AddDeportistaDto } from './dto/add-deportista.dto';
import { PermisoType } from '../common/permiso.enum';
import { RoleType } from '../common/tiporole.enum';
import { Authen } from '../auth/decorators/auth.decorator';

@Controller('equipo')
export class EquipoController {
  constructor(private readonly equipoService: EquipoService) {}

  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo equipo' })
  @ApiResponse({ status: 201, description: 'Equipo creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Club no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un equipo con este nombre en el club' })
  create(@Body() createEquipoDto: CreateEquipoDto) {
    return this.equipoService.create(createEquipoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los equipos activos' })
  @ApiResponse({ status: 200, description: 'Lista de equipos' })
  @ApiQuery({ name: 'club', required: false, description: 'Filtrar por ID de club' })
  @ApiQuery({ name: 'categoria', required: false, description: 'Filtrar por categoría (masculino, femenino, mixto)' })
  @ApiQuery({ name: 'rama', required: false, description: 'Filtrar por rama (sub-15, sub-17, sub-19, mayores)' })
  async findAll(
    @Query('club') clubId?: number,
    @Query('categoria') categoria?: string,
    @Query('rama') rama?: string,
  ) {
    const options: any = {};
    if (clubId) options.club = { id: clubId };
    if (categoria) options.categoria = categoria;
    if (rama) options.rama = rama;
    
    return this.equipoService.findAll(options);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un equipo por ID' })
  @ApiResponse({ status: 200, description: 'Equipo encontrado' })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  findOne(@Param('id') id: string) {
    return this.equipoService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un equipo' })
  @ApiResponse({ status: 200, description: 'Equipo actualizado' })
  @ApiResponse({ status: 404, description: 'Equipo o club no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un equipo con este nombre en el club' })
  update(@Param('id') id: string, @Body() updateEquipoDto: UpdateEquipoDto) {
    return this.equipoService.update(+id, updateEquipoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un equipo (borrado lógico)' })
  @ApiResponse({ status: 200, description: 'Equipo desactivado' })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  remove(@Param('id') id: string) {
    return this.equipoService.remove(+id);
  }

  @Post(':id/deportistas')
  @ApiOperation({ summary: 'Agregar un deportista al equipo' })
  @ApiResponse({ status: 200, description: 'Deportista agregado al equipo' })
  @ApiResponse({ status: 404, description: 'Equipo o deportista no encontrado' })
  @ApiResponse({ status: 409, description: 'El deportista ya está en este equipo' })
  addDeportista(@Param('id') id: string, @Body() addDeportistaDto: AddDeportistaDto) {
    return this.equipoService.addDeportista(+id, addDeportistaDto);
  }

  @Delete(':id/deportistas/:idDeportista')
  @ApiOperation({ summary: 'Remover un deportista del equipo' })
  @ApiResponse({ status: 200, description: 'Deportista removido del equipo' })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  removeDeportista(
    @Param('id') id: string,
    @Param('idDeportista') idDeportista: string,
  ) {
    return this.equipoService.removeDeportista(+id, +idDeportista);
  }

  @Get(':id/deportistas')
  @ApiOperation({ summary: 'Obtener deportistas del equipo' })
  @ApiResponse({ status: 200, description: 'Lista de deportistas del equipo' })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  getDeportistas(@Param('id') id: string) {
    return this.equipoService.getDeportistas(+id);
  }

  @Get(':id/partidos')
  @ApiOperation({ summary: 'Obtener partidos del equipo' })
  @ApiResponse({ status: 200, description: 'Lista de partidos del equipo' })
  @ApiResponse({ status: 404, description: 'Equipo no encontrado' })
  getPartidos(@Param('id') id: string) {
    return this.equipoService.getPartidos(+id);
  }
}
