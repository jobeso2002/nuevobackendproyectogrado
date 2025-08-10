import { Contacto } from '../../contacto/entities/contacto.entity';
import { EstadisticaPartido } from '../../estadistica-partido/entities/estadistica-partido.entity';
import { Transferencia } from '../../transferencia/entities/transferencia.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ClubDeportista } from '../../club/entities/clubdeportista';

@Entity()
export class Deportista {
  @PrimaryGeneratedColumn({ name: 'id_deportista' })
  id: number;

  @Column({ length: 100 })
  primer_nombre: string;

  @Column({ length: 100 })
  segundo_nombre: string;

  @Column({ length: 100 })
  primer_apellido: string;

  @Column({ length: 100 })
  segundo_apellido: string;

  @Column({ name: 'fecha_nacimiento', type: 'date' })
  fechaNacimiento: Date;

  @Column({
    type: 'enum',
    enum: ['masculino', 'femenino'],
  })
  genero: string;

  @Column({ name: 'documento_identidad', length: 20, unique: true })
  documentoIdentidad: string;

  @Column({
    name: 'tipo_documento',
    type: 'enum',
    enum: ['cedula', 'tarjeta_identidad', 'pasaporte'],
  })
  tipoDocumento: string;

  @Column({ length: 255, nullable: true })
  foto: string;

  @Column({ length: 255, nullable: true })
  documentoIdentidadPdf: string;

  @Column({ length: 255, nullable: true })
  registroCivilPdf: string;

  @Column({ length: 255, nullable: true })
  afiliacionPdf: string;

  @Column({ length: 255, nullable: true })
  certificadoEpsPdf: string;

  @Column({ length: 255, nullable: true })
  permisoResponsablePdf: string;

  @Column({
    name: 'tipo_sangre',
    type: 'enum',
    enum: ['A+', 'A-', 'B+', 'B-','AB+','AB-','O+','O-'],
    nullable: false,
  })
  tipo_sangre: string;

  @Column({ length: 20, nullable: false })
  telefono: string;

  @Column({ length: 100, nullable: false, unique: false })
  email: string;

  @Column({ type: 'text', nullable: false })
  direccion: string;

  @Column({
    type: 'enum',
    enum: ['activo', 'inactivo'],
    default: 'activo',
  })
  estado: string;

  @Column({
    type: 'enum',
    enum: ['armador', 'central', 'punta', 'libero', 'opuesto'],
    nullable: false,
  })
  posicion: string;

  @Column({ nullable: true })
  numero_camiseta: number;

  @OneToMany(() => Contacto, (contacto) => contacto.deportista)
  contactos: Contacto[];

  @OneToMany(() => Transferencia, (transferencia) => transferencia.deportista)
  transferencias: Transferencia[];

  @OneToMany(() => EstadisticaPartido, (estadistica) => estadistica.deportista)
  estadisticas: EstadisticaPartido[];

  @OneToMany(() => ClubDeportista, (clubDeportista) => clubDeportista.deportista)
  clubDeportistas: ClubDeportista[];
}
