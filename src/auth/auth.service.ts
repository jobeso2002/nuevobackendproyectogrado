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

     // Obtener el usuario completo con relaciones
  const userWithRelations = await this.usuarioService.findOne(newUser.id);


    // Generar token para el nuevo usuario
    const payload = {
      id: userWithRelations.id,
      email: userWithRelations.email,
      role: {
        id: userWithRelations.role.id,
        name: userWithRelations.role.name
      },
      permisos: userWithRelations.role.permiso?.map(p => p.name) || []
    };

    const token = this.jwtService.sign(payload);

    return { 
      token,
      user: {
        id: userWithRelations.id,
        email: userWithRelations.email,
        username: userWithRelations.username,
        role: userWithRelations.role.name
      }
    };
  }

  async login(loginDto: LoginDto) {
    // Buscar usuario por email
    const user = await this.usuarioService.findOneByEmail(loginDto.email);
    if (!user) {
        console.log('Usuario no encontrado con email:', loginDto.email);
      throw new UnauthorizedException('Credenciales inválidas');
    }

     // Verificar contraseña con debug
  console.log('Contraseña recibida:', loginDto.password);
  console.log('Hash almacenado:', user.password);

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    console.log('Comparación resultó:', isPasswordValid);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
this.usuarioService
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