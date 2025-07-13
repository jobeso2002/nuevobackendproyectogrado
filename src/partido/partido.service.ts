import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePartidoDto } from './dto/create-partido.dto';
import { UpdatePartidoDto } from './dto/update-partido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Partido } from './entities/partido.entity';
import { Evento } from '../evento/entities/evento.entity';
import { Between, Not, Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Resultado } from '../resultado/entities/resultado.entity';
import { CreateResultadoDto } from 'src/resultado/dto/create-resultado.dto';
import { Club } from '../club/entities/club.entity';

@Injectable()
export class PartidoService {
  constructor(
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
    @InjectRepository(Evento)
    private readonly eventoRepository: Repository<Evento>,
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Resultado)
    private readonly resultadoRepository: Repository<Resultado>,
  ) {}

  async create(createPartidoDto: CreatePartidoDto): Promise<Partido> {
    // Validar que el evento existe
    const evento = await this.eventoRepository.findOne({
      where: { id: createPartidoDto.id_evento },
    });

    if (!evento) {
      throw new NotFoundException(
        `Evento con ID ${createPartidoDto.id_evento} no encontrado`,
      );
    }

    // Validar que los clubs existen
    const clubLocal = await this.clubRepository.findOne({
      where: { id: createPartidoDto.id_club_local },
    });

    if (!clubLocal) {
      throw new NotFoundException(
        `Club local con ID ${createPartidoDto.id_club_local} no encontrado`,
      );
    }

    const clubVisitante = await this.clubRepository.findOne({
      where: { id: createPartidoDto.id_club_visitante },
    });

    if (!clubVisitante) {
      throw new NotFoundException(
        `Club visitante con ID ${createPartidoDto.id_club_visitante} no encontrado`,
      );
    }

    // Validar que no son el mismo club
    if (clubLocal.id === clubVisitante.id) {
      throw new ConflictException(
        'El club local y visitante no pueden ser el mismo',
      );
    }

    // Validar que los clubs están inscritos en el evento
    const inscripcionLocal = await this.clubRepository
      .createQueryBuilder('club')
      .innerJoin('club.inscripciones', 'inscripcion')
      .where('club.id = :idClub', { idClub: createPartidoDto.id_club_local })
      .andWhere('inscripcion.eventoId = :idEvento', {
        idEvento: createPartidoDto.id_evento,
      })
      .andWhere('inscripcion.estado = :estado', { estado: 'aprobada' })
      .getOne();

    if (!inscripcionLocal) {
      throw new ConflictException(
        'El club local no está inscrito en este evento',
      );
    }

    const inscripcionVisitante = await this.clubRepository
      .createQueryBuilder('club')
      .innerJoin('club.inscripciones', 'inscripcion')
      .where('club.id = :idClub', {
        idClub: createPartidoDto.id_club_visitante,
      })
      .andWhere('inscripcion.eventoId = :idEvento', {
        idEvento: createPartidoDto.id_evento,
      })
      .andWhere('inscripcion.estado = :estado', { estado: 'aprobada' })
      .getOne();

    if (!inscripcionVisitante) {
      throw new ConflictException(
        'El club visitante no está inscrito en este evento',
      );
    }

    // Validar que los árbitros existen si se proporcionan
    let arbitroPrincipal: Usuario | null = null;
    if (createPartidoDto.id_arbitro_principal) {
      arbitroPrincipal = await this.usuarioRepository.findOne({
        where: { id: createPartidoDto.id_arbitro_principal },
      });

      if (!arbitroPrincipal) {
        throw new NotFoundException(
          `Árbitro principal con ID ${createPartidoDto.id_arbitro_principal} no encontrado`,
        );
      }
    }

    let arbitroSecundario: Usuario | null = null;
    if (createPartidoDto.id_arbitro_secundario) {
      arbitroSecundario = await this.usuarioRepository.findOne({
        where: { id: createPartidoDto.id_arbitro_secundario },
      });

      if (!arbitroSecundario) {
        throw new NotFoundException(
          `Árbitro secundario con ID ${createPartidoDto.id_arbitro_secundario} no encontrado`,
        );
      }
    }

    // Validar que no hay otro partido en la misma ubicación y horario
    const partidoExistente = await this.partidoRepository.findOne({
      where: {
        ubicacion: createPartidoDto.ubicacion,
        fechaHora: Between(
          new Date(
            new Date(createPartidoDto.fechaHora).getTime() - 2 * 60 * 60 * 1000,
          ), // 2 horas antes
          new Date(
            new Date(createPartidoDto.fechaHora).getTime() + 2 * 60 * 60 * 1000,
          ), // 2 horas después
        ),
      },
    });

    if (partidoExistente) {
      throw new ConflictException(
        'Ya existe un partido programado en esa ubicación y horario',
      );
    }

    const partido = this.partidoRepository.create({
      fechaHora: new Date(createPartidoDto.fechaHora),
      ubicacion: createPartidoDto.ubicacion,
      estado: 'programado',
      evento: evento,
      clubLocal: clubLocal,
      clubVisitante: clubVisitante,
      arbitroPrincipal: arbitroPrincipal,
      arbitroSecundario: arbitroSecundario,
    } as Partido);

    return this.partidoRepository.save(partido);
  }

  async findAll(): Promise<Partido[]> {
    return this.partidoRepository.find({
      relations: [
        'evento',
        'clubLocal',
        'clubVisitante',
        'arbitroPrincipal',
        'arbitroSecundario',
        'resultado',
      ],
      order: { fechaHora: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Partido> {
    const partido = await this.partidoRepository.findOne({
      where: { id },
      relations: [
        'evento',
        'clubLocal',
        'clubVisitante',
        'arbitroPrincipal',
        'arbitroSecundario',
        'resultado',
        'estadisticas',
        'estadisticas.deportista',
      ],
    });
  
    if (!partido) {
      throw new NotFoundException(`Partido con ID ${id} no encontrado`);
    }
  
    return partido;
  }

  async update(
    id: number,
    updatePartidoDto: UpdatePartidoDto,
  ): Promise<Partido> {
    const partido = await this.findOne(id);

    // Solo permitir actualización si está programado
    if (partido.estado !== 'programado') {
      throw new ConflictException(
        'Solo se pueden actualizar partidos programados',
      );
    }

    // Validar clubs si se actualizan
    if (updatePartidoDto.id_club_local || updatePartidoDto.id_club_visitante) {
      const idClubLocal =
        updatePartidoDto.id_club_local || partido.clubLocal.id;
      const idClubVisitante =
        updatePartidoDto.id_club_visitante || partido.clubVisitante.id;

      // Validar que no son el mismo club
      if (idClubLocal === idClubVisitante) {
        throw new ConflictException(
          'El club local y visitante no pueden ser el mismo',
        );
      }

      // Validar que los clubs están inscritos en el evento
      const eventoId = partido.evento.id;

      if (updatePartidoDto.id_club_local) {
        const clubLocal = await this.clubRepository.findOne({
          where: { id: updatePartidoDto.id_club_local },
        });

        if (!clubLocal) {
          throw new NotFoundException(
            `Club local con ID ${updatePartidoDto.id_club_local} no encontrado`,
          );
        }

        const inscripcionLocal = await this.clubRepository
          .createQueryBuilder('club')
          .innerJoin('club.inscripciones', 'inscripcion')
          .where('club.id = :idClub', {
            idClub: updatePartidoDto.id_club_local,
          }) // Corregido de idEquipo a idClub
          .andWhere('inscripcion.eventoId = :idEvento', { idEvento: eventoId })
          .andWhere('inscripcion.estado = :estado', { estado: 'aprobada' })
          .getOne();

        if (!inscripcionLocal) {
          throw new ConflictException(
            'El club local no está inscrito en este evento',
          );
        }

        partido.clubLocal = clubLocal;
      }

      if (updatePartidoDto.id_club_visitante) {
        const clubVisitante = await this.clubRepository.findOne({
          where: { id: updatePartidoDto.id_club_visitante },
        });

        if (!clubVisitante) {
          throw new NotFoundException(
            `Club visitante con ID ${updatePartidoDto.id_club_visitante} no encontrado`,
          );
        }

        const inscripcionVisitante = await this.clubRepository
          .createQueryBuilder('club')
          .innerJoin('club.inscripciones', 'inscripcion')
          .where('club.id = :idClub', {
            idClub: updatePartidoDto.id_club_visitante,
          }) // Corregido de idEquipo a idClub
          .andWhere('inscripcion.eventoId = :idEvento', { idEvento: eventoId })
          .andWhere('inscripcion.estado = :estado', { estado: 'aprobada' })
          .getOne();

        if (!inscripcionVisitante) {
          throw new ConflictException(
            'El club visitante no está inscrito en este evento',
          );
        }

        partido.clubVisitante = clubVisitante;
      }
    }

    // Validar árbitros si se actualizan
    if (updatePartidoDto.id_arbitro_principal) {
      const arbitroPrincipal = await this.usuarioRepository.findOne({
        where: { id: updatePartidoDto.id_arbitro_principal },
      });

      if (!arbitroPrincipal) {
        throw new NotFoundException(
          `Árbitro principal con ID ${updatePartidoDto.id_arbitro_principal} no encontrado`,
        );
      }

      partido.arbitroPrincipal = arbitroPrincipal;
    }

    if (updatePartidoDto.id_arbitro_secundario) {
      const arbitroSecundario = await this.usuarioRepository.findOne({
        where: { id: updatePartidoDto.id_arbitro_secundario },
      });

      if (!arbitroSecundario) {
        throw new NotFoundException(
          `Árbitro secundario con ID ${updatePartidoDto.id_arbitro_secundario} no encontrado`,
        );
      }

      partido.arbitroSecundario = arbitroSecundario;
    }

    // Validar fecha/hora y ubicación si se actualizan
    if (updatePartidoDto.fechaHora || updatePartidoDto.ubicacion) {
      const fechaHora = updatePartidoDto.fechaHora
        ? new Date(updatePartidoDto.fechaHora)
        : partido.fechaHora;
      const ubicacion = updatePartidoDto.ubicacion || partido.ubicacion;

      // Validar que no hay otro partido en la misma ubicación y horario
      const partidoExistente = await this.partidoRepository.findOne({
        where: {
          ubicacion,
          fechaHora: Between(
            new Date(fechaHora.getTime() - 2 * 60 * 60 * 1000), // 2 horas antes
            new Date(fechaHora.getTime() + 2 * 60 * 60 * 1000), // 2 horas después
          ),
          id: Not(partido.id), // Excluir el partido actual
        },
      });

      if (partidoExistente) {
        throw new ConflictException(
          'Ya existe un partido programado en esa ubicación y horario',
        );
      }

      partido.fechaHora = fechaHora;
      partido.ubicacion = ubicacion;
    }

    return this.partidoRepository.save(partido);
  }

  async cambiarEstado(id: number, nuevoEstado: string, motivo?: string): Promise<Partido> {
    const partido = await this.findOne(id);
    
    if (nuevoEstado === 'cancelado' && !motivo) {
      throw new BadRequestException('Se requiere un motivo para cancelar');
    }
  
    partido.estado = nuevoEstado;
    if (nuevoEstado === 'cancelado') {
      partido.motivoCancelacion = motivo;
    }
    
    return this.partidoRepository.save(partido);
  }

  async registrarResultado(
    idPartido: number,
    createResultadoDto: CreateResultadoDto,
    idUsuarioRegistra: number,
  ): Promise<Resultado> {
    const partido = await this.findOne(idPartido);
    const usuario = await this.usuarioRepository.findOne({
      where: { id: idUsuarioRegistra },
    });

    if (!usuario) {
      throw new NotFoundException(
        `Usuario con ID ${idUsuarioRegistra} no encontrado`,
      );
    }

    // Validar que el partido está finalizado
    if (partido.estado !== 'finalizado') {
      throw new ConflictException(
        'Solo se pueden registrar resultados para partidos finalizados',
      );
    }

    // Validar que no existe ya un resultado para este partido
    if (partido.resultado) {
      throw new ConflictException(
        'Este partido ya tiene un resultado registrado',
      );
    }

    // Validar que los sets son consistentes
    if (
      createResultadoDto.setsLocal < 0 ||
      createResultadoDto.setsVisitante < 0
    ) {
      throw new BadRequestException('Los sets no pueden ser negativos');
    }

    const resultado = this.resultadoRepository.create({
      ...createResultadoDto,
      partido,
      usuarioRegistra: usuario,
    });

    return this.resultadoRepository.save(resultado);
  }

  async getPartidosByEvento(idEvento: number): Promise<Partido[]> {
    const eventoExists = await this.eventoRepository.exist({
      where: { id: idEvento },
    });
    if (!eventoExists) {
      throw new NotFoundException(`Evento con ID ${idEvento} no encontrado`);
    }

    return this.partidoRepository.find({
      where: { evento: { id: idEvento } },
      relations: ['clubLocal', 'clubVisitante', 'resultado'],
      order: { fechaHora: 'ASC' },
    });
  }

  async getPartidosByClub(idClub: number): Promise<Partido[]> {
    const clubExists = await this.clubRepository.exist({
      where: { id: idClub },
    });
    if (!clubExists) {
      throw new NotFoundException(`Club con ID ${idClub} no encontrado`);
    }

    return this.partidoRepository.find({
      where: [{ clubLocal: { id: idClub } }, { clubVisitante: { id: idClub } }],
      relations: ['evento', 'clubLocal', 'clubVisitante', 'resultado'],
      order: { fechaHora: 'ASC' },
    });
  }

  async getPartidosByFecha(
    fechaInicio: string,
    fechaFin: string,
  ): Promise<Partido[]> {
    return this.partidoRepository.find({
      where: {
        fechaHora: Between(new Date(fechaInicio), new Date(fechaFin)),
      },
      relations: ['evento', 'clubLocal', 'clubVisitante'],
      order: { fechaHora: 'ASC' },
    });
  }

  async actualizarMotivoCancelacion(id: number, motivo: string): Promise<Partido> {
    const partido = await this.findOne(id);
    
    // Solo permitir actualizar motivo si el partido está cancelado
    if (partido.estado !== 'cancelado') {
      throw new ConflictException(
        'Solo se puede actualizar el motivo en partidos cancelados'
      );
    }
  
    partido.motivoCancelacion = motivo;
    return this.partidoRepository.save(partido);
  }
}
