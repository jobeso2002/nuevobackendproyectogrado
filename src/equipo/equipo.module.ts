import { forwardRef, Module } from '@nestjs/common';
import { EquipoService } from './equipo.service';
import { EquipoController } from './equipo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Equipo } from './entities/equipo.entity';
import { AuthModule } from '../auth/auth.module';
import { ClubModule } from '../club/club.module';
import { DeportistaModule } from '../deportista/deportista.module';
import { InscripcionModule } from '../inscripcion/inscripcion.module';
import { PartidoModule } from '../partido/partido.module';
import { EquipoDeportista } from './entities/equipo-deportista.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Equipo, EquipoDeportista]),
    forwardRef(() => AuthModule),
    forwardRef(() => ClubModule),
    forwardRef(() => DeportistaModule),
    forwardRef(() => InscripcionModule),
    forwardRef(() => PartidoModule),
  ],
  controllers: [EquipoController],
  providers: [EquipoService],
  exports: [TypeOrmModule.forFeature([Equipo, EquipoDeportista]), EquipoService],
})
export class EquipoModule {}
