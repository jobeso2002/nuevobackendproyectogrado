import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PermisoType } from '../common/permiso.enum';
import { RoleType } from '../common/tiporole.enum';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Authen } from '../auth/decorators/auth.decorator';
import { Roles } from '../auth/decorators/role.decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ChangePasswordDto } from './dto/ChangePasswordDto';

@ApiTags('usuario')
@Controller('usuario')

@UseGuards(AuthGuard, RolesGuard)//borrar para crear el primer usuario
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}
  
  @ApiBearerAuth('mi secreto1')//borrar para crear el primer usuario
  @Post()
  @Authen(RoleType.ADMIN, PermisoType.WRITE)//borrar para crear el primer usuario
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'Email o username ya en uso' })
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Get()
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  findAll() {
    return this.usuarioService.findAll();
  }

  @ApiBearerAuth('mi secreto1')
  @Get(':id')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  findOne(@Param('id') id: string) {
    return this.usuarioService.findOne(+id);
  }

  @ApiBearerAuth('mi secreto1')
  @Get('role/:roleId')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @ApiOperation({ summary: 'Obtener usuarios por rol' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios con el rol especificado' })
  findByRole(@Param('roleId') roleId: string) {
    return this.usuarioService.findByRole(+roleId);
  }

  @ApiBearerAuth('mi secreto1')
  @Patch(':id')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @ApiOperation({ summary: 'Actualizar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  @ApiBearerAuth('mi secreto1')
  @Patch(':id/changepassword')
  @ApiOperation({ summary: 'Cambiar contraseña de usuario' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.usuarioService.changePassword(+id, changePasswordDto.newPassword);
  }

  @ApiBearerAuth('mi secreto1')
  @Delete(':id')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'No se puede eliminar usuario con relaciones activas' })
  remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }
}
