import { forwardRef, Module } from '@nestjs/common';
import { ResultadoService } from './resultado.service';
import { ResultadoController } from './resultado.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resultado } from './entities/resultado.entity';
import { AuthModule } from '../auth/auth.module';
import { PartidoModule } from '../partido/partido.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resultado]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsuarioModule),
    forwardRef(() => PartidoModule),
  ],
  controllers: [ResultadoController],
  providers: [ResultadoService],
  exports:[TypeOrmModule.forFeature([Resultado]), ResultadoService]
})
export class ResultadoModule {}
