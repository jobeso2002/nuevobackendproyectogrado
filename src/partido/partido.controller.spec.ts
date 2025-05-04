import { Test, TestingModule } from '@nestjs/testing';
import { PartidoController } from './partido.controller';
import { PartidoService } from './partido.service';

describe('PartidoController', () => {
  let controller: PartidoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PartidoController],
      providers: [PartidoService],
    }).compile();

    controller = module.get<PartidoController>(PartidoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
