import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermisionDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permiso } from './entities/permiso.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermisoService {
  constructor(
    @InjectRepository(Permiso)
    private PermisionRepository: Repository<Permiso>,
  ){}

  async create(createPermisionDto: CreatePermisionDto) {
    const permiso = await this.PermisionRepository.create(createPermisionDto)
    return this.PermisionRepository.save(permiso) 
  }

  async findAll() {
    return await this.PermisionRepository.find()
  }

  async findOne(id: number[]) {
    return await this.PermisionRepository.findByIds(id);
  }

  async update(id: number, updatePermisionDto: UpdatePermisoDto) {
    const permiso = await this.PermisionRepository.preload({
      id,
      ...updatePermisionDto,
    });
  
    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }
  
    return await this.PermisionRepository.save(permiso);
  }
  
  async remove(id: number) {
    const permiso = await this.PermisionRepository.findOne({ where: { id } });
  
    if (!permiso) {
      throw new NotFoundException(`Permiso con ID ${id} no encontrado`);
    }
  
    await this.PermisionRepository.remove(permiso);
    return { message: `Permiso con ID ${id} eliminado correctamente` };
  }
}
