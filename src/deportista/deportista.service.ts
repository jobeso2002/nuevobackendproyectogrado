import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deportista } from './entities/deportista.entity';
import { Equipo } from '../equipo/entities/equipo.entity';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';
import { Contacto } from '../contacto/entities/contacto.entity';
import { Transferencia } from '../transferencia/entities/transferencia.entity';
import { CreateContactoDto } from '../contacto/dto/create-contacto.dto';
import { CreateTransferenciaDto } from '../transferencia/dto/create-transferencia.dto';
import { EquipoDeportista } from '../equipo/entities/equipo-deportista.entity';



@Injectable()
export class DeportistaService {
  constructor(
    @InjectRepository(Deportista)
    private readonly deportistaRepository: Repository<Deportista>,
    @InjectRepository(Contacto)
    private readonly contactoRepository: Repository<Contacto>,
    @InjectRepository(Equipo)
    private readonly equipoRepository: Repository<Equipo>,
    @InjectRepository(EquipoDeportista) // Añade esto
    private readonly equipoDeportistaRepository: Repository<EquipoDeportista>,
    @InjectRepository(Transferencia)
    private readonly transferenciaRepository: Repository<Transferencia>,
  ) {}

  async create(createDeportistaDto: CreateDeportistaDto): Promise<Deportista> {
    // Verificar si ya existe un deportista con el mismo documento
    const existingDeportista = await this.deportistaRepository.findOne({
      where: { documentoIdentidad: createDeportistaDto.documentoIdentidad},
    });

    if (existingDeportista) {
      throw new ConflictException('Ya existe un deportista con este documento de identidad');
    }

    const deportista = this.deportistaRepository.create({
      primer_nombre: createDeportistaDto.primer_nombre,
      segundo_nombre: createDeportistaDto.segundo_nombre,
      primer_apellido: createDeportistaDto.primer_apellido,
      segundo_apellido: createDeportistaDto.segundo_apellido,
      fechaNacimiento: new Date(createDeportistaDto.fechaNacimiento),
      genero: createDeportistaDto.genero,
      documentoIdentidad: createDeportistaDto.documentoIdentidad,
      tipoDocumento: createDeportistaDto.tipoDocumento,
      foto: createDeportistaDto.foto,
      telefono: createDeportistaDto.telefono,
      email: createDeportistaDto.email,
      direccion: createDeportistaDto.direccion,
    });

    return this.deportistaRepository.save(deportista);
  }

