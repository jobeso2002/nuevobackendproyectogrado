import { Deportista } from '../../deportista/entities/deportista.entity';
import { Partido } from '../../partido/entities/partido.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EstadisticaPartido {
  @PrimaryGeneratedColumn({ name: 'id_estadistica' })
  id: number;

  @Column({ type: 'int', default: 0 })
  saques: number;

  @Column({ type: 'int', default: 0 }) 
  ataques: number;

  @Column({ type: 'int', default: 0 })
  bloqueos: number;

  @Column({ type: 'int', default: 0 })
  defensas: number;

  @Column({ type: 'int', default: 0 })
  puntos: number;

  @Column({ type: 'int', default: 0 })
  errores: number;

  @ManyToOne(() => Partido, partido => partido.estadisticas)
  partido: Partido;

  @ManyToOne(() => Deportista, deportista => deportista.estadisticas)
  deportista: Deportista;
}
