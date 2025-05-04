import { forwardRef, Module } from '@nestjs/common';
import { TransferenciaService } from './transferencia.service';
import { TransferenciaController } from './transferencia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transferencia } from './entities/transferencia.entity';
import { AuthModule } from '../auth/auth.module';
import { ClubModule } from '../club/club.module';
import { DeportistaModule } from '../deportista/deportista.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { EquipoModule } from '../equipo/equipo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transferencia]),
    forwardRef(() => AuthModule),
    forwardRef(() => ClubModule),
    forwardRef(() => DeportistaModule),
    forwardRef(() => UsuarioModule),
    forwardRef(() => EquipoModule),
  ],
  controllers: [TransferenciaController],
  providers: [TransferenciaService],
  exports: [TypeOrmModule.forFeature([Transferencia]), TransferenciaService],
})
export class TransferenciaModule {}
