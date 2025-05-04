import { Club } from '../../club/entities/club.entity';
import { Role } from '../../roles/entities/role.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Evento } from '../../evento/entities/evento.entity';
import { Partido } from '../../partido/entities/partido.entity';
import { Transferencia } from 'src/transferencia/entities/transferencia.entity';
import { Inscripcion } from 'src/inscripcion/entities/inscripcion.entity';
import { Resultado } from 'src/resultado/entities/resultado.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, length: 100 })
  username: string;

  @Column({ nullable: false, unique: true, length: 100 })
  email: string;

  @Column({ nullable: false })
  password: string;

  @ManyToOne(() => Role, (role) => role.usuarios)
  role: Role;

  @OneToMany(() => Club, (club) => club.responsable)
  clubesResponsables: Club[];

  @OneToMany(() => Evento, (evento) => evento.organizador)
  eventosOrganizados: Evento[];

  @OneToMany(() => Partido, (partido) => partido.arbitroPrincipal)
  partidosArbitroPrincipal: Partido[];

  @OneToMany(() => Partido, (partido) => partido.arbitroSecundario)
  partidosArbitroSecundario: Partido[];

  @OneToMany(
    () => Transferencia,
    (transferencia) => transferencia.usuarioRegistra,
  )
  transferenciasRegistradas: Transferencia[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.usuarioRegistra)
  inscripcionesRegistradas: Inscripcion[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.usuarioAprueba)
  inscripcionesAprobadas: Inscripcion[];

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.usuarioRechaza)
  inscripcionesRechazadas: Inscripcion[];

  @OneToMany(() => Resultado, (resultado) => resultado.usuarioRegistra)
  resultadosRegistrados: Resultado[];

  @OneToMany(
    () => Transferencia,
    (transferencia) => transferencia.usuarioAprueba,
  )
  transferenciasAprobadas: Transferencia[];

  @OneToMany(
    () => Transferencia,
    (transferencia) => transferencia.usuarioRechaza,
  )
  transferenciasRechazadas: Transferencia[];
}
