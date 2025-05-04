import { Test, TestingModule } from '@nestjs/testing';
import { EstadisticaPartidoService } from './estadistica-partido.service';

describe('EstadisticaPartidoService', () => {
  let service: EstadisticaPartidoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstadisticaPartidoService],
    }).compile();

    service = module.get<EstadisticaPartidoService>(EstadisticaPartidoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
