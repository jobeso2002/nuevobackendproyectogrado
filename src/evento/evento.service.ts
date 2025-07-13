import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Inscripcion } from '../inscripcion/entities/inscripcion.entity';
import { LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Club } from '../club/entities/club.entity';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Inscripcion)
    private readonly inscripcionRepository: Repository<Inscripcion>,
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {}

  async create(createEventoDto: CreateEventoDto): Promise<Evento> {
    // Verificar si el organizador existe
    const organizador = await this.usuarioRepository.findOne({
      where: { id: createEventoDto.id_usuario_organizador },
    });

    if (!organizador) {
      throw new NotFoundException(`Usuario organizador con ID ${createEventoDto.id_usuario_organizador} no encontrado`);
    }

    // Verificar solapamiento de fechas para eventos en la misma ubicación
    const eventoExistente = await this.eventoRepository.findOne({
      where: {
        ubicacion: createEventoDto.ubicacion,
        fechaInicio: LessThanOrEqual(new Date(createEventoDto.fechaFin)),
        fechaFin: MoreThanOrEqual(new Date(createEventoDto.fechaInicio)),
      },
    });

    if (eventoExistente) {
      throw new ConflictException('Ya existe un evento en esa ubicación durante las fechas seleccionadas');
    }

    const evento = this.eventoRepository.create({
      nombre: createEventoDto.nombre,
      descripcion: createEventoDto.descripcion,
      fechaInicio: new Date(createEventoDto.fechaInicio),
      fechaFin: new Date(createEventoDto.fechaFin),
      tipo: createEventoDto.tipo,
      ubicacion: createEventoDto.ubicacion,
      organizador,
    });

    return this.eventoRepository.save(evento);
  }

  async findAll(): Promise<Evento[]> {
    return this.eventoRepository.find({
      relations: ['organizador', 'inscripciones', 'partidos'],
      order: { fechaInicio: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Evento> {
    const evento = await this.eventoRepository.findOne({
      where: { id },
      relations: ['organizador', 'inscripciones', 'inscripciones.club', 'partidos', 'partidos.clubLocal', 'partidos.clubVisitante'],
    });

    if (!evento) {
      throw new NotFoundException(`Evento con ID ${id} no encontrado`);
    }

    return evento;
  }

  async update(id: number, updateEventoDto: UpdateEventoDto): Promise<Evento> {
    const evento = await this.findOne(id);

    // Solo permitir actualización si está planificado
    if (evento.estado !== 'planificado') {
      throw new ConflictException('Solo se pueden actualizar eventos planificados');
    }

    if (updateEventoDto.id_usuario_organizador) {
      const organizador = await this.usuarioRepository.findOne({
        where: { id: updateEventoDto.id_usuario_organizador },
      });

      if (!organizador) {
        throw new NotFoundException(`Usuario organizador con ID ${updateEventoDto.id_usuario_organizador} no encontrado`);
      }
      evento.organizador = organizador;
    }

    // Verificar solapamiento de fechas si se actualizan
    if (updateEventoDto.fechaInicio || updateEventoDto.fechaFin) {
      const fechaInicio = updateEventoDto.fechaInicio ? new Date(updateEventoDto.fechaInicio) : evento.fechaInicio;
      const fechaFin = updateEventoDto.fechaFin ? new Date(updateEventoDto.fechaFin) : evento.fechaFin;

      const eventoExistente = await this.eventoRepository.findOne({
        where: {
          ubicacion: updateEventoDto.ubicacion || evento.ubicacion,
          fechaInicio: LessThanOrEqual(fechaFin),
          fechaFin: MoreThanOrEqual(fechaInicio),
          id: Not(evento.id), // Excluir el evento actual
        },
      });

      if (eventoExistente) {
        throw new ConflictException('Ya existe un evento en esa ubicación durante las fechas seleccionadas');
      }
    }

    this.eventoRepository.merge(evento, {
      nombre: updateEventoDto.nombre || evento.nombre,
      descripcion: updateEventoDto.descripcion || evento.descripcion,
      fechaInicio: updateEventoDto.fechaInicio ? new Date(updateEventoDto.fechaInicio) : evento.fechaInicio,
      fechaFin: updateEventoDto.fechaFin ? new Date(updateEventoDto.fechaFin) : evento.fechaFin,
      tipo: updateEventoDto.tipo || evento.tipo,
      ubicacion: updateEventoDto.ubicacion || evento.ubicacion,
    });

    return this.eventoRepository.save(evento);
  }

  async remove(id: number): Promise<Evento> {
    const evento = await this.findOne(id);

    // Solo permitir eliminación si está planificado
    if (evento.estado !== 'planificado') {
      throw new ConflictException('Solo se pueden cancelar eventos planificados');
    }

    evento.estado = 'cancelado';
    return this.eventoRepository.save(evento);
  }

  async inscribirClub(idEvento: number, idClub: number, idUsuarioRegistra: number): Promise<Inscripcion> {
    const evento = await this.findOne(idEvento);
    const club = await this.clubRepository.findOne({
      where: { id: idClub },
    });
    const usuario = await this.usuarioRepository.findOne({
      where: { id: idUsuarioRegistra },
    });

    if (!club) {
      throw new NotFoundException(`Club con ID ${idClub} no encontrado`);
    }

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${idUsuarioRegistra} no encontrado`);
    }

    // Verificar si el club ya está inscrito
    const inscripcionExistente = await this.inscripcionRepository.findOne({
      where: {
        evento: { id: idEvento },
        club: { id: idClub },
      },
    });

    if (inscripcionExistente) {
      throw new ConflictException('El club ya está inscrito en este evento');
    }

    const inscripcion = this.inscripcionRepository.create({
      evento,
      club,
      usuarioRegistra: usuario,
      estado: 'pendiente',
    });

    return this.inscripcionRepository.save(inscripcion);
  }

  async aprobarInscripcion(idInscripcion: number, idUsuarioAprueba: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id: idInscripcion },
      relations: ['evento', 'club', 'usuarioRegistra'],
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${idInscripcion} no encontrada`);
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id: idUsuarioAprueba },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${idUsuarioAprueba} no encontrado`);
    }

    if (inscripcion.estado !== 'pendiente') {
      throw new ConflictException('Solo se pueden aprobar inscripciones pendientes');
    }

    inscripcion.estado = 'aprobada';
    inscripcion.usuarioAprueba = usuario;
    inscripcion.fechaAprobacion = new Date();

    return this.inscripcionRepository.save(inscripcion);
  }

  async rechazarInscripcion(idInscripcion: number, idUsuarioRechaza: number): Promise<Inscripcion> {
    const inscripcion = await this.inscripcionRepository.findOne({
      where: { id: idInscripcion },
      relations: ['evento', 'equipo', 'usuarioRegistra'],
    });

    if (!inscripcion) {
      throw new NotFoundException(`Inscripción con ID ${idInscripcion} no encontrada`);
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { id: idUsuarioRechaza },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${idUsuarioRechaza} no encontrado`);
    }

    if (inscripcion.estado !== 'pendiente') {
      throw new ConflictException('Solo se pueden rechazar inscripciones pendientes');
    }

    inscripcion.estado = 'rechazada';
    inscripcion.usuarioRechaza = usuario;
    inscripcion.fechaRechazo = new Date();

    return this.inscripcionRepository.save(inscripcion);
  }

  async cambiarEstadoEvento(id: number, nuevoEstado: string, idUsuario: number): Promise<Evento> {
    const evento = await this.findOne(id);
    const usuario = await this.usuarioRepository.findOne({
      where: { id: idUsuario },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${idUsuario} no encontrado`);
    }

    // Validar transiciones de estado permitidas
    const transicionesPermitidas = {
      planificado: ['en_curso', 'cancelado'],
      en_curso: ['finalizado', 'cancelado'],
    };

    if (!transicionesPermitidas[evento.estado]?.includes(nuevoEstado)) {
      throw new ConflictException(`Transición de estado no permitida: de ${evento.estado} a ${nuevoEstado}`);
    }

    evento.estado = nuevoEstado;

    // Registrar quién realizó el cambio
    if (nuevoEstado === 'en_curso') {
      evento.fechaInicioReal = new Date();
    } else if (nuevoEstado === 'finalizado') {
      evento.fechaFinReal = new Date();
    }

    return this.eventoRepository.save(evento);
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

  async getEventosActivos(): Promise<Evento[]> {
    return this.eventoRepository.find({
      where: { estado: 'en_curso' },
      relations: ['organizador'],
    });
  }

  async getEventosPorTipo(tipo: string): Promise<Evento[]> {
    return this.eventoRepository.find({
      where: { tipo },
      order: { fechaInicio: 'DESC' },
    });
  }

  async getProximosEventos(): Promise<Evento[]> {
    return this.eventoRepository.find({
      where: {
        estado: 'planificado',
        fechaInicio: MoreThanOrEqual(new Date()),
      },
      order: { fechaInicio: 'ASC' },
      take: 5,
    });
  }
}
