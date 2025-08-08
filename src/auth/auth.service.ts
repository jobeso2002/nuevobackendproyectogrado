import { 
  BadRequestException, 
  Injectable, 
  NotFoundException, 
  UnauthorizedException 
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

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
      username: userWithRelations.username,
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

    // Preparar payload del token
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: {
        id: user.role.id,
        name: user.role.name
      },
      permisos: user.role.permiso?.map(p => p.name) || []
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: payload
    };
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const user = await this.usuarioService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
  
    // Generar token de restablecimiento
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hora
  
    // Debug: Mostrar lo que vamos a guardar
    console.log('Guardando token:', resetToken);
    console.log('Con expiración:', resetTokenExpiry);
  
    // Actualizar usuario con el nuevo token
    await this.usuarioService.update(user.id, {
      resetToken,
      resetTokenExpiry
    });
  
    // Verificar que realmente se actualizó
    const updatedUser = await this.usuarioService.findOneByEmail(email);
    if (!updatedUser) {
      throw new Error('Error al verificar la actualización del usuario');
    }
  
    console.log('Usuario actualizado:', {
      resetToken: updatedUser.resetToken,
      expiry: updatedUser.resetTokenExpiry
    });
  
    // Enviar correo (implementación básica)
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    console.log(`Enlace de restablecimiento: ${resetUrl}`);
  }

  async resetPassword(
    email: string, 
    token: string, 
    newPassword: string
  ): Promise<{ success: boolean; message?: string }> {
    // Validación básica de campos
    if (!email || !token || !newPassword) {
      return { success: false, message: 'Faltan campos requeridos' };
    }
  
    const user = await this.usuarioService.findOneByEmail(email);
    
    if (!user) {
      return { success: false, message: 'Usuario no encontrado' };
    }
  
    // Debug: Mostrar tokens para comparación
    console.log('Token recibido:', token);
    console.log('Token en DB:', user.resetToken);
    console.log('Expiración:', user.resetTokenExpiry);
  
    if (!user.resetToken || user.resetToken !== token) {
      return { success: false, message: 'Token inválido' };
    }
  
    if (user.resetTokenExpiry && new Date() > user.resetTokenExpiry) {
      return { success: false, message: 'Token expirado' };
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await this.usuarioService.update(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    });
  
    return { success: true, message: 'Contraseña actualizada' };
  }
}