import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ClubService } from './club.service';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Authen } from '../auth/decorators/auth.decorator';
import { RoleType } from '../common/tiporole.enum';
import { PermisoType } from '../common/permiso.enum';
import { ClubResponseDto } from './dto/club-respon.dto';

@Controller('club')
export class ClubController {
  constructor(private readonly clubService: ClubService) {}

  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo club' })
  @ApiResponse({
    status: 201,
    description: 'Club creado exitosamente',
    type: ClubResponseDto, // Agregar tipo de respuesta
  })
  async create(@Body() createClubDto: CreateClubDto): Promise<ClubResponseDto> {
    return this.clubService.create(createClubDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los clubes activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de clubes',
    type: [ClubResponseDto],
  })
  @ApiQuery({
    name: 'responsable',
    required: false,
    description: 'Filtrar por ID de usuario responsable',
  })
  async findAll(
    @Query('responsable') responsableId?: number,
  ): Promise<ClubResponseDto[]> {
    if (responsableId) {
      return this.clubService.findAllByResponsable(responsableId);
    }
    return this.clubService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un club por ID' })
  @ApiResponse({
    status: 200,
    description: 'Club encontrado',
    type: [ClubResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Club no encontrado' })
  async findOne(@Param('id') id: string): Promise<ClubResponseDto> {
    return this.clubService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un club' })
  @ApiResponse({
    status: 200,
    description: 'Club actualizado',
    type: ClubResponseDto, // Agregar tipo
  })
  async update(
    @Param('id') id: string,
    @Body() updateClubDto: UpdateClubDto,
  ): Promise<ClubResponseDto> {
    return this.clubService.update(+id, updateClubDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un club (borrado lógico)' })
  @ApiResponse({
    status: 200,
    description: 'Club desactivado',
    type: ClubResponseDto, // Mostrar estructura de respuesta
  })
  async remove(@Param('id') id: string): Promise<ClubResponseDto> {
    return this.clubService.remove(+id);
  }

  @Get(':id/equipos')
  @ApiOperation({ summary: 'Obtener equipos de un club' })
  @ApiResponse({ status: 200, description: 'Lista de equipos del club' })
  @ApiResponse({ status: 404, description: 'Club no encontrado' })
  getEquipos(@Param('id') id: string) {
    return this.clubService.getEquiposByClub(+id);
  }

  @Get(':id/transferencias')
  @ApiOperation({ summary: 'Obtener transferencias de un club' })
  @ApiResponse({ status: 200, description: 'Transferencias del club' })
  @ApiResponse({ status: 404, description: 'Club no encontrado' })
  getTransferencias(@Param('id') id: string) {
    return this.clubService.getTransferenciasByClub(+id);
  }

  @Get(':id/deportistas')
  @ApiOperation({
    summary: 'Obtener deportistas de un club (todos los equipos)',
  })
  @ApiResponse({ status: 200, description: 'Lista de deportistas del club' })
  @ApiResponse({ status: 404, description: 'Club no encontrado' })
  getDeportistas(@Param('id') id: string) {
    return this.clubService.getDeportistasByClub(+id);
  }
}
