import { forwardRef, Module } from '@nestjs/common';
import { ContactoService } from './contacto.service';
import { ContactoController } from './contacto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacto } from './entities/contacto.entity';
import { AuthModule } from '../auth/auth.module';
import { DeportistaModule } from '../deportista/deportista.module';

@Module({
  imports:[TypeOrmModule.forFeature([Contacto]), forwardRef(() => AuthModule), forwardRef(() => DeportistaModule)],
  controllers: [ContactoController],
  providers: [ContactoService],
  exports:[TypeOrmModule.forFeature([Contacto]), ContactoService]
})
export class ContactoModule {}
