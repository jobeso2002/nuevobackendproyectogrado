import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Authen } from '../auth/decorators/auth.decorator';
import { RoleType } from '../common/tiporole.enum';
import { PermisoType } from '../common/permiso.enum';

@Controller('contacto')
export class ContactoController {
  constructor(private readonly contactoService: ContactoService) {}
  
  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo contacto' })
  @ApiResponse({ status: 201, description: 'Contacto creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  @ApiResponse({ status: 409, description: 'El deportista ya tiene un contacto de emergencia' })
  create(@Body() createContactoDto: CreateContactoDto) {
    return this.contactoService.create(createContactoDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Get('deportista/:idDeportista')
  @ApiOperation({ summary: 'Obtener todos los contactos de un deportista' })
  @ApiParam({ name: 'idDeportista', description: 'ID del deportista' })
  @ApiResponse({ status: 200, description: 'Lista de contactos' })
  @ApiResponse({ status: 404, description: 'Deportista no encontrado' })
  findAllByDeportista(@Param('idDeportista') idDeportista: string) {
    return this.contactoService.findAllByDeportista(+idDeportista);
  }

  @ApiBearerAuth('mi secreto1')
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un contacto por ID' })
  @ApiResponse({ status: 200, description: 'Contacto encontrado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  findOne(@Param('id') id: string) {
    return this.contactoService.findOne(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un contacto' })
  @ApiResponse({ status: 200, description: 'Contacto actualizado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  @ApiResponse({ status: 409, description: 'El deportista ya tiene un contacto de emergencia' })
  update(@Param('id') id: string, @Body() updateContactoDto: UpdateContactoDto) {
    return this.contactoService.update(+id, updateContactoDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un contacto' })
  @ApiResponse({ status: 200, description: 'Contacto eliminado' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  remove(@Param('id') id: string) {
    return this.contactoService.remove(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Get('deportista/:idDeportista/emergencia')
  @ApiOperation({ summary: 'Obtener el contacto de emergencia de un deportista' })
  @ApiParam({ name: 'idDeportista', description: 'ID del deportista' })
  @ApiResponse({ status: 200, description: 'Contacto de emergencia' })
  @ApiResponse({ status: 404, description: 'No se encontró contacto de emergencia' })
  getContactoEmergencia(@Param('idDeportista') idDeportista: string) {
    return this.contactoService.getContactoEmergencia(+idDeportista);
  }
}
