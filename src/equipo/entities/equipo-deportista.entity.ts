// src/equipo/entities/equipo-deportista.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Equipo } from './equipo.entity';
import { Deportista } from '../../deportista/entities/deportista.entity';

@Entity('equipo_deportista')
@Index(['idEquipo', 'idDeportista'], { unique: true })// Evita duplicados
export class EquipoDeportista {
  @PrimaryGeneratedColumn({ name: 'id_equipo_deportista' })
  id: number;

  @Column({ name: 'id_equipo' })
  idEquipo: number;

  @Column({ name: 'id_deportista' })
  idDeportista: number;

  @Column({ type: 'date', name: 'fecha_ingreso' })
  fechaIngreso: Date;

  @Column({
    type: 'enum',
    enum: ['activo', 'inactivo'],
    default: 'activo',  
  })
  estado: string;

  // Relación con Equipo
  @ManyToOne(() => Equipo, (equipo) => equipo.equipoDeportistas)
  @JoinColumn({ name: 'id_equipo' })
  equipo: Equipo;

  // Relación con Deportista
  @ManyToOne(() => Deportista, (deportista) => deportista.equipoDeportistas)
  @JoinColumn({ name: 'id_deportista' })
  deportista: Deportista;
}