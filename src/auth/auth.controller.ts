import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RoleType } from "src/common/tiporole.enum";
import { Authen } from "./decorators/auth.decorator";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { PermisoType } from "src/common/permiso.enum";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBearerAuth('mi secreto1')
  @Authen(RoleType.ADMIN, PermisoType.WRITE)
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o usuario ya existe' })
  @ApiBody({ type: RegisterDto })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso' })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
  // auth.controller.ts

@Post('forgot-password')
@ApiOperation({ summary: 'Solicitar restablecimiento de contraseña' })
@ApiResponse({ status: 200, description: 'Correo de restablecimiento enviado' })
@ApiResponse({ status: 404, description: 'Usuario no encontrado' })
async forgotPassword(@Body() { email }: { email: string }) {
  return this.authService.sendPasswordResetEmail(email);
}

@Post('reset-password')
@ApiOperation({ summary: 'Restablecer contraseña' })
@ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente' })
@ApiResponse({ status: 400, description: 'Token inválido o expirado' })
async resetPassword(
  @Body() { email, token, newPassword }: { email: string; token: string; newPassword: string }
) {
  // Validaciones básicas
  if (!email || !token || !newPassword) {
    throw new BadRequestException('Faltan campos requeridos: email, token, newPassword');
  }

  // Verifica el token y actualiza la contraseña
  const result = await this.authService.resetPassword(email, token, newPassword);
  
  if (!result.success) {
    throw new BadRequestException(result.message);
  }

  return { success: true, message: result.message };
}
}
