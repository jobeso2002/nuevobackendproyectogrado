import { forwardRef, Module } from '@nestjs/common';
import { DeportistaService } from './deportista.service';
import { DeportistaController } from './deportista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deportista } from './entities/deportista.entity';
import { AuthModule } from '../auth/auth.module';
import { EquipoModule } from '../equipo/equipo.module';
import { ContactoModule } from '../contacto/contacto.module';
import { TransferenciaModule } from '../transferencia/transferencia.module';
import { EstadisticaPartidoModule } from '../estadistica-partido/estadistica-partido.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Deportista]),
    forwardRef(() => AuthModule),
    forwardRef(() => EquipoModule),
    forwardRef(() => ContactoModule),
    forwardRef(() => TransferenciaModule),
    forwardRef(() => EstadisticaPartidoModule),
  ],
  controllers: [DeportistaController],
  providers: [DeportistaService],
  exports:[TypeOrmModule.forFeature([Deportista]), DeportistaService]
})
export class DeportistaModule {}
