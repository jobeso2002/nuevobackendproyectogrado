import { forwardRef, Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evento } from './entities/evento.entity';
import { AuthModule } from '../auth/auth.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { InscripcionModule } from '../inscripcion/inscripcion.module';
import { PartidoModule } from '../partido/partido.module';
import { EquipoModule } from '../equipo/equipo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Evento]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsuarioModule),
    forwardRef(() => InscripcionModule),
    forwardRef(() => PartidoModule),
    forwardRef(() => EquipoModule),
    
  ],
  controllers: [EventoController],
  providers: [EventoService],
  exports: [TypeOrmModule.forFeature([Evento]), EventoService],
})
export class EventoModule {}
