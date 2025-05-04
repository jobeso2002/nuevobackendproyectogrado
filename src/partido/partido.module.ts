import { forwardRef, Module } from '@nestjs/common';
import { PartidoService } from './partido.service';
import { PartidoController } from './partido.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partido } from './entities/partido.entity';
import { AuthModule } from '../auth/auth.module';
import { EstadisticaPartidoModule } from '../estadistica-partido/estadistica-partido.module';
import { EventoModule } from '../evento/evento.module';
import { EquipoModule } from '../equipo/equipo.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { ResultadoModule } from '../resultado/resultado.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partido]),
    forwardRef(() => AuthModule),
    forwardRef(() => EstadisticaPartidoModule),
    forwardRef(() => EventoModule),
    forwardRef(() => EquipoModule),
    forwardRef(() => UsuarioModule),
    forwardRef(() => ResultadoModule),
  ],
  controllers: [PartidoController],
  providers: [PartidoService],
  exports: [TypeOrmModule.forFeature([Partido]), PartidoService],
})
export class PartidoModule {}
