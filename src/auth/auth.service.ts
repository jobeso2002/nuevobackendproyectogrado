import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Verificar si el usuario ya existe
    const existingUser = await this.usuarioService.findOneByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('El usuario ya existe');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Crear el usuario
    const newUser = await this.usuarioService.create({
      ...registerDto,
      password: hashedPassword
    });

    // Generar token para el nuevo usuario
    const payload = {
      id: newUser.id,
      email: newUser.email,
      role: {
        id: newUser.role.id,
        name: newUser.role.name
      },
      permisos: newUser.role.permiso?.map(p => p.name) || []
    };

    const token = this.jwtService.sign(payload);

    return { 
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role.name
      }
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario por email
    const user = await this.usuarioService.findOneByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Preparar payload del token
    const payload = {
      id: user.id,
      email: user.email,
      role: {
        id: user.role.id,
        name: user.role.name
      },
      permisos: user.role.permiso?.map(p => p.name) || []
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role.name
      }
    };
  }
}