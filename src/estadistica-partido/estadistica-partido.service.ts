import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEstadisticaPartidoDto } from './dto/create-estadistica-partido.dto';
import { UpdateEstadisticaPartidoDto } from './dto/update-estadistica-partido.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EstadisticaPartido } from './entities/estadistica-partido.entity';
import { Partido } from '../partido/entities/partido.entity';
import { Repository } from 'typeorm';
import { Deportista } from '../deportista/entities/deportista.entity';

@Injectable()
export class EstadisticaPartidoService {
  constructor(
    @InjectRepository(EstadisticaPartido)
    private readonly estadisticaRepository: Repository<EstadisticaPartido>,
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
    @InjectRepository(Deportista)
    private readonly deportistaRepository: Repository<Deportista>,
  ) {}

  async create(createEstadisticaDto: CreateEstadisticaPartidoDto): Promise<EstadisticaPartido> {
    const { partidoId, deportistaId, ...estadisticaData } = createEstadisticaDto;

    const partido = await this.partidoRepository.findOne({ where: { id: partidoId } });
    if (!partido) {
      throw new NotFoundException(`Partido con ID ${partidoId} no encontrado`);
    }

    const deportista = await this.deportistaRepository.findOne({ where: { id: deportistaId } });
    if (!deportista) {
      throw new NotFoundException(`Deportista con ID ${deportistaId} no encontrado`);
    }

    // Verificar si ya existe estadística para este deportista en este partido
    const existingStat = await this.estadisticaRepository.findOne({
      where: {
        partido: { id: partidoId },
        deportista: { id: deportistaId }
      }
    });

    if (existingStat) {
      throw new Error('Este deportista ya tiene estadísticas registradas para este partido');
    }

    const estadistica = this.estadisticaRepository.create({
      ...estadisticaData,
      partido,
      deportista
    });

    return await this.estadisticaRepository.save(estadistica);
  }

  async findAll(): Promise<EstadisticaPartido[]> {
    return await this.estadisticaRepository.find({
      relations: ['partido', 'deportista', 'partido.equipoLocal', 'partido.equipoVisitante'],
    });
  }

  async findOne(id: number): Promise<EstadisticaPartido> {
    const estadistica = await this.estadisticaRepository.findOne({
      where: { id },
      relations: ['partido', 'deportista', 'partido.equipoLocal', 'partido.equipoVisitante'],
    });

    if (!estadistica) {
      throw new NotFoundException(`Estadística con ID ${id} no encontrada`);
    }

    return estadistica;
  }

  async update(
    id: number, 
    updateEstadisticaDto: UpdateEstadisticaPartidoDto
  ): Promise<EstadisticaPartido> {
    const estadistica = await this.estadisticaRepository.findOne({ where: { id } });
    if (!estadistica) {
      throw new NotFoundException(`Estadística con ID ${id} no encontrada`);
    }

    if (updateEstadisticaDto.deportistaId) {
      const deportista = await this.deportistaRepository.findOne({ 
        where: { id: updateEstadisticaDto.deportistaId } 
      });
      if (!deportista) {
        throw new NotFoundException(`Deportista con ID ${updateEstadisticaDto.deportistaId} no encontrado`);
      }
      estadistica.deportista = deportista;
    }

    if (updateEstadisticaDto.partidoId) {
      const partido = await this.partidoRepository.findOne({ 
        where: { id: updateEstadisticaDto.partidoId } 
      });
      if (!partido) {
        throw new NotFoundException(`Partido con ID ${updateEstadisticaDto.partidoId} no encontrado`);
      }
      estadistica.partido = partido;
    }

    Object.assign(estadistica, updateEstadisticaDto);

    return await this.estadisticaRepository.save(estadistica);
  }

  async remove(id: number): Promise<void> {
    const estadistica = await this.estadisticaRepository.findOne({ where: { id } });
    if (!estadistica) {
      throw new NotFoundException(`Estadística con ID ${id} no encontrada`);
    }

    await this.estadisticaRepository.remove(estadistica);
  }

  async findByPartido(partidoId: number): Promise<EstadisticaPartido[]> {
    return await this.estadisticaRepository.find({
      where: { partido: { id: partidoId } },
      relations: ['deportista', 'partido'],
    });
  }

  async findByDeportista(deportistaId: number): Promise<EstadisticaPartido[]> {
    return await this.estadisticaRepository.find({
      where: { deportista: { id: deportistaId } },
      relations: ['partido', 'partido.equipoLocal', 'partido.equipoVisitante'],
      order: { partido: { fechaHora: 'DESC' } },
    });
  }

  async getEstadisticasAgregadasPorDeportista(deportistaId: number): Promise<any> {
    const stats = await this.findByDeportista(deportistaId);
    
    return stats.reduce((acc, curr) => {
      return {
        saques: acc.saques + curr.saques,
        ataques: acc.ataques + curr.ataques,
        bloqueos: acc.bloqueos + curr.bloqueos,
        defensas: acc.defensas + curr.defensas,
        puntos: acc.puntos + curr.puntos,
        errores: acc.errores + curr.errores,
        partidosJugados: acc.partidosJugados + 1
      };
    }, {
      saques: 0,
      ataques: 0,
      bloqueos: 0,
      defensas: 0,
      puntos: 0,
      errores: 0,
      partidosJugados: 0
    });
  }
}
