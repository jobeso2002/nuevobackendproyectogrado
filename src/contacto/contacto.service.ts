import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contacto } from './entities/contacto.entity';
import { Deportista } from '../deportista/entities/deportista.entity';
import { CreateContactoDto } from './dto/create-contacto.dto';
import { UpdateContactoDto } from './dto/update-contacto.dto';

@Injectable()
export class ContactoService {
  constructor(
    @InjectRepository(Contacto)
    private readonly contactoRepository: Repository<Contacto>,
    @InjectRepository(Deportista)
    private readonly deportistaRepository: Repository<Deportista>,
  ) {}

  async create(createContactoDto: CreateContactoDto): Promise<Contacto> {
    // Verificar si el deportista existe
    const deportista = await this.deportistaRepository.findOne({
      where: { id: createContactoDto.id_deportista },
    });

    if (!deportista) {
      throw new NotFoundException(`Deportista con ID ${createContactoDto.id_deportista} no encontrado`);
    }

    // Verificar si ya existe un contacto de emergencia para este deportista
    if (createContactoDto.esContactoEmergencia) {
      const existingContactoEmergencia = await this.contactoRepository.findOne({
        where: {
          deportista: { id: createContactoDto.id_deportista },
          esContactoEmergencia: true,
        },
      });

      if (existingContactoEmergencia) {
        throw new ConflictException('El deportista ya tiene un contacto de emergencia registrado');
      }
    }

    const contacto = this.contactoRepository.create({
      ...createContactoDto,
      deportista,
    });

    return this.contactoRepository.save(contacto);
  }

  async findAllByDeportista(idDeportista: number): Promise<Contacto[]> {
    // Verificar si el deportista existe
    const deportistaExists = await this.deportistaRepository.exist({
      where: { id: idDeportista },
    });

    if (!deportistaExists) {
      throw new NotFoundException(`Deportista con ID ${idDeportista} no encontrado`);
    }

    return this.contactoRepository.find({
      where: { deportista: { id: idDeportista } },
      order: { esContactoEmergencia: 'DESC' }, // Ordenar primero los contactos de emergencia
    });
  }

  async findOne(id: number): Promise<Contacto> {
    const contacto = await this.contactoRepository.findOne({
      where: { id },
      relations: ['deportista'],
    });

    if (!contacto) {
      throw new NotFoundException(`Contacto con ID ${id} no encontrado`);
    }

    return contacto;
  }

  async update(id: number, updateContactoDto: UpdateContactoDto): Promise<Contacto> {
    const contacto = await this.findOne(id);

    // Verificar si se está actualizando a contacto de emergencia
    if (updateContactoDto.esContactoEmergencia) {
      const existingContactoEmergencia = await this.contactoRepository.findOne({
        where: {
          deportista: { id: contacto.deportista.id },
          esContactoEmergencia: true,
        },
      });

      if (existingContactoEmergencia && existingContactoEmergencia.id !== id) {
        throw new ConflictException('El deportista ya tiene un contacto de emergencia registrado');
      }
    }

    this.contactoRepository.merge(contacto, {
      nombres: updateContactoDto.nombres || contacto.nombres,
      apellidos: updateContactoDto.apellidos || contacto.apellidos,
      parentesco: updateContactoDto.parentesco || contacto.parentesco,
      telefono: updateContactoDto.telefono || contacto.telefono,
      email: updateContactoDto.email || contacto.email,
      direccion: updateContactoDto.direccion || contacto.direccion,
      esContactoEmergencia: updateContactoDto.esContactoEmergencia ?? contacto.esContactoEmergencia,
    });

    return this.contactoRepository.save(contacto);
  }

  async remove(id: number): Promise<void> {
    const contacto = await this.findOne(id);
    await this.contactoRepository.remove(contacto);
  }

  async getContactoEmergencia(idDeportista: number): Promise<Contacto> {
    const contacto = await this.contactoRepository.findOne({
      where: {
        deportista: { id: idDeportista },
        esContactoEmergencia: true,
      },
    });

    if (!contacto) {
      throw new NotFoundException(`No se encontró contacto de emergencia para el deportista con ID ${idDeportista}`);
    }

    return contacto;
  }
}