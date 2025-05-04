import { Club } from '../../club/entities/club.entity';
import { Deportista } from '../../deportista/entities/deportista.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Transferencia {
  @PrimaryGeneratedColumn({ name: 'id_transferencia' })
  id: number;

  @Column({ name: 'fecha_transferencia', type: 'date' })
  fechaTransferencia: Date;

  @Column({ type: 'text', nullable: true })
  motivo: string;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'aprobada', 'rechazada'],
    default: 'pendiente',
  })
  estado: string;

  @ManyToOne(() => Deportista, (deportista) => deportista.transferencias)
  deportista: Deportista;

  @ManyToOne(() => Club, (club) => club.transferenciasSalientes)
  clubOrigen: Club;

  @ManyToOne(() => Club, (club) => club.transferenciasEntrantes)
  clubDestino: Club;

  @ManyToOne(() => Usuario, (usuario) => usuario.transferenciasRegistradas)
  usuarioRegistra: Usuario;

   // Nuevos campos:
   @ManyToOne(() => Usuario, (usuario) => usuario.transferenciasAprobadas, { nullable: true })
   usuarioAprueba?: Usuario;
 
   @ManyToOne(() => Usuario, (usuario) => usuario.transferenciasRechazadas, { nullable: true })
   usuarioRechaza?: Usuario;
 
   @Column({ name: 'fecha_aprobacion', type: 'timestamp', nullable: true })
   fechaAprobacion?: Date;
 
   @Column({ name: 'fecha_rechazo', type: 'timestamp', nullable: true })
   fechaRechazo?: Date;
}
