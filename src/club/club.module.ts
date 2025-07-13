import { forwardRef, Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from './entities/club.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthModule } from '../auth/auth.module';
import { TransferenciaModule } from '../transferencia/transferencia.module';
import { ClubDeportista } from './entities/clubdeportista';
import { DeportistaModule } from '../deportista/deportista.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club, ClubDeportista]),
    forwardRef(() => AuthModule),
    forwardRef(()=> UsuarioModule),
    forwardRef(() => TransferenciaModule),
    forwardRef(() => DeportistaModule),
  ],
  controllers: [ClubController],
  providers: [ClubService],
  exports: [TypeOrmModule.forFeature([Club, ClubDeportista]), ClubService],
})
export class ClubModule {}