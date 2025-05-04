import { Body, Controller, Post } from "@nestjs/common";
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
}
