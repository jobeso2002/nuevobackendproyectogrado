import { EquipoDeportista } from '../../equipo/entities/equipo-deportista.entity';
import { Contacto } from '../../contacto/entities/contacto.entity';
import { Equipo } from '../../equipo/entities/equipo.entity';
import { EstadisticaPartido } from '../../estadistica-partido/entities/estadistica-partido.entity';
import { Transferencia } from '../../transferencia/entities/transferencia.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  

  @OneToMany(() => Contacto, contacto => contacto.deportista)
  contactos: Contacto[];

  @OneToMany(() => Transferencia, transferencia => transferencia.deportista)
  transferencias: Transferencia[];

  @OneToMany(() => EstadisticaPartido, estadistica => estadistica.deportista)
  estadisticas: EstadisticaPartido[];

  @OneToMany(() => EquipoDeportista, (equipoDeportista) => equipoDeportista.deportista)
  equipoDeportistas: EquipoDeportista[];
}
