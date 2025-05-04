import { forwardRef, Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from './entities/club.entity';
import { UsuarioModule } from '../usuario/usuario.module';
import { AuthModule } from '../auth/auth.module';
import { EquipoModule } from '../equipo/equipo.module';
import { TransferenciaModule } from '../transferencia/transferencia.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Club]),
    forwardRef(() => AuthModule),
    forwardRef(()=> UsuarioModule),
    forwardRef(() => EquipoModule),
    forwardRef(() => TransferenciaModule),
  ],
  controllers: [ClubController],
  providers: [ClubService],
  exports: [TypeOrmModule.forFeature([Club]), ClubService],
})
export class ClubModule {}
