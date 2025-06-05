import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Club } from './club.entity';
import { Deportista } from '../../deportista/entities/deportista.entity';

@Entity('club_deportista')
@Index(['id_club', 'id_deportista'], { unique: true })
export class ClubDeportista {
    @PrimaryGeneratedColumn({ name: 'id_club_deportista' })
    id: number;

    @Column({ name: 'id_club' })
    id_club: number;

    @Column({ name: 'id_deportista' })
    id_deportista: number;

    @Column({ type: 'date', name: 'fecha_ingreso' })
    fechaIngreso: Date;

    @Column({
        type: 'enum',
        enum: ['activo', 'inactivo'],
        default: 'activo',  
    })
    estado: string;

    @ManyToOne(() => Club, (club) => club.clubDeportistas)
    @JoinColumn({ name: 'id_club' })
    club: Club;

    @ManyToOne(() => Deportista, (deportista) => deportista.clubDeportistas)
    @JoinColumn({ name: 'id_deportista' })
    deportista: Deportista;
}