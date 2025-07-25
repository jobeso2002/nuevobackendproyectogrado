import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deportista } from './entities/deportista.entity';
import { CreateDeportistaDto } from './dto/create-deportista.dto';
import { UpdateDeportistaDto } from './dto/update-deportista.dto';
import { Contacto } from '../contacto/entities/contacto.entity';
import { Transferencia } from '../transferencia/entities/transferencia.entity';
import { CreateContactoDto } from '../contacto/dto/create-contacto.dto';
import { CreateTransferenciaDto } from '../transferencia/dto/create-transferencia.dto';
import { Club } from 'src/club/entities/club.entity';
import { ClubDeportista } from 'src/club/entities/clubdeportista';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class DeportistaService {
  constructor(
    @InjectRepository(Deportista)
    private readonly deportistaRepository: Repository<Deportista>,
    @InjectRepository(Contacto)
    private readonly contactoRepository: Repository<Contacto>,
    @InjectRepository(Transferencia)
    private readonly transferenciaRepository: Repository<Transferencia>,
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
    @InjectRepository(ClubDeportista)
    private readonly clubDeportistaRepository: Repository<ClubDeportista>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createDeportistaDto: CreateDeportistaDto, fotoFile?: Express.Multer.File): Promise<Deportista> {
    // Subir imagen a Cloudinary si existe
    let fotoUrl = '';
    
    if (fotoFile) {
      try {
        fotoUrl = await this.cloudinaryService.uploadImage(fotoFile, 'deportistas');
      } catch (error) {
        throw new InternalServerErrorException('Error al subir la imagen a Cloudinary');
      }
    }
    // Verificar si ya existe un deportista con el mismo documento
    const existingDeportista = await this.deportistaRepository.findOne({
      where: { documentoIdentidad: createDeportistaDto.documentoIdentidad },
    });

    if (existingDeportista) {
      throw new ConflictException(
        'Ya existe un deportista con este documento de identidad',
      );
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
      foto: fotoUrl,
      tipo_sangre: createDeportistaDto.tipo_sangre,
      telefono: createDeportistaDto.telefono,
      email: createDeportistaDto.email,
      estado: 'activo',
      direccion: createDeportistaDto.direccion,
      posicion: createDeportistaDto.posicion,
      numero_camiseta: createDeportistaDto.numero_camiseta
    });

    return this.deportistaRepository.save(deportista);
  }

  // Modificar el método findAll para usar club en lugar de equipo
  async findAll(clubId?: number, genero?: string): Promise<Deportista[]> {
    const options: any = {};

    if (clubId) {
      options.clubDeportistas = { club: { id: clubId } };
    }
    if (genero) {
      options.genero = genero;
    }

    return this.deportistaRepository.find({
      where: options,
      relations: ['clubDeportistas', 'clubDeportistas.club'],
    });
  }

  async findOne(id: number): Promise<Deportista> {
    const deportista = await this.deportistaRepository.findOne({
      where: { id },
      relations: [
        'clubDeportistas', // Cambia 'club' por 'clubDeportistas'
        'clubDeportistas.club',
        'contactos',
        'transferencias',
        'transferencias.clubOrigen',
        'transferencias.clubDestino',
        'estadisticas',
      ],
    });

    if (!deportista) {
      throw new NotFoundException(`Deportista con ID ${id} no encontrado`);
    }

    return deportista;
  }

  async update(
    id: number,
    updateDeportistaDto: UpdateDeportistaDto,
  ): Promise<Deportista> {
    const deportista = await this.findOne(id);

    if (
      updateDeportistaDto.documentoIdentidad &&
      updateDeportistaDto.documentoIdentidad !== deportista.documentoIdentidad
    ) {
      const existingDeportista = await this.deportistaRepository.findOne({
        where: { documentoIdentidad: updateDeportistaDto.documentoIdentidad },
      });

      if (existingDeportista) {
        throw new ConflictException(
          'Ya existe un deportista con este documento de identidad',
        );
      }
    }

    this.deportistaRepository.merge(deportista, {
      primer_nombre:
        updateDeportistaDto.primer_nombre || deportista.primer_nombre,
      segundo_nombre:
        updateDeportistaDto.segundo_nombre || deportista.segundo_nombre,
      primer_apellido:
        updateDeportistaDto.primer_apellido || deportista.primer_apellido,
      segundo_apellido:
        updateDeportistaDto.segundo_apellido || deportista.segundo_apellido,
      fechaNacimiento: updateDeportistaDto.fechaNacimiento
        ? new Date(updateDeportistaDto.fechaNacimiento)
        : deportista.fechaNacimiento,
      genero: updateDeportistaDto.genero || deportista.genero,
      documentoIdentidad:
        updateDeportistaDto.documentoIdentidad || deportista.documentoIdentidad,
      tipoDocumento:
        updateDeportistaDto.tipoDocumento || deportista.tipoDocumento,
      foto: updateDeportistaDto.fotoFile || deportista.foto,
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

  async addContacto(
    id: number,
    createContactoDto: CreateContactoDto,
  ): Promise<Contacto> {
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
      throw new NotFoundException(
        `Contacto con ID ${idContacto} no encontrado para este deportista`,
      );
    }

    await this.contactoRepository.remove(contacto);
  }

  async createTransferencia(
    id: number,
    createTransferenciaDto: CreateTransferenciaDto,
  ): Promise<Transferencia> {
    const deportista = await this.findOne(id);

    const clubOrigen = await this.clubRepository.findOne({
      where: { id: createTransferenciaDto.id_club_origen },
    });

    if (!clubOrigen) {
      throw new NotFoundException(
        `Club de origen con ID ${createTransferenciaDto.id_club_origen} no encontrado`,
      );
    }

    const clubDestino = await this.clubRepository.findOne({
      where: { id: createTransferenciaDto.id_club_destino },
    });

    if (!clubDestino) {
      throw new NotFoundException(
        `Club de destino con ID ${createTransferenciaDto.id_club_destino} no encontrado`,
      );
    }

    const transferencia = this.transferenciaRepository.create({
      ...createTransferenciaDto,
      deportista,
      clubOrigen,
      clubDestino,
      estado: 'pendiente',
    });

    return this.transferenciaRepository.save(transferencia);
  }

  async getClubs(id: number): Promise<{club: Club, fechaIngreso: Date, estado: string}[]> {
    const relaciones = await this.clubDeportistaRepository.find({
      where: {
        deportista: { id },
        estado: 'activo'
      },
      relations: ['club']
    });

    if (!relaciones || relaciones.length === 0) {
      return [];
    }

    return relaciones.map(rel => ({
      club: rel.club,
      fechaIngreso: rel.fechaIngreso,
      estado: rel.estado
    }));
  }

  async getTransferencias(id: number): Promise<Transferencia[]> {
    const deportista = await this.deportistaRepository.findOne({
      where: { id },
      relations: [
        'transferencias',
        'transferencias.clubOrigen',
        'transferencias.clubDestino',
      ],
    });

    if (!deportista) {
      throw new NotFoundException(`Deportista con ID ${id} no encontrado`);
    }

    return deportista.transferencias;
  }

  async getEstadisticas(id: number): Promise<any> {
    const deportista = await this.deportistaRepository.findOne({
      where: { id },
      relations: [
        'estadisticas',
        'estadisticas.partido',
        'estadisticas.partido.clubLocal',
        'estadisticas.partido.clubVisitante',
      ],
    });

    if (!deportista) {
      throw new NotFoundException(`Deportista con ID ${id} no encontrado`);
    }

    return {
      deportista: {
        id: deportista.id,
        nombreCompleto: `${deportista.primer_nombre} ${deportista.primer_apellido}`,
      },
      estadisticas: deportista.estadisticas.map((e) => ({
        id: e.id,
        partido: {
          id: e.partido.id,
          fecha: e.partido.fechaHora,
          local: e.partido.clubLocal.nombre,
          visitante: e.partido.clubVisitante.nombre,
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
