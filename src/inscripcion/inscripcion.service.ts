import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { UpdateInscripcionDto } from './dto/update-inscripcion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Inscripcion } from './entities/inscripcion.entity';
import { Evento } from '../evento/entities/evento.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Repository } from 'typeorm';
import { Club } from '../club/entities/club.entity';

@Injectable()
export class InscripcionService {
  constructor(
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
    @InjectRepository(Club) 
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createInscripcionDto: CreateInscripcionDto): Promise<Inscripcion> {
    const evento = await this.eventoRepository.findOne({
      where: { id: createInscripcionDto.id_evento },
    });

    if (!evento) {
      throw new NotFoundException(`Evento con ID ${createInscripcionDto.id_evento} no encontrado`);
    }

    const club = await this.clubRepository.findOne({
      where: { id: createInscripcionDto.id_club },
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${createInscripcionDto.id_club} no encontrado`);
    }

    const usuarioRegistra = await this.usuarioRepository.findOne({
      where: { id: createInscripcionDto.id_usuario_registra },
    });

    if (!usuarioRegistra) {
      throw new NotFoundException(`Usuario con ID ${createInscripcionDto.id_usuario_registra} no encontrado`);
    }

    const inscripcionExistente = await this.inscripcionRepository.findOne({
      where: {
        evento: { id: createInscripcionDto.id_evento },
        club: { id: createInscripcionDto.id_club },
      },
    });

    if (inscripcionExistente) {
      throw new ConflictException('El club ya está inscrito en este evento');
    }

    if (evento.estado !== 'planificado') {
      throw new ForbiddenException('Solo se pueden inscribir clubs en eventos planificados');
    }

    const inscripcion = this.inscripcionRepository.create({
      evento,
      club,
      usuarioRegistra,
      estado: 'pendiente',
    });

    return this.inscripcionRepository.save(inscripcion);
  }

  async findAll(): Promise<Inscripcion[]> {
    return this.inscripcionRepository.find({
      relations: ['evento', 'club', 'usuarioRegistra', 'usuarioAprueba'],
      order: { fechaInscripcion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id },
      relations: ['evento', 'club', 'usuarioRegistra', 'usuarioAprueba', 'usuarioRechaza'],
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    return inscripcion;
  }

  async update(id: number, updateInscripcionDto: UpdateInscripcionDto): Promise<Inscripcion> {
    const inscripcion = await this.findOne(id);

    // Solo permitir actualización si está pendiente
    if (inscripcion.estado !== 'pendiente') {
      throw new ForbiddenException('Solo se pueden actualizar inscripciones pendientes');
    }

    // Verificar si se está cambiando el equipo
    if (updateInscripcionDto.id_club && updateInscripcionDto.id_club !== inscripcion.club.id) {
      const equipo = await this.clubRepository.findOne({
        where: { id: updateInscripcionDto.id_club },
      });

      if (!equipo) {
        throw new NotFoundException(`Equipo con ID ${updateInscripcionDto.id_club} no encontrado`);
      }

      // Verificar que el nuevo equipo no está ya inscrito
      const inscripcionExistente = await this.inscripcionRepository.findOne({
        where: {
          evento: { id: inscripcion.evento.id },
          club: { id: updateInscripcionDto.id_club },
        },
      });

      if (inscripcionExistente) {
        throw new ConflictException('El equipo ya está inscrito en este evento');
      }

      inscripcion.club = equipo;
    }

    return this.inscripcionRepository.save(inscripcion);
  }

  async remove(id: number): Promise<void> {
    const inscripcion = await this.findOne(id);
    
    // Solo permitir eliminación si está pendiente
    if (inscripcion.estado !== 'pendiente') {
      throw new ForbiddenException('Solo se pueden eliminar inscripciones pendientes');
    }

    await this.inscripcionRepository.remove(inscripcion);
  }

  async aprobarInscripcion(id: number, idUsuarioAprueba: number): Promise<Inscripcion> {
    const inscripcion = await this.findOne(id);
    const usuarioAprueba = await this.usuarioRepository.findOne({
      where: { id: idUsuarioAprueba },
    });

    if (!usuarioAprueba) {
      throw new NotFoundException(`Usuario con ID ${idUsuarioAprueba} no encontrado`);
    }

    if (inscripcion.estado !== 'pendiente') {
      throw new ForbiddenException('Solo se pueden aprobar inscripciones pendientes');
    }

    inscripcion.estado = 'aprobada';
    inscripcion.usuarioAprueba = usuarioAprueba;
    inscripcion.fechaAprobacion = new Date();

    return this.inscripcionRepository.save(inscripcion);
  }

  async rechazarInscripcion(id: number, idUsuarioRechaza: number): Promise<Inscripcion> {
    const inscripcion = await this.findOne(id);
    const usuarioRechaza = await this.usuarioRepository.findOne({
      where: { id: idUsuarioRechaza },
    });

    if (!usuarioRechaza) {
      throw new NotFoundException(`Usuario con ID ${idUsuarioRechaza} no encontrado`);
    }

    if (inscripcion.estado !== 'pendiente') {
      throw new ForbiddenException('Solo se pueden rechazar inscripciones pendientes');
    }

    inscripcion.estado = 'rechazada';
    inscripcion.usuarioRechaza = usuarioRechaza;
    inscripcion.fechaRechazo = new Date();

    return this.inscripcionRepository.save(inscripcion);
  }

  async getInscripcionesByEvento(idEvento: number, estado?: string): Promise<Inscripcion[]> {
    const eventoExists = await this.eventoRepository.exist({ where: { id: idEvento } });
    if (!eventoExists) {
      throw new NotFoundException(`Evento con ID ${idEvento} no encontrado`);
    }

    const where: any = { evento: { id: idEvento } };
    if (estado) where.estado = estado;

    return this.inscripcionRepository.find({
      where,
      relations: ['club', 'usuarioRegistra', 'usuarioAprueba'],
    });
  }

  async getInscripcionesByClub(idClub: number): Promise<Inscripcion[]> {
    const clubExists = await this.clubRepository.exist({ where: { id: idClub } });
    if (!clubExists) {
      throw new NotFoundException(`Club con ID ${idClub} no encontrado`);
    }

    return this.inscripcionRepository.find({
      where: { club: { id: idClub } },
      relations: ['evento', 'usuarioRegistra'],
      order: { fechaInscripcion: 'DESC' },
    });
  }

  async getInscripcionesAprobadasByEvento(idEvento: number): Promise<Inscripcion[]> {
    return this.getInscripcionesByEvento(idEvento, 'aprobada');
  }
}
