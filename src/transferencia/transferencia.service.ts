import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransferenciaDto } from './dto/create-transferencia.dto';
import { UpdateTransferenciaDto } from './dto/update-transferencia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transferencia } from './entities/transferencia.entity';
import { Repository } from 'typeorm';
import { Deportista } from '../deportista/entities/deportista.entity';
import { Club } from '../club/entities/club.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { ClubDeportista } from '../club/entities/clubdeportista';

@Injectable()
export class TransferenciaService {
  constructor(
    @InjectRepository(Transferencia)
    private readonly transferenciaRepository: Repository<Transferencia>,
    @InjectRepository(Deportista)
    private readonly deportistaRepository: Repository<Deportista>,
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(ClubDeportista)
    private readonly clubDeportistaRepository: Repository<ClubDeportista>,
  ) {}

  async create(createTransferenciaDto: CreateTransferenciaDto): Promise<Transferencia> {
    // Verificar que el deportista existe
    const deportista = await this.deportistaRepository.findOne({
      where: { id: createTransferenciaDto.id_deportista },
    });

    if (!deportista) {
      throw new NotFoundException(`Deportista con ID ${createTransferenciaDto.id_deportista} no encontrado`);
    }

    // Verificar que el club de origen existe
    const clubOrigen = await this.clubRepository.findOne({
      where: { id: createTransferenciaDto.id_club_origen },
    });

    if (!clubOrigen) {
      throw new NotFoundException(`Club de origen con ID ${createTransferenciaDto.id_club_origen} no encontrado`);
    }

    // Verificar que el club de destino existe
    const clubDestino = await this.clubRepository.findOne({
      where: { id: createTransferenciaDto.id_club_destino },
    });

    if (!clubDestino) {
      throw new NotFoundException(`Club de destino con ID ${createTransferenciaDto.id_club_destino} no encontrado`);
    }

    // Verificar que el usuario que registra existe
    const usuarioRegistra = await this.usuarioRepository.findOne({
      where: { id: createTransferenciaDto.id_usuario_registra },
    });

    if (!usuarioRegistra) {
      throw new NotFoundException(`Usuario con ID ${createTransferenciaDto.id_usuario_registra} no encontrado`);
    }

    // Verificar que el deportista pertenece al club de origen
    const perteneceAlClub = await this.clubDeportistaRepository.findOne({
      where: {
        deportista: { id: createTransferenciaDto.id_deportista },
        club: { id: createTransferenciaDto.id_club_origen },
        estado: 'activo',
      },
    });

    if (!perteneceAlClub) {
      throw new ConflictException('El deportista no pertenece al club de origen especificado');
    }

    // Verificar que no existe una transferencia pendiente para el mismo deportista
    const transferenciaPendiente = await this.transferenciaRepository.findOne({
      where: {
        deportista: { id: createTransferenciaDto.id_deportista },
        estado: 'pendiente',
      },
    });

    if (transferenciaPendiente) {
      throw new ConflictException('El deportista ya tiene una transferencia pendiente');
    }

    const transferencia = this.transferenciaRepository.create({
      fechaTransferencia: new Date(createTransferenciaDto.fechaTransferencia),
      motivo: createTransferenciaDto.motivo,
      estado: 'pendiente',
      deportista,
      clubOrigen,
      clubDestino,
      usuarioRegistra,
    });

    return this.transferenciaRepository.save(transferencia);
  }
  
