import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResultadoDto } from './dto/create-resultado.dto';
import { UpdateResultadoDto } from './dto/update-resultado.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resultado } from './entities/resultado.entity';
import { Partido } from '../partido/entities/partido.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResultadoService {
  constructor(
    @InjectRepository(Resultado)
    private readonly resultadoRepository: Repository<Resultado>,
    @InjectRepository(Partido)
    private readonly partidoRepository: Repository<Partido>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createResultadoDto: CreateResultadoDto): Promise<Resultado> {
    const { partidoId, usuarioRegistraId, ...resultadoData } = createResultadoDto;

    const partido = await this.partidoRepository.findOne({ where: { id: partidoId } });
    if (!partido) {
      throw new NotFoundException(`Partido con ID ${partidoId} no encontrado`);
    }

    const usuarioRegistra = await this.usuarioRepository.findOne({ where: { id: usuarioRegistraId } });
    if (!usuarioRegistra) {
      throw new NotFoundException(`Usuario con ID ${usuarioRegistraId} no encontrado`);
    }

    // Verificar si el partido ya tiene un resultado
    const existingResultado = await this.resultadoRepository.findOne({ where: { partido: { id: partidoId } } });
    if (existingResultado) {
      throw new Error('Este partido ya tiene un resultado registrado');
    }

    const resultado = this.resultadoRepository.create({
      ...resultadoData,
      partido,
      usuarioRegistra,
    });

    // Actualizar estado del partido a 'finalizado'
    partido.estado = 'finalizado';
    await this.partidoRepository.save(partido);

    return await this.resultadoRepository.save(resultado);
  }

  async findAll(): Promise<Resultado[]> {
    return await this.resultadoRepository.find({
      relations: ['partido', 'usuarioRegistra', 'partido.clubLocal', 'partido.clubVisitante'],
    });
  }

  async findOne(id: number): Promise<Resultado> {
    const resultado = await this.resultadoRepository.findOne({
      where: { id },
      relations: ['partido', 'usuarioRegistra', 'partido.clubLocal', 'partido.clubVisitante'],
    });

    if (!resultado) {
      throw new NotFoundException(`Resultado con ID ${id} no encontrado`);
    }

    return resultado;
  }

  async update(id: number, updateResultadoDto: UpdateResultadoDto): Promise<Resultado> {
    const resultado = await this.resultadoRepository.findOne({ where: { id } });
    if (!resultado) {
      throw new NotFoundException(`Resultado con ID ${id} no encontrado`);
    }

    if (updateResultadoDto.usuarioRegistraId) {
      const usuarioRegistra = await this.usuarioRepository.findOne({ 
        where: { id: updateResultadoDto.usuarioRegistraId } 
      });
      if (!usuarioRegistra) {
        throw new NotFoundException(`Usuario con ID ${updateResultadoDto.usuarioRegistraId} no encontrado`);
      }
      resultado.usuarioRegistra = usuarioRegistra;
    }

    Object.assign(resultado, updateResultadoDto);

    return await this.resultadoRepository.save(resultado);
  }

  async remove(id: number): Promise<void> {
    const resultado = await this.resultadoRepository.findOne({ 
      where: { id },
      relations: ['partido']
    });
    
    if (!resultado) {
      throw new NotFoundException(`Resultado con ID ${id} no encontrado`);
    }

    // Cambiar el estado del partido a 'programado' si se elimina el resultado
    if (resultado.partido) {
      resultado.partido.estado = 'programado';
      await this.partidoRepository.save(resultado.partido);
    }

    await this.resultadoRepository.remove(resultado);
  }

  async findByPartido(partidoId: number): Promise<Resultado> {
    const resultado = await this.resultadoRepository.findOne({
      where: { partido: { id: partidoId } },
      relations: ['partido', 'usuarioRegistra', 'partido.clubLocal', 'partido.clubVisitante'],
    });

    if (!resultado) {
      throw new NotFoundException(`No se encontró resultado para el partido con ID ${partidoId}`);
    }

    return resultado;
  }

  async findByEvento(eventoId: number): Promise<Resultado[]> {
    return await this.resultadoRepository.find({
      where: { partido: { evento: { id: eventoId } } },
      relations: ['partido', 'partido.equipoLocal', 'partido.equipoVisitante', 'usuarioRegistra'],
    });
  }
}
