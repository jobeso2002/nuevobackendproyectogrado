import { Equipo } from "../../equipo/entities/equipo.entity";
import { Transferencia } from "../../transferencia/entities/transferencia.entity";
import { Usuario } from "../../usuario/entities/usuario.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
    enum: ['activo', 'inactivo'],
    default: 'activo'
  })
  estado: string;

  @ManyToOne(() => Usuario, usuario => usuario.clubesResponsables)
  responsable: Usuario;

  @OneToMany(() => Equipo, equipo => equipo.club)
  equipos: Equipo[];

  @OneToMany(() => Transferencia, transferencia => transferencia.clubOrigen)
  transferenciasSalientes: Transferencia[];

  @OneToMany(() => Transferencia, transferencia => transferencia.clubDestino)
  transferenciasEntrantes: Transferencia[];
}
