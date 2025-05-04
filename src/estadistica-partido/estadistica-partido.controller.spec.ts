import { Test, TestingModule } from '@nestjs/testing';
import { EstadisticaPartidoController } from './estadistica-partido.controller';
import { EstadisticaPartidoService } from './estadistica-partido.service';

describe('EstadisticaPartidoController', () => {
  let controller: EstadisticaPartidoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstadisticaPartidoController],
      providers: [EstadisticaPartidoService],
    }).compile();

    controller = module.get<EstadisticaPartidoController>(EstadisticaPartidoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
