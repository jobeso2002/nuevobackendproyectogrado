import { Club } from '../../club/entities/club.entity';
import { Deportista } from '../../deportista/entities/deportista.entity';
import { Inscripcion } from '../../inscripcion/entities/inscripcion.entity';
import { Partido } from '../../partido/entities/partido.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EquipoDeportista } from './equipo-deportista.entity';

@Entity()
export class Equipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:false, unique: true, length: 100 })
  nombre: string;

  @Column({
    type: 'enum',
    enum: ['masculino', 'femenino', 'mixto'],
  })
  rama: string;

  @Column({
    type: 'enum',
    enum: ['sub-15', 'sub-17', 'sub-19', 'mayores'],
  })
  categoria: string;

  @Column({
    type: 'enum',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  estado: string;

  @ManyToOne(() => Club, club => club.equipos)
  club: Club;

  

  @OneToMany(() => Inscripcion, inscripcion => inscripcion.equipo)
  inscripciones: Inscripcion[];

  @OneToMany(() => Partido, partido => partido.equipoLocal)
  partidosLocal: Partido[];

  @OneToMany(() => Partido, partido => partido.equipoVisitante)
  partidosVisitante: Partido[];

  @OneToMany(() => EquipoDeportista, (equipoDeportista) => equipoDeportista.equipo)
  equipoDeportistas: EquipoDeportista[];
}
