import { forwardRef, Module } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { Inscripcion } from './entities/inscripcion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EventoModule } from 'src/evento/evento.module';
import { EquipoModule } from 'src/equipo/equipo.module';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inscripcion]),
    forwardRef(() => AuthModule),
    forwardRef(() => EventoModule),
    forwardRef(() => EquipoModule),
    forwardRef(() => UsuarioModule),
  ],
  controllers: [InscripcionController],
  providers: [InscripcionService],
  exports:[TypeOrmModule.forFeature([Inscripcion]), InscripcionService]
})
export class InscripcionModule {}
