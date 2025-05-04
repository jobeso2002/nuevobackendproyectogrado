import { Inscripcion } from '../../inscripcion/entities/inscripcion.entity';
import { Partido } from '../../partido/entities/partido.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Evento {
  @PrimaryGeneratedColumn({ name: 'id_evento' })
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'fecha_fin', type: 'date' })
  fechaFin: Date;

  @Column({
    type: 'enum',
    enum: ['torneo', 'amistoso', 'clasificatorio', 'championship'],
  })
  tipo: string;

  @Column({ length: 255, nullable: true })
  ubicacion: string;

  @Column({
    type: 'enum',
    enum: ['planificado', 'en_curso', 'finalizado', 'cancelado'],
    default: 'planificado',
  })
  estado: string;

  @ManyToOne(() => Usuario, usuario => usuario.eventosOrganizados)
  organizador: Usuario;

  @OneToMany(() => Inscripcion, inscripcion => inscripcion.evento)
  inscripciones: Inscripcion[];

  @OneToMany(() => Partido, partido => partido.evento)
  partidos: Partido[];

  @Column({ name: 'fecha_inicio_real', type: 'timestamp', nullable: true })
  fechaInicioReal?: Date;

  @Column({ name: 'fecha_fin_real', type: 'timestamp', nullable: true })
  fechaFinReal?: Date;
}
