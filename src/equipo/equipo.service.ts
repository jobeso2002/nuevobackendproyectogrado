import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEquipoDto } from './dto/create-equipo.dto';
import { UpdateEquipoDto } from './dto/update-equipo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity';
import { Club } from '../club/entities/club.entity';
import { Deportista } from '../deportista/entities/deportista.entity';
import { Repository } from 'typeorm';
import { AddDeportistaDto } from './dto/add-deportista.dto';
import { EquipoDeportista } from './entities/equipo-deportista.entity';

@Injectable()
export class EquipoService {
  constructor(
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(EquipoDeportista)
    private readonly equipoDeportistaRepository: Repository<EquipoDeportista>,
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(Deportista)
    private readonly deportistaRepository: Repository<Deportista>,
  ) {}

  async create(createEquipoDto: CreateEquipoDto): Promise<Equipo> {
    // Verificar si ya existe un equipo con el mismo nombre en el mismo club
    const existingEquipo = await this.equipoRepository.findOne({
      where: {
        nombre: createEquipoDto.nombre,
        club: { id: createEquipoDto.id_club },
      },
    });

    if (existingEquipo) {
      throw new ConflictException(
        'Ya existe un equipo con este nombre en el club',
      );
    }

    // Verificar si el club existe
    const club = await this.clubRepository.findOne({
      where: { id: createEquipoDto.id_club },
    });

    if (!club) {
      throw new NotFoundException(
        `Club con ID ${createEquipoDto.id_club} no encontrado`,
      );
    }

    const equipo = this.equipoRepository.create({
      ...createEquipoDto,
      club,
    });

    return this.equipoRepository.save(equipo);
  }

  // equipo.service.ts
  async findAll(filters?: any): Promise<Equipo[]> {
    return this.equipoRepository.find({
      where: {
        estado: 'activo',
        ...filters,
      },
      relations: ['club', 'equipoDeportistas', 'equipoDeportistas.deportista'],
    });
  }

  async findOne(id: number): Promise<Equipo> {
    const equipo = await this.equipoRepository.findOne({
      where: { id },
      relations: [
        'club',
        'equipoDeportistas',
        'equipoDeportistas.deportista',
        'partidosLocal',
        'partidosVisitante',
        'inscripciones',
      ],
    });

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    return equipo;
  }

  async update(id: number, updateEquipoDto: UpdateEquipoDto): Promise<Equipo> {
    const equipo = await this.findOne(id);

    if (updateEquipoDto.nombre && updateEquipoDto.nombre !== equipo.nombre) {
      const existingEquipo = await this.equipoRepository.findOne({
        where: {
          nombre: updateEquipoDto.nombre,
          club: { id: equipo.club.id },
        },
      });

      if (existingEquipo) {
        throw new ConflictException(
          'Ya existe un equipo con este nombre en el club',
        );
      }
    }

    if (updateEquipoDto.id_club && updateEquipoDto.id_club !== equipo.club.id) {
      const club = await this.clubRepository.findOne({
        where: { id: updateEquipoDto.id_club },
      });

      if (!club) {
        throw new NotFoundException(
          `Club con ID ${updateEquipoDto.id_club} no encontrado`,
        );
      }
      equipo.club = club;
    }

    this.equipoRepository.merge(equipo, updateEquipoDto);
    return this.equipoRepository.save(equipo);
  }

  async remove(id: number): Promise<Equipo> {
    const equipo = await this.findOne(id);
    equipo.estado = 'inactivo';
    return this.equipoRepository.save(equipo);
  }

  async addDeportista(
    id: number,
    addDeportistaDto: AddDeportistaDto,
  ): Promise<EquipoDeportista> {
    const equipo = await this.equipoRepository.findOneBy({ id });
    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    const deportista = await this.deportistaRepository.findOneBy({
      id: addDeportistaDto.id_deportista,
    });
    if (!deportista) {
      throw new NotFoundException(
        `Deportista con ID ${addDeportistaDto.id_deportista} no encontrado`,
      );
    }

    // Verificar si ya existe la relación
    const existeRelacion = await this.equipoDeportistaRepository.findOne({
      where: {
        equipo: { id },
        deportista: { id: addDeportistaDto.id_deportista },
      },
    });

    if (existeRelacion) {
      throw new ConflictException('El deportista ya está en este equipo');
    }

    const nuevaRelacion = this.equipoDeportistaRepository.create({
      equipo: { id },
      deportista: { id: addDeportistaDto.id_deportista },
      fechaIngreso: new Date(addDeportistaDto.fecha_ingreso || new Date()),
      estado: 'activo',
    });

    return this.equipoDeportistaRepository.save(nuevaRelacion);
  }

  async removeDeportista(id: number, idDeportista: number): Promise<void> {
    const relacion = await this.equipoDeportistaRepository.findOne({
      where: {
        equipo: { id },
        deportista: { id: idDeportista },
      },
    });

    if (!relacion) {
      throw new NotFoundException('El deportista no está en este equipo');
    }

    await this.equipoDeportistaRepository.remove(relacion);
  }

  async getDeportistas(id: number): Promise<Deportista[]> {
    const relaciones = await this.equipoDeportistaRepository.find({
      where: { equipo: { id }, estado: 'activo' },
      relations: ['deportista'],
    });

    return relaciones.map((rel) => rel.deportista);
  }

  async getPartidos(id: number): Promise<any> {
    const equipo = await this.equipoRepository.findOne({
      where: { id },
      relations: [
        'partidosLocal',
        'partidosVisitante',
        'partidosLocal.evento',
        'partidosVisitante.evento',
      ],
    });

    if (!equipo) {
      throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
    }

    // Combinar partidos como local y visitante
    const partidos = [...equipo.partidosLocal, ...equipo.partidosVisitante];

    // Ordenar por fecha
    partidos.sort((a, b) => a.fechaHora.getTime() - b.fechaHora.getTime());

    return {
      equipo: {
        id: equipo.id,
        nombre: equipo.nombre,
      },
      partidos: partidos.map((p) => ({
        id: p.id,
        fechaHora: p.fechaHora,
        evento: p.evento?.nombre,
        esLocal: p.equipoLocal.id === id,
        rival:
          p.equipoLocal.id === id
            ? p.equipoVisitante.nombre
            : p.equipoLocal.nombre,
        estado: p.estado,
      })),
    };
  }
}