  // deportista.service.ts
  async findAll(
    equipoId?: number,
    clubId?: number,
    genero?: string,
  ): Promise<Deportista[]> {
    const queryBuilder = this.deportistaRepository
      .createQueryBuilder('deportista')
      .leftJoinAndSelect('deportista.equipoDeportistas', 'equipoDeportista') // Cambia 'equipos' por 'equipoDeportistas'
      .leftJoinAndSelect('equipoDeportista.equipo', 'equipo') // Accede al equipo a través de la relación
      .leftJoinAndSelect('equipo.club', 'club')
      .where('deportista.estado = :estado', { estado: 'activo' });
  
    if (equipoId) {
      queryBuilder.andWhere('equipo.id = :equipoId', { equipoId });
    }
  
    if (clubId) {
      queryBuilder.andWhere('club.id = :clubId', { clubId });
    }
  
    if (genero) {
      queryBuilder.andWhere('deportista.genero = :genero', { genero });
    }
  
    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Deportista> {
    const deportista = await this.deportistaRepository.findOne({
        where: { id },
        relations: [
            'equipoDeportistas', // Cambia 'equipos' por 'equipoDeportistas'
            'equipoDeportistas.equipo',
            'equipoDeportistas.equipo.club',
            'contactos', 
            'transferencias', 
            'transferencias.clubOrigen', 
            'transferencias.clubDestino', 
            'estadisticas'
        ],
    });

    if (!deportista) {
        throw new NotFoundException(`Deportista con ID ${id} no encontrado`);
    }

    return deportista;
}

  async update(id: number, updateDeportistaDto: UpdateDeportistaDto): Promise<Deportista> {
    const deportista = await this.findOne(id);

    if (updateDeportistaDto.documentoIdentidad && updateDeportistaDto.documentoIdentidad !== deportista.documentoIdentidad) {
      const existingDeportista = await this.deportistaRepository.findOne({
        where: { documentoIdentidad: updateDeportistaDto.documentoIdentidad },
      });

      if (existingDeportista) {
        throw new ConflictException('Ya existe un deportista con este documento de identidad');
      }
    }

    this.deportistaRepository.merge(deportista, {
      primer_nombre: updateDeportistaDto.primer_nombre || deportista.primer_nombre,
      segundo_nombre:updateDeportistaDto.segundo_nombre || deportista.segundo_nombre,
      primer_apellido: updateDeportistaDto.primer_apellido || deportista.primer_apellido,
      segundo_apellido: updateDeportistaDto.segundo_apellido || deportista.segundo_apellido,
      fechaNacimiento: updateDeportistaDto.fechaNacimiento ? new Date(updateDeportistaDto.fechaNacimiento) : deportista.fechaNacimiento,
      genero: updateDeportistaDto.genero || deportista.genero,
      documentoIdentidad: updateDeportistaDto.documentoIdentidad || deportista.documentoIdentidad,
      tipoDocumento: updateDeportistaDto.tipoDocumento || deportista.tipoDocumento,
      foto: updateDeportistaDto.foto || deportista.foto,
      telefono: updateDeportistaDto.telefono || deportista.telefono,
      email: updateDeportistaDto.email || deportista.email,
      direccion: updateDeportistaDto.direccion || deportista.direccion,
    });

    return this.deportistaRepository.save(deportista);
  }

  async remove(id: number): Promise<Deportista> {
    const deportista = await this.findOne(id);
    deportista.estado = 'inactivo';
    return this.deportistaRepository.save(deportista);
  }

  async addContacto(id: number, createContactoDto: CreateContactoDto): Promise<Contacto> {
    const deportista = await this.findOne(id);

    const contacto = this.contactoRepository.create({
      ...createContactoDto,
      deportista,
    });

    return this.contactoRepository.save(contacto);
  }

  async removeContacto(id: number, idContacto: number): Promise<void> {
    const contacto = await this.contactoRepository.findOne({
      where: { id: idContacto, deportista: { id } },
    });

    if (!contacto) {
      throw new NotFoundException(`Contacto con ID ${idContacto} no encontrado para este deportista`);
    }

    await this.contactoRepository.remove(contacto);
  }

  async createTransferencia(id: number, createTransferenciaDto: CreateTransferenciaDto): Promise<Transferencia> {
    const deportista = await this.findOne(id);

    const clubOrigen = await this.equipoRepository.findOne({
      where: { id: createTransferenciaDto.id_club_origen },
      relations: ['club'],
    });

    if (!clubOrigen) {
      throw new NotFoundException(`Club de origen con ID ${createTransferenciaDto.id_club_origen} no encontrado`);
    }

    const clubDestino = await this.equipoRepository.findOne({
      where: { id: createTransferenciaDto.id_club_destino },
      relations: ['club'],
    });

    if (!clubDestino) {
      throw new NotFoundException(`Club de destino con ID ${createTransferenciaDto.id_club_destino} no encontrado`);
    }

    const transferencia = this.transferenciaRepository.create({
      ...createTransferenciaDto,
      deportista,
      clubOrigen: clubOrigen.club,
      clubDestino: clubDestino.club,
      estado: 'pendiente',
    });

    return this.transferenciaRepository.save(transferencia);
  }

  async getEquipos(id: number): Promise<Equipo[]> {
    const relaciones = await this.equipoDeportistaRepository.find({
        where: { 
            deportista: { id },
            estado: 'activo' // Filtra solo las relaciones activas si es necesario
        },
        relations: ['equipo', 'equipo.club']
    });

    if (!relaciones || relaciones.length === 0) {
        return []; // Retorna array vacío si no tiene equipos
    }

    return relaciones.map(rel => rel.equipo);
}

  async getTransferencias(id: number): Promise<Transferencia[]> {
    const deportista = await this.deportistaRepository.findOne({
      where: { id },
      relations: ['transferencias', 'transferencias.clubOrigen', 'transferencias.clubDestino'],
    });

    if (!deportista) {
      throw new NotFoundException(`Deportista con ID ${id} no encontrado`);
    }

    return deportista.transferencias;
  }

  async getEstadisticas(id: number): Promise<any> {
    const deportista = await this.deportistaRepository.findOne({
      where: { id },
      relations: ['estadisticas', 'estadisticas.partido', 'estadisticas.partido.equipoLocal', 'estadisticas.partido.equipoVisitante'],
    });

    if (!deportista) {
      throw new NotFoundException(`Deportista con ID ${id} no encontrado`);
    }

    return {
      deportista: {
        id: deportista.id,
        nombreCompleto: `${deportista.primer_nombre} ${deportista.primer_apellido}`,
      },
      estadisticas: deportista.estadisticas.map(e => ({
        id: e.id,
        partido: {
          id: e.partido.id,
          fecha: e.partido.fechaHora,
          local: e.partido.equipoLocal.nombre,
          visitante: e.partido.equipoVisitante.nombre,
        },
        saques: e.saques,
        ataques: e.ataques,
        bloqueos: e.bloqueos,
        defensas: e.defensas,
        puntos: e.puntos,
        errores: e.errores,
      })),
    };
  }
}