import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from './entities/club.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import { ClubResponseDto } from './dto/club-respon.dto';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createClubDto: CreateClubDto): Promise<Club> {
    // Verificar si ya existe un club con el mismo nombre
    const existingClub = await this.clubRepository.findOne({
      where: { nombre: createClubDto.nombre },
    });

    if (existingClub) {
      throw new ConflictException('Ya existe un club con este nombre');
    }

    // Verificar si el usuario responsable existe
    const responsable = await this.usuarioRepository.findOne({
      where: { id: createClubDto.id_usuario_responsable },
    });

    if (!responsable) {
      throw new NotFoundException(
        `Usuario responsable con ID ${createClubDto.id_usuario_responsable} no encontrado`,
      );
    }

    const club = this.clubRepository.create({
      ...createClubDto,
      responsable,
    });

    return this.clubRepository.save(club);
  }

  async findAll(): Promise<ClubResponseDto[]> {
    const clubs = await this.clubRepository.find({
      relations: ['responsable'],
      where: { estado: 'activo' },
    });

    return clubs.map((club) => this.mapClubToResponseDto(club));
  }

  // En tu ClubService (club.service.ts)
  async findAllByResponsable(
    responsableId: number,
  ): Promise<ClubResponseDto[]> {
    const clubs = await this.clubRepository.find({
      relations: ['responsable', 'equipos'],
      where: {
        estado: 'activo',
        responsable: { id: responsableId },
      },
    });

    return clubs.map((club) => this.mapClubToResponseDto(club));
  }

  async findOne(id: number): Promise<ClubResponseDto> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: ['responsable'],
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }

    return this.mapClubToResponseDto(club);
  }

  private mapClubToResponseDto(club: Club): ClubResponseDto {
    return {
      id: club.id,
      nombre: club.nombre,
      fundacion: club.fundacion,
      rama:club.rama,
      categoria:club.categoria,
      direccion: club.direccion,
      telefono: club.telefono,
      email: club.email,
      logo: club.logo,

      estado: club.estado,
      responsable: {
        id: club.responsable.id,
        username: club.responsable.username,
        email: club.responsable.email,
      },
    };
  }

  private async findEntity(id: number): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: ['responsable'],
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }
    return club;
  }

  async update(
    id: number,
    updateClubDto: UpdateClubDto,
  ): Promise<ClubResponseDto> {
    const club = await this.findEntity(id);

    if (updateClubDto.nombre && updateClubDto.nombre !== club.nombre) {
      const existingClub = await this.clubRepository.findOne({
        where: { nombre: updateClubDto.nombre },
      });

      if (existingClub && existingClub.id !== id) {
        throw new ConflictException('Ya existe un club con este nombre');
      }
    }

    if (updateClubDto.id_usuario_responsable) {
      const responsable = await this.usuarioRepository.findOne({
        where: { id: updateClubDto.id_usuario_responsable },
      });

      if (!responsable) {
        throw new NotFoundException(
          `Usuario responsable con ID ${updateClubDto.id_usuario_responsable} no encontrado`,
        );
      }
      club.responsable = responsable;
    }

    this.clubRepository.merge(club, updateClubDto);
    return this.mapClubToResponseDto(await this.clubRepository.save(club));
  }

  async remove(id: number): Promise<ClubResponseDto> {
    const club = await this.findEntity(id);
    club.estado = 'inactivo';
    return this.mapClubToResponseDto(await this.clubRepository.save(club));
  }


  async getTransferenciasByClub(id: number): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: ['transferenciasSalientes', 'transferenciasEntrantes'],
    });
    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }
    return club;
  }

  // Modificar el método getDeportistasByClub
  async getDeportistasByClub(id: number): Promise<any> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: ['clubDeportistas', 'clubDeportistas.deportista'],
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }

    const deportistas = club.clubDeportistas.map((rel) => rel.deportista);

    return {
      club: {
        id: club.id,
        nombre: club.nombre,
      },
      deportistas: deportistas,
    };
  }
}
