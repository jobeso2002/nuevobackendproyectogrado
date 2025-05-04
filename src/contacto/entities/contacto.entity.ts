import { Deportista } from "../../deportista/entities/deportista.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Contacto {
    @PrimaryGeneratedColumn({ name: 'id_contacto' })
  id: number;

  @Column({ length: 100 })
  nombres: string;

  @Column({ length: 100 })
  apellidos: string;

  @Column({ length: 50 })
  parentesco: string;

  @Column({ length: 20 })
  telefono: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  direccion: string;
  
  @Column({ name: 'es_contacto_emergencia', type: 'boolean', default: false })
  esContactoEmergencia: boolean

  @ManyToOne(() => Deportista, deportista => deportista.contactos)
  deportista: Deportista;
}
