import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateClubDto } from './dto/create-club.dto';
import { UpdateClubDto } from './dto/update-club.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Club } from './entities/club.entity';
import { Repository } from 'typeorm';
import { Usuario } from 'src/usuario/entities/usuario.entity';

@Injectable()
export class ClubService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    
  ){}

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
      where: { id: createClubDto.id_usuario_responsable},
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

  async findAll(): Promise<Club[]>  {
    return this.clubRepository.find({
      relations: ['responsable', 'equipos'],
      where: { estado: 'activo' },
    });
  }

  // En tu ClubService (club.service.ts)
async findAllByResponsable(responsableId: number): Promise<Club[]> {
  return this.clubRepository.find({
    relations: ['responsable', 'equipos'],
    where: {
      estado: 'activo',
      responsable: { id: responsableId }
    },
  });
}

  async findOne(id: number): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: ['responsable', 'equipos', 'transferenciasSalientes', 'transferenciasEntrantes'],
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }

    return club;
  }

  async update(id: number, updateClubDto: UpdateClubDto): Promise<Club> {
    const club = await this.findOne(id);

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
    return this.clubRepository.save(club);
  }

  async remove(id: number): Promise<Club> {
    const club = await this.findOne(id);
    club.estado = 'inactivo';
    return this.clubRepository.save(club);
  }

  async getEquiposByClub(id: number): Promise<Club> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: ['equipos'],
    });
    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }
    return club;
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

  async getDeportistasByClub(id: number): Promise<any> {
    const club = await this.clubRepository.findOne({
      where: { id },
      relations: ['equipos', 'equipos.deportistas'],
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${id} no encontrado`);
    }

    // Aplanar la lista de deportistas de todos los equipos
    const deportistas = club.equipos.flatMap(equipo => equipo.equipoDeportistas);
    
    // Eliminar duplicados (en caso de que un deportista esté en varios equipos)
    const uniqueDeportistas = [...new Map(deportistas.map(item => [item.id, item])).values()];

    return {
      club: {
        id: club.id,
        nombre: club.nombre,
      },
      deportistas: uniqueDeportistas,
    };
  }

}
