import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';
import { PermisoService } from '../permiso/permiso.service';
import { RoleType } from '../common/tiporole.enum';

@Injectable()
export class RolesService {
  constructor(
  @InjectRepository(Role)
    private readonly RoleRepository: Repository<Role>,
    private readonly Permisoservice: PermisoService
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.RoleRepository.create({name:createRoleDto.name})
    const permiso = await this.Permisoservice.findOne(createRoleDto.permisoId)

    role.permiso = permiso
    return this.RoleRepository.save(role)
  }

  async find_role(id:number){
    const role = await this.RoleRepository.findOne({where:{id}, relations:['permiso']})

    return role?.permiso.map((permiso) => permiso.name || [])

  }

  findname(name:RoleType){
    return this.RoleRepository.findOneBy({name})    
  }

  async findAll() {
    return await this.RoleRepository.find();
  }

  async findOne(id: number) {
    const role = await this.RoleRepository.findOne({
      where: { id },
      relations: ['permiso'],
    });
  
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
  
    return role;
  }
  
  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.RoleRepository.findOne({
      where: { id },
      relations: ['permiso'],
    });
  
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
  
    if (updateRoleDto.name) {
      role.name = updateRoleDto.name;
    }
  
    if (updateRoleDto.permisoId) {
      const permisos = await this.Permisoservice.findOne(updateRoleDto.permisoId);
      role.permiso = permisos;
    }
  
    return await this.RoleRepository.save(role);
  }
  
  async remove(id: number) {
    const role = await this.RoleRepository.findOne({ where: { id } });
  
    if (!role) {
      throw new NotFoundException(`Rol con ID ${id} no encontrado`);
    }
  
    await this.RoleRepository.remove(role);
    return { message: `Rol con ID ${id} eliminado correctamente` };
  }
}
