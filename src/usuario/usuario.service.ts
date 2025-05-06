import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    // Verificar si el email o username ya existen
    const existingUser = await this.usuarioRepository.findOne({
      where: [
        { email: createUsuarioDto.email },
        { username: createUsuarioDto.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException(
        'El email o nombre de usuario ya está en uso',
      );
    }

    // Hashear la contraseña
    const hashedPassword = await this.hashPassword(createUsuarioDto.password);

    // Verificar si el rol existe
    const role = await this.roleRepository.findOne({
      where: { id: createUsuarioDto.id_rol },
      relations:['permiso'] //cargar permisos del rol
    });

    if (!role) {
      throw new NotFoundException(
        `Rol con ID ${createUsuarioDto.id_rol} no encontrado`,
      );
    }

    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      password: hashedPassword,
      role, //Asignar el rol con relaciones cargadas
    });

    return await this.usuarioRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: ['role', 'role.permiso'],
      select: ['id', 'username', 'email', 'role'],
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['role', 'role.permiso'],
      select: ['id', 'username', 'email', 'role'],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async findOneByEmail(email: string): Promise<Usuario | undefined> {
    const usuario = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['role', 'role.permiso'],
      select: ['id', 'email', 'username', 'password', 'role'] // Añadir password al select
    });
    return usuario || undefined;
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar si el nuevo email o username ya existen
    if (updateUsuarioDto.email || updateUsuarioDto.username) {
      const existingUser = await this.usuarioRepository.findOne({
        where: [
          { email: updateUsuarioDto.email },
          { username: updateUsuarioDto.username },
        ],
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException(
          'El email o nombre de usuario ya está en uso',
        );
      }
    }

    // Actualizar contraseña si se proporciona
    if (updateUsuarioDto.password) {
      updateUsuarioDto.password = await this.hashPassword(
        updateUsuarioDto.password,
      );
    }

    // Actualizar rol si se proporciona
    if (updateUsuarioDto.id_rol) {
      const role = await this.roleRepository.findOne({
        where: { id: updateUsuarioDto.id_rol },
      });
      if (!role) {
        throw new NotFoundException(
          `Rol con ID ${updateUsuarioDto.id_rol} no encontrado`,
        );
      }
      usuario.role = role;
    }

    Object.assign(usuario, updateUsuarioDto);

    return await this.usuarioRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: [
        'clubesResponsables',
        'eventosOrganizados',
        'partidosArbitroPrincipal',
        'partidosArbitroSecundario',
        'transferenciasRegistradas',
        'inscripcionesRegistradas',
        'inscripcionesAprobadas',
        'inscripcionesRechazadas',
        'resultadosRegistrados',
        'transferenciasAprobadas',
        'transferenciasRechazadas',
      ],
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    // Verificar relaciones antes de eliminar
    const hasRelations =
      usuario.clubesResponsables?.length > 0 ||
      usuario.eventosOrganizados?.length > 0 ||
      usuario.partidosArbitroPrincipal?.length > 0 ||
      usuario.partidosArbitroSecundario?.length > 0 ||
      usuario.transferenciasRegistradas?.length > 0 ||
      usuario.inscripcionesRegistradas?.length > 0 ||
      usuario.inscripcionesAprobadas?.length > 0 ||
      usuario.inscripcionesRechazadas?.length > 0 ||
      usuario.resultadosRegistrados?.length > 0 ||
      usuario.transferenciasAprobadas?.length > 0 ||
      usuario.transferenciasRechazadas?.length > 0;

    if (hasRelations) {
      throw new BadRequestException(
        'No se puede eliminar el usuario porque tiene relaciones activas',
      );
    }

    await this.usuarioRepository.remove(usuario);
  }

  async changePassword(id: number, newPassword: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    usuario.password = await this.hashPassword(newPassword);
    return await this.usuarioRepository.save(usuario);
  }

  async findByRole(roleId: number): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      where: { role: { id: roleId } },
      relations: ['role'],
      select: ['id', 'username', 'email'],
    });
  }

  async validateUser(email: string, password: string): Promise<Usuario | null> {
    const user = await this.usuarioRepository.findOne({
      where: { email },
      relations: ['role', 'role.permiso'],
      select: ['id', 'username', 'email', 'password', 'role'],
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user; // Remover password del resultado
      return result as Usuario;
    }
    return null;
  }
}
