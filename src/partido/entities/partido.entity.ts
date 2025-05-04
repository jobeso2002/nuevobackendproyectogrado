import { Equipo } from '../../equipo/entities/equipo.entity';
import { EstadisticaPartido } from '../../estadistica-partido/entities/estadistica-partido.entity';
import { Evento } from '../../evento/entities/evento.entity';
import { Resultado } from '../../resultado/entities/resultado.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import {
  Column,
  Entity,
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
    enum: ['programado', 'en_juego', 'finalizado', 'suspendido'],
    default: 'programado',
  })
  estado: string;

  @Column({ name: 'hora_inicio', type: 'timestamp', nullable: true })
  horaInicio?: Date;

  @Column({ name: 'hora_fin', type: 'timestamp', nullable: true })
  horaFin?: Date;

  @ManyToOne(() => Evento, (evento) => evento.partidos)
  evento: Evento;

  @ManyToOne(() => Equipo, (equipo) => equipo.partidosLocal)
  equipoLocal: Equipo;

  @ManyToOne(() => Equipo, (equipo) => equipo.partidosVisitante)
  equipoVisitante: Equipo;

  @ManyToOne(() => Usuario, (usuario) => usuario.partidosArbitroPrincipal)
  arbitroPrincipal: Usuario;

  @ManyToOne(() => Usuario, (usuario) => usuario.partidosArbitroSecundario)
  arbitroSecundario: Usuario;

  @OneToOne(() => Resultado, (resultado) => resultado.partido)
  resultado: Resultado;

  @OneToMany(() => EstadisticaPartido, (estadistica) => estadistica.partido)
  estadisticas: EstadisticaPartido[];
}
