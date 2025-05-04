import { forwardRef, Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { ClubModule } from 'src/club/club.module';
import { EventoModule } from 'src/evento/evento.module';
import { PartidoModule } from 'src/partido/partido.module';
import { TransferenciaModule } from 'src/transferencia/transferencia.module';
import { InscripcionModule } from 'src/inscripcion/inscripcion.module';
import { ResultadoModule } from 'src/resultado/resultado.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario]),
    forwardRef(() => AuthModule),
    RolesModule,
    forwardRef(() => ClubModule),
    forwardRef(() => EventoModule),
    forwardRef(() => PartidoModule),
    forwardRef(() => TransferenciaModule),
    forwardRef(() => InscripcionModule),
    forwardRef(() => ResultadoModule),
  ],
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [TypeOrmModule.forFeature([Usuario]), UsuarioService],
})
export class UsuarioModule {}
