import { Test, TestingModule } from '@nestjs/testing';
import { PartidoService } from './partido.service';

describe('PartidoService', () => {
  let service: PartidoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PartidoService],
    }).compile();

    service = module.get<PartidoService>(PartidoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
