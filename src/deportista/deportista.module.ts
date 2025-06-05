import { forwardRef, Module } from '@nestjs/common';
import { DeportistaService } from './deportista.service';
import { DeportistaController } from './deportista.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deportista } from './entities/deportista.entity';
import { AuthModule } from '../auth/auth.module';
import { ContactoModule } from '../contacto/contacto.module';
import { TransferenciaModule } from '../transferencia/transferencia.module';
import { EstadisticaPartidoModule } from '../estadistica-partido/estadistica-partido.module';
import { ClubDeportista } from '../club/entities/clubdeportista';
import { Club } from '../club/entities/club.entity';
import { ClubModule } from '../club/club.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Deportista, ClubDeportista, Club]),
    forwardRef(() => AuthModule),
    forwardRef(() => ContactoModule),
    forwardRef(() => TransferenciaModule),
    forwardRef(() => EstadisticaPartidoModule),
    forwardRef(() => ClubModule),
  ],
  controllers: [DeportistaController],
  providers: [DeportistaService],
  exports:[TypeOrmModule.forFeature([Deportista]), DeportistaService]
})
export class DeportistaModule {}