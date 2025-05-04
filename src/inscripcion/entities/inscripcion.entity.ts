import { Equipo } from '../../equipo/entities/equipo.entity';
import { Evento } from '../../evento/entities/evento.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Inscripcion {
  @PrimaryGeneratedColumn({ name: 'id_inscripcion' })
  id: number;

  @Column({
    name: 'fecha_inscripcion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaInscripcion: Date;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'aprobada', 'rechazada'],
    default: 'pendiente',
  })
  estado: string;

  @ManyToOne(() => Evento, evento => evento.inscripciones)
  evento: Evento;

  @ManyToOne(() => Equipo, equipo => equipo.inscripciones)
  equipo: Equipo;

  @ManyToOne(() => Usuario, usuario => usuario.inscripcionesRegistradas)
  usuarioRegistra: Usuario;

  // Nuevos campos:
  @ManyToOne(() => Usuario, (usuario) => usuario.inscripcionesAprobadas, { nullable: true })
  usuarioAprueba?: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.inscripcionesRechazadas, { nullable: true })
  usuarioRechaza?: Usuario;

  @Column({ type: 'timestamp', nullable: true })
  fechaAprobacion?: Date;

  @Column({ type: 'timestamp', nullable: true })
  fechaRechazo?: Date;
}
