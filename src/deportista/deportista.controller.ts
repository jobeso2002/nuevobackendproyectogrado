import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { DeportistaService } from './deportista.service';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateTransferenciaDto } from '../transferencia/dto/create-transferencia.dto';
import { CreateContactoDto } from '../contacto/dto/create-contacto.dto';
import { Authen } from '../auth/decorators/auth.decorator';
import { RoleType } from '../common/tiporole.enum';
import { PermisoType } from '../common/permiso.enum';
import { AuthGuard } from '../auth/guard/auth.guard';
import { RolesGuard } from '../auth/guard/roles.guard';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('deportista')
export class DeportistaController {
  constructor(private readonly deportistaService: DeportistaService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'fotoFile', maxCount: 1 },
    { name: 'documentoIdentidadFile', maxCount: 1 },
    { name: 'registroCivilFile', maxCount: 1 },
    { name: 'afiliacionFile', maxCount: 1 },
    { name: 'certificadoEpsFile', maxCount: 1 },
    { name: 'permisoResponsableFile', maxCount: 1 }
  ]))
  @ApiOperation({ summary: 'Crear un nuevo deportista' })
  @ApiResponse({ status: 201, description: 'Deportista creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Ya existe un deportista con este documento' })
  @ApiConsumes('multipart/form-data') // Añade esta línea
  async create(
    @Body() createDeportistaDto: CreateDeportistaDto,
    @UploadedFiles() files: {
      fotoFile?: Express.Multer.File[],
      documentoIdentidadFile?: Express.Multer.File[],
      registroCivilFile?: Express.Multer.File[],
      afiliacionFile?: Express.Multer.File[],
      certificadoEpsFile?: Express.Multer.File[],
      permisoResponsableFile?: Express.Multer.File[]
    }
  ) {
    // Convertir los arrays de archivos a archivos individuales
    const fileObjects = {
      fotoFile: files.fotoFile?.[0],
      documentoIdentidadFile: files.documentoIdentidadFile?.[0],
      registroCivilFile: files.registroCivilFile?.[0],
      afiliacionFile: files.afiliacionFile?.[0],
      certificadoEpsFile: files.certificadoEpsFile?.[0],
      permisoResponsableFile: files.permisoResponsableFile?.[0]
    };
  
    return this.deportistaService.create(createDeportistaDto, fileObjects);
  }
  @ApiBearerAuth('mi secreto1')
  @Get()
  @ApiOperation({ summary: 'Obtener todos los deportistas activos' })
  @ApiResponse({ status: 200, description: 'Lista de deportistas' })
  @ApiQuery({ name: 'club', required: false, description: 'Filtrar por ID de club' })
  @ApiQuery({ name: 'genero', required: false, description: 'Filtrar por género (masculino, femenino)' })
  async findAll(
    @Query('club') clubId?: number,
    @Query('genero') genero?: string,
  ) {
    return this.deportistaService.findAll(clubId, genero);
  }

  @ApiBearerAuth('mi secreto1')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un deportista por ID' })
  @ApiResponse({ status: 200, description: 'Deportista encontrado' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  findOne(@Param('id') id: string) {
    return this.deportistaService.findOne(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'fotoFile', maxCount: 1 },
    { name: 'documentoIdentidadFile', maxCount: 1 },
    { name: 'registroCivilFile', maxCount: 1 },
    { name: 'afiliacionFile', maxCount: 1 },
    { name: 'certificadoEpsFile', maxCount: 1 },
    { name: 'permisoResponsableFile', maxCount: 1 }
  ]))
  @ApiOperation({ summary: 'Actualizar un deportista' })
  @ApiResponse({ status: 200, description: 'Deportista actualizado' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un deportista con este documento' })
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @Body() updateDeportistaDto: UpdateDeportistaDto,
    @UploadedFiles() files: {
      fotoFile?: Express.Multer.File[],
      documentoIdentidadFile?: Express.Multer.File[],
      registroCivilFile?: Express.Multer.File[],
      afiliacionFile?: Express.Multer.File[],
      certificadoEpsFile?: Express.Multer.File[],
      permisoResponsableFile?: Express.Multer.File[]
    }
  ) {
    const fileObjects = {
      fotoFile: files.fotoFile?.[0],
      documentoIdentidadFile: files.documentoIdentidadFile?.[0],
      registroCivilFile: files.registroCivilFile?.[0],
      afiliacionFile: files.afiliacionFile?.[0],
      certificadoEpsFile: files.certificadoEpsFile?.[0],
      permisoResponsableFile: files.permisoResponsableFile?.[0]
    };
  
    return this.deportistaService.update(+id, updateDeportistaDto, fileObjects);
  }

  @ApiBearerAuth('mi secreto1')
  @Delete(':id')
  @ApiOperation({ summary: 'Desactivar un deportista (borrado lógico)' })
  @ApiResponse({ status: 200, description: 'Deportista desactivado' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  remove(@Param('id') id: string) {
    return this.deportistaService.remove(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Post(':id/contactos')
  @ApiOperation({ summary: 'Agregar un contacto al deportista' })
  @ApiResponse({ status: 201, description: 'Contacto agregado' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  addContacto(@Param('id') id: string, @Body() createContactoDto: CreateContactoDto) {
    return this.deportistaService.addContacto(+id, createContactoDto);
  }

  @ApiBearerAuth('mi secreto1')
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

  @ApiBearerAuth('mi secreto1')
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

  @ApiBearerAuth('mi secreto1')
  @Get(':id/clubs')
  @ApiOperation({ summary: 'Obtener clubs del deportista' })
  @ApiResponse({ status: 200, description: 'Lista de clubs con fechas de ingreso' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  getClubs(@Param('id') id: string) {
    return this.deportistaService.getClubs(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Get(':id/transferencias')
  @ApiOperation({ summary: 'Obtener transferencias del deportista' })
  @ApiResponse({ status: 200, description: 'Lista de transferencias' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  getTransferencias(@Param('id') id: string) {
    return this.deportistaService.getTransferencias(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Get(':id/estadisticas')
  @ApiOperation({ summary: 'Obtener estadísticas del deportista' })
  @ApiResponse({ status: 200, description: 'Estadísticas del deportista' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  getEstadisticas(@Param('id') id: string) {
    return this.deportistaService.getEstadisticas(+id);
  }
}