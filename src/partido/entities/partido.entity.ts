import { Club } from '../../club/entities/club.entity';
import { EstadisticaPartido } from '../../estadistica-partido/entities/estadistica-partido.entity';
import { Evento } from '../../evento/entities/evento.entity';
import { Resultado } from '../../resultado/entities/resultado.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Partido {
  @PrimaryGeneratedColumn({ name: 'id_partido' })
  id: number;

  @Column({ name: 'fecha_hora', type: 'timestamp' })
  fechaHora: Date;

  @Column({ length: 255, nullable: true })
  ubicacion: string;

  @Column({
    type: 'enum',
    enum: ['programado', 'en_juego', 'finalizado', 'cancelado'],
    default: 'programado',
  })
  estado: string;

  @Column({ name: 'hora_inicio', type: 'timestamp', nullable: true })
  horaInicio?: Date;

  @Column({ name: 'hora_fin', type: 'timestamp', nullable: true })
  horaFin?: Date;

  @Column({ length: 255, nullable: true })
  motivoCancelacion?: string;

  @ManyToOne(() => Evento, (evento) => evento.partidos)
  evento: Evento;

  @ManyToOne(() => Usuario, (usuario) => usuario.partidosArbitroPrincipal)
  arbitroPrincipal: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.partidosArbitroSecundario)
  arbitroSecundario: Usuario;

  @OneToOne(() => Resultado, (resultado) => resultado.partido, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'id_resultado' })
  resultado: Resultado;

  @OneToMany(() => EstadisticaPartido, (estadistica) => estadistica.partido)
  estadisticas: EstadisticaPartido[];

  @ManyToOne(() => Club, (club) => club.partidosLocal)
  clubLocal: Club;

  @ManyToOne(() => Club, (club) => club.partidosVisitante)
  clubVisitante: Club;
}
