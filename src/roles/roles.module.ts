import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { PermisoModule } from '../permiso/permiso.module';

@Module({
  imports:[TypeOrmModule.forFeature([Role]), PermisoModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports:[TypeOrmModule.forFeature([Role]), RolesService]
})
export class RolesModule {}
