import { Inscripcion } from '../../inscripcion/entities/inscripcion.entity';
import { Transferencia } from '../../transferencia/entities/transferencia.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Partido } from '../../partido/entities/partido.entity';
import { ClubDeportista } from './clubdeportista';

@Entity()
export class Club {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ name: 'fundacion', type: 'date' })
  fundacion: Date;

  @Column({ type: 'text', nullable: true })
  direccion: string;

  @Column({ length: 20, nullable: true })
  telefono: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 255, nullable: true })
  logo: string;

  @Column({
    type: 'enum',
    enum: ['masculino', 'femenino', 'mixto'],
  })
  categoria: string;

  @Column({
    type: 'enum',
    enum: ['sub-15', 'sub-17', 'sub-19', 'mayores', 'juvenil', 'infantil'],
  })
  rama: string;

  @Column({
    type: 'enum',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  estado: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.clubesResponsables)
  responsable: Usuario;

  @OneToMany(() => Inscripcion, (inscripcion) => inscripcion.club)
  inscripciones: Inscripcion[];

  @OneToMany(() => Transferencia, (transferencia) => transferencia.clubOrigen)
  transferenciasSalientes: Transferencia[];

  @OneToMany(() => Transferencia, (transferencia) => transferencia.clubDestino)
  transferenciasEntrantes: Transferencia[];

  @OneToMany(() => Partido, (partido) => partido.clubLocal)
  partidosLocal: Partido[];

  @OneToMany(() => Partido, (partido) => partido.clubVisitante)
  partidosVisitante: Partido[];

  @OneToMany(() => ClubDeportista, (clubDeportista) => clubDeportista.club)
  clubDeportistas: ClubDeportista[];
}