  async findAll(): Promise<Transferencia[]> {
    return this.transferenciaRepository.find({
      relations: ['deportista', 'clubOrigen', 'clubDestino', 'usuarioRegistra'],
      order: { fechaTransferencia: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Transferencia> {
    const transferencia = await this.transferenciaRepository.findOne({
      where: { id },
      relations: ['deportista', 'clubOrigen', 'clubDestino', 'usuarioRegistra'],
    });

    if (!transferencia) {
      throw new NotFoundException(`Transferencia con ID ${id} no encontrada`);
    }

    return transferencia;
  }

  async update(id: number, updateTransferenciaDto: UpdateTransferenciaDto): Promise<Transferencia> {
    const transferencia = await this.findOne(id);

    // Solo permitir actualización si está pendiente
    if (transferencia.estado !== 'pendiente') {
      throw new ForbiddenException('Solo se pueden actualizar transferencias pendientes');
    }

    if (updateTransferenciaDto.id_club_destino) {
      const clubDestino = await this.clubRepository.findOne({
        where: { id: updateTransferenciaDto.id_club_destino },
      });

      if (!clubDestino) {
        throw new NotFoundException(`Club de destino con ID ${updateTransferenciaDto.id_club_destino} no encontrado`);
      }
      transferencia.clubDestino = clubDestino;
    }

    this.transferenciaRepository.merge(transferencia, {
      motivo: updateTransferenciaDto.motivo || transferencia.motivo,
      fechaTransferencia: updateTransferenciaDto.fechaTransferencia 
        ? new Date(updateTransferenciaDto.fechaTransferencia) 
        : transferencia.fechaTransferencia,
    });

    return this.transferenciaRepository.save(transferencia);
  }

  async aprobarTransferencia(id: number, idUsuarioAprueba: number): Promise<Transferencia> {
    const transferencia = await this.findOne(id);
    const usuarioAprueba = await this.usuarioRepository.findOne({
      where: { id: idUsuarioAprueba },
    });

    if (!usuarioAprueba) {
      throw new NotFoundException(`Usuario con ID ${idUsuarioAprueba} no encontrado`);
    }

    if (transferencia.estado !== 'pendiente') {
      throw new ForbiddenException('Solo se pueden aprobar transferencias pendientes');
    }

    // 1. Cambiar estado de la transferencia
    transferencia.estado = 'aprobada';
    transferencia.usuarioAprueba = usuarioAprueba;
    transferencia.fechaAprobacion = new Date();

    // 2. Actualizar relación club-deportista (inactivar en club origen)
    await this.clubDeportistaRepository.update(
      { 
        deportista: { id: transferencia.deportista.id },
        club: { id: transferencia.clubOrigen.id },
        estado: 'activo'
      },
      { estado: 'inactivo' }
    );

    // 3. Crear nueva relación con club destino
    const nuevaRelacion = this.clubDeportistaRepository.create({
      club: transferencia.clubDestino,
      deportista: transferencia.deportista,
      fechaIngreso: new Date(),
      estado: 'activo',
    });
    await this.clubDeportistaRepository.save(nuevaRelacion);

    return this.transferenciaRepository.save(transferencia);
  }

  async rechazarTransferencia(id: number, idUsuarioRechaza: number): Promise<Transferencia> {
    const transferencia = await this.findOne(id);
    const usuarioRechaza = await this.usuarioRepository.findOne({
      where: { id: idUsuarioRechaza },
    });

    if (!usuarioRechaza) {
      throw new NotFoundException(`Usuario con ID ${idUsuarioRechaza} no encontrado`);
    }

    if (transferencia.estado !== 'pendiente') {
      throw new ForbiddenException('Solo se pueden rechazar transferencias pendientes');
    }

    transferencia.estado = 'rechazada';
    transferencia.usuarioRechaza = usuarioRechaza;
    transferencia.fechaRechazo = new Date();

    return this.transferenciaRepository.save(transferencia);
  }

  async getTransferenciasByClub(idClub: number): Promise<Transferencia[]> {
    const clubExists = await this.clubRepository.exist({ where: { id: idClub } });
    if (!clubExists) {
      throw new NotFoundException(`Club con ID ${idClub} no encontrado`);
    }

    return this.transferenciaRepository.find({
      where: [
        { clubOrigen: { id: idClub } },
        { clubDestino: { id: idClub } },
      ],
      relations: ['deportista', 'clubOrigen', 'clubDestino'],
      order: { fechaTransferencia: 'DESC' },
    });
  }

  async getTransferenciasByDeportista(idDeportista: number): Promise<Transferencia[]> {
    const deportistaExists = await this.deportistaRepository.exist({ where: { id: idDeportista } });
    if (!deportistaExists) {
      throw new NotFoundException(`Deportista con ID ${idDeportista} no encontrado`);
    }

    return this.transferenciaRepository.find({
      where: { deportista: { id: idDeportista } },
      relations: ['clubOrigen', 'clubDestino'],
      order: { fechaTransferencia: 'DESC' },
    });
  }

}
