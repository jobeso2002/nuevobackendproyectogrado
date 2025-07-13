import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResultadoService } from './resultado.service';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { UpdateResultadoDto } from './dto/update-resultado.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleType } from '../common/tiporole.enum';
import { Authen } from '../auth/decorators/auth.decorator';
import { PermisoType } from '../common/permiso.enum';

@Controller('resultado')
export class ResultadoController {
  constructor(private readonly resultadoService: ResultadoService) {}

  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo resultado' })
  @ApiResponse({ status: 201, description: 'Resultado creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Partido o usuario no encontrado' })
  create(@Body() createResultadoDto: CreateResultadoDto) {
    return this.resultadoService.create(createResultadoDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los resultados' })
  @ApiResponse({ status: 200, description: 'Lista de resultados' })
  findAll() {
    return this.resultadoService.findAll();
  }

  @ApiBearerAuth('mi secreto1')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un resultado por ID' })
  @ApiResponse({ status: 200, description: 'Resultado encontrado' })
  @ApiResponse({ status: 404, description: 'Resultado no encontrado' })
  findOne(@Param('id') id: string) {
    return this.resultadoService.findOne(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Get('partido/:partidoId')
  @ApiOperation({ summary: 'Obtener resultado por ID de partido' })
  @ApiResponse({ status: 200, description: 'Resultado encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró resultado para este partido' })
  findByPartido(@Param('partidoId') partidoId: string) {
    return this.resultadoService.findByPartido(+partidoId);
  }

  @ApiBearerAuth('mi secreto1')
  @Get('evento/:eventoId')
  @ApiOperation({ summary: 'Obtener resultados por ID de evento' })
  @ApiResponse({ status: 200, description: 'Lista de resultados del evento' })
  findByEvento(@Param('eventoId') eventoId: string) {
    return this.resultadoService.findByEvento(+eventoId);
  }

  @ApiBearerAuth('mi secreto1')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un resultado' })
  @ApiResponse({ status: 200, description: 'Resultado actualizado' })
  @ApiResponse({ status: 404, description: 'Resultado no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateResultadoDto: UpdateResultadoDto,
  ) {
    return this.resultadoService.update(+id, updateResultadoDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un resultado' })
  @ApiResponse({ status: 200, description: 'Resultado eliminado' })
  @ApiResponse({ status: 404, description: 'Resultado no encontrado' })
  remove(@Param('id') id: string) {
    return this.resultadoService.remove(+id);
  }
}
