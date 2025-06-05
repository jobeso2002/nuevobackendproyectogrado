import { forwardRef, Module } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import { InscripcionController } from './inscripcion.controller';
import { Inscripcion } from './entities/inscripcion.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EventoModule } from '../evento/evento.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { ClubModule } from '../club/club.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inscripcion]),
    forwardRef(() => AuthModule),
    forwardRef(() => EventoModule),
    forwardRef(() => ClubModule),
    forwardRef(() => UsuarioModule),
  ],
  controllers: [InscripcionController],
  providers: [InscripcionService],
  exports:[TypeOrmModule.forFeature([Inscripcion]), InscripcionService]
})
export class InscripcionModule {}
