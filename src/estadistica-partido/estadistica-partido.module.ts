import { forwardRef, Module } from '@nestjs/common';
import { EstadisticaPartidoService } from './estadistica-partido.service';
import { EstadisticaPartidoController } from './estadistica-partido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstadisticaPartido } from './entities/estadistica-partido.entity';
import { AuthModule } from '../auth/auth.module';
import { PartidoModule } from '../partido/partido.module';
import { DeportistaModule } from '../deportista/deportista.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstadisticaPartido]),
    forwardRef(() => AuthModule),
    forwardRef(() => PartidoModule),
    forwardRef(() => DeportistaModule),
  ],
  controllers: [EstadisticaPartidoController],
  providers: [EstadisticaPartidoService],
  exports: [
    TypeOrmModule.forFeature([EstadisticaPartido]),
    EstadisticaPartidoService,
  ],
})
export class EstadisticaPartidoModule {}
